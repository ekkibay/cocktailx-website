/**
 * Tests fuer die Zuordnung einer Zahlung zu ON ICE, Catering oder sonstigem.
 *
 * Jede Regel einzeln, dazu die Faelle, in denen zwei Regeln gegeneinander
 * stehen. Gerade die entscheiden, ob das Dashboard zu viel oder zu wenig
 * zaehlt, und genau die muessen festgeschrieben sein.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { Sale } from "./report.ts";
import { einordnen, passpreiseCent } from "./zuordnung.ts";

function zahlung(over: Partial<Sale> = {}): Sale {
  return {
    id: "ch_test",
    amountCents: 3900,
    refundedCents: 0,
    currency: "eur",
    created: 1_760_000_000,
    paid: true,
    metadata: {},
    ...over,
  };
}

/* ── Angaben des Shops ──────────────────────────────────────────────── */

describe("Zuordnung nach Angaben des Shops", () => {
  it("erkennt jedes Produkt des Vertrags als ON ICE, sicher", () => {
    for (const product of ["single", "crew", "doubleSeason"]) {
      const z = einordnen(zahlung({ metadata: { product } }));
      assert.equal(z.bereich, "onice", product);
      assert.equal(z.vermutet, false, product);
    }
  });

  it("die Produktangabe schlaegt alles, auch Catering im Text und fremden Betrag", () => {
    const z = einordnen(
      zahlung({ metadata: { product: "crew" }, amountCents: 12_345, description: "Catering Rechnung" }),
    );
    assert.equal(z.bereich, "onice");
    assert.equal(z.vermutet, false);
  });

  it("source = catering ist sicher Catering, auch bei Passpreis", () => {
    const z = einordnen(zahlung({ metadata: { source: "catering" }, amountCents: 4900 }));
    assert.equal(z.bereich, "catering");
    assert.equal(z.vermutet, false);
  });

  it("eine fremde Produktangabe ist sonstiges, auch bei Passpreis und ON ICE im Text", () => {
    const z = einordnen(zahlung({ metadata: { product: "summer" }, amountCents: 3900, description: "ON ICE" }));
    assert.equal(z.bereich, "sonstiges");
    assert.equal(z.vermutet, false);
    assert.match(z.grund, /summer/);
  });

  it("eine leere Produktangabe zaehlt wie keine", () => {
    const z = einordnen(zahlung({ metadata: { product: "   " }, amountCents: 3900 }));
    assert.equal(z.bereich, "onice");
    assert.equal(z.vermutet, true);
  });
});

/* ── Catering am Text ───────────────────────────────────────────────── */

describe("Zuordnung nach Catering-Woertern", () => {
  for (const wort of ["Catering", "RECHNUNG", "invoice", "Angebot Nr. 12"]) {
    it(`"${wort}" in der Beschreibung ist Catering, vermutet`, () => {
      const z = einordnen(zahlung({ description: wort, amountCents: 77_700 }));
      assert.equal(z.bereich, "catering");
      assert.equal(z.vermutet, true);
    });
  }

  it("Passpreis, aber die Beschreibung sagt Catering: Catering gewinnt", () => {
    const z = einordnen(zahlung({ amountCents: 4900, description: "Catering Firmenfeier" }));
    assert.equal(z.bereich, "catering");
    assert.match(z.grund, /Catering/);
  });

  it("liest auch Schluessel und Werte der Metadaten", () => {
    assert.equal(einordnen(zahlung({ metadata: { invoice_id: "4711" } })).bereich, "catering");
    assert.equal(einordnen(zahlung({ metadata: { zweck: "Angebot Sommerfest" } })).bereich, "catering");
  });

  it("ein ausdrueckliches ON ICE im Text steht vor den Catering-Woertern", () => {
    // Eine Team-Nights-Rechnung ueber Paesse ist ON ICE, keine Catering-Rechnung.
    const z = einordnen(zahlung({ amountCents: 245_000, description: "Rechnung Team Nights ON ICE" }));
    assert.equal(z.bereich, "onice");
    assert.equal(z.vermutet, true);
  });
});

/* ── Vermutetes ON ICE ──────────────────────────────────────────────── */

describe("Zuordnung nach Betrag", () => {
  it("die Passpreise kommen aus pricing.ts und sind genau die oeffentlichen", () => {
    assert.deepEqual(passpreiseCent().sort((a, b) => a - b), [3900, 4900, 7900, 11_700, 14_700]);
  });

  it("jeder oeffentliche Passpreis ohne Beschreibung ist vermutet ON ICE", () => {
    for (const cent of passpreiseCent()) {
      const z = einordnen(zahlung({ amountCents: cent }));
      assert.equal(z.bereich, "onice", String(cent));
      assert.equal(z.vermutet, true, String(cent));
    }
  });

  it("der Haendlername vom Kontoauszug allein zaehlt als leere Beschreibung", () => {
    // So kommen die echten Zahlungen an: keine Beschreibung, nur der
    // Kontoauszugstext, und der ist an jeder Zahlung des Kontos gleich.
    const z = einordnen(zahlung({ amountCents: 4900, description: "WWW.COCKTAIL-X.COM" }));
    assert.equal(z.bereich, "onice");
    assert.equal(z.vermutet, true);
  });

  it("die Beschreibung darf Pass nennen", () => {
    const z = einordnen(zahlung({ amountCents: 11_700, description: "Crew Pass | WWW.COCKTAIL-X.COM" }));
    assert.equal(z.bereich, "onice");
    assert.equal(z.vermutet, true);
  });

  it("ON ICE im Text reicht auch bei einem Betrag, der kein oeffentlicher Passpreis ist", () => {
    // Etwa ein Kauf mit Code. Der Code-Preis steht nirgends im Repository,
    // erkennbar ist so ein Kauf nur, wenn der Shop ON ICE dazuschreibt.
    const z = einordnen(zahlung({ amountCents: 2500, description: "ON ICE Pass mit Code" }));
    assert.equal(z.bereich, "onice");
    assert.equal(z.vermutet, true);
    assert.match(z.grund, /ON ICE/);
  });

  it("der Grund nennt Betrag und Produkt", () => {
    const z = einordnen(zahlung({ amountCents: 4900 }));
    assert.match(z.grund, /49\s?€/);
    assert.match(z.grund, /Einzelpass/);
    assert.match(z.grund, /Produktangabe fehlt/);
  });
});

/* ── Sonstiges ──────────────────────────────────────────────────────── */

describe("Zuordnung: sonstiges", () => {
  it("ein unbekannter Betrag ohne Text ist sonstiges", () => {
    const z = einordnen(zahlung({ amountCents: 3400 }));
    assert.equal(z.bereich, "sonstiges");
    assert.equal(z.vermutet, true);
    assert.match(z.grund, /kein öffentlicher Passpreis/);
  });

  it("Passpreis, aber die Beschreibung nennt ein anderes Produkt", () => {
    const z = einordnen(zahlung({ amountCents: 4900, description: "Sommerfestival Ticket" }));
    assert.equal(z.bereich, "sonstiges");
    assert.match(z.grund, /anderes Produkt/);
  });

  it("ordnet gescheiterte Zahlungen nach denselben Regeln ein", () => {
    assert.equal(einordnen(zahlung({ paid: false, amountCents: 3900 })).bereich, "onice");
    assert.equal(einordnen(zahlung({ paid: false, amountCents: 3400 })).bereich, "sonstiges");
  });
});
