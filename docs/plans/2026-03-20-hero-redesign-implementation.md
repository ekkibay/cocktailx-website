# Hero Section Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the Hero section to improve conversion, reduce visual noise, sharpen content hierarchy, and make the CTA self-explanatory.

**Architecture:** Modify existing Hero.tsx component (reorder content, add new elements), update i18n files with new keys, adjust global CSS button styles, and differentiate Header CTA from Hero CTA. No new components needed — Countdown.tsx stays unchanged.

**Tech Stack:** Next.js 14 (App Router), Tailwind CSS, Framer Motion, next-intl

**Note:** Only Geist font weights 100 (Thin) and 700 (Bold) are available. Use `font-bold` where the design says `font-semibold`.

---

### Task 1: Add New i18n Keys

**Files:**
- Modify: `src/i18n/de.json`
- Modify: `src/i18n/en.json`

**Step 1: Add German translations**

In `src/i18n/de.json`, update the `hero` section to add new keys and update the CTA:

```json
"hero": {
    "title": "cocktail \u2726 festival",
    "subtitle": "M\u00dcNCHEN \u00b7 13.\u201330. MAI \u00b7 2026",
    "subheadline": "Erlebe 50+ Bars, exklusive Drinks und unvergessliche Festival-Momente in ganz M\u00fcnchen.",
    "countdownLabel": "Noch {days} Tage bis zum Start",
    "cta": "Jetzt Festival Pass sichern",
    "trustLine": "50+ Bars \u00b7 Limitierte P\u00e4sse \u00b7 Exklusive Erlebnisse",
    "days": "Tage",
    "hours": "Stunden",
    "minutes": "Minuten",
    "seconds": "Sekunden"
}
```

**Step 2: Add English translations**

In `src/i18n/en.json`, update the `hero` section:

```json
"hero": {
    "title": "cocktail \u2726 festival",
    "subtitle": "MUNICH \u00b7 MAY 13\u201330 \u00b7 2026",
    "subheadline": "Experience 50+ bars, exclusive drinks and unforgettable festival moments across Munich.",
    "countdownLabel": "{days} days until the festival",
    "cta": "Get Your Festival Pass",
    "trustLine": "50+ Bars \u00b7 Limited Passes \u00b7 Exclusive Experiences",
    "days": "Days",
    "hours": "Hours",
    "minutes": "Minutes",
    "seconds": "Seconds"
}
```

**Step 3: Verify in browser**

Run: open `http://localhost:3000` and check the Hero section renders without errors.
Expected: Page loads, existing hero still works (new keys are not yet used in JSX).

**Step 4: Commit**

```bash
git add src/i18n/de.json src/i18n/en.json
git commit -m "feat(i18n): add hero subheadline, countdown label, trust line and update CTA text"
```

---

### Task 2: Darken Background and Add Spotlight

**Files:**
- Modify: `src/components/sections/Hero.tsx` (lines 30-32)

**Step 1: Update gradient overlay and add radial spotlight**

In `Hero.tsx`, replace the two background divs (pattern + linear gradient overlay) with three layers:

```tsx
{/* Pattern Background */}
<div className="absolute inset-0" style={{ backgroundImage: 'url(/images/pattern-bg.svg)', backgroundSize: '200px 200px', backgroundRepeat: 'repeat' }} />
{/* Darken overlay */}
<div className="absolute inset-0 bg-gradient-to-b from-licorice/80 via-licorice/90 to-licorice" />
{/* Radial spotlight to isolate center content */}
<div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center 40%, transparent 0%, rgba(25,21,19,0.6) 70%)' }} />
```

The old overlay was `from-licorice/60 via-licorice/80 to-licorice`. The new one is darker: `/80` and `/90`. The radial gradient creates a subtle spotlight effect that further isolates the central content area.

**Step 2: Verify in browser**

Expected: Pattern is much more subdued. Center of the hero feels cleaner and more focused. The content area has more visual breathing room.

**Step 3: Commit**

```bash
git add src/components/sections/Hero.tsx
git commit -m "feat(hero): darken background overlay and add radial spotlight"
```

---

### Task 3: Reduce Portrait to Accent

**Files:**
- Modify: `src/components/sections/Hero.tsx` (lines 35-60, the image card block)

**Step 1: Make image card smaller and semi-transparent**

Replace the image card `motion.div` className:

Old:
```
className="absolute top-[10%] md:top-[12%] lg:top-[14%] w-[160px] h-[210px] md:w-[220px] md:h-[280px] lg:w-[260px] lg:h-[330px]"
```

