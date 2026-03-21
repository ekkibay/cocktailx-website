"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { bars } from "@/data/bars";

export default function BarsSlider() {
  const locale = useLocale() as "de" | "en";
  const t = useTranslations("barsSlider");
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  return (
    <section ref={containerRef} className="section-padding overflow-hidden">
      <div className="max-w-7xl mx-auto mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl lg:text-7xl font-display text-bone"
        >
          {t("headline")}
        </motion.h2>
      </div>

      <motion.div style={{ x }} className="flex gap-6 pl-4 md:pl-8 lg:pl-16">
        {bars.map((bar, i) => (
          <motion.div
            key={bar.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group flex-shrink-0 w-[300px] md:w-[400px] aspect-[3/4] rounded-2xl overflow-hidden bg-jambalaya relative cursor-pointer"
          >
            {/* Image */}
            <Image
              src={bar.image}
              alt={bar.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-licorice via-licorice/40 to-transparent" />

            {/* Content revealed on hover */}
            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="text-2xl font-display text-bone">{bar.name}</h3>
              <p className="text-sm font-body text-tangerine mt-1">
                {bar.signatureCocktail}
              </p>
              <p className="text-sm font-body text-bone/60 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {bar.description[locale]}
              </p>
            </div>
          </motion.div>
        ))}

        {/* Teaser Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: bars.length * 0.1 }}
          className="flex-shrink-0 w-[300px] md:w-[400px] aspect-[3/4] rounded-2xl overflow-hidden relative border border-bone/10 bg-licorice/50 backdrop-blur-md flex flex-col items-center justify-center text-center p-8"
        >
          <span className="text-6xl md:text-8xl font-display text-tangerine">50+</span>
          <span className="text-lg md:text-xl font-display text-bone mt-2">{t("teaserTitle")}</span>
          <p className="text-sm font-body text-bone/60 mt-4">{t("teaserText")}</p>
          <Link
            href={`/${locale}/festival`}
            className="btn-primary mt-6 text-sm"
          >
            {t("teaserCta")}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
