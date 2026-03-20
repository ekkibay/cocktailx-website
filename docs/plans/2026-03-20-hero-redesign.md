# Hero Section Redesign

**Goal:** Improve conversion, clarity and visual hierarchy of the Hero section by reducing visual noise, sharpening content hierarchy, and making the CTA self-explanatory.

---

## 1. Background: Reduce Visual Noise

**Problem:** The half-circle pattern competes with headline, portrait, countdown and CTA.

**Solution:**
- Darken gradient overlay: `from-licorice/80 via-licorice/90 to-licorice`
- Add radial gradient "spotlight" in the center to further isolate content
- Pattern remains as subtle texture, barely visible

---

## 2. Information Hierarchy: Reorder Content

**Problem:** No clear visual flow. Users see headline first, then get lost between portrait, date badge, countdown and CTA.

**New order (top to bottom):**

1. **Badge** (date/location) — dezent, informational
2. **Headline** — `cocktail ✦ festival` — largest element, brand anchor
3. **Subheadline** — new element, value proposition (e.g. "Erlebe 50+ Bars, exklusive Drinks und unvergessliche Festival-Momente in ganz München.")
4. **Countdown label** — "Noch X Tage bis zum Start"
5. **Countdown numbers** — days : hours : minutes : seconds
6. **CTA button** — primary action
7. **Trust line** — small benefit points below button

**Spacing hierarchy:**
- Badge → Headline: tight (mb-3/4), they belong together
- Headline → Subheadline: medium (mb-4/6)
- Subheadline → Countdown: large (mb-8/10)
- Countdown → CTA: large (mb-8/10)
- CTA → Trust line: small (mb-3)

---

## 3. CTA: Make It Self-Explanatory

**Problem:** "Passport holen" is brand-internal language. New visitors don't know what a "Passport" is.

**Solution:**
- DE: "Jetzt Festival Pass sichern"
- EN: "Get Your Festival Pass"
- Below the button, add a small trust/clarification line:
  - DE: "50+ Bars · Limitierte Pässe · Exklusive Erlebnisse"
  - EN: "50+ Bars · Limited Passes · Exclusive Experiences"

---

## 4. Countdown: Add Semantic Context

**Problem:** Numbers without context are decoration, not motivation.

**Solution:**
- Add label above countdown: "Noch X Tage bis zum Start" / "X days until the festival"
- This creates emotional urgency and makes the countdown meaningful

---

## 5. Portrait: Reduce to Accent

**Problem:** Image card sits between date, headline and countdown — blocks hierarchy.

**Solution:**
- Make image card slightly smaller
- Reduce opacity to ~70% so it reads as atmosphere, not content
- Keep it positioned behind headline only

---

## 6. Badge Styling

**Current:** `border-2 border-tangerine font-bold text-sm`
**New:** `border border-tangerine font-normal text-xs md:text-sm` — thinner, lighter, more subtle

---

## 7. Button Styling

**Current:** `font-normal text-xl md:text-2xl px-8 py-3.5`
**New:** `font-semibold text-lg md:text-xl px-10 py-4 tracking-wide` — better proportioned, more confident

---

## 8. Header: Differentiate CTA Hierarchy

**Problem:** Header CTA and Hero CTA are both primary (solid orange), competing for attention.

**Solution:**
- Header button: change to `btn-secondary` (outline style)
- Hero button: remains the only primary CTA on screen
- Nav links: switch from `font-display` to `font-body` at small sizes, increase to `text-sm`

---

## 9. New i18n Keys Required

```json
{
  "hero": {
    "subheadline": "Erlebe 50+ Bars, exklusive Drinks und unvergessliche Festival-Momente in ganz München.",
    "countdownLabel": "Noch {days} Tage bis zum Start",
    "trustLine": "50+ Bars · Limitierte Pässe · Exklusive Erlebnisse"
  }
}
```

English:
```json
{
  "hero": {
    "subheadline": "Experience 50+ bars, exclusive drinks and unforgettable festival moments across Munich.",
    "countdownLabel": "{days} days until the festival",
    "trustLine": "50+ Bars · Limited Passes · Exclusive Experiences"
  }
}
```

---

## Files to Modify

- `src/components/sections/Hero.tsx` — reorder content, add subheadline, countdown label, trust line
- `src/components/ui/Countdown.tsx` — no changes needed (label lives in Hero)
- `src/app/globals.css` — update btn-primary styles
- `src/i18n/de.json` — new keys + updated CTA
- `src/i18n/en.json` — new keys + updated CTA
- `src/components/layout/Header.tsx` — nav link font, button style
