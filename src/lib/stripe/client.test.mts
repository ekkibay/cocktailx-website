/**
 * Tests fuer den Zugriff auf Stripe.
 *
 * Der Grund fuer diese Tests: Faellt der Abruf aus, zeigt das Dashboard
 * Demodaten mit einem Hinweis, statt abzubrechen. Das ist im Betrieb richtig
 * und beim Suchen eines Fehlers unangenehm, weil eine falsch gebaute Abfrage
 * genauso aussieht wie ein fehlender Schluessel. Also wird hier geprueft,
 * bevor es echte Zahlen betrifft.
 *
 * Es geht nie eine Anfrage ins Netz: fetch wird ersetzt.
 */

import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import { StripeError, hasStripe, stripeList, toQuery } from "./client.ts";

/* ── Abfrageformat ──────────────────────────────────────────────────── */

describe("Abfrage", () => {
  const q = (p: Record<string, unknown>) => toQuery(p).join("&");

  it("schreibt Verschachtelung in eckigen Klammern, wie Stripe es erwartet", () => {
    // JSON waere hier still falsch: Stripe antwortet dann mit einer leeren
    // Liste statt mit einem Fehler.
    assert.equal(q({ created: { gte: 123 } }), "created%5Bgte%5D=123");
  });

  it("schreibt Listen mit leeren Klammern", () => {
    assert.equal(q({ expand: ["data.payment_intent"] }), "expand%5B%5D=data.payment_intent");
  });

  it("wiederholt den Namen bei mehreren Werten", () => {
    assert.equal(q({ expand: ["a", "b"] }), "expand%5B%5D=a&expand%5B%5D=b");
  });

  it("laesst undefined und null weg, statt sie als Wort zu senden", () => {
    // starting_after ist auf der ersten Seite undefined. Als Text gesendet
    // wuerde Stripe die ganze Anfrage ablehnen.
    assert.equal(q({ limit: 100, starting_after: undefined, ending_before: null }), "limit=100");
  });

  it("laesst die Null als Zahl stehen", () => {
    assert.equal(q({ limit: 0 }), "limit=0");
  });

  it("laesst false stehen", () => {
    assert.equal(q({ paid: false }), "paid=false");
  });

  it("maskiert Sonderzeichen im Wert", () => {
    assert.equal(q({ query: 'email:"a b"' }), "query=email%3A%22a%20b%22");
  });

  it("kommt mit mehreren Ebenen zurecht", () => {
    assert.equal(q({ a: { b: { c: 1 } } }), "a%5Bb%5D%5Bc%5D=1");
  });

  it("liefert bei leerer Eingabe nichts", () => {
    assert.deepEqual(toQuery({}), []);
  });
});

/* ── Seitenweiser Abruf ─────────────────────────────────────────────── */

describe("Listenabruf", () => {
  const echtesFetch = globalThis.fetch;
  const echterKey = process.env.STRIPE_SECRET_KEY;

  /** Merkt sich die aufgerufenen Adressen und antwortet der Reihe nach. */
  function stubFetch(antworten: unknown[]) {
    const urls: string[] = [];
    let i = 0;
    globalThis.fetch = (async (url: string | URL) => {
      urls.push(String(url));
      const body = antworten[Math.min(i++, antworten.length - 1)];
      return { ok: true, status: 200, json: async () => body } as Response;
    }) as typeof fetch;
    return urls;
  }

  const seite = (ids: string[], has_more: boolean) => ({
    object: "list",
    data: ids.map((id) => ({ id })),
    has_more,
  });

  beforeEach(() => {
    process.env.STRIPE_SECRET_KEY = "sk_test_beispiel";
  });

  afterEach(() => {
    globalThis.fetch = echtesFetch;
    if (echterKey === undefined) delete process.env.STRIPE_SECRET_KEY;
    else process.env.STRIPE_SECRET_KEY = echterKey;
  });

  it("gibt eine einzelne Seite zurueck", async () => {
    stubFetch([seite(["a", "b"], false)]);
    const out = await stripeList<{ id: string }>("/charges");
    assert.deepEqual(out.map((c) => c.id), ["a", "b"]);
  });

  it("holt die naechste Seite und setzt dabei am letzten Eintrag an", async () => {
    const urls = stubFetch([seite(["a", "b"], true), seite(["c"], false)]);
    const out = await stripeList<{ id: string }>("/charges");
    assert.deepEqual(out.map((c) => c.id), ["a", "b", "c"]);
    assert.ok(!urls[0].includes("starting_after"));
    assert.ok(urls[1].includes("starting_after=b"));
  });

  it("haelt bei der Obergrenze an und fordert nur den Rest an", async () => {
    // Ohne Obergrenze laeuft ein Seitenaufruf im schlimmsten Fall durch
    // Zehntausende Zahlungen.
    const urls = stubFetch([seite(["a", "b"], true)]);
    const out = await stripeList<{ id: string }>("/charges", {}, 2);
    assert.equal(out.length, 2);
    assert.equal(urls.length, 1);
    assert.ok(urls[0].includes("limit=2"));
  });

  it("bricht ab, wenn Stripe has_more meldet aber nichts liefert", async () => {
    // Sonst laeuft die Schleife endlos und die Seite haengt.
    stubFetch([seite([], true)]);
    const out = await stripeList<{ id: string }>("/charges");
    assert.deepEqual(out, []);
  });

  it("reicht die Parameter an jede Seite weiter", async () => {
    const urls = stubFetch([seite(["a"], true), seite(["b"], false)]);
    await stripeList<{ id: string }>("/charges", { created: { gte: 999 } });
    assert.ok(urls.every((u) => u.includes("created%5Bgte%5D=999")));
  });

  it("macht aus einer Fehlermeldung von Stripe einen StripeError mit Text", async () => {
    globalThis.fetch = (async () =>
      ({
        ok: false,
        status: 401,
        json: async () => ({ error: { message: "Invalid API Key provided", code: "api_key_invalid" } }),
      }) as Response) as typeof fetch;

    await assert.rejects(
      () => stripeList("/charges"),
      (err: unknown) => {
        assert.ok(err instanceof StripeError);
        assert.equal(err.status, 401);
        assert.equal(err.message, "Invalid API Key provided");
        assert.equal(err.code, "api_key_invalid");
        return true;
      },
    );
  });

  it("verlangt einen Schluessel, bevor es ueberhaupt losgeht", async () => {
    delete process.env.STRIPE_SECRET_KEY;
    assert.equal(hasStripe(), false);
    await assert.rejects(() => stripeList("/charges"), /STRIPE_SECRET_KEY fehlt/);
  });

  it("ignoriert einen Schluessel aus lauter Leerzeichen", async () => {
    process.env.STRIPE_SECRET_KEY = "   ";
    assert.equal(hasStripe(), false);
  });
});
