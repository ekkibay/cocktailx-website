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

import { StripeError, hasStripe, stripeList } from "./client";
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
}

export interface SalesResult {
  sales: Sale[];
  /** true, wenn die Zahlen erfunden sind, weil kein Schluessel vorliegt. */
  demo: boolean;
  /** Gesetzt, wenn Stripe erreichbar war, aber abgelehnt hat. */
  error?: string;
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
  };
}

/**
 * Laedt die Verkaeufe eines Zeitraums.
 *
 * @param fromSeconds Beginn, einschliesslich, in Sekunden seit 1970.
 */
export async function loadSales(fromSeconds: number): Promise<SalesResult> {
  if (!hasStripe()) {
    return { sales: demoSales(fromSeconds), demo: true };
  }

  try {
    const charges = await stripeList<StripeCharge>("/charges", {
      created: { gte: fromSeconds },
      // Der PaymentIntent wird mitgeladen, damit auch Metadaten sichtbar
      // werden, die der Shop dort und nicht an der Charge hinterlegt.
      expand: ["data.payment_intent"],
    });
    return { sales: charges.map(toSale), demo: false };
  } catch (err) {
    const msg = err instanceof StripeError ? err.message : "Stripe war nicht erreichbar";
    // Lieber Demodaten mit deutlichem Hinweis als eine leere Seite: Wer das
    // Dashboard einrichtet, muss sehen, wie es aussehen wird.
    return { sales: demoSales(fromSeconds), demo: true, error: msg };
  }
}
