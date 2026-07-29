import * as A from "./assumptions";
import { POS, VAT_PERCENT, costOf, position, type CatalogPosition } from "./catalog";
import { hasCostData } from "./internalCosts";
import type { BarConcept, EventConfig, FoodOption, LineGroup, PublicQuote, Staffing } from "./types";

export type { BarConcept, EventConfig, FoodOption, EventKind } from "./types";

export interface LineItem {
  number: string;
  label: string;
  qty: number;
  unitLabel: string;
  /** Net unit price in cents, after any volume discount. */
  unitPrice: number;
  /** qty * unitPrice, cents. */
  total: number;
  /** Internal — never rendered to the customer. */
  cost: number;
  group: LineGroup;
}

export interface Quote {
  items: LineItem[];
  /** Net total in cents. */
  net: number;
  vat: number;
  gross: number;
  /** Net per guest, cents — the number corporate buyers actually compare. */
  netPerGuest: number;
  /** Internal margin figures, stripped before anything reaches the client. */
  internal: { cost: number; margin: number; marginPercent: number };
  /** Discount applied to drink positions, 0–1. */
  drinkDiscount: number;
  /** Operational consequences worth telling the customer about. */
  notes: string[];
  /** Reasons the configurator must not show a price. */
  blockers: string[];
  staffing: Staffing;
}

const CONCEPT_POSITION: Record<BarConcept, string> = {
  classic: POS.cocktail,
  signature: POS.signatureCocktail,
  nitro: POS.nitroCocktail,
  highball: POS.highball,
};

const FOOD_POSITION: Record<Exclude<FoodOption, "none">, string> = {
  fingerfood: POS.fingerfood,
  flyingBuffet: POS.flyingBuffet,
};

function drinkDiscountFor(guests: number): number {
  return A.DRINK_VOLUME_DISCOUNT.find((t) => guests >= t.fromGuests)?.discount ?? 0;
}

/** Rounds to whole cents — half-up, so the customer total and the invoice agree. */
function applyDiscount(cents: number, discount: number): number {
  return Math.round(cents * (1 - discount));
}

