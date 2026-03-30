"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import BlurText from "@/components/ui/BlurText";
import { useReveal } from "@/hooks/useReveal";

const GALLERY_IMAGES = [
  { src: "/images/festival-cocktails-duo.webp", alt: "Cocktail close-up" },
  { src: "/images/festival-friends.webp", alt: "Festival atmosphere" },
  { src: "/images/festival-bar-scene.webp", alt: "Bar ambiance" },
  { src: "/images/festival-laugh.webp", alt: "Festival guests" },
  { src: "/images/festival-lounge.webp", alt: "Festival lounge" },
  { src: "/images/L1030863_CocktailX_adriancamo.webp", alt: "Bartenders crafting" },
  { src: "/images/festival-bartenders.webp", alt: "Bartender at work" },
  { src: "/images/L1030894_CocktailX_adriancamo.webp", alt: "Festival night vibes" },
];

export default function FestivalGallery() {
  const t = useTranslations("gallery");
  const stats = useReveal({ delay: 200 });
  const cta = useReveal({ delay: 300 });
  const grid = useReveal({ delay: 250 });

  return (
    <section id="gallery" className="section-padding">
      <div className="max-w-7xl mx-auto">
        {/* Headline */}
        <div className="text-center mb-8">
          <p className="text-xs font-body font-bold text-tangerine uppercase tracking-widest mb-4">
            {t("badge")}
          </p>
          <BlurText
            text={t("headline")}
            tag="h2"
            className="text-4xl md:text-5xl lg:text-6xl font-display text-bone text-center"
            delay={80}
            duration={0.7}
          />
          <div ref={cta.ref} style={cta.style}>
            <p className="mt-4 text-base md:text-lg font-body text-bone/80 max-w-2xl mx-auto">
              {t("subheadline")}
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div
          ref={stats.ref}
          style={stats.style}
          className="grid grid-cols-3 gap-6 md:gap-12 mb-16 pt-8 pb-8 border-y border-bone/10"
        >
          <AnimatedCounter target={2500} label={t("statGuests")} />
          <AnimatedCounter target={45} label={t("statBars")} />
          <AnimatedCounter target={26000} label={t("statCocktails")} />
        </div>

        {/* Gallery grid — 2 Reihen, abwechselnd groß/klein */}
        <div ref={grid.ref} style={grid.style} className="space-y-3 md:space-y-4">
          {/* Row 1: 1 large + 2 small */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            <div className="col-span-2 md:col-span-1 aspect-[4/3] md:aspect-[3/4] relative rounded-2xl overflow-hidden group bg-jambalaya">
              <Image src={GALLERY_IMAGES[0].src} alt={GALLERY_IMAGES[0].alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="aspect-[4/3] relative rounded-2xl overflow-hidden group bg-jambalaya">
              <Image src={GALLERY_IMAGES[1].src} alt={GALLERY_IMAGES[1].alt} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="aspect-[4/3] relative rounded-2xl overflow-hidden group bg-jambalaya">
              <Image src={GALLERY_IMAGES[2].src} alt={GALLERY_IMAGES[2].alt} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          </div>

          {/* Row 2: 2 small + 1 large */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            <div className="aspect-[4/3] relative rounded-2xl overflow-hidden group bg-jambalaya">
              <Image src={GALLERY_IMAGES[3].src} alt={GALLERY_IMAGES[3].alt} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="aspect-[4/3] relative rounded-2xl overflow-hidden group bg-jambalaya">
              <Image src={GALLERY_IMAGES[4].src} alt={GALLERY_IMAGES[4].alt} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="col-span-2 md:col-span-1 aspect-[4/3] md:aspect-[3/4] relative rounded-2xl overflow-hidden group bg-jambalaya">
              <Image src={GALLERY_IMAGES[5].src} alt={GALLERY_IMAGES[5].alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          </div>

          {/* Row 3: 2 wide — smaller */}
          <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-4xl mx-auto">
            <div className="aspect-[16/9] relative rounded-2xl overflow-hidden group bg-jambalaya">
              <Image src={GALLERY_IMAGES[6].src} alt={GALLERY_IMAGES[6].alt} fill sizes="40vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="aspect-[16/9] relative rounded-2xl overflow-hidden group bg-jambalaya">
              <Image src={GALLERY_IMAGES[7].src} alt={GALLERY_IMAGES[7].alt} fill sizes="40vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
