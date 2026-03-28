"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "next-intl";
import BlurText from "@/components/ui/BlurText";
import { useReveal } from "@/hooks/useReveal";

const categories = [
  {
    title: { de: "Beste Bar", en: "Best Bar" },
    description: {
      de: "Auszeichnung für die herausragendste Bar Münchens.",
      en: "Award for the most outstanding bar in München.",
    },
    accent: "tangerine",
    bg: "bg-tangerine/10",
    border: "border-tangerine/30",
    icon: "🏆",
  },
  {
    title: { de: "Bester Cocktail", en: "Best Cocktail" },
    description: {
      de: "Der kreativste und geschmackvollste Cocktail des Festivals.",
      en: "The most creative and flavorful cocktail of the festival.",
    },
    accent: "hibiscus",
    bg: "bg-hibiscus/10",
    border: "border-hibiscus/30",
    icon: "🍸",
  },
  {
    title: { de: "Beste Neue Bar", en: "Best New Bar" },
    description: {
      de: "Die aufregendste Neueröffnung in der Münchner Barszene.",
      en: "The most exciting new opening in München's bar scene.",
    },
    accent: "everglade",
    bg: "bg-everglade/10",
    border: "border-everglade/30",
    icon: "⭐",
  },
];

function CategoryCard({ cat, index, locale }: { cat: typeof categories[0]; index: number; locale: "de" | "en" }) {
  const reveal = useReveal({ delay: index * 150 });
  return (
    <div
      ref={reveal.ref}
      style={reveal.style}
      className={`${cat.bg} border ${cat.border} rounded-2xl p-8 text-center`}
    >
      <span className="text-5xl">{cat.icon}</span>
      <h3 className="text-2xl font-display text-bone mt-4 mb-3">
        {cat.title[locale]}
      </h3>
      <p className="text-bone/60 font-body">
        {cat.description[locale]}
      </p>
    </div>
  );
}

export default function AwardsPage() {
  const locale = useLocale() as "de" | "en";
  const revealSubtitle = useReveal<HTMLParagraphElement>({ delay: 200 });
  const revealCategoriesTitle = useReveal();
  const revealCta = useReveal();

  return (
    <main>
      {/* Hero */}
      <section className="relative bg-licorice section-padding flex flex-col items-center justify-center text-center min-h-[60vh]">
        <Image
          src="/images/festival-bartender-pour.webp"
          alt="Cocktail X Awards"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-licorice/60 via-licorice/70 to-licorice" />
        <div className="relative z-10">
          <BlurText
            text="COCKTAIL X AWARDS"
            tag="h1"
            className="text-5xl md:text-7xl lg:text-8xl font-display text-bone"
            delay={80}
            duration={0.7}
          />
          <p
            ref={revealSubtitle.ref}
            style={revealSubtitle.style}
            className="text-lg md:text-xl font-body text-bone/70 mt-6 max-w-2xl mx-auto"
          >
            {locale === "de"
              ? "Die prestigeträchtigsten Auszeichnungen der Münchner Cocktail-Szene."
              : "The most prestigious awards in München's cocktail scene."}
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto">
          <h2
            ref={revealCategoriesTitle.ref}
            style={revealCategoriesTitle.style}
            className="text-3xl md:text-4xl font-display text-bone text-center mb-16"
          >
            {locale === "de" ? "KATEGORIEN" : "CATEGORIES"}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((cat, i) => (
              <CategoryCard key={cat.title.en} cat={cat} index={i} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding text-center">
        <div
          ref={revealCta.ref}
          style={revealCta.style}
        >
          <h2 className="text-3xl md:text-4xl font-display text-bone mb-6">
            {locale === "de" ? "JETZT ABSTIMMEN" : "VOTE NOW"}
          </h2>
          <p className="text-bone/60 font-body max-w-xl mx-auto mb-8">
            {locale === "de"
              ? "Stimme für deine Lieblingsbars und Cocktails ab und hilf uns, die besten der Besten zu küren."
              : "Vote for your favorite bars and cocktails and help us crown the best of the best."}
          </p>
          <Link href={`/${locale}/awards/history`} className="btn-primary text-lg">
            {locale === "de" ? "VERGANGENE GEWINNER" : "PAST WINNERS"}
          </Link>
        </div>
      </section>
    </main>
  );
}
