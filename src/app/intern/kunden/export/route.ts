/**
 * Die Kundenliste als Tabelle.
 *
 * Eine Zeile je Kunde, nicht je Zahlung: Wer die Mail mit den Routen
 * verschickt oder Mehrfachkaeufer anschreiben will, braucht jede Adresse
 * einmal, mit dem Stand daneben. Die Liste je Zahlung gibt es im Export des
 * Verkaufsdashboards.
 *
 * Die Sperre steht hier ausdruecklich: Route Handler laufen nicht durch
 * layout.tsx, und diese Antwort enthaelt Namen und Adressen.
 */

import { kundenAus, type NewsletterStand } from "@/lib/crm/kunden";
import { loadMitglieder } from "@/lib/newsletter/mitglieder";
import { csvBetrag, toCsv } from "@/lib/stripe/csv";
import { berlinDayStart, produktLabel } from "@/lib/stripe/report";
import { loadSales } from "@/lib/stripe/sales";

import { internErlaubt } from "../../gate";

export const dynamic = "force-dynamic";

/** So weit zurueck wie die Kundenseite. */
const HISTORIE_TAGE = 400;

const KOPF = [
  "E-Mail",
  "Name",
  "Käufe",
  "Netto",
  "Erster Kauf",
  "Letzter Kauf",
  "Produkte",
  "Newsletter",
  "Fehlversuche",
];

const DATUM = new Intl.DateTimeFormat("de-DE", {
  timeZone: "Europe/Berlin",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const NEWSLETTER: Record<NewsletterStand, string> = {
  aktiv: "aktiv",
  abgemeldet: "abgemeldet",
  nein: "nein",
};

export async function GET() {
  if (!internErlaubt()) return new Response("Nicht gefunden", { status: 404 });

  const jetzt = new Date();
  const [verkauf, verteiler] = await Promise.all([
    loadSales(berlinDayStart(jetzt, -(HISTORIE_TAGE - 1))),
    loadMitglieder(),
  ]);
  const { kunden } = kundenAus(verkauf.sales, verteiler.mitglieder);

  const zeilen = kunden.map((k) => [
    k.email,
    k.name ?? "",
    k.kaeufe.length,
    csvBetrag(k.nettoCents),
    k.ersterKauf ? DATUM.format(new Date(k.ersterKauf * 1000)) : "",
    k.letzterKauf ? DATUM.format(new Date(k.letzterKauf * 1000)) : "",
    k.produkte.map(produktLabel).join(", "),
    NEWSLETTER[k.newsletter],
    k.fehlversuche,
  ]);

  const stand = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Berlin" }).format(jetzt);
  // Der Hinweis gehoert in den Dateinamen und nicht nur auf die Seite: Eine
  // Datei wird weitergeleitet, die Seite nicht. Reicht eine der beiden
  // Quellen Demodaten, ist die ganze Liste erfunden oder falsch abgeglichen.
  const demo = verkauf.demo || verteiler.demo;
  const name = `${demo ? "DEMODATEN-" : ""}on-ice-kunden-${stand}.csv`;

  return new Response(toCsv(KOPF, zeilen), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${name}"`,
      // Eine Kundenliste darf nirgends zwischenliegen.
      "Cache-Control": "no-store, private",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
