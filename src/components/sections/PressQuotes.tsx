"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const quotes = [
  {
    text: "Cocktail X is redefining what a cocktail festival can be. Munich has never tasted this good.",
    author: "Simone Caporale",
    role: "World-renowned bartender",
  },
  {
    text: "A passport to the best bars in the city — this is the future of cocktail culture.",
    author: "Alex Kratena",
    role: "Co-founder of Tayēr + Elementary",
  },
];

const pressLogos = ["Süddeutsche Zeitung", "ARD", "Mit Vergnügen"];

export default function PressQuotes() {
  const t = useTranslations("press");
  return (
    <section className="section-padding">
      <div className="max-w-5xl mx-auto">
        {/* Quotes */}
        <div className="grid md:grid-cols-2 gap-16 mb-20">
          {quotes.map((quote, i) => (
            <motion.blockquote
              key={quote.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <p className="italic text-2xl md:text-3xl text-bone/80 font-body leading-relaxed mb-6">
                &ldquo;{quote.text}&rdquo;
              </p>
              <footer>
                <cite className="not-italic font-display text-tangerine text-lg">
                  {quote.author}
                </cite>
                <p className="text-bone/40 text-sm font-body mt-1">
                  {quote.role}
                </p>
              </footer>
            </motion.blockquote>
          ))}
        </div>

        {/* Press logos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-12 pt-12 border-t border-bone/10"
        >
          <p className="text-bone/30 text-sm font-body uppercase tracking-wider">
            {t("asSeenIn")}
          </p>
          {pressLogos.map((name) => (
            <span
              key={name}
              className="text-bone/30 text-lg font-display hover:text-bone/60 transition-colors"
            >
              {name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
