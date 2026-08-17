/**
 * Einloesung von Codes.
 *
 * Der Ablauf ist bewusst dreiteilig, weil zwischen Preisfindung und Zahlung
 * Zeit vergeht und in dieser Zeit alles schiefgehen kann:
 *
 *   quote()    Preis ansehen, nichts verbrauchen. Fuer das Eingabefeld.
 *   reserve()  Code und Kontingentplatz belegen. Direkt vor der Zahlung.
 *   commit()   Kauf festschreiben. Nach erfolgreicher Zahlung.
 *   release()  Belegung zuruecknehmen. Wenn die Zahlung scheitert.
 *
 * Wer quote() und Zahlung ohne reserve() verbindet, verkauft denselben Code
 * mehrfach: Zwischen Anzeige und Zahlung liegen bei Karte und 3D Secure
 * schnell zwei Minuten.
 */

import { randomUUID } from "node:crypto";
import { publicResolution, windowIsActive, windowPrice, type PublicPriceTable } from "./pricing.ts";
import { hashCode } from "./store.ts";
import type { TicketStore } from "./store.ts";
import type {
  PriceResolution,
  PriceWindow,
  ProductKey,
  PurchaseRecord,
  RedeemFailure,
  RedeemResult,
} from "./types.ts";

export interface RedeemDeps {
  store: TicketStore;
  windows: PriceWindow[];
  prices: PublicPriceTable;
  now: number;
  /**
   * Optionaler Bremsklotz gegen das Durchprobieren von Codes.
   * Gibt false zurueck, wenn dieser Aufrufer zu oft angefragt hat.
   */
  allowAttempt?: (key: string) => Promise<boolean>;
  /** Kennung des Aufrufers fuer die Bremse, etwa gehashte IP plus Session. */
  attemptKey?: string;
}

function findWindow(windows: PriceWindow[], id: string): PriceWindow | undefined {
  return windows.find((w) => w.id === id);
}

/**
 * Preis ansehen, ohne etwas zu verbrauchen.
 *
 * Ohne Code kommt der oeffentliche Preis heraus. Mit Code wird geprueft, aber
 * nichts belegt: Wer einen Code eintippt und es sich anders ueberlegt, soll
 * ihn nicht verloren haben.
 */
export async function quote(
  product: ProductKey,
  code: string | null | undefined,
  deps: RedeemDeps,
): Promise<RedeemResult> {
  if (!code || !code.trim()) {
    return { ok: true, resolution: publicResolution(product, deps.now, deps.prices) };
  }

  if (deps.allowAttempt && deps.attemptKey) {
    const allowed = await deps.allowAttempt(deps.attemptKey);
    if (!allowed) return { ok: false, reason: "rate_limited" };
  }

  const codeHash = hashCode(code);
  const rec = await deps.store.findCode(codeHash);
  if (!rec) return { ok: false, reason: "unknown_code" };
  if (rec.redeemedAt !== null) return { ok: false, reason: "already_used" };

  const window = findWindow(deps.windows, rec.windowId);
  // Ein Code ohne Fenster ist ein Konfigurationsfehler. Nach aussen sieht er
  // aus wie ein unbekannter Code, damit sich daraus nichts ablesen laesst.
  if (!window) return { ok: false, reason: "unknown_code" };

  if (!windowIsActive(window, deps.now)) return { ok: false, reason: "window_inactive" };
  if (!window.products.includes(product)) return { ok: false, reason: "product_mismatch" };

  if (window.quota !== null) {
    const used = await deps.store.countRedeemed(window.id);
    if (used >= window.quota) return { ok: false, reason: "quota_exhausted" };
  }

  return { ok: true, resolution: windowPrice(product, window, deps.now, deps.prices) };
}

export interface Reservation {
  id: string;
  resolution: PriceResolution;
  codeHash?: string;
  windowId?: string;
}

/**
 * Belegt Code und Kontingentplatz. Danach ist der Code weg, bis release()
 * ihn zurueckgibt.
 *
 * Reihenfolge mit Absicht: erst den Code, dann das Kontingent. Der Code ist
 * die schaerfere Bedingung, und wenn danach das Kontingent voll ist, geben
 * wir den Code sofort wieder frei.
 */
export async function reserve(
  product: ProductKey,
  code: string | null | undefined,
  deps: RedeemDeps,
): Promise<{ ok: true; reservation: Reservation } | { ok: false; reason: RedeemFailure }> {
  const id = randomUUID();

  if (!code || !code.trim()) {
    return {
      ok: true,
      reservation: { id, resolution: publicResolution(product, deps.now, deps.prices) },
    };
  }

  // Erst die guenstigen Pruefungen, damit ein falscher Code nichts belegt.
  const pre = await quote(product, code, deps);
  if (!pre.ok) return { ok: false, reason: pre.reason };

  const codeHash = hashCode(code);
  const consumed = await deps.store.consumeCode(codeHash, id);
  // Zwischen quote() und hier kann jemand anders schneller gewesen sein.
  if (!consumed) return { ok: false, reason: "already_used" };

  const window = findWindow(deps.windows, consumed.windowId);
  if (!window) {
    await deps.store.releaseCode(codeHash);
    return { ok: false, reason: "unknown_code" };
  }

  const gotSlot = await deps.store.takeQuotaSlot(window.id, window.quota);
  if (!gotSlot) {
    await deps.store.releaseCode(codeHash);
    return { ok: false, reason: "quota_exhausted" };
  }

  return {
    ok: true,
    reservation: {
      id,
      resolution: windowPrice(product, window, deps.now, deps.prices),
      codeHash,
      windowId: window.id,
    },
  };
}

/**
 * Schreibt den Kauf fort. Genau die Felder, die der Auftrag verlangt:
 * Preisstufe, Kanal-Tag, Code und Zeitstempel.
 */
export async function commit(
  reservation: Reservation,
  deps: Pick<RedeemDeps, "store" | "now">,
): Promise<PurchaseRecord> {
  const r = reservation.resolution;
  const record: PurchaseRecord = {
    id: reservation.id,
    product: r.product,
    amountEur: r.amountEur,
    publicTierAtPurchase: r.tier,
    channel: r.channel,
    windowId: r.windowId,
    channelRef: r.channelRef,
    codeHash: reservation.codeHash,
    at: deps.now,
  };
  await deps.store.recordPurchase(record);
  return record;
}

/** Nimmt eine Belegung zurueck, wenn die Zahlung nicht zustande kommt. */
export async function release(
  reservation: Reservation,
  deps: Pick<RedeemDeps, "store">,
): Promise<void> {
  if (reservation.codeHash) await deps.store.releaseCode(reservation.codeHash);
  if (reservation.windowId) await deps.store.releaseQuotaSlot(reservation.windowId);
}
