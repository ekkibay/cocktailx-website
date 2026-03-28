"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { bars } from "@/data/bars";
import BlurText from "@/components/ui/BlurText";

function BarCard({ bar, locale, compact }: { bar: typeof bars[0]; locale: "de" | "en"; compact?: boolean }) {
  return (
    <div
      className={`group flex-shrink-0 ${compact ? "w-[140px] sm:w-[180px]" : "md:w-[400px]"} aspect-[3/4] rounded-2xl overflow-hidden bg-jambalaya relative cursor-pointer border border-transparent transition-all duration-300 ease-out hover:border-bone/15 hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)]`}
    >
      <Image
        src={bar.image}
        alt={bar.name}
        fill
        sizes="(max-width: 640px) 40vw, 250px"
        loading="lazy"
        className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-30"
      />
      {/* Coming Soon overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-licorice via-licorice/60 to-licorice/40" />
      <div className="absolute inset-0" style={{ backgroundImage: "url(/images/pattern-3.png)", backgroundSize: "180px 180px", backgroundRepeat: "repeat", opacity: 0.07 }} />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <span className="text-tangerine font-body font-bold uppercase tracking-[0.25em] text-[10px]">★</span>
        <span className={`font-display text-bone tracking-widest ${compact ? "text-sm" : "text-xl md:text-2xl"}`}>COMING SOON</span>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-licorice via-transparent to-transparent" />
      <div className={`absolute bottom-0 left-0 right-0 ${compact ? "px-4 pb-6 pt-3" : "md:p-6"} translate-y-4 group-hover:translate-y-0 transition-transform duration-300`}>
        <h3 className={`${compact ? "text-xs" : "md:text-2xl"} font-display text-bone`}>{bar.name}</h3>
        <p className={`${compact ? "text-[9px]" : "md:text-sm"} font-body text-tangerine mt-0.5`}>
          {bar.signatureCocktail}
        </p>
        {!compact && (
          <p className="text-sm font-body text-bone/60 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
            {bar.description[locale]}
          </p>
        )}
      </div>
    </div>
  );
}

export default function BarsSlider() {
  const locale = useLocale() as "de" | "en";
  const t = useTranslations("barsSlider");
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Desktop: single row parallax
  const xDesktop = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  // Mobile: two rows, opposite directions
  const xRow1 = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const xRow2 = useTransform(scrollYProgress, [0, 1], ["-30%", "10%"]);

  const row1 = bars.slice(0, Math.ceil(bars.length / 2));
  const row2 = bars.slice(Math.ceil(bars.length / 2));

  return (
    <section ref={containerRef} className="section-padding overflow-hidden">
      <div className="max-w-7xl mx-auto mb-8 md:mb-12">
        <BlurText
          text={t("headline")}
          tag="h2"
          className="text-4xl md:text-5xl lg:text-7xl font-display text-bone"
          delay={80}
          duration={0.8}
        />
      </div>

      {/* Mobile: two opposing rows */}
      <div className="md:hidden flex flex-col gap-3">
        <motion.div style={{ x: xRow1 }} className="flex gap-3 pl-4">
          {[...row1, ...row1].map((bar, i) => (
            <BarCard key={`${bar.id}-r1-${i}`} bar={bar} locale={locale} compact />
          ))}
        </motion.div>
        <motion.div style={{ x: xRow2 }} className="flex gap-3 pl-4">
          {[...row2, ...row2].map((bar, i) => (
            <BarCard key={`${bar.id}-r2-${i}`} bar={bar} locale={locale} compact />
          ))}
        </motion.div>
      </div>

      {/* Desktop: single row parallax */}
      <motion.div style={{ x: xDesktop }} className="hidden md:flex gap-6 pl-8 lg:pl-16">
        {bars.map((bar) => (
          <BarCard key={bar.id} bar={bar} locale={locale} />
        ))}
        <div className="flex-shrink-0 w-[400px] aspect-[3/4] rounded-2xl overflow-hidden relative border border-bone/10 bg-licorice/50 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 transition-all duration-300 ease-out hover:border-bone/25 hover:bg-licorice/60">
          <span className="text-8xl font-display text-tangerine">58</span>
          <span className="text-xl font-display text-bone mt-2">{t("teaserTitle")}</span>
          <p className="text-sm font-body text-bone/60 mt-4">{t("teaserText")}</p>
          <Link href={`/${locale}/festival`} className="btn-primary mt-6 text-sm">
            {t("teaserCta")}
          </Link>
        </div>
      </motion.div>

      <div className="flex justify-center mt-12">
        <Link
          href={`/${locale}/festival/bars`}
          className="btn-primary text-sm md:text-base"
        >
          {t("allBarsCta")}
        </Link>
      </div>
    </section>
  );
}
