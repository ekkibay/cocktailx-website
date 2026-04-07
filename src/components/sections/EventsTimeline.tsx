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
          <div className="relative rounded-3xl overflow-hidden group cursor-pointer">
            {/* Image */}
            <div className="relative aspect-[16/7] overflow-hidden">
              <Image
                src={opening.image}
                alt={opening.title[locale]}
                fill
                sizes="100vw"
                loading="lazy"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-licorice via-licorice/50 to-licorice/10" />
            </div>

            {/* Overlay content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-[10px] font-body font-bold uppercase tracking-wider bg-hibiscus text-bone px-3 py-1 rounded-full">
                  {locale === "de" ? "Opening Party" : "Opening Party"}
                </span>
                {!ticketsAvailable && (
                  <span className="text-[10px] font-body font-bold uppercase tracking-wider text-tangerine bg-tangerine/10 border border-tangerine/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-tangerine animate-pulse" />
                    {locale === "de"
                      ? `Tickets ab 13. April · noch ${daysUntilSale} Tage`
                      : `Tickets from Apr 13 · ${daysUntilSale} days to go`}
                  </span>
                )}
              </div>
              <h3 className="text-2xl md:text-4xl font-display text-bone mb-2">
                {opening.title[locale]}
              </h3>
              <p className="text-sm font-body text-tangerine font-bold mb-1">
                {openingDateShort} · {opening.time}–{opening.timeEnd} Uhr
              </p>
              <p className="text-sm font-body text-bone/65 mb-6">
                📍 {opening.location}
              </p>

              {/* Program pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {opening.program?.map((item, i) => (
                  <span key={i} className="text-xs font-body text-bone/75 bg-bone/8 border border-bone/15 px-3 py-1 rounded-full">
                    {item[locale]}
                  </span>
                ))}
              </div>

              {/* Tickets row */}
              <div className="flex flex-wrap items-center gap-4 md:gap-8">
                {opening.tickets?.map((ticket, i) => (
                  <div key={i} className="flex items-baseline gap-2">
                    <span className="text-xs font-body text-bone/55">{ticket.label[locale]}</span>
                    <span className={`text-2xl font-display ${i === 0 ? "text-tangerine" : "text-bone/70"}`}>
                      €{ticket.price}
                    </span>
                    {i === 0 && ticket.badge && (
                      <span className="text-[9px] font-body font-bold uppercase tracking-wider bg-tangerine text-licorice px-2 py-0.5 rounded-full">
                        {ticket.badge}
                      </span>
                    )}
                  </div>
                ))}
                <Link
                  href={`/${locale}/festival/events`}
                  className="ml-auto btn-primary text-sm py-3 px-7"
                  onClick={(e) => e.stopPropagation()}
                >
                  {locale === "de" ? "MEHR INFOS" : "MORE INFO"}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Other events (compact timeline) ── */}
        <div ref={timeline.ref} style={timeline.style} className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-bone/10 -translate-x-1/2" />

          <div className="flex flex-col gap-10">
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
                    <div className="rounded-2xl overflow-hidden bg-jambalaya/30 border border-bone/5 hover:border-bone/12 transition-colors duration-300">
                      <div className="p-5">
                        <p className="text-xs font-body text-tangerine mb-1">{dateStr} · {event.time}</p>
                        <h3 className="text-xl font-display text-bone mb-1">{event.title[locale]}</h3>
                        <p className="text-sm font-body text-bone/70 mb-2">{event.description[locale]}</p>
                        <p className="text-xs font-body text-bone/40">📍 {event.location}</p>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block flex-1" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Link to full events page */}
        <div className="flex justify-center mt-12">
          <Link href={`/${locale}/festival/events`} className="btn-secondary text-sm">
            {locale === "de" ? "ALLE EVENTS ANSEHEN" : "VIEW ALL EVENTS"}
          </Link>
        </div>
      </div>
    </section>
  );
}
