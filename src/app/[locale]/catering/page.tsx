"use client";

import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useReveal } from "@/hooks/useReveal";

function RevealDiv({
  children, className, delay = 0, direction = "up" as const,
}: { children: React.ReactNode; className?: string; delay?: number; direction?: "up" | "down" | "left" | "right" | "none" }) {
  const { ref, style } = useReveal<HTMLDivElement>({ delay, direction, distance: 30 });
  return <div ref={ref} style={style} className={className}>{children}</div>;
}

function Check() {
  return <svg className="w-4 h-4 text-ct-red flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
}

const references = [
  "Tesla", "Lucid", "McKinsey & Company", "foodaffairs", "GHM",
  "Siemens", "IAA Mobility", "INHORGENTA",
];

const usps = [
  { num: "500+", de: "Events durchgeführt", en: "Events delivered" },
  { num: "3.000", de: "Gäste pro Event möglich", en: "Guests per event possible" },
  { num: "48h", de: "Angebot nach Anfrage", en: "Quote after enquiry" },
  { num: "200k+", de: "Cocktails serviert", en: "Cocktails served" },
];

const services = [
  {
    num: "01",
    id: "masterclass",
    image: "/images/catering/ct-drinks-hand.jpg",
    imagePosition: "object-[center_60%]",
    de: {
      title: "Masterclass",
      subtitle: "Das Team-Erlebnis, das niemand vergisst.",
      text: "Kein Vortrag. Kein Lehrbuch. Einfach ein verdammt guter Nachmittag mit eurem Team – und am Ende kann jeder einen Drink mixen, der beeindruckt.",
      meta: "2,5–3,5 Std. · 10–30 Personen",
      features: ["3 Formate: Shake & Play, Flavour Battle, Around the World", "Professioneller Barkeeper / Moderator", "Alle Zutaten & Equipment inklusive", "Rezeptkarten zum Mitnehmen"],
    },
    en: {
      title: "Masterclass",
      subtitle: "The Team Experience No One Forgets.",
      text: "No lectures. No textbooks. Just a damn good afternoon with your team – and by the end, everyone can mix a drink that impresses.",
      meta: "2.5–3.5 hrs · 10–30 people",
      features: ["3 formats: Shake & Play, Flavour Battle, Around the World", "Professional bartender / host", "All ingredients & equipment included", "Recipe cards to take home"],
    },
  },
  {
    num: "02",
    id: "team-experience",
    image: "/images/catering/ct-bartender-pour.jpg",
    imagePosition: "object-[center_30%]",
    de: {
      title: "Team Experience",
      subtitle: "Shaken, nicht gerührt.",
      text: "Gemeinsam mixen. Gemeinsam lachen. Gemeinsam anstoßen. Teams treten in einer kreativen Challenge gegeneinander an: Wer kreiert den besten Signature Drink?",
      meta: "ca. 3 Std. · bis 20 Personen",
      features: ["Cocktail-Klassiker gemeinsam mixen", "Kreative Team-Challenge mit Voting", "Siegerehrung & entspannter Ausklang"],
    },
    en: {
      title: "Team Experience",
      subtitle: "Shaken, Not Stirred.",
      text: "Mix together. Laugh together. Raise a glass together. Teams compete in a creative challenge: Who can craft the best signature drink?",
      meta: "approx. 3 hrs · up to 20 people",
      features: ["Mix cocktail classics together", "Creative team challenge with voting", "Award ceremony & relaxed wrap-up"],
    },
  },
  {
    num: "03",
    id: "your-brand",
    image: "/images/catering/ct-cocktail-red.jpg",
    imagePosition: "object-[center_50%]",
    de: {
      title: "Cocktail X x Your Brand",
      subtitle: "Euer Event. Unsere Bar. Ein gemeinsames Statement.",
      text: "Wir bringen nicht einfach Drinks. Wir bringen eure Marke ins Glas – entwickeln Drinks, die eure Story erzählen, und schaffen ein Bar-Erlebnis in jedem Detail.",
      meta: "3–5 Std. · 20–200 Personen",
      features: ["3 Pakete: x Classic, x Premium, x Deluxe", "Signature Drinks in eurer Markenwelt", "Vollständiges Branding-Paket", "Ideal für Produktlaunches & VIP-Events"],
    },
    en: {
      title: "Cocktail X x Your Brand",
      subtitle: "Your Event. Our Bar. One Shared Statement.",
      text: "We don't just bring drinks. We bring your brand to the glass – develop drinks that tell your story and create a bar experience in every detail.",
      meta: "3–5 hrs · 20–200 people",
      features: ["3 packages: x Classic, x Premium, x Deluxe", "Signature drinks in your brand world", "Full branding package", "Ideal for product launches & VIP events"],
    },
  },
  {
    num: "04",
    id: "festival",
    image: "/images/catering/ct-molecular.jpg",
    imagePosition: "object-center",
    de: {
      title: "Pop-Up Eventreihe",
      subtitle: "Drinks. Beats. Atmosphäre.",
      text: "Kein fester Ort. Kein festes Datum. Aber immer ein Abend, für den sich jede Warteliste lohnt – zusammen mit Partnern aus Food, Musik und Lifestyle.",
      meta: "4–5 Std. · 80–300 Personen",
      features: ["Wechselnde Locations & Themen", "Multi-Station Drink-Setup", "Food-, Musik- & Lifestyle-Partner", "Limitierte Tickets & Community"],
    },
    en: {
      title: "Pop-Up Event Series",
      subtitle: "Drinks. Beats. Atmosphere.",
      text: "No fixed location. No fixed date. But always a night worth every spot on the waitlist – together with partners from food, music and lifestyle.",
      meta: "4–5 hrs · 80–300 people",
      features: ["Changing locations & themes", "Multi-station drink setup", "Food, music & lifestyle partners", "Limited tickets & community"],
    },
  },
  {
    num: "05",
    id: "event-catering",
    image: "/images/catering/ct-bartender-glasses.jpg",
    imagePosition: "object-[center_40%]",
    de: {
      title: "Event Catering",
      subtitle: "Für Anlässe, die nach mehr schmecken.",
      text: "Corporate Events. Messen. Productlaunches. Von 20 bis 3.000 Gäste – wir liefern nicht nur Drinks, wir liefern den richtigen Vibe.",
      meta: "2–8+ Std. · 20–3.000 Personen",
      features: ["Corporate Events & Firmenfeiern", "Messe-Service & Standpartys", "Productlaunches & Store Caterings", "Afterwork & Networking Events"],
    },
    en: {
      title: "Event Catering",
      subtitle: "For Occasions That Deserve More.",
      text: "Corporate events. Trade fairs. Product launches. From 20 to 3,000 guests – we don't just deliver drinks, we deliver the right vibe.",
      meta: "2–8+ hrs · 20–3,000 people",
      features: ["Corporate events & parties", "Trade fair service & booth parties", "Product launches & store caterings", "Afterwork & networking events"],
    },
  },
];

