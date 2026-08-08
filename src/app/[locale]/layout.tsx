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
  title: {
    default: "Cocktail X Festival | München 2027, Early Bird",
    template: "%s | Cocktail X Festival",
  },
  description:
    "Deutschlands größtes Cocktail Festival kommt 05. bis 22. Mai 2027 zurück nach München. Sichere dir jetzt das Early-Bird-Ticket für 19 € statt 34 €, 60+ Bars, 60+ exklusive Signature Cocktails, 18 Tage Festival.",
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