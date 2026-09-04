/**
 * Der Verteiler.
 *
 * Umgesetzt als Mailgun-Mailingliste, weil Mailgun im Projekt ohnehin den
 * Versand macht und damit keine weitere Infrastruktur dazukommt. Mailgun
 * fuehrt die Abmeldung selbst, das ist mehr wert als eine eigene Tabelle:
 * Ein Verteiler ohne funktionierenden Abmeldeweg ist rechtlich das groessere
 * Problem als einer ohne eigene Auswertung.
 *
 * Die Adresse der Liste steht in MAILGUN_NEWSLETTER_LIST, etwa
 * onice@mg.cocktail-x.com. Fehlt sie, meldet sich das Formular ehrlich als
 * nicht eingerichtet, statt eine Anmeldung ins Leere laufen zu lassen.
 */

import { mailClient } from "@/lib/mailgun";

export interface Anmeldung {
  email: string;
  locale: "de" | "en";
  /** Zeitpunkt der Anmeldung im Formular. */
  angemeldetAm: number;
  /** Zeitpunkt des Klicks im Bestaetigungslink. */
  bestaetigtAm: number;
  /**
   * IP zum Zeitpunkt der Bestaetigung.
   *
   * Steht hier fuer die Nachweispflicht: Wer behauptet, nie zugestimmt zu
   * haben, wird mit Zeitpunkt und Herkunft der Bestaetigung widerlegt. Mehr
   * wird nicht erhoben, und mit dem Ende des Verteilers faellt es weg.
   */
  ip?: string;
}

export function listeKonfiguriert(): boolean {
  return Boolean(process.env.MAILGUN_NEWSLETTER_LIST?.trim()) && mailClient() !== null;
}

/**
 * Traegt eine bestaetigte Anmeldung ein.
 *
 * upsert ist Absicht: Wer sich zweimal anmeldet und zweimal bestaetigt, soll
 * nicht auf einen Fehler laufen, sondern einfach eingetragen bleiben.
 */
export async function eintragen(a: Anmeldung): Promise<void> {
  const liste = process.env.MAILGUN_NEWSLETTER_LIST?.trim();
  const mail = mailClient();
  if (!liste || !mail) throw new Error("Newsletterliste ist nicht konfiguriert");

  await mail.mg.lists.members.createMember(liste, {
    address: a.email,
    subscribed: true,
    upsert: "yes",
    // Mailgun erwartet die Zusatzfelder als JSON-Zeichenkette.
    vars: JSON.stringify({
      locale: a.locale,
      angemeldet_am: new Date(a.angemeldetAm).toISOString(),
      bestaetigt_am: new Date(a.bestaetigtAm).toISOString(),
      ...(a.ip ? { bestaetigt_ip: a.ip } : {}),
      quelle: "cocktail-x.com",
    }),
  });
}
