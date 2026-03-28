"use client";

import { useLocale } from "next-intl";
import Link from "next/link";

const eventTypes = [
  {
    icon: "◈",
    de: {
      title: "Firmenevents",
      subtitle: "Corporate Catering auf höchstem Niveau",
      text: "Produktlaunches, Jahresfeiern, Incentive-Events, Konferenzen. Wir bringen eine maßgeschneiderte Bar-Experience, die zu eurem Unternehmensauftritt passt — diskret, professionell, unvergesslich.",
      examples: ["Produktlaunches", "Jahresabschlussfeiern", "Kundenbindungs-Events", "Incentives & Teambuilding"],
    },
    en: {
      title: "Corporate Events",
      subtitle: "Corporate catering at the highest level",
      text: "Product launches, annual parties, incentive events, conferences. We bring a bespoke bar experience that matches your corporate identity — discreet, professional, unforgettable.",
      examples: ["Product launches", "Year-end parties", "Client retention events", "Incentives & team building"],
    },
  },
  {
    icon: "◇",
    de: {
      title: "Hochzeiten & Private Feiern",
      subtitle: "Euer besonderer Moment verdient die beste Bar",
      text: "Von der romantischen Hochzeit bis zum großen Geburtstag — wir gestalten das Bar-Erlebnis so persönlich wie euer Anlass. Mit individuellen Signature Cocktails, die eure Geschichte erzählen.",
      examples: ["Hochzeiten", "Geburtstage & Jubiläen", "Verlobungsfeiern", "Familienreunions"],
    },
    en: {
      title: "Weddings & Private Parties",
      subtitle: "Your special moment deserves the best bar",
      text: "From romantic weddings to big birthdays — we design the bar experience as personal as your occasion. With individual signature cocktails that tell your story.",
      examples: ["Weddings", "Birthdays & anniversaries", "Engagement parties", "Family reunions"],
    },
  },
  {
    icon: "◉",
    de: {
      title: "Festivals & Open Air",
      subtitle: "Draußen, wo die Stimmung am besten ist",
      text: "Unsere Expertise aus dem Cocktail X Festival — Deutschlands größtem Cocktail-Festival — machen uns zur ersten Wahl für Outdoor-Events. Wir kennen die Herausforderungen und haben bewährte Lösungen.",
      examples: ["Musik-Festivals", "Open-Air Kinos", "Stadtfeste", "Outdoor-Galas"],
    },
    en: {
      title: "Festivals & Open Air",
      subtitle: "Outside, where the atmosphere is best",
      text: "Our expertise from the Cocktail X Festival — Germany's largest cocktail festival — makes us the first choice for outdoor events. We know the challenges and have proven solutions.",
      examples: ["Music festivals", "Open-air cinemas", "City festivals", "Outdoor galas"],
    },
  },
  {
    icon: "◐",
    de: {
      title: "Galas & Award Ceremonies",
      subtitle: "Glamour braucht die richtige Bar",
      text: "Award-Shows, Gala-Dinners, Charity-Events. Der erste Eindruck zählt — und der beginnt am Welcome Drink. Wir liefern den Glamour, den ihr braucht.",
      examples: ["Award-Shows", "Gala-Dinners", "Charity-Events", "VIP-Empfänge"],
    },
    en: {
      title: "Galas & Award Ceremonies",
      subtitle: "Glamour needs the right bar",
      text: "Award shows, gala dinners, charity events. First impressions count — and they start with the welcome drink. We deliver the glamour you need.",
      examples: ["Award shows", "Gala dinners", "Charity events", "VIP receptions"],
    },
  },
];

export default function CateringEventsPage() {
  const locale = useLocale() as "de" | "en";

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#000000" }}>
      {/* BG */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(/images/pattern-3.png)", backgroundSize: "180px 180px", backgroundRepeat: "repeat" }} />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full opacity-[0.08]" style={{ background: "radial-gradient(circle, #004369 0%, transparent 70%)" }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 pt-40 pb-24">
        <p className="text-xs font-body font-bold uppercase tracking-[0.3em] text-ct-green mb-4 text-center">
          {locale === "de" ? "Für jeden Anlass" : "For Every Occasion"}
        </p>
        <h1 className="font-display text-5xl md:text-7xl text-ct-cream text-center mb-6">
          {locale === "de" ? "EVENTS" : "EVENTS"}
        </h1>
        <p className="font-body text-ct-cream/65 text-center max-w-2xl mx-auto mb-16">
          {locale === "de"
            ? "Ob kleines Dinner oder großes Festival — wir haben die Erfahrung, das Equipment und das Team für jeden Anlass."
            : "Whether intimate dinner or large festival — we have the experience, equipment and team for every occasion."}
        </p>

        <div className="space-y-8">
          {eventTypes.map((type, i) => (
            <div
              key={i}
              className="grid md:grid-cols-[80px,1fr,220px] gap-6 md:gap-8 items-start p-6 md:p-8 rounded-2xl border border-ct-green/15 bg-ct-green/[0.03] hover:border-ct-green/30 transition-all duration-300"
            >
              <span className="font-display text-4xl text-ct-green">{type.icon}</span>
              <div>
                <h2 className="font-display text-2xl md:text-3xl text-ct-cream mb-1">
                  {locale === "de" ? type.de.title : type.en.title}
                </h2>
                <p className="font-body text-sm text-ct-green mb-4">
                  {locale === "de" ? type.de.subtitle : type.en.subtitle}
                </p>
                <p className="font-body text-ct-cream/70 leading-relaxed text-sm md:text-base">
                  {locale === "de" ? type.de.text : type.en.text}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-body uppercase tracking-wider text-ct-cream/40 mb-3">
                  {locale === "de" ? "Beispiele" : "Examples"}
                </p>
                {(locale === "de" ? type.de.examples : type.en.examples).map((ex, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <span className="text-ct-green text-xs flex-shrink-0">✦</span>
                    <span className="font-body text-sm text-ct-cream/65">{ex}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center p-10 rounded-2xl border border-ct-green/20" style={{ background: "linear-gradient(135deg, #001a15 0%, #000000 100%)" }}>
          <h2 className="font-display text-3xl text-ct-cream mb-4">
            {locale === "de" ? "IHR EVENT NICHT DABEI?" : "YOUR EVENT NOT LISTED?"}
          </h2>
          <p className="font-body text-ct-cream/65 mb-8 max-w-lg mx-auto">
            {locale === "de"
              ? "Kein Event ist zu groß oder zu klein. Schreibt uns — wir finden eine Lösung."
              : "No event is too big or too small. Write to us — we'll find a solution."}
          </p>
          <Link
            href={`/${locale}/catering/kontakt`}
            className="inline-block px-10 py-4 rounded-full bg-ct-green text-ct-cream font-body font-bold text-sm uppercase tracking-wider hover:bg-ct-green/80 transition-all duration-200"
          >
            {locale === "de" ? "Anfrage stellen" : "Send Enquiry"}
          </Link>
        </div>
      </div>
    </main>
  );
}
