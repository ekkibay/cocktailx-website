"""COCKTAIL X ON ICE Key Visual, Motiv "Craft" (craft-detail.jpg, adrian.camo).
Baut 4:5, 1:1 und 16:9 ohne Frost-Pattern und ohne Sponsorenzeile.
Grading nach V3.1-Formel, Kondenswasser-Drops als einziges Winter-Element.
"""
from PIL import Image, ImageEnhance, ImageDraw, ImageFont, ImageFilter
import random, os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "out"); os.makedirs(OUT, exist_ok=True)
SRC = Image.open(os.path.join(HERE, "craft-detail.jpg")).convert("RGB")
LOGO = Image.open(os.path.join(HERE, "logo-onice-white.png")).convert("RGBA")
F = lambda n, s: ImageFont.truetype(os.path.join(HERE, "fonts", n + ".ttf"), s)

NIGHT = (11, 15, 22); ICE = (143, 216, 236); FROST = (234, 244, 248); STEEL = (138, 151, 165)


def grade_v31(im):
    base = ImageEnhance.Color(im.convert("RGB")).enhance(1.12)
    cold = base.copy()
    r, g, b = cold.split()
    r = r.point(lambda x: int(x * 0.80))
    b = b.point(lambda x: min(255, int(x * 1.20 + 10)))
    cold = ImageEnhance.Color(Image.merge("RGB", (r, g, b))).enhance(0.55)
    lum = base.convert("L")
    mask = lum.point(lambda v: max(0, min(255, int((162 - v) * 2.8))))
    return ImageEnhance.Contrast(Image.composite(cold, base, mask)).enhance(1.06)


def crop_to(im, W, H, cy_frac=0.5, cx_frac=0.5, zoom=1.0):
    """Crop source to aspect W:H, centred at (cx_frac, cy_frac) of the source, then resize."""
    sw, sh = im.size
    ar = W / H
    if sw / sh > ar:
        ch = sh / zoom; cw = ch * ar
    else:
        cw = sw / zoom; ch = cw / ar
    cx, cy = sw * cx_frac, sh * cy_frac
    x0 = min(max(0, cx - cw / 2), sw - cw); y0 = min(max(0, cy - ch / 2), sh - ch)
    return im.crop((int(x0), int(y0), int(x0 + cw), int(y0 + ch))).resize((W, H), Image.LANCZOS)


def vignette(im, bottom=0.55, top=0.25):
    """Dark NIGHT gradient at the bottom (text ground) and a soft one at the top (logo)."""
    W, H = im.size
    g = Image.new("L", (1, H))
    px = []
    for y in range(H):
        t = y / H
        a = 0
        if t > 0.52:
            a = max(a, ((t - 0.52) / 0.48) ** 1.6 * bottom)
        if t < 0.22:
            a = max(a, ((0.22 - t) / 0.22) ** 1.8 * top)
        px.append(int(255 * min(1, a)))
    g.putdata(px)
    g = g.resize((W, H))
    night = Image.new("RGB", (W, H), NIGHT)
    return Image.composite(night, im, g)


def condensation(im, seed=7, density=1.0, region=(0.0, 0.0, 1.0, 0.55)):
    """Kondenswasser: kleine Tropfen mit weichem Glow plus wenige feine Laufspuren.
    Nur auf dunklen Bildbereichen, damit Hand und Glaeser frei bleiben."""
    W, H = im.size
    rnd = random.Random(seed)
    lum = im.convert("L").filter(ImageFilter.GaussianBlur(6))
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    x0, y0, x1, y1 = [int(v * s) for v, s in zip(region, (W, H, W, H))]
    n = int(70 * density * (W * H) / (1080 * 1350))
    placed = 0
    tries = 0
    while placed < n and tries < n * 30:
        tries += 1
        x, y = rnd.randint(x0, x1), rnd.randint(y0, y1)
        if lum.getpixel((x, y)) > 55:
            continue
        r = rnd.choice([1.5, 2, 2.5, 3, 3.5, 4.5, 6, 7.5])
        a = int(rnd.uniform(120, 230))
        col = (232, 244, 250, a)
        d.ellipse((x - r, y - r, x + r, y + r), fill=col)
        # Laufspur: nur bei groesseren Tropfen, senkrecht nach unten, sehr fein
        if r >= 3 and rnd.random() < 0.7:
            L = rnd.randint(int(H * 0.05), int(H * 0.16))
            for k in range(L):
                aa = int(a * 0.55 * (1 - k / L))
                d.point((x, y - L + k), fill=(220, 238, 246, aa))
        placed += 1
    glow = layer.filter(ImageFilter.GaussianBlur(3))
    glow = Image.eval(glow.split()[3], lambda v: int(v * 0.5))
    glow_rgba = Image.merge("RGBA", (*Image.new("RGB", (W, H), ICE).split(), glow))
    out = im.convert("RGBA")
    out.alpha_composite(glow_rgba)
    out.alpha_composite(layer)
    return out.convert("RGB")


