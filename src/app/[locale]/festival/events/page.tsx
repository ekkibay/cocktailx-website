"use client";

import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { events } from "@/data/events";
import BlurText from "@/components/ui/BlurText";
import { useReveal } from "@/hooks/useReveal";

const TICKET_SALE_START = new Date("2026-04-13T00:00:00+02:00");
const ticketsAvailable = new Date() >= TICKET_SALE_START;
const OPENING_END = new Date("2026-05-14T18:00:00+02:00");
const openingPast = new Date() >= OPENING_END;

function Check() {
  return (
    <svg className="w-4 h-4 text-tangerine flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function EventsPage() {
  const locale = useLocale() as "de" | "en";
  const opening = events.find((e) => e.id === "opening-party")!;
  const closing = events.find((e) => e.id === "closing-awards")!;
  const otherEvents = events.filter((e) => e.id !== "opening-party");

  const heroReveal = useReveal({ delay: 150 });
  const programReveal = useReveal({ delay: 200 });
  const ticketReveal = useReveal({ delay: 250 });
  const timelineReveal = useReveal({ delay: 200 });

  const openingDate = new Date(opening.date).toLocaleDateString(
    locale === "de" ? "de-DE" : "en-US",
    { weekday: "long", day: "numeric", month: "long", year: "numeric" }
  );

  const daysUntilSale = Math.ceil(
    (TICKET_SALE_START.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

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
          {locale === "de" ? "Opening · Festival · Closing" : "Opening · Festival · Closing"}
        </p>

        {/* ══════════════════════════════════════════
            FEATURED: OPENING PARTY
        ══════════════════════════════════════════ */}
        <div className="mb-24">
          {/* Hero Image */}
          <div className="relative rounded-3xl overflow-hidden aspect-[16/7] mb-0">
            <Image
              src={opening.image}
              alt={opening.title[locale]}
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-licorice via-licorice/40 to-licorice/10" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <span className="inline-block text-[10px] font-body font-bold uppercase tracking-wider bg-hibiscus text-bone px-3 py-1 rounded-full mb-4">
                {locale === "de" ? "Featured Event" : "Featured Event"}
              </span>
              <h2 className="text-3xl md:text-5xl font-display text-bone mb-2">
                {opening.title[locale]}
              </h2>
              <p className="text-base font-body text-tangerine font-bold">
                {openingDate} · {opening.time}–{opening.timeEnd} Uhr
              </p>
              <p className="text-sm font-body text-bone/70 mt-1">
                📍 {opening.location}
              </p>
            </div>
          </div>

          {/* Content grid */}
          <div ref={heroReveal.ref} style={heroReveal.style} className="grid md:grid-cols-2 gap-0 bg-licorice/60 border border-bone/10 rounded-b-3xl border-t-0 overflow-hidden">

            {/* Left: Description + Vibe */}
            <div className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-bone/10">
              <p className="text-sm font-body font-bold uppercase tracking-wider text-tangerine/80 mb-3">
                {locale === "de" ? "Das Event" : "The Event"}
              </p>
              <p className="font-body text-bone/80 leading-relaxed mb-6">
                {opening.description[locale]}
              </p>
              {opening.vibe && (
                <div className="flex flex-wrap gap-2">
                  {opening.vibe[locale].split(" · ").map((tag) => (
                    <span key={tag} className="text-xs font-body text-bone/60 bg-bone/5 border border-bone/10 px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Program */}
            <div ref={programReveal.ref} style={programReveal.style} className="p-8 md:p-10">
              <p className="text-sm font-body font-bold uppercase tracking-wider text-tangerine/80 mb-4">
                {locale === "de" ? "Programm" : "Programme"}
              </p>
              <ul className="space-y-3">
                {opening.program?.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 font-body text-sm text-bone/85">
                    <Check />
                    {item[locale]}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tickets */}
          <div ref={ticketReveal.ref} style={ticketReveal.style} className="mt-6">
            <div className="rounded-2xl border border-bone/10 bg-licorice/40 p-8 md:p-10">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">

                {/* Ticket cards */}
                <div className="flex-1">
                  <p className="text-sm font-body font-bold uppercase tracking-wider text-tangerine/80 mb-5">
                    {locale === "de" ? "Tickets" : "Tickets"}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {opening.tickets?.map((ticket, i) => (
                      <div
                        key={i}
                        className={`relative rounded-xl border p-5 ${
                          i === 0 ? "border-tangerine/40 bg-tangerine/5" : "border-bone/10 bg-bone/[0.03]"
                        }`}
                      >
                        {ticket.badge && (
                          <span className="absolute -top-2.5 left-4 text-[10px] font-body font-bold uppercase tracking-wider bg-tangerine text-licorice px-2.5 py-0.5 rounded-full">
                            {ticket.badge}
                          </span>
                        )}
                        <p className="font-display text-bone text-sm tracking-wider mb-1 mt-1">
                          {ticket.label[locale]}
                        </p>
                        <p className="font-display text-tangerine text-4xl mb-2">
                          €{ticket.price}
                        </p>
                        {ticket.note && (
                          <p className="text-xs font-body text-bone/55 leading-snug">
                            {ticket.note[locale]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="md:min-w-[220px] flex flex-col items-center justify-center text-center md:border-l md:border-bone/10 md:pl-10 gap-4">
                  {openingPast ? (
                    <>
                      <div className="w-full rounded-full border border-bone/15 py-4 text-sm font-body font-bold uppercase tracking-wider text-bone/30 cursor-not-allowed text-center">
                        {locale === "de" ? "VERANSTALTUNG BEENDET" : "EVENT ENDED"}
                      </div>
                      <p className="text-xs font-body text-bone/40">
                        {locale === "de" ? "Das Opening hat stattgefunden" : "The opening has taken place"}
                      </p>
                    </>
                  ) : ticketsAvailable ? (
                    <>
                      <a
                        href="https://cocktailx.app/opening-event"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary w-full text-sm py-4"
                      >
                        {locale === "de" ? "TICKET SICHERN" : "GET TICKET"}
                      </a>
                      <p className="text-xs font-body text-bone/40">
                        {locale === "de" ? "Sichere dir jetzt deinen Platz" : "Secure your spot now"}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-full rounded-full border border-bone/20 py-4 text-sm font-body font-bold uppercase tracking-wider text-bone/40 cursor-not-allowed text-center">
                        {locale === "de" ? "TICKETS BALD VERFÜGBAR" : "TICKETS COMING SOON"}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-body text-tangerine/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-tangerine animate-pulse" />
                        {locale === "de"
                          ? `Verkauf startet in ${daysUntilSale} ${daysUntilSale === 1 ? "Tag" : "Tagen"}`
                          : `Sale starts in ${daysUntilSale} ${daysUntilSale === 1 ? "day" : "days"}`}
                      </div>
                      <p className="text-xs font-body text-bone/40">
                        {locale === "de" ? "Ab 13. April 2026" : "From April 13, 2026"}
                      </p>
                    </>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            CLOSING, AWARD NIGHT
        ══════════════════════════════════════════ */}
        <div className="mb-24">
          {/* Hero */}
          <div className="relative rounded-3xl overflow-hidden aspect-[16/7] mb-0">
            <Image src={closing.image} alt={closing.title[locale]} fill sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-licorice via-licorice/50 to-licorice/15" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <span className="inline-block text-[10px] font-body font-bold uppercase tracking-wider bg-everglade text-bone px-3 py-1 rounded-full mb-4">
                Closing & Award Night
              </span>
              {closing.tagline && (
                <p className="text-sm md:text-base font-body font-bold uppercase tracking-[0.18em] text-tangerine/90 mb-3">
                  {closing.tagline[locale]}
                </p>
              )}
              <h2 className="text-3xl md:text-5xl font-display text-bone mb-3 leading-tight">{closing.title[locale]}</h2>
              <p className="text-base md:text-lg font-body text-bone/85 max-w-2xl mb-3">
                {closing.description[locale]}
              </p>
              <p className="text-sm font-body text-bone/70">
                📅 {new Date(closing.date).toLocaleDateString(locale === "de" ? "de-DE" : "en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · {closing.time}–{closing.timeEnd} Uhr · 📍 {closing.location}
              </p>
            </div>
          </div>

          {/* Eckdaten */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 bg-licorice/60 border border-bone/10 rounded-b-3xl border-t-0 overflow-hidden">
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

          {/* Closing Tickets */}
          <div className="mt-6 rounded-2xl border border-bone/10 bg-licorice/40 p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
              <div className="flex-1">
                <p className="text-sm font-body font-bold uppercase tracking-wider text-tangerine/80 mb-5">
                  {locale === "de" ? "Tickets" : "Tickets"}
                </p>
                <div className="grid sm:grid-cols-3 gap-4">
                  {closing.tickets?.map((ticket, i) => (
                    <div key={i} className={`relative rounded-xl border p-5 ${i === 0 ? "border-tangerine/40 bg-tangerine/5" : "border-bone/10 bg-bone/[0.03]"}`}>
                      {ticket.badge && (
                        <span className="absolute -top-2.5 left-4 text-[10px] font-body font-bold uppercase tracking-wider bg-tangerine text-licorice px-2.5 py-0.5 rounded-full">
                          {ticket.badge}
                        </span>
                      )}
                      <p className="font-display text-bone text-sm tracking-wider mb-1 mt-1">{ticket.label[locale]}</p>
                      <p className="font-display text-tangerine text-4xl mb-2">€{ticket.price}</p>
                      {ticket.note && <p className="text-xs font-body text-bone/55 leading-snug">{ticket.note[locale]}</p>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:min-w-[220px] flex flex-col items-center justify-center text-center md:border-l md:border-bone/10 md:pl-10 gap-4">
                <a href="https://cocktailx.app/closing-event" target="_blank" rel="noopener noreferrer" className="btn-primary w-full text-sm py-4">
                  {locale === "de" ? "TICKET SICHERN" : "GET TICKET"}
                </a>
                <p className="text-xs font-body text-bone/40">
                  {locale === "de" ? "Limitiert auf 500 Plätze" : "Limited to 500 seats"}
                </p>
              </div>
            </div>
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
                  ? `${new Date(event.date).toLocaleDateString(dateLoc, { day: "numeric", month: "long" })}–${new Date(event.dateEnd).toLocaleDateString(dateLoc, { day: "numeric", month: "long", year: "numeric" })}`
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
