"use client";

import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { events } from "@/data/events";
import BlurText from "@/components/ui/BlurText";
import { useReveal } from "@/hooks/useReveal";

function Check() {
  return (
    <svg className="w-4 h-4 text-tangerine flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function EventsPage() {
  const locale = useLocale() as "de" | "en";
  const closing = events.find((e) => e.id === "closing-awards")!;
  const otherEvents = events.filter((e) => e.id !== "opening-party" && e.id !== "closing-awards");

  const timelineReveal = useReveal({ delay: 200 });

  return (
    <main className="min-h-screen relative">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(/images/pattern-bg.svg)", backgroundSize: "200px 200px", backgroundRepeat: "repeat", opacity: 0.18 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(25,21,19,0.55) 0%, rgba(25,21,19,0.2) 30%, rgba(25,21,19,0.2) 70%, rgba(25,21,19,0.7) 100%)" }} />
        <div style={{ position: "absolute", top: "-200px", right: "-200px", width: "600px", height: "600px", borderRadius: "50%", background: "rgba(243,146,0,0.10)", filter: "blur(120px)" }} />
        <div style={{ position: "absolute", top: "40%", left: "-200px", width: "500px", height: "500px", borderRadius: "50%", background: "rgba(189,37,110,0.08)", filter: "blur(110px)" }} />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 pt-36 pb-24">

        {/* ── Page Headline ── */}
        <BlurText
          text="EVENTS"
          tag="h1"
          className="text-5xl md:text-7xl font-display text-bone text-center mb-4"
          delay={80}
          duration={0.7}
        />
        <p className="text-center text-sm font-body text-bone/55 mb-16">
          {locale === "de" ? "Festival · Closing" : "Festival · Closing"}
        </p>

        {/* ══════════════════════════════════════════
            FEATURED: CLOSING, AWARD NIGHT
        ══════════════════════════════════════════ */}
        <div className="mb-24">
          {/* Hero, portrait image side-by-side with content */}
          <div className="grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-0 rounded-3xl overflow-hidden bg-licorice/60 border border-bone/10">
            {/* Portrait image */}
            <div className="relative aspect-[3/4] md:aspect-auto md:min-h-[520px]">
              <Image
                src={closing.image}
                alt={closing.title[locale]}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-licorice/30 via-transparent to-licorice/10 md:bg-gradient-to-r md:from-transparent md:to-licorice/40" />
            </div>

            {/* Content side */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              {/* Presented-by pill */}
              {closing.presentedBy && (
                <div className="inline-flex self-start items-center gap-3 px-4 py-2 rounded-full bg-licorice/80 backdrop-blur-md border border-bone/15 mb-6">
                  <span className="text-[10px] font-body font-bold uppercase tracking-[0.18em] text-bone/70">
                    {locale === "de" ? "Presented by" : "Presented by"}
                  </span>
                  <Image
                    src={closing.presentedBy.logo}
                    alt={closing.presentedBy.name}
                    width={796}
                    height={72}
                    sizes="(max-width: 768px) 200px, 300px"
                    quality={95}
                    className="h-6 md:h-7 w-auto object-contain"
                  />
                </div>
              )}

              <span className="inline-block self-start text-[10px] font-body font-bold uppercase tracking-wider bg-everglade text-bone px-3 py-1 rounded-full mb-4">
                Closing & Award Night
              </span>
              {closing.tagline && (
                <p className="text-sm md:text-base font-body font-bold uppercase tracking-[0.18em] text-tangerine/90 mb-3">
                  {closing.tagline[locale]}
                </p>
              )}
              <h2 className="text-3xl md:text-5xl font-display text-bone mb-4 leading-tight">
                {closing.title[locale]}
              </h2>
              <p className="text-sm font-body text-bone/70">
                📅 {new Date(closing.date).toLocaleDateString(locale === "de" ? "de-DE" : "en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · {closing.time}-{closing.timeEnd} Uhr
                <br className="md:hidden" />
                <span className="hidden md:inline"> · </span>
                📍 {closing.location}
              </p>
            </div>
          </div>

          {/* Eckdaten */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 mt-4 bg-licorice/60 border border-bone/10 rounded-2xl overflow-hidden">
            {[
              { label: locale === "de" ? "Datum" : "Date", value: "31.05.2026" },
              { label: locale === "de" ? "Gäste" : "Guests", value: `${closing.capacity ?? 500}` },
              { label: "Dresscode", value: closing.dresscode ?? "Black Tie" },
              { label: "Location", value: "Brenner Operngrill" },
            ].map((cell, i) => (
              <div key={i} className={`p-5 md:p-7 text-center ${i < 3 ? "border-r border-bone/10" : ""} ${i < 2 ? "border-b md:border-b-0 border-bone/10" : ""}`}>
                <p className="text-[10px] font-body font-bold uppercase tracking-[0.15em] text-tangerine/70 mb-1.5">
                  {cell.label}
                </p>
                <p className="font-display text-base md:text-xl text-bone leading-tight">{cell.value}</p>
              </div>
            ))}
          </div>

          {/* Awards-Block */}
          {closing.awards && (
            <div className="mt-6 grid md:grid-cols-2 gap-5">
              {closing.awards.map((award, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-tangerine/25 bg-gradient-to-br from-tangerine/[0.06] to-bone/[0.02] p-7 md:p-8"
                >
                  <div className="w-11 h-11 rounded-full bg-tangerine/15 border border-tangerine/30 flex items-center justify-center mb-4">
                    {award.icon === "trophy" ? (
                      <svg className="w-5 h-5 text-tangerine" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-4.5A3.375 3.375 0 0019.875 10.875 3.375 3.375 0 0016.5 7.5h0V3.75m-9 15v-4.5A3.375 3.375 0 014.125 10.875 3.375 3.375 0 017.5 7.5h0V3.75m0 0h9m-9 0H6a2.25 2.25 0 00-2.25 2.25v0M16.5 3.75H18a2.25 2.25 0 012.25 2.25v0" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-tangerine" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    )}
                  </div>
                  <h3 className="font-display text-xl md:text-2xl text-bone mb-3 leading-tight">
                    {award.title[locale]}
                  </h3>
                  <p className="text-sm font-body text-bone/75 leading-relaxed">
                    {award.body[locale]}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Was im Ticket steckt */}
          {closing.inclusions && (
            <div className="mt-6 rounded-2xl border border-bone/10 bg-licorice/40 p-7 md:p-10">
              <p className="text-sm font-body font-bold uppercase tracking-wider text-tangerine/80 mb-6">
                {locale === "de" ? "Was im Ticket steckt" : "What's included"}
              </p>
              <ul className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                {closing.inclusions.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 pb-4 border-b border-bone/5 last:border-b-0 md:[&:nth-last-child(2)]:border-b-0">
                    <Check />
                    <div className="min-w-0">
                      <p className="font-body text-sm font-bold text-bone/95">{item.label[locale]}</p>
                      <p className="text-xs font-body text-bone/55 leading-relaxed mt-0.5">{item.detail[locale]}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Danke, die Closing & Award Night ist gelaufen */}
          <div className="mt-6 rounded-2xl border border-everglade/30 bg-everglade/[0.06] p-8 md:p-12 text-center">
            <p className="text-2xl md:text-3xl font-display text-bone mb-3">
              {locale === "de" ? "Vielen Dank für die tolle Veranstaltung!" : "Thank you for the wonderful event!"}
            </p>
            <p className="text-sm font-body text-bone/65 max-w-xl mx-auto leading-relaxed">
              {locale === "de"
                ? "Die Closing & Award Night war ein unvergesslicher Abschluss, danke an alle Gäste, Bars und Partner, die mit uns gefeiert haben."
                : "The Closing & Award Night was an unforgettable finale, thank you to all the guests, bars and partners who celebrated with us."}
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            OTHER EVENTS TIMELINE
        ══════════════════════════════════════════ */}
        <div ref={timelineReveal.ref} style={timelineReveal.style}>
          <h2 className="text-2xl md:text-3xl font-display text-bone text-center mb-12">
            {locale === "de" ? "FESTIVAL PROGRAMM" : "FESTIVAL PROGRAMME"}
          </h2>

          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-bone/10 -translate-x-1/2" />
            <div className="flex flex-col gap-12">
              {otherEvents.map((event, i) => {
                const isEven = i % 2 === 0;
                const fmt = { day: "numeric", month: "long", year: "numeric" } as const;
                const dateLoc = locale === "de" ? "de-DE" : "en-US";
                const dateStr = event.dateEnd
                  ? `${new Date(event.date).toLocaleDateString(dateLoc, { day: "numeric", month: "long" })}-${new Date(event.dateEnd).toLocaleDateString(dateLoc, { day: "numeric", month: "long", year: "numeric" })}`
                  : new Date(event.date).toLocaleDateString(dateLoc, fmt);

                const dotColors: Record<string, string> = {
                  opening: "bg-hibiscus",
                  festival: "bg-tangerine",
                  closing: "bg-bone/60",
                };

                return (
                  <div
                    key={event.id}
                    className={`relative flex items-start gap-6 md:gap-12 ${isEven ? "md:flex-row" : "md:flex-row-reverse"} pl-12 md:pl-0`}
                  >
                    <div className={`absolute left-4 md:left-1/2 top-2 w-4 h-4 rounded-full ${dotColors[event.type]} -translate-x-1/2 ring-4 ring-licorice z-10`} />
                    <div className={`flex-1 ${isEven ? "md:text-right" : "md:text-left"}`}>
                      <div className="rounded-2xl border border-bone/[0.08] bg-licorice/40 overflow-hidden hover:border-bone/15 transition-colors">
                        <div className="relative aspect-[16/7] w-full">
                          <Image
                            src={event.image}
                            alt={event.title[locale]}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            loading="lazy"
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-licorice/60 to-transparent" />
                        </div>
                        <div className="p-6">
                          <p className="text-xs font-body text-tangerine font-bold mb-1">{dateStr} · {event.time}</p>
                          <h3 className="text-xl font-display text-bone mb-2">{event.title[locale]}</h3>
                          <p className="text-sm font-body text-bone/70 leading-relaxed mb-3">{event.description[locale]}</p>
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
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20 pt-12 border-t border-bone/10">
          <p className="text-sm font-body text-bone/55 mb-6">
            {locale === "de"
              ? "Hole dir das Festival-Ticket und sei bei allen 18 Tagen dabei."
              : "Get the festival ticket and join all 18 days."}
          </p>
          <Link href={`/${locale}/shop`} className="btn-primary text-sm px-10 py-4">
            {locale === "de" ? "FESTIVAL TICKET KAUFEN" : "BUY FESTIVAL TICKET"}
          </Link>
        </div>

      </div>
    </main>
  );
}
