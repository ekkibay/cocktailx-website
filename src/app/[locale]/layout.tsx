import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import PlausibleProvider from "next-plausible";
import { routing } from "@/i18n/routing";
import LayoutShell from "@/components/layout/LayoutShell";
import AntiFlicker from "@/components/layout/AntiFlicker";
import MetaPixel from "@/components/MetaPixel";
import CookieConsent from "@/components/ui/CookieConsent";
import "../globals.css";

export const metadata: Metadata = {
  // Gilt fuer jede Seite, die keinen eigenen Titel setzt: Browser-Tab,
  // Suchergebnis und Social-Vorschau. Stand vorher noch auf dem Sommerfestival
  // 2027 samt 19-Euro-Preis, waehrend die Seite ON ICE verkauft.
  metadataBase: new URL("https://cocktail-x.com"),
  title: {
    default: "COCKTAIL X ON ICE '26 | 17. bis 28. November, München",
    template: "%s | Cocktail X",
  },
  description:
    "Zwölf Nächte, über 40 Bars, ein Pass. 17. bis 28. November 2026 in München. In jeder Bar ein Signature Drink, freigeschaltet über die App.",
  openGraph: {
    title: "COCKTAIL X ON ICE '26",
    description: "12 Nächte. 40+ Bars. Ein Pass. 17. bis 28. November 2026 in München.",
    url: "https://cocktail-x.com",
    siteName: "Cocktail X",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "COCKTAIL X ON ICE '26",
    description: "12 Nächte. 40+ Bars. Ein Pass. 17. bis 28. November 2026 in München.",
  },
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
    // Kein hartcodierter Hintergrund mehr: der Grund kommt aus dem Farbklima
    // (--c-ground in globals.css), damit ON ICE und Catering je ihren eigenen haben.
    <html lang={locale} className="bg-licorice" suppressHydrationWarning>
      <head>
        <PlausibleProvider src="https://plausible.io/js/pa--lifWsX4RN6e3RueZzv8O.js" />
        <AntiFlicker />
      </head>
      <body className="antialiased bg-licorice">
        {/*
          Kein noscript-Pixel mehr. Der feuerte einen PageView an Meta, bevor
          irgendeine Einwilligung vorlag, und ohne JavaScript lässt sich eine
          Einwilligung technisch nicht abfragen. Damit war er nicht zulässig.
        */}
        <NextIntlClientProvider messages={messages}>
          <MetaPixel />
          <CookieConsent />
          <LayoutShell>{children}</LayoutShell>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
