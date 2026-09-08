/**
 * Tests fuer die Sichtung der Supportmails.
 *
 * Die Stichwortlisten werden nachgepflegt, sobald jemand eine Fehleinordnung
 * sieht. Diese Tests halten fest, dass so eine Ergaenzung die anderen Faelle
 * nicht kippt, vor allem den Stichentscheid und den Schub durch die
 * gescheiterte Zahlung.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { demoSales } from "../stripe/demo.ts";
import { demoMails } from "./demo.ts";
import { kaufKontext } from "./kontext.ts";
import { KATEGORIEN, KATEGORIE_LABEL, triage, type Kategorie } from "./triage.ts";

function mail(subject: string, preview = "") {
  return { subject, preview };
}

describe("Triage: Kategorien", () => {
  const faelle: Array<[Kategorie, string, string]> = [
    ["ticket", "Wo ist mein Ticket?", "Ich habe gestern gekauft und finde die Bestätigung nicht."],
    ["ticket", "Login in der App klappt nicht", "Der QR-Code wird nicht angezeigt."],
    ["ticket", "Pass purchase", "How do I buy a pass for my friend?"],
    ["ticket", "Access to the app", "I cannot log in to see my ticket."],
    ["zahlung", "Doppelt abgebucht", "Auf meiner Kreditkarte stehen zwei Beträge."],
    ["zahlung", "Rückerstattung", "Wann kommt mein Geld zurück?"],
    ["zahlung", "Refund request", "I was charged twice, please refund one payment."],
    ["zahlung", "Invoice needed", "Could you send me an invoice for my payment?"],
    ["presse", "Presseanfrage", "Wir sind eine Redaktion und bitten um ein Interview."],
    ["presse", "Media accreditation", "We would like to cover the opening for our magazine."],
    ["partner", "Kooperation mit unserer Bar", "Wir würden gerne als Bar teilnehmen."],
    ["partner", "Sponsoring proposal", "Our brand would love to partner with you."],
    ["gruppe", "Weihnachtsfeier für die Firma", "Wir sind 25 Kollegen und suchen etwas für das Team."],
    ["gruppe", "Corporate event", "We are a company of 40 employees looking for a team night."],
    ["sonstiges", "Hallo", "Ich wollte nur sagen, dass ich mich freue."],
    ["sonstiges", "Question", "Just wondering about the weather in November."],
  ];

  for (const [erwartet, subject, preview] of faelle) {
    it(`"${subject}" ist ${erwartet}`, () => {
      const t = triage(mail(subject, preview));
      assert.equal(t.kategorie, erwartet, `Treffer: ${t.treffer.join(", ")}`);
    });
  }

  it("kennt sechs Kategorien mit Beschriftung, Sonstiges zuletzt", () => {
    assert.equal(KATEGORIEN.length, 6);
    assert.equal(KATEGORIEN[KATEGORIEN.length - 1], "sonstiges");
    for (const k of KATEGORIEN) assert.ok(KATEGORIE_LABEL[k].length > 0);
  });
});

describe("Triage: Stichentscheid", () => {
  // Zwei Woerter im Betreff, je eines pro Kategorie, gleiche Punktzahl.
  it("Zahlung schlaegt Ticket", () => {
    assert.equal(triage(mail("Ticket Zahlung")).kategorie, "zahlung");
  });
  it("Ticket schlaegt Gruppe", () => {
    assert.equal(triage(mail("Gruppe Ticket")).kategorie, "ticket");
  });
  it("Gruppe schlaegt Partner", () => {
    assert.equal(triage(mail("Partner Gruppe")).kategorie, "gruppe");
  });
  it("Partner schlaegt Presse", () => {
    assert.equal(triage(mail("Presse Partner")).kategorie, "partner");
  });
  it("Betreff wiegt doppelt gegenueber der Vorschau", () => {
    // Ticket im Betreff (2) gegen Zahlung in der Vorschau (1): Ticket.
    assert.equal(triage(mail("Ticket", "Zahlung")).kategorie, "ticket");
    // Zahlung im Betreff (2) gegen Ticket in der Vorschau (1): Zahlung.
    assert.equal(triage(mail("Zahlung", "Ticket")).kategorie, "zahlung");
  });
});

describe("Triage: Kaufkontext", () => {
  const keineBestaetigung = mail(
    "Keine Bestätigung bekommen",
    "Hallo, ich habe vorhin versucht einen ON ICE Pass zu kaufen, aber keine Mail bekommen. Wurde mir das jetzt abgebucht? Ich will nicht nochmal kaufen und dann doppelt zahlen.",
  );

  it("ohne Kontext klingt die fehlende Bestaetigung nach Ticket", () => {
    assert.equal(triage(keineBestaetigung).kategorie, "ticket");
  });

  it("mit gescheiterter Zahlung wird daraus eine Zahlungsfrage", () => {
    const t = triage(keineBestaetigung, { einordnung: "fehlgeschlagen" });
    assert.equal(t.kategorie, "zahlung");
    assert.ok(t.treffer.includes("Zahlung gescheitert"));
  });

  it("schiebt auch eine Mail ohne Stichwort zur Zahlung", () => {
    const t = triage(mail("Hallo?", "Ist da jemand?"), { einordnung: "fehlgeschlagen" });
    assert.equal(t.kategorie, "zahlung");
    assert.ok(t.sicherheit > 0);
  });

  it("ein bezahlter Kauf schiebt nichts", () => {
    const t = triage(mail("Wo ist mein Ticket?"), { einordnung: "bezahlt" });
    assert.equal(t.kategorie, "ticket");
    assert.ok(!t.treffer.includes("Zahlung gescheitert"));
  });

  it("eine Erstattung schiebt nichts", () => {
    assert.equal(triage(mail("Presseanfrage"), { einordnung: "erstattet" }).kategorie, "presse");
  });
});

describe("Triage: Wortgrenzen und Schreibung", () => {
  it("passiert ist kein Pass", () => {
    const t = triage(mail("Was ist da passiert?"));
    assert.ok(!t.treffer.includes("Pass"));
    assert.equal(t.kategorie, "sonstiges");
  });
  it("Apple ist keine App", () => {
    assert.ok(!triage(mail("Apple Store")).treffer.includes("App"));
  });
  it("zahlreiche ist keine Zahlung", () => {
    assert.equal(triage(mail("Zahlreiche Fragen")).kategorie, "sonstiges");
  });
  it("Tickets und Ticketkauf treffen Ticket", () => {
    assert.ok(triage(mail("Meine Tickets")).treffer.includes("Ticket"));
    assert.ok(triage(mail("Ticketkauf")).treffer.includes("Ticket"));
  });
  it("Paesse mit Umlaut wird als Pass erkannt", () => {
    assert.ok(triage(mail("Zwei Pässe für uns")).treffer.includes("Pass"));
  });
  it("Grossschreibung spielt keine Rolle", () => {
    assert.equal(triage(mail("TICKET")).kategorie, "ticket");
    assert.equal(triage(mail("RÜCKERSTATTUNG")).kategorie, "zahlung");
  });
});

describe("Triage: Sicherheit", () => {
  it("ohne Stichwort: Sonstiges, Sicherheit 0, keine Treffer", () => {
    assert.deepEqual(triage(mail("", "")), { kategorie: "sonstiges", sicherheit: 0, treffer: [] });
  });
  it("ein Wort in der Vorschau ist weniger sicher als eines im Betreff", () => {
    const vorschau = triage(mail("", "mein ticket")).sicherheit;
    const betreff = triage(mail("mein ticket")).sicherheit;
    assert.ok(vorschau > 0 && vorschau < betreff, `${vorschau} < ${betreff}`);
    assert.ok(betreff < 1);
  });
  it("mehrere eindeutige Treffer kommen auf 1", () => {
    assert.equal(triage(mail("Ticket Bestätigung", "Pass App")).sicherheit, 1);
  });
  it("gemischte Signale druecken die Sicherheit", () => {
    const klar = triage(mail("Ticket Bestätigung")).sicherheit;
    const gemischt = triage(mail("Ticket Zahlung")).sicherheit;
    assert.ok(gemischt < klar);
  });
  it("ist deterministisch", () => {
    const m = mail("Refund for my ticket", "I paid twice.");
    assert.deepEqual(triage(m), triage(m));
  });
});

describe("Triage: Demomails", () => {
  const jetzt = 1_790_000_000;
  const sales = demoSales(jetzt - 400 * 86400, jetzt);
  const mails = demoMails(jetzt);

  const von = (id: string) => {
    const m = mails.find((m) => m.id === id);
    assert.ok(m, `Demomail ${id} fehlt`);
    return triage(m, kaufKontext(sales, m.from.email));
  };

  const erwartet: Array<[string, Kategorie]> = [
    ["demo_mail_keine_bestaetigung", "zahlung"],
    ["demo_mail_erstattung", "zahlung"],
    ["demo_mail_double_season", "ticket"],
    ["demo_mail_route", "ticket"],
    ["demo_mail_presse", "presse"],
    ["demo_mail_bar_partner", "partner"],
    ["demo_mail_en_ticket", "ticket"],
  ];

  for (const [id, kategorie] of erwartet) {
    it(`${id} ist ${kategorie}`, () => {
      const t = von(id);
      assert.equal(t.kategorie, kategorie, `Treffer: ${t.treffer.join(", ")}`);
    });
  }

  it("alle Demomails liegen mit Sicherheit zwischen 0 und 1", () => {
    for (const m of mails) {
      const t = triage(m, kaufKontext(sales, m.from.email));
      assert.ok(t.sicherheit >= 0 && t.sicherheit <= 1, m.id);
    }
  });
});
