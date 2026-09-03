/**
 * Auswertung der Verkaeufe. Reine Funktionen, keine Netzaufrufe.
 *
 * Getrennt vom Abruf, damit sich die Rechnung ohne Stripe-Zugang testen laesst
 * und damit klar bleibt, wo eine Zahl herkommt. Die Fragen, die dieses
 * Dashboard beantworten soll, kann Stripe strukturell nicht beantworten: Es
 * kennt unsere Kanal-Tags nicht, unsere Kontingente nicht und den Stichtag
 * am 15. Oktober nicht.
 *
 * DER VERTRAG MIT DEM SHOP
 *
 * Alles haengt daran, dass der Shop bei jeder Zahlung Metadaten mitschickt.
 * Ohne sie kann dieses Dashboard Umsatz zeigen, aber nicht beantworten, wo er
 * herkam. Erwartet werden auf der Zahlung (PaymentIntent oder Checkout
 * Session, beides wird gelesen):
 *
 *   product   single | crew | doubleSeason
 *   tier      early | regular      oeffentliche Stufe zum Kaufzeitpunkt
 *   channel   public | crm | student | drop | bar
 *   windowId  Kennung des Preisfensters, falls ein Code verwendet wurde
 *   channelRef  freies Feld, bei Bar-Codes die Bar-Kennung
 *
 * Fehlen sie, landet der Kauf unter "ohne Angabe". Das ist Absicht: Eine
 * stille Einsortierung unter "public" wuerde die Auswertung faelschen und
 * niemand wuerde es merken.
 */

/* Die Zeitrechnung liegt bereits im Projekt. Eine zweite Fassung hier waere
   die sicherste Art, dass Dashboard und Preisumstellung an verschiedenen
   Tagen umspringen. */
import { berlinWallClockToTimestamp as berlinWallClock } from "@/lib/time/berlin";
import type { Channel, PriceTier, ProductKey } from "@/lib/tickets/types";

/* ── Eingangsformat ─────────────────────────────────────────────────── */

/** Was wir aus einer Stripe-Zahlung brauchen, mehr nicht. */
export interface Sale {
  id: string;
  /** Betrag in Cent, wie Stripe ihn fuehrt. */
  amountCents: number;
  currency: string;
  /** Sekunden seit 1970, wie Stripe es liefert. */
  created: number;
  /** true, wenn tatsaechlich Geld geflossen ist. */
  paid: boolean;
  refundedCents: number;
  metadata: Record<string, string | undefined>;
}

export interface Bucket {
  key: string;
  label: string;
  count: number;
  netCents: number;
}

export interface Report {
  /** Zeitraum, auf den sich alles bezieht. */
  from: number;
  to: number;
  count: number;
  grossCents: number;
  refundedCents: number;
  netCents: number;
  byProduct: Bucket[];
  byTier: Bucket[];
  byChannel: Bucket[];
  /** Nur Kaeufe mit Bar-Code, aufgeschluesselt nach Bar. */
  byBar: Bucket[];
  /** Anteil der Kaeufe ohne verwertbare Metadaten, 0 bis 1. */
  untaggedShare: number;
}

/* ── Beschriftungen ─────────────────────────────────────────────────── */

const PRODUCT_LABEL: Record<string, string> = {
  single: "ON ICE Pass",
  crew: "Crew Pass",
  doubleSeason: "Double Season",
};

const TIER_LABEL: Record<string, string> = {
  early: "Early Bird",
  regular: "Regulär",
};

const CHANNEL_LABEL: Record<string, string> = {
  public: "Öffentlich",
  crm: "CRM und Newsletter",
  student: "Studierende",
  drop: "Drops",
  bar: "Bar-Codes",
};

const OHNE_ANGABE = "Ohne Angabe";

/** Fuer Stellen, die einen einzelnen Wert beschriften, etwa eine Liste. */
export function produktLabel(key?: string): string {
  // Kein Strich als Platzhalter: Im Projekt sind Geviertstriche ueberall
  // untersagt, und "ohne Angabe" sagt ausserdem, was fehlt.
  return key ? (PRODUCT_LABEL[key] ?? key) : "ohne Angabe";
}
export function kanalLabel(key?: string): string {
  return key ? (CHANNEL_LABEL[key] ?? key) : "";
}

