"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useReveal } from "@/hooks/useReveal";

export default function FoundersBanner() {
  const t = useTranslations("founders");
  const locale = useLocale();
  const reveal = useReveal({ delay: 200 });

  return (
    <section className="py-16 md:py-20">
      <div
        ref={reveal.ref}
        style={reveal.style}
        className="max-w-5xl mx-auto px-4"
      >
        <div className="rounded-2xl border border-bone/10 bg-bone/[0.03] overflow-hidden">
          <div className="grid md:grid-cols-[300px,1fr] gap-0">
            {/* Photo */}
            <div className="relative aspect-[3/2] md:aspect-auto">
              <Image
                src="/images/founders.jpg"
                alt="Ekkehard Bay & Vincent Kerger"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 300px"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-licorice/30 hidden md:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-licorice/60 to-transparent md:hidden" />
            </div>

            {/* Text */}
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <span className="text-[10px] font-body font-bold uppercase tracking-[0.2em] text-tangerine mb-2">
                {t("badge")}
              </span>
              <h3 className="text-xl md:text-2xl font-display text-bone mb-3">
                {t("headline")}
              </h3>
              <p className="text-sm font-body text-bone/75 leading-relaxed mb-5">
                {t("description")}
              </p>
              <Link
                href={`/${locale}/about/founder`}
                className="text-sm font-body font-bold text-tangerine hover:text-tangerine/80 transition-colors inline-flex items-center gap-1.5"
              >
                {t("cta")}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
