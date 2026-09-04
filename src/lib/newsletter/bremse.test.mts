/**
 * Tests fuer die Bremse am Anmeldeendpunkt.
 *
 * Der Endpunkt verschickt auf Zuruf Mails an beliebige Adressen. Greift die
 * Bremse nicht, laesst sich damit eine fremde Adresse zuschuetten, und
 * unsere Absenderdomain ist danach verbrannt.
 */

import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";

import { bremseLeeren, darfAnmelden } from "./bremse.ts";

const JETZT = 1_800_000_000_000;
const STUNDE = 60 * 60 * 1000;

describe("Bremse", () => {
  beforeEach(bremseLeeren);

  it("laesst die ersten Anmeldungen durch", () => {
    assert.equal(darfAnmelden("1.2.3.4", "a@beispiel.de", JETZT), true);
  });

  it("stoppt dieselbe Adresse nach dem zweiten Versuch", () => {
    // Sonst reicht ein Formular und ein Skript, um jemanden zuzumuellen.
    assert.equal(darfAnmelden("1.2.3.4", "opfer@beispiel.de", JETZT), true);
    assert.equal(darfAnmelden("5.6.7.8", "opfer@beispiel.de", JETZT), true);
    assert.equal(darfAnmelden("9.9.9.9", "opfer@beispiel.de", JETZT), false);
  });

  it("stoppt eine IP, die mit wechselnden Adressen kommt", () => {
    for (let i = 0; i < 5; i++) {
      assert.equal(darfAnmelden("1.2.3.4", `n${i}@beispiel.de`, JETZT), true, `Versuch ${i}`);
    }
    assert.equal(darfAnmelden("1.2.3.4", "n99@beispiel.de", JETZT), false);
  });

  it("laesst nach einer Stunde wieder zu", () => {
    for (let i = 0; i < 5; i++) darfAnmelden("1.2.3.4", `n${i}@beispiel.de`, JETZT);
    assert.equal(darfAnmelden("1.2.3.4", "neu@beispiel.de", JETZT), false);
    assert.equal(darfAnmelden("1.2.3.4", "neu@beispiel.de", JETZT + STUNDE + 1), true);
  });

  it("laesst eine gesperrte Adresse nicht durch die Hintertuer einer neuen IP", () => {
    darfAnmelden("1.1.1.1", "opfer@beispiel.de", JETZT);
    darfAnmelden("2.2.2.2", "opfer@beispiel.de", JETZT);
    for (let i = 0; i < 5; i++) {
      assert.equal(darfAnmelden(`10.0.0.${i}`, "opfer@beispiel.de", JETZT), false);
    }
  });

  it("behandelt verschiedene IPs unabhaengig voneinander", () => {
    for (let i = 0; i < 5; i++) darfAnmelden("1.2.3.4", `n${i}@beispiel.de`, JETZT);
    assert.equal(darfAnmelden("4.3.2.1", "anders@beispiel.de", JETZT), true);
  });
});
