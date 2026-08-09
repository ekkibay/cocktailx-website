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
const SRC_CLOSING =
  "c:/Users/kerge/OneDrive - Hospitality Circle GmbH/003 bayundco/002 ABTEILUNGEN/020 VERTRIEB UND MARKETING/022 MARKETING PR/001 AUFRÄUMEN/005 MATERIAL/CX FESTIVAL FOTAGE/2023 MATERIAL/johannesrittermedia_cocktail_x_-_abschluss";
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
// Aus dieser Strecke sind drei starke Motive bewusst NICHT dabei:
// -02194 und -02197 zeigen das aufgeschlagene Booklet mit dem Namen der Bar,
// -02855 die Leuchtschrift der Bar ueber dem Eingang. Solange das Re-Signing
// laeuft, darf keine Bar erkennbar sein. Nach dem Reveal wieder aufnehmbar.
const CROWD = [
  // Gruppe am Tisch in der Bar
  { file: "CocktailX -02231.jpg", dest: "onice-bar-table.jpg", width: 1700 },
  // Barkeeper arbeitet, Gold auf Schwarz
  { file: "CocktailX -02394.jpg", dest: "onice-bar-keeper.jpg", width: 1700 },
  // Angestossene Glaeser ueber dem Tresen. Oben stehen Erdbeeren und ein
  // Zitrusbaum im Bild, das liest Sommer, unten laeuft es ins Leere. Der
  // Ausschnitt haelt genau die Mitte: Anstossen in Bernstein auf Schwarz.
  { file: "CocktailX -02753.jpg", dest: "onice-bar-clink.jpg", width: 2200, cropTop: 0.27, cropBottom: 0.34, cropRight: 0.21 },
  // Einschenken aus dem Shaker
  { file: "CocktailX -02704.jpg", dest: "onice-bar-pour.jpg", width: 1400 },
  // Zwei Gaeste lachen, Bar im Hintergrund
  { file: "CocktailX -02996.jpg", dest: "onice-bar-friends.jpg", width: 1400 },
];

/** Abschlussabend: elegantere Gaeste, Drinks im Gegenlicht, Eisskulptur. */
const CLOSING = [
  // Eisblock mit eingraviertem Logo, tuerkis beleuchtet. Buchstaeblich ON ICE.
  { file: "CocktailX -09007.jpg", dest: "onice-ice-logo.jpg", width: 2000 },
  // Reihe hinterleuchteter Drinks am Tresen: Geschmack und Handwerk
  { file: "CocktailX -09037.jpg", dest: "onice-drinks-row.jpg", width: 1400 },
  // -09042 und -09044 sind raus: dort steht eine Sektflasche im Eiskuebel und
  // dahinter ein fremd gebrandeter Kuehlschrank. Beides hat mit Cocktail X
  // nichts zu tun und laesst das Bild nach Sektempfang aussehen.
  // Zwei Gaeste heben ihre Drinks, Grapefruit im Glas, Blick in die Kamera
  { file: "CocktailX -09104.jpg", dest: "onice-toast-two.jpg", width: 1700 },
  // Lachen mit Drink in der Hand vor der blauen Nacht
  { file: "CocktailX -09133.jpg", dest: "onice-smile.jpg", width: 1400 },
  // Arm in Arm, beide mit Drink. Miteinander statt Produktaufnahme
  { file: "CocktailX -09154.jpg", dest: "onice-arm-in-arm.jpg", width: 1700 },
  // Zwei Gaeste lachen miteinander
  { file: "CocktailX -09216.jpg", dest: "onice-two-women.jpg", width: 1400 },
  // Runde am Gelaender, dahinter die Lichter der Stadt. Stadt erkunden.
  { file: "CocktailX -09202.jpg", dest: "onice-skyline.jpg", width: 1700 },
  // Gaeste im Gespraech, Drinks in der Hand, dahinter die blaue Nachtfront.
  // Warme Gesichter vor kalter Stadt: genau das Klima von ON ICE. Hero.
  { file: "CocktailX -08927.jpg", dest: "onice-talk.jpg", width: 2400 },
  // Gruppe am Tisch, Glaeser in der Hand
  { file: "CocktailX -08936.jpg", dest: "onice-group-table.jpg", width: 1400 },
  // Portraet mit Drink, elegant
  { file: "CocktailX -08919.jpg", dest: "onice-portrait.jpg", width: 1400 },
  // Einzelner Drink auf dem Tresen, Eis, Gegenlicht
  { file: "CocktailX -08830.jpg", dest: "onice-drink-solo.jpg", width: 1400 },
];

