"use client";

import { useLocale } from "next-intl";
import Link from "next/link";

const services = [
  {
    icon: "◈",
    de: { title: "Event Bar", text: "Mobile Premium-Bar für Events jeder Größe — vom Firmen-Event bis zur Hochzeit. Professioneller Auf- und Abbau inklusive." },
    en: { title: "Event Bar", text: "Mobile premium bar for events of any size — from corporate to weddings. Professional setup and teardown included." },
  },
  {
    icon: "◇",
    de: { title: "Signature Cocktails", text: "Individuelle Cocktailkarten, abgestimmt auf euer Branding, eure Gäste und die Occasion. Von klassisch bis avantgardistisch." },
    en: { title: "Signature Cocktails", text: "Bespoke cocktail menus tailored to your branding, guests, and occasion. From classic to avant-garde." },
  },
  {
    icon: "◉",
    de: { title: "Corporate Events", text: "Produktlaunches, Konferenzen, Teamevents. Wir bringen die Bar zu euch — mit Service, der zu eurem Auftritt passt." },
    en: { title: "Corporate Events", text: "Product launches, conferences, team events. We bring the bar to you — with service that fits your brand." },
  },
  {
    icon: "◐",
    de: { title: "Private Feiern", text: "Hochzeiten, Geburtstage, Jubiläen. Ein unvergesslicher Bar-Erlebnis für eure Gäste — persönlich, professionell, perfekt." },
    en: { title: "Private Celebrations", text: "Weddings, birthdays, anniversaries. An unforgettable bar experience for your guests — personal, professional, perfect." },
  },
  {
    icon: "◫",
    de: { title: "Festival & Outdoor", text: "Wir betreiben Bars auf Festivals und Outdoor-Events. Bewährt durch das Cocktail X Festival — seit 2023." },
    en: { title: "Festival & Outdoor", text: "We operate bars at festivals and outdoor events. Proven through the Cocktail X Festival — since 2023." },
  },
  {
    icon: "◬",
    de: { title: "Bar Consulting", text: "Beratung für Bars und Gastronomen: Konzept, Karte, Training. Aus der Praxis, für die Praxis." },
    en: { title: "Bar Consulting", text: "Consulting for bars and restaurateurs: concept, menu, training. From practice, for practice." },
  },
];

const stats = [
  { value: "3+", de: "Jahre Erfahrung", en: "Years Experience" },
  { value: "58", de: "Festival-Bars 2026", en: "Festival Bars 2026" },
  { value: "5.000+", de: "Gäste pro Jahr", en: "Guests per Year" },
  { value: "100+", de: "Events betreut", en: "Events Catered" },
];

const eventTypes = [
  { de: "Hochzeiten & Private Feiern", en: "Weddings & Private Celebrations" },
  { de: "Firmenevents & Produktlaunches", en: "Corporate Events & Product Launches" },
  { de: "Festivals & Open Air", en: "Festivals & Open Air" },
  { de: "Galas & Awards Ceremonies", en: "Galas & Awards Ceremonies" },
  { de: "Teamevents & Workshops", en: "Team Events & Workshops" },
  { de: "Messen & Konferenzen", en: "Trade Fairs & Conferences" },
];

