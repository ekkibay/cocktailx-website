"use client";

import { useLocale } from "next-intl";
import Image from "next/image";
import { events, type FestivalEvent } from "@/data/events";
import BlurText from "@/components/ui/BlurText";
import { useReveal } from "@/hooks/useReveal";

const dotColor: Record<FestivalEvent["type"], string> = {
  opening: "bg-hibiscus",
  festival: "bg-tangerine",
  closing: "bg-bay-of-many",
};

function EventCard({ event, index, locale }: { event: FestivalEvent; index: number; locale: "de" | "en" }) {
  const reveal = useReveal({ delay: index * 150 });
  const isEven = index % 2 === 0;
  const dateStr = new Date(event.date).toLocaleDateString(
    locale === "de" ? "de-DE" : "en-US",
    { day: "numeric", month: "long", year: "numeric" }
  );

  return (
    <div
      ref={reveal.ref}
      style={reveal.style}
      className={`relative flex items-start gap-6 md:gap-12 ${
        isEven ? "md:flex-row" : "md:flex-row-reverse"
      } pl-16 md:pl-0`}
    >
      {/* Dot */}
      <div
        className={`absolute left-8 md:left-1/2 top-2 w-5 h-5 rounded-full ${
          dotColor[event.type]
        } -translate-x-1/2 ring-4 ring-licorice z-10`}
      />

      {/* Card */}
      <div
        className={`flex-1 ${
          isEven ? "md:text-right" : "md:text-left"
        }`}
      >
        <div className="rounded-2xl overflow-hidden bg-jambalaya/30 border border-bone/5">
          {/* Large Image */}
          <div className="relative aspect-[16/10]">
            <Image
              src={event.image}
              alt={event.title[locale]}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              loading="lazy"
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="p-8">
            <p className="text-base font-body text-tangerine">
              {dateStr} &middot; {event.time}
            </p>
            <h3 className="text-3xl md:text-4xl font-display text-bone mt-3">
              {event.title[locale]}
            </h3>
            <p className="text-base font-body text-bone/70 mt-4 leading-relaxed">
              {event.description[locale]}
            </p>
            <div className="mt-6 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-hibiscus flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p className="text-sm font-body text-bone/50">
                {event.location}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="hidden md:block flex-1" />
    </div>
  );
}

export default function EventsPage() {
  const locale = useLocale() as "de" | "en";

  return (
    <main className="section-padding relative">
      {/* CI background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        <div style={{ position:"absolute", inset:0, backgroundImage:"url(/images/pattern-bg.svg)", backgroundSize:"200px 200px", backgroundRepeat:"repeat", opacity:0.18 }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(25,21,19,0.55) 0%, rgba(25,21,19,0.2) 25%, rgba(25,21,19,0.2) 75%, rgba(25,21,19,0.7) 100%)" }} />
        <div style={{ position:"absolute", top:"-200px", right:"-200px", width:"600px", height:"600px", borderRadius:"50%", background:"rgba(243,146,0,0.12)", filter:"blur(120px)" }} />
        <div style={{ position:"absolute", top:"30%", left:"-200px", width:"500px", height:"500px", borderRadius:"50%", background:"rgba(189,37,110,0.10)", filter:"blur(110px)" }} />
      </div>
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <BlurText
          text="EVENTS"
          tag="h1"
          className="text-4xl md:text-6xl lg:text-7xl font-display text-bone text-center mb-16"
          delay={80}
          duration={0.7}
        />

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-bone/10 -translate-x-1/2" />

          <div className="flex flex-col gap-20">
            {events.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} locale={locale} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
