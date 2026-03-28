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
        className="relative z-10 flex flex-col items-center text-center px-4 md:mt-0"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div
          className="hero-fade-fast mb-8 md:mb-10"
          style={{ opacity: 0, animationDelay: "200ms" }}
        >
          <span className="inline-block px-4 py-1.5 border border-tangerine/60 rounded-full text-xs md:text-sm font-body text-tangerine tracking-[0.25em] uppercase font-bold backdrop-blur-md bg-licorice/60">
            {t("subtitle")}
          </span>
        </div>

        <h1
          className="hero-fade-fast mb-4 md:mb-6 text-6xl md:text-8xl lg:text-[10rem] font-display text-bone"
          style={{ opacity: 0, animationDelay: "400ms" }}
        >
          cocktail{" "}
          <svg
            viewBox="0 0 100 100"
            className="inline-block w-[0.85em] h-[0.85em] align-middle relative -top-[0.03em]"
            fill="currentColor"
          >
            <path d="M50 0 C52 38, 62 48, 100 50 C62 52, 52 62, 50 100 C48 62, 38 52, 0 50 C38 48, 48 38, 50 0Z" />
          </svg>
          {" "}festival
        </h1>

        <div
          className="hero-fade-fast mb-6 md:mb-8"
          style={{ opacity: 0, animationDelay: "550ms" }}
        >
          <Countdown />
        </div>

        <p
          className="hero-fade-fast mb-6 md:mb-10 max-w-lg text-base md:text-lg font-body text-bone/85 leading-relaxed font-bold"
          style={{ opacity: 0, animationDelay: "600ms" }}
        >
          {t("subheadline")}
        </p>

        <a
          href="#tickets"
          className="hero-fade-fast btn-primary text-sm md:text-lg whitespace-nowrap"
          style={{ opacity: 0, animationDelay: "800ms" }}
        >
          {t("cta")}
        </a>
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
