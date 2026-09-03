/**
 * Duenner Zugriff auf die Stripe-REST-Schnittstelle. Nur serverseitig.
 *
 * Bewusst ohne die offizielle Bibliothek. Wir brauchen vier Listenabrufe und
 * kein Objektmodell, und eine Abhaengigkeit, die bei jedem Aufruf mitgezogen
 * wird, waere fuer ein internes Dashboard schlechter Tausch.
 *
 * Der Schluessel steht in STRIPE_SECRET_KEY. Ein eingeschraenkter Schluessel
 * (rk_live_...) funktioniert genauso wie ein voller (sk_live_...), das Modul
 * unterscheidet nicht. Fehlt er, liefert hasStripe() false und das Dashboard
 * zeigt Demodaten, statt mit einem Fehler abzubrechen: Ein Werkzeug, das ohne
 * Zugang gar nichts zeigt, kann man auch nicht einrichten.
 */

const BASE = "https://api.stripe.com/v1";

export function stripeKey(): string | null {
  const k = process.env.STRIPE_SECRET_KEY?.trim();
  return k ? k : null;
}

export function hasStripe(): boolean {
  return stripeKey() !== null;
}

export class StripeError extends Error {
  readonly status: number;
  readonly code?: string;

  /* Ausgeschrieben statt als Parameter-Eigenschaft: Letztere ist eine der
     wenigen TypeScript-Formen, die Code erzeugt statt nur Typen, und laesst
     sich deshalb nicht wegstreichen. Der Testrunner von Node streicht aber
     nur weg, und dieses Modul soll ohne Buendler testbar bleiben. */
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "StripeError";
    this.status = status;
    this.code = code;
  }
}

/**
 * Baut die Abfrage im Format, das Stripe erwartet.
 *
 * Stripe nimmt keine JSON-Parameter entgegen, sondern Formularschreibweise mit
 * eckigen Klammern fuer Verschachtelung: created[gte]=123, expand[]=data.foo.
 * Wer hier naiv JSON.stringify einsetzt, bekommt eine leere Antwort statt
 * eines Fehlers, und sucht lange.
 */
export function toQuery(params: Record<string, unknown>, prefix = ""): string[] {
  const out: string[] = [];
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    const name = prefix ? `${prefix}[${key}]` : key;
    if (Array.isArray(value)) {
      for (const v of value) out.push(`${encodeURIComponent(`${name}[]`)}=${encodeURIComponent(String(v))}`);
    } else if (typeof value === "object") {
      out.push(...toQuery(value as Record<string, unknown>, name));
    } else {
      out.push(`${encodeURIComponent(name)}=${encodeURIComponent(String(value))}`);
    }
  }
  return out;
}

async function request<T>(path: string, params: Record<string, unknown> = {}): Promise<T> {
  const key = stripeKey();
  if (!key) throw new StripeError("STRIPE_SECRET_KEY fehlt", 0);

  const query = toQuery(params).join("&");
  const url = `${BASE}${path}${query ? `?${query}` : ""}`;

  /* Ein Versuch mehr, dann ehrlich scheitern.

     Gemessen: Eine 100er-Seite mit expand braucht hier normal um die fuenf
     Sekunden, einzelne Ausreisser deutlich mehr. Ohne Wiederholung reisst
     ein einziger Ausreisser den gesamten Abruf ab, die Seite faellt auf
     Demodaten zurueck und speichert nichts, und der naechste Aufruf laedt
     wieder von vorn. Genau so entstand aus einer langsamen Antwort eine
     Seite, die angeblich nicht laedt. */
  try {
    return await einVersuch<T>(url, key);
  } catch (err) {
    // Ein abgelehnter Schluessel oder eine kaputte Anfrage bleiben abgelehnt,
    // da bringt Wiederholen nichts. Zeitueberschreitung, Netz und 5xx schon.
    if (err instanceof StripeError && err.status > 0 && err.status < 500) throw err;
    await new Promise((r) => setTimeout(r, 500));
    return einVersuch<T>(url, key);
  }
}

