/**
 * COCKTAIL X ON ICE '26 — einzige Preisquelle.
 *
 * Nichts, was mit Preisen, Kontingenten oder Checkout-Zielen zu tun hat, gehoert
 * in eine Komponente. Alles hier. Der Wechsel von Early auf Full passiert
 * datumsgesteuert zur Laufzeit, es braucht dafuer kein Deployment.
 */

export const EVENT = {
  name: "COCKTAIL X ON ICE",
  edition: "'26",
  nights: 12,
  barsLabel: "40+",
  city: "München",
  /** 17.-28. November 2026 */
  start: "2026-11-17",
  end: "2026-11-28",
  dateLabel: "17.–28. November 2026",
  /** Ab hier werden die Bars enthuellt. */
  barsRevealDate: "2026-08-24",
  barsRevealLabel: "24. August",
} as const;

/* ── Zeitzone ───────────────────────────────────────────────────────────
   Der Umschaltzeitpunkt ist als Wanduhrzeit in Europe/Berlin definiert.
   Serverzeit und Besucherzeitzone spielen keine Rolle: Wir rechnen die
   Berliner Wanduhrzeit in einen absoluten Zeitpunkt um und vergleichen den.
   Das ist sommer- wie winterzeitfest, ohne zusaetzliche Bibliothek.        */

const TZ = "Europe/Berlin";

const BERLIN_PARTS = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  hour12: false,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

/**
 * Wie viele Millisekunden liegt Berlin zu diesem Zeitpunkt vor UTC?
 *
 * Bewusst ueber formatToParts statt ueber toLocaleString und new Date(string):
 * Letzteres parst den erzeugten String in der Zeitzone des ausfuehrenden
 * Rechners, wodurch das Ergebnis davon abhaengt, wo der Server steht.
 */
function berlinOffset(at: Date): number {
  const p: Record<string, string> = {};
  for (const part of BERLIN_PARTS.formatToParts(at)) p[part.type] = part.value;
  const asUtc = Date.UTC(
    Number(p.year),
    Number(p.month) - 1,
    Number(p.day),
    Number(p.hour) % 24,
    Number(p.minute),
    Number(p.second),
  );
  return asUtc - at.getTime();
}

/**
 * Wanduhrzeit in Europe/Berlin zu einem absoluten Zeitstempel (ms).
 * Zwei Durchlaeufe reichen, damit auch an Zeitumstellungstagen der richtige
 * Versatz gefunden wird.
 */
export function berlinWallClockToTimestamp(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
): number {
  const wall = Date.UTC(year, month - 1, day, hour, minute);
  let ts = wall - berlinOffset(new Date(wall));
  ts = wall - berlinOffset(new Date(ts));
  return ts;
}

/**
 * Early endet am 31.10.2026 um 23:59 Berliner Zeit, Full gilt ab dem
 * 01.11.2026 um 00:00. Als Grenze nehmen wir den Beginn des 1. November,
 * damit zwischen 23:59 und 00:00 keine Luecke entsteht.
 */
export const FULL_PRICE_STARTS_AT = berlinWallClockToTimestamp(2026, 11, 1, 0, 0);

/* ── Tarife ─────────────────────────────────────────────────────────── */

export type TierKey = "early" | "full";

export const TIERS = {
  early: { key: "early", price: 29, label: "Early" },
  full: { key: "full", price: 34, label: "Full" },
} as const satisfies Record<TierKey, { key: TierKey; price: number; label: string }>;

/** Welcher Tarif gilt zum Zeitpunkt `now`? */
export function currentTier(now: number = Date.now()): TierKey {
  return now >= FULL_PRICE_STARTS_AT ? "full" : "early";
}

export function currentPrice(now: number = Date.now()): number {
  return TIERS[currentTier(now)].price;
}

/** Volle Tage bis zur Umstellung. 0, sobald Full gilt. */
export function daysUntilFullPrice(now: number = Date.now()): number {
  const ms = FULL_PRICE_STARTS_AT - now;
  return ms <= 0 ? 0 : Math.ceil(ms / 86_400_000);
}

