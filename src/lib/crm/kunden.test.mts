/**
 * Tests fuer die Kundensicht.
 *
 *   node --import ./scripts/ts-alias.mjs --test src/lib/crm/kunden.test.mts
 *
 * Alles ohne Stripe- und Mailgun-Zugang: Die Zusammenfuehrung ist eine reine
 * Rechnung ueber zwei Listen, und genau die muss stimmen, bevor jemand einem
 * Kunden schreibt, er habe nie gekauft.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { Mitglied } from "../newsletter/mitglieder.ts";
import type { Sale } from "../stripe/report.ts";
import { kundenAus, kundenBericht, sucheKunden } from "./kunden.ts";

const T = 1_760_000_000;

/** Kurzschreibweise fuer eine Zahlung. */
function kauf(over: Partial<Sale> = {}): Sale {
  return {
    id: `s${Math.random().toString(36).slice(2, 8)}`,
    amountCents: 3900,
    refundedCents: 0,
    currency: "eur",
    created: T,
    paid: true,
    metadata: { product: "single" },
    email: "anna@beispiel.de",
    name: "Anna Muster",
    ...over,
  };
}

function mitglied(over: Partial<Mitglied> = {}): Mitglied {
  return { email: "anna@beispiel.de", subscribed: true, locale: "de", ...over };
}

describe("Gruppierung", () => {
  it("fasst Schreibweisen derselben Adresse zu einem Kunden zusammen", () => {
    const { kunden } = kundenAus(
      [kauf({ email: "Anna@Beispiel.de" }), kauf({ email: "  anna@beispiel.de ", created: T - 100 })],
      [],
    );
    assert.equal(kunden.length, 1);
    assert.equal(kunden[0].email, "anna@beispiel.de");
    assert.equal(kunden[0].kaeufe.length, 2);
    assert.equal(kunden[0].nettoCents, 7800);
  });

  it("sortiert die Kaeufe eines Kunden neueste zuerst und setzt ersten und letzten Kauf", () => {
    const { kunden } = kundenAus([kauf({ created: T - 500 }), kauf({ created: T }), kauf({ created: T - 200 })], []);
    assert.deepEqual(kunden[0].kaeufe.map((s) => s.created), [T, T - 200, T - 500]);
    assert.equal(kunden[0].ersterKauf, T - 500);
    assert.equal(kunden[0].letzterKauf, T);
  });

  it("zieht Erstattungen vom Netto ab und zaehlt Produkte nur einmal", () => {
    const { kunden } = kundenAus(
      [
        kauf({ refundedCents: 3900 }),
        kauf({ metadata: { product: "crew" }, amountCents: 11700, created: T - 1 }),
        kauf({ metadata: { product: "crew" }, amountCents: 11700, created: T - 2 }),
      ],
      [],
    );
    assert.equal(kunden[0].nettoCents, 23400);
    assert.deepEqual(kunden[0].produkte, ["single", "crew"]);
  });

  it("zaehlt Zahlungen ohne Adresse getrennt, statt sie zu erfinden oder zu verlieren", () => {
    const { kunden, ohneAdresse } = kundenAus(
      [kauf(), kauf({ email: undefined }), kauf({ email: "   " }), kauf({ email: undefined, paid: false })],
      [],
    );
    assert.equal(kunden.length, 1);
    assert.equal(ohneAdresse, 3);
  });
});

describe("Fehlversuche", () => {
  it("fuehrt einen Kunden, bei dem nur die Zahlung scheiterte", () => {
    const { kunden } = kundenAus([kauf({ paid: false, email: "ben@beispiel.de", name: "Ben Test" })], []);
    assert.equal(kunden.length, 1);
    const k = kunden[0];
    assert.equal(k.kaeufe.length, 0);
    assert.equal(k.fehlversuche, 1);
    assert.equal(k.nettoCents, 0);
    assert.equal(k.letzterKauf, undefined);
    assert.equal(k.letzterFehlversuch, T);
    assert.deepEqual(k.produkte, []);
    assert.equal(kundenBericht(kunden).nurFehlversuch, 1);
  });

  it("zaehlt einen Kaeufer mit zusaetzlichem Fehlversuch nicht als Problemfall", () => {
    const { kunden } = kundenAus([kauf(), kauf({ paid: false, created: T + 10 })], []);
    assert.equal(kunden[0].kaeufe.length, 1);
    assert.equal(kunden[0].fehlversuche, 1);
    assert.equal(kundenBericht(kunden).nurFehlversuch, 0);
  });
});