const processSteps = [
  { step: "01", de: { title: "Beratung", text: "Kickoff-Call, Konzeptentwicklung, Angebot innerhalb von 48h." }, en: { title: "Consultation", text: "Kickoff call, concept development, quote within 48h." } },
  { step: "02", de: { title: "Planung", text: "Tasting, Logistik-Planung, Feinabstimmung." }, en: { title: "Planning", text: "Tasting, logistics planning, fine-tuning." } },
  { step: "03", de: { title: "Event", text: "Aufbau, professioneller Service, Event Manager vor Ort." }, en: { title: "Event", text: "Setup, professional service, event manager on-site." } },
  { step: "04", de: { title: "Follow-Up", text: "Abbau, Feedback, Dokumentation." }, en: { title: "Follow-Up", text: "Teardown, feedback, documentation." } },
];

export default function CateringPage() {
  const locale = useLocale() as "de" | "en";

  return (
    <main className="min-h-screen bg-ct-cream">
      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <Image src="/images/catering/ct-bar-kempinski.jpg" alt="Cocktail X Catering" fill priority className="object-cover object-[70%_center]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/70" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-ct-cream to-transparent" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <RevealDiv delay={100}>
            <p className="text-xs font-body font-bold uppercase tracking-[0.3em] text-ct-red mb-6">
              Cocktail Excellence. Event Precision.
            </p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-[0.95]">
              {locale === "de" ? "Premium Cocktail Catering" : "Premium Cocktail Catering"}
            </h1>
          </RevealDiv>
          <RevealDiv delay={250}>
            <p className="font-body text-lg md:text-xl text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed">
              {locale === "de"
                ? "Firmenevents, Masterclasses oder Product Launches – für jeden Anlass das richtige Format."
                : "Corporate events, masterclasses or product launches – the right format for every occasion."}
            </p>
          </RevealDiv>
          <RevealDiv delay={400} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/catering/kontakt`}
              className="inline-block px-10 py-4 rounded-full bg-ct-red text-white font-body font-bold text-sm uppercase tracking-wider hover:bg-ct-red/85 transition-all duration-200 shadow-lg shadow-ct-red/25"
            >
              {locale === "de" ? "Jetzt anfragen" : "Get in Touch"}
            </Link>
            <Link
              href="#services"
              className="inline-block px-10 py-4 rounded-full border-2 border-white/30 text-white font-body font-bold text-sm uppercase tracking-wider hover:border-white/60 hover:bg-white/5 transition-all duration-200"
            >
              {locale === "de" ? "Formate entdecken" : "Explore Formats"}
            </Link>
          </RevealDiv>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/50">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </section>

      {/* ── USP BAR ── */}
      <section className="py-8 md:py-10 bg-licorice">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {usps.map((usp, i) => (
              <RevealDiv key={i} delay={i * 80} className="text-center">
                <span className="font-display text-2xl md:text-3xl text-ct-red block">{usp.num}</span>
                <span className="font-body text-xs text-ct-cream/60 uppercase tracking-wider">
                  {locale === "de" ? usp.de : usp.en}
                </span>
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      {/* ── REFERENCES / TRUST ── */}
      <section className="py-10 md:py-12 px-4 border-b border-everglade/10">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-[10px] font-body font-bold uppercase tracking-[0.25em] text-everglade/35 mb-6">
            {locale === "de" ? "Marken, die uns vertrauen" : "Brands That Trust Us"}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
            {references.map((name) => (
              <span key={name} className="font-display text-base md:text-lg text-everglade/25 hover:text-everglade/45 transition-colors duration-300 cursor-default">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <RevealDiv className="text-center mb-12">
            <p className="text-xs font-body font-bold uppercase tracking-[0.25em] text-everglade/50 mb-3">
              {locale === "de" ? "Unsere Formate" : "Our Formats"}
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-licorice">
              {locale === "de" ? "5 Konzepte. 1 Versprechen." : "5 Concepts. 1 Promise."}
            </h2>
          </RevealDiv>

          <div className="space-y-6">
            {services.map((service, i) => {
              const s = locale === "de" ? service.de : service.en;
              const isReversed = i % 2 === 1;
              return (
                <RevealDiv key={service.id} delay={i * 50}>
                  <div className={`group grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden bg-white border border-everglade/8 hover:shadow-2xl hover:shadow-everglade/8 transition-all duration-500 ${isReversed ? "md:grid-flow-dense" : ""}`}>
                    {/* Image with parallax-like hover */}
                    <div className={`relative h-52 md:h-auto md:min-h-[360px] overflow-hidden ${isReversed ? "md:col-start-2" : ""}`}>
                      <Image
                        src={service.image}
                        alt={s.title}
                        fill
                        className={`object-cover ${service.imagePosition} group-hover:scale-105 transition-transform duration-700 ease-out`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="font-display text-5xl text-white/20 group-hover:text-white/35 transition-colors duration-500">{service.num}</span>
                      </div>
                      {/* Meta badge on image */}
                      <div className="absolute bottom-4 left-4">
                        <span className="inline-block px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-[10px] font-body font-bold text-white/90 uppercase tracking-wider">
                          {s.meta}
                        </span>
                      </div>
                    </div>
                    {/* Content */}
                    <div className={`p-7 md:p-9 flex flex-col justify-center ${isReversed ? "md:col-start-1" : ""}`}>
                      <h3 className="font-display text-2xl md:text-3xl text-licorice mb-1">{s.title}</h3>
                      <p className="font-body text-base text-everglade/75 italic mb-4">{s.subtitle}</p>
                      <p className="font-body text-sm text-everglade/60 leading-relaxed mb-5">{s.text}</p>
                      <ul className="space-y-1.5 mb-6">
                        {s.features.map((f, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm font-body text-everglade/65">
                            <Check /> {f}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={`/${locale}/catering/kontakt`}
                        className="inline-flex items-center gap-2 self-start px-6 py-3 rounded-full bg-ct-red text-white font-body font-bold text-xs uppercase tracking-wider hover:bg-ct-red/85 hover:gap-3 transition-all duration-200"
                      >
                        {locale === "de" ? "Jetzt anfragen" : "Get in Touch"}
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                      </Link>
                    </div>
                  </div>
                </RevealDiv>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="py-16 md:py-24 px-4 bg-licorice relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(/images/pattern-bg.svg)", backgroundSize: "150px 150px" }} />
        <div className="max-w-5xl mx-auto relative">
          <RevealDiv className="text-center mb-14">
            <p className="text-xs font-body font-bold uppercase tracking-[0.25em] text-ct-cream/40 mb-3">
              {locale === "de" ? "Unser Prozess" : "Our Process"}
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-ct-cream">
              {locale === "de" ? "So arbeiten wir zusammen" : "How We Work Together"}
            </h2>
          </RevealDiv>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-ct-red/0 via-ct-red/20 to-ct-red/0" />
            {processSteps.map((s, i) => {
              const step = locale === "de" ? s.de : s.en;
              return (
                <RevealDiv key={i} delay={i * 120} className="text-center relative">
                  <div className="w-14 h-14 rounded-full bg-ct-red/10 border border-ct-red/20 flex items-center justify-center mx-auto mb-4 relative z-10">
                    <span className="font-display text-lg text-ct-red">{s.step}</span>
                  </div>
                  <h3 className="font-display text-lg text-ct-cream mb-2">{step.title}</h3>
                  <p className="font-body text-xs text-ct-cream/50 leading-relaxed">{step.text}</p>
                </RevealDiv>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 md:py-24 px-4 relative overflow-hidden">
        {/* Background image with heavy overlay */}
        <Image src="/images/catering/ct-cocktail-flowers.jpg" alt="" fill className="object-cover object-[center_40%]" />
        <div className="absolute inset-0 bg-licorice/85" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <RevealDiv>
            <p className="text-xs font-body font-bold uppercase tracking-[0.25em] text-ct-red mb-4">
              {locale === "de" ? "Bereit?" : "Ready?"}
            </p>
            <h2 className="font-display text-4xl md:text-6xl text-ct-cream mb-4">
              {locale === "de" ? "Erzählt uns vom Anlass." : "Tell Us About the Occasion."}
            </h2>
            <p className="font-body text-lg text-ct-cream/60 mb-10 max-w-xl mx-auto leading-relaxed">
              {locale === "de"
                ? "Wir kümmern uns um den Rest. Jede Bar ein Highlight. Jeder Drink ein Statement."
                : "We'll take care of the rest. Every bar a highlight. Every drink a statement."}
            </p>
          </RevealDiv>
          <RevealDiv delay={150} className="flex flex-col sm:flex-row gap-4 justify-center">
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
