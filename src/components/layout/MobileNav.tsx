"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { trackEvent } from "@/lib/meta-pixel";
import LanguageSwitcher from "./LanguageSwitcher";
import { navLinks } from "@/lib/nav";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const locale = useLocale();
  const t = useTranslations("nav");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-nav"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-licorice flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Decorative blurred shapes */}
          <div className="absolute top-20 -left-20 w-64 h-64 rounded-full bg-tangerine/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-32 -right-16 w-48 h-48 bg-hibiscus/20 blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-bone text-3xl hover:text-tangerine transition-colors"
            aria-label="Close navigation"
          >
            &#10005;
          </button>

          {/* Nav links */}
          <nav className="flex flex-col items-center gap-8">
            {navLinks.map((link, i) => (
              <motion.div
                key={link.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
              >
                <Link
                  href={`/${locale}${link.href}`}
                  onClick={onClose}
                  className="text-2xl font-display uppercase tracking-wider text-bone hover:text-tangerine transition-colors"
                >
                  {t(link.key)}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* CTA + Language switcher */}
          <div className="absolute bottom-12 flex flex-col items-center gap-6">
            <a
              href="https://cocktailx.app/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => { trackEvent("InitiateCheckout", { content_name: "Mobile Nav CTA", content_category: "Festival" }); onClose(); }}
              className="btn-primary text-sm uppercase tracking-wider"
            >
              {t("getPassport")}
            </a>
            <LanguageSwitcher />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
