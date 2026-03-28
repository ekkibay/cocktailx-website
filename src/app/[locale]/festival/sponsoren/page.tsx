"use client";

import Image from "next/image";
import { sponsors } from "@/data/sponsors";
import BlurText from "@/components/ui/BlurText";
import { useReveal } from "@/hooks/useReveal";

const mainPartners = sponsors.filter((s) => s.tier === "platinum");
const partners = sponsors.filter((s) => s.tier === "gold" || s.tier === "silver");

function SponsorCard({ sponsor, index, size }: { sponsor: typeof sponsors[0]; index: number; size: "large" | "small" }) {
  const reveal = useReveal<HTMLAnchorElement>({ delay: index * 100 });
  const isLarge = size === "large";
  return (
    <a
      ref={reveal.ref}
      style={reveal.style}
      href={sponsor.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex flex-col items-center ${isLarge ? "gap-4 p-8" : "gap-3 p-6"} rounded-2xl bg-licorice border border-bone/10 transition-all duration-300 hover:-translate-y-1 hover:border-tangerine/30`}
    >
      <div className={`relative ${isLarge ? "w-40 h-40" : "w-28 h-28"}`}>
        <Image
          src={sponsor.logo}
          alt={sponsor.name}
          fill
          sizes={isLarge ? "160px" : "112px"}
          loading="lazy"
          className="object-contain"
        />
      </div>
      <span className={`${isLarge ? "text-lg" : "text-base"} font-display text-bone group-hover:text-tangerine transition-colors`}>
        {sponsor.name}
      </span>
    </a>
  );
}

export default function SponsorenPage() {
  const revealMainSection = useReveal();
  const revealPartnersSection = useReveal();

  return (
    <main className="section-padding">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <BlurText
          text="SPONSOREN"
          tag="h1"
          className="text-4xl md:text-6xl lg:text-7xl font-display text-bone text-center mb-16"
          delay={80}
          duration={0.7}
        />

        {/* Main Partners */}
        <div ref={revealMainSection.ref} style={revealMainSection.style}>
          <h2 className="text-2xl md:text-3xl font-display text-tangerine text-center mb-10">
            MAIN PARTNERS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-20">
            {mainPartners.map((sponsor, i) => (
              <SponsorCard key={sponsor.id} sponsor={sponsor} index={i} size="large" />
            ))}
          </div>
        </div>

        {/* Partners */}
        <div ref={revealPartnersSection.ref} style={revealPartnersSection.style}>
          <h2 className="text-2xl md:text-3xl font-display text-bone/85 text-center mb-10">
            PARTNERS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {partners.map((sponsor, i) => (
              <SponsorCard key={sponsor.id} sponsor={sponsor} index={i} size="small" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