/* ── Hilfen ─────────────────────────────────────────────────────────── */

function netOf(s: Sale): number {
  return Math.max(0, s.amountCents - s.refundedCents);
}

/**
 * Gruppiert und sortiert nach Umsatz.
 *
 * Der Eimer "Ohne Angabe" bleibt immer am Ende stehen, auch wenn er gross
 * ist: Er ist kein Kanal, sondern ein Hinweis auf fehlende Metadaten.
 */
function group(sales: Sale[], pick: (s: Sale) => string | undefined, labels: Record<string, string>): Bucket[] {
  const map = new Map<string, Bucket>();

  for (const s of sales) {
    const raw = pick(s);
    const key = raw && raw.trim() ? raw.trim() : "__none";
    const label = key === "__none" ? OHNE_ANGABE : (labels[key] ?? key);
    const b = map.get(key) ?? { key, label, count: 0, netCents: 0 };
    b.count += 1;
    b.netCents += netOf(s);
    map.set(key, b);
  }

  const out = Array.from(map.values());
  out.sort((a, b) => {
    if (a.key === "__none") return 1;
    if (b.key === "__none") return -1;
    return b.netCents - a.netCents;
  });
  return out;
}

/* ── Bericht ────────────────────────────────────────────────────────── */

export function buildReport(sales: Sale[], from: number, to: number): Report {
  const bezahlt = sales.filter((s) => s.paid);

  const grossCents = bezahlt.reduce((n, s) => n + s.amountCents, 0);
  const refundedCents = bezahlt.reduce((n, s) => n + s.refundedCents, 0);

  const ohneTag = bezahlt.filter((s) => !s.metadata.channel && !s.metadata.product).length;

  return {
    from,
    to,
    count: bezahlt.length,
    grossCents,
    refundedCents,
    netCents: grossCents - refundedCents,
    byProduct: group(bezahlt, (s) => s.metadata.product, PRODUCT_LABEL),
    byTier: group(bezahlt, (s) => s.metadata.tier, TIER_LABEL),
    byChannel: group(bezahlt, (s) => s.metadata.channel, CHANNEL_LABEL),
    byBar: group(
      bezahlt.filter((s) => s.metadata.channel === "bar"),
      (s) => s.metadata.channelRef,
      {},
    ),
    untaggedShare: bezahlt.length ? ohneTag / bezahlt.length : 0,
  };
}

/** Filtert auf einen Zeitraum, Grenzen in Sekunden, `to` ausschliessend. */
export function inRange(sales: Sale[], from: number, to: number): Sale[] {
  return sales.filter((s) => s.created >= from && s.created < to);
}

/* ── Kontingente ────────────────────────────────────────────────────── */

export interface QuotaRow {
  key: string;
  label: string;
  used: number;
  total: number | null;
}

/**
 * Wie voll ist ein Kontingent?
 *
 * Gezaehlt wird gegen die Fenster-Kennung aus den Metadaten, nicht gegen den
 * Kanal: Ein Kanal kann mehrere Fenster haben, etwa mehrere Drops
 * hintereinander, und die duerfen sich nicht gegenseitig auffuellen.
 */
export function quotaUsage(
  sales: Sale[],
  windows: { id: string; label: string; quota: number | null }[],
): QuotaRow[] {
  const bezahlt = sales.filter((s) => s.paid);
  return windows.map((w) => ({
    key: w.id,
    label: w.label,
    used: bezahlt.filter((s) => s.metadata.windowId === w.id).length,
    total: w.quota,
  }));
}

/* ── Darstellung ────────────────────────────────────────────────────── */

export function euro(cents: number): string {
  return (cents / 100).toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  });
}

/** Tagesgrenze in Berliner Zeit, als Sekunden. Fuer "heute" und "gestern". */
export function berlinDayStart(at: Date, offsetDays = 0): number {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(at);
  const [y, m, d] = parts.split("-").map(Number);
  // Ueber die gemeinsame Zeitrechnung, damit Dashboard und Preisumstellung
  // denselben Tageswechsel benutzen.
  return Math.floor(berlinWallClock(y, m, d + offsetDays) / 1000);
}

export type { Channel, PriceTier, ProductKey };

