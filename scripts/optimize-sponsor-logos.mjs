import sharp from "sharp";
import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT, "Sponsoren Logos");
const OUT_DIR = path.join(ROOT, "public", "images", "sponsors-opt");

const TARGET_HEIGHT = 128;

// strategies:
//   "alpha"      — replace RGB with white, keep source alpha (default for PNGs that already have transparent bg)
//   "luminance"  — use luminance as alpha, RGB white (for JPEGs or images with solid bg)
//   "svg-recolor" — read SVG, replace colors with white, then render
const jobs = [
  { src: "2025_FJR_Logo_White_CMYK.png", out: "rauch-v2.webp", mode: "alpha" },
  { src: "DON JULIO.jpeg", out: "don-julio-v2.webp", mode: "luminance" },
  { src: "Dionys_Logo.svg", out: "dionys-v2.webp", mode: "svg-recolor" },
  { src: "EvoilA_Logo_weiß.png", out: "evoila-v2.webp", mode: "alpha" },
  { src: "Maison_ACME_white.png", out: "maison-acme-v2.webp", mode: "alpha" },
  { src: "YE_Logo.PNG", out: "ye-v2.webp", mode: "alpha" },
  { src: "nbm_logo_url_white.png", out: "nbm-v2.webp", mode: "alpha" },
];

if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true });

async function processAlpha(buf) {
  // Resize, then force RGB to white while preserving alpha.
  const resized = await sharp(buf, { density: 300 })
    .resize({ height: TARGET_HEIGHT, withoutEnlargement: false, fit: "inside" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = resized.info;
  const out = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    out[i * 4] = 255;
    out[i * 4 + 1] = 255;
    out[i * 4 + 2] = 255;
    out[i * 4 + 3] = resized.data[i * 4 + 3];
  }
  return sharp(out, { raw: { width, height, channels: 4 } })
    .webp({ quality: 92, alphaQuality: 100 })
    .toBuffer();
}

async function processLuminance(buf) {
  // Convert to grayscale, use grayscale value as alpha, RGB = white.
  const gs = await sharp(buf)
    .resize({ height: TARGET_HEIGHT, withoutEnlargement: false, fit: "inside" })
    .removeAlpha()
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = gs.info;
  const out = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    out[i * 4] = 255;
    out[i * 4 + 1] = 255;
    out[i * 4 + 2] = 255;
    out[i * 4 + 3] = gs.data[i * channels]; // luminance as alpha
  }
  return sharp(out, { raw: { width, height, channels: 4 } })
    .webp({ quality: 92, alphaQuality: 100 })
    .toBuffer();
}

async function processSvgRecolor(buf) {
  const svg = buf
    .toString("utf-8")
    .replace(/fill\s*=\s*"(?!none|transparent)([^"]+)"/gi, 'fill="#ffffff"')
    .replace(/stroke\s*=\s*"(?!none|transparent)([^"]+)"/gi, 'stroke="#ffffff"')
    .replace(/fill\s*:\s*(?!none|transparent)[^;"]+/gi, "fill:#ffffff")
    .replace(/stroke\s*:\s*(?!none|transparent)[^;"]+/gi, "stroke:#ffffff")
    .replace(/#[0-9a-fA-F]{6}/g, "#ffffff");
  return sharp(Buffer.from(svg), { density: 300 })
    .resize({ height: TARGET_HEIGHT, withoutEnlargement: false, fit: "inside" })
    .webp({ quality: 92, alphaQuality: 100 })
    .toBuffer();
}

for (const job of jobs) {
  const srcPath = path.join(SRC_DIR, job.src);
  const outPath = path.join(OUT_DIR, job.out);
  if (!existsSync(srcPath)) {
    console.error(`MISSING: ${srcPath}`);
    continue;
  }
  const buf = await readFile(srcPath);

  let outBuf;
  if (job.mode === "luminance") outBuf = await processLuminance(buf);
  else if (job.mode === "svg-recolor") outBuf = await processSvgRecolor(buf);
  else outBuf = await processAlpha(buf);

  await writeFile(outPath, outBuf);
  const meta = await sharp(outBuf).metadata();
  console.log(
    `${job.out.padEnd(20)} ${job.mode.padEnd(12)} ${meta.width}x${meta.height}  ${(outBuf.length / 1024).toFixed(1)}KB`
  );
}

console.log("Done.");
