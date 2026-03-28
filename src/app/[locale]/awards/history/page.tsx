"use client";

import { useLocale } from "next-intl";
import Image from "next/image";
import BlurText from "@/components/ui/BlurText";
import { useReveal } from "@/hooks/useReveal";

const winners = [
  {
    category: { de: "Beste Bar", en: "Best Bar" },
    name: "Goldene Bar",
    bar: "Haus der Kunst",
    accent: "tangerine",
    bg: "bg-tangerine/10",
    border: "border-tangerine/30",
    image: "/images/bars/goldene-bar.webp",
  },
  {
    category: { de: "Bester Cocktail", en: "Best Cocktail" },
    name: "Munich Mule Reimagined",
    bar: "Zephyr Bar",
    accent: "hibiscus",
    bg: "bg-hibiscus/10",
    border: "border-hibiscus/30",
    image: "/images/bars/zephyr-bar.webp",
  },
  {
    category: { de: "Beste Neue Bar", en: "Best New Bar" },
    name: "The Alchemist",
    bar: "Maxvorstadt",
    accent: "everglade",
    bg: "bg-everglade/10",
    border: "border-everglade/30",
    image: "/images/festival-cocktails-duo.webp",
  },
];

function WinnerCard({ winner, index, locale }: { winner: typeof winners[0]; index: number; locale: "de" | "en" }) {
  const reveal = useReveal({ delay: index * 150 });
  return (
    <div
      ref={reveal.ref}
      style={reveal.style}
      className={`${winner.bg} border ${winner.border} rounded-2xl overflow-hidden`}
    >
      <div className="relative aspect-[4/3]">
        <Image
          src={winner.image}
          alt={winner.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          loading="lazy"
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <p className="text-sm font-body text-bone/55 uppercase tracking-wider mb-2">
          {winner.category[locale]}
        </p>
        <h3 className="text-2xl font-display text-bone mb-1">
          {winner.name}
        </h3>
        <p className="text-bone/80 font-body">{winner.bar}</p>
      </div>
    </div>
  );
}

export default function AwardsHistoryPage() {
  const locale = useLocale() as "de" | "en";
  const revealSubtitle = useReveal<HTMLParagraphElement>({ delay: 200 });

  return (
    <main>
      {/* Hero */}
      <section className="relative bg-licorice section-padding flex flex-col items-center justify-center text-center min-h-[50vh]">
        <div className="absolute inset-0 bg-gradient-to-b from-jambalaya/20 via-licorice to-licorice" />
        <div className="relative z-10">
          <BlurText
            text="AWARDS 2025"
            tag="h1"
            className="text-5xl md:text-7xl lg:text-8xl font-display text-bone"
            delay={80}
            duration={0.7}
          />
          <p
            ref={revealSubtitle.ref}
            style={revealSubtitle.style}
            className="text-lg md:text-xl font-body text-bone/85 mt-6 max-w-2xl mx-auto"
          >
            {locale === "de"
              ? "Die Gewinner der Cocktail X Awards 2025."
              : "The winners of the Cocktail X Awards 2025."}
          </p>
        </div>
      </section>

      {/* Winners Showcase */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {winners.map((winner, i) => (
            <WinnerCard key={winner.name} winner={winner} index={i} locale={locale} />
          ))}
        </div>
      </section>
    </main>
  );
}
