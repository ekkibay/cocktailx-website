"use client";

import { useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import BlurText from "@/components/ui/BlurText";
import { useReveal } from "@/hooks/useReveal";
import { TICKET_TIERS } from "@/data/ticket-tiers";

const FESTIVAL_DATE = new Date("2026-05-13T19:00:00+02:00");
const NORMAL_PRICE = 15;
const FESTIVAL_PRICE = 6;
const SAVINGS_PER = NORMAL_PRICE - FESTIVAL_PRICE;

const tiers = [
  { key: "earlyBird", price: TICKET_TIERS.earlyBird, productId: "passport-early-bird", soldOutDaysBefore: 42 },
  { key: "regular", price: TICKET_TIERS.regular, productId: "passport-regular", soldOutDaysBefore: 13 },
  { key: "late", price: TICKET_TIERS.late, productId: "passport-late", soldOutDaysBefore: -18 },
];

function getTierStatus(soldOutDaysBefore: number) {
  const cutoff = new Date(FESTIVAL_DATE);
  cutoff.setDate(cutoff.getDate() - soldOutDaysBefore);
  return new Date() >= cutoff ? "soldOut" : "available";
}

function getDaysLeft(soldOutDaysBefore: number): number {
  const cutoff = new Date(FESTIVAL_DATE);
  cutoff.setDate(cutoff.getDate() - soldOutDaysBefore);
  return Math.max(0, Math.ceil((cutoff.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
}

const featureIcons = [
  <svg key="bars" className="w-5 h-5 text-tangerine" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>,
  <svg key="drinks" className="w-5 h-5 text-tangerine" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M5 14.5h14m-7 0v6.5m-3.5 0h7" /></svg>,
  <svg key="days" className="w-5 h-5 text-tangerine" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>,
  <svg key="stamps" className="w-5 h-5 text-tangerine" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-4.5A3.375 3.375 0 0019.875 10.875 3.375 3.375 0 0016.5 7.5h0V3.75m-9 15v-4.5A3.375 3.375 0 014.125 10.875 3.375 3.375 0 017.5 7.5h0V3.75m0 0h9m-9 0H6a2.25 2.25 0 00-2.25 2.25v0M16.5 3.75H18a2.25 2.25 0 012.25 2.25v0" /></svg>,
  <svg key="events" className="w-5 h-5 text-tangerine" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>,
];
// ── Other ticket types ────────────────────────────────────────────────────

type OtherTicketType = {
  key: string;
  name: { de: string; en: string };
  tagline: { de: string; en: string };
  description?: { de: string; en: string };
  badge: { de: string | null; en: string | null };
  accent: string;
  price?: number;
  strikePrice?: number;
  perPerson?: number | null;
  groupSize?: number;
  externalUrl?: string;
  past?: boolean;
  featured?: boolean;
};

const OTHER_TICKETS: OtherTicketType[] = [
  {
    key: "closing-event",
    name: { de: "Closing, Award Night", en: "Closing, Award Night" },
    tagline: { de: "31. Mai · Brenner Operngrill · 19–23 Uhr", en: "May 31 · Brenner Operngrill · 7–11 pm" },
    description: { de: "Wenige Tickets verfügbar · Nächster Preis: 99 €", en: "Few tickets left · Next price: €99" },
    badge: { de: "FAST WEG", en: "SELLING OUT" },
    accent: "everglade",
    price: 89,
    externalUrl: "https://cocktailx.app/closing-event",
    featured: true,
  },
  {
    key: "group",
    name: { de: "Group Ticket", en: "Group Ticket" },
    tagline: { de: "4 Passports zum Preis von 3", en: "4 Passports for the price of 3" },
    badge: { de: null, en: null },
    accent: "tangerine",
    price: 102,
    strikePrice: 136,
    perPerson: 25.50,
    groupSize: 4,
  },
  {
    key: "opening-event",
    name: { de: "Opening Event", en: "Opening Event" },
    tagline: { de: "14. Mai · Andaz München · 14–18 Uhr", en: "May 14 · Andaz München · 2–6 pm" },
    description: { de: "Drinks & Canapés inklusive · Live DJ · Rooftop", en: "Drinks & canapés included · Live DJ · Rooftop" },
    badge: { de: "VORBEI", en: "ENDED" },
    accent: "hibiscus",
    price: 59,
    externalUrl: "https://cocktailx.app/opening-event",
    past: true,
  },
];

// ── Savings Calculator (inline) ──────────────────────────────────────────

const CALC_TIERS = [
  { key: "late", price: TICKET_TIERS.late, label: { de: "Festival Ticket", en: "Festival Ticket" } },
] as const;

function SavingsCalculator({ locale }: { locale: "de" | "en" }) {
  const [count, setCount] = useState(5);
  const tier = CALC_TIERS[0];
  const ticketPrice = tier.price;
  const barTotal = count * NORMAL_PRICE;
  const festivalTotal = ticketPrice + count * FESTIVAL_PRICE;
  const savings = barTotal - festivalTotal;
  const breakEven = (ticketPrice / SAVINGS_PER).toFixed(1);

  return (
    <div className="rounded-2xl bg-licorice/90 border border-bone/10 p-6 md:p-8">
      <p className="text-[11px] font-body font-bold uppercase tracking-[0.15em] text-tangerine mb-1">
        {locale === "de" ? "Lohnt sich das Ticket?" : "Is the ticket worth it?"}
      </p>
      <h3 className="text-xl md:text-2xl font-display text-bone mb-5">
        {locale === "de" ? "Dein Spar-Rechner" : "Your Savings Calculator"}
      </h3>

      {/* Current ticket label */}
      <div className="mb-6">
        <p className="text-xs font-body text-bone/55 uppercase tracking-wider mb-2">Ticket</p>
        <span className="inline-block text-xs font-body px-3 py-1.5 rounded-full border bg-tangerine text-licorice border-tangerine font-bold">
          {tier.label[locale]} · €{tier.price}
        </span>
      </div>

      <label className="block text-sm font-body text-bone/80 mb-3">
        {locale === "de" ? "Wie viele Cocktails planst du an 18 Abenden zu trinken? " : "How many cocktails are you planning over 18 nights? "}
        <span className="text-bone font-bold">{count}</span>
      </label>
      <input
        type="range" min={1} max={18} step={1} value={count}
        onChange={(e) => setCount(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-tangerine bg-bone/10 mb-6"
      />

      <div className="space-y-3 mb-5">
        <div className="flex justify-between items-center text-sm font-body">
          <span className="text-bone/65">
            {locale === "de" ? `Normale Bar (${count} \u00d7 15 \u20ac)` : `Normal bar (${count} \u00d7 \u20ac15)`}
          </span>
          <span className="text-bone/80 font-bold tabular-nums">
            {locale === "de" ? `${barTotal} \u20ac` : `\u20ac${barTotal}`}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm font-body">
          <span className="text-bone/65">
            {locale === "de"
              ? `Festival (${ticketPrice} \u20ac + ${count} \u00d7 6 \u20ac)`
              : `Festival (\u20ac${ticketPrice} + ${count} \u00d7 \u20ac6)`}
          </span>
          <span className="text-bone font-bold tabular-nums">
            {locale === "de" ? `${festivalTotal} \u20ac` : `\u20ac${festivalTotal}`}
          </span>
        </div>
        <div className="h-px bg-bone/10" />
        <div className="flex justify-between items-center">
          <span className="text-sm font-body text-bone/65">
            {locale === "de" ? "Deine Ersparnis" : "Your savings"}
          </span>
          <span className={`text-2xl md:text-3xl font-display tabular-nums transition-colors ${savings > 0 ? "text-emerald-400" : "text-hibiscus"}`}>
            {savings > 0
              ? locale === "de" ? `+ ${savings} \u20ac` : `+ \u20ac${savings}`
              : locale === "de" ? `\u2212 ${Math.abs(savings)} \u20ac` : `\u2212 \u20ac${Math.abs(savings)}`}
          </span>
        </div>
      </div>

      {/* Threshold banner */}
      {savings > 0 ? (
        <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/[0.08] p-4 mb-3">
          <p className="text-sm font-body font-bold text-emerald-300 text-center mb-3">
            {locale === "de"
              ? `Du sparst ${savings} \u20ac \u2014 Ticket lohnt sich.`
              : `You save \u20ac${savings} \u2014 the ticket pays off.`}
          </p>
          <a
            href={`/${locale}/shop#passport`}
            className="block w-full text-center btn-primary text-sm py-3"
          >
            {locale === "de" ? "Ticket sichern" : "Secure your ticket"}
          </a>
        </div>
      ) : (
        <div className="rounded-xl border border-hibiscus/30 bg-hibiscus/[0.08] p-4 mb-3">
          <p className="text-sm font-body text-bone/85 text-center">
            {locale === "de"
              ? `Lohnt sich noch nicht \u2014 aber ein Drink in einer Top-Bar kostet sonst ${NORMAL_PRICE}\u201316 \u20ac.`
              : `Not worth it yet \u2014 but a drink in a top bar usually costs \u20ac${NORMAL_PRICE}\u201316.`}
          </p>
        </div>
      )}

      <p className="text-xs font-body text-bone/35 text-center">
        {locale === "de"
          ? `Ab ${breakEven} Cocktails lohnt sich das Ticket \u2014 du bist bei ${count}.`
          : `The ticket pays off after ${breakEven} cocktails \u2014 you're at ${count}.`}
      </p>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────

export default function Tickets() {
  const t = useTranslations("tickets");
  const locale = useLocale() as "de" | "en";

  const subtitle = useReveal<HTMLParagraphElement>({ delay: 150 });
  const cards = useReveal({ delay: 250, scale: 0.95 });
  const benefits = useReveal({ delay: 350 });
  const otherCards = useReveal({ delay: 300 });
  const calcReveal = useReveal({ delay: 200 });

  const features = [t("feature1"), t("feature2"), t("feature3"), t("feature4"), t("feature5")];

  const tiersWithStatus = useMemo(() => {
    return tiers.map((tier) => ({
      ...tier,
      status: getTierStatus(tier.soldOutDaysBefore),
      daysLeft: getDaysLeft(tier.soldOutDaysBefore),
    }));
  }, []);

  return (
    <section id="tickets" className="py-20 bg-licorice relative">
      {/* CI background — same as Hero */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        <div style={{ position:"absolute", inset:0, backgroundImage:"url(/images/pattern-bg.svg)", backgroundSize:"200px 200px", backgroundRepeat:"repeat", opacity:0.45 }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(26,18,11,0.4) 0%, rgba(26,18,11,0.15) 30%, rgba(26,18,11,0.15) 70%, rgba(26,18,11,0.5) 100%)" }} />
        <div style={{ position:"absolute", top:"-150px", right:"-150px", width:"500px", height:"500px", borderRadius:"50%", background:"rgba(243,146,0,0.10)", filter:"blur(120px)" }} />
        <div style={{ position:"absolute", bottom:"-100px", left:"-150px", width:"450px", height:"450px", borderRadius:"50%", background:"rgba(189,37,110,0.08)", filter:"blur(110px)" }} />
      </div>

      <div className="max-w-5xl mx-auto px-4 relative">
        {/* Headline */}
        <BlurText
          text={t("headline")}
          tag="h2"
          className="text-3xl md:text-4xl font-display text-bone text-center mb-3"
          delay={70}
          duration={0.7}
        />
        <p ref={subtitle.ref} style={subtitle.style} className="text-center text-sm md:text-base font-body text-bone/80 mb-10">
          {t("subtitle")}
        </p>

        {/* Scarcity badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-tangerine/40 bg-tangerine/5 text-xs font-body font-bold uppercase tracking-[0.15em] text-tangerine">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {locale === "de" ? "Letzte verfügbare Tickets" : "Last tickets available"}
          </span>
        </div>

        {/* Pinned testimonial for social proof above pricing */}
        <figure className="max-w-2xl mx-auto mb-10 text-center">
          <blockquote className="text-base md:text-lg font-body text-bone/85 italic leading-relaxed">
            &ldquo;{locale === "de"
              ? "Ein Ticket, 18 Tage, über 60 Bars – und überall Signature Cocktails für 6€. So lernt man München kennen."
              : "One ticket, 18 days, 60+ bars – signature cocktails for €6 everywhere. This is how you experience Munich."}&rdquo;
          </blockquote>
          <figcaption className="mt-2 text-xs font-body font-bold text-tangerine tracking-wider uppercase">
            — Marco, 31
          </figcaption>
        </figure>

        {/* ── Passport Pricing Cards ── */}
        <div ref={cards.ref} style={cards.style} className="flex justify-center">
          {tiersWithStatus.filter((tier) => tier.status === "available").map((tier) => (
              <div
                key={tier.key}
                className="relative rounded-2xl px-8 md:px-12 pt-8 pb-6 flex flex-col items-center text-center bg-licorice/95 border-2 border-tangerine hover:shadow-[0_0_40px_rgba(227,168,62,0.12)] transition-all duration-300 ease-out w-full max-w-sm"
              >
                <p className="text-sm font-display tracking-[0.15em] text-bone/90">
                  {t(`${tier.key}.name`)}
                </p>

                <div className="mt-3 mb-2 flex items-baseline justify-center gap-2.5">
                  <span className="text-5xl md:text-[3.5rem] leading-none font-display text-tangerine">
                    &euro;{tier.price}
                  </span>
                </div>

                <p className="text-xs font-body leading-tight text-bone/45 h-[24px] flex items-center">
                  {t(`${tier.key}.info`)}
                </p>

                <div className="w-full mt-4">
                  <a
                    href={`/${locale}/shop#passport`}
                    className="block w-full text-center btn-primary text-sm py-3"
                  >
                    {t("buyNow")}
                  </a>
                  <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] font-body font-bold text-bone/30">
                    <span className="inline-block w-1 h-1 rounded-full bg-bone/25" />
                    {t("lateHint")}
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Benefits */}
        <div ref={benefits.ref} style={benefits.style} className="mt-10 max-w-4xl mx-auto">
          <p className="text-[11px] font-body font-bold text-tangerine/80 uppercase tracking-[0.15em] mb-6 text-center">
            {t("includedHeadline")}
          </p>
          <div className="hidden lg:grid lg:grid-cols-5 gap-4">
            {features.map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-tangerine/10 border border-tangerine/20 flex items-center justify-center">
                  {featureIcons[i]}
                </div>
                <span className="text-xs font-body text-bone/80 leading-snug">{feature}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3 lg:hidden">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-9 h-9 shrink-0 rounded-full bg-tangerine/10 border border-tangerine/20 flex items-center justify-center">
                  {featureIcons[i]}
                </div>
                <span className="text-sm font-body text-bone/80 leading-snug">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Mini-FAQ — top 3 conversion blockers ── */}
        <div className="mt-12 max-w-3xl mx-auto">
          <div className="grid md:grid-cols-3 gap-3">
            {[
              {
                q: locale === "de" ? "Ist das Ticket digital?" : "Is the ticket digital?",
                a: locale === "de"
                  ? "Ja, vollständig digital in der Cocktail X App. Kein Ausdrucken nötig."
                  : "Yes, fully digital in the Cocktail X app. No printing required.",
              },
              {
                q: locale === "de" ? "Kann ich stornieren?" : "Can I cancel?",
                a: locale === "de"
                  ? "Stornierung bis 14 Tage vor Festivalbeginn — oder Ticket einfach übertragen."
                  : "Cancel up to 14 days before the festival — or simply transfer your ticket.",
              },
              {
                q: locale === "de" ? "Muss ich alle Bars besuchen?" : "Do I have to visit every bar?",
                a: locale === "de"
                  ? "Nein, du wählst frei. Jede Bar bietet einen exklusiven Cocktail für 6 €."
                  : "No, you choose freely. Every bar offers an exclusive cocktail for €6.",
              },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-bone/10 bg-bone/[0.02] p-5">
                <p className="text-sm font-display text-bone mb-2">{item.q}</p>
                <p className="text-xs font-body text-bone/65 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Other Ticket Types ── */}
        <div className="mt-16 pt-12 border-t border-bone/10">
          <h3 className="text-2xl md:text-3xl font-display text-bone text-center mb-2">
            {locale === "de" ? "WEITERE TICKETS" : "MORE TICKETS"}
          </h3>
          <p className="text-sm font-body text-bone/55 text-center mb-8">
            {locale === "de"
              ? "Gruppen-Tickets und mehr."
              : "Group tickets and more."}
          </p>

          <div ref={otherCards.ref} style={otherCards.style} className="grid md:grid-cols-3 gap-5">
            {OTHER_TICKETS.map((ticket) => {
              const accentColors: Record<string, { border: string; badge: string; text: string }> = {
                hibiscus: { border: "border-hibiscus/40", badge: "bg-hibiscus text-bone", text: "text-hibiscus" },
                tangerine: { border: "border-tangerine/40", badge: "bg-tangerine text-licorice", text: "text-tangerine" },
                everglade: { border: "border-everglade/40", badge: "bg-everglade text-bone", text: "text-everglade" },
              };
              const c = accentColors[ticket.accent] ?? accentColors.tangerine;

              return (
                <div
                  key={ticket.key}
                  className={`relative rounded-2xl border p-6 flex flex-col transition-all duration-300 ${
                    ticket.past
                      ? "bg-licorice/50 border-bone/5 opacity-40 grayscale"
                      : ticket.featured
                      ? `bg-licorice/95 border-2 ${c.border} md:scale-[1.04] hover:shadow-[0_0_40px_rgba(62,143,100,0.15)]`
                      : `bg-licorice/90 ${c.border}`
                  }`}
                >
                  {ticket.badge[locale] && (
                    <span className={`absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-body font-bold uppercase tracking-wider px-3 py-0.5 rounded-full ${
                      ticket.past ? "bg-bone/20 text-bone/50" : c.badge
                    }`}>
                      {ticket.badge[locale]}
                    </span>
                  )}

                  <h4 className="text-lg font-display text-bone mb-1 mt-1">{ticket.name[locale]}</h4>
                  <p className={`text-xs font-body font-bold mb-2 ${c.text}`}>{ticket.tagline[locale]}</p>
                  {ticket.description && (
                    <p className="text-xs font-body text-bone/60 mb-4 leading-relaxed">{ticket.description[locale]}</p>
                  )}

                  {ticket.price != null && (
                    <div className="flex items-baseline gap-2 mb-4">
                      {ticket.strikePrice != null && (
                        <span className="text-lg font-display text-bone/25 line-through">&euro;{ticket.strikePrice}</span>
                      )}
                      <span className={`text-3xl font-display ${c.text}`}>
                        {ticket.externalUrl && locale === "de" ? "ab " : ticket.externalUrl ? "from " : ""}&euro;{ticket.price}
                      </span>
                      {ticket.perPerson && (
                        <span className="text-xs font-body text-bone/50">
                          ({locale === "de" ? `${ticket.perPerson.toFixed(2).replace(".", ",")} \u20ac/Person` : `\u20ac${ticket.perPerson.toFixed(2)}/person`})
                        </span>
                      )}
                    </div>
                  )}

                  {ticket.groupSize && (
                    <p className="text-xs font-body text-emerald-400 font-bold mb-4">
                      {locale === "de"
                        ? `25% Gruppenrabatt \u00b7 ${ticket.groupSize} Personen`
                        : `25% group discount \u00b7 ${ticket.groupSize} people`}
                    </p>
                  )}

                  <div className="mt-auto">
                    {ticket.past ? (
                      <span className="block w-full text-center text-xs font-body text-bone/25 uppercase tracking-wider py-3">
                        {locale === "de" ? "Veranstaltung beendet" : "Event ended"}
                      </span>
                    ) : ticket.externalUrl ? (
                      <a
                        href={ticket.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center btn-primary text-sm py-3"
                      >
                        {locale === "de" ? "TICKETS KAUFEN" : "GET TICKETS"}
                      </a>
                    ) : (
                      <a
                        href={`/${locale}/shop#${ticket.key}`}
                        className="block w-full text-center btn-primary text-sm py-3"
                      >
                        {locale === "de" ? `AB ${ticket.price} € KAUFEN` : `BUY FROM €${ticket.price}`}
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Savings Calculator ── */}
        <div ref={calcReveal.ref} style={calcReveal.style} className="mt-12 max-w-2xl mx-auto">
          <SavingsCalculator locale={locale} />
        </div>

        <p className="mt-4 text-center text-[11px] font-body text-bone/30">
          {t("afterBuy")}
        </p>
      </div>
    </section>
  );
}
