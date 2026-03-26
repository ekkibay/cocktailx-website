"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useAnimationFrame, useMotionValue, useSpring } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import BlurText from "@/components/ui/BlurText";
import { useReveal } from "@/hooks/useReveal";

interface Testimonial {
  key: string;
  image?: string;
}

const row1: Testimonial[] = [
  { key: "t1", image: "/images/testimonials/jennifer-mindl.webp" },
  { key: "t4", image: "/images/festival-cheers.webp" },
  { key: "t10", image: "/images/festival-lounge.webp" },
  { key: "t7", image: "/images/festival-bar-life.webp" },
  { key: "t3", image: "/images/testimonials/alex-kratena.webp" },
];

const row2: Testimonial[] = [
  { key: "t5", image: "/images/festival-friends.webp" },
  { key: "t11", image: "/images/festival-cocktails-duo.webp" },
  { key: "t2", image: "/images/testimonials/simone-caporale.webp" },
  { key: "t8", image: "/images/festival-laugh.webp" },
  { key: "t12", image: "/images/festival-dj.webp" },
];

const row3: Testimonial[] = [
  { key: "t9", image: "/images/festival-bar-scene.webp" },
  { key: "t13", image: "/images/festival-bartender-pour.webp" },
  { key: "t6", image: "/images/festival-bottles.webp" },
  { key: "t14", image: "/images/festival-bartenders.webp" },
  { key: "t15", image: "/images/festival-lounge.webp" },
];

function TestimonialCard({ item, t }: { item: Testimonial; t: ReturnType<typeof useTranslations> }) {
  const name = t(`${item.key}.name`);
  const initials = name.charAt(0);

  return (
    <div className="w-[260px] sm:w-[320px] md:w-[380px] shrink-0 p-5 md:p-6 rounded-2xl border border-bone/[0.06] bg-licorice/90 flex flex-col gap-4 transition-colors duration-200 hover:bg-bone/[0.04] hover:border-bone/[0.12] cursor-default">
      <p className="text-sm md:text-[0.95rem] font-body text-bone leading-relaxed flex-grow">
        &ldquo;{t(`${item.key}.quote`)}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        {item.image ? (
          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-bone/10">
            <Image
              src={item.image}
              alt={name}
              width={40}
              height={40}
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-tangerine/15 border-2 border-tangerine/20 flex items-center justify-center shrink-0">
            <span className="text-xs font-body font-bold text-tangerine">
              {initials}
            </span>
          </div>
        )}
        <span className="text-sm font-body font-medium text-bone/80">
          {name}
        </span>
      </div>
    </div>
  );
}

function MarqueeRow({
  items,
  direction,
  speed,
  t,
}: {
  items: Testimonial[];
  direction: "left" | "right";
  speed: number;
  t: ReturnType<typeof useTranslations>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const isHovered = useRef(false);
  const [singleWidth, setSingleWidth] = useState(0);

  const hoverFactor = useMotionValue(1);
  const smoothHoverFactor = useSpring(hoverFactor, { damping: 50, stiffness: 400 });
  const xPos = useMotionValue(0);

  // Measure single set width
  useEffect(() => {
    if (!innerRef.current) return;
    // Each repeated set is one child of the inner container
    const firstSet = innerRef.current.children[0] as HTMLElement;
    if (firstSet) {
      setSingleWidth(firstSet.offsetWidth);
    }
  }, []);

  useAnimationFrame((_, delta) => {
    if (singleWidth === 0) return;

    if (isHovered.current) {
      hoverFactor.set(0.15);
    } else {
      hoverFactor.set(1);
    }

    const pixelsPerSecond = speed * 50; // speed multiplied for visible movement
    const moveBy = pixelsPerSecond * (delta / 1000) * smoothHoverFactor.get();

    let newX = xPos.get();

    if (direction === "left") {
      newX -= moveBy;
      // When we've scrolled past one full set, reset
      if (newX <= -singleWidth) {
        newX += singleWidth;
      }
    } else {
      newX += moveBy;
      // When we've scrolled past one full set, reset
      if (newX >= 0) {
        newX -= singleWidth;
      }
    }

    xPos.set(newX);
  });

  // For "right" direction, start offset so it scrolls into view
  useEffect(() => {
    if (direction === "right" && singleWidth > 0) {
      xPos.set(-singleWidth);
    }
  }, [direction, singleWidth, xPos]);

  return (
    <div
      ref={containerRef}
      className="overflow-hidden"
      onMouseEnter={() => { isHovered.current = true; }}
      onMouseLeave={() => { isHovered.current = false; }}
    >
      <motion.div
        ref={innerRef}
        className="flex"
        style={{ x: xPos }}
      >
        {/* Repeat items 4 times for seamless loop */}
        {Array.from({ length: 4 }, (_, repeatIdx) => (
          <div
            key={repeatIdx}
            className="flex gap-5 shrink-0 pr-5"
          >
            {items.map((item, i) => (
              <TestimonialCard key={`${item.key}-${i}`} item={item} t={t} />
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function Testimonials() {
  const t = useTranslations("testimonials");

  return (
    <section className="py-20 md:py-28 overflow-hidden">
      <BlurText
        text={t("headline")}
        tag="h2"
        className="text-3xl md:text-4xl font-display text-bone mb-12 md:mb-16 text-center"
        delay={70}
        duration={0.7}
      />

      {/* Marquee container with edge fades */}
      <div className="relative">
        <div className="absolute top-0 bottom-0 left-0 w-16 md:w-[200px] bg-gradient-to-r from-licorice to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 md:w-[200px] bg-gradient-to-l from-licorice to-transparent z-10 pointer-events-none" />

        <div className="flex flex-col gap-5">
          <MarqueeRow items={row1} direction="left" speed={1.2} t={t} />
          <MarqueeRow items={row2} direction="right" speed={1} t={t} />
          <MarqueeRow items={row3} direction="left" speed={1.4} t={t} />
        </div>
      </div>
    </section>
  );
}
