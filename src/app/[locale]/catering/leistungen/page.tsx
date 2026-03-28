"use client";

import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useReveal } from "@/hooks/useReveal";

/* ────────────────────────── REVEAL HELPER ────────────────────────── */

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

/* ────────────────────────── DATA ────────────────────────── */

const services = [
  {
    id: "event-bar",
    de: {
      title: "Event Bar",
      subtitle: "Mobile Premium-Bar für jeden Anlass",
      text: "Wir liefern, bauen auf, betreiben und bauen wieder ab. Unsere mobilen Bars sind für Indoor- und Outdoor-Locations konzipiert und können für Events jeder Größe skaliert werden — von 50 bis 5.000 Gästen.",
      features: ["Professioneller Auf- und Abbau", "Eigenes Bar-Equipment", "Vollständige Ausstattung", "Flexible Skalierung"],
    },
    en: {
      title: "Event Bar",
      subtitle: "Mobile premium bar for any occasion",
      text: "We deliver, set up, operate and tear down. Our mobile bars are designed for indoor and outdoor venues and can be scaled for events of any size — from 50 to 5,000 guests.",
      features: ["Professional setup & teardown", "Own bar equipment", "Complete outfitting", "Flexible scaling"],
    },
  },
  {
    id: "cocktails",
    de: {
      title: "Signature Cocktails",
      subtitle: "Maßgeschneiderte Cocktailkarten",
      text: "Jedes Event verdient seine eigene Karte. Gemeinsam entwickeln wir Signatur-Cocktails, die zu eurer Marke, eurem Thema und euren Gästen passen. Von der Konzeption bis zur finalen Rezeptur.",
      features: ["Individuelle Rezeptentwicklung", "Branding & Naming", "Saisonale Zutaten", "Alkoholfrei-Optionen"],
    },
    en: {
      title: "Signature Cocktails",
      subtitle: "Bespoke cocktail menus",
      text: "Every event deserves its own menu. Together we develop signature cocktails that match your brand, theme and guests. From conception to final recipe.",
      features: ["Custom recipe development", "Branding & naming", "Seasonal ingredients", "Non-alcoholic options"],
    },
  },
  {
    id: "corporate",
    de: {
      title: "Corporate Events",
      subtitle: "Für Unternehmen, die Eindruck hinterlassen",
      text: "Produktlaunches, Jahresabschluss-Feiern, Konferenzen, Incentives. Wir verstehen, dass Corporate Events repräsentative Wirkung haben. Unser Service ist diskret, professionell und auf euer Branding abgestimmt.",
      features: ["Branded Bar-Konzepte", "Diskret & professionell", "Vollservice", "Nach-Event Reporting"],
    },
    en: {
      title: "Corporate Events",
      subtitle: "For companies that make an impression",
      text: "Product launches, year-end parties, conferences, incentives. We understand that corporate events have a representative effect. Our service is discreet, professional and aligned to your branding.",
      features: ["Branded bar concepts", "Discreet & professional", "Full service", "Post-event reporting"],
    },
  },
  {
    id: "messe",
    de: {
      title: "Messe-Catering",
      subtitle: "Euer Cocktail-Partner für Messestände & After-Work",
      text: "Erfahrenes, mehrsprachiges Team mit Messe-Routine. Express-Besetzung oft unter 24 Stunden aus unserem München-Pool. Logistik-Sicherheit: Pässe, Anlieferung, technischer Rider. White-Label komplett in eurer CI.",
      features: ["Nitro High-Volume (500+ Drinks/Std)", "Express-Besetzung < 24h", "White-Label in eurer CI", "Logistik & Anlieferung"],
    },
    en: {
      title: "Trade Fair Catering",
      subtitle: "Your cocktail partner for trade fair booths & after-work",
      text: "Experienced, multilingual team with trade fair routine. Express staffing often under 24 hours from our Munich pool. Logistics security: passes, delivery, technical rider. White-label completely in your CI.",
      features: ["Nitro High-Volume (500+ Drinks/hr)", "Express staffing < 24h", "White-label in your CI", "Logistics & delivery"],
    },
  },
  {
    id: "festival",
    de: {
      title: "Festival & Outdoor",
      subtitle: "Bars für Open-Air und Festival-Events",
      text: "Bewährt durch das Cocktail X Festival mit 58 Bars in München. Wir kennen die Herausforderungen von Outdoor-Bars und haben die Lösungen — Logistik, Permitting, Wetterfestigkeit.",
      features: ["Outdoor-erprobt", "Logistik-Expertise", "Skalierbar", "Cocktail X Festival Network"],
    },
    en: {
      title: "Festival & Outdoor",
      subtitle: "Bars for open-air and festival events",
      text: "Proven through the Cocktail X Festival with 58 bars in Munich. We know the challenges of outdoor bars and have the solutions — logistics, permitting, weatherproofing.",
      features: ["Outdoor-tested", "Logistics expertise", "Scalable", "Cocktail X Festival network"],
    },
  },
  {
    id: "consulting",
    de: {
      title: "Bar Consulting",
      subtitle: "Beratung & Training für die Gastronomie",
      text: "Ihr möchtet eure Bar-Karte optimieren, euer Team trainieren oder ein neues Bar-Konzept entwickeln? Wir teilen unser Wissen aus Festival-Betrieb und Premium-Catering.",
      features: ["Konzeptentwicklung", "Bartender Training", "Kartenoptimierung", "Auf-Demand"],
    },
    en: {
      title: "Bar Consulting",
      subtitle: "Consulting & training for hospitality",
      text: "Want to optimize your bar menu, train your team or develop a new bar concept? We share our knowledge from festival operations and premium catering.",
      features: ["Concept development", "Bartender training", "Menu optimization", "On-demand"],
    },
  },
];

