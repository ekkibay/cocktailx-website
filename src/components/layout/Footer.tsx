import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

const socialLinks = [
  {
    label: "Instagram",
    abbr: "IG",
    url: "https://www.instagram.com/cocktailxfestival",
  },
  {
    label: "TikTok",
    abbr: "TT",
    url: "https://www.tiktok.com/@cocktailxfestival",
  },
  {
    label: "Facebook",
    abbr: "FB",
    url: "https://www.facebook.com/profile.php?id=100090270165472",
  },
  {
    label: "LinkedIn",
    abbr: "LI",
    url: "https://www.linkedin.com/company/cocktailx",
  },
];

export default function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();

  return (
    <footer className="bg-licorice border-t border-bone/10 pb-20 md:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 lg:px-16">
        {/* Column grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
          {/* CONNECT */}
          <div>
            <h4 className="font-display text-sm text-tangerine mb-4">
              {t("connect")}
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://cocktailx.app/sponsor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-bone/60 hover:text-bone transition-colors"
                >
                  {t("becomeSponsor")}
                </a>
              </li>
              <li>
                <a
                  href="https://cocktailx.app/bar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-bone/60 hover:text-bone transition-colors"
                >
                  {t("becomeBar")}
                </a>
              </li>
              <li>
                <a
                  href="https://cocktailx.app/guest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-bone/60 hover:text-bone transition-colors"
                >
                  {t("becomeGuest")}
                </a>
              </li>
              <li>
                <Link
                  href={`/${locale}/excelerator`}
                  className="text-sm text-bone/60 hover:text-bone transition-colors"
                >
                  {t("becomeExcelerator")}
                </Link>
              </li>
            </ul>
          </div>

          {/* EVENTS */}
          <div>
            <h4 className="font-display text-sm text-tangerine mb-4">
              {t("events")}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}/festival/events`}
                  className="text-sm text-bone/60 hover:text-bone transition-colors"
                >
                  {t("grandOpening")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/festival/events`}
                  className="text-sm text-bone/60 hover:text-bone transition-colors"
                >
                  {t("closingAwards")}
                </Link>
              </li>
            </ul>
          </div>

          {/* APP */}
          <div>
            <h4 className="font-display text-sm text-tangerine mb-4">
              {t("app")}
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://my.cocktail-x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-bone/60 hover:text-bone transition-colors"
                >
                  {t("login")}
                </a>
              </li>
            </ul>
          </div>

          {/* ABOUT US */}
          <div>
            <h4 className="font-display text-sm text-tangerine mb-4">
              {t("aboutUs")}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}/catering`}
                  className="text-sm text-bone/60 hover:text-bone transition-colors"
                >
                  {t("catering")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/founder`}
                  className="text-sm text-bone/60 hover:text-bone transition-colors"
                >
                  {t("founder")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/contact`}
                  className="text-sm text-bone/60 hover:text-bone transition-colors"
                >
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h4 className="font-display text-sm text-tangerine mb-4">
              {t("legal")}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}/legal/datenschutz`}
                  className="text-sm text-bone/60 hover:text-bone transition-colors"
                >
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/legal/cookies`}
                  className="text-sm text-bone/60 hover:text-bone transition-colors"
                >
                  {t("cookies")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/legal/impressum`}
                  className="text-sm text-bone/60 hover:text-bone transition-colors"
                >
                  {t("imprint")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-bone/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <p className="text-sm text-bone/40">{t("copyright")}</p>
            <span className="text-bone/20">·</span>
            <p className="text-sm text-bone/40">{t("ageNotice")}</p>
          </div>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.abbr}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-sm text-bone/60 hover:text-tangerine transition-colors font-display"
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
