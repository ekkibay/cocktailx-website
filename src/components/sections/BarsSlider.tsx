"use client";

import { useRef, useCallback, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { bars } from "@/data/bars";
import BlurText from "@/components/ui/BlurText";

function BarCard({ bar }: { bar: typeof bars[0] }) {
  const [imgError, setImgError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  return (
    <div
      className="group flex-shrink-0 w-[260px] md:w-[300px] aspect-[3/4] rounded-2xl overflow-hidden bg-jambalaya relative cursor-pointer border border-transparent transition-all duration-300 ease-out hover:border-bone/15 hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)]"
    >
      {bar.image && !imgError ? (
        <Image
          src={bar.image}
          alt={bar.name}
          fill
          sizes="300px"
          loading="lazy"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-jambalaya via-licorice to-jambalaya" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-licorice via-licorice/50 to-licorice/20" />

      {bar.logo && !logoError ? (
        <div className="absolute inset-0 flex items-center justify-center z-[2] p-6">
          <div className="bg-bone/90 backdrop-blur-sm rounded-xl px-5 py-4 shadow-lg">
            <img
              src={bar.logo}
              alt={`${bar.name} Logo`}
              className="h-[65px] max-w-[150px] object-contain"
              onError={() => setLogoError(true)}
            />
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-[2]">
          <span className="font-display text-bone tracking-widest text-xl md:text-2xl text-center px-4">{bar.name}</span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-licorice via-transparent to-transparent z-[3]" />
      <div className="absolute bottom-0 left-0 right-0 z-[4] p-4 md:p-5">
        <h3 className="text-sm md:text-base font-display text-bone">{bar.name}</h3>
        <p className="text-xs font-body text-bone/50 mt-0.5">{bar.district}</p>
      </div>
    </div>
  );
}

function ScrollRow({ bars: rowBars }: { bars: typeof bars }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const didInit = useRef(false);

  // Start in the middle for seamless looping in both directions
  const initScroll = useCallback((el: HTMLDivElement | null) => {
    if (!el || didInit.current) return;
    scrollRef.current = el;
    didInit.current = true;
    // Scroll to the start of the second copy (middle)
    requestAnimationFrame(() => {
      const cardWidth = 300 + 16; // card width + gap
      el.scrollLeft = cardWidth * rowBars.length;
    });
  }, [rowBars.length]);

  const scroll = useCallback((direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="relative group/row">
      {/* Left arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-licorice/80 backdrop-blur-sm border border-bone/15 flex items-center justify-center text-bone/70 hover:text-bone hover:bg-licorice transition-all opacity-0 group-hover/row:opacity-100"
        aria-label="Scroll left"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Scrollable row */}
      <div
        ref={initScroll}
        className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {[...rowBars, ...rowBars, ...rowBars].map((bar, i) => (
          <BarCard key={`${bar.id}-${i}`} bar={bar} />
        ))}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-licorice/80 backdrop-blur-sm border border-bone/15 flex items-center justify-center text-bone/70 hover:text-bone hover:bg-licorice transition-all opacity-0 group-hover/row:opacity-100"
        aria-label="Scroll right"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-licorice to-transparent pointer-events-none z-[5]" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-licorice to-transparent pointer-events-none z-[5]" />
    </div>
  );
}

export default function BarsSlider() {
  const locale = useLocale() as "de" | "en";
  const t = useTranslations("barsSlider");

  const row1 = bars.slice(0, Math.ceil(bars.length / 2));
  const row2 = bars.slice(Math.ceil(bars.length / 2));

  return (
    <section className="pt-16 pb-8 md:pt-24 md:pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 mb-8 md:mb-12">
        <BlurText
          text={t("headline")}
          tag="h2"
          className="text-4xl md:text-5xl lg:text-7xl font-display text-bone"
          delay={80}
          duration={0.8}
        />
      </div>

      <div className="flex flex-col gap-3 md:gap-4">
        <ScrollRow bars={row1} />
        <ScrollRow bars={row2} />
      </div>

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
