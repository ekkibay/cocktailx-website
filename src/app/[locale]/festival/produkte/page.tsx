"use client";

import { useLocale } from "next-intl";
import { cocktails } from "@/data/cocktails";
import BlurText from "@/components/ui/BlurText";
import { useReveal } from "@/hooks/useReveal";

export default function ProduktePage() {
  const locale = useLocale() as "de" | "en";
  const subtitle = useReveal<HTMLParagraphElement>({ delay: 150 });
  const grid = useReveal({ delay: 250 });

  return (
    <main className="section-padding">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <BlurText
          text="SIGNATURE COCKTAILS"
          tag="h1"
          className="text-4xl md:text-6xl lg:text-7xl font-display text-bone text-center mb-4"
          delay={80}
          duration={0.7}
        />
        <p
          ref={subtitle.ref}
          style={subtitle.style}
          className="text-center text-sm md:text-base font-body text-bone/65 mb-16 max-w-lg mx-auto"
        >
          {locale === "de"
            ? "Jede teilnehmende Bar kreiert einen exklusiven Signature Cocktail — nur während des Festivals erhältlich."
            : "Each participating bar creates an exclusive signature cocktail — only available during the festival."}
        </p>

        {/* Cocktails Grid */}
        <div ref={grid.ref} style={grid.style} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {cocktails.map((cocktail) => (
            <div
              key={cocktail.id}
              className="group relative rounded-2xl overflow-hidden bg-licorice border border-bone/[0.08] hover:border-bone/[0.15] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
            >
              {/* Colored gradient top band */}
              <div
                className="relative aspect-[4/3] overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${cocktail.accentColor}22 0%, ${cocktail.accentColor}08 50%, transparent 100%)`,
                }}
              >
                {/* Pattern overlay */}
                <div
                  className="absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage: "url(/images/pattern-bg.svg)",
                    backgroundSize: "80px 80px",
                  }}
                />
                {/* Cocktail glass icon as placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Glow behind icon */}
                    <div
                      className="absolute inset-0 blur-3xl opacity-30 scale-150"
                      style={{ backgroundColor: cocktail.accentColor }}
                    />
                    <svg
                      className="relative w-20 h-20 md:w-24 md:h-24 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={cocktail.accentColor}
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M8 22h8" />
                      <path d="M12 11v11" />
                      <path d="M19 2c0 5-3.5 9-7 9S5 7 5 2" />
                      <circle cx="17" cy="4" r="2" fill={cocktail.accentColor} fillOpacity="0.3" stroke="none" />
                    </svg>
                  </div>
                </div>

                {/* Price badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className="text-sm font-display px-3 py-1.5 rounded-full"
                    style={{
                      backgroundColor: `${cocktail.accentColor}20`,
                      color: cocktail.accentColor,
                      border: `1px solid ${cocktail.accentColor}30`,
                    }}
                  >
                    €6
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 md:p-6">
                {/* Bar name — small label */}
                <p
                  className="text-[11px] font-body font-bold uppercase tracking-[0.12em] mb-2"
                  style={{ color: cocktail.accentColor }}
                >
                  {cocktail.bar}
                </p>

                {/* Cocktail name */}
                <h3 className="text-xl md:text-2xl font-display text-bone leading-tight group-hover:text-bone transition-colors">
                  {cocktail.name}
                </h3>

                {/* Description */}
                <p className="text-sm font-body text-bone/65 mt-3 leading-relaxed line-clamp-3">
                  {cocktail.description[locale]}
                </p>

                {/* Bottom row */}
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-bone/[0.06]">
                  <span className="text-xs font-body text-bone/30 uppercase tracking-wider">
                    Signature Cocktail
                  </span>
                  <span
                    className="text-xs font-body font-bold flex items-center gap-1.5 transition-all duration-300 group-hover:gap-2.5"
                    style={{ color: cocktail.accentColor }}
                  >
                    {locale === "de" ? "Zur Bar" : "Visit Bar"}
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