/* ── Geliefertes Bildset V1 ──────────────────────────────────────────────
   Studio-Strecke, kommt bereits gegraded an (V3.1). Deshalb laeuft sie
   nicht durch das Grading oben, sondern nur ueber Zuschnitt, Skalierung
   und einen Hauch kaltes Overlay, damit sie im selben Klima sitzt.

   RECHTE: Geklaert fuer Website und Werbung mit adrian.camo und
   STUDIO VOM BERG. Die beiliegende Lieferdatei fuehrte sie noch als offen,
   das ist erledigt. Credits: STUDIO VOM BERG (hero-coupe), sonst
   adrian.camo. Siehe public/images/onice/CREDITS.md.

   Vier Motive der Lieferung sind bewusst nicht dabei:
   - trail-nightcap-whisky: die Drinks-Karte im Bild nennt den Bar-Namen
     lesbar, dazu ist es ein Opening-Motiv in Pink, nicht Nightcap.
   - corporate-team-nights: das Rueckbuffet ist eine Wand aus fremden
     Marken und macht die Bar eindeutig identifizierbar.
   - chapter-after-market: Weinglas und Risotto-Teller im Vordergrund,
     das liest Restaurant statt Bar.
   - trail-hotel-bar-icons: Weinglas, kein Gesicht.                        */
const SRC_SET = path.join(ROOT, "src", "assets", "bildset-v1");

const DELIVERED = [
  // Eis kommt ins Glas. Fuer ON ICE das praezisere Bild als jedes Portraet.
  { file: "how-it-works-eis.jpg", dest: "set-eis.jpg", width: 1600 },
  // Abguss ueber den grossen Eiswuerfel
  { file: "chapter-first-frost.jpg", dest: "set-first-frost.jpg", width: 1600 },
  // Vier verschiedene Drinks auf einem Tisch: Geschmack und Vielfalt
  { file: "chapter-city-trails.jpg", dest: "set-drinks-four.jpg", width: 1600 },
  // Barkeeper ruehrt einen Highball
  { file: "trail-fire-fruit.jpg", dest: "set-stir.jpg", width: 1400 },
  // Garnitur auf die helle Coupe
  { file: "trail-zero-light.jpg", dest: "set-garnish.jpg", width: 1400 },
  // Pipette ueber zwei Coupes, Goldtablett. Liest wie eine grosse Hotelbar.
  { file: "craft-detail.jpg", dest: "set-craft.jpg", width: 1600 },
  // Einzelne Coupe mit Schaum vor Bokeh
  { file: "hero-coupe.jpg", dest: "set-coupe.jpg", width: 2000, cropRight: 0.28 },
  // Fuenf Gaeste stossen an. Unten liegen Teller und ein Weinglas, oben
  // laeuft die Wand aus. Der Ausschnitt sitzt deshalb eng auf Gesichtern
  // und Glaesern: als breites Band bleibt sonst nur der Scheitel stehen.
  {
    file: "crew-pass-community.jpg",
    dest: "set-crew-toast.jpg",
    width: 2000,
    cropTop: 0.3,
    cropBottom: 0.4,
  },
];

mkdirSync(OUT, { recursive: true });

/**
 * Grading mit Punch.
 *
 * Die erste Fassung legte ein kaltes Overlay im Weich-Licht-Modus darueber und
 * hob den Schwarzpunkt an. Ergebnis war ein Bild, das flacher wirkte als das
 * Original: milchige Schatten, wenig Leuchtkraft, keine Aussage.
 *
 * Jetzt andersherum. Der Kontrast macht die Arbeit, die Schatten laufen tief
 * und bekommen ihren Blaustich ueber den Versatz je Kanal statt ueber eine
 * Deckschicht. Die Saettigung geht leicht hoch, damit Bernstein und Bar-Licht
 * strahlen. Das Overlay bleibt nur als leichter Hauch fuer das Gesamtklima.
 */
