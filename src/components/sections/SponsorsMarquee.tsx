"use client";

import { sponsors } from "@/data/sponsors";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useReveal } from "@/hooks/useReveal";

// 4 copies for seamless loop
const repeated = [...sponsors, ...sponsors, ...sponsors, ...sponsors];

export default function SponsorsMarquee() {
  const t = useTranslations("sponsors");
  const heading = useReveal<HTMLParagraphElement>();

  return (
    <section className="py-12 md:py-16 overflow-hidden">
      <p
        ref={heading.ref}
        style={heading.style}
        className="text-center text-bone/55 text-sm font-body uppercase tracking-wider mb-8"
      >
        {t("headline")}
      </p>
      <div className="relative">
        <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-licorice to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-licorice to-transparent z-10 pointer-events-none" />
        <div
          className="flex animate-marquee-left"
          style={{ animationDuration: "30s", width: "max-content" }}
        >
          {repeated.map((sponsor, i) => (
            <a
              key={`${sponsor.id}-${i}`}
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 mx-5 md:mx-12 opacity-65 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300"
            >
              <Image
                src={sponsor.logo}
                alt={sponsor.name}
                width={140}
                height={56}
                className="h-7 md:h-14 w-auto object-contain invert"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
