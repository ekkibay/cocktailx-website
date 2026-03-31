"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Countdown from "@/components/ui/Countdown";

const bgImages = [
  { src: "/images/L1030894_CocktailX_adriancamo.webp", top: "-2%", left: "1%", size: "w-[100px] h-[130px] md:w-[260px] md:h-[340px]", rotate: -8, delay: 0, speed: 0.3, mobileHide: false },
  { src: "/images/festival-lounge.webp", top: "-3%", right: "1%", size: "w-[95px] h-[120px] md:w-[250px] md:h-[320px]", rotate: 6, delay: 100, speed: 0.5, mobileHide: false },
  { src: "/images/IMG_1063.webp", top: "30%", left: "1%", size: "w-[90px] h-[115px] md:w-[235px] md:h-[300px]", rotate: 4, delay: 200, speed: 0.2, mobileHide: false },
  { src: "/images/studio-berg-3.jpg", bottom: "-2%", left: "4%", size: "w-[95px] h-[120px] md:w-[245px] md:h-[315px]", rotate: -5, delay: 300, speed: 0.6, mobileHide: true },
  { src: "/images/festival-bottles.webp", top: "18%", right: "1%", size: "w-[85px] h-[110px] md:w-[225px] md:h-[290px]", rotate: -4, delay: 150, speed: 0.35, mobileHide: false },
  { src: "/images/L1030863_CocktailX_adriancamo.webp", top: "50%", right: "1%", size: "w-[95px] h-[120px] md:w-[250px] md:h-[320px]", rotate: 7, delay: 250, speed: 0.45, mobileHide: true },
  { src: "/images/Cocktail X_2.webp", bottom: "-3%", left: "22%", size: "w-[90px] h-[115px] md:w-[230px] md:h-[295px]", rotate: 3, delay: 350, speed: 0.55, mobileHide: true },
  { src: "/images/Cocktail X_4.webp", bottom: "-2%", right: "5%", size: "w-[92px] h-[118px] md:w-[238px] md:h-[305px]", rotate: -6, delay: 400, speed: 0.25, mobileHide: true },
  { src: "/images/festival-cheers.webp", top: "2%", right: "20%", size: "w-[88px] h-[112px] md:w-[220px] md:h-[280px]", rotate: 5, delay: 200, speed: 0.4, mobileHide: false },
  { src: "/images/Cocktail X_3.webp", bottom: "5%", right: "25%", size: "w-[85px] h-[108px] md:w-[210px] md:h-[270px]", rotate: -3, delay: 450, speed: 0.65, mobileHide: true },
];

function ParallaxImage({
  img,
  index,
  scrollProgress,
}: {
  img: typeof bgImages[0];
  index: number;
  scrollProgress: MotionValue<number>;
}) {
  const y = useTransform(scrollProgress, [0, 1], [0, -450 * img.speed]);
  const x = useTransform(scrollProgress, [0, 1], [0, (index % 2 === 0 ? 1 : -1) * 130 * img.speed]);
  const rotate = useTransform(scrollProgress, [0, 1], [img.rotate, img.rotate + (index % 2 === 0 ? 15 : -15) * img.speed]);
  const scale = useTransform(scrollProgress, [0, 1], [1, 1 + img.speed * 0.45]);

  return (
    <motion.div
      style={{
        top: img.top,
        left: img.left,
        right: img.right,
        bottom: img.bottom,
        y,
        x,
        rotate,
        scale,
        // Inline opacity: 0 prevents FOUC — element is hidden from first paint
        opacity: 0,
        animationDelay: `${300 + img.delay}ms`,
      }}
      className={`absolute ${img.size} rounded-xl overflow-hidden z-[5] hero-fade ${img.mobileHide ? "hidden md:block" : ""}`}
    >
      <Image
        src={img.src}
        alt=""
        fill
        className="object-cover"
        sizes="(max-width: 768px) 140px, 200px"
        priority={index < 4}
        loading={index < 4 ? "eager" : "lazy"}
      />
      <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.4)]" />
      <div className="absolute inset-0 border border-bone/[0.06] rounded-xl" />
    </motion.div>
  );
}

