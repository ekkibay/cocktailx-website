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

const eventTypes = [
  {
    image: "/images/catering/ct-bar-1.jpg",
    de: {
      title: "Firmenevents",
      subtitle: "Corporate Catering auf höchstem Niveau",
      text: "Produktlaunches, Jahresfeiern, Incentive-Events, Konferenzen. Wir bringen eine maßgeschneiderte Bar-Experience, die zu eurem Unternehmensauftritt passt — diskret, professionell, unvergesslich.",
      examples: ["Produktlaunches", "Jahresabschlussfeiern", "Kundenbindungs-Events", "Incentives & Teambuilding"],
      alt: "Premium Bar-Setup bei einem Corporate Event in München",
    },
    en: {
      title: "Corporate Events",
      subtitle: "Corporate catering at the highest level",
      text: "Product launches, annual parties, incentive events, conferences. We bring a bespoke bar experience that matches your corporate identity — discreet, professional, unforgettable.",
      examples: ["Product launches", "Year-end parties", "Client retention events", "Incentives & team building"],
      alt: "Premium bar setup at a corporate event in Munich",
    },
  },
  {
    image: "/images/catering/ct-event-2.jpg",
    de: {
      title: "Messen & Konferenzen",
      subtitle: "Professioneller Cocktail-Service für Messestände",
      text: "Vom After-Work am Messestand bis zur Standparty — wir liefern schnellen, skalierbaren Cocktail-Service mit Nitro-Technologie. Erfahren auf INHORGENTA, ISPO und Automotive-Leitmessen.",
      examples: ["Standpartys & After-Work", "Produktpräsentationen", "VIP-Empfänge am Stand", "Networking-Lounges"],
      alt: "Cocktail-Service auf einer Messe in München",
    },
    en: {
      title: "Trade Fairs & Conferences",
      subtitle: "Professional cocktail service for exhibition booths",
      text: "From after-work at the booth to stand parties — we deliver fast, scalable cocktail service with nitro technology. Experienced at INHORGENTA, ISPO and automotive trade fairs.",
      examples: ["Booth parties & after-work", "Product presentations", "VIP receptions at booth", "Networking lounges"],
      alt: "Cocktail service at a trade fair in Munich",
    },
  },
  {
    image: "/images/catering/ct-bartender-1.jpg",
    de: {
      title: "Festivals & Open Air",
      subtitle: "Draußen, wo die Stimmung am besten ist",
      text: "Unsere Expertise aus dem Cocktail X Festival — Deutschlands größtem Cocktail-Festival — machen uns zur ersten Wahl für Outdoor-Events. Wir kennen die Herausforderungen und haben bewährte Lösungen.",
      examples: ["Musik-Festivals", "Open-Air Kinos", "Stadtfeste", "Outdoor-Galas"],
      alt: "Bartender bei einem Outdoor-Festival Event",
    },
    en: {
      title: "Festivals & Open Air",
      subtitle: "Outside, where the atmosphere is best",
      text: "Our expertise from the Cocktail X Festival — Germany's largest cocktail festival — makes us the first choice for outdoor events. We know the challenges and have proven solutions.",
      examples: ["Music festivals", "Open-air cinemas", "City festivals", "Outdoor galas"],
      alt: "Bartender at an outdoor festival event",
    },
  },
  {
    image: "/images/catering/ct-event-1.jpg",
    de: {
      title: "Galas & Award Ceremonies",
      subtitle: "Glamour braucht die richtige Bar",
      text: "Award-Shows, Gala-Dinners, Charity-Events. Der erste Eindruck zählt — und der beginnt am Welcome Drink. Wir liefern den Glamour, den ihr braucht.",
      examples: ["Award-Shows", "Gala-Dinners", "Charity-Events", "VIP-Empfänge"],
      alt: "Elegante Cocktails bei einer Gala-Veranstaltung",
    },
    en: {
      title: "Galas & Award Ceremonies",
      subtitle: "Glamour needs the right bar",
      text: "Award shows, gala dinners, charity events. First impressions count — and they start with the welcome drink. We deliver the glamour you need.",
      examples: ["Award shows", "Gala dinners", "Charity events", "VIP receptions"],
      alt: "Elegant cocktails at a gala event",
    },
  },
];

/* ────────────────────────── PAGE ────────────────────────── */

export default function CateringEventsPage() {
  const locale = useLocale() as "de" | "en";

  return (
    <main className="min-h-screen bg-ct-cream">
      {/* ── HERO ── */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/catering/ct-event-obvs.jpg"
          alt={locale === "de" ? "Premium Event Catering München" : "Premium event catering Munich"}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ct-cream to-transparent" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <RevealDiv delay={100}>
            <p className="text-xs font-body font-bold uppercase tracking-[0.3em] text-ct-red mb-6">
              {locale === "de" ? "Für jeden Anlass" : "For Every Occasion"}
            </p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-[0.95]">
              {locale === "de" ? "Unsere Events" : "Our Events"}
            </h1>
          </RevealDiv>
          <RevealDiv delay={250}>
            <p className="font-body text-lg md:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed">
              {locale === "de"
                ? "Ob kleines Dinner oder großes Festival — wir haben die Erfahrung, das Equipment und das Team für jeden Anlass."
                : "Whether intimate dinner or large festival — we have the experience, equipment and team for every occasion."}
            </p>
          </RevealDiv>
        </div>
      </section>

      {/* ── EVENT TYPES ── */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-6xl mx-auto space-y-16">
          {eventTypes.map((type, i) => {
            const t = locale === "de" ? type.de : type.en;
            const reversed = i % 2 === 1;
            return (
              <RevealDiv key={i} delay={100} className="grid md:grid-cols-2 gap-8 items-center">
                {/* Image */}
                <div className={`relative h-72 md:h-96 rounded-2xl overflow-hidden ${reversed ? "md:order-2" : ""}`}>
                  <Image
                    src={type.image}
                    alt={t.alt}
                    fill
                    className="object-cover object-top"
                  />
                </div>

                {/* Content */}
                <div className={reversed ? "md:order-1" : ""}>
                  <p className="text-xs font-body font-bold uppercase tracking-wider text-ct-red mb-3">
                    {t.subtitle}
                  </p>
                  <h2 className="font-display text-3xl md:text-4xl text-licorice mb-4">
                    {t.title}
                  </h2>
                  <p className="font-body text-everglade/70 leading-relaxed mb-6">
                    {t.text}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {t.examples.map((ex, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-ct-red/60 flex-shrink-0" />
                        <span className="font-body text-sm text-everglade/65">{ex}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </RevealDiv>
            );
          })}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 md:py-28 px-4 bg-ct-wine">
        <div className="max-w-3xl mx-auto text-center">
          <RevealDiv>
            <p className="text-xs font-body font-bold uppercase tracking-[0.25em] text-ct-cream/50 mb-4">
              {locale === "de" ? "Euer Event nicht dabei?" : "Your event not listed?"}
            </p>
            <h2 className="font-display text-4xl md:text-6xl text-ct-cream mb-4">
              {locale === "de"
                ? "Kein Event ist zu groß oder zu klein"
                : "No Event Is Too Big or Too Small"}
            </h2>
            <p className="font-body text-lg text-ct-cream/65 mb-10 max-w-xl mx-auto leading-relaxed">
              {locale === "de"
                ? "Schreibt uns — wir finden eine Lösung, die perfekt zu eurem Anlass passt."
                : "Write to us — we'll find a solution that perfectly fits your occasion."}
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
