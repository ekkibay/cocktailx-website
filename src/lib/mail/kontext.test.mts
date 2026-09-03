/**
 * Tests fuer die Verknuepfung von Kundenmail und Kauf.
 *
 * Die Einordnung neben der Mail ist die Antwort, die der Support gibt. Ist
 * sie falsch, schreibt jemand einem zahlenden Gast "deine Zahlung ist
 * gescheitert". Deshalb Tests, nicht Augenmass.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { Sale } from "../stripe/report.ts";
import { demoSales } from "../stripe/demo.ts";
import { demoMails } from "./demo.ts";
import { kaufKontext } from "./kontext.ts";

function kauf(over: Partial<Sale> = {}): Sale {
  return {
    id: `s${Math.random().toString(36).slice(2, 8)}`,
    amountCents: 3900,
    refundedCents: 0,
    currency: "eur",
    created: 100,
    paid: true,
    metadata: {},
    email: "gast@beispiel.de",
    ...over,
  };
}

describe("Kaufkontext", () => {
  it("meldet kein Kauf, wenn die Adresse nirgends auftaucht", () => {
    const k = kaufKontext([kauf()], "fremd@beispiel.de");
    assert.equal(k.einordnung, "kein Kauf");
    assert.equal(k.sale, undefined);
  });

  it("findet den Kauf ohne Ruecksicht auf Gross- und Kleinschreibung", () => {
    const k = kaufKontext([kauf({ email: "Gast@Beispiel.de" })], "  gast@beispiel.de ");
    assert.equal(k.einordnung, "bezahlt");
  });

  it("laesst den bezahlten Kauf gewinnen, auch wenn danach ein Versuch scheiterte", () => {
    // Wer gekauft hat und dazu einen Fehlversuch hatte, ist ein Kaeufer,
    // kein Problemfall. Sonst schriebe man zahlenden Gaesten hinterher.
    const k = kaufKontext(
      [kauf({ created: 100 }), kauf({ created: 200, paid: false })],
      "gast@beispiel.de",
    );
    assert.equal(k.einordnung, "bezahlt");
    assert.equal(k.anzahlBezahlt, 1);
    assert.equal(k.anzahlGescheitert, 1);
  });

  it("meldet gescheitert, wenn es nur Fehlversuche gibt", () => {
    const k = kaufKontext([kauf({ paid: false })], "gast@beispiel.de");
    assert.equal(k.einordnung, "fehlgeschlagen");
  });

  it("nimmt bei mehreren bezahlten Kaeufen den neuesten", () => {
    const k = kaufKontext(
      [kauf({ created: 100, amountCents: 3900 }), kauf({ created: 200, amountCents: 11700 })],
      "gast@beispiel.de",
    );
    assert.equal(k.sale?.amountCents, 11700);
    assert.equal(k.anzahlBezahlt, 2);
  });

  it("meldet die Erstattung des neuesten bezahlten Kaufs", () => {
    const k = kaufKontext([kauf({ refundedCents: 3900 })], "gast@beispiel.de");
    assert.equal(k.einordnung, "erstattet");
  });

  it("kommt mit Kaeufen ohne Adresse zurecht", () => {
    const k = kaufKontext([kauf({ email: undefined })], "gast@beispiel.de");
    assert.equal(k.einordnung, "kein Kauf");
  });

  it("meldet bei leerer Anfrage kein Kauf, statt irgendetwas zu treffen", () => {
    const k = kaufKontext([kauf({ email: "" })], "");
    assert.equal(k.einordnung, "kein Kauf");
  });
});

describe("Demodaten", () => {
  /*
   * Die Demomails sollen die Verknuepfung vorfuehren. Diese Tests halten
   * fest, dass die vorgefuehrten Faelle wirklich eintreten. Sie brechen,
   * wenn jemand die Stripe-Demodaten so aendert, dass die Geschichte nicht
   * mehr stimmt, und genau dann sollen sie brechen.
   */
  const jetzt = 1_790_000_000;
  const sales = demoSales(jetzt - 400 * 86400, jetzt);
  const mails = demoMails(jetzt);
  const von = (id: string) => {
    const m = mails.find((m) => m.id === id);
    assert.ok(m, `Demomail ${id} fehlt`);
    return kaufKontext(sales, m.from.email);
  };

  it("die Mail zur fehlenden Bestaetigung kommt von einer gescheiterten Zahlung", () => {
    assert.equal(von("demo_mail_keine_bestaetigung").einordnung, "fehlgeschlagen");
  });

  it("die Mail zur Erstattung kommt von einem erstatteten Kauf", () => {
    assert.equal(von("demo_mail_erstattung").einordnung, "erstattet");
  });

  it("die Frage zur Route kommt von einem zahlenden Gast", () => {
    assert.equal(von("demo_mail_route").einordnung, "bezahlt");
  });

  it("die Presseanfrage hat keinen Kauf", () => {
    assert.equal(von("demo_mail_presse").einordnung, "kein Kauf");
  });

  it("alle Demomails haben Absender, Betreff und Vorschau", () => {
    for (const m of mails) {
      assert.ok(m.from.email.includes("@"), m.id);
      assert.ok(m.subject.length > 0, m.id);
      assert.ok(m.preview.length > 0, m.id);
    }
  });
});
