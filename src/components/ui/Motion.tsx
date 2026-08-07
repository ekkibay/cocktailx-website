"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";

/** Shared easing. Fast out, long settle, so movement reads as engineered, not bouncy. */
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Scroll trigger with a safety net.
 *
 * Everything in this file hides content before revealing it, so a viewport observer
 * that never reports means content that is never readable. The timeout guarantees
 * the reveal runs regardless. Same reasoning as the fallback in useReveal.ts.
 */
/** framer-motion typisiert die Viewport-Margin als Template-Literal, kein freier String. */
type RevealMargin = "-8% 0px" | "-10% 0px" | "-12% 0px" | "-15% 0px";

export function useRevealTrigger<T extends Element>(delay = 0, margin: RevealMargin = "-10% 0px") {
  return useShow<T>(delay, margin);
}

function useShow<T extends Element>(delay = 0, margin: RevealMargin = "-10% 0px") {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { once: true, margin });
  const [mounted, setMounted] = useState(false);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    // Erst nach der Hydration verbergen, damit der serverseitige HTML-Zustand
    // lesbar bleibt. Ohne das wäre jede Headline ohne JavaScript unsichtbar.
    const raf = requestAnimationFrame(() => setMounted(true));
    const t = setTimeout(() => setFallback(true), 1600 + delay * 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [delay]);

  return { ref, mounted, show: inView || fallback, inView };
}

