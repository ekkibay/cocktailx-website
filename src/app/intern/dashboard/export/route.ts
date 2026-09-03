/**
 * Verkaeufe als Tabelle zum Herunterladen.
 *
 * Gedacht fuer die zwei Faelle, in denen man die Zahlen aus dem Dashboard
 * heraushaben will: die Liste an die Buchhaltung, und die Adressen fuer die
 * Mail mit den Routen vor dem Event.
 *
 * Die Sperre steht hier noch einmal ausdruecklich. Route Handler laufen nicht
 * durch layout.tsx, die Pruefung dort greift also nicht, und diese Antwort
 * enthaelt Namen und Adressen.
 */

import { csvBetrag, toCsv } from "@/lib/stripe/csv";
import { berlinDayStart, kanalLabel, produktLabel, statusOf } from "@/lib/stripe/report";
import { loadSales } from "@/lib/stripe/sales";

import { internErlaubt } from "../../gate";

export const dynamic = "force-dynamic";

/** So weit zurueck wie das Dashboard. */
const HISTORIE_TAGE = 400;

const KOPF = [
  "Datum",
  "Uhrzeit",
  "Name",
  "E-Mail",
  "Produkt",
  "Preisstufe",
  "Kanal",
  "Fenster",
  "Betrag",
  "Erstattet",
  "Netto",
  "Status",
  "Zahlungs-ID",
];

const DATUM = new Intl.DateTimeFormat("de-DE", {
  timeZone: "Europe/Berlin",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const UHRZEIT = new Intl.DateTimeFormat("de-DE", {
  timeZone: "Europe/Berlin",
  hour: "2-digit",
  minute: "2-digit",
});

const STUFE: Record<string, string> = { early: "Early Bird", full: "Regulär", regular: "Regulär" };

export async function GET(request: Request) {
  if (!internErlaubt()) {
    return new Response("Nicht gefunden", { status: 404 });
  }

  // Voreinstellung sind die bezahlten Kaeufe, das ist der haeufigere Fall.
  // Gescheiterte Zahlungen kommen nur auf ausdrueckliche Anforderung mit,
  // damit sie nicht unbemerkt in einer Umsatzliste landen.
  const alle = new URL(request.url).searchParams.get("alle") === "1";

  const jetzt = new Date();
  const { sales, demo } = await loadSales(berlinDayStart(jetzt, -(HISTORIE_TAGE - 1)));

  const zeilen = sales
    .filter((s) => alle || s.paid)
    .sort((a, b) => b.created - a.created)
    .map((s) => {
      const at = new Date(s.created * 1000);
      return [
        DATUM.format(at),
        UHRZEIT.format(at),
        s.name ?? "",
        s.email ?? "",
        s.metadata.product ? produktLabel(s.metadata.product) : "",
        s.metadata.tier ? (STUFE[s.metadata.tier] ?? s.metadata.tier) : "",
        kanalLabel(s.metadata.channel),
        s.metadata.windowId ?? "",
        csvBetrag(s.amountCents),
        csvBetrag(s.refundedCents),
        csvBetrag(Math.max(0, s.amountCents - s.refundedCents)),
        statusOf(s),
        s.id,
      ];
    });

  const stand = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Berlin" }).format(jetzt);
  // Der Hinweis gehoert in den Dateinamen und nicht nur auf die Seite: Eine
  // Datei wird weitergeleitet, die Seite nicht.
  const name = `${demo ? "DEMODATEN-" : ""}on-ice-verkaeufe-${stand}${alle ? "-mit-gescheiterten" : ""}.csv`;

  return new Response(toCsv(KOPF, zeilen), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${name}"`,
      // Eine Verkaufsliste darf nirgends zwischenliegen.
      "Cache-Control": "no-store, private",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
