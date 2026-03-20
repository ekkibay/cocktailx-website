"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Countdown from "@/components/ui/Countdown";

const heroImages = [
  "/images/hero-bg.jpg.webp",
  "/images/Cocktail X_2.png",
  "/images/Cocktail X_3.png",
  "/images/Cocktail X_4.png",
  "/images/IMG_1063.jpg",
  "/images/L1030863_CocktailX_adriancamo.jpg",
  "/images/L1030894_CocktailX_adriancamo.jpg",
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
      <div className="absolute inset-0 bg-gradient-to-b from-licorice/80 via-licorice/90 to-licorice" />
      {/* Radial spotlight to isolate center content */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center 40%, transparent 0%, rgba(25,21,19,0.6) 70%)' }} />

      {/* Image Card behind text */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute top-[10%] md:top-[12%] lg:top-[14%] w-[160px] h-[210px] md:w-[220px] md:h-[280px] lg:w-[260px] lg:h-[330px]"
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={heroImages[currentIndex]}
              alt="Cocktail X Festival"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 300px, (max-width: 1024px) 400px, 480px"
              priority={currentIndex === 0}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <motion.span
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-3 md:mb-4 inline-block px-5 py-2 border-2 border-tangerine rounded-full text-sm md:text-base font-body text-tangerine tracking-[0.25em] uppercase font-bold"
        >
          {t("subtitle")}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-10 md:mb-14 text-6xl md:text-8xl lg:text-[10rem] font-display text-bone"
        >
          {t("title")}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-12 md:mb-16"
        >
          <Countdown onTick={nextSlide} />
        </motion.div>

        <motion.a
          href="#tickets"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="btn-primary text-xl md:text-2xl"
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
          className="text-bone/50"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </motion.div>
    </section>
  );
}