def text_block(im, x, y, big, small, tag, fonts, ice_line=True):
    """COCKTAIL X (FROST) / ON ICE (ICE) / Tagline (mono, FROST). Rueckgabe: untere Kante."""
    d = ImageDraw.Draw(im)
    f1, f2, f3 = fonts
    d.text((x, y), "COCKTAIL X", font=f1, fill=FROST)
    bb = d.textbbox((x, y), "COCKTAIL X", font=f1)
    y2 = bb[3] + int(big * 0.02)
    d.text((x, y2), "ON ICE", font=f2, fill=ICE if ice_line else FROST)
    bb2 = d.textbbox((x, y2), "ON ICE", font=f2)
    y3 = bb2[3] + int(big * 0.22)
    d.text((x, y3), tag, font=f3, fill=FROST)
    return d.textbbox((x, y3), tag, font=f3)[3]


def put_logo(im, x, y, w):
    lg = LOGO.resize((w, int(LOGO.height * w / LOGO.width)), Image.LANCZOS)
    im.paste(lg, (x, y), lg)


TAG = "17.-28.11.2026 · MÜNCHEN · 40+ BARS"


def build_4x5():
    W, H = 1080, 1350
    im = crop_to(SRC, W, H, cy_frac=0.47, zoom=1.0)
    im = grade_v31(im)
    im = vignette(im, bottom=0.72, top=0.22)
    im = condensation(im, seed=11, density=0.7, region=(0, 0, 1, 0.42))
    put_logo(im, 60, 60, 230)
    fonts = (F("barlow-condensed-latin-800-normal", 178), F("barlow-condensed-latin-800-normal", 150), F("geist-mono-latin-500-normal", 31))
    text_block(im, 60, 890, 178, 150, TAG, fonts)
    im.save(os.path.join(OUT, "kv-onice-craft-4x5.png"), optimize=True)
    im.convert("RGB").save(os.path.join(OUT, "kv-onice-craft-4x5.jpg"), quality=88)


def build_1x1():
    W, H = 1080, 1080
    im = crop_to(SRC, W, H, cy_frac=0.46, zoom=1.0)
    im = grade_v31(im)
    im = vignette(im, bottom=0.62, top=0.22)
    im = condensation(im, seed=5, density=0.65, region=(0, 0, 1, 0.42))
    put_logo(im, 56, 56, 210)
    fonts = (F("barlow-condensed-latin-800-normal", 150), F("barlow-condensed-latin-800-normal", 126), F("geist-mono-latin-500-normal", 27))
    text_block(im, 56, 700, 150, 126, TAG, fonts)
    im.save(os.path.join(OUT, "kv-onice-craft-1x1.png"), optimize=True)
    im.convert("RGB").save(os.path.join(OUT, "kv-onice-craft-1x1.jpg"), quality=88)


def build_16x9():
    """Hero: Foto rechts (Ausschnitt um Hand und Glaeser), links NIGHT-Flaeche als Textgrund,
    weich ineinander geblendet. Quelle ist Hochformat, deshalb kein Vollbild-Crop."""
    W, H = 1920, 1080
    PW = 1250
    photo = crop_to(SRC, PW, H, cy_frac=0.46, zoom=1.0)
    photo = grade_v31(photo)
    im = Image.new("RGB", (W, H), NIGHT)
    im.paste(photo, (W - PW, 0))
    # Blend: von x=W-PW bis +420 px NIGHT ausblenden
    g = Image.new("L", (W, 1))
    x0 = W - PW; span = 460
    g.putdata([int(255 * max(0, min(1, 1 - (x - x0) / span)) ** 1.3) if x >= x0 else 255 for x in range(W)])
    g = g.resize((W, H))
    im = Image.composite(Image.new("RGB", (W, H), NIGHT), im, g)
    im = vignette(im, bottom=0.30, top=0.15)
    im = condensation(im, seed=3, density=0.55, region=(0.25, 0, 0.95, 0.5))
    put_logo(im, 100, 90, 270)
    fonts = (F("barlow-condensed-latin-800-normal", 232), F("barlow-condensed-latin-800-normal", 200), F("geist-mono-latin-500-normal", 34))
    text_block(im, 100, 400, 232, 200, TAG, fonts)
    im.save(os.path.join(OUT, "kv-onice-craft-16x9.png"), optimize=True)
    im.convert("RGB").save(os.path.join(OUT, "kv-onice-craft-16x9.jpg"), quality=88)


if __name__ == "__main__":
    build_4x5(); build_1x1(); build_16x9()
    for f in sorted(os.listdir(OUT)):
        print(f, os.path.getsize(os.path.join(OUT, f)) // 1024, "KB")
