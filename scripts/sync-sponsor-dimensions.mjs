// Reads each sponsor logo file from /public/images/sponsors-opt/
// and updates displayH/displayW in sponsors.ts to match the ACTUAL intrinsic file dimensions.
// Required so Next.js Image renders at full container size (object-contain works as expected).
import sharp from "sharp";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SPONSORS_PATH = path.join(ROOT, "src", "data", "sponsors.ts");
const IMG_DIR = path.join(ROOT, "public");

let content = await readFile(SPONSORS_PATH, "utf-8");

const re = /(\{[^}]*logo:\s*"([^"]+)"[^}]*displayH:\s*)\d+(\s*,\s*displayW:\s*)\d+/g;

const replacements = [];
let m;
while ((m = re.exec(content)) !== null) {
  const logoPath = m[2];
  const filePath = path.join(IMG_DIR, logoPath);
  try {
    const meta = await sharp(await readFile(filePath)).metadata();
    replacements.push({ orig: m[0], logoPath, w: meta.width, h: meta.height, prefix: m[1], mid: m[3] });
  } catch (e) {
    console.error(`SKIP ${logoPath}: ${e.message}`);
  }
}

for (const r of replacements) {
  const newDecl = `${r.prefix}${r.h}${r.mid}${r.w}`;
  content = content.replace(r.orig, newDecl);
  console.log(`${r.logoPath.padEnd(50)} → displayH:${r.h} displayW:${r.w}`);
}

await writeFile(SPONSORS_PATH, content);
console.log(`\n✓ Updated ${replacements.length} sponsor entries with real intrinsic dimensions.`);
