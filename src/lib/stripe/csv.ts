/**
 * Tabellen fuer Excel, nicht fuer Maschinen.
 *
 * Der Export landet erfahrungsgemaess in Excel und nicht in einem Skript,
 * deshalb drei Entscheidungen, die von RFC 4180 abweichen und im Alltag den
 * Unterschied machen:
 *
 *   Semikolon statt Komma. Deutsches Excel trennt mit Semikolon. Mit Komma
 *   landet die ganze Zeile in einer einzigen Zelle.
 *
 *   Byte Order Mark am Anfang. Ohne sie liest Excel die Datei in der
 *   Windows-Codepage und macht aus jedem Umlaut zwei Zeichen.
 *
 *   Zeilenumbruch CRLF. Aeltere Excel-Fassungen stolpern ueber blosses LF.
 */

/** Zeichen, mit denen Excel ein Feld als Formel liest. */
const FORMEL = ["=", "+", "-", "@", "\t", "\r"];

/**
 * Ein einzelnes Feld absichern.
 *
 * Der Apostroph vor Formelzeichen ist kein Schoenheitsfehler, sondern der
 * Grund, warum ein Kaeufer namens "=1+1" beim Oeffnen der Datei keinen Code
 * ausfuehrt. Namen kommen aus einem Formular, das jeder ausfuellen kann.
 */
export function csvFeld(wert: string | number | null | undefined): string {
  if (wert === null || wert === undefined) return "";
  let s = String(wert);
  if (s === "") return "";
  if (FORMEL.some((z) => s.startsWith(z))) s = `'${s}`;
  // Anfuehrungszeichen im Feld werden verdoppelt, das ist ueberall gleich.
  return `"${s.replace(/"/g, '""')}"`;
}

/** Betrag in Cent als deutsche Dezimalzahl, damit Excel rechnen kann. */
export function csvBetrag(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",");
}

export function toCsv(kopf: string[], zeilen: (string | number | null | undefined)[][]): string {
  const alle = [kopf, ...zeilen].map((z) => z.map(csvFeld).join(";"));
  return "\uFEFF" + alle.join("\r\n") + "\r\n";
}