export default function Hero() {
  const t = useTranslations("hero");
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 0.8], [0, -200]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const shareText = encodeURIComponent(
    "58 Bars, 18 Tage, Signature Cocktails fur nur 6 Euro – Cocktail X Festival Munchen! Komm mit! https://www.cocktail-x.com"
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[85svh] md:h-screen overflow-hidden flex items-center justify-center bg-licorice"
    >
      {/* Pattern Background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "url(/images/pattern-bg.svg)",
          backgroundSize: "200px 200px",
          backgroundRepeat: "repeat",
        }}
      />

      {/* Gradient over pattern */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: "linear-gradient(to bottom, rgba(26,18,11,0.1) 0%, rgba(26,18,11,0.4) 40%, rgba(26,18,11,0.85) 80%, rgba(26,18,11,1) 100%)"
        }}
      />

      {/* Photo collage */}
      {bgImages.map((img, i) => (
        <ParallaxImage key={i} img={img} index={i} scrollProgress={scrollYProgress} />
      ))}

      {/* Center vignette */}
      <div
        className="absolute inset-0 z-[6] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 55% 50% at center, rgba(26,18,11,0.92) 0%, rgba(26,18,11,0.7) 45%, rgba(26,18,11,0.15) 75%, transparent 100%)"
        }}
      />
      <div
        className="absolute inset-0 z-[6] pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(26,18,11,0.5) 0%, transparent 15%, transparent 85%, rgba(26,18,11,0.8) 100%)"
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-4 md:px-8 w-full max-w-4xl mx-auto"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div
          className="hero-fade-fast mb-6 md:mb-8"
          style={{ opacity: 0, animationDelay: "200ms" }}
        >
          <span className="inline-block px-4 py-1.5 border border-tangerine/60 rounded-full text-xs md:text-sm font-body text-tangerine tracking-[0.25em] uppercase font-bold backdrop-blur-md bg-licorice/60">
            {t("subtitle")}
          </span>
        </div>

        {/* Main headline */}
        <h1
          className="hero-fade-fast mb-4 md:mb-6 text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display text-tangerine leading-[1.1]"
          style={{ opacity: 0, animationDelay: "400ms" }}
        >
          {t("heroHeadline")}
        </h1>

        <p
          className="hero-fade-fast mb-6 md:mb-8 max-w-lg text-base md:text-lg font-body text-bone/85 leading-relaxed font-bold"
          style={{ opacity: 0, animationDelay: "550ms" }}
        >
          {t("subheadline")}
        </p>

        <div
          className="hero-fade-fast mb-6 md:mb-8"
          style={{ opacity: 0, animationDelay: "600ms" }}
        >
          <Countdown />
        </div>

        {/* Two CTAs */}
        <div
          className="hero-fade-fast flex flex-col sm:flex-row gap-3 sm:gap-4 items-center"
          style={{ opacity: 0, animationDelay: "700ms" }}
        >
          <a
            href="https://cocktailx.app/"
            className="btn-primary text-sm md:text-lg whitespace-nowrap"

          >
            {t("cta")}
          </a>
          <a
            href={`https://wa.me/?text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-full border border-bone/25 text-bone font-body font-bold text-sm md:text-base hover:bg-bone/5 transition-colors whitespace-nowrap"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {t("shareCta")}
          </a>
        </div>

        <p
          className="hero-fade-fast mt-4 text-xs font-body text-bone/55 tracking-wide"
          style={{ opacity: 0, animationDelay: "1000ms" }}
        >
          {t("guestCount")}
        </p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ opacity: contentOpacity }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-bone/65">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </motion.div>
    </section>
  );
}
