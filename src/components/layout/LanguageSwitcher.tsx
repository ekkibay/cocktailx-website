"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(newLocale: string) {
    // Replace the locale segment in the current path
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  }

  return (
    <div className="flex items-center gap-2 text-sm font-display">
      <button
        onClick={() => switchLocale("de")}
        className={
          locale === "de"
            ? "text-tangerine"
            : "text-bone/65 hover:text-bone transition-colors"
        }
      >
        DE
      </button>
      <span className="text-bone/30">|</span>
      <button
        onClick={() => switchLocale("en")}
        className={
          locale === "en"
            ? "text-tangerine"
            : "text-bone/65 hover:text-bone transition-colors"
        }
      >
        EN
      </button>
    </div>
  );
}
