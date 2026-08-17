/**
 * Berliner Wanduhrzeit zu absolutem Zeitstempel.
 *
 * Liegt hier und nicht in der Preis-Config, weil zwei Stellen davon abhaengen:
 * die oeffentliche Preisdarstellung und die serverseitige Preishoheit im
 * Ticketmodul. Zwei Kopien derselben Zeitrechnung waeren die sicherste Art,
 * dass die Umstellung an einer Stelle eine Stunde frueher passiert als an der
 * anderen.
 *
 * Bewusst ohne Bibliothek und ohne Abhaengigkeiten, damit die Datei
 * unveraendert in ein anderes Projekt kopiert werden kann.
 */

const TZ = "Europe/Berlin";

const BERLIN_PARTS = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  hour12: false,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

/**
 * Wie viele Millisekunden liegt Berlin zu diesem Zeitpunkt vor UTC?
 *
 * Bewusst ueber formatToParts statt ueber toLocaleString und new Date(string):
 * Letzteres parst den erzeugten String in der Zeitzone des ausfuehrenden
 * Rechners, wodurch das Ergebnis davon abhaengt, wo der Server steht.
 */
function berlinOffset(at: Date): number {
  const p: Record<string, string> = {};
  for (const part of BERLIN_PARTS.formatToParts(at)) p[part.type] = part.value;
  const asUtc = Date.UTC(
    Number(p.year),
    Number(p.month) - 1,
    Number(p.day),
    // Mitternacht liefert in en-US die Stunde 24, nicht 0.
    Number(p.hour) % 24,
    Number(p.minute),
    Number(p.second),
  );
  return asUtc - at.getTime();
}

/**
 * Wanduhrzeit in Europe/Berlin zu einem absoluten Zeitstempel (ms).
 *
 * Zwei Durchlaeufe: Der erste schaetzt den Versatz anhand der Wanduhrzeit, die
 * als UTC gelesen wurde, der zweite korrigiert ihn am geschaetzten Zeitpunkt.
 * Das ist noetig, weil der Versatz selbst vom Zeitpunkt abhaengt, und faengt
 * die beiden Umstellungstage im Jahr korrekt ab.
 */
export function berlinWallClockToTimestamp(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
): number {
  const wall = Date.UTC(year, month - 1, day, hour, minute);
  let ts = wall - berlinOffset(new Date(wall));
  ts = wall - berlinOffset(new Date(ts));
  return ts;
}
