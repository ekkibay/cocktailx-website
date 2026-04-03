"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import BlurText from "@/components/ui/BlurText";
import { useReveal } from "@/hooks/useReveal";
import { bars } from "@/data/bars";
import { events } from "@/data/events";
import { sponsors, pressLogos } from "@/data/sponsors";
import { trackEvent } from "@/lib/meta-pixel";

/* ── History stats ── */
const history = [
  { year: "2023", bars: 32, visitors: "1.400", cocktails: "—", days: 5 },
  { year: "2024", bars: 42, visitors: "1.200", cocktails: "—", days: 5 },
  { year: "2025", bars: 45, visitors: "2.500", cocktails: "—", days: 12 },
];

/* ── Key facts ── */
const keyFacts = {
  de: [
    { value: "58", label: "Bars" },
    { value: "18", label: "Tage" },
    { value: "1", label: "Ticket" },
    { value: "5.000+", label: "Gäste erwartet" },
  ],
  en: [
    { value: "58", label: "Bars" },
    { value: "18", label: "Days" },
    { value: "1", label: "Ticket" },
    { value: "5,000+", label: "Guests expected" },
  ],
};

export default function FestivalPage() {
  const locale = useLocale() as "de" | "en";
  const heroText = useReveal({ delay: 150 });
  const factsReveal = useReveal({ delay: 200 });
  const barsReveal = useReveal({ delay: 200 });
  const eventsReveal = useReveal({ delay: 200 });
  const historyReveal = useReveal({ delay: 200 });
  const sponsorsReveal = useReveal({ delay: 200 });
  const ctaReveal = useReveal({ delay: 200 });

  useEffect(() => {
    trackEvent("ViewContent", {
      content_name: "Festival Landing Page",
      content_category: "Festival",
      content_type: "product_group",
      content_ids: "festival-2026",
    });
  }, []);

  return (
    <main>
      {/* ╔══════════════════════════════════════╗
          ║  1. HERO                              ║
          ╚══════════════════════════════════════╝ */}
      <section className="relative min-h-[70vh] flex items-center justify-center text-center overflow-hidden">
        {/* BG image */}
        <Image
          src="/images/festival-hero-obvs.jpg"
          alt="Premium Cocktails — Cocktail X Festival München"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-licorice/70 via-licorice/50 to-licorice" />

        <div className="relative z-10 px-4 py-32">
          <span className="text-[11px] font-body font-bold text-tangerine uppercase tracking-[0.2em] mb-4 block">
            13.–30. Mai 2026 · München
          </span>
          <BlurText
            text={locale === "de" ? "DAS FESTIVAL" : "THE FESTIVAL"}
            tag="h1"
            className="text-5xl md:text-7xl lg:text-8xl font-display text-bone mb-6 text-center w-full"
            delay={80}
            duration={0.7}
          />
          <div ref={heroText.ref} style={heroText.style}>
            <p className="text-base md:text-lg font-body text-bone/85 max-w-xl mx-auto mb-8">
              {locale === "de"
                ? "58 Bars. 18 Tage. 1 Ticket. Jede Bar kreiert einen exklusiven Signature Cocktail – nur für das Festival."
                : "58 Bars. 18 Days. 1 Ticket. Each bar creates an exclusive signature cocktail — only for the festival."}
            </p>
            <a
              href="https://cocktailx.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-base px-10 py-4 inline-block"
              onClick={() => trackEvent("InitiateCheckout", {
                content_name: "Festival Ticket",
                content_category: "Festival",
                content_ids: "festival-2026",
                currency: "EUR",
                value: 20,
                num_items: 1,
              })}
            >
              {locale === "de" ? "TICKET SICHERN" : "GET YOUR TICKET"}
            </a>
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════╗
          ║  2. KEY FACTS                         ║
          ╚══════════════════════════════════════╝ */}
      <section className="py-12 md:py-16 border-b border-bone/10">
        <div ref={factsReveal.ref} style={factsReveal.style} className="max-w-5xl mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-14">
          {keyFacts[locale].map((fact, i) => (
            <div key={i} className="text-center">
              <span className="text-3xl md:text-4xl font-display text-tangerine block">{fact.value}</span>
              <span className="text-xs font-body text-bone/65 uppercase tracking-wider">{fact.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ╔══════════════════════════════════════╗
          ║  3. TEILNEHMENDE BARS                 ║
          ╚══════════════════════════════════════╝ */}
      <section className="py-16 md:py-24 px-4" id="bars">
        <div className="max-w-6xl mx-auto">
          <BlurText
            text={locale === "de" ? "TEILNEHMENDE BARS" : "PARTICIPATING BARS"}
            tag="h2"
            className="text-3xl md:text-4xl font-display text-bone text-center mb-4"
            delay={70}
            duration={0.7}
          />
          <p className="text-sm font-body text-bone/65 text-center mb-12 max-w-lg mx-auto">
            {locale === "de"
              ? "Jede Bar kreiert einen exklusiven Signature Cocktail — nur während des Festivals für 6€ erhältlich."
              : "Each bar creates an exclusive signature cocktail — available only during the festival for €6."}
          </p>

          <div ref={barsReveal.ref} style={barsReveal.style} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {bars.map((bar) => (
              <div
                key={bar.id}
                className="group rounded-2xl overflow-hidden bg-licorice border border-bone/[0.08] hover:border-bone/[0.15] transition-all duration-300 hover:-translate-y-1"
              >
                {/* Bar image */}
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image
                    src={bar.image ?? ""}
                    alt={bar.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                    className="object-cover opacity-25"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-licorice/80 to-licorice/60" />
                  <div className="absolute inset-0" style={{ backgroundImage: "url(/images/pattern-3.png)", backgroundSize: "160px 160px", backgroundRepeat: "repeat", opacity: 0.08 }} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
                    <span className="text-tangerine text-xs">✦</span>
                    <span className="font-display text-bone text-base tracking-[0.3em]">COMING SOON</span>
                  </div>
                </div>
                {/* Details */}
                <div className="p-4">
                  <p className="text-xs font-body text-bone/55 mb-2">
                    {bar.district} · {bar.address}
                  </p>
                  <h3 className="text-base font-display text-bone">{bar.name}</h3>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-sm font-body text-bone/55 mt-8">
            {locale === "de"
              ? "Weitere 52+ Bars werden in Kürze bekanntgegeben."
              : "52+ more bars will be announced soon."}
          </p>
        </div>
      </section>

      {/* ╔══════════════════════════════════════╗
          ║  4. EVENTS & PROGRAMM                 ║
          ╚══════════════════════════════════════╝ */}
      <section className="py-16 md:py-24 px-4 bg-jambalaya/10" id="events">
        <div className="max-w-4xl mx-auto">
          <BlurText
            text={locale === "de" ? "EVENTS & PROGRAMM" : "EVENTS & PROGRAM"}
            tag="h2"
            className="text-3xl md:text-4xl font-display text-bone text-center mb-12"
            delay={70}
            duration={0.7}
          />

          <div ref={eventsReveal.ref} style={eventsReveal.style} className="space-y-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="grid md:grid-cols-[140px,1fr] gap-4 md:gap-8 items-start p-5 md:p-6 rounded-2xl bg-licorice/50 border border-bone/[0.06]"
              >
                {/* Date column */}
                <div className="flex md:flex-col items-baseline md:items-start gap-3 md:gap-1">
                  <span className="text-2xl md:text-3xl font-display text-tangerine">
                    {new Date(event.date).toLocaleDateString(locale === "de" ? "de-DE" : "en-US", { day: "numeric", month: "short" })}
                  </span>
                  <span className="text-xs font-body text-bone/55">
                    {event.time}{locale === "de" ? " Uhr" : ""}
                  </span>
                </div>

                {/* Content */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-[10px] font-body font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      event.type === "opening" ? "bg-tangerine/15 text-tangerine" :
                      event.type === "closing" ? "bg-hibiscus/15 text-hibiscus" :
                      "bg-bone/5 text-bone/65"
                    }`}>
                      {event.type === "opening" ? "Opening" : event.type === "closing" ? "Closing" : "Festival"}
                    </span>
                    {(event.type === "opening" || event.type === "closing") && (
                      <span className="text-[10px] font-body font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-bone/15 text-bone/55">
                        Details folgen
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg md:text-xl font-display text-bone mb-2">
                    {event.title[locale]}
                  </h3>
                  <p className="text-sm font-body text-bone/65 leading-relaxed">
                    {event.description[locale]}
                  </p>
                  <p className="text-xs font-body text-bone/30 mt-2">
                    📍 {event.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════╗
          ║  5. HISTORY — 3-Jahres-Wachstum       ║
          ╚══════════════════════════════════════╝ */}
      <section className="py-16 md:py-24 px-4" id="history">
        <div className="max-w-5xl mx-auto">
          <BlurText
            text={locale === "de" ? "UNSERE GESCHICHTE" : "OUR HISTORY"}
            tag="h2"
            className="text-3xl md:text-4xl font-display text-bone text-center mb-4"
            delay={70}
            duration={0.7}
          />
          <p className="text-sm font-body text-bone/65 text-center mb-12 max-w-md mx-auto">
            {locale === "de"
              ? "Von der Idee zum größten Cocktail-Festival Deutschlands — in nur 3 Jahren."
              : "From idea to Germany's biggest cocktail festival — in just 3 years."}
          </p>

          <div ref={historyReveal.ref} style={historyReveal.style} className="grid grid-cols-3 gap-4 md:gap-8">
            {history.map((year) => (
              <div key={year.year} className="text-center p-4 md:p-6 rounded-2xl bg-bone/[0.02] border border-bone/[0.06]">
                <span className="text-3xl md:text-5xl font-display text-tangerine/30 block mb-4">{year.year}</span>
                <div className="space-y-3">
                  <div>
                    <span className="text-xl md:text-2xl font-display text-bone block">{year.bars}</span>
                    <span className="text-[10px] md:text-xs font-body text-bone/55 uppercase tracking-wider">Bars</span>
                  </div>
                  <div>
                    <span className="text-xl md:text-2xl font-display text-bone block">{year.visitors}</span>
                    <span className="text-[10px] md:text-xs font-body text-bone/55 uppercase tracking-wider">
                      {locale === "de" ? "Gäste" : "Guests"}
                    </span>
                  </div>
                  <div>
                    <span className="text-xl md:text-2xl font-display text-bone block">{year.days}</span>
                    <span className="text-[10px] md:text-xs font-body text-bone/55 uppercase tracking-wider">
                      {locale === "de" ? "Tage" : "Days"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════╗
          ║  6. SPONSOREN & PARTNER               ║
          ╚══════════════════════════════════════╝ */}
      <section className="py-16 md:py-24 px-4 bg-jambalaya/10" id="sponsors">
        <div className="max-w-4xl mx-auto">
          <BlurText
            text={locale === "de" ? "PARTNER & SPONSOREN" : "PARTNERS & SPONSORS"}
            tag="h2"
            className="text-3xl md:text-4xl font-display text-bone text-center mb-12"
            delay={70}
            duration={0.7}
          />

          <div ref={sponsorsReveal.ref} style={sponsorsReveal.style}>
            {/* Main sponsors */}
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 mb-12">
              {sponsors
                .filter((s) => s.tier === "platinum" || s.tier === "gold")
                .map((sponsor) => (
                  <div key={sponsor.id} className="opacity-75 hover:opacity-100 transition-opacity duration-300">
                    <Image
                      src={sponsor.logo}
                      alt={sponsor.name}
                      width={sponsor.tier === "platinum" ? 120 : 90}
                      height={sponsor.tier === "platinum" ? 48 : 36}
                      className="object-contain brightness-0 invert"
                    />
                  </div>
                ))}
            </div>

            {/* Press — bekannt aus */}
            <p className="text-[11px] font-body text-bone/55 uppercase tracking-[0.15em] text-center mb-6">
              {locale === "de" ? "Bekannt aus" : "As seen in"}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              {pressLogos.map((press) => (
                  <div key={press.name} className="opacity-55 hover:opacity-85 transition-opacity duration-300">
                    <Image
                      src={press.logo}
                      alt={press.name}
                      width={70}
                      height={28}
                      className="object-contain brightness-0 invert"
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════════════╗
          ║  7. BOTTOM CTA                        ║
          ╚══════════════════════════════════════╝ */}
      <section className="py-20 md:py-28 text-center px-4">
        <div ref={ctaReveal.ref} style={ctaReveal.style} className="max-w-lg mx-auto">
          <h2 className="text-3xl md:text-4xl font-display text-bone mb-4">
            {locale === "de" ? "DABEI SEIN?" : "JOIN US?"}
          </h2>
          <p className="text-sm font-body text-bone/65 mb-8">
            {locale === "de"
              ? "Sichere dir jetzt dein Ticket zum besten Preis und erlebe 18 Tage Cocktail-Kultur in Münchens besten Bars."
              : "Get your ticket now at the best price and experience 18 days of cocktail culture in München's best bars."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://cocktailx.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-base px-10 py-4 text-center"
              onClick={() => trackEvent("InitiateCheckout", {
                content_name: "Festival Ticket",
                content_category: "Festival",
                content_ids: "festival-2026",
                currency: "EUR",
                value: 20,
                num_items: 1,
              })}
            >
              {locale === "de" ? "TICKET KAUFEN — AB 20€" : "BUY TICKET — FROM €20"}
            </a>
            <Link href={`/${locale}/app`} className="btn-secondary text-base px-8 py-4 text-center">
              {locale === "de" ? "ZUR APP" : "OPEN APP"}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