async function grade(
  { file, dest, width, coldness = 0.1, cropTop = 0, cropBottom = 0, cropRight = 0 },
  srcDir = SRC_BARS,
) {
  let pre = sharp(path.join(srcDir, file)).rotate();

  // Die crop-Werte schneiden Anteile an den Raendern ab, bevor skaliert wird.
  // Gedacht fuer Motive, bei denen nur der Rand stoert und die Mitte steht.
  // Als Anteil notiert, damit der Wert unabhaengig von der Quellaufloesung gilt.
  if (cropTop > 0 || cropBottom > 0 || cropRight > 0) {
    const m = await pre.metadata();
    pre = pre.extract({
      left: 0,
      top: Math.round(m.height * cropTop),
      width: Math.round(m.width * (1 - cropRight)),
      height: Math.round(m.height * (1 - cropTop - cropBottom)),
    });
  }

  const base = pre.resize({ width, withoutEnlargement: true });
  const { width: w, height: h } = await base.clone().toBuffer({ resolveWithObject: true }).then((r) => r.info);

  const cold = await sharp({
    create: { width: w, height: h, channels: 4, background: { r: 18, g: 46, b: 78, alpha: coldness } },
  })
    .png()
    .toBuffer();

  const info = await base
    .modulate({ saturation: 1.14, brightness: 1.0 })
    // Kontrast plus negativer Versatz: tiefe Schatten. Der Blaukanal wird
    // weniger stark abgesenkt, dadurch bleiben die Schatten kuehl.
    .linear([1.32, 1.32, 1.34], [-30, -28, -22])
    .gamma(1.04)
    .composite([{ input: cold, blend: "soft-light" }])
    .sharpen({ sigma: 0.8 })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(path.join(OUT, dest));

  console.log(`${dest.padEnd(22)} ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
}

/**
 * Schonender Weg fuer die gelieferte Strecke.
 *
 * Die Bilder kommen fertig gegraded an. Wuerde das Grading von oben noch
 * einmal darueberlaufen, saufen die Schatten ab und die Farben kippen.
 * Also nur Zuschnitt, Skalierung und ein Hauch kaltes Overlay.
 */
async function passThrough({ file, dest, width, cropTop = 0, cropBottom = 0, cropRight = 0 }) {
  let pre = sharp(path.join(SRC_SET, file)).rotate();

  if (cropTop > 0 || cropBottom > 0 || cropRight > 0) {
    const m = await pre.metadata();
    pre = pre.extract({
      left: 0,
      top: Math.round(m.height * cropTop),
      width: Math.round(m.width * (1 - cropRight)),
      height: Math.round(m.height * (1 - cropTop - cropBottom)),
    });
  }

  const base = pre.resize({ width, withoutEnlargement: true });
  const { width: w, height: h } = await base.clone().toBuffer({ resolveWithObject: true }).then((r) => r.info);

  const cold = await sharp({
    create: { width: w, height: h, channels: 4, background: { r: 18, g: 46, b: 78, alpha: 0.05 } },
  })
    .png()
    .toBuffer();

  const info = await base
    .composite([{ input: cold, blend: "soft-light" }])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(OUT, dest));

  console.log(`${dest.padEnd(22)} ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
}

for (const p of CROWD) {
  try {
    await grade(p, SRC_BARS);
  } catch (e) {
    console.error(`FEHLER ${p.dest}: ${String(e.message).slice(0, 140)}`);
  }
}

for (const p of DELIVERED) {
  try {
    await passThrough(p);
  } catch (e) {
    console.error(`FEHLER ${p.dest}: ${String(e.message).slice(0, 140)}`);
  }
}

for (const p of CLOSING) {
  try {
    await grade(p, SRC_CLOSING);
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
