"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import ShopifyBuyButton from "@/components/ui/ShopifyBuyButton";
import BlurText from "@/components/ui/BlurText";
import { useReveal } from "@/hooks/useReveal";

const trustPoints = {
  de: ["Sofort per E-Mail", "18 Tage gültig", "50+ Bars", "Kostenlose Stornierung"],
  en: ["Instant email delivery", "Valid for 18 days", "50+ Bars", "Free cancellation"],
};

const ticketFeatures = {
  de: [
    "Zugang zu allen 50+ teilnehmenden Bars",
    "Signature Cocktails für nur 6€ statt 12–16€",
    "Gilt für alle 18 Festivaltage",
    "Digitaler Stempelpass mit Belohnungen",
    "Exklusive Events & Tastings",
  ],
  en: [
    "Access to all 50+ participating bars",
    "Signature cocktails for just €6 instead of €12–16",
    "Valid for all 18 festival days",
    "Digital stamp passport with rewards",
    "Exclusive events & tastings",
  ],
};

export default function ShopPage() {
  const locale = useLocale() as "de" | "en";
  const heroReveal = useReveal({ delay: 150 });
  const trustReveal = useReveal({ delay: 250 });
  const merchTitle = useReveal({ delay: 100 });
  const merchCards = useReveal({ delay: 200 });

  return (
    <main>
      {/* Hero — Ticket as primary product */}
      <section className="section-padding min-h-[70vh] flex flex-col items-center justify-center">
        <BlurText
          text={locale === "de" ? "SICHERE DIR DEIN TICKET" : "GET YOUR TICKET"}
          tag="h1"
          className="text-4xl md:text-6xl lg:text-7xl font-display text-bone text-center mb-4"
          delay={80}
          duration={0.7}
        />

        <div ref={heroReveal.ref} style={heroReveal.style} className="w-full max-w-3xl mx-auto mt-8">
          {/* Main Ticket Card */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-tangerine/40 bg-gradient-to-br from-tangerine/[0.08] via-licorice to-licorice">
            {/* Pattern subtle */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: "url(/images/pattern-bg.svg)",
                backgroundSize: "120px 120px",
              }}
            />

            <div className="relative grid md:grid-cols-[1fr,auto] gap-8 p-6 md:p-10">
              {/* Left: Product info */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-body font-bold uppercase tracking-wider text-licorice bg-tangerine px-3 py-1 rounded-full">
                    {locale === "de" ? "BESTER PREIS AKTUELL" : "BEST PRICE NOW"}
                  </span>
                  <span className="text-[10px] font-body font-bold uppercase tracking-wider text-tangerine/70 bg-tangerine/10 border border-tangerine/20 px-3 py-1 rounded-full">
                    Early Bird
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-display text-bone mb-2">
                  COCKTAIL X FESTIVAL TICKET
                </h2>
                <p className="text-sm font-body text-bone/50 mb-6">
                  {locale === "de"
                    ? "13.–30. Mai 2026 · München · Dein All-Access-Pass"
                    : "May 13–30, 2026 · Munich · Your all-access pass"}
                </p>

                {/* Feature checklist */}
                <ul className="space-y-2.5 mb-6">
                  {ticketFeatures[locale].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm font-body text-bone/70">
                      <svg className="w-4 h-4 text-tangerine shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right: Price + CTA */}
              <div className="flex flex-col items-center justify-center md:min-w-[200px] md:border-l md:border-bone/10 md:pl-8">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-2xl font-display text-bone/25 line-through">€25</span>
                  <span className="text-6xl md:text-7xl font-display text-tangerine">€16</span>
                </div>
                <span className="text-xs font-body text-emerald-400 font-bold mb-1">
                  {locale === "de" ? "Du sparst 9€" : "You save €9"}
                </span>
                <span className="text-[11px] font-body text-bone/40 mb-6">
                  {locale === "de" ? "pro Person" : "per person"}
                </span>

                <ShopifyBuyButton
                  productId="passport-early-bird"
                  buttonText={locale === "de" ? "JETZT KAUFEN" : "BUY NOW"}
                  className="w-full text-center text-base py-4"
                />

                <div className="flex items-center gap-1.5 mt-3 text-[11px] font-body font-bold text-tangerine/70">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-tangerine animate-pulse" />
                  {locale === "de" ? "Limitiertes Kontingent" : "Limited availability"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust bar */}
        <div ref={trustReveal.ref} style={trustReveal.style} className="flex flex-wrap justify-center gap-6 md:gap-10 mt-8">
          {trustPoints[locale].map((point, i) => (
            <div key={i} className="flex items-center gap-2 text-xs font-body text-bone/40">
              <svg className="w-3.5 h-3.5 text-tangerine/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {point}
            </div>
          ))}
        </div>
      </section>

      {/* Merch Section */}
      <section className="section-padding bg-jambalaya/10">
        <div className="max-w-4xl mx-auto">
          <h2
            ref={merchTitle.ref}
            style={merchTitle.style}
            className="text-2xl md:text-3xl font-display text-bone text-center mb-10"
          >
            {locale === "de" ? "MERCHANDISE & GESCHENKE" : "MERCHANDISE & GIFTS"}
          </h2>

          <div ref={merchCards.ref} style={merchCards.style} className="grid sm:grid-cols-2 gap-6">
            {/* T-Shirt */}
            <div className="group rounded-2xl overflow-hidden bg-licorice border border-bone/[0.08] hover:border-bone/[0.15] transition-all duration-500 hover:-translate-y-1">
              <div
                className="relative aspect-[4/3] overflow-hidden"
                style={{ background: "linear-gradient(135deg, #bd256e22 0%, #bd256e08 50%, transparent 100%)" }}
              >
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(/images/pattern-bg.svg)", backgroundSize: "80px 80px" }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 blur-3xl opacity-30 scale-150 bg-hibiscus" />
                    <svg className="relative w-20 h-20 text-hibiscus transition-transform duration-500 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.38 3.46 16 2 12 5 8 2 3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] font-body font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-hibiscus/20 text-hibiscus border border-hibiscus/30">
                    LIMITED
                  </span>
                </div>
              </div>
              <div className="p-5 md:p-6">
                <h3 className="text-xl font-display text-bone">Festival T-Shirt</h3>
                <p className="text-sm font-body text-bone/50 mt-2">
                  {locale === "de"
                    ? "Offizielles Cocktail X Festival T-Shirt. 100% Bio-Baumwolle, limitierte Auflage 2026."
                    : "Official Cocktail X Festival T-Shirt. 100% organic cotton, limited 2026 edition."}
                </p>
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-bone/[0.06]">
                  <span className="text-2xl font-display text-hibiscus">€39</span>
                  <ShopifyBuyButton
                    productId="tshirt"
                    buttonText={locale === "de" ? "Kaufen" : "Buy"}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Gift Card */}
            <div className="group rounded-2xl overflow-hidden bg-licorice border border-bone/[0.08] hover:border-bone/[0.15] transition-all duration-500 hover:-translate-y-1">
              <div
                className="relative aspect-[4/3] overflow-hidden"
                style={{ background: "linear-gradient(135deg, #7B6BA022 0%, #7B6BA008 50%, transparent 100%)" }}
              >
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(/images/pattern-bg.svg)", backgroundSize: "80px 80px" }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 blur-3xl opacity-30 scale-150 bg-[#7B6BA0]" />
                    <svg className="relative w-20 h-20 text-[#7B6BA0] transition-transform duration-500 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="8" width="18" height="12" rx="2" />
                      <path d="M12 8V3" />
                      <path d="M8 3c0 2.5 4 5 4 5s4-2.5 4-5" />
                      <path d="M12 8v12" />
                      <path d="M3 14h18" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-5 md:p-6">
                <h3 className="text-xl font-display text-bone">{locale === "de" ? "Geschenkkarte" : "Gift Card"}</h3>
                <p className="text-sm font-body text-bone/50 mt-2">
                  {locale === "de"
                    ? "Das perfekte Geschenk für Cocktail-Liebhaber. Einlösbar für jedes Festival-Ticket."
                    : "The perfect gift for cocktail lovers. Redeemable for any festival ticket."}
                </p>
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-bone/[0.06]">
                  <span className="text-2xl font-display text-[#7B6BA0]">€16</span>
                  <ShopifyBuyButton
                    productId="giftcard"
                    buttonText={locale === "de" ? "Verschenken" : "Gift"}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-padding text-center">
        <p className="text-sm font-body text-bone/40 mb-4">
          {locale === "de"
            ? "Fragen zum Festival oder Ticket?"
            : "Questions about the festival or ticket?"}
        </p>
        <Link
          href={`/${locale}/about/contact`}
          className="text-sm font-body font-bold text-tangerine hover:text-tangerine/80 transition-colors underline underline-offset-4"
        >
          {locale === "de" ? "Kontaktiere uns" : "Contact us"}
        </Link>
      </section>
    </main>
  );
}
