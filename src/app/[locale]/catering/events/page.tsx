"use client";

import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useReveal } from "@/hooks/useReveal";

function RevealDiv({
  children, className, delay = 0, direction = "up" as const,
}: { children: React.ReactNode; className?: string; delay?: number; direction?: "up" | "down" | "left" | "right" | "none" }) {
  const { ref, style } = useReveal<HTMLDivElement>({ delay, direction, distance: 30 });
  return <div ref={ref} style={style} className={className}>{children}</div>;
}

const eventTypes = [
  {
    image: "/images/catering/ct-bar-kempinski.jpg",
    de: {
      title: "Corporate Events",
      subtitle: "Firmenfeiern, Jubil\u00e4en, Kick-offs, Kundenevents",
      text: "Individuelle Cocktailkarte, abgestimmt auf Anlass und CI des Kunden. Welcome Drink Konzeption, professionelles Barteam (1 Barkeeper pro 40\u201350 G\u00e4ste). Skalierung bis 3.000 Personen durch Multi-Bar-Konzepte.",
      examples: ["Firmenfeiern & Jubil\u00e4en", "Produktlaunches", "Kundenevents", "Weihnachtsfeiern"],
    },
    en: {
      title: "Corporate Events",
      subtitle: "Company parties, anniversaries, kick-offs, client events",
      text: "Individual cocktail menu aligned with occasion and client CI. Welcome drink concept, professional bar team (1 bartender per 40\u201350 guests). Scaling up to 3,000 guests through multi-bar concepts.",
      examples: ["Company parties", "Product launches", "Client events", "Christmas parties"],
    },
  },
  {
    image: "/images/catering/ct-table-cocktails.jpg",
    de: {
      title: "Messe-Events",
      subtitle: "Messestand-Bewirtung, Standpartys, VIP-Empf\u00e4nge",
      text: "Kompakte Bar-L\u00f6sungen f\u00fcr Messeest\u00e4nde \u2013 platzsparend, optisch hochwertig. Abgestimmte Drink-Auswahl mit schneller Zubereitung und hohem Durchlauf. Signature Drink als Gespr\u00e4chsstarter und Lead-Magnet.",
      examples: ["Standpartys & After-Work", "VIP-Empf\u00e4nge", "Mehrt\u00e4gige Eins\u00e4tze", "Branding-Integration"],
    },
    en: {
      title: "Trade Fair Events",
      subtitle: "Booth hospitality, booth parties, VIP receptions",
      text: "Compact bar solutions for exhibition booths \u2013 space-saving, visually premium. Curated drink selection with fast preparation and high throughput. Signature drink as conversation starter and lead magnet.",
      examples: ["Booth parties & after-work", "VIP receptions", "Multi-day deployments", "Branding integration"],
    },
  },
  {
    image: "/images/catering/ct-oldfashioned-hand.jpg",
    de: {
      title: "Productlaunches",
      subtitle: "Markteinf\u00fchrungen, Release-Partys, Presse-Events",
      text: "Entwicklung eines exklusiven Launch-Cocktails, der das Produkt geschmacklich und visuell transportiert. Premium-Bar-Setup als inszenierter Bestandteil der Launch-Dramaturgie. Der Drink wird zum Teil der Produktstory.",
      examples: ["Exklusiver Launch-Cocktail", "Timing mit Produkt-Reveal", "Branding in jedem Detail", "Barteam als Markenbotschafter"],
    },
    en: {
      title: "Product Launches",
      subtitle: "Market launches, release parties, press events",
      text: "Development of an exclusive launch cocktail that transports the product visually and in flavour. Premium bar setup as a staged part of the launch dramaturgy. The drink becomes part of the product story.",
      examples: ["Exclusive launch cocktail", "Timing with product reveal", "Branding in every detail", "Bar team as brand ambassadors"],
    },
  },
  {
    image: "/images/catering/ct-guest-1.jpg",
    de: {
      title: "Store Caterings & Afterwork",
      subtitle: "Store-Er\u00f6ffnungen, Shopping-Events, Afterwork-Sessions",
      text: "Kompakte, \u00e4sthetische Bar-L\u00f6sungen, die sich nahtlos in das Store-Design einf\u00fcgen. Kunden bleiben l\u00e4nger, die Atmosph\u00e4re wird aufgewertet, und der Drink schafft einen emotionalen Anker zur Marke.",
      examples: ["Store-Er\u00f6ffnungen", "Late Night Shopping", "In-Store Brand Activations", "Regelm\u00e4\u00dfige Afterworks"],
    },
    en: {
      title: "Store Caterings & Afterwork",
      subtitle: "Store openings, shopping events, afterwork sessions",
      text: "Compact, aesthetic bar solutions that blend seamlessly into store design. Customers stay longer, atmosphere is elevated, and the drink creates an emotional anchor to the brand.",
      examples: ["Store openings", "Late night shopping", "In-store brand activations", "Regular afterworks"],
    },
  },
  {
    image: "/images/catering/ct-founders-tuxedo.jpg",
    de: {
      title: "Networking Events",
      subtitle: "Business-Networking, Branchentreffen, Community-Abende",
      text: "Die Bar als Networking-Instrument. Welcome Drink zur Ankunft f\u00fcr lockeren Einstieg. Cocktailkarte mit Gespr\u00e4chspotenzial \u2013 Drinks werden bewusst als Br\u00fccke zwischen G\u00e4sten eingesetzt.",
      examples: ["Business-Networking", "Panel-Afterparties", "Community-Abende", "Icebreaker Cocktails"],
    },
    en: {
      title: "Networking Events",
      subtitle: "Business networking, industry meetups, community evenings",
      text: "The bar as a networking instrument. Welcome drink on arrival for an easy start. Cocktail menu with conversation potential \u2013 drinks deliberately used as bridges between guests.",
      examples: ["Business networking", "Panel afterparties", "Community evenings", "Icebreaker cocktails"],
    },
  },
];

