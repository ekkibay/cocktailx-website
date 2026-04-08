import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import LayoutShell from "@/components/layout/LayoutShell";
import AntiFlicker from "@/components/layout/AntiFlicker";
import MetaPixel from "@/components/MetaPixel";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "Cocktail X Festival | München 2026",
    template: "%s | Cocktail X Festival",
  },
  description:
    "Deutschlands größtes Cocktail Festival – München, 13.–30. Mai 2026. 58 Bars, 174+ exklusive Cocktails, 18 Tage Festival.",
  ...(process.env.META_DOMAIN_VERIFICATION && {
    other: {
      "facebook-domain-verification": process.env.META_DOMAIN_VERIFICATION,
    },
  }),
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} style={{ backgroundColor: "#1A120B" }} suppressHydrationWarning>
      <head>
        <AntiFlicker />
      </head>
      <body className="antialiased" style={{ backgroundColor: "#1A120B" }}>
        {/* Meta Pixel noscript fallback — tracks PageView for users without JS */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1475856023819696&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <NextIntlClientProvider messages={messages}>
          <MetaPixel />
          <LayoutShell>{children}</LayoutShell>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}