/* ────────────────────────── PAGE ────────────────────────── */

export default function LeistungenPage() {
  const locale = useLocale() as "de" | "en";

  return (
    <main className="min-h-screen bg-ct-cream">
      {/* ── HERO ── */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/catering/ct-bartender-1.jpg"
          alt={locale === "de" ? "Professioneller Bartender bei einem Premium Catering Event" : "Professional bartender at a premium catering event"}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ct-cream to-transparent" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <RevealDiv delay={100}>
            <p className="text-xs font-body font-bold uppercase tracking-[0.3em] text-ct-red mb-6">
              {locale === "de" ? "Was wir bieten" : "What We Offer"}
            </p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-[0.95]">
              {locale === "de" ? "Unsere Leistungen" : "Our Services"}
            </h1>
          </RevealDiv>
          <RevealDiv delay={250}>
            <p className="font-body text-lg md:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed">
              {locale === "de"
                ? "Von der mobilen Bar bis zum Full-Service — alles aus einer Hand."
                : "From mobile bars to full service — everything from one source."}
            </p>
          </RevealDiv>
        </div>
      </section>

      {/* ── SERVICES GRID ── */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, i) => {
              const s = locale === "de" ? service.de : service.en;
              return (
                <RevealDiv
                  key={service.id}
                  delay={i * 80}
                  className="group p-8 rounded-2xl bg-white/60 border border-everglade/10 hover:shadow-xl transition-shadow duration-300"
                >
                  <p className="text-xs font-body font-bold uppercase tracking-wider text-ct-red mb-3">
                    {s.subtitle}
                  </p>
                  <h2 className="font-display text-2xl md:text-3xl text-licorice mb-3">
                    {s.title}
                  </h2>
                  <p className="font-body text-sm text-everglade/70 leading-relaxed mb-6">
                    {s.text}
                  </p>
                  <ul className="space-y-2">
                    {s.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-ct-red/60 flex-shrink-0" />
                        <span className="font-body text-sm text-everglade/65">{f}</span>
                      </li>
                    ))}
                  </ul>
                </RevealDiv>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 md:py-28 px-4 bg-licorice">
        <div className="max-w-3xl mx-auto text-center">
          <RevealDiv>
            <p className="text-xs font-body font-bold uppercase tracking-[0.25em] text-ct-cream/50 mb-4">
              {locale === "de" ? "Interesse geweckt?" : "Interested?"}
            </p>
            <h2 className="font-display text-4xl md:text-6xl text-ct-cream mb-4">
              {locale === "de"
                ? "Lasst uns euer Event planen"
                : "Let's Plan Your Event"}
            </h2>
            <p className="font-body text-lg text-ct-cream/65 mb-10 max-w-xl mx-auto leading-relaxed">
              {locale === "de"
                ? "Schreibt uns — wir melden uns innerhalb von 24 Stunden mit einem unverbindlichen Angebot."
                : "Contact us — we'll respond within 24 hours with a non-binding quote."}
            </p>
          </RevealDiv>
          <RevealDiv delay={150} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/catering/kontakt`}
              className="inline-block px-10 py-4 rounded-full bg-ct-red text-white font-body font-bold text-sm uppercase tracking-wider hover:bg-ct-red/85 transition-all duration-200 shadow-lg shadow-ct-red/25"
            >
              {locale === "de" ? "Anfrage stellen" : "Send Enquiry"}
            </Link>
            <a
              href="https://calendly.com/cocktailx"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-10 py-4 rounded-full border-2 border-ct-cream/25 text-ct-cream font-body font-bold text-sm uppercase tracking-wider hover:border-ct-cream/50 transition-all duration-200"
            >
              {locale === "de" ? "15-Min-Call buchen" : "Book 15-Min Call"}
            </a>
          </RevealDiv>
        </div>
      </section>
    </main>
  );
}
