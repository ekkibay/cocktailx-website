"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileNav from "./MobileNav";
import { navLinks } from "@/lib/nav";

export default function Header() {
  const locale = useLocale();
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-licorice/90 backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex items-center justify-between px-4 py-4 md:px-8 lg:px-16">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="font-display text-lg md:text-xl text-bone whitespace-nowrap"
          >
            cocktail{" "}<svg viewBox="0 0 100 100" className="inline-block w-[0.85em] h-[0.85em] align-middle relative -top-[0.03em]" fill="currentColor"><path d="M50 0 C52 38, 62 48, 100 50 C62 52, 52 62, 50 100 C48 62, 38 52, 0 50 C38 48, 48 38, 50 0Z" /></svg>{" "}festival
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={`/${locale}${link.href}`}
                className="text-sm uppercase tracking-wider text-bone/70 hover:text-bone transition-colors font-body font-bold nav-link-hover"
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>

          {/* Desktop right */}
          <div className="hidden lg:flex items-center gap-6">
            <LanguageSwitcher />
            <Link
              href="#tickets"
              className="btn-secondary text-xs uppercase tracking-wider"
            >
              {t("getPassport")}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 -mr-2"
            aria-label="Open navigation"
          >
            <svg width="22" height="14" viewBox="0 0 22 14" fill="none" className="text-bone/80">
              <line x1="0" y1="1" x2="22" y2="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="6" y1="7" x2="22" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="0" y1="13" x2="22" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