export default function CateringEventsPage() {
  const locale = useLocale() as "de" | "en";

  return (
    <main className="min-h-screen bg-ct-cream">
      {/* ── HERO ── */}
      <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
        <Image src="/images/catering/ct-champagne.jpg" alt="Cocktail X Event Catering" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ct-cream to-transparent" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <RevealDiv delay={100}>
            <p className="text-xs font-body font-bold uppercase tracking-[0.3em] text-ct-red mb-6">
              {locale === "de" ? "F\u00fcr jeden Anlass" : "For Every Occasion"}
            </p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-[0.95]">
              {locale === "de" ? "Event Formate" : "Event Formats"}
            </h1>
          </RevealDiv>
          <RevealDiv delay={250}>
            <p className="font-body text-lg md:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed">
              {locale === "de"
                ? "Von der exklusiven Afterwork-Session bis zum Messeauftritt mit tausenden G\u00e4sten."
                : "From an exclusive afterwork session to a trade fair presence with thousands of guests."}
            </p>
          </RevealDiv>
        </div>
      </section>

      {/* ── EVENT TYPES ── */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-6xl mx-auto space-y-10">
          {eventTypes.map((type, i) => {
            const t = locale === "de" ? type.de : type.en;
            const reversed = i % 2 === 1;
            return (
              <RevealDiv key={i} delay={100} className="grid md:grid-cols-2 gap-8 items-center">
                <div className={`relative h-80 md:h-[28rem] rounded-2xl overflow-hidden ${reversed ? "md:order-2" : ""}`}>
                  <Image src={type.image} alt={t.title} fill className="object-cover object-[center_65%]" />
                </div>
                <div className={reversed ? "md:order-1" : ""}>
                  <p className="text-xs font-body font-bold uppercase tracking-wider text-ct-red mb-3">{t.subtitle}</p>
                  <h2 className="font-display text-3xl md:text-4xl text-licorice mb-4">{t.title}</h2>
                  <p className="font-body text-everglade/70 leading-relaxed mb-6">{t.text}</p>
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
      <section className="py-20 md:py-28 px-4 bg-licorice relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(/images/pattern-bg.svg)", backgroundSize: "150px 150px" }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <RevealDiv>
            <h2 className="font-display text-4xl md:text-6xl text-ct-cream mb-4">
              {locale === "de" ? "Erz\u00e4hlt uns vom Anlass." : "Tell Us About the Occasion."}
            </h2>
            <p className="font-body text-lg text-ct-cream/65 mb-10 max-w-xl mx-auto leading-relaxed">
              {locale === "de"
                ? "Wir k\u00fcmmern uns um den Rest. Jede Bar ein Highlight. Jeder Drink ein Statement."
                : "We\u2019ll take care of the rest. Every bar a highlight. Every drink a statement."}
            </p>
          </RevealDiv>
          <RevealDiv delay={150}>
            <Link
              href={`/${locale}/catering/kontakt`}
              className="inline-block px-10 py-4 rounded-full bg-ct-red text-white font-body font-bold text-sm uppercase tracking-wider hover:bg-ct-red/85 transition-all duration-200 shadow-lg shadow-ct-red/25"
            >
              {locale === "de" ? "Jetzt anfragen" : "Get in Touch"}
            </Link>
          </RevealDiv>
        </div>
      </section>
    </main>
  );
}
