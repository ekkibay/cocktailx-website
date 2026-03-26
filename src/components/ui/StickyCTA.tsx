"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

export default function StickyCTA() {
  const t = useTranslations("stickyCta");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past the hero
      const pastHero = window.scrollY > window.innerHeight * 0.9;
      // Hide when near the tickets section
      const ticketsEl = document.getElementById("tickets");
      let nearTickets = false;
      if (ticketsEl) {
        const rect = ticketsEl.getBoundingClientRect();
        nearTickets = rect.top < window.innerHeight && rect.bottom > 0;
      }
      setVisible(pastHero && !nearTickets);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        >
          <div className="bg-licorice/95 backdrop-blur-md border-t border-bone/10 px-4 py-3 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-body text-bone/60">{t("label")}</span>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-display text-bone/30 line-through">€25</span>
                <span className="text-2xl font-display text-tangerine">€16</span>
              </div>
            </div>
            <a
              href="#tickets"
              className="btn-primary text-sm whitespace-nowrap px-6 py-3"
            >
              {t("cta")}
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
