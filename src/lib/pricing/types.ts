/**
 * Shared pricing types.
 *
 * Deliberately free of any catalog import: the client bundle must never contain
 * price-catalog.json, because that file carries cost_price, our purchase prices.
 * Client components import from here; only server code imports ./engine.
 */

export type BarConcept = "classic" | "signature" | "nitro" | "highball";
export type FoodOption = "none" | "fingerfood" | "flyingBuffet";
export type EventKind = "corporate" | "messe" | "launch" | "team" | "networking";

export interface EventConfig {
  kind: EventKind;
  guests: number;
  hours: number;
  drinksPerGuest: number;
  concept: BarConcept;
  food: FoodOption;
  softDrinks: boolean;
}

export type LineGroup = "drinks" | "food" | "staff" | "equipment" | "logistics";

export interface PublicLineItem {
  number: string;
  label: string;
  qty: number;
  unitLabel: string;
  /** Net unit price in cents, after volume discount. */
  unitPrice: number;
  total: number;
  group: LineGroup;
}

export interface Staffing {
  barkeepers: number;
  bars: number;
  barBacks: number;
  serviceStaff: number;
  staffHours: number;
}

/** What the browser is allowed to see, no cost or margin data. */
export interface PublicQuote {
  items: PublicLineItem[];
  net: number;
  vat: number;
  gross: number;
  netPerGuest: number;
  drinkDiscount: number;
  notes: string[];
  blockers: string[];
  staffing: Staffing;
}

export const GROUP_LABELS: Record<LineGroup, string> = {
  drinks: "Getränke",
  food: "Food",
  staff: "Personal",
  equipment: "Equipment",
  logistics: "Logistik & Transport",
};

// ── Paketmodell (Dionys-kompatibel) ──

export type PriceType = "person" | "once" | "hour" | "onConsumption" | "none";
/** Steuert nur die Anzeige: "ab 36 €", "36 €", "auf Anfrage". */
export type PricingLabel = "from" | "exact" | "onRequest";
export type PackageCategory = "drinks" | "food" | "experience" | "equipment";

export interface PackagePriceRule {
  /** JS-Konvention: 0 = Sonntag. null = gilt an allen Tagen. */
  weekdays: number[] | null;
  minPersons: number | null;
  maxPersons: number | null;
  /** Netto in Cent. */
  price: number;
  priceType: PriceType;
  pricingLabel: PricingLabel;
}

/** Ein Paket ohne Kostendaten, sicher für den Client. */
export interface PublicPackage {
  key: string;
  title: string;
  description: string;
  category: PackageCategory;
  price: number;
  priceType: PriceType;
  pricingLabel: PricingLabel;
  minPersons: number | null;
  maxPersons: number | null;
  minQuantityPercent: number | null;
  isRecommended: boolean;
  isUpsell: boolean;
  autoBooking: boolean;
  pricings: PackagePriceRule[];
  /** Erstes Motiv aus /public/images/catering, null bei reinen Zusatzleistungen. */
  image: string | null;
  /** Tailwind object-position, damit der Bildausschnitt sitzt. */
  imagePosition: string;
  /** Was drin ist, in Verkaufssprache. */
  highlights: string[];
}

/** Eine Zeile im Angebot des Wizards. Enthält bewusst keine Kostendaten. */
export interface QuoteLine {
  key: string;
  title: string;
  qty: number;
  unitLabel: string;
  unitPrice: number;
  total: number;
  /** Automatisch ergänzt, etwa die Grundpauschale. */
  auto: boolean;
}

export interface PackageQuote {
  lines: QuoteLine[];
  net: number;
  vat: number;
  gross: number;
  netPerGuest: number;
  weekday: number;
  weekdayLabel: string;
  notes: string[];
  blockers: string[];
}

/** Bar-Pakete sind Alternativen, alles andere ist frei kombinierbar. */
export const BAR_PACKAGE_KEYS = ["bar-essentials", "bar-nitro", "bar-premium", "bar-unlimited"] as const;

export const PACKAGE_CATEGORY_LABELS: Record<PackageCategory, string> = {
  drinks: "Getränke",
  food: "Food",
  experience: "Erlebnis",
  equipment: "Zusatzleistungen",
};

export const PRICE_TYPE_SUFFIX: Record<PriceType, string> = {
  person: "pro Gast",
  once: "pauschal",
  hour: "pro Stunde",
  onConsumption: "nach Verbrauch",
  none: "",
};

export function formatEuro(cents: number): string {
  return (cents / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
}

export function formatEuroExact(cents: number): string {
  return (cents / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" });
}
