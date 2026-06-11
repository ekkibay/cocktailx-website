"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import {
  EARLY_BIRD_PRICE,
  ANCHOR_PRICE,
  EARLY_BIRD_CONTINGENT,
} from "@/data/ticket-tiers";

const CONSENT_KEY = "meta_pixel_consent";

export default function StickyCTA() {
  const t = useTranslations("stickyCta");
  const locale = useLocale();
  const [visible, setVisible] = useState(false);
  // While the cookie banner is open we lift the bar so the two don't overlap.
  const [cookieOpen, setCookieOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const pastHero = window.scrollY > window.innerHeight * 0.9;
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

  useEffect(() => {
    const sync = () => setCookieOpen(localStorage.getItem(CONSENT_KEY) === null);
    sync();
    window.addEventListener("cc:resolved", sync);
    return () => window.removeEventListener("cc:resolved", sync);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`fixed left-0 right-0 z-40 md:hidden transition-[bottom] duration-300 ${
            cookieOpen ? "bottom-[148px]" : "bottom-0"
          }`}
        >
          <div className="bg-licorice/95 backdrop-blur-md border-t border-bone/10 px-4 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-body text-bone/65">{t("label")}</span>
                <span className="text-2xl font-display text-tangerine leading-none">€{EARLY_BIRD_PRICE}</span>
                <span className="text-sm font-display text-bone/40 line-through leading-none">€{ANCHOR_PRICE}</span>
              </div>
              <p className="text-[11px] font-body text-bone/55 mt-0.5 flex items-center gap-1.5 truncate">
                <span className="inline-block w-1 h-1 rounded-full bg-tangerine shrink-0" />
                {t("scarcity", { count: EARLY_BIRD_CONTINGENT })}
              </p>
            </div>
            <a
              href={`/${locale}/shop#passport`}
              className="btn-primary text-sm whitespace-nowrap px-5 py-3 shrink-0"
            >
              {t("cta")}
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
