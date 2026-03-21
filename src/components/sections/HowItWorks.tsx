"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

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

  return (
    <section className="section-padding">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-display text-bone text-center mb-16"
        >
          {t("headline")}
        </motion.h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {steps.map((step, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="border border-bone/10 rounded-2xl p-6 md:p-8 flex flex-col"
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
                <p className="text-sm font-body text-bone/60 leading-relaxed">
                  {t.rich(`${step.key}.description`, {
                    strong: (chunks) => (
                      <strong className="font-bold text-bone/80">{chunks}</strong>
                    ),
                  })}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
