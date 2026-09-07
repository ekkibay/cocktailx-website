/**
 * Auswertung des Verteilers. Reine Funktionen, keine Netzaufrufe.
 *
 * Getrennt vom Abruf, damit sich die Zahlen ohne Mailgun-Zugang pruefen
 * lassen. Die Fragen, die hier beantwortet werden: Wie viele lesen mit, wie
 * schnell waechst es, in welcher Sprache, und wer kam zuletzt dazu.
 */

import { berlinDayStart } from "@/lib/stripe/report";

import type { Mitglied } from "./mitglieder";

export interface Tag {
  /** Tagesbeginn in Berliner Zeit, Sekunden seit 1970. */
  start: number;
  count: number;
}

/**
 * Zaehlt Zeitpunkte je Kalendertag, aeltester Tag zuerst, letzter Eintrag
 * ist der laufende Tag. Die Tagesgrenzen kommen aus der Kalenderrechnung,
 * nicht aus einer Addition von 86400 Sekunden, sonst verschiebt die
 * Zeitumstellung jede Grenze um eine Stunde.
 */
export function tageszaehlung(sekunden: number[], anchor: Date, days: number): Tag[] {
  const grenzen: number[] = [];
  for (let i = days - 1; i >= 0; i--) grenzen.push(berlinDayStart(anchor, -i));
  grenzen.push(berlinDayStart(anchor, 1));

  const out: Tag[] = grenzen.slice(0, -1).map((start) => ({ start, count: 0 }));
  const sortiert = [...sekunden].sort((a, b) => a - b);
  let tag = 0;
  for (const t of sortiert) {
    if (t < grenzen[0]) continue;
    while (tag < out.length && t >= grenzen[tag + 1]) tag++;
    if (tag >= out.length) break;
    out[tag].count += 1;
  }
  return out;
}

export interface NewsletterBericht {
  gesamt: number;
  aktiv: number;
  abgemeldet: number;
  /** Bestaetigungen heute, unabhaengig von einer spaeteren Abmeldung. */
  heute: number;
  letzte7: number;
  /** Die sieben Tage davor, fuer den Vergleich. */
  vorherige7: number;
  /** Eintraege ohne Bestaetigungsdatum, etwa von Hand angelegte. */
  ohneDatum: number;
  /** Nur unter den Aktiven, denn nur an die wird geschrieben. */
  sprachen: { de: number; en: number; unbekannt: number };
  tage: Tag[];
  /** Die neuesten Bestaetigungen, neueste zuerst. */
  letzte: Mitglied[];
}

export function newsletterBericht(mitglieder: Mitglied[], jetzt: Date, tage = 30): NewsletterBericht {
  const aktive = mitglieder.filter((m) => m.subscribed);
  const mitDatum = mitglieder.filter((m): m is Mitglied & { bestaetigtAm: number } => m.bestaetigtAm !== undefined);

  const heuteStart = berlinDayStart(jetzt);
  const vor7 = berlinDayStart(jetzt, -6);
  const vor14 = berlinDayStart(jetzt, -13);

  const sprachen = { de: 0, en: 0, unbekannt: 0 };
  for (const m of aktive) sprachen[m.locale ?? "unbekannt"] += 1;

  return {
    gesamt: mitglieder.length,
    aktiv: aktive.length,
    abgemeldet: mitglieder.length - aktive.length,
    heute: mitDatum.filter((m) => m.bestaetigtAm >= heuteStart).length,
    letzte7: mitDatum.filter((m) => m.bestaetigtAm >= vor7).length,
    vorherige7: mitDatum.filter((m) => m.bestaetigtAm >= vor14 && m.bestaetigtAm < vor7).length,
    ohneDatum: mitglieder.length - mitDatum.length,
    sprachen,
    tage: tageszaehlung(mitDatum.map((m) => m.bestaetigtAm), jetzt, tage),
    letzte: [...mitDatum].sort((a, b) => b.bestaetigtAm - a.bestaetigtAm).slice(0, 12),
  };
}
