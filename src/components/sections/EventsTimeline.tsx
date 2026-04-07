"use client";

import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { events } from "@/data/events";
import BlurText from "@/components/ui/BlurText";
import { useReveal } from "@/hooks/useReveal";

const TICKET_SALE_START = new Date("2026-04-13T00:00:00+02:00");
const ticketsAvailable = new Date() >= TICKET_SALE_START;
const daysUntilSale = Math.max(
  0,
  Math.ceil((TICKET_SALE_START.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
);

export default function EventsTimeline() {
  const locale = useLocale() as "de" | "en";
  const opening = events.find((e) => e.id === "opening-party")!;
  const otherEvents = events.filter((e) => e.id !== "opening-party");

  const featuredReveal = useReveal({ delay: 150, scale: 0.97 });
  const timeline = useReveal({ delay: 250 });

  const openingDateShort = new Date(opening.date).toLocaleDateString(
    locale === "de" ? "de-DE" : "en-US",
    { day: "numeric", month: "long", year: "numeric" }
  );

  const openingImage = "/images/opening-rooftop.png";

  return (
    <section className="section-padding">
      <div className="max-w-5xl mx-auto">
        <BlurText
          text="EVENTS"
          tag="h2"
          className="text-4xl md:text-5xl lg:text-7xl font-display text-bone text-center mb-16"
          delay={100}
          duration={0.8}
          animateBy="chars"
        />

        {/* ── Featured: Opening Party ── */}
        <div ref={featuredReveal.ref} style={featuredReveal.style} className="mb-16">
          <div className="group rounded-3xl overflow-hidden border border-bone/[0.08] hover:border-bone/[0.15] transition-all duration-300 bg-licorice/40">
            <div className="grid md:grid-cols-[1fr,1fr] gap-0">

              {/* Image — left half */}
              <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden">
                <Image
                  src={openingImage}
                  alt={opening.title[locale]}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    // fallback to bar image if rooftop not yet uploaded
                    (e.target as HTMLImageElement).src = opening.image;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-licorice/30 hidden md:block" />
                <div className="absolute inset-0 bg-gradient-to-t from-licorice/60 to-transparent md:hidden" />
              </div>

              {/* Content — right half */}
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-[10px] font-body font-bold uppercase tracking-wider bg-hibiscus text-bone px-3 py-1 rounded-full">
                    Opening Party
                  </span>
                  {!ticketsAvailable && (
                    <span className="text-[10px] font-body font-bold uppercase tracking-wider text-tangerine border border-tangerine/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-tangerine animate-pulse" />
                      {locale === "de" ? `Ab 13. April` : `From Apr 13`}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl md:text-3xl font-display text-bone mb-2">
                  {opening.title[locale]}
                </h3>
                <p className="text-sm font-body text-tangerine font-bold mb-1">
                  {openingDateShort} · {opening.time}–{opening.timeEnd} Uhr
                </p>
                <p className="text-xs font-body text-bone/55 mb-5">
                  📍 {opening.location}
                </p>

                {/* Key facts */}
                <div className="space-y-1.5 mb-6">
                  {opening.program?.slice(0, 4).map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm font-body text-bone/75">
                      <span className="text-tangerine text-xs">✦</span>
                      {item[locale]}
                    </div>
                  ))}
                </div>

                {/* Tickets + CTA */}
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs font-body text-bone/45">ab</span>
                    <span className="text-2xl font-display text-tangerine">€49</span>
                  </div>
                  {!ticketsAvailable && (
                    <span className="text-xs font-body text-bone/45">
                      {locale === "de" ? `Tickets in ${daysUntilSale} Tagen` : `Tickets in ${daysUntilSale} days`}
                    </span>
                  )}
                  <Link
                    href={`/${locale}/festival/events`}
                    className="ml-auto btn-primary text-sm py-3 px-7"
                  >
                    {locale === "de" ? "MEHR INFOS" : "MORE INFO"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Other events timeline ── */}
        <div ref={timeline.ref} style={timeline.style} className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-bone/10 -translate-x-1/2" />
          <div className="flex flex-col gap-12">
            {otherEvents.map((event, i) => {
              const isEven = i % 2 === 0;
              const dateLoc = "de-DE";
              const dateStr = event.dateEnd
                ? `${new Date(event.date).toLocaleDateString(dateLoc, { day: "numeric", month: "long" })}–${new Date(event.dateEnd).toLocaleDateString(dateLoc, { day: "numeric", month: "long", year: "numeric" })}`
                : new Date(event.date).toLocaleDateString(dateLoc, { day: "numeric", month: "long", year: "numeric" });
              const dotColors: Record<string, string> = {
                opening: "bg-hibiscus",
                festival: "bg-tangerine",
                closing: "bg-bone/60",
              };

              return (
                <div
                  key={event.id}
                  className={`relative flex items-start gap-6 md:gap-12 ${isEven ? "md:flex-row" : "md:flex-row-reverse"} pl-16 md:pl-0`}
                >
                  <div className={`absolute left-8 md:left-1/2 top-2 w-4 h-4 rounded-full ${dotColors[event.type]} -translate-x-1/2 ring-4 ring-licorice z-10`} />
                  <div className={`flex-1 ${isEven ? "md:text-right" : "md:text-left"}`}>
                    <div className="rounded-2xl bg-jambalaya/30 border border-bone/5 hover:border-bone/12 transition-colors p-6">
                      <p className="text-xs font-body text-tangerine mb-1">{dateStr} · {event.time}</p>
                      <h3 className="text-xl font-display text-bone mb-2">{event.title[locale]}</h3>
                      <p className="text-sm font-body text-bone/65 leading-relaxed mb-2">{event.description[locale]}</p>
                      <p className="text-xs font-body text-bone/40">📍 {event.location}</p>
                    </div>
                  </div>
                  <div className="hidden md:block flex-1" />
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center mt-12">
          <Link href={`/${locale}/festival/events`} className="btn-secondary text-sm">
            {locale === "de" ? "ALLE EVENTS ANSEHEN" : "VIEW ALL EVENTS"}
          </Link>
        </div>
      </div>
    </section>
  );
}
