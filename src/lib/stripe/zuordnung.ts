/**
 * Ordnet eine Zahlung einem Geschaeftsbereich zu: ON ICE, Catering, sonstiges.
 *
 * Das Stripe-Konto ist geteilt. Neben den ON ICE Paessen laufen dort die
 * Catering-Rechnungen und anderes Geschaeft. Ein Dashboard, das alles als
 * Paesse zaehlt, zeigt zu viel an, und die Summe sieht dabei plausibel aus,
 * also faellt es niemandem auf.
 *
 * Der Shop schickt den Metadaten-Vertrag (product, tier, channel, windowId)
 * noch nicht mit. Bis er das tut, bleibt nur der Betrag als Hinweis. Das ist
 * eine Vermutung, und sie wird als solche ausgewiesen: Jede Zuordnung traegt,
 * ob sie sicher oder vermutet ist, und in Worten, welche Regel gegriffen hat.
 *
 * Reine Funktion, keine Netzaufrufe, damit jede Regel einzeln pruefbar ist.
 */

import { CREW_PAID, DOUBLE_SEASON_PRICE, TIERS } from "@/config/pricing";
import type { Sale } from "./report";

export type Bereich = "onice" | "catering" | "sonstiges";

export interface Zuordnung {
  bereich: Bereich;
  /**
   * true, wenn die Zuordnung aus Betrag oder Beschreibung geschlossen wurde
   * statt aus einer ausdruecklichen Angabe des Shops (product oder source).
   */
  vermutet: boolean;
  /** Welche Regel gegriffen hat, in Worten fuer die Anzeige. */
  grund: string;
}

/** Die drei Produkte des Metadaten-Vertrags. Mehr gibt es nicht. */
const PRODUKTE = new Set(["single", "crew", "doubleSeason"]);

/**
 * Oeffentliche Passpreise in Cent, beschriftet fuer die Begruendung.
 *
 * Aus pricing.ts abgeleitet, nicht abgetippt: Aendert sich dort ein Preis,
 * zieht die Erkennung mit. Die Code-Preise stehen absichtlich NICHT hier. Sie
 * duerfen nirgends im ausgelieferten Code auftauchen, also ist ein Kauf mit
 * Code am Betrag nicht erkennbar und bleibt "sonstiges", bis der Shop die
 * Metadaten mitschickt. Das ist der Preis fuer die Geheimhaltung, und er ist
 * bewusst gezahlt.
 */
const PASSPREISE = new Map<number, string>([
  [TIERS.early.price * 100, `Einzelpass ${TIERS.early.label}`],
  [TIERS.full.price * 100, `Einzelpass ${TIERS.full.label}`],
  [CREW_PAID * TIERS.early.price * 100, `Crew Pass ${TIERS.early.label}`],
  [CREW_PAID * TIERS.full.price * 100, `Crew Pass ${TIERS.full.label}`],
  [DOUBLE_SEASON_PRICE * 100, "Double Season"],
]);

/** Nur fuer Tests und Anzeige: Welche Betraege als Passpreis gelten. */
export function passpreiseCent(): number[] {
  return Array.from(PASSPREISE.keys());
}

/** Stichwoerter, die eine Zahlung als Catering ausweisen, kleingeschrieben. */
const CATERING: [string, string][] = [
  ["catering", "Catering"],
  ["rechnung", "Rechnung"],
  ["invoice", "Invoice"],
  ["angebot", "Angebot"],
];

/**
 * Der Haendlername, wie er auf dem Kontoauszug steht.
 *
 * Er haengt an jeder Zahlung des Kontos gleich, egal was gekauft wurde, und
 * sagt deshalb nichts ueber das Produkt. Fuer die Erkennung zaehlt er wie
 * eine leere Beschreibung. Ohne diese Regel waere die Beschreibung nie leer
 * und die Betragsregel koennte nie greifen.
 */
