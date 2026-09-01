/**
 * Zweisprachige Texte, so wie sie in diesem Projekt ohnehin schon liegen.
 *
 * Es gab die Ueberlegung, alle Texte in die JSON-Dateien von next-intl zu
 * ziehen. Dagegen sprachen zwei Dinge: Die Inhalte sind keine flachen
 * Zeichenketten, sondern Listen von Objekten mit Bild, Position und
 * Akzentfarbe daneben, und das Muster {de, en} steht bereits in einem
 * knappen Dutzend Dateien. Zwei Systeme nebeneinander waeren die schlechtere
 * Loesung als eines, das nicht das theoretisch sauberste ist.
 *
 * Die JSON-Dateien bleiben fuer Navigation und Fusszeile zustaendig, also
 * fuer das, was in Client-Komponenten ueber useTranslations gebraucht wird.
 */

export type Locale = "de" | "en";

/** Ein Text in beiden Sprachen. */
export interface Bilingual {
  de: string;
  en: string;
}

/**
 * Waehlt die Sprachfassung.
 *
 * Faellt bewusst auf Deutsch zurueck statt auf einen leeren String: Eine
 * fehlende Uebersetzung soll auffallen, weil da deutscher Text steht, und
 * nicht dadurch, dass eine Ueberschrift verschwindet.
 */
export function pick(entry: Bilingual, locale: Locale): string {
  return entry[locale] || entry.de;
}

/** Dasselbe fuer eine Liste, etwa Aufzaehlungen in einer Preiskarte. */
export function pickAll(entries: Bilingual[], locale: Locale): string[] {
  return entries.map((e) => pick(e, locale));
}

/**
 * Prueft, ob ein Wert eine gueltige Sprache ist.
 * Die Route liefert params.locale als string, nicht als Locale.
 */
export function asLocale(value: string | undefined): Locale {
  return value === "en" ? "en" : "de";
}
