"use client";

import { useTranslations } from "next-intl";
import { useReveal } from "@/hooks/useReveal";
import { TICKET_TIERS } from "@/data/ticket-tiers";

const stats = [
  { key: "bars", value: "58" },
  { key: "days", value: "18" },
  { key: "ticket", value: "1" },
  { key: "price", value: `${TICKET_TIERS.cheapest}\u20ac` },
  { key: "savings", value: "\u00d8 60\u20ac" },
] as const;

export default function StatsBar() {
  const t = useTranslations("statsBar");
  const reveal = useReveal({ delay: 100 });

  return (
    <section className="py-8 md:py-10 border-y border-bone/10 bg-licorice/50">
      <div
        ref={reveal.ref}
        style={reveal.style}
        className="max-w-5xl mx-auto px-4 flex flex-wrap justify-center gap-6 md:gap-10"
      >
        {stats.map((stat, i) => (
          <div key={stat.key} className="flex items-center gap-2 md:gap-3">
            <span className="text-2xl md:text-3xl font-display text-tangerine">
              {stat.value}
            </span>
            <span className="text-xs md:text-sm font-body text-bone/70 uppercase tracking-wider">
              {t(stat.key)}
            </span>
            {i < stats.length - 1 && (
              <span className="hidden md:inline text-bone/15 ml-4 md:ml-6">|</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
