"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { TICKET_TIERS } from "@/data/ticket-tiers";

const FESTIVAL_DATE = new Date("2026-05-13T19:00:00+02:00");
const EB_END_DAYS = 42;
const REG_END_DAYS = 13;

function getActiveTier() {
  const now = new Date();
  const ebEnd = new Date(FESTIVAL_DATE); ebEnd.setDate(ebEnd.getDate() - EB_END_DAYS);
  const regEnd = new Date(FESTIVAL_DATE); regEnd.setDate(regEnd.getDate() - REG_END_DAYS);
  const daysUntil = (d: Date) => Math.max(0, Math.ceil((d.getTime() - now.getTime()) / 86_400_000));

  if (now < ebEnd) return { key: "earlyBird" as const, price: TICKET_TIERS.earlyBird, daysLeft: daysUntil(ebEnd) };
  if (now < regEnd) return { key: "regular" as const, price: TICKET_TIERS.regular, daysLeft: daysUntil(regEnd) };
  return { key: "late" as const, price: TICKET_TIERS.late, daysLeft: 0 };
}

export default function StickyCTA() {
  const t = useTranslations("stickyCta");
  const locale = useLocale();
  const [visible, setVisible] = useState(false);
  const tier = useMemo(getActiveTier, []);

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

  const subHint =
    tier.key === "late"
      ? locale === "de" ? "Festival startet bald" : "Festival starts soon"
      : tier.key === "earlyBird"
      ? locale === "de" ? `Noch ${tier.daysLeft} Tage zum Early-Bird-Preis` : `${tier.daysLeft} days at Early Bird`
      : locale === "de" ? `Noch ${tier.daysLeft} Tage zum Vorverkaufspreis` : `${tier.daysLeft} days at pre-sale`;

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
          <div className="bg-licorice/95 backdrop-blur-md border-t border-bone/10 px-4 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-body text-bone/65">{t("label")}</span>
                <span className="text-2xl font-display text-tangerine leading-none">€{tier.price}</span>
              </div>
              <p className="text-[11px] font-body text-bone/55 mt-0.5 flex items-center gap-1.5 truncate">
                <span className="inline-block w-1 h-1 rounded-full bg-tangerine animate-pulse shrink-0" />
                {subHint}
              </p>
            </div>
            <a
              href={`/${locale}/shop`}
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
