import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * SERVER ONLY. Lädt die gitignorierten Kostendateien, falls vorhanden.
 *
 * In der Produktion fehlen sie absichtlich: Das Repo ist die Quelle, und
 * Einkaufspreise gehören nicht hinein. Fehlen sie, sind die Angebotspreise
 * unverändert korrekt, nur die Margenprüfung ist inaktiv. Alles hier ist
 * deshalb als "kann null sein" gebaut, nicht als Fehlerfall.
 *
 * Erzeugt werden die Dateien von scripts/sync-easybill-positions.mjs.
 */

function loadOptional<T>(file: string): T | null {
  try {
    const raw = readFileSync(path.join(process.cwd(), "src", "data", file), "utf8");
    return JSON.parse(raw.replace(/^﻿/, "")) as T;
  } catch {
    return null;
  }
}

interface PositionCostFile {
  costs: Record<string, number>;
}

export interface PackageCost {
  costPerPerson?: number;
  fixedCost?: number;
  costPerHour?: number;
  estimatedCostPerHour?: number;
  estimatedCost?: number;
  costByTier?: { maxPersons: number; fixedCost: number }[];
  marginBand?: "own" | "passthrough";
}

interface PackageCostFile {
  packages: Record<string, PackageCost>;
}

const positionFile = loadOptional<PositionCostFile>("price-catalog.internal.json");
const packageFile = loadOptional<PackageCostFile>("dionys-cocktail-x.internal.json");

/** True, wenn Margenprüfungen überhaupt möglich sind. */
export const hasCostData = positionFile !== null || packageFile !== null;

/** Einkaufspreis einer easybill-Position in Cent, 0 wenn keine Kostendaten vorliegen. */
export function positionCost(number: string): number {
  return positionFile?.costs[number] ?? 0;
}

export function packageCost(key: string): PackageCost | null {
  return packageFile?.packages[key] ?? null;
}

if (!hasCostData && process.env.NODE_ENV !== "production") {
  console.info(
    "[pricing] Keine Kostendateien gefunden, Margenprüfung inaktiv. Anlegen mit: node scripts/sync-easybill-positions.mjs",
  );
}
