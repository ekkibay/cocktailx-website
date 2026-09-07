/**
 * Tests fuer die Auswertung des Verteilers.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { berlinDayStart } from "../stripe/report.ts";
import { newsletterBericht, tageszaehlung } from "./auswertung.ts";
import { demoMitglieder, type Mitglied } from "./mitglieder.ts";

// 10. Juli 2026, 14 Uhr Berliner Zeit.
const ANKER = new Date(Date.UTC(2026, 6, 10, 12, 0));
const sek = (d: Date) => Math.floor(d.getTime() / 1000);

const m = (over: Partial<Mitglied> = {}): Mitglied => ({
  email: `g${Math.random().toString(36).slice(2, 7)}@beispiel.de`,
  subscribed: true,
  locale: "de",
  bestaetigtAm: sek(ANKER) - 3600,
  ...over,
});

describe("Tageszaehlung", () => {
  it("liefert genau so viele Tage wie verlangt, heute zuletzt", () => {
    const r = tageszaehlung([], ANKER, 5);
    assert.equal(r.length, 5);
    assert.equal(r[4].start, berlinDayStart(ANKER));
  });

  it("sortiert Zeitpunkte in den richtigen Berliner Tag", () => {
    // 8. Juli 23 Uhr UTC ist in Berlin schon der 9. Juli.
    const r = tageszaehlung([sek(ANKER), Math.floor(Date.UTC(2026, 6, 8, 23) / 1000)], ANKER, 3);
    assert.deepEqual(r.map((t) => t.count), [0, 1, 1]);
  });

  it("laesst Zeitpunkte vor dem Fenster weg", () => {
    const r = tageszaehlung([Math.floor(Date.UTC(2026, 5, 1) / 1000)], ANKER, 3);
    assert.deepEqual(r.map((t) => t.count), [0, 0, 0]);
  });

  it("haelt die Tagesgrenzen ueber die Zeitumstellung", () => {
    const nach = new Date(Date.UTC(2026, 9, 26, 12));
    const r = tageszaehlung([], nach, 2);
    assert.equal(r[1].start - r[0].start, 25 * 3600);
  });
});

describe("Bericht", () => {
  it("trennt aktive und abgemeldete", () => {
    const b = newsletterBericht([m(), m(), m({ subscribed: false })], ANKER);
    assert.equal(b.gesamt, 3);
    assert.equal(b.aktiv, 2);
    assert.equal(b.abgemeldet, 1);
  });

  it("zaehlt heute und die letzten sieben Tage", () => {
    const heute = sek(ANKER) - 60;
    const vor3 = sek(ANKER) - 3 * 86400;
    const vor10 = sek(ANKER) - 10 * 86400;
    const b = newsletterBericht([m({ bestaetigtAm: heute }), m({ bestaetigtAm: vor3 }), m({ bestaetigtAm: vor10 })], ANKER);
    assert.equal(b.heute, 1);
    assert.equal(b.letzte7, 2);
    assert.equal(b.vorherige7, 1);
  });

  it("zaehlt eine Bestaetigung von heute auch, wenn spaeter abgemeldet wurde", () => {
    // Die Anmeldung ist passiert, die Abmeldung auch. Beides ist wahr.
    const b = newsletterBericht([m({ subscribed: false })], ANKER);
    assert.equal(b.heute, 1);
    assert.equal(b.aktiv, 0);
  });

  it("meldet Eintraege ohne Datum getrennt, statt ein Datum zu erfinden", () => {
    const b = newsletterBericht([m(), m({ bestaetigtAm: undefined })], ANKER);
    assert.equal(b.ohneDatum, 1);
    assert.equal(b.tage.reduce((n, t) => n + t.count, 0), 1);
    assert.equal(b.letzte.length, 1);
  });

  it("zaehlt Sprachen nur unter den Aktiven", () => {
    const b = newsletterBericht(
      [m({ locale: "de" }), m({ locale: "en" }), m({ locale: "en", subscribed: false }), m({ locale: undefined })],
      ANKER,
    );
    assert.deepEqual(b.sprachen, { de: 1, en: 1, unbekannt: 1 });
  });

  it("zeigt die neuesten zuerst und hoechstens zwoelf", () => {
    const viele = Array.from({ length: 20 }, (_, i) => m({ bestaetigtAm: sek(ANKER) - i * 1000 }));
    const b = newsletterBericht(viele, ANKER);
    assert.equal(b.letzte.length, 12);
    assert.equal(b.letzte[0].bestaetigtAm, sek(ANKER));
  });

  it("kommt mit einer leeren Liste zurecht", () => {
    const b = newsletterBericht([], ANKER);
    assert.equal(b.gesamt, 0);
    assert.equal(b.tage.length, 30);
    assert.deepEqual(b.letzte, []);
  });
});

describe("Demodaten", () => {
  it("enthalten Abgemeldete und Eintraege ohne Datum, weil beides vorkommt", () => {
    const d = demoMitglieder(sek(ANKER));
    const b = newsletterBericht(d, ANKER);
    assert.ok(b.abgemeldet > 0);
    assert.ok(b.ohneDatum > 0);
    assert.ok(b.aktiv > 100);
  });

  it("sind wiederholbar", () => {
    assert.deepEqual(demoMitglieder(1_800_000_000), demoMitglieder(1_800_000_000));
  });
});
