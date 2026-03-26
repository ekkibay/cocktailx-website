"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { pressLogos } from "@/data/sponsors";
import { useReveal } from "@/hooks/useReveal";

export default function PressQuotes() {
  const t = useTranslations("press");
  const container = useReveal();
  const logos = useReveal({ delay: 100 });
  return (
    <section className="py-16 border-y border-bone/5">
      <div className="max-w-5xl mx-auto px-4">
        <div
          ref={container.ref}
          style={container.style}
          className="flex flex-col items-center gap-8"
        >
          <p className="text-bone/30 text-sm font-body uppercase tracking-wider">
            {t("asSeenIn")}
          </p>
          <div ref={logos.ref} style={logos.style} className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {pressLogos.map((press) => (
              <div
                key={press.id}
                className="opacity-40 hover:opacity-80 grayscale hover:grayscale-0 transition-all duration-300"
              >
                <Image
                  src={press.logo}
                  alt={press.name}
                  width={120}
                  height={40}
                  className="h-8 md:h-10 w-auto object-contain invert"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
