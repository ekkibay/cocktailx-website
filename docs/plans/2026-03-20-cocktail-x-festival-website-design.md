# Cocktail X Festival Website — Design Document

**Date:** 2026-03-20
**Status:** Approved

---

## 1. Overview

A new emotional, immersive festival website for Cocktail X — Germany's biggest cocktail festival in Munich (May 13–30, 2026). The site replaces the current Shopify theme with a custom Next.js frontend while keeping Shopify for e-commerce (tickets, merch) via the Storefront API and Buy Button SDK.

### Key Requirements
- Emotional, dark-mode festival design using official Cocktail X brand identity
- Countdown timer, embedded ticket purchase, illustrated map, lineup/bars showcase
- Shopify integration for Passport/Ticket and Merch purchases (embedded checkout)
- Bilingual: German (default) + English
- Placeholder images throughout (to be replaced with real assets later)
- Lots of imagery of dancing people, nightlife, cocktail culture

---

## 2. Tech Stack

| Area | Technology |
|------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Animations | Framer Motion (scroll animations, page transitions, parallax) |
| Shop | Shopify Storefront API + Buy Button SDK (embedded checkout) |
| Map | Static illustrated SVG map in brand style |
| i18n | next-intl (German default + English) |
| Data | Static / Hardcoded (JSON/TypeScript files) |
| Fonts | Rousseau Deco Bold (display) + Geist Thin (body) |
| Hosting | GoDaddy |

---

## 3. Brand Identity

### Brand Vibe
Retro-Italo, 1970s Milan Cocktail Bar — elegant but playful, cinematic, chic. "A visual and emotional language that celebrates the art of gathering."

### Color Palette (Official Brand Colors on Dark Background)

| Name | Hex | RGB | Role |
|------|-----|-----|------|
| Licorice | `#191513` | 25, 21, 19 | Primary background |
| Jambalaya | `#523113` | 82, 49, 19 | Secondary background, warm sections |
| Tangerine | `#f39200` | 243, 146, 0 | Primary accent, CTAs, countdown |
| Hibiscus | `#bd256e` | 189, 37, 110 | Secondary accent |
| Bay of Many | `#223a7b` | 34, 58, 123 | Tertiary accent |
| Everglade | `#1a4620` | 26, 70, 32 | Accent 4 |
| Bone | `#e4d6c5` | 228, 214, 197 | Text, light backgrounds |
| White | `#ffffff` | 255, 255, 255 | Text, highlights |

### Typography
- **Display / Headlines:** Rousseau Deco Bold (Art Deco inspired)
- **Body / UI:** Geist Thin (modern sans-serif)

### Visual Elements
- Geometric illustrations inspired by cocktail culture (glasses, garnishes, 4-point star brandmark)
- Stamp/postage motif as recurring brand element
- Photography: cinematic lighting, warm, understated luxury, rich neutrals

---

## 4. Site Structure

### Header Navigation
```
[Logo: cocktail * festival]   Festival | Awards | App | Shop | Blog   [DE/EN] [Cart] [GET PASSPORT]
```
- Sticky header, transparent on hero, Licorice + blur on scroll
- "GET PASSPORT" primary CTA in Tangerine
- Cart icon for Shopify
- Language toggle DE/EN
- Mobile: fullscreen overlay menu with brand shapes decoration

### Complete Sitemap

#### Landing Page `/`
1. Hero (fullscreen video/image, countdown, CTA)
2. About (stats, intro)
3. Lineup/Bars (horizontal scroll slider)
4. Events (timeline)
5. How it Works (3 steps)
6. Tickets (Shopify embedded)
7. Map (illustrated SVG)
8. Sponsors (logo marquee)
9. Press/Quotes
10. Newsletter signup
11. Footer

#### Cocktail X Festival `/festival`
- `/festival` — Overview with participate CTA, grid linking to subpages
- `/festival/bars` — 50+ bars grid with district filter
- `/festival/produkte` — Signature cocktails showcase
- `/festival/sponsoren` — Sponsor tiers with logos and descriptions
- `/festival/events` — Detailed event timeline
- `/festival/history` — Tab navigation for 2023/2024/2025 with galleries
- `/festival/about` — Brand story, mission, team

#### Cocktail X Awards `/awards`
- `/awards` — Event description, categories
- `/awards/history` — 2025 winners showcase

#### Cocktail X App `/app`
- How it Works (3-step, expanded)
- App mockups with feature list
- Download CTAs

#### Cocktail X Shop `/shop`
- Shopify Storefront embedded (Passport, T-Shirt, Gift Card)
- Product grid with Buy Buttons
- Cart slide-over panel

#### Cocktail X Blog `/blog`
- Blog grid with featured post
- Individual posts with newsletter signup
- Categories/tags

