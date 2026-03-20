"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileNav from "./MobileNav";

const navLinks = [
  { key: "festival", href: "/festival" },
  { key: "awards", href: "/awards" },
  { key: "app", href: "/app" },
  { key: "shop", href: "/shop" },
  { key: "blog", href: "/blog" },
] as const;

export default function Header() {
  const locale = useLocale();
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
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
            cocktail &#10022; festival
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={`/${locale}${link.href}`}
                className="text-xs uppercase tracking-wider text-bone/70 hover:text-bone transition-colors font-display"
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-6">
            <LanguageSwitcher />
            <Link
              href={`/${locale}/tickets`}
              className="btn-primary text-xs uppercase tracking-wider"
            >
              {t("getPassport")}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-bone text-2xl"
            aria-label="Open navigation"
          >
            &#9776;
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
