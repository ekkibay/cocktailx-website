# Cocktail X Festival Website — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a fully functional, emotionally immersive festival website for Cocktail X using Next.js 14 with Shopify headless commerce, bilingual support (DE/EN), and Framer Motion animations.

**Architecture:** Next.js 14 App Router with `[locale]` dynamic segment for i18n. Static data in TypeScript files. Shopify Storefront API + Buy Button SDK for embedded checkout. Framer Motion for all scroll/page animations. Tailwind CSS with custom brand design tokens.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion, next-intl, Shopify Buy Button SDK, Shopify Storefront API

**Design Doc:** `docs/plans/2026-03-20-cocktail-x-festival-website-design.md`

---

## Phase 1: Project Foundation

### Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`
- Create: `src/app/layout.tsx`, `src/app/page.tsx`
- Create: `.gitignore`

**Step 1: Scaffold the Next.js project**

Run:
```bash
cd "/Users/klaus/Desktop/Arbeit/Cocktail X"
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack
```

Expected: Project scaffolded with Next.js 14, TypeScript, Tailwind, ESLint, App Router, src directory.

**Step 2: Verify the project runs**

Run:
```bash
npm run dev
```

Expected: Dev server starts on `http://localhost:3000`, default Next.js page renders.

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: initialize Next.js 14 project with TypeScript and Tailwind"
```

---

### Task 2: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install all required packages**

Run:
```bash
npm install framer-motion next-intl shopify-buy
npm install -D @types/shopify-buy
```

**Step 2: Verify installation**

Run:
```bash
npm ls framer-motion next-intl shopify-buy
```

Expected: All three packages listed without errors.

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: install framer-motion, next-intl, shopify-buy dependencies"
```

---

### Task 3: Configure Tailwind with Brand Design Tokens

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`

**Step 1: Configure Tailwind with Cocktail X brand colors, fonts, and spacing**

Replace `tailwind.config.ts` with:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        licorice: "#191513",
        jambalaya: "#523113",
        tangerine: "#f39200",
        hibiscus: "#bd256e",
        "bay-of-many": "#223a7b",
        everglade: "#1a4620",
        bone: "#e4d6c5",
      },
      fontFamily: {
        display: ["Rousseau Deco Bold", "serif"],
        body: ["Geist Thin", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        marquee: "marquee 30s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

**Step 2: Update globals.css with base styles and font imports**

Replace `src/app/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@font-face {
  font-family: "Rousseau Deco Bold";
  src: url("/fonts/RousseauDecoBold.woff2") format("woff2"),
       url("/fonts/RousseauDecoBold.woff") format("woff");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Geist Thin";
  src: url("/fonts/GeistThin.woff2") format("woff2"),
       url("/fonts/GeistThin.woff") format("woff");
  font-weight: 100;
  font-style: normal;
  font-display: swap;
}

@layer base {
  body {
    @apply bg-licorice text-bone font-body antialiased;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-display;
  }
}

@layer components {
  .btn-primary {
    @apply bg-tangerine text-licorice font-display px-8 py-4 rounded-lg
           hover:bg-tangerine/90 transition-all duration-300
           uppercase tracking-wider text-sm;
  }

  .btn-secondary {
    @apply border border-bone text-bone font-display px-8 py-4 rounded-lg
           hover:bg-bone hover:text-licorice transition-all duration-300
           uppercase tracking-wider text-sm;
  }

  .section-padding {
    @apply px-6 md:px-12 lg:px-24 py-20 md:py-32;
  }
}
```

**Step 3: Create font placeholder directory**

Run:
```bash
mkdir -p public/fonts public/images/placeholder public/icons public/map
```

Note: The actual font files (`RousseauDecoBold.woff2`, `GeistThin.woff2`) must be added manually from the SharePoint Brand Assets folder. For now, the CSS references them and the site will fall back to serif/sans-serif.

**Step 4: Verify Tailwind config compiles**

Run:
```bash
npm run dev
```

Expected: No build errors. Dev server starts successfully.

**Step 5: Commit**

```bash
git add tailwind.config.ts src/app/globals.css
git commit -m "feat: configure Tailwind with Cocktail X brand tokens and base styles"
```

---

### Task 4: Set Up i18n with next-intl

**Files:**
- Create: `src/i18n/request.ts`
- Create: `src/i18n/routing.ts`
- Create: `src/i18n/de.json`
- Create: `src/i18n/en.json`
- Create: `src/middleware.ts`
- Create: `src/app/[locale]/layout.tsx`
- Create: `src/app/[locale]/page.tsx`
- Modify: `next.config.mjs`
- Delete: `src/app/layout.tsx` (moved to `[locale]`)
- Delete: `src/app/page.tsx` (moved to `[locale]`)

**Step 1: Create i18n routing config**

Create `src/i18n/routing.ts`:

```ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["de", "en"],
  defaultLocale: "de",
});
```

**Step 2: Create i18n request config**

Create `src/i18n/request.ts`:

```ts
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./${locale}.json`)).default,
  };
});
```

**Step 3: Create German translations**

Create `src/i18n/de.json`:

```json
{
  "nav": {
    "festival": "Festival",
    "awards": "Awards",
    "app": "App",
    "shop": "Shop",
    "blog": "Blog",
    "getPassport": "PASSPORT HOLEN"
  },
  "hero": {
    "title": "COCKTAIL ✦ FESTIVAL",
    "subtitle": "MÜNCHEN · 13.–30. MAI · 2026",
    "cta": "HOLT EUCH EUREN PASSPORT",
    "days": "Tage",
    "hours": "Stunden",
    "minutes": "Minuten",
    "seconds": "Sekunden"
  },
  "about": {
    "headline": "DEUTSCHLANDS GRÖSSTES COCKTAIL FESTIVAL",
    "bars": "Bars",
    "cocktails": "Signature Cocktails",
    "days": "Tage",
    "passport": "Passport",
    "cta": "MEHR ERFAHREN"
  },
  "howItWorks": {
    "step1": "HOL DIR DEINEN PASSPORT",
    "step2": "BESUCHE 50+ BARS",
    "step3": "SAMMLE STEMPEL"
  },
  "tickets": {
    "headline": "TICKETS",
    "buyNow": "JETZT KAUFEN"
  },
  "map": {
    "headline": "ENTDECKE MÜNCHEN",
    "cta": "ALLE BARS ENTDECKEN"
  },
  "newsletter": {
    "headline": "VERPASSE NICHTS",
    "placeholder": "Deine E-Mail Adresse",
    "submit": "ANMELDEN"
  },
  "footer": {
    "connect": "CONNECT",
    "becomeSponsor": "Sponsor werden",
    "becomeBar": "Bar werden",
    "becomeGuest": "Gast werden",
    "becomeExcelerator": "Excelerator werden",
    "events": "EVENTS",
    "grandOpening": "Grand Opening",
    "closingAwards": "Closing & Awards",
    "app": "APP",
    "login": "LogIn",
    "aboutUs": "ÜBER UNS",
    "catering": "Cocktail X Catering",
    "founder": "Gründer",
    "contact": "Kontakt",
    "legal": "RECHTLICHES",
    "privacy": "Datenschutz",
    "cookies": "Cookies",
    "imprint": "Impressum",
    "copyright": "© 2026 Cocktail X Festival. Alle Rechte vorbehalten."
  }
}
```

