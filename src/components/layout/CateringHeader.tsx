"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";

const navLinks = [
  { key: "leistungen", href: "/catering/leistungen", de: "Leistungen", en: "Services" },
  { key: "events", href: "/catering/events", de: "Events", en: "Events" },
  { key: "ueber-uns", href: "/catering/ueber-uns", de: "Über uns", en: "About" },
  { key: "kontakt", href: "/catering/kontakt", de: "Kontakt", en: "Contact" },
];

export default function CateringHeader() {
  const locale = useLocale();
  const pathname = usePathname();
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
          scrolled ? "bg-black/90 backdrop-blur-md border-b border-ct-green/20" : "bg-transparent"
        }`}
      >
        {/* Brand switcher strip */}
        <div className="border-b border-ct-green/15 bg-black/40 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 md:px-8 flex items-center gap-1.5 py-1.5 justify-start">
            <Link
              href={`/${locale}`}
              className="text-xs font-body font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full text-ct-cream/50 hover:text-ct-cream/80 transition-colors"
            >
              cocktail ✦ festival
            </Link>
            <span className="text-ct-cream/20 text-sm">·</span>
            <span className="text-xs font-body font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full bg-ct-green/20 text-ct-cream border border-ct-green/40">
              cocktail ✦ catering
            </span>
          </div>
        </div>

        <div className="mx-auto flex items-center justify-between px-4 py-3 md:px-8 lg:px-16">
          {/* Logo */}
          <Link href={`/${locale}/catering`} className="flex items-center">
            <Image
              src="/images/logo-catering-white.png"
              alt="Cocktail X Catering"
              width={160}
              height={40}
              className="h-8 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={`/${locale}${link.href}`}
                className={`text-sm uppercase tracking-wider font-body font-bold transition-colors ${
                  pathname.includes(link.href)
                    ? "text-ct-cream"
                    : "text-ct-cream/70 hover:text-ct-cream"
                }`}
              >
                {locale === "de" ? link.de : link.en}
              </Link>
            ))}
          </nav>

          {/* Desktop right */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href={`/${locale === "de" ? "en" : "de"}/catering`}
              className="text-xs uppercase tracking-wider text-ct-cream/65 hover:text-ct-cream transition-colors font-body font-bold"
            >
              {locale === "de" ? "EN" : "DE"}
            </Link>
            <Link
              href={`/${locale}/catering/kontakt`}
              className="text-xs uppercase tracking-wider px-5 py-2 rounded-full border border-ct-green text-ct-cream hover:bg-ct-green transition-all duration-200 font-body font-bold"
            >
              {locale === "de" ? "Anfrage" : "Enquire"}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 -mr-2"
            aria-label="Open navigation"
          >
            <svg width="22" height="14" viewBox="0 0 22 14" fill="none" className="text-ct-cream/80">
              <line x1="0" y1="1" x2="22" y2="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="6" y1="7" x2="22" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="0" y1="13" x2="22" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-black/95 backdrop-blur-xl border-b border-ct-green/20 px-4 pb-6 pt-2">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={`/${locale}${link.href}`}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm uppercase tracking-wider font-body font-bold text-ct-cream/80 hover:text-ct-cream transition-colors py-1"
                >
                  {locale === "de" ? link.de : link.en}
                </Link>
              ))}
              <Link
                href={`/${locale}/catering/kontakt`}
                onClick={() => setMobileOpen(false)}
                className="mt-2 text-xs uppercase tracking-wider px-5 py-2.5 rounded-full border border-ct-green text-ct-cream text-center font-body font-bold"
              >
                {locale === "de" ? "Anfrage stellen" : "Send Enquiry"}
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
