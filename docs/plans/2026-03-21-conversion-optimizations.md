# Conversion Optimizations Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Optimize the Cocktail X landing page for ticket conversion by fixing content gaps, section order, localization issues, and adding a FAQ section + sticky CTA.

**Architecture:** All changes are in existing Next.js components using next-intl for i18n. New FAQ section follows existing section patterns (Framer Motion animations, Tailwind styling, font-display headings). Sticky CTA is added to the existing Header component via scroll detection.

**Tech Stack:** Next.js, next-intl, Tailwind CSS, Framer Motion

---

### Task 1: Add About Section Description Text

**Files:**
- Modify: `src/i18n/de.json` — add `about.description`
- Modify: `src/i18n/en.json` — add `about.description`
- Modify: `src/components/sections/About.tsx:22-28` — add paragraph between headline and CTA

**Step 1: Add i18n strings**

In `src/i18n/de.json`, add to the `about` object:
```json
"description": "18 Tage, 50+ Bars, eine Stadt: Hol dir deinen Cocktail X Passport und entdecke Münchens beste Bars mit exklusiven Drinks zu Festivalpreisen."
```

In `src/i18n/en.json`, add to the `about` object:
```json
"description": "18 days, 50+ bars, one city: Get your Cocktail X Passport and discover Munich's best bars with exclusive drinks at festival prices."
```

**Step 2: Add paragraph to About.tsx**

Between the `<h2>` and the `<a>` CTA, add:
```tsx
<p className="mt-6 text-base md:text-lg font-body text-bone/70 leading-relaxed max-w-xl">
  {t("description")}
</p>
```

**Step 3: Verify in browser**

Check that the About section now shows headline → description → CTA → image.

**Step 4: Commit**

```bash
git add src/i18n/de.json src/i18n/en.json src/components/sections/About.tsx
git commit -m "feat(about): add description text explaining festival concept"
```

---

### Task 2: Reorder Sections for Conversion Flow

**Files:**
- Modify: `src/app/[locale]/page.tsx` — reorder component rendering

**Step 1: Change section order**

Update `page.tsx` to render in this order:
```tsx
<main>
  <Hero />
  <About />
  <HowItWorks />
  <BarsSlider />
  <Tickets />
  <EventsTimeline />
  <MapSection />
  {/* <SponsorsMarquee /> */}
  <PressQuotes />
  <Newsletter />
</main>
```

Note: SponsorsMarquee is commented out (Task 8).

**Step 2: Verify in browser**

Scroll through the page and confirm order: Hero → About → HowItWorks → Bars → Tickets → Events → Map → Quotes → Newsletter.

**Step 3: Commit**

```bash
git add src/app/[locale]/page.tsx
git commit -m "feat(page): reorder sections for optimal conversion flow"
```

---

### Task 3: Ticket Cards — "Same Pass, Better Price" Messaging

**Files:**
- Modify: `src/i18n/de.json` — add `tickets.savingsNote`
- Modify: `src/i18n/en.json` — add `tickets.savingsNote`
- Modify: `src/components/sections/Tickets.tsx:90-140` — add savings badge and subtitle

**Step 1: Add i18n strings**

In `de.json` under `tickets`:
```json
"subtitle": "Alle Pässe sind identisch — nur der Preis steigt.",
"savings": "Du sparst {amount}€"
```

In `en.json` under `tickets`:
```json
"subtitle": "All passes are identical — only the price increases.",
"savings": "You save €{amount}"
```

**Step 2: Add subtitle below headline in Tickets.tsx**

After the `<motion.h2>` headline, add:
```tsx
<motion.p
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5, delay: 0.1 }}
  className="text-center text-sm md:text-base font-body text-bone/60 -mt-10 mb-16"
>
  {t("subtitle")}
</motion.p>
```

**Step 3: Add savings badge to non-early-bird available tickets**

Inside each tier card, after the price `<p>`, add a savings line for Early Bird and Regular (compared to Late price of 25€):
```tsx
{!isSoldOut && tier.price < 25 && (
  <span className="text-xs font-body text-emerald-400 font-bold mt-1">
    {t("savings", { amount: 25 - tier.price })}
  </span>
)}
```

**Step 4: Verify in browser**

Check tickets section shows subtitle + savings badges (€9 for Early Bird, €5 for Regular).

**Step 5: Commit**

```bash
git add src/i18n/de.json src/i18n/en.json src/components/sections/Tickets.tsx
git commit -m "feat(tickets): add savings messaging to clarify early bird value"
```

