/**
 * Tests fuer Sitzung, Passwortvergleich und Bremse des internen Bereichs.
 *
 * Das Cookie ist im Betrieb der ganze Schutz vor Namen, Adressen und
 * Umsaetzen. Faellt hier etwas durch, steht der Bereich offen, und zwar
 * ohne dass es jemand merkt, weil die Seite fuer den Angreifer genauso
 * aussieht wie fuer das Team.
 */

import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import { bremseLeeren, loginErlaubt, loginGescheitert } from "./bremse.ts";
import {
  SESSION_GUELTIG_MS,
  cookieOptionen,
  internPasswort,
  internSecret,
  passwortStimmt,
  sessionErzeugen,
  sessionPruefen,
} from "./session.ts";

const SECRET = "s".repeat(32);
const JETZT = 1_800_000_000_000;
const MINUTE = 60 * 1000;

describe("Sitzung", () => {
  it("laesst sich erzeugen und wieder pruefen", () => {
    const t = sessionErzeugen(SECRET, JETZT);
    assert.equal(sessionPruefen(t, SECRET, JETZT), true);
    assert.equal(sessionPruefen(t, SECRET, JETZT + SESSION_GUELTIG_MS - 1), true);
  });

  it("traegt nur Ablauf und Signatur", () => {
    const t = sessionErzeugen(SECRET, JETZT);
    const [ablauf, sig, rest] = t.split(".");
    assert.equal(ablauf, String(JETZT + SESSION_GUELTIG_MS));
    assert.ok(sig.length >= 40);
    assert.equal(rest, undefined);
  });

  it("faellt bei veraendertem Ablauf durch", () => {
    // Der naheliegende Angriff: Ablauf nach vorn schieben, Signatur behalten.
    const t = sessionErzeugen(SECRET, JETZT);
    const [, sig] = t.split(".");
    const gefaelscht = `${JETZT + 365 * 24 * 60 * MINUTE}.${sig}`;
    assert.equal(sessionPruefen(gefaelscht, SECRET, JETZT), false);
  });

  it("faellt bei veraenderter Signatur durch", () => {
    const t = sessionErzeugen(SECRET, JETZT);
    const [ablauf, sig] = t.split(".");
    const letztes = sig.slice(-1) === "A" ? "B" : "A";
    assert.equal(sessionPruefen(`${ablauf}.${sig.slice(0, -1)}${letztes}`, SECRET, JETZT), false);
    assert.equal(sessionPruefen(`${ablauf}.${sig}x`, SECRET, JETZT), false);
    assert.equal(sessionPruefen(`${ablauf}.${sig.slice(1)}`, SECRET, JETZT), false);
  });

  it("faellt nach Ablauf durch", () => {
    const t = sessionErzeugen(SECRET, JETZT);
    assert.equal(sessionPruefen(t, SECRET, JETZT + SESSION_GUELTIG_MS), false);
    assert.equal(sessionPruefen(t, SECRET, JETZT + SESSION_GUELTIG_MS + 1), false);
  });

  it("faellt mit einem anderen Schluessel durch", () => {
    const t = sessionErzeugen(SECRET, JETZT);
    assert.equal(sessionPruefen(t, "t".repeat(32), JETZT), false);
    assert.equal(sessionPruefen(t, "", JETZT), false);
  });

  it("nimmt kein Token an, das weiter reicht als eine frische Sitzung", () => {
    // Echt signiert, aber von einer Uhr, die zwei Tage vorgeht. Entweder ist
    // die Uhr kaputt oder der Schluessel unterwegs.
    const t = sessionErzeugen(SECRET, JETZT + 2 * 24 * 60 * MINUTE);
    assert.equal(sessionPruefen(t, SECRET, JETZT), false);
  });

  it("wirft bei Unfug nie, sondern sagt nein", () => {
    const unfug: unknown[] = [
      "",
      ".",
      "..",
      "abc",
      "123",
      "123.",
      ".abc",
      "1e5.abc",
      " 123.abc",
      "-1.abc",
      "99999999999999999999.abc",
      "x".repeat(10_000),
      `${JETZT + MINUTE}.${"A".repeat(43)}`,
      null,
      undefined,
      42,
      {},
      [],
    ];
    for (const u of unfug) {
      assert.equal(sessionPruefen(u as string, SECRET, JETZT), false, String(u));
    }
  });
});

