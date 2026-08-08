// Holt die ON-ICE-Bildstrecke aus dem geteilten Laufwerk, gradet sie kalt und
// legt sie unter /public/images/onice ab.
//
// Grading-Idee: Der Grund der Seite ist fast schwarz mit kaltem Blaustich, die
// Waerme soll aus den Fotos kommen. Also nicht komplett entsaettigen, sondern
// die Schatten kalt kippen und die Saettigung leicht zuruecknehmen. Bernstein
// und Bar-Licht bleiben stehen, das Gesamtklima wird kuehl. Kein Fake-Schnee.
//
//   node scripts/import-onice-assets.mjs
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public", "images", "onice");

const SRC_BASE =
  "c:/Users/kerge/OneDrive - Hospitality Circle GmbH/003 bayundco/002 ABTEILUNGEN/030 OPERATIVES GESCHÄFT/031 OPERATIONS/006 EVENTS 2026/05 MAI/13.-30.05.2026 - Cocktail X Festival/Cocktail X FESTIVAL 2026";
const SRC_PHOTOS = `${SRC_BASE}/CX25 Pictures`;
const SRC_LOGO = `${SRC_BASE}/CX26 Logo`;
// Hauptquelle fuer ON ICE: Festivaltag in den Bars. Dunkles Bar-Licht, Gaeste
// mit Cocktails in der Hand, teils in Daunenjacken und Schals. Genau das
// Gegenteil von Sommerstimmung und der Grund, warum diese Strecke die
// Strassenmotive ersetzt.
const SRC_BARS =
  "c:/Users/kerge/OneDrive - Hospitality Circle GmbH/003 bayundco/002 ABTEILUNGEN/020 VERTRIEB UND MARKETING/022 MARKETING PR/001 AUFRÄUMEN/005 MATERIAL/CX FESTIVAL FOTAGE/2023 MATERIAL/johannesrittermedia_Cocktail_x_-_Day_1";

/**
 * @param {string} file      Quelldatei
 * @param {string} dest      Zielname
 * @param {number} width     Zielbreite
 * @param {number} sat       Saettigung (1 = unveraendert)
 * @param {number} coldness  Staerke des kalten Overlays, 0 bis 1
 */
// Die CX25-Strecke ist bewusst raus: sie zeigt Details, Flaschen und Personal,
// aber keine Gaeste mit Cocktails in Bars. Fuer ON ICE zaehlt genau das.
const PHOTOS = [];

/**
 * Gaeste-Motive: viele Leute, gute Stimmung, Drink im Vordergrund.
 * Die werden weniger stark entsaettigt als die Detailaufnahmen, weil die
 * Waerme hier die Emotion traegt und nicht stoert.
 */
/**
 * Motive aus den Bars. Weniger kaltes Overlay als bei den Detailaufnahmen:
 * Diese Bilder leben vom Bar-Licht, und genau daraus soll die Waerme kommen.
 * Der kalte Grund der Seite liefert den Kontrast.
 */
const CROWD = [
  // Erhobene Glaeser in dunkler Bar, Cocktail im Vordergrund. Hero.
  { file: "CocktailX -02194.jpg", dest: "onice-bar-cheers.jpg", width: 2400, sat: 0.9, coldness: 0.2 },
  // Zwei Coupe-Glaeser angestossen, dunkler Hintergrund
  { file: "CocktailX -02197.jpg", dest: "onice-bar-toast.jpg", width: 2000, sat: 0.9, coldness: 0.2 },
  // Gaeste in Daunenjacken und Schals mit dem Pass. Winter statt Sommer.
  { file: "CocktailX -02221.jpg", dest: "onice-bar-winter.jpg", width: 2000, sat: 0.9, coldness: 0.24 },
  // Gruppe am Tisch in der Bar, Drinks auf dem Tisch
  { file: "CocktailX -02231.jpg", dest: "onice-bar-table.jpg", width: 2000, sat: 0.88, coldness: 0.24 },
  // Cocktail wird auf dem Tresen abgestellt, Karte daneben
  { file: "CocktailX -02251.jpg", dest: "onice-bar-serve.jpg", width: 2000, sat: 0.9, coldness: 0.22 },
  // Barkeeper arbeitet, Gold auf Schwarz
  { file: "CocktailX -02394.jpg", dest: "onice-bar-keeper.jpg", width: 2000, sat: 0.88, coldness: 0.24 },
];

mkdirSync(OUT, { recursive: true });

async function grade({ file, dest, width, sat, coldness }, srcDir = SRC_PHOTOS) {
  const base = sharp(path.join(srcDir, file)).rotate().resize({ width, withoutEnlargement: true });
  const { width: w, height: h } = await base.clone().toBuffer({ resolveWithObject: true }).then((r) => r.info);

  // Kaltes Overlay im Weich-Licht-Modus: kippt vor allem die Schatten ins Blaue
  // und laesst die Lichter weitgehend stehen.
  const cold = await sharp({
    create: { width: w, height: h, channels: 4, background: { r: 18, g: 46, b: 78, alpha: coldness } },
  })
    .png()
    .toBuffer();

  const info = await base
    .modulate({ saturation: sat, brightness: 0.97 })
    .composite([{ input: cold, blend: "soft-light" }])
    // Schwarzpunkt leicht anheben und ins Blaue ziehen, damit die Fotos auf dem
    // fast schwarzen Grund nicht wie ausgestanzt wirken.
    .linear([1.02, 1.02, 1.06], [-4, -2, 2])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(OUT, dest));

  console.log(`${dest.padEnd(20)} ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
}

for (const p of CROWD) {
  try {
    await grade(p, SRC_BARS);
  } catch (e) {
    console.error(`FEHLER ${p.dest}: ${String(e.message).slice(0, 140)}`);
  }
}

// Logos unveraendert uebernehmen, nur verlustfrei verkleinert.
for (const [src, dest] of [
  ["Cocktail x Logo weiß.png", "logo-onice-white.png"],
  ["Cocktail x Logo schwarz.png", "logo-onice-black.png"],
]) {
  try {
    const info = await sharp(path.join(SRC_LOGO, src))
      .resize({ width: 720, withoutEnlargement: true })
      .png({ compressionLevel: 9 })
      .toFile(path.join(OUT, dest));
    console.log(`${dest.padEnd(20)} ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
  } catch (e) {
    console.error(`FEHLER ${dest}: ${String(e.message).slice(0, 140)}`);
  }
}
