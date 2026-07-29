"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { DrawLine, MaskReveal, Reveal, useRevealTrigger } from "./Motion";

/**
 * Anlaesse statt Leistungen. Der Einkaeufer kommt mit einem Anlass, nicht mit einer
 * Leistungsliste, deshalb steht dieser Abschnitt vor allem anderen.
 *
 * Jeder Anlass hat eine eigene Akzentfarbe aus der Markenpalette. Die Spaltenbreiten
 * sind absichtlich ungleich, damit das Raster editorial wirkt und nicht wie ein Katalog.
 */
const occasions = [
  {
    num: "01",
    title: "Firmenfeier",
    claim: "Der Abend, über den im Büro noch im März geredet wird.",
    meta: "50 bis 800 Gäste · 4 bis 6 Stunden",
    image: "/images/catering/ct-guest-1.jpg",
    position: "object-[center_30%]",
    accent: "bg-tangerine",
    span: "lg:col-span-7",
    height: "h-[420px] lg:h-[520px]",
  },
  {
    num: "02",
    title: "Sommerfest",
    claim: "Draußen, laut, lang. Mit Drinks, die auch bei 30 Grad funktionieren.",
    meta: "80 bis 1.500 Gäste · Outdoor-Setup",
    image: "/images/catering/ct-sommerfest-hof.jpg",
    position: "object-[center_40%]",
    accent: "bg-ct-green",
    span: "lg:col-span-5",
    height: "h-[420px] lg:h-[520px]",
  },
  {
    num: "03",
    title: "Messe & Standparty",
    claim: "Hoher Durchsatz ohne Schlange. Wir kennen das Münchner Messegelände.",
    meta: "200 bis 3.000 Gäste · Nitro-Setup",
    image: "/images/catering/ct-messe-bar.jpg",
    position: "object-[center_45%]",
    accent: "bg-bay-of-many",
    span: "lg:col-span-5",
    height: "h-[400px] lg:h-[480px]",
  },
  {
    num: "04",
    title: "Produktlaunch",
    claim: "Signature Drinks, die euer Produkt erzählen. Bar im Branding.",
    meta: "50 bis 400 Gäste · White-Label",
    // CUPRA City Garage, Mai 2025. Kundenreferenz statt Sponsorenwand: hier steht
    // das Branding der Marke, für die das Event lief, und genau das gehört hierher.
    image: "/images/catering/ct-launch-cupra.jpg",
    position: "object-center",
    accent: "bg-hibiscus",
    span: "lg:col-span-7",
    height: "h-[400px] lg:h-[480px]",
  },
  {
    num: "05",
    title: "Weihnachtsfeier",
    claim: "Warme Drinks, gute Musik, ein Team das endlich mal nicht arbeitet.",
    meta: "30 bis 500 Gäste · Dezember früh buchen",
    image: "/images/catering/ct-bar-kempinski.jpg",
    position: "object-[center_45%]",
    accent: "bg-ct-wine",
    span: "lg:col-span-6",
    height: "h-[380px] lg:h-[440px]",
  },
  {
    num: "06",
    title: "Jubiläum & Gala",
    claim: "Wenn der Anlass Haltung verlangt. Champagner, Service, Präzision.",
    meta: "50 bis 600 Gäste · Servicekräfte",
    image: "/images/catering/ct-gala-redcarpet.jpg",
    position: "object-[center_25%]",
    accent: "bg-jambalaya",
    span: "lg:col-span-6",
    height: "h-[380px] lg:h-[440px]",
  },
];

const more = ["Kunden-Dinner", "Afterwork", "Networking-Empfang", "Team-Event", "Store-Opening", "Roadshow"];