New:
```
className="absolute top-[10%] md:top-[12%] lg:top-[14%] w-[140px] h-[185px] md:w-[190px] md:h-[250px] lg:w-[220px] lg:h-[290px] opacity-70"
```

Changes: dimensions ~15% smaller on each breakpoint, added `opacity-70` so the image reads as atmosphere rather than competing content.

**Step 2: Verify in browser**

Expected: Image card is noticeably smaller and more transparent. It sits behind the headline as a subtle accent, not a content blocker.

**Step 3: Commit**

```bash
git add src/components/sections/Hero.tsx
git commit -m "feat(hero): reduce portrait to subtle accent with smaller size and opacity"
```

---

### Task 4: Restyle Badge

**Files:**
- Modify: `src/components/sections/Hero.tsx` (line 68, the badge `motion.span`)

**Step 1: Update badge classes**

Old:
```
className="mb-3 md:mb-4 inline-block px-5 py-2 border-2 border-tangerine rounded-full text-sm md:text-base font-body text-tangerine tracking-[0.25em] uppercase font-bold"
```

New:
```
className="mb-3 md:mb-4 inline-block px-4 py-1.5 border border-tangerine/60 rounded-full text-xs md:text-sm font-body text-tangerine tracking-[0.25em] uppercase font-normal"
```

Changes: `border-2` → `border`, `border-tangerine` → `border-tangerine/60` (subtler), `text-sm md:text-base` → `text-xs md:text-sm` (smaller), `font-bold` → `font-normal` (lighter), `px-5 py-2` → `px-4 py-1.5` (tighter padding).

**Step 2: Verify in browser**

Expected: Badge is more subtle — thinner border, smaller text, lighter weight. It reads as informational context, not a competing visual element.

**Step 3: Commit**

```bash
git add src/components/sections/Hero.tsx
git commit -m "feat(hero): restyle badge to be more subtle and informational"
```

---

### Task 5: Add Subheadline, Countdown Label, and Trust Line

This is the main content hierarchy change. We add three new elements to `Hero.tsx`.

**Files:**
- Modify: `src/components/sections/Hero.tsx` (the content `div`, lines 63-100)

**Step 1: Rewrite the content section**

Replace the entire content `div` (from `{/* Content */}` to the closing `</div>` before `{/* Scroll indicator */}`) with:

```tsx
{/* Content */}
<div className="relative z-10 flex flex-col items-center text-center px-4">
  {/* Badge */}
  <motion.span
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="mb-3 md:mb-4 inline-block px-4 py-1.5 border border-tangerine/60 rounded-full text-xs md:text-sm font-body text-tangerine tracking-[0.25em] uppercase font-normal"
  >
    {t("subtitle")}
  </motion.span>

  {/* Headline */}
  <motion.h1
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.4 }}
    className="mb-4 md:mb-6 text-6xl md:text-8xl lg:text-[10rem] font-display text-bone"
  >
    {t("title")}
  </motion.h1>

  {/* Subheadline */}
  <motion.p
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.5 }}
    className="mb-8 md:mb-10 max-w-xl text-base md:text-lg font-body text-bone/70 leading-relaxed"
  >
    {t("subheadline")}
  </motion.p>

  {/* Countdown label */}
  <motion.p
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.55 }}
    className="mb-2 text-sm md:text-base font-body text-bone/50 uppercase tracking-wider"
  >
    {t("countdownLabel", { days: timeLeft.days })}
  </motion.p>

  {/* Countdown */}
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.6 }}
    className="mb-8 md:mb-10"
  >
    <Countdown onTick={nextSlide} />
  </motion.div>

  {/* CTA */}
  <motion.a
    href="#tickets"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.8 }}
    className="btn-primary text-lg md:text-xl"
  >
    {t("cta")}
  </motion.a>

  {/* Trust line */}
  <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6, delay: 1.0 }}
    className="mt-4 text-xs md:text-sm font-body text-bone/40 tracking-wider"
  >
    {t("trustLine")}
  </motion.p>
</div>
```

**Important:** The countdown label uses `{t("countdownLabel", { days: timeLeft.days })}`. This requires `timeLeft` to be accessible in the Hero component. Currently, `timeLeft` lives inside `Countdown.tsx` and is not exposed.

We need to either:
- (A) Export `timeLeft.days` from Countdown via a render prop or ref, or
- (B) Calculate `timeLeft.days` separately in Hero.

Option B is simpler — add a small calculation in Hero:

```tsx
// At the top of the Hero component, after useState for currentIndex:
const [daysLeft, setDaysLeft] = useState(0);

useEffect(() => {
  function calcDays() {
    const now = new Date().getTime();
    const festivalDate = new Date("2026-05-13T19:00:00+02:00").getTime();
    const diff = festivalDate - now;
    return diff > 0 ? Math.floor(diff / (1000 * 60 * 60 * 24)) : 0;
  }
  setDaysLeft(calcDays());
  const interval = setInterval(() => setDaysLeft(calcDays()), 60000);
  return () => clearInterval(interval);
}, []);
```

Add `useEffect` to the import line:
```tsx
import { useState, useCallback, useEffect } from "react";
```

This updates every 60 seconds (days don't change per-second). The Countdown component continues to handle seconds-level updates independently.

**Step 2: Verify in browser**

Expected: The full new hierarchy is visible:
1. Badge (date/location) — small, subtle
2. Headline — large, dominant
3. Subheadline — value proposition text
4. Countdown label — "Noch 53 Tage bis zum Start"
5. Countdown numbers
6. CTA button — "Jetzt Festival Pass sichern"
7. Trust line — "50+ Bars · Limitierte Pässe · Exklusive Erlebnisse"

**Step 3: Commit**

```bash
git add src/components/sections/Hero.tsx
git commit -m "feat(hero): add subheadline, countdown label, trust line and reorder hierarchy"
```

---

### Task 6: Update Button Styling

**Files:**
- Modify: `src/app/globals.css` (lines 55-59, `.btn-primary`)

**Step 1: Update btn-primary class**

Old:
```css
.btn-primary {
    @apply inline-flex items-center justify-center bg-tangerine text-licorice font-body font-normal uppercase tracking-wider rounded-full
      px-8 py-3.5 text-center transition-all duration-200
      hover:brightness-110 hover:scale-105;
}
```

New:
```css
.btn-primary {
    @apply inline-flex items-center justify-center bg-tangerine text-licorice font-body font-bold uppercase tracking-wide rounded-full
      px-10 py-4 text-center transition-all duration-200
      hover:brightness-110 hover:scale-105;
}
```

Changes: `font-normal` → `font-bold` (more confident; `font-semibold` not available), `tracking-wider` → `tracking-wide` (less stretched), `px-8 py-3.5` → `px-10 py-4` (more padding for better proportions).

**Step 2: Verify in browser**

Expected: Button looks more substantial and confident. Text is bolder, padding is more generous, letter spacing is slightly tighter.

**Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(css): update btn-primary to be bolder with better proportions"
```

---

### Task 7: Differentiate Header CTA

**Files:**
- Modify: `src/components/layout/Header.tsx` (lines 53, 65)

**Step 1: Switch nav links to body font and increase size**

In `Header.tsx`, update the nav link className (line 53):

Old:
```
className="text-xs uppercase tracking-wider text-bone/70 hover:text-bone transition-colors font-display"
```

New:
```
className="text-sm uppercase tracking-wider text-bone/70 hover:text-bone transition-colors font-body"
```

Changes: `text-xs` → `text-sm` (more readable), `font-display` → `font-body` (Geist is more legible at small sizes than RousseauDeco).

**Step 2: Switch header button to secondary style**

In `Header.tsx`, update the CTA link className (line 65):

Old:
```
className="btn-primary text-xs uppercase tracking-wider"
```

New:
```
className="btn-secondary text-xs uppercase tracking-wider"
```

This makes the header button an outline style (border-bone, text-bone) so it doesn't compete with the Hero's primary CTA.

**Step 3: Verify in browser**

Expected: Nav links are slightly larger and use the body font (Geist). The header CTA is now an outlined button that doesn't compete with the Hero CTA.

**Step 4: Commit**

```bash
git add src/components/layout/Header.tsx
git commit -m "feat(header): use body font for nav links and secondary style for CTA"
```

---

### Task 8: Visual Review and Final Adjustments

**Step 1: Check desktop layout (1440px)**

Resize preview to 1440x900 and take a screenshot. Verify:
- [ ] Background pattern is subtle, not competing
- [ ] Badge is small and informational
- [ ] Headline is the dominant element
- [ ] Subheadline is readable below headline
- [ ] Countdown label provides context
- [ ] CTA is clear and self-explanatory
- [ ] Trust line is visible below CTA
- [ ] Header CTA is secondary (outline)
- [ ] Portrait is a subtle accent behind headline

**Step 2: Check mobile layout (375px)**

Resize preview to 375x812 and verify:
- [ ] All elements stack properly
- [ ] Text sizes are readable
- [ ] No overflow issues
- [ ] Button is full-width enough to be tappable

**Step 3: Fix any issues found**

Address spacing, sizing, or readability problems discovered in steps 1-2.

**Step 4: Final commit**

```bash
git add -A
git commit -m "fix(hero): visual polish from desktop and mobile review"
```
