"use client";

import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useReveal } from "@/hooks/useReveal";

/* ────────────────────────── DATA ────────────────────────── */

const usps = [
  {
    icon: "⚡",
    de: { title: "Nitro-Technologie", text: "Bis 500 Cocktails pro Stunde — konstant hohe Qualität, auch bei Peaks." },
    en: { title: "Nitro Technology", text: "Up to 500 cocktails per hour — consistently high quality, even at peak times." },
  },
  {
    icon: "✓",
    de: { title: "500+ Events", text: "Tesla, McKinsey, Siemens & Messe München vertrauen uns." },
    en: { title: "500+ Events", text: "Tesla, McKinsey, Siemens & Messe München trust us." },
  },
  {
    icon: "🎯",
    de: { title: "Alles aus einer Hand", text: "Konzept, Logistik, Umsetzung — ihr lehnt euch zurück." },
    en: { title: "All-in-One", text: "Concept, logistics, execution — you sit back and relax." },
  },
  {
    icon: "⏱",
    de: { title: "Angebot in 24h", text: "Schnelle, transparente Kalkulation — kein Warten." },
    en: { title: "Quote in 24h", text: "Fast, transparent pricing — no waiting." },
  },
];

const cocktailConcepts = [
  {
    de: { title: "Nitro High-Volume", capacity: "500+ Drinks/Std", text: "Große Besucherströme, Stand-Partys, Peaks — perfekt für hohes Gästeaufkommen." },
    en: { title: "Nitro High-Volume", capacity: "500+ Drinks/hr", text: "Large visitor flows, booth parties, peaks — perfect for high guest volume." },
  },
  {
    de: { title: "Geshakte Cocktails", capacity: "120 Drinks/Std", text: "Premium-Stand, Produktpräsentation, Marken-Inszenierung — handcrafted quality." },
    en: { title: "Shaken Cocktails", capacity: "120 Drinks/hr", text: "Premium booth, product presentation, brand staging — handcrafted quality." },
  },
  {
    de: { title: "Molekular Live", capacity: "80 Drinks/Std", text: "VIP-Empfänge, Show-Element & Social-Media-Content — Wow-Faktor garantiert." },
    en: { title: "Molecular Live", capacity: "80 Drinks/hr", text: "VIP receptions, show element & social media content — wow factor guaranteed." },
  },
];

const messeRefs = [
  { name: "INHORGENTA München", de: "48.000 Drinks · 3 Messetage", en: "48,000 Drinks · 3 Fair Days" },
  { name: "ISPO München", de: "3.200 Drinks · After-Work Special", en: "3,200 Drinks · After-Work Special" },
  { name: "Automotive Leitmesse", de: "5.000 Gäste · Full-Service", en: "5,000 Guests · Full-Service" },
];

const eventTypes = [
  {
    de: { title: "Produktlaunches", text: "Custom Cocktails passend zur Produktstory — vom Branding bis zum letzten Detail." },
    en: { title: "Product Launches", text: "Custom cocktails matching your product story — from branding to every last detail." },
  },
  {
    de: { title: "Firmenfeiern & Jubiläen", text: "Cocktails in euren Unternehmensfarben — ein unvergessliches Erlebnis für euer Team." },
    en: { title: "Company Celebrations", text: "Cocktails in your corporate colours — an unforgettable experience for your team." },
  },
  {
    de: { title: "Networking & VIP", text: "Signature Cocktails als Gesprächsstarter — für Empfänge, die beeindrucken." },
    en: { title: "Networking & VIP", text: "Signature cocktails as conversation starters — for receptions that impress." },
  },
];

const packages = [
  {
    name: "Essential",
    price: "2.990",
    guests: { de: "bis 100 Gäste", en: "up to 100 guests" },
    highlights: { de: "3h · 2 Nitro + 1 Longdrink · 1 Bar · 2 Bartender", en: "3h · 2 Nitro + 1 Longdrink · 1 Bar · 2 Bartenders" },
    featured: false,
  },
  {
    name: "Business",
    price: "5.900",
    guests: { de: "bis 200 Gäste", en: "up to 200 guests" },
    highlights: { de: "4–5h · 3 Nitro + Signature · 2 Bars · 4 Personal", en: "4–5h · 3 Nitro + Signature · 2 Bars · 4 Staff" },
    featured: true,
  },
  {
    name: "Premium",
    price: "9.900",
    guests: { de: "bis 300 Gäste", en: "up to 300 guests" },
    highlights: { de: "5–6h · Show-Setup · 3 Bars · Event Manager", en: "5–6h · Show Setup · 3 Bars · Event Manager" },
    featured: false,
  },
  {
    name: "Messe & Großevent",
    price: "14.900",
    guests: { de: "500+ Gäste", en: "500+ guests" },
    highlights: { de: "6–8h · 4–10 Bars · volle Logistik · Event Manager", en: "6–8h · 4–10 Bars · Full Logistics · Event Manager" },
    featured: false,
  },
];

