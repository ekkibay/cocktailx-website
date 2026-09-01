"use client";

import { useState } from "react";
import type { FaqItem } from "@/config/onice";
import { pick, type Locale } from "@/i18n/bilingual";

export default function FaqAccordion({ items, locale }: { items: FaqItem[]; locale: Locale }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="border-t border-hairline">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q.de} className="border-b border-hairline">
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="w-full flex items-start gap-5 py-5 text-left group"
              >
                <span className="flex-1 font-body font-bold text-base md:text-lg text-bone group-hover:text-tangerine transition-colors">
                  {pick(item.q, locale)}
                </span>
                <span
                  aria-hidden
                  className={`mt-1 flex-shrink-0 text-tangerine text-xl leading-none transition-transform duration-300 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
            </h3>
            {/* Antwort bleibt im DOM, damit sie ohne JavaScript und fuer Suchmaschinen
                lesbar ist. Zugeklappt wird nur visuell. */}
            <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <p className="font-body text-sm md:text-base text-muted leading-relaxed pb-6 pr-8 max-w-2xl">
                  {pick(item.a, locale)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
