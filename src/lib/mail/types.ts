/**
 * Eine Kundenmail, so wie der Supportbereich sie braucht. Mehr nicht.
 *
 * Bewusst vom Abruf getrennt, damit die Verknuepfung mit den Kaeufen ohne
 * Postfachzugang testbar ist, nach demselben Muster wie bei Stripe.
 */
export interface SupportMail {
  id: string;
  from: {
    /** Anzeigename, wie der Absender ihn gesetzt hat. Kann fehlen. */
    name?: string;
    email: string;
  };
  subject: string;
  /** Die ersten Zeilen des Textes, von Graph als bodyPreview geliefert. */
  preview: string;
  /** Sekunden seit 1970. */
  receivedAt: number;
  unread: boolean;
  /** Oeffnet die Mail in Outlook im Browser, zum Antworten. */
  webLink?: string;
}
