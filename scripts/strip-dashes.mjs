// Entfernt Gedankenstriche (Em-Dash und En-Dash) aus dem gesamten Quelltext.
//
// Regeln, in dieser Reihenfolge:
//   1. Zahlenbereiche  "17.–28."  ->  "17. bis 28."
//   2. Freistehender Strich zwischen Woertern  "A — B"  ->  "A, B"
//   3. Alles Uebrige  ->  normaler Bindestrich
//
// Bindestriche in Wortverbindungen (U+002D) bleiben unberuehrt, es geht nur um
// U+2013 und U+2014.
//
//   node scripts/strip-dashes.mjs [--dry]
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import path from "node:path";

const DRY = process.argv.includes("--dry");
const EXTS = new Set([".tsx", ".ts", ".json", ".css", ".mjs"]);
const SKIP_DIRS = new Set(["node_modules", ".next"]);

const files = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const p = path.join(dir, entry);
    if (statSync(p).isDirectory()) walk(p);
    else if (EXTS.has(path.extname(entry))) files.push(p);
  }
})("src");

let touchedFiles = 0;
let totalBefore = 0;

for (const file of files) {
  const original = readFileSync(file, "utf8");
  const before = (original.match(/[–—]/g) ?? []).length;
  if (!before) continue;

  const next = original
    // 1. Zahlenbereiche lesbar ausschreiben
    .replace(/(\d[.,]?)\s*[–—]\s*(\d)/g, "$1 bis $2")
    // 2. Eingeschobener Strich wird zum Komma
    .replace(/\s+[–—]\s+/g, ", ")
    // 3. Rest wird ein normaler Bindestrich
    .replace(/[–—]/g, "-");

  const after = (next.match(/[–—]/g) ?? []).length;
  totalBefore += before;
  touchedFiles++;
  console.log(`${String(before).padStart(4)} -> ${after}   ${file}`);
  if (!DRY) writeFileSync(file, next, "utf8");
}

console.log(`\n${totalBefore} Gedankenstriche in ${touchedFiles} Dateien${DRY ? " (Probelauf)" : " ersetzt"}`);
