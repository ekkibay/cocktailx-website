/**
 * Der Verteiler als Tabelle.
 *
 * Fuer den Umzug in ein anderes Werkzeug oder den Blick in Excel. Die
 * Nachweisspalten (Sprache, Bestaetigungsdatum, Status) gehen mit, denn ohne
 * sie ist eine Adressliste rechtlich nur eine Adressliste.
 *
 * Die Sperre steht hier ausdruecklich: Route Handler laufen nicht durch
 * layout.tsx, und diese Antwort enthaelt E-Mail-Adressen.
 */

import { toCsv } from "@/lib/stripe/csv";
import { loadMitglieder } from "@/lib/newsletter/mitglieder";

import { zugriff } from "../../gate";

export const dynamic = "force-dynamic";

const KOPF = ["E-Mail", "Status", "Sprache", "Bestätigt am"];

const DATUM = new Intl.DateTimeFormat("de-DE", {
  timeZone: "Europe/Berlin",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export async function GET() {
  if (zugriff() !== "ok") return new Response("Nicht gefunden", { status: 404 });

  const { mitglieder, demo } = await loadMitglieder();

  const zeilen = [...mitglieder]
    .sort((a, b) => (b.bestaetigtAm ?? 0) - (a.bestaetigtAm ?? 0))
    .map((m) => [
      m.email,
      m.subscribed ? "aktiv" : "abgemeldet",
      m.locale === "en" ? "Englisch" : m.locale === "de" ? "Deutsch" : "",
      m.bestaetigtAm ? DATUM.format(new Date(m.bestaetigtAm * 1000)) : "",
    ]);

  const stand = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Berlin" }).format(new Date());
  const name = `${demo ? "DEMODATEN-" : ""}on-ice-newsletter-${stand}.csv`;

  return new Response(toCsv(KOPF, zeilen), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${name}"`,
      "Cache-Control": "no-store, private",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
