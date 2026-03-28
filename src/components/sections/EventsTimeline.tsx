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

export default function EventsTimeline() {
  const locale = useLocale() as "de" | "en";
  const timeline = useReveal({ delay: 200 });

  return (
    <section className="section-padding">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <BlurText
          text="EVENTS"
          tag="h2"
          className="text-4xl md:text-5xl lg:text-7xl font-display text-bone text-center mb-16"
          delay={100}
          duration={0.8}
          animateBy="chars"
        />

        {/* Timeline */}
        <div ref={timeline.ref} style={timeline.style} className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-bone/10 -translate-x-1/2" />

          <div className="flex flex-col gap-16">
            {events.map((event, i) => {
              const isEven = i % 2 === 0;
              const fmt = { day: "numeric", month: "long", year: "numeric" } as const;
              const dateLoc = "de-DE";
              const dateStr = event.dateEnd
                ? `${new Date(event.date).toLocaleDateString(dateLoc, { day: "numeric", month: "long" })}–${new Date(event.dateEnd).toLocaleDateString(dateLoc, { day: "numeric", month: "long", year: "numeric" })}`
                : new Date(event.date).toLocaleDateString(dateLoc, fmt);

              return (
                <div
                  key={event.id}
                  className={`relative flex items-start gap-6 md:gap-12 ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  } pl-16 md:pl-0`}
                >
                  {/* Dot */}
                  <div
                    className={`absolute left-8 md:left-1/2 top-2 w-4 h-4 rounded-full ${
                      dotColor[event.type]
                    } -translate-x-1/2 ring-4 ring-licorice z-10`}
                  />

                  {/* Card */}
                  <div
                    className={`flex-1 ${
                      isEven ? "md:text-right" : "md:text-left"
                    }`}
                  >
                    <div className="rounded-2xl overflow-hidden bg-jambalaya/30 border border-bone/5 transition-all duration-300 ease-out hover:border-bone/15 hover:shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
                      {/* Image */}
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={event.image}
                          alt={event.title[locale]}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          loading="lazy"
                          className="object-cover opacity-25"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-licorice/80 to-licorice/60" />
                        <div className="absolute inset-0" style={{ backgroundImage: "url(/images/pattern-3.png)", backgroundSize: "160px 160px", backgroundRepeat: "repeat", opacity: 0.08 }} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
                          <span className="text-tangerine text-xs">✦</span>
                          <span className="font-display text-bone text-lg tracking-[0.3em]">COMING SOON</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <p className="text-sm font-body text-tangerine">
                          {dateStr} &middot; {event.time}
                        </p>
                        <h3 className="text-2xl font-display text-bone mt-2">
                          {event.title[locale]}
                        </h3>
                        <p className="text-sm font-body text-bone/80 mt-2">
                          {event.description[locale]}
                        </p>
                        <p className="text-xs font-body text-bone/55 mt-3">
                          {event.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Spacer for the other side */}
                  <div className="hidden md:block flex-1" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
