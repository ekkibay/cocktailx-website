// Pulls the position catalog from easybill and writes it to src/data/price-catalog.json.
//
// Prices in easybill are stored in CENTS, NETTO. We keep them that way — all pricing
// math happens in integer cents and only the final render converts to euros.
//
// The catalog is committed on purpose: quotes must never change because someone edited
// a price in easybill mid-session, and production needs no API key to render a quote.
// Run this deliberately when prices change, then review the diff.
//
//   node scripts/sync-easybill-positions.mjs
//
// Requires EASYBILL_API_KEY in .env.local (server-side only, never NEXT_PUBLIC_).
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
// Verkaufspreise werden committet, Einkaufspreise nicht. Die interne Datei ist
// gitignored und fehlt in der Produktion absichtlich: Dort ist die Margenpruefung
// dann inaktiv, die Angebotspreise bleiben unveraendert korrekt.
const OUT_PATH = path.join(ROOT, "src", "data", "price-catalog.json");
const INTERNAL_PATH = path.join(ROOT, "src", "data", "price-catalog.internal.json");

async function readApiKey() {
  const env = await readFile(path.join(ROOT, ".env.local"), "utf-8").catch(() => "");
  const key = env
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*EASYBILL_API_KEY\s*=\s*(.*)$/))
    .find(Boolean)?.[1]
    ?.trim()
    ?.replace(/^["']|["']$/g, "");
  return key || process.env.EASYBILL_API_KEY;
}

const apiKey = await readApiKey();
if (!apiKey) {
  console.error("EASYBILL_API_KEY missing — add it to .env.local. See scripts/sync-easybill-positions.mjs");
  process.exit(1);
}

const positions = [];
let page = 1;
let pages = 1;

do {
  const res = await fetch(`https://api.easybill.de/rest/v1/positions?limit=1000&page=${page}`, {
    headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json" },
  });
  if (!res.ok) {
    console.error(`easybill API returned ${res.status} ${res.statusText}`);
    process.exit(1);
  }
  const json = await res.json();
  positions.push(...(json.items ?? []));
  pages = json.pages ?? 1;
  page++;
} while (page <= pages);

// Keep only what pricing actually needs. Dropping the rest keeps the diff readable
// and avoids committing bookkeeping fields (export accounts, stock, login ids).
const active = positions.filter((p) => !p.archived).sort((a, b) => String(a.number).localeCompare(String(b.number)));

const catalog = active.map((p) => ({
  number: String(p.number),
  description: p.description,
  salePrice: p.sale_price,
  unit: p.unit,
  vatPercent: p.vat_percent,
  // sale_price2..10 are easybill's quantity tiers. None are maintained yet; once they
  // are, the engine picks them up without a code change.
  tiers: Array.from({ length: 9 }, (_, i) => p[`sale_price${i + 2}`]).filter((v) => v != null),
}));

/** Einkaufspreise, nur nach Positionsnummer. Bleibt aus dem Repo heraus. */
const costs = Object.fromEntries(active.map((p) => [String(p.number), p.cost_price]));

const nonNetto = positions.filter((p) => p.price_type !== "NETTO");
if (nonNetto.length) {
  console.error(`WARNING: ${nonNetto.length} position(s) are not NETTO — the engine assumes net prices:`);
  for (const p of nonNetto) console.error(`  ${p.number} ${p.description} (${p.price_type})`);
}

await writeFile(
  OUT_PATH,
  JSON.stringify(
    {
      syncedFrom: "easybill /rest/v1/positions",
      currency: "EUR",
      amountsIn: "cents",
      net: true,
      note: "Nur Verkaufspreise. Einkaufspreise stehen in price-catalog.internal.json und sind gitignored.",
      positions: catalog,
    },
    null,
    2,
  ) + "\n",
);

await writeFile(
  INTERNAL_PATH,
  JSON.stringify(
    {
      warning: "EINKAUFSPREISE. Nicht committen, nicht ausliefern. Wird von .gitignore ausgeschlossen.",
      amountsIn: "cents",
      costs,
    },
    null,
    2,
  ) + "\n",
);

console.log(`✓ ${catalog.length} positions → src/data/price-catalog.json (Verkaufspreise)`);
console.log(`✓ ${Object.keys(costs).length} Einkaufspreise → src/data/price-catalog.internal.json (gitignored)`);
const withTiers = catalog.filter((p) => p.tiers.length).length;
console.log(`  ${withTiers}/${catalog.length} have quantity tiers maintained in easybill`);
if (positions.length !== catalog.length) {
  console.log(`  ${positions.length - catalog.length} archived position(s) skipped`);
}