/* ── Verlauf und Tempo ──────────────────────────────────────────────── */

export interface Day {
  /** Tagesbeginn in Berliner Zeit, Sekunden seit 1970. */
  start: number;
  count: number;
  netCents: number;
}

/**
 * Kaeufe pro Tag, aeltester Tag zuerst, letzter Eintrag ist der laufende Tag.
 *
 * Die Tagesgrenzen kommen aus der Kalenderrechnung und nicht aus einer Addition
 * von 86400 Sekunden. An den beiden Umstellungstagen im Jahr hat ein Tag 23
 * oder 25 Stunden, und eine feste Schrittweite verschiebt danach jede
 * Tagesgrenze um eine Stunde.
 */
export function dailySeries(sales: Sale[], anchor: Date, days: number): Day[] {
  const grenzen: number[] = [];
  for (let i = days - 1; i >= 0; i--) grenzen.push(berlinDayStart(anchor, -i));
  grenzen.push(berlinDayStart(anchor, 1));

  const out: Day[] = grenzen.slice(0, -1).map((start) => ({ start, count: 0, netCents: 0 }));

  // Ein Durchlauf ueber die sortierten Kaeufe statt einer Schleife je Tag.
  const bezahlt = sales.filter((s) => s.paid).sort((a, b) => a.created - b.created);
  let tag = 0;
  for (const s of bezahlt) {
    if (s.created < grenzen[0]) continue;
    while (tag < out.length && s.created >= grenzen[tag + 1]) tag++;
    if (tag >= out.length) break;
    out[tag].count += 1;
    out[tag].netCents += netOf(s);
  }
  return out;
}

export interface Pace {
  /** Paesse pro Tag im Betrachtungsfenster. */
  perDay: number;
  /** Verkaufte Paesse im Fenster. */
  window: number;
  /** Tage bis zum Stichtag, aufgerundet, nie negativ. */
  daysLeft: number;
  /** Erwartete zusaetzliche Paesse bis zum Stichtag, beim gemessenen Tempo. */
  expected: number;
  /** Veraenderung gegenueber dem gleich langen Zeitraum davor, null wenn nicht bestimmbar. */
  trend: number | null;
}

/**
 * Wie schnell laeuft der Verkauf, und was wird daraus bis zum Stichtag?
 *
 * Der laufende Tag zaehlt nicht mit. Er ist unvollstaendig und wuerde den
 * Schnitt am Vormittag nach unten ziehen, was jeden Morgen wie ein Einbruch
 * aussaehe.
 *
 * Die Hochrechnung ist eine gerade Verlaengerung des gemessenen Tempos, mehr
 * nicht. Vorverkaeufe ziehen vor einem Stichtag erfahrungsgemaess an, deshalb
 * ist die Zahl eher eine Untergrenze als eine Vorhersage. Sie steht hier, weil
 * die Frage "reicht das noch" sonst gar nicht beantwortet wird, nicht weil sie
 * genau waere.
 *
 * @param series  Tagesreihe, aeltester Tag zuerst, letzter Eintrag heute.
 * @param fenster Wie viele vollstaendige Tage das aktuelle Tempo bestimmen.
 */
export function pace(series: Day[], fenster: number, jetztMs: number, stichtagMs: number): Pace {
  const vollstaendig = series.slice(0, -1);
  const aktuell = vollstaendig.slice(-fenster);
  const vorher = vollstaendig.slice(-2 * fenster, -fenster);

  const summe = (d: Day[]) => d.reduce((n, t) => n + t.count, 0);
  const jetztSumme = summe(aktuell);
  const vorherSumme = summe(vorher);

  const perDay = aktuell.length ? jetztSumme / aktuell.length : 0;
  const daysLeft = Math.max(0, Math.ceil((stichtagMs - jetztMs) / 86_400_000));

  return {
    perDay,
    window: jetztSumme,
    daysLeft,
    expected: Math.round(perDay * daysLeft),
    // Ohne gleich langen Vergleichszeitraum oder ohne Kaeufe darin waere jede
    // Prozentzahl erfunden.
    trend: vorher.length === fenster && vorherSumme > 0 ? (jetztSumme - vorherSumme) / vorherSumme : null,
  };
}
