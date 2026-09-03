/**
 * Was wissen wir ueber den Absender einer Supportmail?
 *
 * Das ist der eigentliche Grund fuer den Supportbereich: Eine Kundenmail ist
 * fast immer eine von drei Fragen, und die Antwort steht in den Zahlungen.
 * "Ich habe nichts bekommen" heisst meist: Die Zahlung ist gescheitert.
 * "Wann kommt mein Geld" heisst: Die Erstattung laeuft schon. Wer beides
 * neben der Mail sieht, muss nicht mehr in Stripe suchen.
 */

import { statusOf, type Sale, type Status } from "@/lib/stripe/report";

export interface KaufKontext {
  /**
   * Die eine Einordnung fuer den schnellen Blick. Gibt es einen bezahlten
   * Kauf, gewinnt der: Wer gekauft hat und dazu einen Fehlversuch hatte, ist
   * ein Kaeufer, kein Problemfall.
   */
  einordnung: Status | "kein Kauf";
  /** Der Kauf, auf den sich die Einordnung bezieht. */
  sale?: Sale;
  anzahlBezahlt: number;
  anzahlGescheitert: number;
}

export function kaufKontext(sales: Sale[], email: string): KaufKontext {
  const adresse = email.trim().toLowerCase();
  const keiner: KaufKontext = { einordnung: "kein Kauf", anzahlBezahlt: 0, anzahlGescheitert: 0 };
  if (!adresse) return keiner;

  const alle = sales
    .filter((s) => s.email?.trim().toLowerCase() === adresse)
    .sort((a, b) => b.created - a.created);
  if (alle.length === 0) return keiner;

  const bezahlt = alle.filter((s) => s.paid);
  const gescheitert = alle.length - bezahlt.length;

  // Der neueste bezahlte Kauf traegt die Einordnung. Erst wenn es keinen
  // gibt, ist die gescheiterte Zahlung die Geschichte.
  const sale = bezahlt[0] ?? alle[0];

  return {
    einordnung: statusOf(sale),
    sale,
    anzahlBezahlt: bezahlt.length,
    anzahlGescheitert: gescheitert,
  };
}
