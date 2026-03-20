"use client";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";

const winners = [
  {
    category: { de: "Beste Bar", en: "Best Bar" },
    name: "Goldene Bar",
    bar: "Haus der Kunst",
    accent: "tangerine",
    bg: "bg-tangerine/10",
    border: "border-tangerine/30",
  },
  {
    category: { de: "Bester Cocktail", en: "Best Cocktail" },
    name: "Munich Mule Reimagined",
    bar: "Zephyr Bar",
    accent: "hibiscus",
    bg: "bg-hibiscus/10",
    border: "border-hibiscus/30",
  },
  {
    category: { de: "Beste Neue Bar", en: "Best New Bar" },
    name: "The Alchemist",
    bar: "Maxvorstadt",
    accent: "everglade",
    bg: "bg-everglade/10",
    border: "border-everglade/30",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.15 },
  }),
};

export default function AwardsHistoryPage() {
  const locale = useLocale() as "de" | "en";

  return (
    <main>
      {/* Hero */}
      <section className="relative bg-licorice section-padding flex flex-col items-center justify-center text-center min-h-[50vh]">
        <div className="absolute inset-0 bg-gradient-to-b from-jambalaya/20 via-licorice to-licorice" />
        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display text-bone"
          >
            AWARDS 2025
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl font-body text-bone/70 mt-6 max-w-2xl mx-auto"
          >
            {locale === "de"
              ? "Die Gewinner der Cocktail X Awards 2025."
              : "The winners of the Cocktail X Awards 2025."}
          </motion.p>
        </div>
      </section>

      {/* Winners Showcase */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {winners.map((winner, i) => (
            <motion.div
              key={winner.name}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              className={`${winner.bg} border ${winner.border} rounded-2xl overflow-hidden`}
            >
              {/* Placeholder Image */}
              <div className="aspect-[4/3] bg-bone/5 flex items-center justify-center">
                <span className="text-6xl opacity-30">🏆</span>
              </div>
              <div className="p-6">
                <p className="text-sm font-body text-bone/40 uppercase tracking-wider mb-2">
                  {winner.category[locale]}
                </p>
                <h3 className="text-2xl font-display text-bone mb-1">
                  {winner.name}
                </h3>
                <p className="text-bone/60 font-body">{winner.bar}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
