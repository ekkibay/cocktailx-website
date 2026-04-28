"use client";

import { sponsors } from "@/data/sponsors";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useReveal } from "@/hooks/useReveal";

// 2 copies is enough for a seamless loop with translateX(-50%)
const repeated = [...sponsors, ...sponsors];

export default function SponsorsMarquee() {
  const t = useTranslations("sponsors");
  const heading = useReveal<HTMLParagraphElement>();

  return (
    <section className="py-8 md:py-10 overflow-hidden">
      <p
        ref={heading.ref}
        style={heading.style}
        className="text-center text-bone/75 text-sm font-body uppercase tracking-wider mb-8"
      >
        {t("headline")}
      </p>
      <div className="relative">
        <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-licorice to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-licorice to-transparent z-10 pointer-events-none" />
        <div
          className="flex items-center animate-marquee-left"
          style={{ animationDuration: "120s", width: "max-content" }}
        >
          {repeated.map((sponsor, i) => (
            <a
              key={`${sponsor.id}-${i}`}
              href={sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 mx-4 opacity-80 hover:opacity-100 transition-opacity duration-300"
            >
              <div className="h-16 w-40 flex items-center justify-center overflow-hidden">
                <Image
                  src={sponsor.logo}
                  alt={sponsor.name}
                  width={sponsor.displayW}
                  height={sponsor.displayH}
                  loading="eager"
                  className="block flex-shrink-0"
                  style={{ width: sponsor.displayW, height: sponsor.displayH }}
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
