"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import BlurText from "@/components/ui/BlurText";
import { useReveal } from "@/hooks/useReveal";

const steps = [
  {
    num: "01",
    title: { de: "Ticket kaufen", en: "Buy ticket" },
    desc: { de: "Online bestellen und sofort per E-Mail erhalten.", en: "Order online and receive instantly by email." },
  },
  {
    num: "02",
    title: { de: "App öffnen", en: "Open app" },
    desc: { de: "Festival-Code eingeben und deinen Pass aktivieren.", en: "Enter festival code and activate your pass." },
  },
  {
    num: "03",
    title: { de: "Bars entdecken", en: "Discover bars" },
    desc: { de: "Interaktive Karte, Signature Cocktails freischalten.", en: "Interactive map, unlock signature cocktails." },
  },
  {
    num: "04",
    title: { de: "Belohnungen", en: "Rewards" },
    desc: { de: "Stempel sammeln und exklusive Preise gewinnen.", en: "Collect stamps and win exclusive prizes." },
  },
];

const features = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
    title: { de: "Interaktive Bar-Karte", en: "Interactive bar map" },
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M5 14.5h14m-7 0v6.5m-3.5 0h7" />
      </svg>
    ),
    title: { de: "Cocktail-Sammlung", en: "Cocktail collection" },
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
    ),
    title: { de: "Live Event-Updates", en: "Live event updates" },
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
    title: { de: "Belohnungen & Preise", en: "Rewards & prizes" },
  },
];

export default function AppPage() {
  const locale = useLocale() as "de" | "en";
  const heroText = useReveal({ delay: 150 });
  const phoneReveal = useReveal({ delay: 300, direction: "left" });
  const stepsReveal = useReveal({ delay: 200 });
  const ctaReveal = useReveal({ delay: 250 });

  return (
    <main>
      {/* Hero — side by side on desktop */}
      <section className="section-padding min-h-[80vh] flex items-center">
        <div className="max-w-6xl mx-auto w-full grid md:grid-cols-[1fr,auto] gap-12 lg:gap-20 items-center">
          {/* Left: Text */}
          <div>
            <BlurText
              text={locale === "de" ? "DEIN DIGITALER FESTIVAL-BEGLEITER" : "YOUR DIGITAL FESTIVAL COMPANION"}
              tag="h1"
              className="text-4xl md:text-5xl lg:text-6xl font-display text-bone leading-tight mb-6"
              delay={80}
              duration={0.7}
            />
            <div ref={heroText.ref} style={heroText.style}>
              <p className="text-base md:text-lg font-body text-bone/60 mb-8 max-w-lg">
                {locale === "de"
                  ? "Mit der Cocktail X App hast du alle teilnehmenden Bars, Signature Cocktails und deinen digitalen Stempelpass immer dabei."
                  : "The Cocktail X App gives you all participating bars, signature cocktails, and your digital stamp passport in one place."}
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-3 mb-8">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-body text-bone/70 bg-bone/[0.04] border border-bone/[0.08] rounded-full px-3.5 py-2">
                    <span className="text-tangerine">{f.icon}</span>
                    {f.title[locale]}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://www.cocktailx.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-base px-8 py-4 text-center"
                >
                  {locale === "de" ? "APP ÖFFNEN" : "OPEN APP"}
                </a>
                <Link
                  href={`/${locale}/shop`}
                  className="btn-secondary text-base px-8 py-4 text-center"
                >
                  {locale === "de" ? "TICKET KAUFEN" : "BUY TICKET"}
                </Link>
              </div>

              <p className="text-[11px] font-body text-bone/30 mt-3">
                {locale === "de"
                  ? "Keine Installation nötig — läuft direkt im Browser"
                  : "No installation needed — runs directly in your browser"}
              </p>
            </div>
          </div>

          {/* Right: Phone mockup */}
          <div ref={phoneReveal.ref} style={phoneReveal.style} className="relative w-[260px] md:w-[300px] mx-auto md:mx-0">
            <div className="relative rounded-[2rem] overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.5)] bg-[#223a7b]">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: "url(/images/pattern-bg.svg)",
                  backgroundSize: "104px 104px",
                  backgroundRepeat: "repeat",
                }}
              />
              <div className="aspect-[9/16] relative flex flex-col px-5 py-6">
                {/* Logo top-right */}
                <p className="font-display text-bone text-lg self-end text-right leading-tight">
                  cocktail{" "}
                  <svg viewBox="0 0 100 100" className="inline-block w-[0.85em] h-[0.85em] align-middle relative -top-[0.03em]" fill="currentColor"><path d="M50 0 C52 38, 62 48, 100 50 C62 52, 52 62, 50 100 C48 62, 38 52, 0 50 C38 48, 48 38, 50 0Z" /></svg>
                  <br />festival
                </p>

                {/* Star centered */}
                <div className="flex-1 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-28 h-28 md:w-36 md:h-36 text-tangerine" fill="currentColor">
                    <path d="M50 0 C52 38, 62 48, 100 50 C62 52, 52 62, 50 100 C48 62, 38 52, 0 50 C38 48, 48 38, 50 0Z" />
                  </svg>
                </div>

                {/* Date */}
                <div className="text-center mb-3">
                  <p className="text-bone/90 text-sm font-body">13. - 30. Mai 2026</p>
                  <p className="text-bone/60 text-xs font-body">München</p>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <div className="flex-1 bg-tangerine rounded-full py-2.5 text-center text-xs font-body font-bold text-licorice">Tickets</div>
                  <div className="flex-1 bg-bone rounded-full py-2.5 text-center text-xs font-body font-bold text-licorice">Login</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works — compact horizontal */}
      <section className="py-16 md:py-20 bg-jambalaya/10">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-display text-bone text-center mb-12">
            {locale === "de" ? "SO FUNKTIONIERT'S" : "HOW IT WORKS"}
          </h2>

          <div ref={stepsReveal.ref} style={stepsReveal.style} className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {steps.map((step, i) => (
              <div key={i} className="relative text-center">
                <span className="text-3xl md:text-4xl font-display text-tangerine/20 block mb-2">{step.num}</span>
                <h3 className="text-sm md:text-base font-display text-bone mb-1.5">{step.title[locale]}</h3>
                <p className="text-xs font-body text-bone/45 leading-relaxed">{step.desc[locale]}</p>
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-5 -right-3 w-6 h-px bg-bone/10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 md:py-20 text-center">
        <div ref={ctaReveal.ref} style={ctaReveal.style} className="max-w-lg mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-display text-bone mb-4">
            {locale === "de" ? "BEREIT FÜR DAS FESTIVAL?" : "READY FOR THE FESTIVAL?"}
          </h2>
          <p className="text-sm font-body text-bone/50 mb-8">
            {locale === "de"
              ? "Hol dir jetzt dein Ticket und erlebe 18 Tage Cocktail-Kultur in Münchens besten Bars."
              : "Get your ticket now and experience 18 days of cocktail culture in Munich's best bars."}
          </p>
          <Link href={`/${locale}/shop`} className="btn-primary text-base px-10 py-4 inline-block">
            {locale === "de" ? "TICKET SICHERN" : "GET YOUR TICKET"}
          </Link>
        </div>
      </section>
    </main>
  );
}
