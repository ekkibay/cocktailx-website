// Baut einen Kontaktbogen aus einem Bildordner, damit viele Motive in einem Blick
// sichtbar sind. Nützlich, um Bildmaterial aus dem geteilten Laufwerk zu sichten,
// ohne jede Datei einzeln zu öffnen.
//
//   node scripts/contact-sheet.mjs "<ordner>" "<ziel.jpg>" [max] [cols] [offset]
import sharp from "sharp";
import { readdirSync, statSync } from "node:fs";
import path from "node:path";

const [dir, out, maxArg, colsArg, offsetArg] = process.argv.slice(2);
const MAX = Number(maxArg) || 24;
const COLS = Number(colsArg) || 6;
const OFFSET = Number(offsetArg) || 0;
const CELL_W = 320;
const CELL_H = 240;

const exts = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const files = readdirSync(dir)
  .filter((f) => exts.has(path.extname(f).toLowerCase()))
  .filter((f) => {
    try { return statSync(path.join(dir, f)).isFile(); } catch { return false; }
  })
  .sort()
  .slice(OFFSET, OFFSET + MAX);

if (!files.length) {
  console.error("Keine Bilder gefunden.");
  process.exit(1);
}

const rows = Math.ceil(files.length / COLS);
const W = COLS * CELL_W;
const H = rows * CELL_H;

const cells = [];
for (let i = 0; i < files.length; i++) {
  const file = files[i];
  try {
    const buf = await sharp(path.join(dir, file))
      .rotate()
      .resize(CELL_W, CELL_H, { fit: "cover", position: "centre" })
      .jpeg({ quality: 72 })
      .toBuffer();
    cells.push({
      input: buf,
      left: (i % COLS) * CELL_W,
      top: Math.floor(i / COLS) * CELL_H,
    });
    // Indexnummer als kleines Label oben links
    const label = Buffer.from(
      `<svg width="58" height="26"><rect width="58" height="26" fill="black" fill-opacity="0.72"/><text x="6" y="18" font-family="sans-serif" font-size="15" fill="white">${String(OFFSET + i + 1).padStart(3, "0")}</text></svg>`,
    );
    cells.push({
      input: label,
      left: (i % COLS) * CELL_W + 4,
      top: Math.floor(i / COLS) * CELL_H + 4,
    });
    console.log(`${String(OFFSET + i + 1).padStart(3, "0")}  ${file}`);
  } catch (e) {
    console.error(`${String(OFFSET + i + 1).padStart(3, "0")}  SKIP ${file}: ${String(e.message).slice(0, 90)}`);
  }
}

await sharp({ create: { width: W, height: H, channels: 3, background: "#141414" } })
  .composite(cells)
  .jpeg({ quality: 78 })
  .toFile(out);

console.log(`\nKontaktbogen: ${out}  (${files.length} Motive, ${COLS}x${rows})`);
