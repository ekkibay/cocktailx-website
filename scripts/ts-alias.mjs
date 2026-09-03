/**
 * Loest den Pfadalias "@/" fuer den Testrunner von Node auf.
 *
 *   node --import ./scripts/ts-alias.mjs --test <datei>
 *
 * Hintergrund: Die Tests laufen mit der eingebauten TypeScript-Unterstuetzung
 * von Node, ohne Buendler und ohne Testabhaengigkeit. Node kennt die Aliase
 * aus tsconfig.json aber nicht. Bisher hiess das: In getesteten Dateien nur
 * relative Importe. Das ist eine Regel, die im Alltag niemand einhaelt, und
 * sie kehrt die Verhaeltnisse um, weil der Test dem Produktivcode vorschreibt,
 * wie er zu schreiben ist.
 *
 * Der Hook uebersetzt stattdessen "@/lib/x" nach "<repo>/src/lib/x.ts" und
 * probiert die ueblichen Endungen durch, weil ESM sie sonst verlangt.
 */

import { registerHooks } from "node:module";
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const SRC = path.resolve(fileURLToPath(new URL("../src", import.meta.url)));
const ENDUNGEN = ["", ".ts", ".tsx", ".mts", "/index.ts", "/index.tsx"];

function aufloesen(rumpf) {
  for (const e of ENDUNGEN) {
    const p = rumpf + e;
    // Ein Verzeichnis ist kein Modul, sonst gewaenne "" gegen "/index.ts".
    if (existsSync(p) && !existsSync(path.join(p, "package.json")) && path.extname(p)) return p;
  }
  return null;
}

registerHooks({
  resolve(spezifizierer, kontext, naechster) {
    if (spezifizierer.startsWith("@/")) {
      const treffer = aufloesen(path.join(SRC, spezifizierer.slice(2)));
      if (treffer) return { url: pathToFileURL(treffer).href, shortCircuit: true };
    }
    return naechster(spezifizierer, kontext);
  },
});
