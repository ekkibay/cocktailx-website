"use client";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import Image from "next/image";

const content = {
  story: {
    de: [
      "Cocktail X wurde aus der Überzeugung geboren, dass München mehr ist als Bier und Brezn. Es ist eine Stadt mit einer pulsierenden, weltoffenen Bar-Kultur, die nur darauf wartet, entdeckt zu werden.",
      "Inspiriert von der goldenen Ära der italienischen Aperitivo-Kultur und dem rauen Charme der Münchner Nächte, entstand 2023 die Idee zu einem Festival, das beides vereint: La Dolce Vita trifft auf bayerische Gemütlichkeit.",
      "Was als kleines Experiment mit 25 Bars begann, ist heute Münchens größtes Cocktail-Festival. Jedes Jahr verwandeln wir die Stadt in eine einzige große Bar-Tour, bei der jeder Drink eine Geschichte erzählt und jede Bar ein neues Kapitel aufschlägt.",
    ],
    en: [
      "Cocktail X was born from the conviction that Munich is more than beer and pretzels. It's a city with a vibrant, cosmopolitan bar culture just waiting to be discovered.",
      "Inspired by the golden era of Italian aperitivo culture and the raw charm of Munich nights, the idea for a festival that combines both emerged in 2023: La Dolce Vita meets Bavarian Gemütlichkeit.",
      "What started as a small experiment with 25 bars is now Munich's biggest cocktail festival. Every year, we transform the city into one grand bar tour, where every drink tells a story and every bar opens a new chapter.",
    ],
  },
  mission: {
    de: "Unsere Mission ist es, die Cocktailkultur Münchens zu feiern, neue Talente zu fördern und Menschen durch die Kunst des Mixens zusammenzubringen. Jeder Schluck soll ein Erlebnis sein.",
    en: "Our mission is to celebrate Munich's cocktail culture, nurture new talent, and bring people together through the art of mixing. Every sip should be an experience.",
  },
  founder: {
    name: "Max Mustermann",
    role: { de: "Gründer & Creative Director", en: "Founder & Creative Director" },
    image: "/images/placeholder/founder.svg",
  },
};

export default function AboutPage() {
  const locale = useLocale() as "de" | "en";

  return (
    <main className="section-padding">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl lg:text-7xl font-display text-bone text-center mb-16"
        >
          ABOUT US
        </motion.h1>

        {/* Brand Story */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-2xl md:text-3xl font-display text-tangerine mb-8">
            {locale === "de" ? "UNSERE GESCHICHTE" : "OUR STORY"}
          </h2>
          <div className="space-y-6">
            {content.story[locale].map((paragraph, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-base md:text-lg font-body text-bone/70 leading-relaxed"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 p-8 md:p-12 rounded-2xl bg-jambalaya/20 border border-bone/10 text-center"
        >
          <h2 className="text-2xl md:text-3xl font-display text-bone mb-6">
            {locale === "de" ? "UNSERE MISSION" : "OUR MISSION"}
          </h2>
          <p className="text-lg md:text-xl font-body text-bone/80 leading-relaxed italic">
            &ldquo;{content.mission[locale]}&rdquo;
          </p>
        </motion.div>

        {/* Team / Founder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-display text-tangerine mb-10 text-center">
            {locale === "de" ? "DAS TEAM" : "THE TEAM"}
          </h2>
          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-40 h-40 md:w-52 md:h-52 rounded-2xl overflow-hidden border-2 border-bone/10">
                <Image
                  src={content.founder.image}
                  alt={content.founder.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-display text-bone">
                {content.founder.name}
              </h3>
              <p className="text-sm font-body text-bone/50">
                {content.founder.role[locale]}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
