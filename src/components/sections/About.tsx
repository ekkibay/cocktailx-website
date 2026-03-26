"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import BlurText from "@/components/ui/BlurText";
import { useReveal } from "@/hooks/useReveal";

export default function About() {
  const t = useTranslations("about");
  const text = useReveal({ delay: 200 });
  const image = useReveal({ delay: 300, direction: "left" });
  const stats = useReveal({ delay: 150 });

  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto">
        {/* Two-column grid */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div>
            <BlurText
              text={t("headline")}
              tag="h2"
              className="text-4xl md:text-5xl lg:text-6xl font-display text-bone leading-tight"
              delay={80}
              duration={0.7}
            />
            <div
              ref={text.ref}
              style={text.style}
            >
              <div className="mt-4 flex items-center gap-3">
                <span className="text-xs font-body font-bold text-tangerine bg-tangerine/10 px-3 py-1 rounded-full">
                  {t("edition")}
                </span>
                <span className="text-xs font-body font-bold text-bone/50 bg-bone/5 px-3 py-1 rounded-full">
                  {t("visitors")}
                </span>
              </div>
              <p className="mt-4 text-base md:text-lg font-body text-bone/70 leading-relaxed max-w-xl">
                {t("description")}
              </p>
              <a
                href="#tickets"
                className="btn-primary mt-8 inline-block"
              >
                {t("cta")}
              </a>
            </div>
          </div>

          {/* Right: video placeholder */}
          <div
            ref={image.ref}
            style={image.style}
            className="relative aspect-[4/3] rounded-2xl bg-jambalaya overflow-hidden group cursor-pointer"
          >
            <Image
              src="/images/festival-cheers.webp"
              alt="About Cocktail X Festival"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              loading="lazy"
              className="object-cover ken-burns"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />
            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-tangerine/90 group-hover:bg-tangerine group-hover:scale-110 transition-all duration-300 flex items-center justify-center shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
                <svg
                  className="w-7 h-7 md:w-8 md:h-8 text-licorice ml-1"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            {/* Label */}
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <span className="text-xs font-body text-bone/70 bg-licorice/60 backdrop-blur-sm px-3 py-1 rounded-full">
                {t("videoLabel")}
              </span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div
          ref={stats.ref}
          style={stats.style}
          className="flex flex-wrap justify-center gap-8 md:gap-12 mt-16 pt-16 border-t border-bone/10 [&>div]:w-[calc(33%-1.5rem)] [&>div]:sm:w-auto"
        >
          <AnimatedCounter target={50} suffix="+" label={t("bars")} />
          <AnimatedCounter target={200} suffix="+" label={t("cocktails")} />
          <AnimatedCounter target={18} label={t("days")} />
          <AnimatedCounter target={1} label={t("passport")} />
          <AnimatedCounter target={8000} suffix="+" label={t("expectedGuests")} />
        </div>
      </div>
    </section>
  );
}
