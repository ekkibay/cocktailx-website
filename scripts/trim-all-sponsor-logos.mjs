// Trims transparent padding from ALL sponsor logos so they fill the marquee box evenly.
// Run after any logo update. Safe to re-run (idempotent for already-trimmed files).
import sharp from "sharp";
import { readFile, writeFile, readdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.resolve(__dirname, "..", "public", "images", "sponsors-opt");

const files = (await readdir(DIR)).filter((f) => /\.(webp|png)$/i.test(f));

console.log(`Trimming ${files.length} sponsor logos in ${DIR}\n`);
console.log("File                       Source        Trimmed       Saved");
console.log("─".repeat(72));

for (const f of files) {
  const p = path.join(DIR, f);
  const buf = await readFile(p);
  const inMeta = await sharp(buf).metadata();
  try {
    const trimmed = await sharp(buf)
      .ensureAlpha()
      .trim({ threshold: 10 }) // remove fully transparent edges (alpha < 10)
      .webp({ quality: 92, alphaQuality: 100 })
      .toBuffer({ resolveWithObject: true });
    const ratio = (((inMeta.width * inMeta.height - trimmed.info.width * trimmed.info.height) / (inMeta.width * inMeta.height)) * 100).toFixed(0);
    await writeFile(p.replace(/\.(png)$/i, ".webp"), trimmed.data);
    console.log(
      `${f.padEnd(26)} ${(inMeta.width + "×" + inMeta.height).padEnd(12)}  ${(trimmed.info.width + "×" + trimmed.info.height).padEnd(12)}  ${ratio}% padding removed`
    );
  } catch (e) {
    console.log(`${f.padEnd(26)} SKIP: ${e.message.slice(0, 50)}`);
  }
}
console.log("\nDone. Container should now show all logos at consistent visual size.");
