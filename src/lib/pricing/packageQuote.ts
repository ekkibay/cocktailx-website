import { LIMITS, MARGIN_FLOOR, MARGIN_WARN_BELOW } from "./assumptions";
import { baseFeeExclusions, internalCostFor, publicPackages, resolvePrice } from "./packages";
import { hasCostData } from "./internalCosts";
import { VAT_PERCENT } from "./catalog";
import type { PackageQuote, PublicPackage, QuoteLine } from "./types";

/**
 * SERVER ONLY. Prices a package selection from the wizard.
 *
 * Two things happen here that the client never sees: the margin is checked against the
 * easybill cost basis, and a selection below the floor is refused rather than quoted.
 */

export interface PackageSelection {
  occasion: string;
  /** ISO date. Null means no date picked yet, then we quote the Mon-Thu rate. */
  date: string | null;
  guests: number;
  hours: number;
  /** Exactly one bar package. */
  barPackage: string | null;
  /** Everything else, freely combinable. */
  extras: string[];
}

export type { QuoteLine, PackageQuote } from "./types";
export type PackageQuoteResult = PackageQuote;

const WEEKDAY_NAMES = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * Coerces untrusted wizard input into a valid selection. The client picks options,
 * never prices, so everything here is whitelisted against the package catalog.
 */
export function parseSelection(body: unknown): PackageSelection {
  const b = (body ?? {}) as Record<string, unknown>;
  const known = publicPackages().map((p) => p.key);
  const int = (v: unknown, fallback: number) => {
    const n = Math.round(Number(v));
    return Number.isFinite(n) ? n : fallback;
  };
  const date = typeof b.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(b.date) ? b.date : null;
  const bar = typeof b.barPackage === "string" && known.indexOf(b.barPackage) !== -1 ? b.barPackage : null;
  const extras = Array.isArray(b.extras)
    ? b.extras.filter(
        (k): k is string =>
          typeof k === "string" && known.indexOf(k) !== -1 && k !== bar && k !== "base-fee",
      )
    : [];

  return {
    occasion: typeof b.occasion === "string" ? b.occasion.slice(0, 60) : "",
    date,
    guests: clamp(int(b.guests, 150), LIMITS.minGuests, LIMITS.maxGuests),
    hours: clamp(int(b.hours, 4), LIMITS.minHours, LIMITS.maxHours),
    barPackage: bar,
    extras: extras.filter((k, i) => extras.indexOf(k) === i),
  };
}

/** Mon-Thu is the base rate, so an undated request is quoted on Wednesday. */
const DEFAULT_WEEKDAY = 3;

function parseWeekday(date: string | null): { weekday: number; dated: boolean } {
  if (!date) return { weekday: DEFAULT_WEEKDAY, dated: false };
  const d = new Date(`${date}T12:00:00`);
  if (Number.isNaN(d.getTime())) return { weekday: DEFAULT_WEEKDAY, dated: false };
  return { weekday: d.getDay(), dated: true };
}

function unitLabelFor(pkg: PublicPackage): string {
  switch (pkg.priceType) {
    case "person":
      return "pro Gast";
    case "hour":
      return "pro Stunde";
    case "once":
      return "pauschal";
    default:
      return "";
  }
}

function qtyFor(pkg: PublicPackage, guests: number, hours: number): number {
  switch (pkg.priceType) {
    case "person":
      return guests;
    case "hour":
      return hours;
    default:
      return 1;
  }
}

