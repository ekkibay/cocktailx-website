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
          {repeated.map((sponsor, i) => {
            const boosted = sponsor.id === "rauch" || sponsor.id === "bergkristall";
            const box = boosted ? { width: 240, height: 88 } : { width: 144, height: 48 };
            return (
              <a
                key={`${sponsor.id}-${i}`}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 mx-12 opacity-80 hover:opacity-100 transition-opacity duration-300"
              >
                <div
                  className="flex items-center justify-center"
                  style={box}
                >
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    width={sponsor.displayW}
                    height={sponsor.displayH}
                    loading="eager"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      width: "auto",
                      height: "auto",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
