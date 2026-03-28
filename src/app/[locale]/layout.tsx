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
        <NextIntlClientProvider messages={messages}>
          <MetaPixel />
          <LayoutShell>{children}</LayoutShell>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
