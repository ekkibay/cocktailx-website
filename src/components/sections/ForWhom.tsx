"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Wine, Users, Heart, Compass } from "lucide-react";
import BlurText from "@/components/ui/BlurText";
import { useReveal } from "@/hooks/useReveal";

const useCases = [
  { key: "cocktailLovers", Icon: Wine, image: "/images/festival-cocktails-duo.webp" },
  { key: "friends", Icon: Users, image: "/images/festival-friends.webp" },
  { key: "dateNight", Icon: Heart, image: "/images/festival-lounge.webp" },
  { key: "explorers", Icon: Compass, image: "/images/festival-bar-scene.webp" },
] as const;

export default function ForWhom() {
  const t = useTranslations("forWhom");
  const subtitle = useReveal<HTMLParagraphElement>({ delay: 150 });
  const cards = useReveal({ delay: 250 });

  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-4">
        <BlurText
          text={t("headline")}
          tag="h2"
          className="text-3xl md:text-4xl font-display text-bone text-center mb-4"
          delay={70}
          duration={0.7}
        />

        <p
          ref={subtitle.ref}
          style={subtitle.style}
          className="text-center text-sm md:text-base font-body text-bone/60 mb-16"
        >
          {t("subheadline")}
        </p>

        <div ref={cards.ref} style={cards.style} className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {useCases.map(({ key, Icon, image }) => (
            <div
              key={key}
              className="flex flex-col rounded-2xl border border-bone/10 bg-licorice/50 overflow-hidden
                transition-all duration-300 ease-out
                hover:border-bone/25 hover:bg-bone/[0.03] hover:shadow-[0_4px_30px_rgba(245,240,232,0.06)]
                relative
                before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-tangerine before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 before:z-10"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={image}
                  alt={t(`${key}.title`)}
                  fill
                  sizes="(max-width: 640px) 45vw, 250px"
                  loading="lazy"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-licorice/80 to-transparent" />
              </div>
              {/* Content */}
              <div className="flex flex-col items-center text-center p-4 md:p-6">
                <div className="w-10 h-10 rounded-full bg-tangerine/10 flex items-center justify-center mb-3 -mt-8 relative z-10 border-2 border-licorice">
                  <Icon className="w-5 h-5 text-tangerine" />
                </div>
                <h3 className="text-sm md:text-base font-display text-bone mb-2">
                  {t(`${key}.title`)}
                </h3>
                <p className="text-xs font-body text-bone/60 leading-relaxed">
                  {t(`${key}.description`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
