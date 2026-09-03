/**
 * Tests fuer das Laden der Verkaeufe: Zusammenfuehrung der Metadaten,
 * Zwischenspeicher und der Rueckfall auf Demodaten. Kein Aufruf geht ins
 * Netz, fetch wird ersetzt.
 */

import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import { loadSales, salesCacheLeeren } from "./sales.ts";

const charge = (over: Record<string, unknown> = {}) => ({
  id: "ch_1",
  amount: 3900,
  amount_refunded: 0,
  currency: "eur",
  created: 1_700_000_000,
  paid: true,
  status: "succeeded",
  refunded: false,
  metadata: {},
  payment_intent: null,
  billing_details: { email: "gast@beispiel.de", name: "Gast" },
  receipt_url: "https://pay.stripe.com/receipts/x",
  ...over,
});

describe("Verkaeufe laden", () => {
  const echtesFetch = globalThis.fetch;
  const echterKey = process.env.STRIPE_SECRET_KEY;
  let aufrufe = 0;

  const stub = (data: unknown[]) => {
    aufrufe = 0;
    globalThis.fetch = (async () => {
      aufrufe++;
      return {
        ok: true,
        status: 200,
        json: async () => ({ object: "list", data, has_more: false }),
      } as Response;
    }) as typeof fetch;
  };

  beforeEach(() => {
    process.env.STRIPE_SECRET_KEY = "sk_test_beispiel";
    salesCacheLeeren();
  });

  afterEach(() => {
    globalThis.fetch = echtesFetch;
    if (echterKey === undefined) delete process.env.STRIPE_SECRET_KEY;
    else process.env.STRIPE_SECRET_KEY = echterKey;
    salesCacheLeeren();
  });

  it("fuehrt Metadaten von Zahlung und PaymentIntent zusammen, Zahlung gewinnt", async () => {
    stub([
      charge({
        metadata: { channel: "bar" },
        payment_intent: { id: "pi_1", metadata: { channel: "public", product: "single" } },
      }),
    ]);
    const r = await loadSales(1_600_000_000);
    // Jede Zeitscheibe liefert im Stub dieselbe Antwort, deshalb reicht der erste Treffer.
    assert.equal(r.demo, false);
    assert.equal(r.sales[0].metadata.channel, "bar");
    assert.equal(r.sales[0].metadata.product, "single");
    assert.equal(r.sales[0].email, "gast@beispiel.de");
  });

  it("beantwortet den zweiten Aufruf aus dem Zwischenspeicher", async () => {
    stub([charge()]);
    const a = await loadSales(1_600_000_000);
    const danach = aufrufe;
    const b = await loadSales(1_600_000_000);
    assert.equal(aufrufe, danach);
    assert.equal(a, b);
  });

  it("laedt nach dem Leeren des Zwischenspeichers neu", async () => {
    stub([charge()]);
    await loadSales(1_600_000_000);
    const danach = aufrufe;
    salesCacheLeeren();
    await loadSales(1_600_000_000);
    assert.ok(aufrufe > danach);
  });

  it("unterscheidet Zeitraeume im Zwischenspeicher", async () => {
    stub([charge()]);
    await loadSales(1_600_000_000);
    const danach = aufrufe;
    await loadSales(1_500_000_000);
    assert.ok(aufrufe > danach);
  });

  it("faellt bei einem Fehler auf Demodaten zurueck und sagt warum", async () => {
    globalThis.fetch = (async () =>
      ({
        ok: false,
        status: 401,
        json: async () => ({ error: { message: "Invalid API Key provided" } }),
      }) as Response) as typeof fetch;
    const r = await loadSales(1_600_000_000);
    assert.equal(r.demo, true);
    assert.match(r.error ?? "", /Invalid API Key/);
    assert.equal(r.vollstaendig, true);
  });

  it("zaehlt eine gescheiterte Zahlung nicht als bezahlt", async () => {
    stub([charge({ paid: true, status: "failed" })]);
    const r = await loadSales(1_600_000_000);
    assert.equal(r.sales[0].paid, false);
  });
});
