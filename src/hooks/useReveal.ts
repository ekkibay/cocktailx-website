"use client";

import { useRef, useEffect, useState } from "react";

/**
 * Safari-safe scroll reveal hook with blur effect.
 *
 * Inspired by reactbits.dev's GSAP-based FadeContent/AnimatedContent:
 * 1. Renders elements VISIBLE on the server (no SSR mismatch)
 * 2. After hydration, sets elements to hidden via JS (not CSS class)
 * 3. Uses Intersection Observer to trigger CSS transition
 * 4. Supports blur, configurable distance, direction, and easing
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options?: {
    threshold?: number;
    once?: boolean;
    delay?: number;
    blur?: boolean;
    distance?: number;
    direction?: "up" | "down" | "left" | "right" | "none";
    duration?: number;
    easing?: string;
    scale?: number;
  }
) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const {
    threshold = 0.1,
    once = true,
    delay = 0,
    blur = true,
    distance = 40,
    direction = "up",
    duration = 0.9,
    easing = "cubic-bezier(0.16, 1, 0.3, 1)", // power3.out equivalent
    scale,
  } = options ?? {};

  // Mark as mounted after hydration
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setIsMounted(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Set up Intersection Observer
  useEffect(() => {
    if (!isMounted) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => setIsVisible(true), delay);
          } else {
            setIsVisible(true);
          }
          if (once) {
            observer.unobserve(el);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isMounted, threshold, once, delay]);

  // Build transform string based on direction
  const getTransform = (visible: boolean) => {
    const parts: string[] = [];

    if (direction !== "none") {
      const d = visible ? 0 : distance;
      switch (direction) {
        case "up":
          parts.push(`translateY(${d}px)`);
          break;
        case "down":
          parts.push(`translateY(${-d}px)`);
          break;
        case "left":
          parts.push(`translateX(${d}px)`);
          break;
        case "right":
          parts.push(`translateX(${-d}px)`);
          break;
      }
    }

    if (scale !== undefined && !visible) {
      parts.push(`scale(${scale})`);
    } else if (scale !== undefined && visible) {
      parts.push("scale(1)");
    }

    return parts.length > 0 ? parts.join(" ") : undefined;
  };

  // Transition properties
  const transitionProps = [
    `opacity ${duration}s ${easing}`,
    `transform ${duration}s ${easing}`,
    blur ? `filter ${duration}s ${easing}` : "",
  ]
    .filter(Boolean)
    .join(", ");

  // Before mount: fully visible (SSR safe, no flicker)
  // After mount but not in view: hidden with blur + translate
  // In view: visible with smooth transition
  const style: React.CSSProperties = !isMounted
    ? {} // SSR: no styles, element is visible
    : isVisible
      ? {
          opacity: 1,
          transform: getTransform(true),
          filter: blur ? "blur(0px)" : undefined,
          transition: transitionProps,
        }
      : {
          opacity: 0,
          transform: getTransform(false),
          filter: blur ? "blur(8px)" : undefined,
          transition: "none", // No transition when hiding (instant)
        };

  return { ref, style, isVisible };
}
