"use client";

import { useRef, useEffect, useState, useMemo } from "react";

/**
 * BlurText — Safari-safe text reveal animation.
 *
 * Inspired by reactbits.dev's BlurText component:
 * Splits text into words and animates each with blur + opacity + translate,
 * using IntersectionObserver (not Framer Motion whileInView).
 */

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "top" | "bottom";
  threshold?: number;
  animateBy?: "words" | "chars";
  tag?: "p" | "h1" | "h2" | "h3" | "h4" | "span" | "div";
}

export default function BlurText({
  text,
  className = "",
  delay = 60,
  duration = 0.6,
  direction = "bottom",
  threshold = 0.1,
  animateBy = "words",
  tag: Tag = "p",
}: BlurTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // SSR-safe: mount after first paint
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Intersection Observer
  useEffect(() => {
    if (!isMounted || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isMounted, threshold]);

  const elements = useMemo(() => {
    if (animateBy === "chars") {
      return text.split("").map((char, i) => ({
        content: char === " " ? "\u00A0" : char,
        key: i,
      }));
    }
    return text.split(" ").map((word, i) => ({
      content: word,
      key: i,
    }));
  }, [text, animateBy]);

  const yOffset = direction === "top" ? -30 : 30;

  const Component = Tag as React.ElementType;

  return (
    <Component
      ref={ref}
      className={className}
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: className.includes("text-center") ? "center" : "flex-start",
      }}
    >
      {elements.map((el, index) => {
        // SSR: render visible, no styles
        if (!isMounted) {
          return (
            <span key={el.key} style={{ display: "inline-block" }}>
              {el.content}
              {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
            </span>
          );
        }

        const isActive = inView;

        return (
          <span
            key={el.key}
            style={{
              display: "inline-block",
              opacity: isActive ? 1 : 0,
              filter: isActive ? "blur(0px)" : "blur(10px)",
              transform: isActive
                ? "translateY(0px)"
                : `translateY(${yOffset}px)`,
              transition: isActive
                ? `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${index * delay}ms, filter ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${index * delay}ms, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${index * delay}ms`
                : "none",
              willChange: "transform, filter, opacity",
            }}
          >
            {el.content}
            {animateBy === "words" && index < elements.length - 1 && "\u00A0"}
          </span>
        );
      })}
    </Component>
  );
}
