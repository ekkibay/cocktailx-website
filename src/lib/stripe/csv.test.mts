/**
 * Tests fuer den Export.
 *
 * Escaping bricht still: Eine Datei mit einem Semikolon im Namen sieht bis
 * zum Oeffnen in Excel unauffaellig aus und hat dann eine Spalte zu viel.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { csvBetrag, csvFeld, toCsv } from "./csv.ts";

describe("Feld", () => {
  it("setzt jedes Feld in Anfuehrungszeichen", () => {
    assert.equal(csvFeld("Lena"), '"Lena"');
  });

  it("verdoppelt Anfuehrungszeichen im Feld", () => {
    assert.equal(csvFeld('Bar "Zum Anker"'), '"Bar ""Zum Anker"""');
  });

  it("laesst ein Semikolon unbeschadet durch, weil das Feld gequotet ist", () => {
    assert.equal(csvFeld("Meier; Anna"), '"Meier; Anna"');
  });

  it("laesst einen Zeilenumbruch im Feld stehen, ohne die Zeile zu zerreissen", () => {
    assert.equal(csvFeld("a\nb"), '"a\nb"');
  });

  it("entschaerft Felder, die Excel als Formel lesen wuerde", () => {
    // Namen kommen aus einem Formular, das jeder ausfuellen kann.
    assert.equal(csvFeld("=1+1"), `"'=1+1"`);
    assert.equal(csvFeld("@SUM(A1)"), `"'@SUM(A1)"`);
    assert.equal(csvFeld("-2"), `"'-2"`);
  });

  it("laesst leere Werte leer, statt zwei Anfuehrungszeichen zu setzen", () => {
    assert.equal(csvFeld(null), "");
    assert.equal(csvFeld(undefined), "");
    assert.equal(csvFeld(""), "");
  });

  it("nimmt auch Zahlen", () => {
    assert.equal(csvFeld(0), '"0"');
    assert.equal(csvFeld(42), '"42"');
  });
});

describe("Betrag", () => {
  it("schreibt Betraege mit Komma und zwei Stellen", () => {
    assert.equal(csvBetrag(3900), "39,00");
    assert.equal(csvBetrag(11700), "117,00");
    assert.equal(csvBetrag(0), "0,00");
    assert.equal(csvBetrag(3950), "39,50");
  });
});

describe("Datei", () => {
  it("beginnt mit der Byte Order Mark, sonst zerlegt Excel die Umlaute", () => {
    assert.ok(toCsv(["Käufer"], []).startsWith("\uFEFF"));
  });

  it("trennt mit Semikolon und beendet Zeilen mit CRLF", () => {
    const csv = toCsv(["a", "b"], [["1", "2"]]);
    assert.equal(csv, '\uFEFF"a";"b"\r\n"1";"2"\r\n');
  });

  it("schreibt auch ohne Zeilen einen Kopf", () => {
    assert.equal(toCsv(["a"], []), '\uFEFF"a"\r\n');
  });
});
