import model from "@/data/dionys-cocktail-x.json";
import { packageCost } from "./internalCosts";
import type { PricingLabel, PriceType, PublicPackage, PackagePriceRule } from "./types";

/**
 * SERVER ONLY.
 *
 * dionys-cocktail-x.json carries an `_internal` block with purchase prices and margin
 * notes. Never import this module from a client component. Use `publicPackages()` and
 * pass the result down as props.
 */

interface RawPricing {
  weekdays?: number[];
  minPersons?: number | null;
  maxPersons?: number | null;
  price: string;
  priceType: string;
  pricingLabel: string;
}

interface RawPackage {
  key: string;
  title: string;
  description: string;
  packageCategory: string;
  subCategories: string[];
  price: string;
  priceType: string;
  pricingLabel: string;
  minPersons?: number | null;
  maxPersons?: number | null;
  minQuantityPercent?: number | null;
  sortOrder: number;
  isRecommended?: boolean;
  autoBooking?: boolean;
  autoBookingExcludePackageIds?: string[];
  isUpsell?: boolean;
  upsellTriggerPackageIds?: string[] | null;
  packagePricings?: RawPricing[];
  images?: string[];
  imagePosition?: string;
  highlights?: string[];
  _internal?: unknown;
}

const toCents = (decimal: string) => Math.round(Number(decimal) * 100);

function rule(r: RawPricing): PackagePriceRule {
  return {
    weekdays: r.weekdays ?? null,
    minPersons: r.minPersons ?? null,
    maxPersons: r.maxPersons ?? null,
    price: toCents(r.price),
    priceType: r.priceType as PriceType,
    pricingLabel: r.pricingLabel as PricingLabel,
  };
}

/** Strips `_internal` and converts decimal strings to integer cents. */
export function publicPackages(): PublicPackage[] {
  return (model.eventPackages as RawPackage[])
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((p) => ({
      key: p.key,
      title: p.title,
      description: p.description,
      category: (p.subCategories?.[0] ?? p.packageCategory) as PublicPackage["category"],
      price: toCents(p.price),
      priceType: p.priceType as PriceType,
      pricingLabel: p.pricingLabel as PricingLabel,
      minPersons: p.minPersons ?? null,
      maxPersons: p.maxPersons ?? null,
      minQuantityPercent: p.minQuantityPercent ?? null,
      isRecommended: p.isRecommended ?? false,
      isUpsell: p.isUpsell ?? false,
      autoBooking: p.autoBooking ?? false,
      pricings: (p.packagePricings ?? []).map(rule),
      image: p.images?.[0] ?? null,
      imagePosition: p.imagePosition ?? "object-center",
      highlights: p.highlights ?? [],
    }));
}

/**
 * Cost in cents for a selection. SERVER ONLY — never expose the result to the client.
 *
 * Die Kosten kommen aus der gitignorierten dionys-cocktail-x.internal.json. Fehlt sie,
 * liefert das 0 und die aufrufende Stelle überspringt die Margenprüfung.
 */
export function internalCostFor(key: string, guests: number, hours: number): number {
  const i = packageCost(key);
  if (!i) return 0;
  if (i.costByTier) {
    return i.costByTier.find((t) => guests <= t.maxPersons)?.fixedCost ?? 0;
  }
  const perHour = i.costPerHour ?? i.estimatedCostPerHour;
  if (perHour) return perHour * hours;
  return (i.costPerPerson ?? 0) * guests + (i.fixedCost ?? i.estimatedCost ?? 0);
}

/** Packages whose presence suppresses the auto-booked base fee. */
export function baseFeeExclusions(): string[] {
  const base = (model.eventPackages as RawPackage[]).find((p) => p.key === "base-fee");
  return base?.autoBookingExcludePackageIds ?? [];
}

/**
 * Resolves the price for a weekday and guest count. First matching rule wins, falling
 * back to the package base price. Weekdays follow the JS convention, 0 = Sunday.
 */
export function resolvePrice(
  pkg: PublicPackage,
  weekday: number,
  guests: number,
): { price: number; priceType: PriceType; pricingLabel: PricingLabel } {
  const match = pkg.pricings.find(
    (r) =>
      (r.weekdays === null || r.weekdays.includes(weekday)) &&
      (r.minPersons === null || guests >= r.minPersons) &&
      (r.maxPersons === null || guests <= r.maxPersons),
  );
  return match ?? { price: pkg.price, priceType: pkg.priceType, pricingLabel: pkg.pricingLabel };
}

/** Distinct weekday price variants, for showing a Mon-Thu / Fri-Sat / Sun ladder. */
export function weekdayVariants(pkg: PublicPackage): { label: string; price: number }[] {
  const groups: { label: string; weekday: number }[] = [
    { label: "Mo bis Do", weekday: 3 },
    { label: "Fr & Sa", weekday: 6 },
    { label: "Sonntag", weekday: 0 },
  ];
  const seen = new Set<number>();
  const out: { label: string; price: number }[] = [];
  for (const g of groups) {
    const { price } = resolvePrice(pkg, g.weekday, pkg.minPersons ?? 100);
    if (!seen.has(price)) {
      seen.add(price);
      out.push({ label: g.label, price });
    }
  }
  // A single price across all days needs no ladder.
  return out.length > 1 ? out : [];
}