---

### Task 4: Create FAQ Section

**Files:**
- Create: `src/components/sections/FAQ.tsx`
- Modify: `src/i18n/de.json` — add `faq` object
- Modify: `src/i18n/en.json` — add `faq` object
- Modify: `src/app/[locale]/page.tsx` — add FAQ between Tickets and Events

**Step 1: Add i18n strings**

In `de.json`, add top-level `faq` object:
```json
"faq": {
  "headline": "HÄUFIGE FRAGEN",
  "q1": "Was ist der Cocktail X Passport?",
  "a1": "Der Passport ist dein digitaler Festivalpass. Er gibt dir 18 Tage lang Zugang zu exklusiven Cocktails in über 50 Bars in ganz München — zu speziellen Festivalpreisen.",
  "q2": "Ist der Pass digital oder physisch?",
  "a2": "Der Pass ist komplett digital. Nach dem Kauf erhältst du Zugang über die Cocktail X App. Kein Ausdrucken nötig — einfach in der Bar vorzeigen.",
  "q3": "Wie funktioniert das mit den Stempeln?",
  "a3": "Bei jedem Besuch einer teilnehmenden Bar bekommst du einen digitalen Stempel in der App. Je mehr Bars du besuchst, desto mehr Preise kannst du gewinnen.",
  "q4": "Muss ich alle Bars besuchen?",
  "a4": "Nein, du kannst so viele oder wenige Bars besuchen wie du möchtest. Jede Bar bietet eigene exklusive Cocktails zum Festivalpreis.",
  "q5": "Kann ich den Pass verschenken?",
  "a5": "Ja! Der Passport ist das perfekte Geschenk für Cocktail-Fans. Du kannst ihn nach dem Kauf einfach an eine andere Person weitergeben.",
  "q6": "Brauche ich die App?",
  "a6": "Ja, die Cocktail X App ist dein Begleiter während des Festivals. Dort findest du deinen Pass, alle teilnehmenden Bars, deine Stempel und exklusive Inhalte."
}
```

In `en.json`, add:
```json
"faq": {
  "headline": "FAQ",
  "q1": "What is the Cocktail X Passport?",
  "a1": "The Passport is your digital festival pass. It gives you 18 days of access to exclusive cocktails at over 50 bars across Munich — at special festival prices.",
  "q2": "Is the pass digital or physical?",
  "a2": "The pass is fully digital. After purchase, you get access via the Cocktail X App. No printing needed — just show it at the bar.",
  "q3": "How do the stamps work?",
  "a3": "Each time you visit a participating bar, you receive a digital stamp in the app. The more bars you visit, the more prizes you can win.",
  "q4": "Do I have to visit all bars?",
  "a4": "No, you can visit as many or as few bars as you like. Each bar offers its own exclusive cocktails at the festival price.",
  "q5": "Can I gift the pass?",
  "a5": "Yes! The Passport makes a perfect gift for cocktail lovers. You can simply transfer it to another person after purchase.",
  "q6": "Do I need the app?",
  "a6": "Yes, the Cocktail X App is your companion during the festival. It holds your pass, lists all participating bars, tracks your stamps, and offers exclusive content."
}
```

**Step 2: Create FAQ.tsx**

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

const faqKeys = ["q1", "q2", "q3", "q4", "q5", "q6"] as const;

