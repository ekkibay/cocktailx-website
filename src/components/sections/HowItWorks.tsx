"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const steps = [
  {
    icon: "✦",
    bg: "bg-tangerine/10",
    border: "border-tangerine/30",
    iconColor: "text-tangerine",
    key: "step1" as const,
  },
  {
    icon: "◆",
    bg: "bg-hibiscus/10",
    border: "border-hibiscus/30",
    iconColor: "text-hibiscus",
    key: "step2" as const,
  },
  {
    icon: "●",
    bg: "bg-bay-of-many/10",
    border: "border-bay-of-many/30",
    iconColor: "text-bay-of-many",
    key: "step3" as const,
  },
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

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`${step.bg} border ${step.border} rounded-2xl p-8 text-center`}
            >
              <span className={`text-4xl ${step.iconColor}`}>{step.icon}</span>
              <p className="text-bone/40 text-sm font-body mt-4 mb-2">
                {t("stepLabel", { number: i + 1 })}
              </p>
              <p className="text-bone text-lg font-display">{t(step.key)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