#### Footer Pages

**CONNECT**
- Become a Sponsor → external redirect to cocktailx.app
- Become a Bar → external redirect to cocktailx.app
- Become a Guest → external redirect to cocktailx.app
- Become an Excelerator → contact form

**EVENTS**
- Grand Opening
- Closing & Awards

**APP**
- Login → external redirect

**ABOUT US**
- Cocktail X Catering
- Founder (bio + photo)
- Contact (form + address + social)

**LEGAL**
- Datenschutz (Privacy Policy)
- Cookies
- Impressum (Legal Notice)

### Footer Layout
- 5-column layout (Connect, Events, App, About Us, Legal)
- Social media icons (Instagram, TikTok, Facebook, LinkedIn)
- Newsletter mini-signup
- Copyright + decorative brand shapes

---

## 5. Landing Page — Detailed Section Design

### 5.1 Hero — Fullscreen Immersive
- Fullscreen background video/image (placeholder: dancing people, nightlife)
- Dark gradient overlay from bottom
- Rousseau Deco Bold headline: `COCKTAIL * FESTIVAL`
- Subline: `MUNICH . MAY 13-30 . 2026`
- Animated countdown timer (days:hours:minutes:seconds) in Tangerine
- CTA button: `GET YOUR PASSPORT` (Tangerine, pulsing)
- Scroll-down indicator (animated arrow)
- Framer Motion: parallax on background, staggered fade-in

### 5.2 About — Quick Intro
- Split layout: text left, image right (placeholder: bartender scene)
- Headline: `GERMANY'S BIGGEST COCKTAIL FESTIVAL`
- Animated counters on scroll: `50+` Bars, `50+` Cocktails, `10` Days, `1` Passport
- CTA: `DISCOVER MORE`

### 5.3 Lineup / Bars — Horizontal Scroll
- Large image cards of participating bars (placeholder)
- Hover: reveal bar name + signature cocktail
- Apple-style horizontal scroll on vertical scroll
- Framer Motion: cards slide in on scroll

### 5.4 Events — Timeline
- Dark background with Hibiscus/Bay of Many accents
- Vertical timeline: Grand Opening → Festival Days → Closing & Awards
- Each event with placeholder image
- Framer Motion: timeline builds on scroll

### 5.5 How it Works — 3 Steps
- Illustrated icons in brand style (geometric shapes)
- Step 1: `GET YOUR PASSPORT` (Tangerine)
- Step 2: `VISIT 50+ BARS` (Hibiscus)
- Step 3: `COLLECT STAMPS` (Bay of Many)
- Stamp motif as visual element

### 5.6 Tickets — Shopify Embedded
- Full width, Bone/Jambalaya background as contrast break
- Ticket cards (Standard / VIP if applicable)
- Price, inclusions
- Shopify Buy Button embedded
- CTA: `BUY NOW`

### 5.7 Map — Illustrated
- Static SVG illustration of Munich in brand style
- Geometric shapes mark bar locations
- Decorative, not interactive — brand colors
- CTA: `EXPLORE ALL BARS` → `/festival/bars`

### 5.8 Sponsors — Logo Marquee
- Infinite scrolling logo ticker (Diageo, Olymp, Lucid Motors, Campari, Studio vom Berg)
- Framer Motion: smooth infinite scroll

### 5.9 Press / Quotes
- Bartender quotes (Simone Caporale, Alex Kratena)
- Press logos (Sueddeutsche Zeitung, ARD, etc.)
- Subtle parallax effect

### 5.10 Newsletter — CTA Section
- Full-width section with background image (placeholder: dancing people)
- Headline: `DON'T MISS OUT`
- Email input + submit button
- Framer Motion: slide-in on scroll

### 5.11 Footer
- 5-column layout as described above

---

## 6. Sub-Pages Design

### Festival Pages
- **Bars:** Filterable grid by district, cards with image/name/address/cocktail, hover lift
- **Produkte:** Large-format cocktail cards with rotating brand accent colors
- **Sponsoren:** Tier system, large logos + descriptions
- **Events:** Expanded timeline with full descriptions
- **History:** Tab/slider navigation per year, photo galleries, key stats
- **About:** Brand story, mission, team photos

### Awards
- Elegant hero, category grid, winner showcase for 2025

### App
- Phone mockup floating in on scroll, 3-step how-it-works, feature list, download CTAs

### Shop
- Shopify Storefront embedded, product grid, Buy Buttons, cart slide-over panel

### Blog
- Grid layout, featured post, individual posts with good typography, newsletter at bottom

### Footer Pages
- Connect: external redirects + Excelerator contact form
- About: Catering description, Founder bio, Contact form
- Legal: Clean text pages on Bone background for readability

