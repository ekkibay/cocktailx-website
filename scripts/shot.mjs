// Screenshot einer laufenden Seite ueber das Chrome DevTools Protocol.
//
// Gedacht zum Gegenlesen von Layout und Bildausschnitten. Ohne das hier
// bleibt jede Aussage ueber "sitzt der Ausschnitt" geraten, weil die
// Zuschnitte erst im Browser entstehen: object-cover schneidet abhaengig
// von der tatsaechlichen Kachelgroesse, nicht von der Bilddatei.
//
//   node scripts/shot.mjs <url> <ziel.png> [breite] [hoehe]
//
// Ohne Hoehe wird die ganze Seite aufgenommen, sonst nur der Viewport.
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";
import path from "node:path";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT = 9333;

const [url, out, wArg, hArg] = process.argv.slice(2);
if (!url || !out) {
  console.error("Aufruf: node scripts/shot.mjs <url> <ziel.png> [breite] [hoehe]");
  process.exit(1);
}
const width = Number(wArg) || 1440;
const viewportHeight = Number(hArg) || 900;
const fullPage = !hArg;

const chrome = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  `--remote-debugging-port=${PORT}`,
  `--window-size=${width},${viewportHeight}`,
  "--user-data-dir=" + path.join(process.env.TEMP || ".", "cx-shot-profile"),
  "about:blank",
], { stdio: "ignore" });

/** Wartet, bis der Debug-Port antwortet. Chrome braucht dafuer einen Moment. */
async function target() {
  for (let i = 0; i < 60; i++) {
    try {
      const list = await fetch(`http://127.0.0.1:${PORT}/json`).then((r) => r.json());
      const page = list.find((t) => t.type === "page");
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {
      /* Port noch nicht offen */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error("Chrome hat den Debug-Port nicht geoeffnet");
}

const wsUrl = await target();
const ws = new WebSocket(wsUrl);
await new Promise((res, rej) => {
  ws.addEventListener("open", res, { once: true });
  ws.addEventListener("error", rej, { once: true });
});

let id = 0;
const pending = new Map();
ws.addEventListener("message", (ev) => {
  const msg = JSON.parse(typeof ev.data === "string" ? ev.data : "");
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg.result ?? msg.error);
    pending.delete(msg.id);
  }
});

/**
 * Jeder Aufruf bekommt eine Frist. Ohne die haengt das Skript stumm, wenn
 * Chrome eine Antwort verschluckt, und das ist beim Debuggen unbrauchbar.
 */
const send = (method, params = {}, ms = 45000) =>
  new Promise((res, rej) => {
    const n = ++id;
    const t = setTimeout(() => {
      pending.delete(n);
      rej(new Error(`${method} ohne Antwort nach ${ms} ms`));
    }, ms);
    pending.set(n, (r) => {
      clearTimeout(t);
      res(r);
    });
    ws.send(JSON.stringify({ id: n, method, params }));
  });

await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width,
  height: viewportHeight,
  deviceScaleFactor: 1,
  mobile: width < 700,
});
console.error("  navigate " + url);
await send("Page.navigate", { url }, 90000);
// Cookie-Banner wegnehmen, sonst verdeckt es beim Gegenlesen genau den
// Kauf-Button im Hero. Ablehnen, damit nichts nachgeladen wird.
await new Promise((r) => setTimeout(r, 1500));
await send("Runtime.evaluate", { expression: `localStorage.setItem("meta_pixel_consent","denied")` });
await send("Page.reload", {});
// Kein Warten auf ein Event: die Seite animiert beim Scrollen nach, deshalb
// zaehlt hier ohnehin nur, dass Bilder und Schriften geladen sind.
await new Promise((r) => setTimeout(r, 4000));

const capture = async () => {
  const shot = await send("Page.captureScreenshot", { format: "png" }, 60000);
  return Buffer.from(shot.data, "base64");
};

if (!fullPage) {
  writeFileSync(out, await capture());
  console.log(`${out}  Viewport ${width}x${viewportHeight}`);
} else {
  // captureBeyondViewport haengt auf dieser Seite. Also kachelweise: scrollen,
  // Viewport aufnehmen, hinterher zusammensetzen. Nebeneffekt, der hier sogar
  // hilft: jede Kachel sieht dieselbe Viewporthoehe, damit stimmen svh-Werte
  // und der Hero ist so hoch wie im echten Browser.
  const { cssContentSize } = await send("Page.getLayoutMetrics");
  const total = Math.ceil(cssContentSize.height);
  const offsets = [];
  for (let y = 0; y < total; y += viewportHeight) offsets.push(Math.min(y, total - viewportHeight));

  const tiles = [];
  for (let i = 0; i < offsets.length; i++) {
    await send("Runtime.evaluate", { expression: `window.scrollTo(0, ${offsets[i]})` });
    // Ab der zweiten Kachel die fixierten Elemente ausblenden, sonst klebt
    // die Navigation in jedem Streifen und das Bild luegt.
    if (i === 1) {
      await send("Runtime.evaluate", {
        expression: `(() => {
          const s = document.createElement("style");
          s.id = "__shot_hide_fixed";
          const sel = [...document.querySelectorAll("body *")]
            .filter((el) => getComputedStyle(el).position === "fixed")
            .map((el, n) => { el.dataset.shotFixed = n; return '[data-shot-fixed="' + n + '"]'; });
          s.textContent = sel.join(",") + "{visibility:hidden !important}";
          if (sel.length) document.head.appendChild(s);
        })()`,
      });
    }
    await new Promise((r) => setTimeout(r, 420));
    tiles.push({ top: offsets[i], buf: await capture() });
  }

  const { default: sharp } = await import("sharp");
  const composite = [];
  let cursor = 0;
  for (const t of tiles) {
    const overlap = cursor - t.top;
    if (overlap >= viewportHeight) continue;
    const buf = overlap > 0
      ? await sharp(t.buf).extract({ left: 0, top: overlap, width, height: viewportHeight - overlap }).png().toBuffer()
      : t.buf;
    composite.push({ input: buf, left: 0, top: cursor });
    cursor += viewportHeight - Math.max(0, overlap);
  }
  await sharp({ create: { width, height: total, channels: 3, background: { r: 5, g: 7, b: 11 } } })
    .composite(composite)
    .png()
    .toFile(out);
  console.log(`${out}  ${width}x${total}, ${tiles.length} Kacheln`);
}

ws.close();
chrome.kill();
process.exit(0);