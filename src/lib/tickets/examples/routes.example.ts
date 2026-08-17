/**
 * Vorlagen fuer die drei Endpunkte des Shops.
 *
 * Diese Datei liegt bewusst NICHT unter app/, sie wird also nicht ausgeliefert
 * und ist kein erreichbarer Endpunkt. Die Marketingseite soll keinen
 * Ticketverkauf anbieten, und ein offener Endpunkt mit einem Speicher, der nur
 * im Prozess lebt, waere schlimmer als keiner.
 *
 * Zum Uebernehmen: Inhalt in app/api/.../route.ts kopieren, den Speicher gegen
 * die echte Datenbank tauschen, fertig.
 *
 * Die Datei wird trotzdem typgeprueft. Das ist der Zweck: Die Vorlagen sollen
 * nicht beim ersten Einfuegen auseinanderfallen.
 */

import { loadPriceWindows } from "../config.ts";
import { commit, quote, release, reserve, type RedeemDeps } from "../redeem.ts";
import { createInMemoryStore, type TicketStore } from "../store.ts";
import { confirmVerification, startVerification, STUDENT_QUOTA } from "../students.ts";
import type { ProductKey } from "../types.ts";

/* ── Verdrahtung ────────────────────────────────────────────────────────
   Im Betrieb kommt hier die echte Datenbank herein, nicht der Speicher im
   Prozess. Der taugt nur lokal: Sobald zwei Instanzen laufen, zaehlt jede
   fuer sich, und das Kontingent wird doppelt vergeben.                     */

let store: TicketStore | null = null;
function getStore(): TicketStore {
  if (!store) store = createInMemoryStore();
  return store;
}

/**
 * Die oeffentliche Preistabelle kommt aus der Konfiguration der Anwendung,
 * nicht aus dem Modul. Im Shop bitte an die eigene Preisquelle haengen.
 */
const PRICES = {
  earlyEur: 39,
  regularEur: 49,
  // 16.10.2026 00:00 Berliner Zeit als absoluter Zeitstempel.
  regularStartsAt: Date.UTC(2026, 9, 15, 22, 0),
  crewSize: 4,
  crewPaid: 3,
  doubleSeasonEur: 79,
};

const PRODUCTS: ProductKey[] = ["single", "crew", "doubleSeason"];

function deps(now: number): RedeemDeps {
  return { store: getStore(), windows: loadPriceWindows(), prices: PRICES, now };
}

/* ── POST /api/tickets/quote ────────────────────────────────────────────
   Was kostet das gerade, gegebenenfalls mit Code. Verbraucht nichts.       */

export async function quoteRoute(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_body" }, 400);
  }

  const b = body as { product?: unknown; code?: unknown };
  const product = PRODUCTS.find((p) => p === b.product);
  if (!product) return json({ error: "unknown_product" }, 400);

  const code = typeof b.code === "string" ? b.code : null;
  const result = await quote(product, code, {
    ...deps(Date.now()),
    attemptKey: clientKey(request),
    allowAttempt: rateLimiter,
  });

  if (!result.ok) {
    // Nach aussen bleibt es bei einer Aussage: Der Code gilt nicht. Wer
    // unterscheiden kann zwischen unbekannt, verbraucht und Kontingent voll,
    // kann den Bestand abfragen.
    const status = result.reason === "rate_limited" ? 429 : 200;
    return json({ ok: false, codeAccepted: false }, status);
  }

  const r = result.resolution;
  return json({
    ok: true,
    codeAccepted: r.channel !== "public",
    product: r.product,
    amountEur: r.amountEur,
    referenceEur: r.referenceEur,
    currency: "EUR",
    vatIncluded: true,
    tier: r.tier,
    // Kanal und Fenster gehen NICHT an den Client. Sie stehen im
    // Kaufdatensatz, dort gehoeren sie hin.
  });
}

/* ── POST /api/tickets/checkout ─────────────────────────────────────────
   Belegen, zahlen, festschreiben. Der Preis wird hier neu ermittelt und
   nie aus der Anfrage uebernommen.                                        */