const HAENDLER = ["www.cocktail-x.com", "cocktail-x.com", "cocktail-x", "cocktail x", "cocktailx", "bayundco"];

function ohneProduktangabe(text: string): boolean {
  let rest = text;
  for (const h of HAENDLER) rest = rest.split(h).join(" ");
  // Satzzeichen und Trenner zaehlen nicht als Angabe.
  return rest.replace(/[^a-z0-9]/g, "").length === 0;
}

function euroText(cents: number): string {
  return `${(cents / 100).toLocaleString("de-DE", { maximumFractionDigits: 2 })} €`;
}

/**
 * Regeln in dieser Reihenfolge, die erste passende gewinnt:
 *
 *  1. product in {single, crew, doubleSeason}      ON ICE, sicher
 *  2. source = catering                             Catering, sicher
 *  3. product gesetzt, aber ein anderes Produkt     sonstiges, sicher
 *  4. Text nennt ON ICE                             ON ICE, vermutet
 *  5. Text nennt Catering, Rechnung, Invoice, Angebot   Catering, vermutet
 *  6. Betrag ist ein oeffentlicher Passpreis und die Beschreibung nennt
 *     "Pass" oder ist leer (Haendlername allein zaehlt als leer)
 *                                                   ON ICE, vermutet
 *  7. alles andere                                  sonstiges, vermutet
 *
 * Angaben des Shops (1 bis 3) schlagen jeden Text, Text schlaegt den Betrag.
 * Ein ausdrueckliches "ON ICE" im Text steht vor den Catering-Woertern, weil
 * eine Team-Nights-Rechnung ueber Paesse ON ICE ist und keine Catering-
 * Rechnung. Die Catering-Woerter stehen vor der Betragsregel: Eine Rechnung
 * ueber 49 € ist eine Rechnung und kein Pass, auch wenn der Betrag passt.
 */
export function einordnen(s: Sale): Zuordnung {
  const produkt = s.metadata.product?.trim() ?? "";
  if (PRODUKTE.has(produkt)) {
    return { bereich: "onice", vermutet: false, grund: "Produktangabe des Shops" };
  }

  if ((s.metadata.source?.trim().toLowerCase() ?? "") === "catering") {
    return { bereich: "catering", vermutet: false, grund: "Metadaten: source = catering" };
  }

  if (produkt) {
    return { bereich: "sonstiges", vermutet: false, grund: `Produktangabe "${produkt}" gehört nicht zu ON ICE` };
  }

  const beschreibung = (s.description ?? "").toLowerCase();
  // Schluessel und Werte der Metadaten zaehlen mit: Ein Feld "invoice_id"
  // sagt genug, auch wenn sein Wert nur eine Nummer ist.
  const meta = Object.entries(s.metadata)
    .flatMap(([k, v]) => [k, v ?? ""])
    .join(" ")
    .toLowerCase();
  const text = `${beschreibung} ${meta}`;

  if (text.includes("on ice")) {
    return { bereich: "onice", vermutet: true, grund: "Beschreibung nennt ON ICE, Produktangabe fehlt" };
  }

  const stichwort = CATERING.find(([w]) => text.includes(w));
  if (stichwort) {
    return { bereich: "catering", vermutet: true, grund: `Beschreibung nennt "${stichwort[1]}"` };
  }

  const preis = PASSPREISE.get(s.amountCents);
  if (preis && (text.includes("pass") || ohneProduktangabe(beschreibung))) {
    return {
      bereich: "onice",
      vermutet: true,
      grund: `Betrag ${euroText(s.amountCents)} entspricht ${preis}, Produktangabe fehlt`,
    };
  }

  return {
    bereich: "sonstiges",
    vermutet: true,
    grund: preis
      ? `Betrag passt zu ${preis}, die Beschreibung nennt aber ein anderes Produkt`
      : `Betrag ${euroText(s.amountCents)} ist kein öffentlicher Passpreis, Produktangabe fehlt`,
  };
}
