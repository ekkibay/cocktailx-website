/**
 * Preisfindung. Die einzige Stelle, an der entschieden wird, was etwas kostet.
 *
 * Der Client schickt nie einen Betrag, hoechstens einen Code. Alles andere
 * waere ein Preisschild, das der Kunde selbst beschriften darf.
 *
 * Die oeffentliche Preistabelle kommt als Parameter herein und steht nicht
 * hier drin. Zwei Gruende: Das Modul bleibt ohne Projektbezug uebernehmbar,
 * und die Zahlen haben genau eine Quelle, naemlich die Konfiguration der
 * aufrufenden Anwendung.
 */

import type { PriceResolution, PriceTier, PriceWindow, ProductKey } from "./types.ts";

export interface PublicPriceTable {
  /** Einzelpass im Einstiegsfenster. */
  earlyEur: number;
  /** Einzelpass regulaer. Zugleich der oeffentliche Referenzpreis. */
  regularEur: number;
  /** Ab diesem Zeitstempel gilt der regulaere Preis. */
  regularStartsAt: number;
  /** Wie viele Paesse im Crew Pass stecken. */
  crewSize: number;
  /** Wie viele davon bezahlt werden. */
  crewPaid: number;
  /** Double Season, fester Preis ohne Rabattfenster. */
  doubleSeasonEur: number;
}

/** Welche Stufe gilt zu diesem Zeitpunkt? Reine Datumsfrage. */
export function tierAt(now: number, prices: PublicPriceTable): PriceTier {
  return now >= prices.regularStartsAt ? "regular" : "early";
}

/** Einzelpreis des jeweils gueltigen Tarifs. */
export function unitPriceAt(now: number, prices: PublicPriceTable): number {
  return tierAt(now, prices) === "regular" ? prices.regularEur : prices.earlyEur;
}

/**
 * Oeffentlicher Preis eines Produkts.
 *
 * Crew rechnet immer gegen den gerade gueltigen Einzelpreis, damit die
 * Umstellung am Stichtag automatisch mitzieht. Double Season ist fest, es hat
 * bewusst kein Rabattfenster und darf deshalb auch keinen Streichpreis
 * bekommen: Der Vergleichswert waere frei erfunden.
 */
export function publicPrice(
  product: ProductKey,
  now: number,
  prices: PublicPriceTable,
): { amountEur: number; referenceEur: number; tier: PriceTier } {
  const tier = tierAt(now, prices);

  switch (product) {
    case "single":
      return {
        amountEur: unitPriceAt(now, prices),
        referenceEur: prices.regularEur,
        tier,
      };
    case "crew":
      return {
        amountEur: unitPriceAt(now, prices) * prices.crewPaid,
        // Vergleichswert ist, was vier Einzelpaesse jetzt kosten wuerden.
        referenceEur: unitPriceAt(now, prices) * prices.crewSize,
        tier,
      };
    case "doubleSeason":
      return {
        amountEur: prices.doubleSeasonEur,
        referenceEur: prices.doubleSeasonEur,
        tier,
      };
  }
}

/** Ist das Fenster zu diesem Zeitpunkt offen? */
export function windowIsActive(w: PriceWindow, now: number): boolean {
  if (w.activeFrom !== null && now < w.activeFrom) return false;
  if (w.activeUntil !== null && now >= w.activeUntil) return false;
  return true;
}

/**
 * Preis mit gueltigem Code.
 *
 * Der Referenzpreis bleibt der oeffentliche. Nur so stimmt die
 * Streichpreis-Darstellung im Checkout, und nur so ist die Ersparnis das,
 * was sie behauptet.
 *
 * Sicherheitsnetz am Ende: Ein Fenster darf nie teurer sein als der
 * oeffentliche Preis. Passiert das durch einen Konfigurationsfehler, gewinnt
 * der oeffentliche Preis. Ein Code, der den Kauf verteuert, ist immer ein
 * Fehler, nie eine Absicht.
 */
export function windowPrice(
  product: ProductKey,
  window: PriceWindow,
  now: number,
  prices: PublicPriceTable,
): PriceResolution {
  const pub = publicPrice(product, now, prices);

  // Crew rechnet auch mit Code gegen den Einzelpreis des Fensters.
  const base =
    product === "crew"
      ? window.priceEur * prices.crewPaid
      : product === "doubleSeason"
        ? prices.doubleSeasonEur
        : window.priceEur;

  return {
    product,
    amountEur: Math.min(base, pub.amountEur),
    referenceEur: pub.referenceEur,
    tier: pub.tier,
    channel: window.channel,
    windowId: window.id,
    channelRef: window.channelRef,
  };
}

/** Oeffentliche Preisfindung ohne Code. */
export function publicResolution(
  product: ProductKey,
  now: number,
  prices: PublicPriceTable,
): PriceResolution {
  const pub = publicPrice(product, now, prices);
  return {
    product,
    amountEur: pub.amountEur,
    referenceEur: pub.referenceEur,
    tier: pub.tier,
    channel: "public",
  };
}
