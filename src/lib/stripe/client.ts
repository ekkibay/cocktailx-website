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

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${key}`,
      // Version festnageln, damit ein Wechsel im Konto nicht still das
      // Antwortformat aendert und die Auswertung schief zieht.
      "Stripe-Version": "2024-06-20",
    },
    // Zahlen aus einem Kassensystem duerfen nie aus dem Zwischenspeicher kommen.
    cache: "no-store",
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

/**
 * Holt eine ganze Liste, ueber Seitengrenzen hinweg.
 *
 * Die Obergrenze ist Absicht. Ohne sie laeuft ein Dashboard-Aufruf im
 * schlimmsten Fall durch Zehntausende Zahlungen und blockiert die Seite.
 * Wer mehr braucht, filtert enger, statt mehr zu holen.
 */
export async function stripeList<T extends { id: string }>(
  path: string,
  params: Record<string, unknown> = {},
  maxItems = 1000,
): Promise<T[]> {
  const out: T[] = [];
  let startingAfter: string | undefined;

  while (out.length < maxItems) {
    const page = await request<StripeList<T>>(path, {
      ...params,
      limit: Math.min(100, maxItems - out.length),
      starting_after: startingAfter,
    });
    out.push(...page.data);
    if (!page.has_more || page.data.length === 0) break;
    startingAfter = page.data[page.data.length - 1].id;
  }

  return out;
}

export async function stripeGet<T>(path: string, params: Record<string, unknown> = {}): Promise<T> {
  return request<T>(path, params);
}
