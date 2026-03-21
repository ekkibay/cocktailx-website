import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/layout/PageTransition";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "Cocktail X Festival | München 2026",
    template: "%s | Cocktail X Festival",
  },
  description:
    "Deutschlands größtes Cocktail Festival – München, 13.–30. Mai 2026. 50+ Bars, 200+ exklusive Cocktails, 18 Tage Festival.",
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
    <html lang={locale}>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <PageTransition>{children}</PageTransition>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
