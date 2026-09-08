/**
 * Erfundene Kundenmails, damit der Supportbereich ohne Postfachzugang etwas
 * zeigt. Dasselbe Prinzip wie bei den Stripe-Demodaten: Sichtbar werden
 * sollen die Faelle, fuer die man das Werkzeug baut.
 *
 * Die Absender kommen bewusst aus den Stripe-Demodaten, statt hier erfunden
 * zu werden: Der Wert der Seite ist die Verknuepfung von Mail und Kauf, und
 * die laesst sich nur vorfuehren, wenn beide Seiten dieselben Adressen
 * kennen. Die Faelle werden aus den Verkaeufen hergeleitet, nicht fest
 * verdrahtet, damit eine Aenderung an den Demoverkaeufen die Vorfuehrung
 * nicht still zerlegt.
 */

import { demoSales } from "../stripe/demo";
import type { SupportMail } from "./types";

export function demoMails(jetzt: number = Math.floor(Date.now() / 1000)): SupportMail[] {
  const sales = demoSales(jetzt - 400 * 86400, jetzt);

  // Die drei Absender, die die Verknuepfung zeigen soll.
  const gescheitert = sales.find((s) => !s.paid && s.email);
  const erstattet = sales.find((s) => s.paid && s.refundedCents >= s.amountCents && s.email);
  const kaeufer = sales.find(
    (s) => s.paid && s.refundedCents === 0 && s.email && s.email !== gescheitert?.email,
  );

  const mails: SupportMail[] = [
    {
      id: "demo_mail_keine_bestaetigung",
      from: { name: gescheitert?.name, email: gescheitert?.email ?? "unbekannt@beispiel.de" },
      subject: "Keine Bestätigung bekommen",
      preview:
        "Hallo, ich habe vorhin versucht einen ON ICE Pass zu kaufen, aber keine Mail bekommen. Wurde mir das jetzt abgebucht? Ich will nicht nochmal kaufen und dann doppelt zahlen. Viele Grüße",
      receivedAt: jetzt - 35 * 60,
      unread: true,
    },
    {
      id: "demo_mail_erstattung",
      from: { name: erstattet?.name, email: erstattet?.email ?? "unbekannt@beispiel.de" },
      subject: "Wann kommt meine Erstattung?",
      preview:
        "Hi, ihr habt meine Stornierung letzte Woche bestätigt, aber auf meiner Karte ist noch nichts angekommen. Wie lange dauert das normalerweise?",
      receivedAt: jetzt - 3 * 3600,
      unread: true,
    },
    {
      id: "demo_mail_double_season",
      from: { name: "Mia Winter", email: "mia.winter@beispiel.de" },
      subject: "Gibt es Double Season noch?",
      preview:
        "Hallo! Eine Freundin meinte, es gibt ein Paket für Winter und Sommer zusammen. Ist das noch zu haben und gilt das für uns beide oder pro Person?",
      receivedAt: jetzt - 7 * 3600,
      unread: true,
    },
    {
      id: "demo_mail_route",
      from: { name: kaeufer?.name, email: kaeufer?.email ?? "unbekannt@beispiel.de" },
      subject: "Muss ich mir die Route vorher aussuchen?",
      preview:
        "Kurze Frage zu meinem Pass: Muss ich mich vorher für eine Route entscheiden oder können wir am Abend spontan losziehen? Und dürfen wir unterwegs wechseln?",
      receivedAt: jetzt - 26 * 3600,
      unread: false,
    },
    {
      id: "demo_mail_presse",
      from: { name: "Redaktion Stadtmagazin", email: "redaktion@beispiel.de" },
      subject: "Akkreditierung für die Eröffnung",
      preview:
        "Guten Tag, wir würden gerne über die Eröffnungswoche berichten und bitten um zwei Akkreditierungen sowie Bildmaterial. An wen können wir uns wenden?",
      receivedAt: jetzt - 2 * 86400,
      unread: false,
    },
    /* Die beiden folgenden Faelle haben keinen Kauf und zeigen die Sichtung,
       nicht die Verknuepfung: eine Bar, die mitmachen will, und ein Gast,
       der auf Englisch schreibt. Der Barname bleibt weg, weil nirgends im
       Projekt Barnamen stehen sollen, auch nicht erfundene. */
    {
      id: "demo_mail_bar_partner",
      from: { name: "Jonas Keller", email: "bar@beispiel.de" },
      subject: "Teilnehmen als Bar bei ON ICE",
      preview:
        "Hallo, wir betreiben eine Cocktailbar in Schwabing und würden gerne als Bar teilnehmen. Wie läuft die Kooperation ab und an wen wenden wir uns?",
      receivedAt: jetzt - 5 * 3600,
      unread: true,
    },
    {
      id: "demo_mail_en_ticket",
      from: { name: "Emma Collins", email: "emma.collins@example.com" },
      subject: "Where is my ticket confirmation?",
      preview:
        "Hi, I bought a pass yesterday but have not received any confirmation email. Could you check if the payment went through? Thanks, Emma",
      receivedAt: jetzt - 50 * 60,
      unread: true,
    },
  ];

  return mails.sort((a, b) => b.receivedAt - a.receivedAt);
}