---

## 7. Animation Concept

| Effect | Where |
|--------|-------|
| Parallax Scrolling | Hero image, Press section, Newsletter |
| Fade-in + Slide-up | All sections on first appearance |
| Counter Animation | Stats (50+ Bars, 10 Days etc.) |
| Horizontal Scroll | Bars/Lineup slider |
| Timeline Build | Events section |
| Infinite Marquee | Sponsor logos |
| Pulse | CTA buttons |
| Page Transitions | Smooth fade between pages |
| Hover Lift | Cards throughout |
| Phone Float-in | App page mockup |

---

## 8. Global UI Elements

| Element | Design |
|---------|--------|
| Buttons Primary | Tangerine `#f39200`, Rousseau Deco Bold, rounded corners |
| Buttons Secondary | Outline Bone, hover fill Bone |
| Cards | Licorice BG with subtle border, hover lift shadow |
| Countdown | Large numbers in Tangerine, labels in Bone/Geist Thin |
| Navigation Mobile | Fullscreen overlay, brand shapes decoration, slide-in |
| Cookie Banner | Minimalist, Bone text on Jambalaya BG |
| Loading States | Brandmark (4-point star) as animated spinner |
| Form Inputs | Bone border on Licorice, focus state Tangerine |

---

## 9. Project Structure

```
src/
├── app/
│   ├── [locale]/               # i18n routing (de/en)
│   │   ├── page.tsx            # Landing Page
│   │   ├── festival/
│   │   │   ├── page.tsx        # Festival overview
│   │   │   ├── bars/page.tsx
│   │   │   ├── produkte/page.tsx
│   │   │   ├── sponsoren/page.tsx
│   │   │   ├── events/page.tsx
│   │   │   ├── history/page.tsx
│   │   │   └── about/page.tsx
│   │   ├── awards/
│   │   │   ├── page.tsx
│   │   │   └── history/page.tsx
│   │   ├── app/page.tsx
│   │   ├── shop/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── connect/
│   │   │   └── excelerator/page.tsx
│   │   ├── about/
│   │   │   ├── catering/page.tsx
│   │   │   ├── founder/page.tsx
│   │   │   └── contact/page.tsx
│   │   └── legal/
│   │       ├── datenschutz/page.tsx
│   │       ├── cookies/page.tsx
│   │       └── impressum/page.tsx
│   └── layout.tsx
├── components/
│   ├── ui/                     # Button, Card, Countdown, Input, Badge
│   ├── sections/               # Hero, Tickets, Map, Lineup, Timeline, Newsletter
│   └── layout/                 # Header, Footer, MobileNav, LanguageSwitcher
├── data/
│   ├── bars.ts                 # Static bar data
│   ├── events.ts               # Static event data
│   ├── sponsors.ts             # Static sponsor data
│   ├── cocktails.ts            # Static cocktail data
│   └── blog-posts.ts           # Static blog data
├── i18n/
│   ├── de.json                 # German translations
│   └── en.json                 # English translations
├── lib/
│   ├── shopify.ts              # Shopify Storefront API client
│   └── utils.ts                # Utility functions
├── styles/
│   └── globals.css             # Tailwind + custom styles + font imports
└── public/
    ├── fonts/                  # Rousseau Deco Bold, Geist Thin
    ├── images/                 # Placeholder images
    ├── icons/                  # Brand icons (geometric shapes, brandmark)
    └── map/                    # Illustrated SVG map
```

---

## 10. External Integrations

| Service | Purpose | Method |
|---------|---------|--------|
| Shopify | Tickets, Merch, Checkout | Storefront API + Buy Button SDK |
| cocktailx.app | Become a Sponsor/Bar/Guest | External redirects |
| my.cocktail-x.com | Passport Portal | External redirect |
| Instagram/TikTok/Facebook/LinkedIn | Social links | External links |
| Newsletter Provider (tbd) | Email signup | API integration |

---

## 11. Decisions Log

| Decision | Choice | Reason |
|----------|--------|--------|
| Framework | Next.js + Tailwind + Framer Motion | Best balance of performance, DX, and animation capability |
| Architecture | Headless Shopify | Full creative freedom while keeping Shopify for commerce |
| Ticket Purchase | Shopify Buy Button embedded | User stays on site, no redirect |
| Map | Static illustrated SVG | On-brand, fits retro-italo design language |
| Data Management | Static/Hardcoded | Fast to build, no CMS overhead, can add later |
| i18n | German (default) + English | Munich local focus + international appeal |
| Hosting | GoDaddy | Existing infrastructure |
| Design Direction | Brand colors on dark (Licorice) background | Festival energy meets Cocktail X brand identity |
