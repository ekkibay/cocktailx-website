"use client";

import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { events } from "@/data/events";
import BlurText from "@/components/ui/BlurText";
import { useReveal } from "@/hooks/useReveal";

const TICKET_SALE_START = new Date("2026-04-13T00:00:00+02:00");
const ticketsAvailable = new Date() >= TICKET_SALE_START;

const TYPE_LABEL: Record<string, { de: string; en: string }> = {
  opening: { de: "Opening", en: "Opening" },
  festival: { de: "Festival", en: "Festival" },
  closing: { de: "Closing", en: "Closing" },
};

const TYPE_COLOR: Record<string, string> = {
  opening: "bg-hibiscus text-bone",
  festival: "bg-tangerine text-licorice",
  closing: "bg-bone/20 text-bone border border-bone/30",
};

export default function EventsTimeline() {
  const locale = useLocale() as "de" | "en";

  // Sort events chronologically
  const sorted = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const opening = sorted.find((e) => e.id === "opening-party")!;
  const others = sorted.filter((e) => e.id !== "opening-party");

  const featuredReveal = useReveal({ delay: 100, scale: 0.97 });
  const gridReveal = useReveal({ delay: 200, scale: 0.97 });

  const formatDate = (dateStr: string, dateEndStr?: string) => {
    const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
    const short: Intl.DateTimeFormatOptions = { day: "numeric", month: "long" };
    const loc = locale === "de" ? "de-DE" : "en-US";
    if (dateEndStr) {
      return `${new Date(dateStr).toLocaleDateString(loc, short)} – ${new Date(dateEndStr).toLocaleDateString(loc, opts)}`;
    }
    return new Date(dateStr).toLocaleDateString(loc, opts);
  };

  return (
    <section className="px-4 pb-16 pt-8 md:px-8 lg:px-16 lg:pb-24 lg:pt-12">
      <div className="max-w-6xl mx-auto">
        <BlurText
          text="EVENTS"
          tag="h2"
          className="text-4xl md:text-5xl lg:text-7xl font-display text-bone text-center mb-16"
          delay={100}
          duration={0.8}
          animateBy="chars"
        />

        {/* ── Featured: Opening Party (large hero card) ── */}
        <div ref={featuredReveal.ref} style={featuredReveal.style} className="mb-8">
          <div className="group relative rounded-3xl overflow-hidden border border-bone/10 hover:border-bone/20 transition-all duration-500 cursor-pointer">
            {/* Full-bleed image */}
            <div className="relative aspect-[16/9] md:aspect-[21/9]">
              <Image
                src="/images/opening-rooftop.png"
                alt={opening.title[locale]}
                fill
                sizes="(max-width: 768px) 100vw, 1200px"
                loading="lazy"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = opening.image;
                }}
              />
              {/* Dark gradient overlay — stronger at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-licorice via-licorice/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-licorice/30 to-transparent" />
            </div>

            {/* Content overlaid on image */}
            <div className="absolute inset-0 flex flex-col justify-end p-7 md:p-12">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-[10px] font-body font-bold uppercase tracking-widest bg-hibiscus text-bone px-3 py-1.5 rounded-full">
                  Opening Party
                </span>
                {!ticketsAvailable && (
                  <span className="text-[10px] font-body font-bold uppercase tracking-widest text-tangerine border border-tangerine/40 bg-licorice/60 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-tangerine animate-pulse" />
                    {locale === "de" ? `Tickets ab 13. April` : `Tickets from Apr 13`}
                  </span>
                )}
              </div>

              <h3 className="text-3xl md:text-5xl font-display text-bone mb-2 leading-tight">
                {opening.title[locale]}
              </h3>
              <p className="text-base md:text-lg font-body text-tangerine font-bold mb-1">
                {formatDate(opening.date)} · {opening.time}–{opening.timeEnd} Uhr
              </p>
              <p className="text-sm font-body text-bone/60 mb-6">
                📍 {opening.location}
              </p>

              {/* Bottom row: price + CTA */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-body text-bone/50">ab</span>
                  <span className="text-3xl font-display text-tangerine">€49</span>
                </div>
                <Link
                  href={`/${locale}/festival/events`}
                  className="ml-auto btn-primary text-sm py-3 px-8"
                >
                  {locale === "de" ? "MEHR INFOS" : "MORE INFO"}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Other events: horizontal grid ── */}
        <div ref={gridReveal.ref} style={gridReveal.style} className="grid md:grid-cols-3 gap-5 mb-12">
          {others.map((event) => (
            <div
              key={event.id}
              className="group relative rounded-2xl overflow-hidden border border-bone/[0.08] hover:border-bone/20 transition-all duration-400"
            >
              {/* Image */}
              <div className="relative aspect-[4/3]">
                <Image
                  src={event.image}
                  alt={event.title[locale]}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  loading="lazy"
                  className="object-cover transition-transform duration-700 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-licorice via-licorice/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <span className={`self-start text-[9px] font-body font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3 ${TYPE_COLOR[event.type]}`}>
                  {TYPE_LABEL[event.type][locale]}
                </span>
                <p className="text-[11px] font-body text-tangerine font-bold mb-1 uppercase tracking-wider">
                  {formatDate(event.date, event.dateEnd)} · {event.time}
                </p>
                <h3 className="text-xl font-display text-bone mb-1 leading-tight">
                  {event.title[locale]}
                </h3>
                <p className="text-xs font-body text-bone/50 line-clamp-2 leading-relaxed">
                  {event.description[locale]}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Link href={`/${locale}/festival/events`} className="btn-secondary text-sm">
            {locale === "de" ? "ALLE EVENTS ANSEHEN" : "VIEW ALL EVENTS"}
          </Link>
        </div>
      </div>
    </section>
  );
}
