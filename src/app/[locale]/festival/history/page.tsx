"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import Image from "next/image";

const years = ["2023", "2024", "2025"] as const;
type Year = (typeof years)[number];

const historyData: Record<
  Year,
  {
    stats: { label: { de: string; en: string }; value: string }[];
    highlights: { de: string; en: string };
    images: string[];
  }
> = {
  "2023": {
    stats: [
      { label: { de: "Bars", en: "Bars" }, value: "25" },
      { label: { de: "Besucher", en: "Visitors" }, value: "800+" },
      { label: { de: "Tage", en: "Days" }, value: "10" },
    ],
    highlights: {
      de: "Das erste Cocktail X Festival feierte 2023 seine Premiere in München. Was als mutige Idee begann, wurde schnell zum Stadtgespräch. 25 handverlesene Bars boten einzigartige Kreationen, und die Münchner Cocktailszene fand eine neue Heimat.",
      en: "The first Cocktail X Festival celebrated its premiere in München in 2023. What started as a bold idea quickly became the talk of the town. 25 hand-picked bars offered unique creations, and München's cocktail scene found a new home.",
    },
    images: [
      "/images/placeholder/bar-1.svg",
      "/images/placeholder/bar-2.svg",
      "/images/placeholder/bar-3.svg",
      "/images/placeholder/cocktail-1.svg",
      "/images/placeholder/cocktail-2.svg",
      "/images/placeholder/cocktail-3.svg",
    ],
  },
  "2024": {
    stats: [
      { label: { de: "Bars", en: "Bars" }, value: "40" },
      { label: { de: "Besucher", en: "Visitors" }, value: "1.500+" },
      { label: { de: "Tage", en: "Days" }, value: "14" },
    ],
    highlights: {
      de: "2024 wurde das Festival größer, lauter und besser. 40 Bars, ein erweitertes Programm mit Masterclasses und die erste Awards-Verleihung machten es zum kulturellen Highlight des Münchner Sommers. Der Stempelpass wurde zur Kultjagd.",
      en: "In 2024, the festival grew bigger, louder, and better. 40 bars, an expanded program with masterclasses, and the first awards ceremony made it the cultural highlight of München's summer. The stamp pass became a cult chase.",
    },
    images: [
      "/images/placeholder/bar-4.svg",
      "/images/placeholder/bar-5.svg",
      "/images/placeholder/bar-6.svg",
      "/images/placeholder/event-1.svg",
      "/images/placeholder/event-2.svg",
      "/images/placeholder/event-3.svg",
    ],
  },
  "2025": {
    stats: [
      { label: { de: "Bars", en: "Bars" }, value: "45" },
      { label: { de: "Besucher", en: "Visitors" }, value: "2.500" },
      { label: { de: "Tage", en: "Days" }, value: "18" },
    ],
    highlights: {
      de: "Das dritte Jahr brachte internationale Aufmerksamkeit. Mit 45 teilnehmenden Bars und 2.500 Gästen wurde München zur aufstrebenden Hauptstadt der deutschen Cocktailkultur.",
      en: "The third year brought international attention. With 45 participating bars and 2,500 guests, München established itself as the rising capital of German cocktail culture.",
    },
    images: [
      "/images/placeholder/bar-1.svg",
      "/images/placeholder/bar-3.svg",
      "/images/placeholder/bar-5.svg",
      "/images/placeholder/cocktail-1.svg",
      "/images/placeholder/event-1.svg",
      "/images/placeholder/about.svg",
    ],
  },
};

export default function HistoryPage() {
  const locale = useLocale() as "de" | "en";
  const [activeYear, setActiveYear] = useState<Year>("2025");
  const data = historyData[activeYear];

  return (
    <main className="section-padding relative">
      {/* CI background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        <div style={{ position:"absolute", inset:0, backgroundImage:"url(/images/pattern-bg.svg)", backgroundSize:"200px 200px", backgroundRepeat:"repeat", opacity:0.18 }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(25,21,19,0.55) 0%, rgba(25,21,19,0.2) 25%, rgba(25,21,19,0.2) 75%, rgba(25,21,19,0.7) 100%)" }} />
        <div style={{ position:"absolute", top:"-200px", right:"-200px", width:"600px", height:"600px", borderRadius:"50%", background:"rgba(243,146,0,0.12)", filter:"blur(120px)" }} />
        <div style={{ position:"absolute", top:"30%", left:"-200px", width:"500px", height:"500px", borderRadius:"50%", background:"rgba(189,37,110,0.10)", filter:"blur(110px)" }} />
      </div>
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl lg:text-7xl font-display text-bone text-center mb-12"
        >
          HISTORY
        </motion.h1>

        {/* Year Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center gap-8 mb-16"
        >
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setActiveYear(year)}
              className={`relative text-2xl md:text-3xl font-display transition-colors duration-200 pb-2 ${
                activeYear === year
                  ? "text-tangerine"
                  : "text-bone/65 hover:text-bone/85"
              }`}
            >
              {year}
              {activeYear === year && (
                <motion.div
                  layoutId="year-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-tangerine"
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* Year Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeYear}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {data.stats.map((stat) => (
                <div
                  key={stat.label.en}
                  className="text-center p-6 rounded-2xl bg-jambalaya/20 border border-bone/5"
                >
                  <p className="text-3xl md:text-4xl font-display text-tangerine">
                    {stat.value}
                  </p>
                  <p className="text-sm font-body text-bone/80 mt-2">
                    {stat.label[locale]}
                  </p>
                </div>
              ))}
            </div>

            {/* Highlights Text */}
            <p className="text-base md:text-lg font-body text-bone/85 leading-relaxed text-center max-w-3xl mx-auto mb-12">
              {data.highlights[locale]}
            </p>

            {/* Photo Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.images.map((img, i) => (
                <motion.div
                  key={img + i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="relative aspect-video rounded-xl overflow-hidden"
                >
                  <Image
                    src={img}
                    alt={`${activeYear} gallery ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                    className="object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
