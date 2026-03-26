"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import BlurText from "@/components/ui/BlurText";
import { useReveal } from "@/hooks/useReveal";

const faqKeys = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9"] as const;

export default function FAQ() {
  const t = useTranslations("faq");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const items = useReveal({ delay: 200 });

  return (
    <section className="section-padding">
      <div className="max-w-3xl mx-auto">
        <BlurText
          text={t("headline")}
          tag="h2"
          className="text-3xl md:text-4xl font-display text-bone text-center mb-12"
          delay={70}
          duration={0.7}
        />

        <div ref={items.ref} style={items.style} className="space-y-3">
          {faqKeys.map((key, i) => {
            const isOpen = openIndex === i;
            const answerKey = key.replace("q", "a") as `a${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`;

            return (
              <div
                key={key}
                className="border border-bone/10 rounded-xl overflow-hidden transition-all duration-300 ease-out hover:border-bone/20 hover:bg-bone/[0.02]"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left transition-colors duration-200 hover:bg-bone/[0.03] rounded-xl"
                >
                  <span className="text-sm md:text-base font-body font-bold text-bone pr-4">
                    {t(key)}
                  </span>
                  <span className={`text-tangerine text-xl flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-45" : "rotate-0"}`}>
                    +
                  </span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm font-body text-bone/60 leading-relaxed">
                        {t(answerKey)}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