const processSteps = [
  {
    step: "01",
    de: { title: "Beratung", text: "Kickoff-Call, Konzeptentwicklung, Angebot innerhalb von 48 Stunden." },
    en: { title: "Consultation", text: "Kickoff call, concept development, quote within 48 hours." },
  },
  {
    step: "02",
    de: { title: "Planung", text: "Tasting, Logistik-Planung, Feinabstimmung aller Details." },
    en: { title: "Planning", text: "Tasting, logistics planning, fine-tuning all details." },
  },
  {
    step: "03",
    de: { title: "Event", text: "Aufbau 2–4h vorher, professioneller Service, Event Manager vor Ort." },
    en: { title: "Event", text: "Setup 2–4h ahead, professional service, event manager on-site." },
  },
  {
    step: "04",
    de: { title: "Follow-Up", text: "Sauberer Abbau, Feedback-Gespräch, Dokumentation." },
    en: { title: "Follow-Up", text: "Clean teardown, feedback session, documentation." },
  },
];

const messeBadges = [
  { de: "Erfahrenes mehrsprachiges Team", en: "Experienced multilingual team" },
  { de: "Express-Besetzung < 24h", en: "Express staffing < 24h" },
  { de: "Logistik-Sicher", en: "Logistics-Secure" },
  { de: "White-Label in eurer CI", en: "White-label in your CI" },
];

/* ────────────────────────── HELPERS ────────────────────────── */

function RevealDiv({
  children,
  className,
  delay = 0,
  direction = "up" as const,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}) {
  const { ref, style } = useReveal<HTMLDivElement>({ delay, direction, distance: 30 });
  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}

/* ────────────────────────── PAGE ────────────────────────── */