export function calculateQuote(config: EventConfig): Quote {
  const { guests, hours, drinksPerGuest, concept, food, softDrinks } = config;

  const blockers: string[] = [];
  if (guests < A.LIMITS.minGuests) blockers.push("minGuests");
  if (guests > A.LIMITS.maxGuests) blockers.push("maxGuests");
  if (hours < A.LIMITS.minHours) blockers.push("minHours");
  if (hours > A.LIMITS.maxHours) blockers.push("maxHours");

  const items: LineItem[] = [];
  const notes: string[] = [];
  const discount = drinkDiscountFor(guests);

  const push = (
    pos: CatalogPosition,
    qty: number,
    unitLabel: string,
    group: LineItem["group"],
    discounted = false,
  ) => {
    if (qty <= 0) return;
    const unitPrice = discounted ? applyDiscount(pos.salePrice, discount) : pos.salePrice;
    items.push({
      number: pos.number,
      label: pos.description,
      qty,
      unitLabel,
      unitPrice,
      total: unitPrice * qty,
      cost: costOf(pos.number) * qty,
      group,
    });
  };

  // ── Staffing: sized by whichever binds harder — throughput or guest coverage ──
  const totalDrinks = guests * drinksPerGuest;
  const throughput = A.THROUGHPUT_PER_BARKEEPER_HOUR[concept];
  const byThroughput = Math.ceil(totalDrinks / (throughput * hours));
  const byGuests = Math.ceil(guests / A.GUESTS_PER_BARKEEPER);
  const barkeepers = Math.max(1, byThroughput, byGuests);
  const bars = Math.ceil(barkeepers / A.BARKEEPERS_PER_BAR);
  const staffHours = hours + A.SETUP_TEARDOWN_HOURS;
  const barBacks = guests >= A.BAR_BACK_FROM_GUESTS ? Math.ceil(barkeepers / A.BARKEEPERS_PER_BAR) : 0;
  const serviceStaff = food === "none" ? 0 : Math.ceil(guests / A.GUESTS_PER_SERVICE_STAFF);

  // ── Drinks ──
  push(position(CONCEPT_POSITION[concept]), totalDrinks, "Drink", "drinks", true);
  if (softDrinks) {
    const packages = Math.ceil(hours / A.SOFT_DRINK_PACKAGE_HOURS);
    push(position(POS.softDrinks), guests * packages, "Gast", "drinks", true);
  }

  // ── Food ──
  if (food !== "none") push(position(FOOD_POSITION[food]), guests, "Gast", "food");

  // ── Staff ──
  push(position(POS.barkeeper), barkeepers * staffHours, "Std.", "staff");
  push(position(POS.barBack), barBacks * staffHours, "Std.", "staff");
  push(position(POS.serviceStaff), serviceStaff * staffHours, "Std.", "staff");
  if (guests >= A.PROJECT_LEAD_FROM_GUESTS || hours > A.PROJECT_LEAD_FROM_HOURS) {
    push(position(POS.projectLead), 1, "Tag", "staff");
  }

  // ── Equipment ──
  push(position(POS.barEquipment), barkeepers, "Barkeeper", "equipment");
  push(position(POS.bohEquipment), Math.ceil(guests / 50), "je 50 Gäste", "equipment");
  push(position(POS.glassware), guests, "Gast", "equipment");

  // ── Logistics ──
  push(position(POS.logistics), A.LOGISTICS_CREW * A.LOGISTICS_HOURS, "Std.", "logistics");
  if (guests >= A.LOGISTICS_LEAD_FROM_GUESTS) {
    push(position(POS.logisticsLead), A.LOGISTICS_HOURS, "Std.", "logistics");
  }
  push(
    position(POS.transport),
    guests >= A.SECOND_TRANSPORT_FROM_GUESTS ? 2 : 1,
    "Pauschal",
    "logistics",
  );
  if (guests >= A.COOLING_TRUCK_FROM_GUESTS) push(position(POS.coolingTruck), 1, "Pauschal", "logistics");

  // ── Totals ──
  const net = items.reduce((sum, i) => sum + i.total, 0);
  const cost = items.reduce((sum, i) => sum + i.cost, 0);
  const margin = net - cost;
  const marginPercent = net > 0 ? margin / net : 0;
  const vat = Math.round(net * (VAT_PERCENT / 100));

  // Ohne Kostendaten (Produktion) gibt es keine Marge zu prüfen. Dann darf die
  // Schwelle auch nicht greifen, sonst würde jede Konfiguration blockiert.
  if (hasCostData && marginPercent < A.MARGIN_FLOOR) blockers.push("marginFloor");

  // ── Operational feedback the customer benefits from seeing ──
  if (bars > 1) {
    notes.push(
      `Bei ${guests} Gästen und ${drinksPerGuest} Drinks pro Person werden ${bars} Bar-Einheiten mit ${barkeepers} Barkeepern aufgebaut, damit keine Wartezeiten entstehen.`,
    );
  }
  if (concept !== "nitro" && byThroughput > byGuests) {
    const nitroBarkeepers = Math.max(
      1,
      Math.ceil(totalDrinks / (A.THROUGHPUT_PER_BARKEEPER_HOUR.nitro * hours)),
      byGuests,
    );
    if (nitroBarkeepers < barkeepers) {
      notes.push(
        `Das Nitro-Setup schafft dieselbe Menge mit ${nitroBarkeepers} statt ${barkeepers} Barkeepern: spürbar günstiger und schneller an der Bar.`,
      );
    }
  }
  if (softDrinks && hours > A.SOFT_DRINK_PACKAGE_HOURS) {
    notes.push(
      `Die Getränkepauschale deckt ${A.SOFT_DRINK_PACKAGE_HOURS} Stunden ab. Bei ${hours} Stunden sind zwei Einheiten kalkuliert.`,
    );
  }
  if (discount > 0) {
    notes.push(`Ab ${guests} Gästen sind ${Math.round(discount * 100)}% Mengenrabatt auf alle Getränke enthalten.`);
  }

  return {
    items,
    net,
    vat,
    gross: net + vat,
    netPerGuest: guests > 0 ? Math.round(net / guests) : 0,
    internal: { cost, margin, marginPercent },
    drinkDiscount: discount,
    notes,
    blockers,
    staffing: { barkeepers, bars, barBacks, serviceStaff, staffHours },
  };
}

/** True when the margin is thin enough that sales should look at it before it goes out. */
export function needsReview(quote: Quote): boolean {
  return hasCostData && quote.internal.marginPercent < A.MARGIN_WARN_BELOW;
}

/** Strips internal cost data — use this for anything that crosses to the client. */
export function publicQuote(quote: Quote): PublicQuote {
  const { internal: _internal, ...rest } = quote;
  return { ...rest, items: rest.items.map(({ cost: _cost, ...i }) => i) };
}
