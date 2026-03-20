"use client";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";

export default function FounderPage() {
  const locale = useLocale() as "de" | "en";

  return (
    <main className="section-padding min-h-screen">
      <div className="max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-7xl font-display text-bone text-center mb-16"
        >
          FOUNDER
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col md:flex-row gap-10 items-start"
        >
          {/* Photo Placeholder */}
          <div className="w-full md:w-1/3 flex-shrink-0">
            <div className="aspect-[3/4] bg-bone/5 border border-bone/10 rounded-2xl flex items-center justify-center">
              <span className="text-6xl opacity-30">👤</span>
            </div>
          </div>

          {/* Bio */}
          <div className="flex-1">
            <h2 className="text-3xl font-display text-bone mb-1">
              Jennifer Mindl
            </h2>
            <p className="text-tangerine font-body mb-6">
              {locale === "de"
                ? "Gruenderin & Geschaeftsfuehrerin"
                : "Founder & CEO"}
            </p>
            <div className="text-bone/80 font-body text-lg leading-relaxed space-y-5">
              <p>
                {locale === "de"
                  ? "Jennifer Mindl gruendete Cocktail X mit der Vision, die Muenchner Cocktailkultur zu feiern und Bartender, Bars und Cocktail-Enthusiasten zusammenzubringen. Was als kleine Idee begann, ist heute Deutschlands groesstes Cocktail-Festival."
                  : "Jennifer Mindl founded Cocktail X with the vision of celebrating Munich's cocktail culture and bringing together bartenders, bars, and cocktail enthusiasts. What started as a small idea is now Germany's largest cocktail festival."}
              </p>
              <p>
                {locale === "de"
                  ? "Mit ihrem Hintergrund in der Gastronomie und ihrer Leidenschaft fuer kreative Drinks hat Jennifer ein Festival geschaffen, das nicht nur die besten Cocktails Muenchens praesentiert, sondern auch die Menschen dahinter ins Rampenlicht rueckt."
                  : "With her background in hospitality and her passion for creative drinks, Jennifer has created a festival that not only showcases Munich's best cocktails but also puts the spotlight on the people behind them."}
              </p>
              <p>
                {locale === "de"
                  ? "Heute leitet Jennifer ein wachsendes Team und arbeitet das ganze Jahr ueber daran, das Cocktail X Erlebnis fuer Besucher und teilnehmende Bars stetig zu verbessern."
                  : "Today, Jennifer leads a growing team and works year-round to continuously improve the Cocktail X experience for visitors and participating bars alike."}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
