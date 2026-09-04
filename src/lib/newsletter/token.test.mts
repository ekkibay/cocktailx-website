/**
 * Tests fuer das Bestaetigungstoken.
 *
 * Das Token ist der gesamte Schutz der Anmeldung: Es entscheidet, ob eine
 * Adresse in den Verteiler kommt. Faellt hier etwas durch, traegt jemand
 * fremde Adressen ein, und der Nachweis der Einwilligung ist wertlos.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  TOKEN_GUELTIG_MS,
  istEmail,
  normalisiereEmail,
  tokenErzeugen,
  tokenPruefen,
} from "./token.ts";

const SECRET = "x".repeat(32);
const JETZT = 1_800_000_000_000;
const inhalt = { email: "gast@beispiel.de", locale: "de" as const, at: JETZT };

describe("Adressen", () => {
  it("vereinheitlicht Schreibweise und Leerzeichen", () => {
    assert.equal(normalisiereEmail("  Max@Beispiel.DE "), "max@beispiel.de");
  });

  it("nimmt gewoehnliche Adressen an", () => {
    assert.ok(istEmail("gast@beispiel.de"));
    assert.ok(istEmail("vor.nach+ice@sub.beispiel.co.uk"));
  });

  it("weist Unfug ab", () => {
    for (const k of ["", "gast", "gast@", "@beispiel.de", "gast@beispiel", "a b@c.de", "gast@bei spiel.de"]) {
      assert.equal(istEmail(k), false, k);
    }
  });

  it("weist absurd lange Adressen ab", () => {
    assert.equal(istEmail(`${"a".repeat(250)}@beispiel.de`), false);
  });
});

describe("Token", () => {
  it("laesst sich erzeugen und wieder pruefen", () => {
    const t = tokenErzeugen(inhalt, SECRET);
    const p = tokenPruefen(t, SECRET, JETZT);
    assert.equal(p.ok, true);
    assert.ok(p.ok && p.inhalt.email === "gast@beispiel.de");
    assert.ok(p.ok && p.inhalt.locale === "de");
  });

  it("faellt bei verändertem Inhalt durch", () => {
    // Der eigentliche Angriff: fremde Adresse in ein gueltiges Token setzen.
    const t = tokenErzeugen(inhalt, SECRET);
    const [nutzlast, sig] = t.split(".");
    const gefaelscht = Buffer.from(
      JSON.stringify({ ...inhalt, email: "opfer@beispiel.de" }),
      "utf8",
    ).toString("base64url");
    assert.notEqual(gefaelscht, nutzlast);
    const p = tokenPruefen(`${gefaelscht}.${sig}`, SECRET, JETZT);
    assert.equal(p.ok, false);
    assert.ok(!p.ok && p.grund === "signatur");
  });

  it("faellt mit einem anderen Schluessel durch", () => {
    const t = tokenErzeugen(inhalt, SECRET);
    const p = tokenPruefen(t, "y".repeat(32), JETZT);
    assert.ok(!p.ok && p.grund === "signatur");
  });

  it("faellt nach Ablauf der Frist durch", () => {
    const t = tokenErzeugen(inhalt, SECRET);
    const p = tokenPruefen(t, SECRET, JETZT + TOKEN_GUELTIG_MS + 1);
    assert.ok(!p.ok && p.grund === "abgelaufen");
  });

  it("gilt bis zur Frist", () => {
    const t = tokenErzeugen(inhalt, SECRET);
    assert.equal(tokenPruefen(t, SECRET, JETZT + TOKEN_GUELTIG_MS - 1).ok, true);
  });

  it("weist ein Token aus der Zukunft ab", () => {
    // Entweder hat jemand am Zeitstempel gedreht oder eine Uhr geht falsch.
    const t = tokenErzeugen({ ...inhalt, at: JETZT + 600_000 }, SECRET);
    assert.equal(tokenPruefen(t, SECRET, JETZT).ok, false);
  });

  it("verkraftet kleine Uhrabweichungen", () => {
    const t = tokenErzeugen({ ...inhalt, at: JETZT + 20_000 }, SECRET);
    assert.equal(tokenPruefen(t, SECRET, JETZT).ok, true);
  });

  it("faellt bei kaputter Form durch, ohne zu werfen", () => {
    for (const k of ["", ".", "abc", "abc.def", "...", "a.b.c"]) {
      const p = tokenPruefen(k, SECRET, JETZT);
      assert.equal(p.ok, false, k);
    }
  });

  it("weist eine unbekannte Sprache ab", () => {
    const t = tokenErzeugen({ ...inhalt, locale: "fr" as unknown as "de" }, SECRET);
    assert.equal(tokenPruefen(t, SECRET, JETZT).ok, false);
  });

  it("nimmt die vereinheitlichte Adresse zurueck", () => {
    const t = tokenErzeugen({ ...inhalt, email: "Gast@Beispiel.DE" }, SECRET);
    const p = tokenPruefen(t, SECRET, JETZT);
    assert.ok(p.ok && p.inhalt.email === "gast@beispiel.de");
  });

  it("enthaelt keine Zeichen, die einen Link zerreissen", () => {
    // Das Token steht in einer URL und in einer Mail.
    const t = tokenErzeugen({ ...inhalt, email: "a+b@beispiel.de" }, SECRET);
    assert.match(t, /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/);
    assert.equal(encodeURIComponent(t), t);
  });
});