describe("Passwort", () => {
  it("erkennt das richtige Passwort", () => {
    assert.equal(passwortStimmt("sehr-geheim-und-lang", "sehr-geheim-und-lang"), true);
  });

  it("weist falsche, kuerzere und laengere Eingaben ab", () => {
    assert.equal(passwortStimmt("sehr-geheim-und-lanG", "sehr-geheim-und-lang"), false);
    assert.equal(passwortStimmt("sehr-geheim", "sehr-geheim-und-lang"), false);
    assert.equal(passwortStimmt("sehr-geheim-und-lang!", "sehr-geheim-und-lang"), false);
    assert.equal(passwortStimmt("", "sehr-geheim-und-lang"), false);
  });

  it("nimmt bei leerem Soll nichts an", () => {
    assert.equal(passwortStimmt("", ""), false);
  });
});

describe("Konfiguration", () => {
  const vorher = { p: process.env.INTERN_PASSWORD, s: process.env.INTERN_SECRET };
  afterEach(() => {
    if (vorher.p === undefined) delete process.env.INTERN_PASSWORD;
    else process.env.INTERN_PASSWORD = vorher.p;
    if (vorher.s === undefined) delete process.env.INTERN_SECRET;
    else process.env.INTERN_SECRET = vorher.s;
  });

  it("verlangt Mindestlaengen", () => {
    process.env.INTERN_PASSWORD = "kurz";
    process.env.INTERN_SECRET = "auch-zu-kurz";
    assert.equal(internPasswort(), null);
    assert.equal(internSecret(), null);
  });

  it("gibt passende Werte ohne Leerraum zurueck", () => {
    process.env.INTERN_PASSWORD = " zwoelf-zeichen ";
    process.env.INTERN_SECRET = ` ${"s".repeat(32)} `;
    assert.equal(internPasswort(), "zwoelf-zeichen");
    assert.equal(internSecret(), "s".repeat(32));
  });

  it("setzt das Cookie nur ueber https, wenn es der Betrieb ist", () => {
    assert.equal(cookieOptionen(true).secure, true);
    assert.equal(cookieOptionen(false).secure, false);
    assert.equal(cookieOptionen(true).httpOnly, true);
    assert.equal(cookieOptionen(true).maxAge, SESSION_GUELTIG_MS / 1000);
    assert.equal(cookieOptionen(true, 0).maxAge, 0);
  });
});

describe("Bremse", () => {
  beforeEach(bremseLeeren);

  it("laesst Versuche zu, solange nichts schiefging", () => {
    assert.equal(loginErlaubt("1.2.3.4", JETZT), true);
  });

  it("sperrt nach fuenf Fehlversuchen", () => {
    for (let i = 0; i < 5; i++) {
      assert.equal(loginErlaubt("1.2.3.4", JETZT), true, `Versuch ${i}`);
      loginGescheitert("1.2.3.4", JETZT);
    }
    assert.equal(loginErlaubt("1.2.3.4", JETZT), false);
  });

  it("gibt nach einer Viertelstunde wieder frei", () => {
    for (let i = 0; i < 5; i++) loginGescheitert("1.2.3.4", JETZT);
    assert.equal(loginErlaubt("1.2.3.4", JETZT + 14 * MINUTE), false);
    assert.equal(loginErlaubt("1.2.3.4", JETZT + 15 * MINUTE + 1), true);
  });

  it("zaehlt IPs getrennt", () => {
    for (let i = 0; i < 5; i++) loginGescheitert("1.2.3.4", JETZT);
    assert.equal(loginErlaubt("1.2.3.4", JETZT), false);
    assert.equal(loginErlaubt("4.3.2.1", JETZT), true);
  });

  it("zaehlt gelungene Anmeldungen nicht", () => {
    // Sechs Leute hinter einer Bueroadresse, alle richtig: kein Grund zu sperren.
    for (let i = 0; i < 20; i++) assert.equal(loginErlaubt("10.0.0.1", JETZT), true);
  });
});
