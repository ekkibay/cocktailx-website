"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Countdown from "@/components/ui/Countdown";

const heroImages = [
  "/images/L1030894_CocktailX_adriancamo.webp",     // Pinker Cocktail, dramatisches Licht
  "/images/L1030863_CocktailX_adriancamo.webp",     // Verschiedene Cocktails auf Tablett
  "/images/festival-lounge.webp",                    // Lounge mit Flaschen, warmes Licht
  "/images/IMG_1063.webp",                           // Cocktails Flatlay auf Silbertablett
  "/images/festival-cocktails-duo.webp",             // Zwei elegante Cocktails an der Bar
  "/images/festival-bottles.webp",                   // Premium Flaschen Regal
];

export default function Hero() {
  const t = useTranslations("hero");
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % heroImages.length);
  }, []);


  return (
    <section className="relative h-screen overflow-hidden flex items-center justify-center">
      {/* Pattern Background */}
      <div className="absolute inset-0" style={{ backgroundImage: 'url(/images/pattern-bg.svg)', backgroundSize: '200px 200px', backgroundRepeat: 'repeat' }} />
      {/* Darken overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-licorice/70 via-licorice/80 to-licorice" />
      {/* Linear overlay to further darken center */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-licorice/60 to-transparent" />

      {/* Image Card behind text */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute top-[10%] md:top-[12%] lg:top-[14%] w-[180px] h-[240px] md:w-[250px] md:h-[330px] lg:w-[290px] lg:h-[380px] opacity-70 z-[5]"
      >
        {heroImages.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-500 ease-in-out"
            style={{ opacity: i === currentIndex ? 1 : 0 }}
          >
            <Image
              src={src}
              alt="Cocktail X Festival"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 300px, (max-width: 1024px) 400px, 480px"
              priority
            />
          </div>
        ))}
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Badge */}
        <motion.span
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 md:mb-10 inline-block px-4 py-1.5 border border-tangerine/60 rounded-full text-xs md:text-sm font-body text-tangerine tracking-[0.25em] uppercase font-bold backdrop-blur-md bg-licorice/60"
        >
          {t("subtitle")}
        </motion.span>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-4 md:mb-6 text-6xl md:text-8xl lg:text-[10rem] font-display text-bone"
        >
          {t("title")}
        </motion.h1>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mb-6 md:mb-8"
        >
          <Countdown onTick={nextSlide} />
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-6 md:mb-10 max-w-lg text-base md:text-lg font-body text-bone/85 leading-relaxed font-bold"
        >
          {t("subheadline")}
        </motion.p>

        {/* CTA */}
        <motion.a
          href="#tickets"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="btn-primary text-sm md:text-lg whitespace-nowrap"
        >
          {t("cta")}
        </motion.a>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-bone/65"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </motion.div>
    </section>
  );
}
