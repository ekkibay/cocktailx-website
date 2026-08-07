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
// Zweite Quelle: Festivaltag-Strecke mit Gaesten. Die CX25-Bilder zeigen fast
// nur Details und Personal, hier gibt es Gruppen mit Drinks in der Hand.
const SRC_CROWD =
  "c:/Users/kerge/OneDrive - Hospitality Circle GmbH/003 bayundco/002 ABTEILUNGEN/020 VERTRIEB UND MARKETING/022 MARKETING PR/001 AUFRÄUMEN/005 MATERIAL/CX FESTIVAL FOTAGE/2024 MATERIAL/PatrickVomBerg_Cocktail_X_Tag_5_Bilder_240428";

/**
 * @param {string} file      Quelldatei
 * @param {string} dest      Zielname
 * @param {number} width     Zielbreite
 * @param {number} sat       Saettigung (1 = unveraendert)
 * @param {number} coldness  Staerke des kalten Overlays, 0 bis 1
 */
const PHOTOS = [
  // Hero: Barkeeper an der Station, dunkelstes Motiv mit echtem Bar-Licht
  { file: "OBVS X COcktailX-01749.jpg", dest: "onice-hero.jpg", width: 2400, sat: 0.86, coldness: 0.3 },
  { file: "OBVS X COcktailX-01400.jpg", dest: "onice-pour.jpg", width: 1800, sat: 0.86, coldness: 0.28 },
  { file: "OBVS X COcktailX-01565 (1).jpg", dest: "onice-tux.jpg", width: 1800, sat: 0.86, coldness: 0.3 },
  { file: "OBVS X COcktailX-01723.jpg", dest: "onice-ice.jpg", width: 1800, sat: 0.9, coldness: 0.34 },
  { file: "OBVS X COcktailX-01725.jpg", dest: "onice-guests.jpg", width: 1800, sat: 0.84, coldness: 0.3 },
  // 02071 und 02128 sind stark magenta beleuchtet: staerker entsaettigen,
  // sonst kippt das Pink gegen den eisblauen Akzent.
  { file: "OBVS X COcktailX-02071.jpg", dest: "onice-cheers.jpg", width: 1800, sat: 0.4, coldness: 0.55 },
  { file: "OBVS X COcktailX-02128.jpg", dest: "onice-bar.jpg", width: 1800, sat: 0.4, coldness: 0.55 },
];

/**
 * Gaeste-Motive: viele Leute, gute Stimmung, Drink im Vordergrund.
 * Die werden weniger stark entsaettigt als die Detailaufnahmen, weil die
 * Waerme hier die Emotion traegt und nicht stoert.
 */
const CROWD = [
  // Paar, lachend, Drinks nach vorn gehalten
  { file: "STUDIO VOM BERG_-1042307.jpg", dest: "onice-crowd-cheers.jpg", width: 2000, sat: 0.92, coldness: 0.24 },
  // Drei Gaeste stossen an, Glaeser im Vordergrund
  { file: "STUDIO VOM BERG_-1042310.jpg", dest: "onice-crowd-toast.jpg", width: 2000, sat: 0.92, coldness: 0.24 },
  // Gruppe drinnen, alle mit Glas, warmes Licht
  { file: "STUDIO VOM BERG_-1042327.jpg", dest: "onice-crowd-group.jpg", width: 2000, sat: 0.9, coldness: 0.26 },
  // Gruppe auf der Strasse bei Nacht, Muenchen, Drinks in der Hand
  { file: "STUDIO VOM BERG_-1042330.jpg", dest: "onice-crowd-street.jpg", width: 2400, sat: 0.9, coldness: 0.28 },
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

for (const p of PHOTOS) {
  try {
    await grade(p);
  } catch (e) {
    console.error(`FEHLER ${p.dest}: ${String(e.message).slice(0, 140)}`);
  }
}

for (const p of CROWD) {
  try {
    await grade(p, SRC_CROWD);
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