**Step 4: Create English translations**

Create `src/i18n/en.json`:

```json
{
  "nav": {
    "festival": "Festival",
    "awards": "Awards",
    "app": "App",
    "shop": "Shop",
    "blog": "Blog",
    "getPassport": "GET PASSPORT"
  },
  "hero": {
    "title": "COCKTAIL ✦ FESTIVAL",
    "subtitle": "MUNICH · MAY 13–30 · 2026",
    "cta": "GET YOUR PASSPORT",
    "days": "Days",
    "hours": "Hours",
    "minutes": "Minutes",
    "seconds": "Seconds"
  },
  "about": {
    "headline": "GERMANY'S BIGGEST COCKTAIL FESTIVAL",
    "bars": "Bars",
    "cocktails": "Signature Cocktails",
    "days": "Days",
    "passport": "Passport",
    "cta": "DISCOVER MORE"
  },
  "howItWorks": {
    "step1": "GET YOUR PASSPORT",
    "step2": "VISIT 50+ BARS",
    "step3": "COLLECT STAMPS"
  },
  "tickets": {
    "headline": "TICKETS",
    "buyNow": "BUY NOW"
  },
  "map": {
    "headline": "EXPLORE MUNICH",
    "cta": "EXPLORE ALL BARS"
  },
  "newsletter": {
    "headline": "DON'T MISS OUT",
    "placeholder": "Your email address",
    "submit": "SUBSCRIBE"
  },
  "footer": {
    "connect": "CONNECT",
    "becomeSponsor": "Become a Sponsor",
    "becomeBar": "Become a Bar",
    "becomeGuest": "Become a Guest",
    "becomeExcelerator": "Become an Excelerator",
    "events": "EVENTS",
    "grandOpening": "Grand Opening",
    "closingAwards": "Closing & Awards",
    "app": "APP",
    "login": "LogIn",
    "aboutUs": "ABOUT US",
    "catering": "Cocktail X Catering",
    "founder": "Founder",
    "contact": "Contact",
    "legal": "LEGAL",
    "privacy": "Privacy Policy",
    "cookies": "Cookies",
    "imprint": "Legal Notice",
    "copyright": "© 2026 Cocktail X Festival. All rights reserved."
  }
}
```

**Step 5: Create middleware for locale routing**

Create `src/middleware.ts`:

```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|fonts|images|icons|map|.*\\..*).*)"],
};
```

**Step 6: Update next.config.mjs**

Replace `next.config.mjs` with:

```mjs
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.shopify.com"],
  },
};

export default withNextIntl(nextConfig);
```

**Step 7: Create locale layout**

Create `src/app/[locale]/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

export const metadata: Metadata = {
  title: "Cocktail X Festival | Munich 2026",
  description:
    "Germany's biggest cocktail festival. 50+ bars, 50+ signature cocktails, 10 days of celebration in Munich.",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

**Step 8: Create placeholder landing page**

Create `src/app/[locale]/page.tsx`:

```tsx
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("hero");

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-display text-bone mb-4">
          {t("title")}
        </h1>
        <p className="text-xl text-bone/70 font-body">{t("subtitle")}</p>
      </div>
    </main>
  );
}
```

**Step 9: Remove old root layout/page (if they still exist)**

Run:
```bash
rm -f src/app/layout.tsx src/app/page.tsx
```

Note: Keep `src/app/globals.css` in place — it's imported by the locale layout.

**Step 10: Verify i18n works**

Run:
```bash
npm run dev
```

Visit `http://localhost:3000/de` — should show German hero text.
Visit `http://localhost:3000/en` — should show English hero text.
Visit `http://localhost:3000` — should redirect to `/de`.

**Step 11: Commit**

```bash
git add -A
git commit -m "feat: set up next-intl i18n with DE/EN locale routing"
```

---

### Task 5: Create Static Data Files

**Files:**
- Create: `src/data/bars.ts`
- Create: `src/data/events.ts`
- Create: `src/data/sponsors.ts`
- Create: `src/data/cocktails.ts`
- Create: `src/data/blog-posts.ts`

**Step 1: Create bars data**

Create `src/data/bars.ts`:

```ts
export interface Bar {
  id: string;
  name: string;
  district: string;
  address: string;
  signatureCocktail: string;
  image: string;
  description: { de: string; en: string };
}

export const bars: Bar[] = [
  {
    id: "schumann-bar",
    name: "Schumann's Bar",
    district: "Altstadt-Lehel",
    address: "Odeonsplatz 6, 80539 München",
    signatureCocktail: "Munich Negroni",
    image: "/images/placeholder/bar-01.jpg",
    description: {
      de: "Münchens legendärste Bar seit 1982.",
      en: "Munich's most legendary bar since 1982.",
    },
  },
  {
    id: "zephyr-bar",
    name: "Zephyr Bar",
    district: "Glockenbachviertel",
    address: "Baaderstr. 68, 80469 München",
    signatureCocktail: "Zephyr Sour",
    image: "/images/placeholder/bar-02.jpg",
    description: {
      de: "Kreative Cocktails im Herzen des Glockenbachviertels.",
      en: "Creative cocktails in the heart of Glockenbachviertel.",
    },
  },
  {
    id: "goldene-bar",
    name: "Goldene Bar",
    district: "Altstadt-Lehel",
    address: "Prinzregentenstr. 1, 80538 München",
    signatureCocktail: "Golden Fizz",
    image: "/images/placeholder/bar-03.jpg",
    description: {
      de: "Art-Deco-Juwel im Haus der Kunst.",
      en: "Art Deco gem in Haus der Kunst.",
    },
  },
  // Add more placeholder bars as needed — 50+ in production
];

export const districts = [...new Set(bars.map((b) => b.district))];
```

**Step 2: Create events data**

Create `src/data/events.ts`:

```ts
export interface FestivalEvent {
  id: string;
  title: { de: string; en: string };
  date: string;
  time: string;
  location: string;
  description: { de: string; en: string };
  image: string;
  type: "opening" | "festival" | "closing" | "side-event";
}

export const events: FestivalEvent[] = [
  {
    id: "grand-opening",
    title: {
      de: "Grand Opening",
      en: "Grand Opening",
    },
    date: "2026-05-13",
    time: "19:00",
    location: "TBA",
    description: {
      de: "Der offizielle Start des Cocktail X Festivals 2026.",
      en: "The official start of the Cocktail X Festival 2026.",
    },
    image: "/images/placeholder/event-opening.jpg",
    type: "opening",
  },
  {
    id: "festival-days",
    title: {
      de: "Festival Tage",
      en: "Festival Days",
    },
    date: "2026-05-13",
    time: "Täglich",
    location: "50+ Bars in München",
    description: {
      de: "10 Tage, 50+ Bars, 50+ Signature Cocktails. Entdecke München.",
      en: "10 days, 50+ bars, 50+ signature cocktails. Discover Munich.",
    },
    image: "/images/placeholder/event-festival.jpg",
    type: "festival",
  },
  {
    id: "closing-awards",
    title: {
      de: "Closing & Awards",
      en: "Closing & Awards",
    },
    date: "2026-05-30",
    time: "20:00",
    location: "TBA",
    description: {
      de: "Die große Abschlussfeier mit den Cocktail X Awards.",
      en: "The grand closing celebration with the Cocktail X Awards.",
    },
    image: "/images/placeholder/event-closing.jpg",
    type: "closing",
  },
];
```

