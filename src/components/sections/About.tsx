"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

export default function About() {
  const t = useTranslations("about");

  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto">
        {/* Two-column grid */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-bone leading-tight">
              {t("headline")}
            </h2>
            <p className="mt-6 text-base md:text-lg font-body text-bone/70 leading-relaxed max-w-xl">
              {t("description")}
            </p>
            <a href="#tickets" className="btn-primary mt-8 inline-block">
              {t("cta")}
            </a>
          </motion.div>

          {/* Right: image placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative aspect-[4/3] rounded-2xl bg-jambalaya overflow-hidden"
          >
            <Image
              src="/images/L1030863_CocktailX_adriancamo.jpg"
              alt="About Cocktail X Festival"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-bone/10">
          <AnimatedCounter target={50} suffix="+" label={t("bars")} />
          <AnimatedCounter target={200} suffix="+" label={t("cocktails")} />
          <AnimatedCounter target={18} label={t("days")} />
          <AnimatedCounter target={1} label={t("passport")} />
        </div>
      </div>
    </section>
  );
}
