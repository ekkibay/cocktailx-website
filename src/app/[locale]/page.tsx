"use client";

import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("hero");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-licorice text-bone">
      <h1 className="font-display text-5xl md:text-7xl tracking-wider">
        {t("title")}
      </h1>
      <p className="mt-4 text-lg md:text-xl tracking-widest text-bone/70">
        {t("subtitle")}
      </p>
    </main>
  );
}