async function einVersuch<T>(url: string, key: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${key}`,
      // Version festnageln, damit ein Wechsel im Konto nicht still das
      // Antwortformat aendert und die Auswertung schief zieht.
      "Stripe-Version": "2024-06-20",
    },
    // Zahlen aus einem Kassensystem duerfen nie aus dem Zwischenspeicher kommen.
    cache: "no-store",
    // Ohne Frist haengt eine haengende Verbindung die ganze Seite auf.
    // Lieber nach 25 Sekunden ein ehrlicher Fehler samt Demohinweis. Nicht
    // knapper: Die Frist gilt je Anfrage, und eine normale Seite braucht
    // schon fuenf Sekunden.
    signal: AbortSignal.timeout(25_000),
  });

  const body = (await res.json()) as { error?: { message?: string; code?: string } };
  if (!res.ok) {
    const msg = body?.error?.message ?? `Stripe antwortete mit ${res.status}`;
    throw new StripeError(msg, res.status, body?.error?.code);
  }
  return body as T;
}

interface StripeList<T> {
  object: "list";
  data: T[];
  has_more: boolean;
}

export interface ListErgebnis<T> {
  items: T[];
  /**
   * false, wenn die Obergrenze erreicht wurde und Stripe noch mehr hatte.
   * Der Aufrufer MUSS das anzeigen: Eine still abgeschnittene Liste ist
   * eine falsche Summe, und falsche Summen faellt niemandem auf.
   */
  vollstaendig: boolean;
}

/**
 * Holt eine ganze Liste, ueber Seitengrenzen hinweg.
 *
 * Die Obergrenze ist Absicht. Ohne sie laeuft ein Dashboard-Aufruf im
 * schlimmsten Fall durch Zehntausende Zahlungen und blockiert die Seite.
 * Wer mehr braucht, holt mit stripeListZeitraum mehrere Zeitscheiben
 * parallel, statt die Grenze hochzudrehen.
 */
export async function stripeList<T extends { id: string }>(
  path: string,
  params: Record<string, unknown> = {},
  maxItems = 1000,
): Promise<ListErgebnis<T>> {
  const out: T[] = [];
  let startingAfter: string | undefined;

  while (out.length < maxItems) {
    const page = await request<StripeList<T>>(path, {
      ...params,
      limit: Math.min(100, maxItems - out.length),
      starting_after: startingAfter,
    });
    out.push(...page.data);
    if (!page.has_more || page.data.length === 0) return { items: out, vollstaendig: true };
    startingAfter = page.data[page.data.length - 1].id;
  }

  return { items: out, vollstaendig: false };
}

/**
 * Holt einen Zeitraum in Scheiben und die Scheiben parallel.
 *
 * Der Grund ist gemessen, nicht vermutet: Stripe blaettert nur der Reihe
 * nach, jede 100er-Seite kostet hier mehrere Sekunden, und 1300 Zahlungen
 * hiessen 40 Sekunden Ladezeit. Zeitscheiben lassen sich unabhaengig
 * voneinander holen, damit bestimmt die langsamste Scheibe die Wartezeit,
 * nicht die Summe aller Seiten.
 *
 * Grenzen: created >= von, created < bis, Scheiben lueckenlos und ohne
 * Ueberlappung, sonst fehlen Zahlungen oder zaehlen doppelt.
 */
export async function stripeListZeitraum<T extends { id: string; created: number }>(
  path: string,
  vonSek: number,
  bisSek: number,
  params: Record<string, unknown> = {},
  scheiben = 12,
  maxProScheibe = 1000,
): Promise<ListErgebnis<T>> {
  /* Die Scheiben werden zur Gegenwart hin schmaler, quadratisch statt
     gleich breit: Zahlungen haeufen sich in den juengsten Wochen, und bei
     gleicher Breite schleppt die neueste Scheibe die meisten Seiten und
     bestimmt allein die Wartezeit. */
  const spanne = bisSek - vonSek;
  const bereiche: [number, number][] = [];
  let vorher = vonSek;
  for (let i = 1; i <= scheiben; i++) {
    const anteil = (scheiben - i) / scheiben;
    const grenze = i === scheiben ? bisSek : Math.max(vorher + 1, Math.round(bisSek - spanne * anteil * anteil));
    if (grenze > vorher) bereiche.push([vorher, grenze]);
    vorher = grenze;
  }

  const teile = await Promise.all(
    bereiche.map(([gte, lt]) => stripeList<T>(path, { ...params, created: { gte, lt } }, maxProScheibe)),
  );

  return {
    items: teile
      .flatMap((t) => t.items)
      .sort((a, b) => b.created - a.created),
    vollstaendig: teile.every((t) => t.vollstaendig),
  };
}

export async function stripeGet<T>(path: string, params: Record<string, unknown> = {}): Promise<T> {
  return request<T>(path, params);
}