export function calculatePackageQuote(selection: PackageSelection): PackageQuoteResult {
  const { guests, hours } = selection;
  const all = publicPackages();
  const byKey = new Map(all.map((p) => [p.key, p]));

  const { weekday, dated } = parseWeekday(selection.date);
  const notes: string[] = [];
  const blockers: string[] = [];

  const selectedKeys = [selection.barPackage, ...selection.extras].filter(
    (k): k is string => typeof k === "string" && byKey.has(k),
  );

  // Ein Erlebnisformat traegt sich selbst, dann ist ein Bar-Paket nicht noetig.
  const experienceKeys = ["masterclass", "team-experience"];
  const hasExperience = selection.extras.some((k) => experienceKeys.includes(k));
  if (!selection.barPackage && !hasExperience) blockers.push("noSelection");

  // The base fee is auto-booked unless an experience package carries its own logistics.
  const exclusions = baseFeeExclusions();
  const suppressBaseFee = selectedKeys.some((k) => exclusions.includes(k));
  const keys = suppressBaseFee || selectedKeys.length === 0 ? selectedKeys : [...selectedKeys, "base-fee"];

  const lines: QuoteLine[] = [];

  for (const key of keys) {
    const pkg = byKey.get(key);
    if (!pkg) continue;

    const { price, pricingLabel } = resolvePrice(pkg, weekday, guests);
    if (pricingLabel === "onRequest") {
      blockers.push(`onRequest:${key}`);
      continue;
    }

    // Guest range is a hard constraint, not a hint.
    if (pkg.minPersons !== null && guests < pkg.minPersons) {
      blockers.push(`belowMin:${key}`);
      continue;
    }
    if (pkg.maxPersons !== null && guests > pkg.maxPersons) {
      blockers.push(`aboveMax:${key}`);
      continue;
    }

    const qty = qtyFor(pkg, guests, hours);
    lines.push({
      key,
      title: pkg.title,
      qty,
      unitLabel: unitLabelFor(pkg),
      unitPrice: price,
      total: price * qty,
      auto: key === "base-fee",
    });
  }

  // Wurde ein gewaehltes Paket abgelehnt, ist die ganze Zusammenstellung ungueltig.
  // Sonst blieben nur die automatischen Zeilen stehen und wir wuerden eine sinnlose
  // Summe ausgeben, die auch in der Anfrage-Mail landet.
  const rejected = blockers.some((b) => b.startsWith("belowMin:") || b.startsWith("aboveMax:") || b.startsWith("onRequest:"));
  if (rejected) lines.length = 0;

  const net = lines.reduce((s, l) => s + l.total, 0);
  const cost = lines.reduce((s, l) => s + internalCostFor(l.key, guests, hours), 0);
  const marginPercent = net > 0 ? (net - cost) / net : 0;

  // Ohne Kostendateien gibt es keine Marge zu prüfen, dann darf die Schwelle nicht
  // greifen. Sonst wäre in der Produktion jede Konfiguration blockiert.
  if (hasCostData && net > 0 && marginPercent < MARGIN_FLOOR) blockers.push("marginFloor");

  // ── Kundennutzen-Hinweise ──
  if (!dated) {
    notes.push(
      "Ohne Datum rechnen wir mit dem Preis für Montag bis Donnerstag. Freitag, Samstag und Sonntag liegen darüber.",
    );
  } else if (weekday === 5 || weekday === 6) {
    notes.push(
      `${WEEKDAY_NAMES[weekday]} ist ein Wochenendtermin, deshalb liegt der Preis pro Gast über dem Wochentarif. Montag bis Donnerstag wird es günstiger.`,
    );
  } else if (weekday === 0) {
    notes.push("Sonntagstermine tragen den höchsten Aufschlag, weil das Personal am schwersten planbar ist.");
  }

  if (selection.barPackage && selection.barPackage !== "bar-nitro" && guests >= 300) {
    notes.push(
      "Ab 300 Gästen empfehlen wir Bar Nitro: höherer Durchsatz, kürzere Wartezeit und pro Gast günstiger als Bar Premium.",
    );
  }

  const foodSelected = selection.extras.some((k) => k === "one-bites" || k === "flying-buffet");
  if (foodSelected) {
    notes.push("Bei Food planen wir Servicekräfte für die Ausgabe automatisch mit ein.");
  }

  if (suppressBaseFee) {
    notes.push("Anfahrt, Aufbau und Betreuung sind bei diesem Format bereits im Preis pro Person enthalten.");
  }

  return {
    lines,
    net,
    vat: Math.round(net * (VAT_PERCENT / 100)),
    gross: net + Math.round(net * (VAT_PERCENT / 100)),
    netPerGuest: guests > 0 ? Math.round(net / guests) : 0,
    weekday,
    weekdayLabel: dated ? WEEKDAY_NAMES[weekday] : "ohne Datum",
    notes,
    blockers,
  };
}

/** True when sales should look at the selection before it goes out. Server-side only. */
export function packageQuoteNeedsReview(selection: PackageSelection): boolean {
  const { guests, hours } = selection;
  const result = calculatePackageQuote(selection);
  if (!hasCostData || result.net === 0) return false;
  const cost = result.lines.reduce((s, l) => s + internalCostFor(l.key, guests, hours), 0);
  return (result.net - cost) / result.net < MARGIN_WARN_BELOW;
}