**Step 3: Create sponsors data**

Create `src/data/sponsors.ts`:

```ts
export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  url: string;
  tier: "main" | "partner" | "supporter";
}

export const sponsors: Sponsor[] = [
  { id: "diageo", name: "Diageo Germany", logo: "/images/placeholder/sponsor-diageo.svg", url: "https://www.diageo.com", tier: "main" },
  { id: "olymp", name: "Olymp", logo: "/images/placeholder/sponsor-olymp.svg", url: "https://www.olymp.com", tier: "main" },
  { id: "lucid", name: "Lucid Motors", logo: "/images/placeholder/sponsor-lucid.svg", url: "https://www.lucidmotors.com", tier: "main" },
  { id: "campari", name: "Campari", logo: "/images/placeholder/sponsor-campari.svg", url: "https://www.campari.com", tier: "partner" },
  { id: "studio-vom-berg", name: "Studio vom Berg", logo: "/images/placeholder/sponsor-svb.svg", url: "#", tier: "partner" },
];
```

**Step 4: Create cocktails data**

Create `src/data/cocktails.ts`:

```ts
export interface Cocktail {
  id: string;
  name: string;
  bar: string;
  barId: string;
  description: { de: string; en: string };
  image: string;
  accentColor: "tangerine" | "hibiscus" | "bay-of-many" | "everglade" | "jambalaya";
}

export const cocktails: Cocktail[] = [
  {
    id: "munich-negroni",
    name: "Munich Negroni",
    bar: "Schumann's Bar",
    barId: "schumann-bar",
    description: {
      de: "Ein Münchner Twist auf den italienischen Klassiker.",
      en: "A Munich twist on the Italian classic.",
    },
    image: "/images/placeholder/cocktail-01.jpg",
    accentColor: "tangerine",
  },
  {
    id: "zephyr-sour",
    name: "Zephyr Sour",
    bar: "Zephyr Bar",
    barId: "zephyr-bar",
    description: {
      de: "Fruchtig, frisch und überraschend komplex.",
      en: "Fruity, fresh, and surprisingly complex.",
    },
    image: "/images/placeholder/cocktail-02.jpg",
    accentColor: "hibiscus",
  },
  {
    id: "golden-fizz",
    name: "Golden Fizz",
    bar: "Goldene Bar",
    barId: "goldene-bar",
    description: {
      de: "Prickelnd und golden wie die Bar selbst.",
      en: "Sparkling and golden like the bar itself.",
    },
    image: "/images/placeholder/cocktail-03.jpg",
    accentColor: "bay-of-many",
  },
];
```

**Step 5: Create blog posts data**

Create `src/data/blog-posts.ts`:

```ts
export interface BlogPost {
  slug: string;
  title: { de: string; en: string };
  excerpt: { de: string; en: string };
  content: { de: string; en: string };
  date: string;
  image: string;
  category: string;
  featured: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "cocktail-x-2026-announced",
    title: {
      de: "Cocktail X 2026 angekündigt",
      en: "Cocktail X 2026 Announced",
    },
    excerpt: {
      de: "Das größte Cocktail-Festival Deutschlands kehrt zurück.",
      en: "Germany's biggest cocktail festival returns.",
    },
    content: {
      de: "Placeholder Inhalt für den Blog-Post...",
      en: "Placeholder content for the blog post...",
    },
    date: "2026-01-15",
    image: "/images/placeholder/blog-01.jpg",
    category: "News",
    featured: true,
  },
  {
    slug: "top-10-cocktail-bars-munich",
    title: {
      de: "Top 10 Cocktail Bars in München",
      en: "Top 10 Cocktail Bars in Munich",
    },
    excerpt: {
      de: "Unsere Favoriten für den perfekten Abend.",
      en: "Our favorites for the perfect night out.",
    },
    content: {
      de: "Placeholder Inhalt...",
      en: "Placeholder content...",
    },
    date: "2026-02-20",
    image: "/images/placeholder/blog-02.jpg",
    category: "Guide",
    featured: false,
  },
];
```

**Step 6: Commit**

```bash
git add src/data/
git commit -m "feat: add static data files for bars, events, sponsors, cocktails, blog"
```

---

### Task 6: Create Placeholder Images

**Files:**
- Create: `public/images/placeholder/` (multiple SVG placeholder files)

**Step 1: Create a reusable placeholder SVG generator script**

Create `scripts/generate-placeholders.sh`:

```bash
#!/bin/bash
# Generate brand-colored SVG placeholder images

DIR="public/images/placeholder"
mkdir -p "$DIR"

# Function to create SVG placeholder
create_svg() {
  local name=$1 width=$2 height=$3 color=$4 text=$5
  cat > "$DIR/$name.svg" << SVGEOF
<svg xmlns="http://www.w3.org/2000/svg" width="$width" height="$height" viewBox="0 0 $width $height">
  <rect width="$width" height="$height" fill="$color"/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#e4d6c5" font-family="sans-serif" font-size="24">$text</text>
</svg>
SVGEOF
}

# Hero
create_svg "hero-bg" 1920 1080 "#191513" "Hero Background"

# Bars
for i in $(seq -w 1 6); do
  create_svg "bar-$i" 600 400 "#523113" "Bar $i"
done

# Events
create_svg "event-opening" 800 500 "#bd256e" "Grand Opening"
create_svg "event-festival" 800 500 "#223a7b" "Festival Days"
create_svg "event-closing" 800 500 "#1a4620" "Closing & Awards"

# Cocktails
for i in $(seq -w 1 3); do
  create_svg "cocktail-$i" 500 600 "#523113" "Cocktail $i"
done

# Sponsors
for name in diageo olymp lucid campari svb; do
  create_svg "sponsor-$name" 200 80 "#191513" "$name"
done

# Blog
for i in $(seq -w 1 3); do
  create_svg "blog-$i" 800 450 "#223a7b" "Blog $i"
done

# About / General
create_svg "about" 800 600 "#523113" "About"
create_svg "newsletter-bg" 1920 600 "#191513" "Newsletter BG"
create_svg "founder" 400 500 "#523113" "Founder"

echo "Placeholder images generated in $DIR"
```

**Step 2: Run the script**

Run:
```bash
chmod +x scripts/generate-placeholders.sh
bash scripts/generate-placeholders.sh
```

Expected: Placeholder SVGs created in `public/images/placeholder/`.

**Step 3: Commit**

```bash
git add scripts/ public/images/placeholder/
git commit -m "feat: add SVG placeholder images with brand colors"
```

---

## Phase 2: Global Layout Components

### Task 7: Create Header Component

