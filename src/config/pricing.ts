/**
 * COCKTAIL X ON ICE '26, einzige Preisquelle.
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
  dateLabel: "17. bis 28. November 2026",
  /** Ab hier werden die Bars enthuellt. */
  barsRevealDate: "2026-08-24",
  barsRevealLabel: "24. August",
} as const;

/* ── Zeitzone ───────────────────────────────────────────────────────────
   Der Umschaltzeitpunkt ist als Wanduhrzeit in Europe/Berlin definiert.
   Serverzeit und Besucherzeitzone spielen keine Rolle.

   Die Rechnung selbst liegt in src/lib/time/berlin.ts, weil das Ticketmodul
   dieselbe braucht. Zwei Kopien waeren die sicherste Art, dass die Umstellung
   an einer Stelle eine Stunde frueher passiert als an der anderen.          */

export { berlinWallClockToTimestamp } from "@/lib/time/berlin";
import { berlinWallClockToTimestamp } from "@/lib/time/berlin";

/**
 * Early Bird gilt bis einschliesslich 15.10.2026 um 23:59 Berliner Zeit, der
 * regulaere Preis ab dem 16.10.2026 um 00:00. Als Grenze nehmen wir den Beginn
 * des 16. Oktober, damit zwischen 23:59 und 00:00 keine Luecke entsteht.
 *
 * Die Umstellung passiert serverseitig zur Laufzeit. Es gibt bewusst keinen
 * Schalter und kein Deployment dafuer: currentTier() vergleicht gegen diesen
 * Zeitstempel, und die Startseite laeuft mit dynamic = "force-dynamic".
 */
export const FULL_PRICE_STARTS_AT = berlinWallClockToTimestamp(2026, 10, 16, 0, 0);

/**
 * Die Frist stand vorher als Fliesstext in vier Dateien und lief beim
 * Verschieben auseinander. Jetzt haengen die Beschriftungen am selben Datum
 * wie die Umschaltung.
 */
export const EARLY_UNTIL_LABEL = "15. Oktober 2026";
export const EARLY_UNTIL_SHORT = "15.10.";
export const FULL_FROM_LABEL = "16. Oktober 2026";

/* ── Tarife ─────────────────────────────────────────────────────────────
   Oeffentlich existieren genau zwei Stufen. 49 EUR ist der Referenzpreis
   und wird oeffentlich nie unterboten, 39 EUR ist die Untergrenze im
   sichtbaren Shop.

   Die Code-Preise stehen NICHT in dieser Datei. Sie werden an den Browser
   ausgeliefert und waeren damit oeffentlich. Einloesung und Preisfindung
   fuer Codes laufen ausschliesslich serverseitig, siehe
   src/lib/tickets/redeem.ts und die dort referenzierte Konfiguration. */

export type TierKey = "early" | "full";

export const TIERS = {
  early: { key: "early", price: 39, label: "Early Bird" },
  full: { key: "full", price: 49, label: "Regulär" },
} as const satisfies Record<TierKey, { key: TierKey; price: number; label: string }>;

/** Referenzpreis fuer die Streichpreis-Darstellung. Immer der regulaere Tarif. */
export const REFERENCE_PRICE = TIERS.full.price;

/**
 * Crew Pass: vier Paesse, drei bezahlt.
 *
 * Die Vier stand vorher als Ziffer in der Preisformel, im Kartentext, im
 * Vergleichspreis und in der FAQ. Vier Orte fuer dieselbe Regel sind vier
 * Gelegenheiten, sie auseinanderlaufen zu lassen.
 */
export const CREW_SIZE = 4;
export const CREW_PAID = 3;

/** Ersparnis gegenueber dem Referenzpreis, in Euro und in Prozent. */
export const SAVING_EUR = TIERS.full.price - TIERS.early.price;
export const SAVING_PCT = Math.round((SAVING_EUR / TIERS.full.price) * 100);

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
  /** Kurzer Claim ueber der Beschreibung, drei bis fuenf Woerter. */
  claim?: string;
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
  /** Kein Preis, nur Anfrage. */
  requestOnly?: boolean;
}

/** Kontingent fuer Double Season. Wird im Text als Knappheit gezeigt. */
export const DOUBLE_SEASON_LIMIT = 300;

export const BUNDLES: Bundle[] = [
  {
    key: "crew",
    title: "Crew Pass",
    claim: "Deine Runde geht auf uns",
    promise: "Vier Pässe, drei bezahlt. Für alle, die ohnehin zusammen losziehen.",
    // Immer der dreifache Einzelpreis des jeweils gueltigen Tarifs. Damit
    // zieht der Crew Pass die Preisumstellung automatisch mit.
    price: { early: CREW_PAID * TIERS.early.price, full: CREW_PAID * TIERS.full.price },
    includes: [
      `${CREW_SIZE} Pässe für den Preis von ${CREW_PAID}`,
      "Alle 12 Nächte, alle Bars",
      "Vier personalisierbare Pässe, Zuweisung per Mail nach dem Kauf",
    ],
    terms: ["Maximal 2 Crew Passes pro Käufer", "Nicht mit anderen Angeboten kombinierbar"],
    featured: true,
  },
  {
    key: "doubleSeason",
    title: "Double Season",
    claim: "Zwei Festivals, ein Pass",
    promise: "ON ICE im November und das Sommerfestival 2027. Zwei Saisons, ein Kauf.",
    // Fester Preis in beiden Stufen. Das Angebot hat bewusst kein
    // Rabattfenster, damit es nicht mit dem Early Bird konkurriert.
    price: { early: 79, full: 79 },
    includes: ["Pass für ON ICE '26", "Pass für das Sommerfestival 2027", "Termin Sommer 2027 folgt rechtzeitig"],
    terms: [`Limitiert auf ${DOUBLE_SEASON_LIMIT} Stück`, "Preis gilt durchgehend, kein Rabattfenster"],
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

/* Hier stand der Einstiegspreis des Sommerfestivals als Anker fuer Double
   Season. Er ist raus, aus zwei Gruenden: Er wurde nirgends benutzt, und
   diese Datei wird von Client-Komponenten importiert und landet damit im
   Browser-Bundle. Ein Preis unterhalb der oeffentlichen Untergrenze darf
   dort nicht auftauchen, auch nicht ungenutzt. */

/* ── Belegte Zahlen aus dem Sommer ──────────────────────────────────── */

export const SUMMER_PROOF = {
  guests: 3200,
  bars: 65,
  press: ["SZ", "Abendzeitung", "Falstaff", "Charivari"],
} as const;
