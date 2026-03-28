"use client";

import { useLocale } from "next-intl";
import Link from "next/link";

const services = [
  {
    id: "event-bar",
    icon: "◈",
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
    icon: "◇",
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
    icon: "◉",
    de: {
      title: "Corporate Events",
      subtitle: "Für Unternehmen, die Eindruck hinterlassen",
      text: "Produktlaunches, Jahresabschluss-Feiern, Konferenzen, Incentives. Wir verstehen, dass Corporate Events repräsentative Wirkung haben. Unser Service ist diskret, professionell und auf euer Branding abgestimmt.",
      features: ["Branded Bar-Konzepte", "Discrete & professionell", "Vollservice", "Nach-Event Reporting"],
    },
    en: {
      title: "Corporate Events",
      subtitle: "For companies that make an impression",
      text: "Product launches, year-end parties, conferences, incentives. We understand that corporate events have a representative effect. Our service is discreet, professional and aligned to your branding.",
      features: ["Branded bar concepts", "Discreet & professional", "Full service", "Post-event reporting"],
    },
  },
  {
    id: "private",
    icon: "◐",
    de: {
      title: "Private Feiern",
      subtitle: "Hochzeiten, Geburtstage, Jubiläen",
      text: "Eure Feier ist einzigartig — das sollte auch die Bar sein. Wir kümmern uns um alles, damit ihr und eure Gäste den Abend genießen können. Persönliche Beratung, individuelle Konzepte.",
      features: ["Persönliche Beratung", "Individuelle Konzepte", "Flexible Pakete", "Erinnerungswürdiger Service"],
    },
    en: {
      title: "Private Celebrations",
      subtitle: "Weddings, birthdays, anniversaries",
      text: "Your celebration is unique — so should the bar be. We take care of everything so you and your guests can enjoy the evening. Personal consultation, individual concepts.",
      features: ["Personal consultation", "Individual concepts", "Flexible packages", "Memorable service"],
    },
  },
  {
    id: "festival",
    icon: "◫",
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
    icon: "◬",
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

export default function LeistungenPage() {
  const locale = useLocale() as "de" | "en";

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#000000" }}>
      {/* BG */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(/images/pattern-3.png)", backgroundSize: "180px 180px", backgroundRepeat: "repeat" }} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.10]" style={{ background: "radial-gradient(circle, #00674F 0%, transparent 70%)" }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 pt-40 pb-24">
        <p className="text-xs font-body font-bold uppercase tracking-[0.3em] text-ct-green mb-4 text-center">
          {locale === "de" ? "Was wir bieten" : "What We Offer"}
        </p>
        <h1 className="font-display text-5xl md:text-7xl text-ct-cream text-center mb-16">
          {locale === "de" ? "LEISTUNGEN" : "SERVICES"}
        </h1>

        <div className="space-y-8">
          {services.map((service) => (
            <div
              key={service.id}
              id={service.id}
              className="group grid md:grid-cols-[80px,1fr,280px] gap-6 md:gap-8 items-start p-6 md:p-8 rounded-2xl border border-ct-green/15 bg-ct-green/[0.03] hover:border-ct-green/30 transition-all duration-300"
            >
              <span className="font-display text-4xl text-ct-green">{service.icon}</span>
              <div>
                <h2 className="font-display text-2xl md:text-3xl text-ct-cream mb-1">
                  {locale === "de" ? service.de.title : service.en.title}
                </h2>
                <p className="font-body text-sm text-ct-green mb-4">
                  {locale === "de" ? service.de.subtitle : service.en.subtitle}
                </p>
                <p className="font-body text-ct-cream/70 leading-relaxed">
                  {locale === "de" ? service.de.text : service.en.text}
                </p>
              </div>
              <ul className="space-y-2">
                {(locale === "de" ? service.de.features : service.en.features).map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-ct-green text-xs flex-shrink-0">✦</span>
                    <span className="font-body text-sm text-ct-cream/65">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center p-10 rounded-2xl border border-ct-green/20" style={{ background: "linear-gradient(135deg, #001a15 0%, #000000 100%)" }}>
          <h2 className="font-display text-3xl md:text-4xl text-ct-cream mb-4">
            {locale === "de" ? "INTERESSE GEWECKT?" : "INTERESTED?"}
          </h2>
          <p className="font-body text-ct-cream/65 mb-8 max-w-lg mx-auto">
            {locale === "de"
              ? "Schreibt uns — wir melden uns innerhalb von 24 Stunden mit einem unverbindlichen Angebot."
              : "Contact us — we'll respond within 24 hours with a non-binding quote."}
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