**Files:**
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/MobileNav.tsx`
- Create: `src/components/layout/LanguageSwitcher.tsx`
- Modify: `src/app/[locale]/layout.tsx` (add Header)

**Step 1: Create LanguageSwitcher component**

Create `src/components/layout/LanguageSwitcher.tsx`:

```tsx
"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    const path = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(path);
  };

  return (
    <div className="flex items-center gap-1 text-sm font-body">
      <button
        onClick={() => switchLocale("de")}
        className={`px-2 py-1 rounded transition-colors ${
          locale === "de"
            ? "text-tangerine"
            : "text-bone/50 hover:text-bone"
        }`}
      >
        DE
      </button>
      <span className="text-bone/30">|</span>
      <button
        onClick={() => switchLocale("en")}
        className={`px-2 py-1 rounded transition-colors ${
          locale === "en"
            ? "text-tangerine"
            : "text-bone/50 hover:text-bone"
        }`}
      >
        EN
      </button>
    </div>
  );
}
```

**Step 2: Create MobileNav component**

Create `src/components/layout/MobileNav.tsx`:

```tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useLocale } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { href: "/festival", key: "festival" },
  { href: "/awards", key: "awards" },
  { href: "/app", key: "app" },
  { href: "/shop", key: "shop" },
  { href: "/blog", key: "blog" },
] as const;

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const t = useTranslations("nav");
  const locale = useLocale();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-licorice"
        >
          {/* Decorative brand shapes */}
          <div className="absolute top-20 right-10 w-32 h-32 bg-tangerine/10 rounded-full blur-3xl" />
          <div className="absolute bottom-40 left-10 w-24 h-24 bg-hibiscus/10 rotate-45" />

          <div className="flex flex-col items-center justify-center h-full gap-8">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-bone text-3xl"
            >
              ✕
            </button>

            {navLinks.map((link, i) => (
              <motion.div
                key={link.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={`/${locale}${link.href}`}
                  onClick={onClose}
                  className="text-4xl font-display text-bone hover:text-tangerine transition-colors"
                >
                  {t(link.key)}
                </Link>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                href={`/${locale}/shop`}
                onClick={onClose}
                className="btn-primary mt-4"
              >
                {t("getPassport")}
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <LanguageSwitcher />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

**Step 3: Create Header component**

Create `src/components/layout/Header.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileNav from "./MobileNav";

const navLinks = [
  { href: "/festival", key: "festival" },
  { href: "/awards", key: "awards" },
  { href: "/app", key: "app" },
  { href: "/shop", key: "shop" },
  { href: "/blog", key: "blog" },
] as const;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations("nav");
  const locale = useLocale();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-licorice/90 backdrop-blur-md border-b border-bone/5"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="font-display text-xl text-bone">
            cocktail ✦ festival
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={`/${locale}${link.href}`}
                className="text-sm font-body text-bone/70 hover:text-bone transition-colors uppercase tracking-wider"
              >
                {t(link.key)}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <Link href={`/${locale}/shop`} className="btn-primary text-xs py-2 px-4">
              {t("getPassport")}
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-bone text-2xl"
          >
            ☰
          </button>
        </nav>
      </motion.header>

      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
```

**Step 4: Add Header to locale layout**

Modify `src/app/[locale]/layout.tsx` — add `import Header from "@/components/layout/Header"` and add `<Header />` inside the `<body>` before `{children}`.

**Step 5: Verify header renders**

Run:
```bash
npm run dev
```

Expected: Transparent header on page load. Scrolling changes to blurred dark background. Mobile hamburger opens fullscreen overlay.

**Step 6: Commit**

```bash
git add src/components/layout/ src/app/[locale]/layout.tsx
git commit -m "feat: add Header with desktop nav, mobile overlay, language switcher"
```

---

### Task 8: Create Footer Component

**Files:**
- Create: `src/components/layout/Footer.tsx`
- Modify: `src/app/[locale]/layout.tsx` (add Footer)

**Step 1: Create Footer component**

Create `src/components/layout/Footer.tsx`:

```tsx
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

const socialLinks = [
  { name: "Instagram", url: "https://www.instagram.com/cocktailxfestival", icon: "IG" },
  { name: "TikTok", url: "https://www.tiktok.com/@cocktailxfestival", icon: "TT" },
  { name: "Facebook", url: "https://www.facebook.com/profile.php?id=100090270165472", icon: "FB" },
  { name: "LinkedIn", url: "https://www.linkedin.com/company/cocktailx", icon: "LI" },
];

export default function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();

  return (
    <footer className="bg-licorice border-t border-bone/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* 5-column grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          {/* CONNECT */}
          <div>
            <h4 className="font-display text-sm text-tangerine mb-4">{t("connect")}</h4>
            <ul className="space-y-2 text-sm font-body">
              <li><a href="https://www.cocktailx.app/de/auth/signup-sponsor" target="_blank" rel="noopener" className="text-bone/60 hover:text-bone transition-colors">{t("becomeSponsor")}</a></li>
              <li><a href="https://www.cocktailx.app/de/auth/signup-bar" target="_blank" rel="noopener" className="text-bone/60 hover:text-bone transition-colors">{t("becomeBar")}</a></li>
              <li><a href="https://www.cocktailx.app/de" target="_blank" rel="noopener" className="text-bone/60 hover:text-bone transition-colors">{t("becomeGuest")}</a></li>
              <li><Link href={`/${locale}/connect/excelerator`} className="text-bone/60 hover:text-bone transition-colors">{t("becomeExcelerator")}</Link></li>
            </ul>
          </div>

          {/* EVENTS */}
          <div>
            <h4 className="font-display text-sm text-tangerine mb-4">{t("events")}</h4>
            <ul className="space-y-2 text-sm font-body">
              <li><Link href={`/${locale}/festival/events`} className="text-bone/60 hover:text-bone transition-colors">{t("grandOpening")}</Link></li>
              <li><Link href={`/${locale}/festival/events`} className="text-bone/60 hover:text-bone transition-colors">{t("closingAwards")}</Link></li>
            </ul>
          </div>

          {/* APP */}
          <div>
            <h4 className="font-display text-sm text-tangerine mb-4">{t("app")}</h4>
            <ul className="space-y-2 text-sm font-body">
              <li><a href="https://my.cocktail-x.com" target="_blank" rel="noopener" className="text-bone/60 hover:text-bone transition-colors">{t("login")}</a></li>
            </ul>
          </div>

          {/* ABOUT US */}
          <div>
            <h4 className="font-display text-sm text-tangerine mb-4">{t("aboutUs")}</h4>
            <ul className="space-y-2 text-sm font-body">
              <li><Link href={`/${locale}/about/catering`} className="text-bone/60 hover:text-bone transition-colors">{t("catering")}</Link></li>
              <li><Link href={`/${locale}/about/founder`} className="text-bone/60 hover:text-bone transition-colors">{t("founder")}</Link></li>
              <li><Link href={`/${locale}/about/contact`} className="text-bone/60 hover:text-bone transition-colors">{t("contact")}</Link></li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h4 className="font-display text-sm text-tangerine mb-4">{t("legal")}</h4>
            <ul className="space-y-2 text-sm font-body">
              <li><Link href={`/${locale}/legal/datenschutz`} className="text-bone/60 hover:text-bone transition-colors">{t("privacy")}</Link></li>
              <li><Link href={`/${locale}/legal/cookies`} className="text-bone/60 hover:text-bone transition-colors">{t("cookies")}</Link></li>
              <li><Link href={`/${locale}/legal/impressum`} className="text-bone/60 hover:text-bone transition-colors">{t("imprint")}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-bone/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm font-body text-bone/40">{t("copyright")}</p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-bone/40 hover:text-tangerine transition-colors"
                aria-label={link.name}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
```

**Step 2: Add Footer to locale layout**

Modify `src/app/[locale]/layout.tsx` — add `import Footer from "@/components/layout/Footer"` and add `<Footer />` after `{children}`.

**Step 3: Verify footer renders**

Run: `npm run dev`

Expected: Footer renders at bottom with 5 columns, social links, copyright.

**Step 4: Commit**

```bash
git add src/components/layout/Footer.tsx src/app/[locale]/layout.tsx
git commit -m "feat: add Footer with 5-column layout, social links, legal links"
```

---

## Phase 3: Landing Page Sections

### Task 9: Hero Section with Countdown

**Files:**
- Create: `src/components/sections/Hero.tsx`
- Create: `src/components/ui/Countdown.tsx`
- Modify: `src/app/[locale]/page.tsx`

**Step 1: Create Countdown component**

Create `src/components/ui/Countdown.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const FESTIVAL_DATE = new Date("2026-05-13T19:00:00+02:00");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(): TimeLeft {
  const difference = FESTIVAL_DATE.getTime() - new Date().getTime();
  if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <motion.span
        key={value}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-5xl md:text-7xl lg:text-8xl font-display text-tangerine tabular-nums"
      >
        {String(value).padStart(2, "0")}
      </motion.span>
      <span className="text-xs md:text-sm font-body text-bone/60 uppercase tracking-widest mt-2">
        {label}
      </span>
    </div>
  );
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("hero");

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return <div className="h-32" />;
  }

  return (
    <div className="flex items-center gap-4 md:gap-8">
      <CountdownUnit value={timeLeft.days} label={t("days")} />
      <span className="text-4xl md:text-6xl font-display text-bone/30">:</span>
      <CountdownUnit value={timeLeft.hours} label={t("hours")} />
      <span className="text-4xl md:text-6xl font-display text-bone/30">:</span>
      <CountdownUnit value={timeLeft.minutes} label={t("minutes")} />
      <span className="text-4xl md:text-6xl font-display text-bone/30">:</span>
      <CountdownUnit value={timeLeft.seconds} label={t("seconds")} />
    </div>
  );
}
```

**Step 2: Create Hero section**

Create `src/components/sections/Hero.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Countdown from "@/components/ui/Countdown";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background placeholder */}
      <div className="absolute inset-0 bg-licorice">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url(/images/placeholder/hero-bg.svg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-licorice via-licorice/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-9xl font-display text-bone mb-4"
        >
          {t("title")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl font-body text-bone/70 tracking-[0.3em] uppercase mb-12"
        >
          {t("subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-12"
        >
          <Countdown />
        </motion.div>

        <motion.a
          href="#tickets"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="btn-primary text-lg animate-pulse-slow inline-block"
        >
          {t("cta")}
        </motion.a>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-bone/40 text-2xl"
        >
          ↓
        </motion.div>
      </motion.div>
    </section>
  );
}
```

**Step 3: Add Hero to landing page**

Replace `src/app/[locale]/page.tsx` with:

```tsx
import Hero from "@/components/sections/Hero";

export default function Home() {
  return (
    <main>
      <Hero />
    </main>
  );
}
```

**Step 4: Verify hero and countdown**

Run: `npm run dev`

Expected: Fullscreen hero with title, countdown timer ticking, pulsing CTA button, scroll indicator. Check both `/de` and `/en`.

**Step 5: Commit**

```bash
git add src/components/sections/Hero.tsx src/components/ui/Countdown.tsx src/app/[locale]/page.tsx
git commit -m "feat: add Hero section with animated countdown timer and CTA"
```

---

### Task 10: About Section with Animated Counters

**Files:**
- Create: `src/components/sections/About.tsx`
- Create: `src/components/ui/AnimatedCounter.tsx`
- Modify: `src/app/[locale]/page.tsx`

**Step 1: Create AnimatedCounter component**

Create `src/components/ui/AnimatedCounter.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  label: string;
  duration?: number;
}

export default function AnimatedCounter({
  target,
  suffix = "",
  label,
  duration = 2,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const increment = target / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <span className="text-5xl md:text-6xl font-display text-tangerine">
        {count}
        {suffix}
      </span>
      <p className="text-sm font-body text-bone/60 uppercase tracking-widest mt-2">
        {label}
      </p>
    </motion.div>
  );
}
```

**Step 2: Create About section**

Create `src/components/sections/About.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

export default function About() {
  const t = useTranslations("about");

  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-bone mb-6 leading-tight">
              {t("headline")}
            </h2>
            <a href="#" className="btn-secondary inline-block">
              {t("cta")}
            </a>
          </motion.div>

          {/* Image placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="aspect-[4/3] rounded-2xl overflow-hidden bg-jambalaya"
          >
            <img
              src="/images/placeholder/about.svg"
              alt="Cocktail X Festival"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <AnimatedCounter target={50} suffix="+" label={t("bars")} />
          <AnimatedCounter target={50} suffix="+" label={t("cocktails")} />
          <AnimatedCounter target={10} label={t("days")} />
          <AnimatedCounter target={1} label={t("passport")} />
        </div>
      </div>
    </section>
  );
}
```

**Step 3: Add About to landing page**

Modify `src/app/[locale]/page.tsx` — add `import About from "@/components/sections/About"` and add `<About />` after `<Hero />`.

**Step 4: Verify**

Run: `npm run dev`

Expected: About section renders below hero. Counters animate when scrolled into view.

**Step 5: Commit**

```bash
git add src/components/sections/About.tsx src/components/ui/AnimatedCounter.tsx src/app/[locale]/page.tsx
git commit -m "feat: add About section with animated counter stats"
```

---

### Task 11: Bars Horizontal Scroll Slider

**Files:**
- Create: `src/components/sections/BarsSlider.tsx`
- Modify: `src/app/[locale]/page.tsx`

**Step 1: Create BarsSlider section**

Create `src/components/sections/BarsSlider.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLocale } from "next-intl";
import { bars } from "@/data/bars";

export default function BarsSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  return (
    <section ref={containerRef} className="py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-display text-bone"
        >
          LINEUP
        </motion.h2>
      </div>

      <motion.div style={{ x }} className="flex gap-6 pl-6">
        {bars.map((bar, i) => (
          <motion.div
            key={bar.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group relative flex-shrink-0 w-[300px] md:w-[400px] aspect-[3/4] rounded-2xl overflow-hidden bg-jambalaya cursor-pointer"
          >
            <img
              src={bar.image}
              alt={bar.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-licorice/90 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="text-2xl font-display text-bone mb-1">{bar.name}</h3>
              <p className="text-sm font-body text-tangerine">{bar.signatureCocktail}</p>
              <p className="text-xs font-body text-bone/50 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {bar.description[locale as "de" | "en"]}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
```

**Step 2: Add to landing page**

Modify `src/app/[locale]/page.tsx` — add `import BarsSlider from "@/components/sections/BarsSlider"` and add `<BarsSlider />` after `<About />`.

**Step 3: Verify**

Run: `npm run dev`

Expected: Horizontal bar cards that move as you scroll. Hover reveals details.

**Step 4: Commit**

```bash
git add src/components/sections/BarsSlider.tsx src/app/[locale]/page.tsx
git commit -m "feat: add horizontal scroll bars/lineup slider with hover effects"
```

---

### Task 12: Events Timeline Section

**Files:**
- Create: `src/components/sections/EventsTimeline.tsx`
- Modify: `src/app/[locale]/page.tsx`

**Step 1: Create EventsTimeline section**

Create `src/components/sections/EventsTimeline.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { events } from "@/data/events";

const accentColors: Record<string, string> = {
  opening: "bg-hibiscus",
  festival: "bg-tangerine",
  closing: "bg-bay-of-many",
  "side-event": "bg-everglade",
};

export default function EventsTimeline() {
  const locale = useLocale();

  return (
    <section className="section-padding bg-licorice">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-display text-bone text-center mb-16"
        >
          EVENTS
        </motion.h2>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-bone/10" />

          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className={`relative flex items-start gap-8 mb-16 ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Dot */}
              <div
                className={`absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full ${
                  accentColors[event.type]
                } border-4 border-licorice z-10`}
              />

              {/* Content */}
              <div className={`ml-20 md:ml-0 md:w-1/2 ${i % 2 === 0 ? "md:pr-16" : "md:pl-16"}`}>
                <div className="bg-licorice border border-bone/10 rounded-2xl overflow-hidden">
                  <div className="aspect-video bg-jambalaya">
                    <img
                      src={event.image}
                      alt={event.title[locale as "de" | "en"]}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-sm font-body text-tangerine mb-2">
                      {new Date(event.date).toLocaleDateString(locale === "de" ? "de-DE" : "en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}{" "}
                      · {event.time}
                    </p>
                    <h3 className="text-2xl font-display text-bone mb-2">
                      {event.title[locale as "de" | "en"]}
                    </h3>
                    <p className="text-sm font-body text-bone/60">
                      {event.description[locale as "de" | "en"]}
                    </p>
                    <p className="text-xs font-body text-bone/40 mt-2">📍 {event.location}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Add to landing page**

Modify `src/app/[locale]/page.tsx` — add `import EventsTimeline from "@/components/sections/EventsTimeline"` and add `<EventsTimeline />` after `<BarsSlider />`.

**Step 3: Verify and commit**

```bash
git add src/components/sections/EventsTimeline.tsx src/app/[locale]/page.tsx
git commit -m "feat: add Events timeline section with scroll animations"
```

---

### Task 13: How It Works Section

**Files:**
- Create: `src/components/sections/HowItWorks.tsx`
- Modify: `src/app/[locale]/page.tsx`

**Step 1: Create HowItWorks section**

Create `src/components/sections/HowItWorks.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const steps = [
  { key: "step1", color: "text-tangerine", bg: "bg-tangerine/10", border: "border-tangerine/30", icon: "✦" },
  { key: "step2", color: "text-hibiscus", bg: "bg-hibiscus/10", border: "border-hibiscus/30", icon: "◆" },
  { key: "step3", color: "text-bay-of-many", bg: "bg-bay-of-many/10", border: "border-bay-of-many/30", icon: "●" },
] as const;

export default function HowItWorks() {
  const t = useTranslations("howItWorks");

  return (
    <section className="section-padding">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-display text-bone text-center mb-16"
        >
          HOW IT WORKS
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className={`${step.bg} ${step.border} border rounded-2xl p-8 text-center`}
            >
              <div className={`text-5xl mb-4 ${step.color}`}>{step.icon}</div>
              <div className="text-sm font-body text-bone/40 mb-2">
                Step {i + 1}
              </div>
              <h3 className={`text-xl font-display ${step.color}`}>
                {t(step.key)}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 2: Add to landing page, verify, commit**

```bash
git add src/components/sections/HowItWorks.tsx src/app/[locale]/page.tsx
git commit -m "feat: add How It Works 3-step section with brand icons"
```

---

### Task 14: Tickets Section with Shopify Buy Button

**Files:**
- Create: `src/lib/shopify.ts`
- Create: `src/components/sections/Tickets.tsx`
- Modify: `src/app/[locale]/page.tsx`

**Step 1: Create Shopify client utility**

Create `src/lib/shopify.ts`:

```ts
import Client from "shopify-buy";

// Initialize Shopify client
// Replace with actual Shopify store credentials
const client = Client.buildClient({
  domain: "cocktail-x.myshopify.com",
  storefrontAccessToken: "PLACEHOLDER_STOREFRONT_TOKEN",
  apiVersion: "2024-01",
});

export default client;

// Helper to get all products
export async function getProducts() {
  try {
    const products = await client.product.fetchAll();
    return products;
  } catch (error) {
    console.error("Error fetching Shopify products:", error);
    return [];
  }
}
```

Note: The `storefrontAccessToken` must be replaced with the actual token from the Cocktail X Shopify admin (Settings → Apps → Storefront API).

**Step 2: Create Tickets section**

Create `src/components/sections/Tickets.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const tickets = [
  {
    name: "Passport",
    price: "€15",
    features: ["Zugang zu 50+ Bars", "50+ Signature Cocktails für je €6", "Digitaler Passport", "Stempel sammeln"],
    featuresEn: ["Access to 50+ bars", "50+ Signature Cocktails for €6 each", "Digital Passport", "Collect stamps"],
    accent: "tangerine",
    popular: true,
  },
];

export default function Tickets() {
  const t = useTranslations("tickets");

  return (
    <section id="tickets" className="py-20 bg-jambalaya/30">
      <div className="max-w-5xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-display text-bone text-center mb-16"
        >
          {t("headline")}
        </motion.h2>

        <div className="flex justify-center">
          {tickets.map((ticket, i) => (
            <motion.div
              key={ticket.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`bg-licorice border-2 ${
                ticket.popular ? "border-tangerine" : "border-bone/10"
              } rounded-2xl p-8 max-w-md w-full text-center`}
            >
              {ticket.popular && (
                <span className="inline-block bg-tangerine text-licorice text-xs font-display px-3 py-1 rounded-full mb-4">
                  MOST POPULAR
                </span>
              )}
              <h3 className="text-2xl font-display text-bone mb-2">{ticket.name}</h3>
              <p className="text-5xl font-display text-tangerine mb-6">{ticket.price}</p>
              <ul className="text-sm font-body text-bone/60 space-y-3 mb-8 text-left">
                {ticket.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="text-tangerine mt-0.5">✦</span>
                    {feature}
                  </li>
                ))}
              </ul>
              {/* Shopify Buy Button placeholder - will be replaced with actual SDK integration */}
              <button className="btn-primary w-full">{t("buyNow")}</button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 3: Add to landing page, verify, commit**

```bash
git add src/lib/shopify.ts src/components/sections/Tickets.tsx src/app/[locale]/page.tsx
git commit -m "feat: add Tickets section with Shopify Buy Button placeholder"
```

---

### Task 15: Illustrated Map Section

**Files:**
- Create: `src/components/sections/MapSection.tsx`
- Create: `public/map/munich-illustrated.svg` (placeholder)
- Modify: `src/app/[locale]/page.tsx`

**Step 1: Create placeholder SVG map**

Create `public/map/munich-illustrated.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="#191513"/>
  <!-- Simplified Munich shape -->
  <path d="M200,100 L600,100 Q700,100 700,200 L700,400 Q700,500 600,500 L200,500 Q100,500 100,400 L100,200 Q100,100 200,100 Z" fill="#523113" opacity="0.3" stroke="#e4d6c5" stroke-width="1" stroke-opacity="0.2"/>
  <!-- Isar river -->
  <path d="M350,100 Q380,250 360,400 Q340,500 370,600" fill="none" stroke="#223a7b" stroke-width="3" opacity="0.5"/>
  <!-- Bar location markers -->
  <circle cx="300" cy="250" r="8" fill="#f39200"/>
  <circle cx="420" cy="200" r="8" fill="#bd256e"/>
  <circle cx="380" cy="320" r="8" fill="#223a7b"/>
  <circle cx="500" cy="280" r="8" fill="#1a4620"/>
  <circle cx="250" cy="350" r="8" fill="#f39200"/>
  <circle cx="450" cy="400" r="8" fill="#bd256e"/>
  <!-- Star brandmark -->
  <path d="M400,280 L406,295 L422,295 L409,305 L414,320 L400,310 L386,320 L391,305 L378,295 L394,295 Z" fill="#f39200" opacity="0.6"/>
  <text x="400" y="560" text-anchor="middle" fill="#e4d6c5" font-family="sans-serif" font-size="14" opacity="0.4">MUNICH · Illustrated Map · Placeholder</text>
</svg>
```

**Step 2: Create MapSection component**

Create `src/components/sections/MapSection.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

export default function MapSection() {
  const t = useTranslations("map");
  const locale = useLocale();

  return (
    <section className="section-padding">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-display text-bone mb-12"
        >
          {t("headline")}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-2xl overflow-hidden border border-bone/10 mb-8"
        >
          <img
            src="/map/munich-illustrated.svg"
            alt="Munich Bar Map"
            className="w-full h-auto"
          />
        </motion.div>

        <Link href={`/${locale}/festival/bars`} className="btn-secondary inline-block">
          {t("cta")}
        </Link>
      </div>
    </section>
  );
}
```

**Step 3: Add to landing page, verify, commit**

```bash
git add src/components/sections/MapSection.tsx public/map/ src/app/[locale]/page.tsx
git commit -m "feat: add illustrated Map section with placeholder SVG"
```

---

### Task 16: Sponsors Marquee, Press/Quotes, Newsletter Sections

**Files:**
- Create: `src/components/sections/SponsorsMarquee.tsx`
- Create: `src/components/sections/PressQuotes.tsx`
- Create: `src/components/sections/Newsletter.tsx`
- Modify: `src/app/[locale]/page.tsx`

**Step 1: Create SponsorsMarquee**

Create `src/components/sections/SponsorsMarquee.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { sponsors } from "@/data/sponsors";

export default function SponsorsMarquee() {
  const doubled = [...sponsors, ...sponsors];

  return (
    <section className="py-16 border-y border-bone/5 overflow-hidden">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="flex items-center gap-16 whitespace-nowrap"
      >
        {doubled.map((sponsor, i) => (
          <a
            key={`${sponsor.id}-${i}`}
            href={sponsor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 opacity-40 hover:opacity-100 transition-opacity"
          >
            <img
              src={sponsor.logo}
              alt={sponsor.name}
              className="h-8 md:h-10 w-auto grayscale hover:grayscale-0 transition-all"
            />
          </a>
        ))}
      </motion.div>
    </section>
  );
}
```

**Step 2: Create PressQuotes**

Create `src/components/sections/PressQuotes.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";

const quotes = [
  {
    text: "Munich, a sleeping giant, is being awakened by the cocktail x festival.",
    author: "Simone Caporale",
    role: "World-renowned Bartender",
  },
  {
    text: "A statement celebrating Munich's cocktail culture.",
    author: "Alex Kratena",
    role: "Bartender & Entrepreneur",
  },
];

const pressLogos = ["Sueddeutsche Zeitung", "ARD", "Mit Vergnuegen"];

export default function PressQuotes() {
  return (
    <section className="section-padding">
      <div className="max-w-4xl mx-auto">
        {quotes.map((quote, i) => (
          <motion.blockquote
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            className="text-center mb-16"
          >
            <p className="text-2xl md:text-3xl font-body text-bone/80 italic mb-4">
              &ldquo;{quote.text}&rdquo;
            </p>
            <cite className="not-italic">
              <span className="font-display text-tangerine">{quote.author}</span>
              <span className="text-sm font-body text-bone/40 block">{quote.role}</span>
            </cite>
          </motion.blockquote>
        ))}

        {/* Press logos */}
        <div className="flex items-center justify-center gap-8 mt-12">
          {pressLogos.map((name) => (
            <span key={name} className="text-sm font-body text-bone/30 uppercase tracking-wider">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Step 3: Create Newsletter section**

Create `src/components/sections/Newsletter.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function Newsletter() {
  const t = useTranslations("newsletter");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to newsletter provider
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <section className="relative py-32 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url(/images/placeholder/newsletter-bg.svg)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-licorice via-licorice/80 to-licorice" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-xl mx-auto text-center px-6"
      >
        <h2 className="text-4xl md:text-5xl font-display text-bone mb-8">
          {t("headline")}
        </h2>

        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("placeholder")}
            required
            className="flex-1 px-4 py-3 bg-transparent border border-bone/20 rounded-lg
                       text-bone font-body placeholder:text-bone/30
                       focus:outline-none focus:border-tangerine transition-colors"
          />
          <button type="submit" className="btn-primary py-3">
            {t("submit")}
          </button>
        </form>
      </motion.div>
    </section>
  );
}
```

**Step 4: Add all three to landing page**

Modify `src/app/[locale]/page.tsx` — import and add `<SponsorsMarquee />`, `<PressQuotes />`, and `<Newsletter />` in order after `<MapSection />`.

**Step 5: Verify and commit**

```bash
git add src/components/sections/SponsorsMarquee.tsx src/components/sections/PressQuotes.tsx src/components/sections/Newsletter.tsx src/app/[locale]/page.tsx
git commit -m "feat: add Sponsors marquee, Press quotes, and Newsletter sections"
```

---

### Task 17: Complete Landing Page Assembly

**Files:**
- Modify: `src/app/[locale]/page.tsx`

**Step 1: Assemble all landing page sections in final order**

Final `src/app/[locale]/page.tsx`:

```tsx
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import BarsSlider from "@/components/sections/BarsSlider";
import EventsTimeline from "@/components/sections/EventsTimeline";
import HowItWorks from "@/components/sections/HowItWorks";
import Tickets from "@/components/sections/Tickets";
import MapSection from "@/components/sections/MapSection";
import SponsorsMarquee from "@/components/sections/SponsorsMarquee";
import PressQuotes from "@/components/sections/PressQuotes";
import Newsletter from "@/components/sections/Newsletter";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <BarsSlider />
      <EventsTimeline />
      <HowItWorks />
      <Tickets />
      <MapSection />
      <SponsorsMarquee />
      <PressQuotes />
      <Newsletter />
    </main>
  );
}
```

**Step 2: Full visual test**

Run: `npm run dev`

Walk through the entire landing page on both `/de` and `/en`. Verify all sections render, animations trigger on scroll, countdown ticks. Check mobile responsiveness at 375px, 768px, and 1440px widths.

**Step 3: Commit**

```bash
git add src/app/[locale]/page.tsx
git commit -m "feat: assemble complete landing page with all 10 sections"
```

---

## Phase 4: Sub-Pages

### Task 18: Festival Sub-Pages

**Files:**
- Create: `src/app/[locale]/festival/page.tsx`
- Create: `src/app/[locale]/festival/bars/page.tsx`
- Create: `src/app/[locale]/festival/produkte/page.tsx`
- Create: `src/app/[locale]/festival/sponsoren/page.tsx`
- Create: `src/app/[locale]/festival/events/page.tsx`
- Create: `src/app/[locale]/festival/history/page.tsx`
- Create: `src/app/[locale]/festival/about/page.tsx`

Each page follows the same pattern: Hero banner → Content → CTA. Use the static data files from Task 5. Bars page includes a district filter using `useState`. History page uses tab navigation for 2023/2024/2025.

**Step 1: Create all 7 festival pages**

Implement each one with the design from the design document. The bars page is the most complex — it needs a filter bar and card grid.

**Step 2: Verify all routes work**

Visit each page in both `/de` and `/en` locales.

**Step 3: Commit**

```bash
git add src/app/[locale]/festival/
git commit -m "feat: add all Festival sub-pages (bars, produkte, sponsoren, events, history, about)"
```

---

### Task 19: Awards, App, Shop, Blog Pages

**Files:**
- Create: `src/app/[locale]/awards/page.tsx`
- Create: `src/app/[locale]/awards/history/page.tsx`
- Create: `src/app/[locale]/app/page.tsx`
- Create: `src/app/[locale]/shop/page.tsx`
- Create: `src/app/[locale]/blog/page.tsx`
- Create: `src/app/[locale]/blog/[slug]/page.tsx`

Each page follows the design doc. Shop page embeds Shopify products. Blog uses static data with `[slug]` dynamic routing.

**Step 1: Create all pages**

**Step 2: Verify all routes and commit**

```bash
git add src/app/[locale]/awards/ src/app/[locale]/app/ src/app/[locale]/shop/ src/app/[locale]/blog/
git commit -m "feat: add Awards, App, Shop, and Blog pages"
```

---

### Task 20: Footer Pages (Connect, About, Legal)

**Files:**
- Create: `src/app/[locale]/connect/excelerator/page.tsx`
- Create: `src/app/[locale]/about/catering/page.tsx`
- Create: `src/app/[locale]/about/founder/page.tsx`
- Create: `src/app/[locale]/about/contact/page.tsx`
- Create: `src/app/[locale]/legal/datenschutz/page.tsx`
- Create: `src/app/[locale]/legal/cookies/page.tsx`
- Create: `src/app/[locale]/legal/impressum/page.tsx`

Excelerator page has a contact form. Legal pages use Bone background for readability. Contact page has form + address + social links.

**Step 1: Create all footer pages**

**Step 2: Verify and commit**

```bash
git add src/app/[locale]/connect/ src/app/[locale]/about/ src/app/[locale]/legal/
git commit -m "feat: add footer pages (Excelerator form, About Us, Legal)"
```

---

## Phase 5: Polish & Integration

### Task 21: Page Transitions with Framer Motion

**Files:**
- Create: `src/components/layout/PageTransition.tsx`
- Modify: `src/app/[locale]/layout.tsx`

**Step 1: Create page transition wrapper**

Create `src/components/layout/PageTransition.tsx`:

```tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

**Step 2: Wrap children in layout with PageTransition**

**Step 3: Verify and commit**

```bash
git add src/components/layout/PageTransition.tsx src/app/[locale]/layout.tsx
git commit -m "feat: add page transition animations with Framer Motion"
```

---

### Task 22: SEO Metadata for All Pages

**Files:**
- Modify: All `page.tsx` files — add `generateMetadata` function

**Step 1: Add metadata to each page**

Each page gets its own `generateMetadata` function with title, description, and OpenGraph tags.

**Step 2: Create `src/app/[locale]/not-found.tsx`**

Custom 404 page in brand style.

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add SEO metadata and custom 404 page"
```

---

### Task 23: Shopify Buy Button Integration

**Files:**
- Modify: `src/lib/shopify.ts`
- Create: `src/components/ui/ShopifyBuyButton.tsx`
- Modify: `src/components/sections/Tickets.tsx`
- Modify: `src/app/[locale]/shop/page.tsx`

**Step 1: Create ShopifyBuyButton component**

This embeds the actual Shopify Buy Button SDK with the brand-styled checkout. Requires the real Shopify Storefront Access Token.

**Step 2: Replace placeholder buttons in Tickets and Shop pages**

**Step 3: Verify checkout flow and commit**

```bash
git add src/lib/shopify.ts src/components/ui/ShopifyBuyButton.tsx src/components/sections/Tickets.tsx src/app/[locale]/shop/page.tsx
git commit -m "feat: integrate Shopify Buy Button SDK for embedded checkout"
```

---

### Task 24: Build Optimization & GoDaddy Deployment

**Files:**
- Modify: `next.config.mjs` (add `output: "standalone"` or `"export"` depending on GoDaddy plan)
- Create: `.env.local` (Shopify credentials)
- Create: `.env.example`

**Step 1: Configure build for GoDaddy**

If GoDaddy supports Node.js: use `output: "standalone"`.
If static hosting only: use `output: "export"` with `generateStaticParams` for all routes.

**Step 2: Build and test**

Run:
```bash
npm run build
npm run start
```

Expected: Production build succeeds. All pages render correctly.

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: configure production build for GoDaddy deployment"
```

---

## Phase 6: Final QA

### Task 25: Cross-Browser & Responsive Testing

**Step 1:** Test all pages at 375px (iPhone), 768px (iPad), 1440px (Desktop).
**Step 2:** Test in Chrome, Firefox, Safari.
**Step 3:** Verify all animations perform well (no jank, no layout shifts).
**Step 4:** Verify i18n on all pages (both DE and EN).
**Step 5:** Lighthouse audit — target 90+ on Performance, Accessibility, SEO.

### Task 26: Final Commit & Tag

```bash
git add -A
git commit -m "feat: Cocktail X Festival website v1.0 - complete"
git tag v1.0.0
```

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1 | 1–6 | Project setup, dependencies, Tailwind, i18n, data, placeholders |
| 2 | 7–8 | Header, Footer, Navigation |
| 3 | 9–17 | All 10 landing page sections |
| 4 | 18–20 | All sub-pages (Festival, Awards, App, Shop, Blog, Footer) |
| 5 | 21–24 | Page transitions, SEO, Shopify integration, deployment |
| 6 | 25–26 | QA, testing, final tag |

**Total: 26 tasks across 6 phases.**
