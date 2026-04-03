"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import BlurText from "@/components/ui/BlurText";
import { useReveal } from "@/hooks/useReveal";

function PassportIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <circle cx="12" cy="10" r="3" />
      <path d="M8 17h8" />
    </svg>
  );
}

function CocktailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2l8 0" />
      <path d="M5 6l14 0l-5.5 8v5h3" />
      <path d="M10.5 19h3" />
      <path d="M12 14v5" />
      <path d="M5 6l7 10l7-10" />
    </svg>
  );
}

function ScanIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 012-2h2" />
      <path d="M17 3h2a2 2 0 012 2v2" />
      <path d="M21 17v2a2 2 0 01-2 2h-2" />
      <path d="M7 21H5a2 2 0 01-2-2v-2" />
      <rect x="7" y="7" width="4" height="4" />
      <rect x="13" y="7" width="4" height="4" />
      <rect x="7" y="13" width="4" height="4" />
      <path d="M13 13h4v4h-4" />
    </svg>
  );
}

function StampIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 21h14" />
      <path d="M5 18h14v3H5z" />
      <path d="M10 18v-4a2 2 0 00-2-2H7a3 3 0 01-3-3V7a1 1 0 011-1h2" />
      <path d="M14 18v-4a2 2 0 012-2h1a3 3 0 003-3V7a1 1 0 00-1-1h-2" />
      <rect x="8" y="3" width="8" height="5" rx="1" />
    </svg>
  );
}

const icons = [PassportIcon, CocktailIcon, ScanIcon, StampIcon];

const steps = [
  { number: "01", key: "step1" as const },
  { number: "02", key: "step2" as const },
  { number: "03", key: "step3" as const },
  { number: "04", key: "step4" as const },
];

export default function HowItWorks() {
  const t = useTranslations("howItWorks");
  const grid = useReveal({ delay: 200 });
  const mockup = useReveal({ delay: 350, direction: "up" });

  return (
    <section className="section-padding">
      <div className="max-w-5xl mx-auto">
        <BlurText
          text={t("headline")}
          tag="h2"
          className="text-3xl md:text-4xl font-display text-bone text-center mb-16"
          delay={70}
          duration={0.7}
        />

        <div className="grid lg:grid-cols-[auto_1fr] gap-8 lg:gap-12 items-center">
          {/* App Mockup - links */}
          <div
            ref={mockup.ref}
            style={mockup.style}
            className="hidden lg:flex justify-center"
          >
            <div className="relative w-[220px]">
              <Image
                src="/images/app-mockup.webp"
                alt="Cocktail X App"
                width={520}
                height={1040}
                className="w-full h-auto drop-shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
              />
              <p className="text-center text-xs font-body text-bone/55 mt-3">
                {t("appHint")}
              </p>
            </div>
          </div>

          {/* Steps grid */}
          <div ref={grid.ref} style={grid.style} className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {steps.map((step, i) => {
              const Icon = icons[i];
              return (
                <div
                  key={step.key}
                  className="border border-bone/10 rounded-2xl p-6 md:p-8 flex flex-col relative overflow-hidden
                    transition-all duration-300 ease-out
                    hover:border-bone/25 hover:bg-bone/[0.03] hover:shadow-[0_4px_30px_rgba(245,240,232,0.06)]
                    before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-tangerine before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl md:text-4xl font-display text-tangerine">
                      {step.number}
                    </span>
                    <Icon className="w-6 h-6 md:w-7 md:h-7 text-bone/30" />
                  </div>
                  <h3 className="text-base md:text-lg font-display font-bold text-bone mb-3">
                    {t(`${step.key}.title`)}
                  </h3>
                  <p className="text-sm font-body text-bone/80 leading-relaxed">
                    {t.rich(`${step.key}.description`, {
                      strong: (chunks) => (
                        <strong className="font-bold text-bone/80">{chunks}</strong>
                      ),
                    })}
                  </p>
                </div>
              );
            })}
          </div>

          {/* App Mockup - mobile only (unter den Schritten) */}
          <div className="flex lg:hidden justify-center mt-8">
            <div className="relative w-[140px]">
              <Image
                src="/images/app-mockup.webp"
                alt="Cocktail X App"
                width={520}
                height={1040}
                className="w-full h-auto drop-shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
              />
              <p className="text-center text-xs font-body text-bone/55 mt-3">
                {t("appHint")}
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="#tickets"
            className="btn-primary text-sm md:text-lg"
          >
            {t("cta")}
          </a>
        </div>
      </div>
    </section>
  );
}
