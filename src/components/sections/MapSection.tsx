"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

export default function MapSection() {
  const t = useTranslations("map");
  const locale = useLocale();

  return (
    <section className="section-padding">
      <div className="max-w-5xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-display text-bone mb-12"
        >
          {t("headline")}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl border border-bone/10 overflow-hidden"
        >
          <Image
            src="/map/munich-illustrated.svg"
            alt="Illustrated map of Munich showing Cocktail X bar locations"
            width={800}
            height={600}
            className="w-full h-auto"
          />
        </motion.div>

        <motion.a
          href={`/${locale}/festival/bars`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="btn-secondary inline-block mt-8"
        >
          {t("cta")}
        </motion.a>
      </div>
    </section>
  );
}