/* ── Bundles ────────────────────────────────────────────────────────── */

export interface Bundle {
  key: string;
  title: string;
  /** Ein Satz, der den Nutzen traegt. */
  promise: string;
  /** Preis je Tarif. */
  price: Record<TierKey, number>;
  /** Was drinsteckt, in Verkaufssprache. */
  includes: string[];
  /** Harte Bedingungen, die im Angebot stehen muessen. */
  terms: string[];
  /** Optisch fuehrend darstellen. */
  featured?: boolean;
  /** Nur bis zum Ende des Early-Zeitraums buchbar. */
  earlyOnly?: boolean;
  /** Kein Preis, nur Anfrage. */
  requestOnly?: boolean;
}

export const BUNDLES: Bundle[] = [
  {
    key: "crew",
    title: "Crew Pass",
    promise: "Vier Pässe, drei bezahlt. Für alle, die ohnehin zusammen losziehen.",
    price: { early: 87, full: 102 },
    includes: ["4 Pässe für den Preis von 3", "Alle 12 Nächte, alle Bars", "Sofort in der App verfügbar"],
    terms: ["Maximal 2 Crew Passes pro Käufer", "Nicht mit anderen Angeboten kombinierbar"],
    featured: true,
  },
  {
    key: "doubleSeason",
    title: "Double Season",
    promise: "ON ICE im November und das Sommerfestival 2027. Zwei Saisons, ein Kauf.",
    price: { early: 40, full: 40 },
    includes: ["Pass für ON ICE '26", "Pass für das Sommerfestival 2027", "Termin Sommer 2027 folgt rechtzeitig"],
    terms: ["Limitiert auf 300 Stück", "Nur bis 31. Oktober 2026 buchbar"],
    earlyOnly: true,
  },
  {
    key: "corporate",
    title: "Team Nights",
    promise: "Pässe fürs Team, eine Rechnung, kein Abrechnungschaos.",
    price: { early: 0, full: 0 },
    includes: ["10, 25 oder 50 Pässe", "Sammelrechnung auf die Firma", "Persönliche Ansprechpartnerin"],
    terms: ["Zum jeweils regulären Preis", "Anfrage per Mail, kein Direktkauf"],
    requestOnly: true,
  },
];

/** Kontingent fuer Double Season. Wird im Text als Knappheit gezeigt. */
export const DOUBLE_SEASON_LIMIT = 300;

/** Staffeln fuer /corporate. Preis ist immer der regulaere Tarif, keine Rabatte. */
export const CORPORATE_SIZES = [10, 25, 50] as const;

/* ── Checkout ───────────────────────────────────────────────────────── */

/**
 * Ziel aller Kauf-CTAs. Die produktspezifischen Deeplinks liefert New Bee
 * Mountain nach; bis dahin zeigen alle auf die Ticketseite. Sobald die URLs da
 * sind, hier eintragen, im Code muss dafuer nichts geaendert werden.
 */
export const CHECKOUT = {
  base: "https://cocktailx.app/de/tickets",
  single: "https://cocktailx.app/de/tickets",
  crew: "https://cocktailx.app/de/tickets",
  doubleSeason: "https://cocktailx.app/de/tickets",
} as const;

export const CONTACT_EMAIL = "info@cocktail-x.com";

/** Mailto fuer Team Nights, mit vorbereitetem Betreff. */
export function corporateMailto(size?: number): string {
  const subject = size ? `Team Nights ON ICE: ${size} Pässe` : "Team Nights ON ICE";
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

/* ── Sommerfestival 2027 ────────────────────────────────────────────── */

/** Einstiegspreis des Sommerfestivals. Anker fuer Double Season. */
export const SUMMER_2027_FROM = 24;

/* ── Belegte Zahlen aus dem Sommer ──────────────────────────────────── */

export const SUMMER_PROOF = {
  guests: 3200,
  bars: 65,
  press: ["SZ", "Abendzeitung", "Falstaff", "Charivari"],
} as const;
