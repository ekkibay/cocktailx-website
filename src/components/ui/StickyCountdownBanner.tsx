"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

const FESTIVAL_DATE = new Date("2026-05-13T19:00:00+02:00");

export default function StickyCountdownBanner() {
  const t = useTranslations("hero");
  const [visible, setVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    function calcTime() {
      const diff = FESTIVAL_DATE.getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    }

    setTimeLeft(calcTime());
    const interval = setInterval(() => setTimeLeft(calcTime()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.85);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50"
        >
          <div className="bg-licorice/95 backdrop-blur-md border-t border-bone/10">
            <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
              <span className="text-xs font-body font-bold text-bone/70 uppercase tracking-wider">
                13.–30. Mai 2026
              </span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-sm font-display tabular-nums">
                  <span className="text-tangerine">{pad(timeLeft.days)}</span>
                  <span className="text-bone/30">:</span>
                  <span className="text-tangerine">{pad(timeLeft.hours)}</span>
                  <span className="text-bone/30">:</span>
                  <span className="text-tangerine">{pad(timeLeft.minutes)}</span>
                  <span className="text-bone/30">:</span>
                  <span className="text-tangerine">{pad(timeLeft.seconds)}</span>
                </div>
                <span className="text-[10px] font-body text-bone/50 uppercase tracking-wider">
                  {t("days")} : {t("hours")} : {t("minutes")} : {t("seconds")}
                </span>
              </div>
              <a
                href="#tickets"
                className="text-xs font-body font-bold text-licorice bg-tangerine hover:bg-tangerine/90 px-4 py-1.5 rounded-full transition-colors"
              >
                {t("cta")}
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
