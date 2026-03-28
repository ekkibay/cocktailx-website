"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";

const socialLinks = [
  { label: "Instagram", abbr: "IG", url: "https://www.instagram.com/cocktailxfestival" },
  { label: "LinkedIn", abbr: "LI", url: "https://www.linkedin.com/company/cocktailx" },
];

export default function CateringFooter() {
  const locale = useLocale();

  return (
    <footer className="bg-licorice border-t border-white/[0.06] pb-20 md:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 lg:px-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Image
              src="/images/logo-catering-white.png"
              alt="Cocktail X Catering"
              width={140}
              height={36}
              className="h-7 w-auto object-contain mb-4 opacity-85"
            />
            <p className="text-xs font-body text-ct-cream/55 leading-relaxed mb-4">
              {locale === "de"
                ? "Premium Cocktail Catering für Corporate Events & Messen in München."
                : "Premium cocktail catering for corporate events & trade fairs in Munich."}
            </p>
            <p className="text-xs font-body text-ct-cream/40 leading-relaxed">
              München · 015255709985
              <br />
              info@cocktail-x.com
            </p>
          </div>

          {/* Leistungen */}
          <div>
            <h4 className="font-display text-sm text-ct-cream/50 mb-4 uppercase tracking-wider">
              {locale === "de" ? "Leistungen" : "Services"}
            </h4>
            <ul className="space-y-2">
              {[
                { de: "Messe-Catering", en: "Trade Fair Catering", href: "/catering#messe" },
                { de: "Corporate Events", en: "Corporate Events", href: "/catering#corporate" },
                { de: "Kontakt", en: "Contact", href: "/catering/kontakt" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={`/${locale}${item.href}`} className="text-sm text-ct-cream/65 hover:text-ct-cream transition-colors font-body">
                    {locale === "de" ? item.de : item.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display text-sm text-ct-cream/50 mb-4 uppercase tracking-wider">
              {locale === "de" ? "Unternehmen" : "Company"}
            </h4>
            <ul className="space-y-2">
              {[
                { de: "Über uns", en: "About us", href: "/catering/ueber-uns" },
                { de: "Jobs", en: "Jobs", href: "/catering/kontakt" },
                { de: "Festival", en: "Festival", href: "/" },
              ].map((item) => (
                <li key={item.de}>
                  <Link href={`/${locale}${item.href}`} className="text-sm text-ct-cream/65 hover:text-ct-cream transition-colors font-body">
                    {locale === "de" ? item.de : item.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display text-sm text-ct-cream/50 mb-4 uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2">
              {[
                { de: "Datenschutz", en: "Privacy", href: "/catering/legal/datenschutz" },
                { de: "AGBs", en: "Terms", href: "/catering/legal/agb" },
                { de: "Impressum", en: "Imprint", href: "/catering/legal/impressum" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={`/${locale}${item.href}`} className="text-sm text-ct-cream/65 hover:text-ct-cream transition-colors font-body">
                    {locale === "de" ? item.de : item.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-white/[0.06] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <p className="text-xs text-ct-cream/40 font-body">
              © {new Date().getFullYear()} Cocktail X Catering · Bay und Co. GmbH
            </p>
            <span className="text-ct-cream/15">·</span>
            <p className="text-xs text-ct-cream/40 font-body">
              {locale === "de" ? "Nur für Personen ab 18 Jahren" : "For persons 18+ only"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.abbr}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-sm text-ct-cream/65 hover:text-ct-cream transition-colors font-display"
              >
                {social.abbr}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