export async function checkoutRoute(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_body" }, 400);
  }

  const b = body as { product?: unknown; code?: unknown };
  const product = PRODUCTS.find((p) => p === b.product);
  if (!product) return json({ error: "unknown_product" }, 400);

  const code = typeof b.code === "string" ? b.code : null;
  const now = Date.now();
  const d = deps(now);

  const reserved = await reserve(product, code, d);
  if (!reserved.ok) return json({ ok: false, reason: "code_invalid" }, 200);

  try {
    // Hier die Zahlung anlegen, mit reserved.reservation.resolution.amountEur.
    // Niemals mit einem Betrag aus der Anfrage.
    const paymentUrl = await createPayment({
      amountEur: reserved.reservation.resolution.amountEur,
      reference: reserved.reservation.id,
    });

    // commit() gehoert eigentlich hinter die Zahlungsbestaetigung, also in den
    // Webhook. Hier steht es nur, damit die Vorlage vollstaendig ist.
    await commit(reserved.reservation, { store: d.store, now });

    return json({ ok: true, paymentUrl });
  } catch {
    // Ohne diese Freigabe verbrennt jeder Abbruch einen Code.
    await release(reserved.reservation, d);
    return json({ ok: false, reason: "payment_failed" }, 502);
  }
}

/* ── POST /api/students/verify ──────────────────────────────────────────
   Adresse pruefen, Bestaetigungsmail schicken.                            */

export async function studentVerifyRoute(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_body" }, 400);
  }

  const email = (body as { email?: unknown }).email;
  if (typeof email !== "string") return json({ error: "invalid_body" }, 400);

  const result = await startVerification(email, {
    store: getStore(),
    windowId: "student-2026",
    now: Date.now(),
    quota: STUDENT_QUOTA,
    attemptKey: clientKey(request),
    allowAttempt: rateLimiter,
  });

  if (!result.ok) {
    if (result.reason === "domain_not_allowed") {
      // Diese eine Ablehnung wird ehrlich benannt: Sie ist keine Information
      // ueber andere Nutzer, und ohne sie tippen Leute dreimal ihre private
      // Adresse ein und warten auf eine Mail, die nie kommt.
      return json({ ok: false, reason: "domain_not_allowed" }, 200);
    }
    if (result.reason === "rate_limited") return json({ ok: false }, 429);
    // already_verified und invalid_email sehen von aussen gleich aus wie
    // Erfolg, sonst laesst sich abfragen, wer schon einen Code hat.
    return json({ ok: true, sent: true }, 200);
  }

  await sendVerificationMail(email, result.token);
  return json({ ok: true, sent: true });
}

/* ── GET /api/students/confirm?token=… ──────────────────────────────────
   Link aus der Mail. Zeigt den Code oder setzt auf die Warteliste.        */

export async function studentConfirmRoute(request: Request): Promise<Response> {
  const token = new URL(request.url).searchParams.get("token");
  if (!token) return json({ error: "missing_token" }, 400);

  const result = await confirmVerification(token, {
    store: getStore(),
    windowId: "student-2026",
    now: Date.now(),
    quota: STUDENT_QUOTA,
  });

  if (!result.ok) return json({ ok: false, reason: result.reason }, 200);
  if (result.status === "waitlisted") {
    return json({ ok: true, status: "waitlisted", position: result.position });
  }
  return json({ ok: true, status: "code_issued", code: result.code });
}

/* ── Hilfen ─────────────────────────────────────────────────────────── */

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      // Preisantworten duerfen nirgends zwischengespeichert werden, sonst
      // ueberlebt der Einstiegspreis den Stichtag in irgendeinem Cache.
      "cache-control": "no-store",
    },
  });
}

/**
 * Kennung des Aufrufers fuer die Bremse.
 * Im Betrieb besser die IP aus dem Proxy-Header nehmen und mit dem
 * Tagesdatum salzen, damit daraus kein Bewegungsprofil wird.
 */
function clientKey(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unbekannt";
}

/* Die drei Platzhalter sind absichtlich nicht implementiert. Sie werfen,
   damit niemand die Vorlage uebernimmt und sich wundert, warum nichts
   ankommt. Die Signaturen stehen, damit der Rest typgeprueft bleibt. */

/** Bremse gegen das Durchprobieren von Codes. Im Betrieb ein echter Zaehler. */
async function rateLimiter(key: string): Promise<boolean> {
  void key;
  throw new Error("rateLimiter ist im Shop zu implementieren");
}

/** Legt die Zahlung an und gibt die Weiterleitung zurueck. */
async function createPayment(input: { amountEur: number; reference: string }): Promise<string> {
  void input;
  throw new Error("createPayment ist im Shop zu implementieren");
}

/** Verschickt den Bestaetigungslink. */
async function sendVerificationMail(email: string, token: string): Promise<void> {
  void email;
  void token;
  throw new Error("sendVerificationMail ist im Shop zu implementieren");
}
