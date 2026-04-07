"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
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
        {/* Brand switcher strip */}
        <div className="border-b border-bone/[0.06] bg-licorice/30 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 md:px-8 flex items-center gap-1.5 py-1.5 justify-start">
            <span className="text-xs font-body font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full bg-tangerine/15 text-bone border border-tangerine/30">
              cocktail ✦ festival
            </span>
            <span className="text-bone/20 text-sm">·</span>
            <Link
              href={`/${locale}/catering`}
              className="text-xs font-body font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full text-bone/45 hover:text-bone/75 transition-colors"
            >
              cocktail ✦ catering
            </Link>
          </div>
        </div>
        <div className="mx-auto flex items-center justify-between px-4 py-4 md:px-8 lg:px-16 relative">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="block"
          >
            <Image
              src="/images/logo-festival-white.png"
              alt="Cocktail X Festival"
              width={160}
              height={40}
              className="h-9 md:h-11 w-auto"
              priority
            />
          </Link>

          {/* Desktop nav — centered absolutely */}
          <nav className="hidden lg:flex items-center gap-6 lg:gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={`/${locale}${link.href}`}
                className="text-sm uppercase tracking-wider text-bone/85 hover:text-bone transition-colors font-body font-bold nav-link-hover"
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>

          {/* Desktop right */}
          <div className="hidden lg:flex items-center gap-6">
            <LanguageSwitcher />
            <a
              href="#tickets"
              className="btn-secondary text-xs uppercase tracking-wider"
            >
              {t("getPassport")}
            </a>
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