export default function CateringPage() {
  const locale = useLocale() as "de" | "en";

  return (
    <main className="min-h-screen bg-ct-cream">
      {/* ── 1. HERO ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <Image
          src="/images/catering/ct-bartender-1.jpg"
          alt="Premium Cocktail Catering Event in München — Cocktail X Catering"
          fill
          priority
          className="object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />
        {/* Bottom gradient into bone */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ct-cream to-transparent" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <RevealDiv delay={100}>
            <p className="text-xs font-body font-bold uppercase tracking-[0.3em] text-ct-red mb-6">
              Cocktail Excellence. Event Precision.
            </p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-[0.95]">
              {locale === "de"
                ? "Premium Cocktail Catering für München"
                : "Premium Cocktail Catering for Munich"}
            </h1>
          </RevealDiv>
          <RevealDiv delay={250}>
            <p className="font-body text-lg md:text-xl text-white/85 max-w-2xl mx-auto mb-4 leading-relaxed">
              {locale === "de"
                ? "Von den Machern des Cocktail X Festivals. Wir bringen die Cocktails zu Ihnen."
                : "From the creators of Cocktail X Festival. We bring the cocktails to you."}
            </p>
            <p className="font-body text-base text-white/60 max-w-xl mx-auto mb-10">
              {locale === "de"
                ? "Corporate Events & Messen — professionell, zuverlässig, unvergesslich."
                : "Corporate Events & Trade Fairs — professional, reliable, unforgettable."}
            </p>
          </RevealDiv>
          <RevealDiv delay={400}>
            <Link
              href={`/${locale}/catering/kontakt`}
              className="inline-block px-10 py-4 rounded-full bg-ct-red text-white font-body font-bold text-sm uppercase tracking-wider hover:bg-ct-red/85 transition-all duration-200 shadow-lg shadow-ct-red/25"
            >
              {locale === "de" ? "Angebot anfragen" : "Request a Quote"}
            </Link>
          </RevealDiv>
        </div>
      </section>

      {/* ── 2. USP SECTION ── */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {usps.map((usp, i) => (
              <RevealDiv key={i} delay={i * 100} className="text-center p-8 rounded-2xl bg-white/60 border border-everglade/10">
                <span className="text-3xl block mb-4">{usp.icon}</span>
                <h3 className="font-display text-lg text-licorice mb-2">
                  {locale === "de" ? usp.de.title : usp.en.title}
                </h3>
                <p className="font-body text-sm text-everglade/70 leading-relaxed">
                  {locale === "de" ? usp.de.text : usp.en.text}
                </p>
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. MESSE-CATERING ── */}
      <section id="messe" className="py-20 md:py-28 px-4 bg-ct-wine">
        <div className="max-w-6xl mx-auto">
          <RevealDiv>
            <p className="text-xs font-body font-bold uppercase tracking-[0.25em] text-ct-cream/60 mb-4 text-center">
              {locale === "de" ? "Unser Messe-Service" : "Our Trade Fair Service"}
            </p>
            <h2 className="font-display text-4xl md:text-6xl text-ct-cream text-center mb-4">
              {locale === "de" ? "Messe-Service München" : "Trade Fair Service Munich"}
            </h2>
            <p className="font-body text-lg text-ct-cream/75 text-center max-w-2xl mx-auto mb-12">
              {locale === "de"
                ? "Euer Cocktail-Partner für Messestände & After-Work."
                : "Your cocktail partner for trade fair booths & after-work events."}
            </p>
          </RevealDiv>

          {/* USP Badges */}
          <RevealDiv delay={100} className="flex flex-wrap justify-center gap-3 mb-16">
            {messeBadges.map((badge, i) => (
              <span
                key={i}
                className="px-4 py-2 rounded-full border border-ct-cream/20 text-ct-cream/80 font-body text-xs uppercase tracking-wider"
              >
                {locale === "de" ? badge.de : badge.en}
              </span>
            ))}
          </RevealDiv>

          {/* Cocktail Concepts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {cocktailConcepts.map((concept, i) => {
              const c = locale === "de" ? concept.de : concept.en;
              return (
                <RevealDiv key={i} delay={i * 120} className="p-8 rounded-2xl bg-white/[0.06] border border-ct-cream/10 hover:border-ct-cream/25 transition-colors">
                  <p className="text-xs font-body font-bold uppercase tracking-wider text-ct-red mb-3">
                    {c.capacity}
                  </p>
                  <h3 className="font-display text-2xl text-ct-cream mb-3">{c.title}</h3>
                  <p className="font-body text-sm text-ct-cream/65 leading-relaxed">{c.text}</p>
                </RevealDiv>
              );
            })}
          </div>

          {/* Messe References */}
          <RevealDiv delay={200}>
            <h3 className="font-display text-xl text-ct-cream text-center mb-8">
              {locale === "de" ? "Referenzen" : "References"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {messeRefs.map((ref, i) => (
                <div key={i} className="text-center p-6 rounded-xl bg-white/[0.04] border border-ct-cream/10">
                  <p className="font-display text-lg text-ct-cream mb-1">{ref.name}</p>
                  <p className="font-body text-sm text-ct-cream/55">
                    {locale === "de" ? ref.de : ref.en}
                  </p>
                </div>
              ))}
            </div>
          </RevealDiv>
        </div>
      </section>

      {/* ── 4. CORPORATE EVENTS ── */}
      <section id="corporate" className="py-20 md:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <RevealDiv>
            <p className="text-xs font-body font-bold uppercase tracking-[0.25em] text-everglade/50 mb-4 text-center">
              {locale === "de" ? "Corporate Events" : "Corporate Events"}
            </p>
            <h2 className="font-display text-4xl md:text-6xl text-licorice text-center mb-4">
              {locale === "de"
                ? "Events, die eure Marke stärken"
                : "Events That Strengthen Your Brand"}
            </h2>
            <p className="font-body text-lg text-everglade/65 text-center max-w-2xl mx-auto mb-16">
              {locale === "de"
                ? "Von Produktlaunches bis VIP-Empfänge — maßgeschneiderte Cocktail-Konzepte für jede Occasion."
                : "From product launches to VIP receptions — bespoke cocktail concepts for every occasion."}
            </p>
          </RevealDiv>

          {/* Event Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {eventTypes.map((type, i) => {
              const t = locale === "de" ? type.de : type.en;
              const images = ["/images/catering/ct-bar-1.jpg", "/images/catering/ct-bartender-1.jpg", "/images/catering/ct-event-2.jpg"];
              const altTexts = [
                locale === "de" ? "Bartender gießt handgemachten Cocktail bei einem Produktlaunch in München" : "Bartender pouring handcrafted cocktail at a product launch in Munich",
                locale === "de" ? "Professionelles Bartender-Team im Smoking bei einer Firmenfeier" : "Professional bartender team in tuxedos at a corporate celebration",
                locale === "de" ? "Elegante Cocktails beim VIP-Empfang — Premium Catering München" : "Elegant cocktails at VIP reception — premium catering Munich",
              ];
              return (
                <RevealDiv key={i} delay={i * 120} className="group rounded-2xl overflow-hidden bg-white border border-everglade/10 hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={images[i]}
                      alt={altTexts[i]}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl text-licorice mb-2">{t.title}</h3>
                    <p className="font-body text-sm text-everglade/65 leading-relaxed">{t.text}</p>
                  </div>
                </RevealDiv>
              );
            })}
          </div>

          {/* Pricing Table */}
          <RevealDiv>
            <h3 className="font-display text-2xl md:text-3xl text-licorice text-center mb-10">
              {locale === "de" ? "Unsere Pakete" : "Our Packages"}
            </h3>
          </RevealDiv>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {packages.map((pkg, i) => (
              <RevealDiv
                key={i}
                delay={i * 100}
                className={`relative rounded-2xl p-6 border transition-shadow duration-300 ${
                  pkg.featured
                    ? "bg-everglade text-ct-cream border-everglade shadow-xl scale-[1.02]"
                    : "bg-white border-everglade/10 hover:shadow-lg"
                }`}
              >
                {pkg.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-ct-red text-white text-[10px] font-body font-bold uppercase tracking-wider">
                    {locale === "de" ? "Beliebt" : "Popular"}
                  </span>
                )}
                <p className={`font-display text-lg mb-1 ${pkg.featured ? "text-ct-cream" : "text-licorice"}`}>
                  {pkg.name}
                </p>
                <p className={`font-display text-3xl mb-1 ${pkg.featured ? "text-ct-cream" : "text-licorice"}`}>
                  ab {pkg.price} €
                </p>
                <p className={`font-body text-xs mb-4 ${pkg.featured ? "text-ct-cream/65" : "text-everglade/55"}`}>
                  {locale === "de" ? pkg.guests.de : pkg.guests.en}
                </p>
                <div className={`h-px mb-4 ${pkg.featured ? "bg-ct-cream/15" : "bg-everglade/10"}`} />
                <p className={`font-body text-xs leading-relaxed ${pkg.featured ? "text-ct-cream/75" : "text-everglade/65"}`}>
                  {locale === "de" ? pkg.highlights.de : pkg.highlights.en}
                </p>
              </RevealDiv>
            ))}
          </div>

          {/* Add-ons */}
          <RevealDiv delay={200} className="text-center mt-10">
            <p className="font-body text-sm text-everglade/55">
              <span className="font-bold text-everglade/70">Add-ons: </span>
              DJ · Branding · Hostessen · Fotowand · Custom Menüs
            </p>
          </RevealDiv>
        </div>
      </section>

      {/* ── 5. PROCESS ── */}
      <section className="py-20 md:py-28 px-4 bg-licorice">
        <div className="max-w-5xl mx-auto">
          <RevealDiv>
            <p className="text-xs font-body font-bold uppercase tracking-[0.25em] text-ct-cream/50 mb-4 text-center">
              {locale === "de" ? "Unser Prozess" : "Our Process"}
            </p>
            <h2 className="font-display text-4xl md:text-6xl text-ct-cream text-center mb-16">
              {locale === "de" ? "So arbeiten wir zusammen" : "How We Work Together"}
            </h2>
          </RevealDiv>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {processSteps.map((s, i) => {
              const step = locale === "de" ? s.de : s.en;
              return (
                <RevealDiv key={i} delay={i * 150} className="text-center md:text-left">
                  <span className="font-display text-5xl text-ct-red/30 block mb-3">{s.step}</span>
                  <h3 className="font-display text-xl text-ct-cream mb-2">{step.title}</h3>
                  <p className="font-body text-sm text-ct-cream/60 leading-relaxed">{step.text}</p>
                </RevealDiv>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 6. CTA SECTION ── */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <RevealDiv>
            <h2 className="font-display text-4xl md:text-6xl text-licorice mb-4">
              {locale === "de"
                ? "Bereit für euer nächstes Event?"
                : "Ready for Your Next Event?"}
            </h2>
            <p className="font-body text-lg text-everglade/65 mb-10 max-w-xl mx-auto leading-relaxed">
              {locale === "de"
                ? "Kostenloses Beratungsgespräch — wir entwickeln ein Konzept, das passt."
                : "Free consultation — we'll develop a concept that fits."}
            </p>
          </RevealDiv>
          <RevealDiv delay={150} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/catering/kontakt`}
              className="inline-block px-10 py-4 rounded-full bg-ct-red text-white font-body font-bold text-sm uppercase tracking-wider hover:bg-ct-red/85 transition-all duration-200 shadow-lg shadow-ct-red/25"
            >
              {locale === "de" ? "Angebot anfragen" : "Request a Quote"}
            </Link>
            <a
              href="https://calendly.com/cocktailx"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-10 py-4 rounded-full border-2 border-everglade/25 text-everglade font-body font-bold text-sm uppercase tracking-wider hover:border-everglade/50 transition-all duration-200"
            >
              {locale === "de" ? "15-Min-Call buchen" : "Book 15-Min Call"}
            </a>
          </RevealDiv>
        </div>
      </section>
    </main>
  );
}
