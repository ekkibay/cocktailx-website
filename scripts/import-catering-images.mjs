// Holt ausgewählte Motive aus dem geteilten Laufwerk, skaliert sie web-taugliche
// Größe und legt sie unter sprechenden Namen in public/images/catering ab.
//
// Die Quelldateien sind 10 bis 17 MB groß, unbearbeitet wären sie für die Website
// unbrauchbar. Ziel: max. 2400 px Breite, JPEG q82, das reicht für Full-Bleed-Heroes.
//
//   node scripts/import-catering-images.mjs
import sharp from "sharp";
import { mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "images", "catering");

const SRC =
  "c:/Users/kerge/OneDrive - Hospitality Circle GmbH/003 bayundco/002 ABTEILUNGEN/020 VERTRIEB UND MARKETING/022 MARKETING PR/COCKTAIL X/2026/002 Fotos/adrian.camo_edit_allgemein";

/** Quelle → Zielname. Namen beschreiben den Anlass, nicht die Kameradatei. */
const PICKS = [
  ["A9306686_CocktailX_adriancamo.jpg", "ct-sommerfest-terrasse.jpg"],
  ["A9306722_CocktailX_adriancamo.jpg", "ct-sommerfest-hof.jpg"],
  ["A9306745_CocktailX_adriancamo.jpg", "ct-bar-outdoor.jpg"],
  ["A9306771_CocktailX_adriancamo.jpg", "ct-gala-redcarpet.jpg"],
  ["A9306928_CocktailX_adriancamo.jpg", "ct-softs-kuehlschrank.jpg"],
  ["A9306939_CocktailX_adriancamo.jpg", "ct-weihnachtsfeier.jpg"],
  ["A9306956_CocktailX_adriancamo.jpg", "ct-service-tablett.jpg"],
  ["A9306959_CocktailX_adriancamo.jpg", "ct-sommerfest-garten.jpg"],
  ["A9306984_CocktailX_adriancamo.jpg", "ct-messe-bar.jpg"],
  ["A9306987_CocktailX_adriancamo.jpg", "ct-barkeeper-station.jpg"],
  ["A9306989_CocktailX_adriancamo.jpg", "ct-welcome-tablett.jpg"],
  ["A9307008_CocktailX_adriancamo.jpg", "ct-launch-fotowand.jpg"],
  ["A9307030_CocktailX_adriancamo.jpg", "ct-firmenfeier-gaeste.jpg"],
];

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

let ok = 0;
for (const [src, dest] of PICKS) {
  const from = path.join(SRC, src);
  const to = path.join(OUT_DIR, dest);
  try {
    const info = await sharp(from)
      .rotate()
      .resize({ width: 2400, withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(to);
    console.log(`${dest.padEnd(32)} ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
    ok++;
  } catch (e) {
    console.error(`FEHLER ${dest}: ${String(e.message).slice(0, 120)}`);
  }
}
console.log(`\n${ok}/${PICKS.length} Motive importiert nach public/images/catering`);