/** Thin progress bar at the very top, tied to scroll. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      style={{ scaleX: width }}
      className="fixed top-0 left-0 right-0 z-50 h-[2px] origin-left bg-ct-red"
      aria-hidden
    />
  );
}

/** In-view fade and rise. The workhorse. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const { ref, mounted, show, inView } = useShow<HTMLDivElement>(delay, "-12% 0px");

  if (reduced) return <div className={className}>{children}</div>;

  const visible = !mounted || show;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={visible ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y, filter: "blur(6px)" }}
      // Das Verbergen nach der Hydration passiert ohne Übergang, sonst sieht man
      // den Inhalt kurz ausblenden. Nur das Einblenden ist animiert.
      transition={visible ? { duration: 0.8, delay: inView ? delay : 0, ease: EASE } : { duration: 0 }}
    >
      {children}
    </motion.div>
  );
}

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE } },
};

export function StaggerGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  const { ref, mounted, show } = useShow<HTMLDivElement>();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={stagger}
      initial={false}
      animate={!mounted || show ? "show" : "hidden"}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
}

/** Headline that assembles word by word. Used once per page, on the hero. */
export function WordReveal({ text, className }: { text: string; className?: string }) {
  const reduced = useReducedMotion();
  if (reduced) return <span className={className}>{text}</span>;
  return (
    <span className={className}>
      {text.split(" ").map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.15 + i * 0.055, ease: EASE }}
          >
            {word}
            {i < text.split(" ").length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Counts up when scrolled into view. Keeps thousand separators and any suffix. */
export function CountUp({
  value,
  suffix = "",
  className,
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  className?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduced = useReducedMotion();
  const mv = useMotionValue(0);
  const [shown, setShown] = useState(reduced ? value : 0);

  useEffect(() => {
    if (!inView || reduced) return;
    const controls = animate(mv, value, {
      duration: 1.6,
      ease: EASE,
      onUpdate: (v) => setShown(v),
    });
    return () => controls.stop();
  }, [inView, reduced, mv, value]);

  return (
    <span ref={ref} className={className}>
      {shown.toLocaleString("de-DE", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

/** Hero image that drifts on scroll. Subtle on purpose, 12% of travel. */
export function ParallaxImage({
  src,
  alt,
  className,
  objectPosition = "object-center",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  objectPosition?: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1.16]);

  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden ${className ?? ""}`}>
      <motion.div className="absolute inset-0" style={reduced ? undefined : { y, scale }}>
        <Image src={src} alt={alt} fill priority={priority} sizes="100vw" className={`object-cover ${objectPosition}`} />
      </motion.div>
    </div>
  );
}

/**
 * Animated technical grid. Gives the page its engineered feel without an image:
 * two drifting line layers plus a slow radial sweep.
 */
export function GridBackdrop({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`} aria-hidden>
      <motion.div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        animate={reduced ? undefined : { backgroundPosition: ["0px 0px", "64px 64px"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute -inset-x-1/4 top-0 h-full opacity-[0.10]"
        style={{
          background: "radial-gradient(60% 40% at 50% 0%, currentColor 0%, transparent 70%)",
        }}
        animate={reduced ? undefined : { opacity: [0.05, 0.14, 0.05] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/** Card that lifts and tilts slightly toward the cursor. */
export function LiftCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  const { ref, mounted, show } = useShow<HTMLDivElement>();

  if (reduced) return <div className={className}>{children}</div>;

  const visible = !mounted || show;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={visible ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 32, filter: "blur(8px)" }}
      transition={visible ? { duration: 0.85, ease: EASE } : { duration: 0 }}
      whileHover={{ y: -6, transition: { duration: 0.35, ease: EASE } }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Endless horizontal ticker. Children are rendered twice and the track shifts by
 * exactly -50%, so the loop is seamless. Used for the occasion ticker and references.
 */
export function Marquee({
  children,
  speed = 32,
  className,
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <motion.div
        className="flex w-max"
        animate={reduced ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden>
          {children}
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Wechselt ein Wort in fester Zeile durch eine Liste. Für die Hero-Headline gedacht,
 * damit alle Anlässe vorkommen, ohne dass die Komposition kippt.
 *
 * Barrierefreiheit und SEO: `fallback` steht als echter Text im DOM und wird nur
 * visuell verborgen, die Animation selbst ist aria-hidden. Crawler und Screenreader
 * bekommen also eine stabile Headline, nicht ein flackerndes Wort.
 */
export function CyclingWord({
  words,
  fallback,
  intervalMs = 2300,
  className,
}: {
  words: string[];
  fallback: string;
  intervalMs?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced || words.length < 2) return;
    const id = setInterval(() => setI((v) => (v + 1) % words.length), intervalMs);
    return () => clearInterval(id);
  }, [reduced, words.length, intervalMs]);

  if (reduced) return <span className={className}>{fallback}</span>;

  return (
    <span className={`relative inline-block ${className ?? ""}`}>
      <span className="sr-only">{fallback}</span>
      <span className="inline-block overflow-hidden align-bottom" aria-hidden>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={words[i]}
            className="inline-block whitespace-nowrap"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            {words[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}

/**
 * Reveals large type by sliding it up out of a clipping window.
 *
 * Three things here are deliberate, all learned from breaking it:
 *
 * 1. The observer sits on the OUTER span, not on the animated one. The inner span
 *    starts translated fully out of the clip window, so it has an empty intersection
 *    rect and an observer on it would never fire: hidden because not visible, not
 *    visible because hidden. The outer span is the clipper and is always measurable.
 * 2. A timeout forces the text visible even if the observer never reports. Same
 *    safety net as useReveal, so a headline can never stay an empty dark area.
 * 3. Padding at the bottom, pulled back with a negative margin, gives descenders
 *    (g, j, ä) room inside the clip window without changing the layout.
 */
export function MaskReveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const { ref, mounted, show, inView } = useShow<HTMLSpanElement>(delay, "-8% 0px");

  if (reduced) return <span className={className}>{children}</span>;

  const visible = !mounted || show;

  return (
    <span
      ref={ref}
      className={`inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em] ${className ?? ""}`}
    >
      <motion.span
        className="inline-block"
        initial={false}
        animate={{ y: visible ? "0%" : "108%" }}
        transition={visible ? { duration: 1, delay: inView ? delay : 0, ease: EASE } : { duration: 0 }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Horizontal rule that draws itself in. */
export function DrawLine({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={`h-px origin-left bg-everglade/20 ${className ?? ""}`}
      initial={reduced ? undefined : { scaleX: 0 }}
      whileInView={reduced ? undefined : { scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.1, ease: EASE }}
      aria-hidden
    />
  );
}