describe("Newsletter", () => {
  it("verknuepft aktive, abgemeldete und unbekannte Adressen", () => {
    const { kunden } = kundenAus(
      [
        kauf({ email: "anna@beispiel.de", created: T }),
        kauf({ email: "ben@beispiel.de", created: T - 1 }),
        kauf({ email: "cem@beispiel.de", created: T - 2 }),
      ],
      [mitglied({ email: "Anna@Beispiel.de", locale: "en" }), mitglied({ email: "ben@beispiel.de", subscribed: false })],
    );
    assert.equal(kunden[0].newsletter, "aktiv");
    assert.equal(kunden[0].locale, "en");
    assert.equal(kunden[1].newsletter, "abgemeldet");
    assert.equal(kunden[2].newsletter, "nein");
    assert.equal(kunden[2].locale, undefined);
    assert.equal(kundenBericht(kunden).imNewsletter, 1);
  });
});

describe("Reihenfolge und Name", () => {
  it("stellt den juengsten Kauf nach oben und Fehlversuche nach ihrem Zeitpunkt ein", () => {
    const { kunden } = kundenAus(
      [
        kauf({ email: "alt@beispiel.de", created: T - 1000 }),
        kauf({ email: "neu@beispiel.de", created: T - 10 }),
        kauf({ email: "versuch@beispiel.de", created: T, paid: false }),
        kauf({ email: "mitte@beispiel.de", created: T - 500 }),
      ],
      [],
    );
    assert.deepEqual(
      kunden.map((k) => k.email),
      ["versuch@beispiel.de", "neu@beispiel.de", "mitte@beispiel.de", "alt@beispiel.de"],
    );
  });

  it("nimmt den juengsten Namen und faellt auf einen aelteren zurueck, wenn der neue fehlt", () => {
    const { kunden } = kundenAus(
      [
        kauf({ created: T, name: undefined }),
        kauf({ created: T - 1, name: "  " }),
        kauf({ created: T - 2, name: "A. Muster" }),
        kauf({ created: T - 3, name: "Anna Muster" }),
      ],
      [],
    );
    assert.equal(kunden[0].name, "A. Muster");
  });

  it("laesst den Namen weg, wenn nie einer angegeben wurde", () => {
    const { kunden } = kundenAus([kauf({ name: undefined })], []);
    assert.equal(kunden[0].name, undefined);
  });
});

describe("Bericht", () => {
  it("zaehlt Kunden und Mehrfachkaeufer", () => {
    const { kunden } = kundenAus(
      [
        kauf({ email: "a@beispiel.de" }),
        kauf({ email: "a@beispiel.de", created: T - 1 }),
        kauf({ email: "b@beispiel.de" }),
        kauf({ email: "c@beispiel.de", paid: false }),
      ],
      [],
    );
    const b = kundenBericht(kunden);
    assert.equal(b.gesamt, 3);
    assert.equal(b.mehrfachkaeufer, 1);
    assert.equal(b.nurFehlversuch, 1);
  });

  it("kommt mit einer leeren Liste zurecht", () => {
    const { kunden, ohneAdresse } = kundenAus([], []);
    assert.deepEqual(kunden, []);
    assert.equal(ohneAdresse, 0);
    assert.deepEqual(kundenBericht(kunden), { gesamt: 0, mehrfachkaeufer: 0, imNewsletter: 0, nurFehlversuch: 0 });
  });
});

describe("Suche", () => {
  const { kunden } = kundenAus(
    [
      kauf({ email: "anna@beispiel.de", name: "Anna Muster" }),
      kauf({ email: "ben@firma.com", name: "Ben Testmann", created: T - 1 }),
      kauf({ email: "cem@beispiel.de", name: undefined, created: T - 2 }),
    ],
    [],
  );

  it("findet ueber die Adresse, unabhaengig von der Schreibweise", () => {
    assert.deepEqual(sucheKunden(kunden, "FIRMA").map((k) => k.email), ["ben@firma.com"]);
  });

  it("findet ueber den Namen und ueberspringt Kunden ohne Namen", () => {
    assert.deepEqual(sucheKunden(kunden, "muster").map((k) => k.email), ["anna@beispiel.de"]);
    assert.deepEqual(sucheKunden(kunden, "beispiel").map((k) => k.email), ["anna@beispiel.de", "cem@beispiel.de"]);
  });

  it("liefert unter zwei Zeichen nichts", () => {
    assert.deepEqual(sucheKunden(kunden, "a"), []);
    assert.deepEqual(sucheKunden(kunden, " "), []);
    assert.equal(sucheKunden(kunden, "an").length, 2);
  });
});