function Tile({ o, index }: { o: (typeof occasions)[number]; index: number }) {
  const reduced = useReducedMotion();
  const delay = (index % 2) * 0.1;
  // Gleicher Mechanismus wie in Motion.tsx: serverseitig sichtbar, Fallback-Timer,
  // damit eine Kachel nie unsichtbar hängen bleibt.
  const { ref, mounted, show } = useRevealTrigger<HTMLElement>(delay, "-8% 0px");
  const visible = reduced || !mounted || show;

  return (
    <motion.article
      ref={ref}
      className={`group relative overflow-hidden rounded-2xl ${o.span} ${o.height}`}
      initial={false}
      animate={
        visible ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 40, filter: "blur(10px)" }
      }
      transition={visible ? { duration: 0.9, delay: show ? delay : 0, ease: [0.16, 1, 0.3, 1] } : { duration: 0 }}
    >
      <Image
        src={o.image}
        alt={o.title}
        fill
        sizes="(max-width: 1024px) 100vw, 55vw"
        className={`object-cover ${o.position} transition-transform duration-[1100ms] ease-out group-hover:scale-[1.07]`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-licorice via-licorice/45 to-licorice/5" />

      {/* Akzentkante, waechst beim Hover */}
      <div
        className={`absolute left-0 top-0 h-full w-[3px] ${o.accent} origin-top scale-y-[0.35] transition-transform duration-700 ease-out group-hover:scale-y-100`}
      />

      <div className="relative h-full flex flex-col justify-end p-6 md:p-8">
        <span className="font-body text-[11px] font-bold tracking-[0.3em] text-ct-cream/40 mb-3">{o.num}</span>
        <h3 className="font-display text-3xl md:text-4xl lg:text-5xl text-ct-cream leading-[0.95] mb-3">
          {o.title}
        </h3>
        <p className="font-body text-sm md:text-base text-ct-cream/75 leading-relaxed max-w-md mb-4">
          {o.claim}
        </p>
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-ct-cream/15">
          <span className="font-body text-[11px] uppercase tracking-wider text-ct-cream/50">{o.meta}</span>
          <ArrowUpRight
            className="w-5 h-5 text-ct-cream/40 transition-all duration-300 group-hover:text-ct-cream group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={1.5}
            aria-hidden
          />
        </div>
      </div>
    </motion.article>
  );
}

export function Occasions({ locale }: { locale: string }) {
  return (
    <section id="anlaesse" className="py-20 md:py-28 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-y-6 gap-x-10 items-end mb-12">
          <div className="lg:col-span-8">
            <p className="text-xs font-body font-bold uppercase tracking-[0.3em] text-ct-red mb-5">
              Anlässe
            </p>
            <h2 className="font-display text-4xl md:text-6xl text-licorice leading-[0.98]">
              <MaskReveal>Sagt uns den Anlass.</MaskReveal>
              <br />
              <MaskReveal delay={0.1} className="text-everglade/40">
                Den Rest kennen wir.
              </MaskReveal>
            </h2>
          </div>
          <Reveal className="lg:col-span-4" delay={0.2}>
            <p className="font-body text-sm text-everglade/65 leading-relaxed">
              Über 500 Events in München. Jeder Anlass hat seinen eigenen Rhythmus, seine eigene
              Trinkgeschwindigkeit und seine eigenen Fallen. Wir planen nicht nach Schema, sondern
              nach Anlass.
            </p>
          </Reveal>
        </div>

        <DrawLine className="mb-10" />

        <div className="grid lg:grid-cols-12 gap-4 md:gap-5">
          {occasions.map((o, i) => (
            <Tile key={o.title} o={o} index={i} />
          ))}
        </div>

        <Reveal className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="font-body text-xs uppercase tracking-wider text-everglade/40">Außerdem</span>
          {more.map((m) => (
            <span
              key={m}
              className="rounded-full border border-everglade/15 px-3.5 py-1.5 font-body text-xs text-everglade/60"
            >
              {m}
            </span>
          ))}
          <Link
            href={`/${locale}/catering/anfrage`}
            className="ml-auto font-body text-xs font-bold uppercase tracking-wider text-ct-red hover:text-ct-red/70 transition-colors inline-flex items-center gap-1.5"
          >
            Richtpreis berechnen
            <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