export default function CateringPage() {
  const locale = useLocale() as "de" | "en";

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#000000" }}>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* BG pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "url(/images/pattern-3.png)", backgroundSize: "180px 180px", backgroundRepeat: "repeat" }}
        />
        {/* Green orb */}
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full opacity-[0.12]" style={{ background: "radial-gradient(circle, #00674F 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.10]" style={{ background: "radial-gradient(circle, #004369 0%, transparent 70%)" }} />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-40 pb-32">
          <p className="text-xs font-body font-bold uppercase tracking-[0.3em] text-ct-green mb-6">
            {locale === "de" ? "Premium Cocktail Catering · München" : "Premium Cocktail Catering · Munich"}
          </p>
          <h1 className="font-display text-6xl md:text-8xl lg:text-9xl text-ct-cream mb-8 leading-none">
            COCKTAIL X<br />
            <span className="text-ct-green">CATERING</span>
          </h1>
          <p className="font-body text-lg md:text-xl text-ct-cream/80 max-w-2xl mx-auto mb-12 leading-relaxed">
            {locale === "de"
              ? "Wir bringen die Bar zu euch. Professionelles Cocktail-Catering für Events, die in Erinnerung bleiben — von den Machern des Cocktail X Festivals."
              : "We bring the bar to you. Professional cocktail catering for events that leave a lasting impression — from the creators of the Cocktail X Festival."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/catering/kontakt`}
              className="inline-block px-10 py-4 rounded-full bg-ct-green text-ct-cream font-body font-bold text-sm uppercase tracking-wider hover:bg-ct-green/80 transition-all duration-200"
            >
              {locale === "de" ? "Anfrage stellen" : "Send Enquiry"}
            </Link>
            <Link
              href={`/${locale}/catering/leistungen`}
              className="inline-block px-10 py-4 rounded-full border border-ct-cream/25 text-ct-cream font-body font-bold text-sm uppercase tracking-wider hover:border-ct-cream/50 transition-all duration-200"
            >
              {locale === "de" ? "Leistungen" : "Services"}
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-12 border-y border-ct-green/15">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <span className="font-display text-3xl md:text-4xl text-ct-green block">{stat.value}</span>
              <span className="font-body text-xs text-ct-cream/55 uppercase tracking-wider mt-1 block">
                {locale === "de" ? stat.de : stat.en}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-body font-bold uppercase tracking-[0.25em] text-ct-green mb-4 text-center">
            {locale === "de" ? "Was wir bieten" : "What We Offer"}
          </p>
          <h2 className="font-display text-4xl md:text-6xl text-ct-cream text-center mb-16">
            {locale === "de" ? "LEISTUNGEN" : "SERVICES"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl border border-ct-green/15 bg-ct-green/[0.03] hover:border-ct-green/35 hover:bg-ct-green/[0.07] transition-all duration-300"
              >
                <span className="font-display text-2xl text-ct-green block mb-4">{service.icon}</span>
                <h3 className="font-display text-xl text-ct-cream mb-3">
                  {locale === "de" ? service.de.title : service.en.title}
                </h3>
                <p className="font-body text-sm text-ct-cream/65 leading-relaxed">
                  {locale === "de" ? service.de.text : service.en.text}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href={`/${locale}/catering/leistungen`}
              className="inline-block px-8 py-3 rounded-full border border-ct-green/40 text-ct-cream/80 font-body text-sm uppercase tracking-wider hover:border-ct-green hover:text-ct-cream transition-all duration-200"
            >
              {locale === "de" ? "Alle Leistungen →" : "All Services →"}
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="py-20 md:py-28 px-4" style={{ background: "linear-gradient(135deg, #000000 0%, #001a15 50%, #000000 100%)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-body font-bold uppercase tracking-[0.25em] text-ct-green mb-4">
                {locale === "de" ? "Unsere Stärke" : "Our Strength"}
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-ct-cream mb-6">
                {locale === "de" ? "WARUM COCKTAIL X CATERING?" : "WHY COCKTAIL X CATERING?"}
              </h2>
              <p className="font-body text-ct-cream/75 leading-relaxed mb-8">
                {locale === "de"
                  ? "Wir sind nicht nur Caterer — wir sind das Team hinter dem größten Cocktail-Festival Deutschlands. Dieses Know-how bringen wir zu eurem Event."
                  : "We're not just caterers — we're the team behind Germany's biggest cocktail festival. We bring that expertise to your event."}
              </p>
              <ul className="space-y-4">
                {[
                  { de: "Bewährte Festival-Expertise aus 3+ Jahren Cocktail X Festival", en: "Proven festival expertise from 3+ years of Cocktail X Festival" },
                  { de: "Netzwerk von 58+ Premium-Bars und Bartenders in München", en: "Network of 58+ premium bars and bartenders in Munich" },
                  { de: "Individuelle Cocktailkarten, abgestimmt auf euer Event", en: "Bespoke cocktail menus tailored to your event" },
                  { de: "Von der Planung bis zum letzten Drink — alles aus einer Hand", en: "From planning to last call — everything from one source" },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-ct-green mt-1 flex-shrink-0">✦</span>
                    <span className="font-body text-sm text-ct-cream/80">{locale === "de" ? item.de : item.en}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {eventTypes.map((type, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-ct-green/15 bg-ct-green/[0.04]"
                >
                  <p className="font-body text-sm text-ct-cream/75">{locale === "de" ? type.de : type.en}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FESTIVAL CONNECTION ── */}
      <section className="py-20 md:py-24 px-4 border-y border-ct-green/10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-body font-bold uppercase tracking-[0.25em] text-ct-green mb-4">
            {locale === "de" ? "Teil der Familie" : "Part of the Family"}
          </p>
          <h2 className="font-display text-3xl md:text-5xl text-ct-cream mb-6">
            {locale === "de" ? "VERBUNDEN MIT DEM FESTIVAL" : "CONNECTED TO THE FESTIVAL"}
          </h2>
          <p className="font-body text-ct-cream/70 leading-relaxed mb-10 max-w-2xl mx-auto">
            {locale === "de"
              ? "Cocktail X Catering und das Cocktail X Festival teilen die gleiche DNA: Leidenschaft für Cocktails, Qualität im Service und unvergessliche Erlebnisse. Hinter beiden steht dasselbe Team."
              : "Cocktail X Catering and the Cocktail X Festival share the same DNA: passion for cocktails, quality in service, and unforgettable experiences. Both are driven by the same team."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/catering/kontakt`}
              className="inline-block px-10 py-4 rounded-full bg-ct-green text-ct-cream font-body font-bold text-sm uppercase tracking-wider hover:bg-ct-green/80 transition-all duration-200"
            >
              {locale === "de" ? "Anfrage stellen" : "Send Enquiry"}
            </Link>
            <Link
              href={`/${locale}`}
              className="inline-block px-10 py-4 rounded-full border border-ct-cream/20 text-ct-cream/70 font-body font-bold text-sm uppercase tracking-wider hover:border-ct-cream/40 hover:text-ct-cream transition-all duration-200"
            >
              {locale === "de" ? "Zum Festival →" : "To the Festival →"}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
