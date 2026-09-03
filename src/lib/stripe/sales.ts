/**
 * Holt Zahlungen aus Stripe und bringt sie in das Format der Auswertung.
 *
 * Gelesen werden Charges, nicht PaymentIntents. Grund: Nur die Charge kennt
 * den tatsaechlich erstatteten Betrag, und ein Dashboard, das Rueckerstattungen
 * unterschlaegt, zeigt zu viel Umsatz an, also genau den Fehler, den niemand
 * bemerkt.
 *
 * Die Metadaten liegen je nach Anbindung an der Charge oder am PaymentIntent.
 * Beide werden gelesen, die Charge gewinnt, weil sie naeher am Geld ist.
 */

import { StripeError, hasStripe, stripeListZeitraum } from "./client";
import { demoSales } from "./demo";
import type { Sale } from "./report";

interface StripeCharge {
  id: string;
  amount: number;
  amount_refunded: number;
  currency: string;
  created: number;
  paid: boolean;
  status: string;
  refunded: boolean;
  metadata?: Record<string, string>;
  payment_intent?: string | { id: string; metadata?: Record<string, string> } | null;
  billing_details?: { email?: string | null; name?: string | null };
  receipt_email?: string | null;
  receipt_url?: string | null;
}

export interface SalesResult {
  sales: Sale[];
  /** true, wenn die Zahlen erfunden sind, weil kein Schluessel vorliegt. */
  demo: boolean;
  /** Gesetzt, wenn Stripe erreichbar war, aber abgelehnt hat. */
  error?: string;
  /**
   * false, wenn die Obergrenze erreicht wurde und Zahlungen fehlen.
   * Die Seiten muessen das anzeigen, sonst stimmen die Summen still nicht.
   */
  vollstaendig: boolean;
}

function toSale(c: StripeCharge): Sale {
  const piMeta =
    c.payment_intent && typeof c.payment_intent === "object" ? (c.payment_intent.metadata ?? {}) : {};

  return {
    id: c.id,
    amountCents: c.amount,
    refundedCents: c.amount_refunded ?? 0,
    currency: c.currency,
    created: c.created,
    // "paid" allein reicht nicht: Eine fehlgeschlagene Zahlung kann paid
    // tragen und trotzdem nicht erfolgreich sein.
    paid: c.paid && c.status === "succeeded",
    metadata: { ...piMeta, ...(c.metadata ?? {}) },
    // billing_details zuerst: Die Adresse aus dem Checkout ist die, an die
    // der Beleg ging. receipt_email ist oft leer, wenn Stripe den Beleg ueber
    // den Kunden statt ueber die Zahlung verschickt.
    email: c.billing_details?.email ?? c.receipt_email ?? undefined,
    name: c.billing_details?.name ?? undefined,
    receiptUrl: c.receipt_url ?? undefined,
  };
}

/* Kurzer Zwischenspeicher im Prozess.

   Gemessen: Der volle Abruf dauert auch parallelisiert einige Sekunden, und
   jede Zeitraumwahl, jede Suche und der Supportbereich laden dieselben
   Zahlungen. Zwei Minuten sind kurz genug, dass ein neuer Verkauf nicht
   uebersehen wird, und lang genug, dass die Seite sich bedienen laesst.
   Die Fusszeilen der Seiten nennen dieses Alter ausdruecklich. */
const CACHE_DAUER_MS = 120_000;
let cache: { von: number; um: number; ergebnis: SalesResult } | null = null;

/** Fuer Tests, damit jeder Fall mit leerem Speicher beginnt. */
export function salesCacheLeeren(): void {
  cache = null;
}

/**
 * Laedt die Verkaeufe eines Zeitraums.
 *
 * @param fromSeconds Beginn, einschliesslich, in Sekunden seit 1970.
 */
export async function loadSales(fromSeconds: number): Promise<SalesResult> {
  if (!hasStripe()) {
    return { sales: demoSales(fromSeconds), demo: true, vollstaendig: true };
  }

  if (cache && cache.von === fromSeconds && Date.now() - cache.um < CACHE_DAUER_MS) {
    return cache.ergebnis;
  }

  try {
    // Bis kurz in die Zukunft, damit eine Zahlung aus dieser Sekunde nicht
    // an der oberen Grenze haengenbleibt.
    const bis = Math.floor(Date.now() / 1000) + 3600;
    const { items, vollstaendig } = await stripeListZeitraum<StripeCharge>(
      "/charges",
      fromSeconds,
      bis,
      {
        // Der PaymentIntent wird mitgeladen, damit auch Metadaten sichtbar
        // werden, die der Shop dort und nicht an der Charge hinterlegt.
        expand: ["data.payment_intent"],
      },
    );
    const ergebnis: SalesResult = { sales: items.map(toSale), demo: false, vollstaendig };
    cache = { von: fromSeconds, um: Date.now(), ergebnis };
    return ergebnis;
  } catch (err) {
    const msg = err instanceof StripeError ? err.message : "Stripe war nicht erreichbar";
    // Lieber Demodaten mit deutlichem Hinweis als eine leere Seite: Wer das
    // Dashboard einrichtet, muss sehen, wie es aussehen wird.
    return { sales: demoSales(fromSeconds), demo: true, error: msg, vollstaendig: true };
  }
}
