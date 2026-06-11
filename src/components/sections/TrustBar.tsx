"use client";

import { useLocale } from "next-intl";
import { useReveal } from "@/hooks/useReveal";

export default function TrustBar() {
  const locale = useLocale();
  const reveal = useReveal({ delay: 100 });

  const items = [
    {
      label: locale === "de" ? "4. Ausgabe" : "4th edition",
      sub: locale === "de" ? "Seit 2022" : "Since 2022",
    },
    {
      label: locale === "de" ? "3.500+ Gäste" : "3,500+ guests",
      sub: locale === "de" ? "zuletzt" : "last edition",
    },
    {
      label: "60+ Bars",
      sub: locale === "de" ? "in München" : "in Munich",
    },
    {
      label: "18 Tage",
      sub: locale === "de" ? "jedes Festival" : "every festival",
    },
  ];

  return (
    <section className="py-6 md:py-8 border-y border-bone/10 bg-licorice/60 backdrop-blur-sm">
      <div
        ref={reveal.ref}
        style={reveal.style}
        className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4"
      >
        {items.map((item, i) => (
          <div key={i} className="text-center">
            <div className="font-display text-xl md:text-2xl text-tangerine leading-none mb-1">
              {item.label}
            </div>
            <div className="text-[10px] md:text-xs font-body text-bone/55 uppercase tracking-wider">
              {item.sub}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
