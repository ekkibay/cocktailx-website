/**
 * Laedt die Preisfenster. Nur serverseitig.
 *
 * Die Fenster stehen bewusst nicht im Quelltext. Sie enthalten Preise
 * unterhalb der oeffentlichen Untergrenze, und alles, was im Repository
 * liegt, ist frueher oder spaeter oeffentlich: im Bundle, im Git-Verlauf,
 * in einem Screenshot.
 *
 * Zwei Quellen, in dieser Reihenfolge:
 *
 *   1. TICKET_WINDOWS als JSON in einer Umgebungsvariablen. Fuer den Betrieb.
 *   2. src/data/ticket-windows.internal.json, nicht eingecheckt. Fuer lokal.
 *
 * Fehlt beides, gibt es keine Fenster. Das ist der richtige Ausfallmodus:
 * Der Shop verkauft dann zum oeffentlichen Preis weiter, statt gar nicht.
 * Ein Code wird abgelehnt, kein Kauf bricht ab.
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import type { PriceWindow, ProductKey } from "./types.ts";

const VALID_CHANNELS = new Set(["crm", "student", "drop", "bar"]);
const VALID_PRODUCTS = new Set<ProductKey>(["single", "crew", "doubleSeason"]);

/**
 * Prueft ein einzelnes Fenster.
 *
 * Streng, und mit Absicht laut: Ein stillschweigend verworfenes Fenster
 * heisst, dass eine ganze Kampagne ins Leere laeuft und niemand merkt es,
 * bis sich die ersten Leute beschweren.
 */
function parseWindow(raw: unknown, index: number): PriceWindow {
  const where = `Fenster ${index}`;
  if (typeof raw !== "object" || raw === null) throw new Error(`${where}: kein Objekt`);
  const o = raw as Record<string, unknown>;

  const id = o.id;
  if (typeof id !== "string" || !id) throw new Error(`${where}: id fehlt`);

  const channel = o.channel;
  if (typeof channel !== "string" || !VALID_CHANNELS.has(channel)) {
    throw new Error(`${where} (${id}): channel muss crm, student, drop oder bar sein`);
  }

  const priceEur = o.priceEur;
  if (typeof priceEur !== "number" || !Number.isFinite(priceEur) || priceEur <= 0) {
    throw new Error(`${where} (${id}): priceEur muss eine positive Zahl sein`);
  }

  const products = Array.isArray(o.products) ? o.products : [];
  if (!products.length) throw new Error(`${where} (${id}): products ist leer`);
  for (const p of products) {
    if (typeof p !== "string" || !VALID_PRODUCTS.has(p as ProductKey)) {
      throw new Error(`${where} (${id}): unbekanntes Produkt ${String(p)}`);
    }
    // Double Season hat laut Vorgabe kein Rabattfenster, sein Preis ist fest.
    // Ein Fenster darauf wuerde den Preis nicht senken, aber den Code trotzdem
    // verbrauchen: Der Kunde zahlt voll und hat seinen Code verloren. Lieber
    // beim Laden der Konfiguration lautstark scheitern.
    if (p === "doubleSeason") {
      throw new Error(
        `${where} (${id}): Double Season hat einen festen Preis und darf in keinem Fenster stehen. ` +
          "Ein Code darauf wuerde verbraucht, ohne den Preis zu aendern.",
      );
    }
  }

  const quota = o.quota === null || o.quota === undefined ? null : o.quota;
  if (quota !== null && (typeof quota !== "number" || !Number.isInteger(quota) || quota < 0)) {
    throw new Error(`${where} (${id}): quota muss null oder eine ganze Zahl ab 0 sein`);
  }

  const activeFrom = toTimestamp(o.activeFrom, `${where} (${id}): activeFrom`);
  const activeUntil = toTimestamp(o.activeUntil, `${where} (${id}): activeUntil`);
  if (activeFrom !== null && activeUntil !== null && activeUntil <= activeFrom) {
    throw new Error(`${where} (${id}): activeUntil liegt vor activeFrom`);
  }

  const channelRef = o.channelRef;
  if (channelRef !== undefined && typeof channelRef !== "string") {
    throw new Error(`${where} (${id}): channelRef muss ein Text sein`);
  }
  if (channel === "bar" && !channelRef) {
    throw new Error(`${where} (${id}): Bar-Fenster brauchen eine channelRef mit der Bar-ID`);
  }

  return {
    id,
    channel: channel as PriceWindow["channel"],
    priceEur,
    products: products as ProductKey[],
    quota,
    activeFrom,
    activeUntil,
    channelRef: channelRef as string | undefined,
  };
}

/** Akzeptiert ISO-Zeichenkette oder Millisekunden. */
function toTimestamp(value: unknown, where: string): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const ms = Date.parse(value);
    if (!Number.isNaN(ms)) return ms;
  }
  throw new Error(`${where}: weder ISO-Datum noch Millisekunden`);
}

export function parseWindows(raw: unknown): PriceWindow[] {
  const list = Array.isArray(raw) ? raw : (raw as { windows?: unknown })?.windows;
  if (!Array.isArray(list)) throw new Error("Konfiguration enthaelt keine Liste windows");
  const windows = list.map(parseWindow);

  const seen = new Set<string>();
  for (const w of windows) {
    if (seen.has(w.id)) throw new Error(`Fenster-ID ${w.id} kommt doppelt vor`);
    seen.add(w.id);
  }
  return windows;
}

let cached: PriceWindow[] | null = null;

/**
 * Laedt die Fenster einmal pro Prozess.
 *
 * Der Cache ist Absicht: Die Datei aendert sich im Betrieb nicht, und ein
 * Dateizugriff pro Checkout waere Verschwendung. Bei Aenderungen neu starten.
 */
export function loadPriceWindows(opts?: { refresh?: boolean; root?: string }): PriceWindow[] {
  if (cached && !opts?.refresh) return cached;

  const fromEnv = process.env.TICKET_WINDOWS;
  if (fromEnv && fromEnv.trim()) {
    cached = parseWindows(JSON.parse(fromEnv));
    return cached;
  }

  const root = opts?.root ?? process.cwd();
  const file = path.join(root, "src", "data", "ticket-windows.internal.json");
  try {
    cached = parseWindows(JSON.parse(readFileSync(file, "utf8")));
  } catch (err) {
    // Nur ein fehlender Pfad ist harmlos. Kaputtes JSON oder ein ungueltiges
    // Fenster muss auffallen, sonst laeuft eine Kampagne stumm ins Leere.
    if ((err as NodeJS.ErrnoException)?.code === "ENOENT") {
      cached = [];
    } else {
      throw err;
    }
  }
  return cached;
}

/** Nur fuer Tests. */
export function resetWindowCache(): void {
  cached = null;
}