export default function FAQ() {
  const t = useTranslations("faq");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section-padding">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-display text-bone text-center mb-12"
        >
          {t("headline")}
        </motion.h2>

        <div className="space-y-3">
          {faqKeys.map((key, i) => {
            const isOpen = openIndex === i;
            const answerKey = key.replace("q", "a") as `a${1 | 2 | 3 | 4 | 5 | 6}`;

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="border border-bone/10 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="text-sm md:text-base font-body font-bold text-bone pr-4">
                    {t(key)}
                  </span>
                  <span className="text-tangerine text-xl flex-shrink-0">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm font-body text-bone/60 leading-relaxed">
                        {t(answerKey)}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

**Step 3: Add FAQ to page.tsx**

Import and add between Tickets and EventsTimeline:
```tsx
import FAQ from "@/components/sections/FAQ";
// ...
<Tickets />
<FAQ />
<EventsTimeline />
```

**Step 4: Verify in browser**

Check FAQ section renders with accordion behavior — click questions to expand/collapse answers.

**Step 5: Commit**

```bash
git add src/components/sections/FAQ.tsx src/i18n/de.json src/i18n/en.json src/app/[locale]/page.tsx
git commit -m "feat(faq): add FAQ section with 6 common questions"
```

---

### Task 5: Localize HowItWorks

**Files:**
- Modify: `src/i18n/de.json` — add `howItWorks.headline`, `howItWorks.stepLabel`
- Modify: `src/i18n/en.json` — add `howItWorks.headline`, `howItWorks.stepLabel`
- Modify: `src/components/sections/HowItWorks.tsx:42-44,57-59` — use t() for headline and step labels

**Step 1: Add i18n strings**

In `de.json` under `howItWorks`:
```json
"headline": "SO FUNKTIONIERT'S",
"stepLabel": "SCHRITT {number}"
```

In `en.json` under `howItWorks`:
```json
"headline": "HOW IT WORKS",
"stepLabel": "STEP {number}"
```

**Step 2: Update HowItWorks.tsx**

Replace the hardcoded headline:
```tsx
// Before:
HOW IT WORKS
// After:
{t("headline")}
```

Replace the hardcoded step label:
```tsx
// Before:
STEP {i + 1}
// After:
{t("stepLabel", { number: i + 1 })}
```

**Step 3: Verify in browser**

Check German page shows "SO FUNKTIONIERT'S" and "SCHRITT 1/2/3".

**Step 4: Commit**

```bash
git add src/i18n/de.json src/i18n/en.json src/components/sections/HowItWorks.tsx
git commit -m "fix(i18n): localize HowItWorks headline and step labels"
```

---

### Task 6: Localize Press Quotes "As seen in"

**Files:**
- Modify: `src/i18n/de.json` — add `press.asSeenIn`
- Modify: `src/i18n/en.json` — add `press.asSeenIn`
- Modify: `src/components/sections/PressQuotes.tsx:57` — use t() instead of hardcoded string

**Step 1: Add i18n strings**

In `de.json`, add top-level `press` object:
```json
"press": {
  "asSeenIn": "Bekannt aus"
}
```

In `en.json`:
```json
"press": {
  "asSeenIn": "As seen in"
}
```

**Step 2: Update PressQuotes.tsx**

Add `useTranslations`:
```tsx
import { useTranslations } from "next-intl";
// inside component:
const t = useTranslations("press");
```

Replace hardcoded "As seen in":
```tsx
// Before:
As seen in
// After:
{t("asSeenIn")}
```

**Step 3: Verify in browser**

Check German page shows "Bekannt aus" instead of "As seen in".

**Step 4: Commit**

```bash
git add src/i18n/de.json src/i18n/en.json src/components/sections/PressQuotes.tsx
git commit -m "fix(i18n): localize press quotes 'as seen in' label"
```

---

### Task 7: Sticky Header CTA on Scroll

**Files:**
- Modify: `src/components/layout/Header.tsx` — add hero visibility detection, conditionally show CTA

**Step 1: Add scroll-past-hero detection**

The Header already tracks `scrolled` (> 50px). Add a second state for when the user has scrolled past the hero (roughly 100vh):
```tsx
const [pastHero, setPastHero] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
    setPastHero(window.scrollY > window.innerHeight * 0.8);
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

**Step 2: Conditionally render CTA**

Wrap the existing desktop CTA `<Link>` in a conditional with a fade transition:
```tsx
<div className="hidden md:flex items-center gap-6">
  <LanguageSwitcher />
  <Link
    href="#tickets"
    className={`btn-secondary text-xs uppercase tracking-wider transition-all duration-300 ${
      pastHero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
    }`}
  >
    {t("getPassport")}
  </Link>
</div>
```

**Step 3: Verify in browser**

- On page load: CTA in header is invisible
- After scrolling past hero: CTA fades in
- CTA links to #tickets anchor

**Step 4: Commit**

```bash
git add src/components/layout/Header.tsx
git commit -m "feat(header): show sticky CTA button after scrolling past hero"
```

---

### Task 8: Hide Sponsors Section

**Files:**
- Modify: `src/app/[locale]/page.tsx` — comment out SponsorsMarquee

**Step 1: Comment out SponsorsMarquee**

This is already done in Task 2's section reordering. Verify the import is also commented out or removed:
```tsx
// import SponsorsMarquee from "@/components/sections/SponsorsMarquee";
```

**Step 2: Verify in browser**

Scroll through the page — sponsors marquee should no longer appear.

**Step 3: Commit**

Combined with Task 2 commit (section reordering).
