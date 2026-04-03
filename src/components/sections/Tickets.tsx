"use client";

import { useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import BlurText from "@/components/ui/BlurText";
import { useReveal } from "@/hooks/useReveal";

const FESTIVAL_DATE = new Date("2026-05-13T19:00:00+02:00");
const NORMAL_PRICE = 15;
const FESTIVAL_PRICE = 6;
const SAVINGS_PER = NORMAL_PRICE - FESTIVAL_PRICE;

const tiers = [
  { key: "earlyBird", price: 20, productId: "passport-early-bird", soldOutDaysBefore: 42 },
  { key: "regular", price: 34, productId: "passport-regular", soldOutDaysBefore: 13 },
  { key: "late", price: 49, productId: "passport-late", soldOutDaysBefore: -18 },
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
  badge: { de: string | null; en: string | null };
  accent: string;
  price: number;
  strikePrice: number;
  perPerson: number | null;
  groupSize?: number;
};

const OTHER_TICKETS: OtherTicketType[] = [
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
];

// New tickets available from April 1
const NEW_TICKETS_LAUNCH = new Date("2026-04-01");
const newTicketsAvailable = new Date() >= NEW_TICKETS_LAUNCH;

// Easter Special — 3 for 2, limited until Easter Monday
const EASTER_END = new Date("2026-04-07T00:00:00+02:00");
const easterActive = new Date() < EASTER_END;

// Easter pricing uses the currently available tier
function getEasterPrice(): { price: number; strikePrice: number; perPerson: number } {
  const now = new Date();
  const ebEnd = new Date(FESTIVAL_DATE); ebEnd.setDate(ebEnd.getDate() - 42);
  const regEnd = new Date(FESTIVAL_DATE); regEnd.setDate(regEnd.getDate() - 13);
  const unitPrice = now < ebEnd ? 20 : now < regEnd ? 34 : 49;
  const price = unitPrice * 2;          // pay for 2
  const strikePrice = unitPrice * 3;    // normally 3
  const perPerson = +(price / 3).toFixed(2);
  return { price, strikePrice, perPerson };
}

// ── Savings Calculator (inline) ──────────────────────────────────────────

function SavingsCalculator({ locale }: { locale: "de" | "en" }) {
  const [count, setCount] = useState(5);
  const ticketPrice = 20; // Early bird
  const barTotal = count * NORMAL_PRICE;
  const festivalTotal = ticketPrice + count * FESTIVAL_PRICE;
  const savings = barTotal - festivalTotal;
  const breakEven = (ticketPrice / SAVINGS_PER).toFixed(1);

  return (
    <div className="rounded-2xl bg-licorice/90 border border-bone/10 p-6 md:p-8">
      <p className="text-[11px] font-body font-bold uppercase tracking-[0.15em] text-tangerine mb-1">
        {locale === "de" ? "Lohnt sich das Ticket?" : "Is the ticket worth it?"}
      </p>
      <h3 className="text-xl md:text-2xl font-display text-bone mb-6">
        {locale === "de" ? "Dein Spar-Rechner" : "Your Savings Calculator"}
      </h3>

      <label className="block text-sm font-body text-bone/80 mb-3">
        {locale === "de" ? "Wie viele Cocktails planst du in 18 Tagen mit deinen Freunden zu trinken? " : "How many cocktails are you and your friends planning to drink in 18 days? "}
        <span className="text-bone font-bold">{count}</span>
      </label>
      <input
        type="range" min={1} max={30} step={1} value={count}
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
          <span className={`text-xl font-display tabular-nums ${savings > 0 ? "text-emerald-400" : "text-hibiscus"}`}>
            {savings > 0
              ? locale === "de" ? `+ ${savings} \u20ac` : `+ \u20ac${savings}`
              : locale === "de" ? `\u2212 ${Math.abs(savings)} \u20ac` : `\u2212 \u20ac${Math.abs(savings)}`}
          </span>
        </div>
      </div>

      <p className="text-xs font-body text-bone/35 text-center">
        {locale === "de"
          ? `Ab ${breakEven} Cocktails lohnt sich das Ticket \u2014 du bist schon bei ${count}.`
          : `The ticket pays off after ${breakEven} cocktails \u2014 you're already at ${count}.`}
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
  const easterReveal = useReveal({ delay: 250, scale: 0.95 });
  const otherCards = useReveal({ delay: 300 });
  const calcReveal = useReveal({ delay: 200 });

  const easter = getEasterPrice();

  const features = [t("feature1"), t("feature2"), t("feature3"), t("feature4"), t("feature5")];

  const tiersWithStatus = useMemo(() => {
    return tiers.map((tier) => ({
      ...tier,
      status: getTierStatus(tier.soldOutDaysBefore),
      daysLeft: getDaysLeft(tier.soldOutDaysBefore),
    }));
  }, []);

  const bestAvailableKey = tiersWithStatus.find((t) => t.status === "available")?.key;

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

        {/* ── Passport Pricing Cards ── */}
        <div ref={cards.ref} style={cards.style} className="grid lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {tiersWithStatus.map((tier) => {
            const isBest = tier.key === bestAvailableKey;
            const isSoldOut = tier.status === "soldOut";

            return (
              <div
                key={tier.key}
                className={`relative rounded-2xl px-6 md:px-8 pt-8 pb-6 flex flex-col items-center text-center transition-all duration-300 ease-out ${
                  isSoldOut
                    ? "bg-licorice/90 border border-bone/5 opacity-50"
                    : isBest
                    ? "bg-licorice/95 border-2 border-tangerine md:scale-[1.04] hover:shadow-[0_0_40px_rgba(227,168,62,0.12)]"
                    : "bg-licorice/90 border border-bone/10 hover:border-bone/20"
                }`}
              >
                {isSoldOut && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-bone/20 text-bone text-[10px] font-body font-bold tracking-wider px-3 py-0.5 rounded-full uppercase whitespace-nowrap">
                    {t("soldOut")}
                  </div>
                )}
                {isBest && !isSoldOut && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-tangerine text-licorice text-[10px] font-body font-bold tracking-wider px-3 py-0.5 rounded-full uppercase whitespace-nowrap">
                    {t("activeBadge")}
                  </div>
                )}

                <p className={`text-sm font-display tracking-[0.15em] ${isSoldOut ? "text-bone/25 line-through" : isBest ? "text-bone/90" : "text-bone/80"}`}>
                  {t(`${tier.key}.name`)}
                </p>

                {/* Price with strikethrough */}
                <div className="mt-3 mb-2 flex items-baseline justify-center gap-2.5">
                  {!isSoldOut && tier.price < 49 && (
                    <span className="text-xl font-display text-bone/25 line-through">&euro;49</span>
                  )}
                  <span className={`text-5xl md:text-[3.5rem] leading-none font-display ${isSoldOut ? "text-bone/15 line-through" : isBest ? "text-tangerine" : "text-tangerine/60"}`}>
                    &euro;{tier.price}
                  </span>
                </div>

                <div className="h-[40px] flex flex-col items-center justify-center">
                  {!isSoldOut && tier.price < 49 && (
                    <span className="text-xs font-body text-emerald-400 font-bold leading-tight">
                      {t("savings", { amount: 49 - tier.price })}
                    </span>
                  )}
                  <p className={`text-xs font-body leading-tight ${isSoldOut ? "text-bone/15" : "text-bone/45"}`}>
                    {t(`${tier.key}.info`)}
                  </p>
                </div>

                {/* CTA — scroll anchor, not external link */}
                <div className="w-full mt-1">
                  {isSoldOut ? (
                    <span className="block text-xs font-body text-bone/15 uppercase tracking-wider py-3">{t("soldOut")}</span>
                  ) : (
                    <>
                      <a
                        href={`/${locale}/shop#passport`}
                        className="block w-full text-center btn-primary text-sm py-3"
                      >
                        {t("buyNow")}
                      </a>
                      <div className={`mt-2.5 flex items-center justify-center gap-1.5 text-[11px] font-body font-bold ${tier.key !== "late" && tier.daysLeft > 0 ? "text-tangerine/70" : "text-bone/30"}`}>
                        {tier.key === "earlyBird" && tier.daysLeft > 0 ? (
                          <>
                            <span className="inline-block w-1 h-1 rounded-full bg-tangerine animate-pulse" />
                            {t("timerLabel", { days: tier.daysLeft })}
                          </>
                        ) : tier.key === "regular" && tier.daysLeft > 0 ? (
                          <>
                            <span className="inline-block w-1 h-1 rounded-full bg-tangerine animate-pulse" />
                            {t("timerLabelRegular", { days: tier.daysLeft })}
                          </>
                        ) : tier.key === "late" ? (
                          <>
                            <span className="inline-block w-1 h-1 rounded-full bg-bone/25" />
                            {t("lateHint")}
                          </>
                        ) : null}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
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

        {/* ── Easter Special ── */}
        {easterActive && (
          <div ref={easterReveal.ref} style={easterReveal.style} className="mt-16 pt-12 border-t border-bone/10">
            <div className="relative max-w-3xl mx-auto rounded-3xl overflow-hidden easter-glow">
              {/* Decorative background */}
              <div className="absolute inset-0 bg-gradient-to-br from-hibiscus/20 via-licorice to-tangerine/10" />
              <div className="absolute inset-0" style={{ backgroundImage: "url(/images/pattern-bg.svg)", backgroundSize: "100px 100px", backgroundRepeat: "repeat", opacity: 0.06 }} />
              <div className="absolute top-[-60px] right-[-60px] w-[200px] h-[200px] rounded-full bg-hibiscus/20 blur-[80px]" />
              <div className="absolute bottom-[-40px] left-[-40px] w-[160px] h-[160px] rounded-full bg-tangerine/15 blur-[60px]" />

              {/* Sparkle decorations */}
              <div className="absolute top-6 right-8 w-2 h-2 rounded-full bg-tangerine easter-sparkle-1" />
              <div className="absolute top-12 right-20 w-1.5 h-1.5 rounded-full bg-hibiscus easter-sparkle-2" />
              <div className="absolute bottom-10 left-10 w-2 h-2 rounded-full bg-tangerine easter-sparkle-3" />

              <div className="relative p-6 md:p-10">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <span className="text-[10px] font-body font-bold uppercase tracking-wider text-bone bg-hibiscus px-3 py-1 rounded-full easter-float">
                    🐣 {locale === "de" ? "OSTER SPECIAL" : "EASTER SPECIAL"}
                  </span>
                  <span className="text-[10px] font-body font-bold uppercase tracking-wider text-hibiscus bg-hibiscus/15 border border-hibiscus/30 px-3 py-1 rounded-full">
                    {locale === "de" ? "NUR BIS OSTERMONTAG" : "UNTIL EASTER MONDAY ONLY"}
                  </span>
                  <span className="text-[10px] font-body font-bold uppercase tracking-wider text-tangerine bg-tangerine/10 border border-tangerine/20 px-3 py-1 rounded-full">
                    {locale === "de" ? "LIMITIERT" : "LIMITED"}
                  </span>
                </div>

                <div className="grid md:grid-cols-[1fr,auto] gap-8 items-center">
                  {/* Left: info */}
                  <div>
                    <h3 className="text-2xl md:text-3xl font-display text-bone mb-2">
                      {locale === "de" ? "3 FÜR 2 PASSPORTS" : "3 FOR 2 PASSPORTS"}
                    </h3>
                    <p className="text-sm font-body text-bone/70 mb-4 max-w-md">
                      {locale === "de"
                        ? "Schnappt euch zu dritt ein Ticket – die dritte Person geht aufs Haus. Einmalig, limitiert, nur dieses Osterwochenende."
                        : "Grab a ticket with two friends – the third person is on us. One-time, limited, this Easter weekend only."}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-2 text-xs font-body text-bone/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-hibiscus" />
                        {locale === "de" ? "3 vollwertige Festival-Passports" : "3 full Festival Passports"}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-body text-bone/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-hibiscus" />
                        {locale === "de" ? "Alle 18 Tage · Alle 58 Bars" : "All 18 days · All 58 bars"}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-body text-bone/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {locale === "de" ? `${easter.strikePrice - easter.price} € gespart` : `€${easter.strikePrice - easter.price} saved`}
                      </div>
                    </div>
                  </div>

                  {/* Right: price + CTA */}
                  <div className="flex flex-col items-center text-center md:min-w-[180px] md:border-l md:border-bone/10 md:pl-8">
                    <div className="flex items-baseline gap-2.5 mb-1">
                      <span className="text-xl font-display text-bone/25 line-through">&euro;{easter.strikePrice}</span>
                      <span className="text-5xl md:text-6xl font-display text-hibiscus">&euro;{easter.price}</span>
                    </div>
                    <span className="text-xs font-body text-emerald-400 font-bold mb-0.5">
                      {locale === "de"
                        ? `33% Rabatt · ${easter.perPerson.toFixed(2).replace(".", ",")} €/Person`
                        : `33% off · €${easter.perPerson.toFixed(2)}/person`}
                    </span>
                    <span className="text-[11px] font-body text-bone/45 mb-5">
                      {locale === "de" ? "für 3 Personen" : "for 3 people"}
                    </span>
                    <a
                      href={`/${locale}/shop#easter-special`}
                      className="block w-full text-center font-body font-bold uppercase tracking-wide rounded-full px-10 py-4 text-sm bg-hibiscus text-bone relative overflow-hidden transition-all duration-300 hover:brightness-110 hover:scale-105 hover:shadow-[0_0_40px_rgba(189,37,110,0.35)]"
                    >
                      {locale === "de" ? "OSTER-DEAL SICHERN" : "GET EASTER DEAL"}
                    </a>
                    <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-body font-bold text-hibiscus/70">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-hibiscus animate-pulse" />
                      {locale === "de" ? "Endet Ostermontag" : "Ends Easter Monday"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Other Ticket Types ── */}
        <div className="mt-16 pt-12 border-t border-bone/10">
          <h3 className="text-2xl md:text-3xl font-display text-bone text-center mb-2">
            {locale === "de" ? "WEITERE TICKETS" : "MORE TICKETS"}
          </h3>
          <p className="text-sm font-body text-bone/55 text-center mb-3">
            {locale === "de"
              ? "Gruppen-Tickets und mehr."
              : "Group tickets and more."}
          </p>
          {!newTicketsAvailable && (
            <p className="text-xs font-body text-tangerine/70 text-center mb-8 font-bold uppercase tracking-wider">
              {locale === "de" ? "Ab 1. April verf\u00fcgbar" : "Available from April 1"}
            </p>
          )}
          {newTicketsAvailable && <div className="mb-8" />}

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
                  className={`relative rounded-2xl border bg-licorice/90 p-6 flex flex-col ${c.border} ${!newTicketsAvailable ? "opacity-70" : ""}`}
                >
                  {/* Badge */}
                  {ticket.badge[locale] && (
                    <span className={`absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-body font-bold uppercase tracking-wider px-3 py-0.5 rounded-full ${c.badge}`}>
                      {ticket.badge[locale]}
                    </span>
                  )}

                  <h4 className="text-lg font-display text-bone mb-1 mt-1">{ticket.name[locale]}</h4>
                  <p className={`text-xs font-body font-bold mb-4 ${c.text}`}>{ticket.tagline[locale]}</p>

                  {/* Price with strikethrough */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-lg font-display text-bone/25 line-through">&euro;{ticket.strikePrice}</span>
                    <span className={`text-3xl font-display ${c.text}`}>&euro;{ticket.price}</span>
                    {ticket.perPerson && (
                      <span className="text-xs font-body text-bone/50">
                        ({locale === "de" ? `${ticket.perPerson.toFixed(2).replace(".", ",")} \u20ac/Person` : `\u20ac${ticket.perPerson.toFixed(2)}/person`})
                      </span>
                    )}
                  </div>

                  {/* Group discount info */}
                  {ticket.groupSize && (
                    <p className="text-xs font-body text-emerald-400 font-bold mb-4">
                      {locale === "de"
                        ? `25% Gruppenrabatt \u00b7 ${ticket.groupSize} Personen`
                        : `25% group discount \u00b7 ${ticket.groupSize} people`}
                    </p>
                  )}

                  <div className="mt-auto">
                    {newTicketsAvailable ? (
                      <a
                        href={`/${locale}/shop#${ticket.key}`}
                        className="block w-full text-center btn-primary text-sm py-3"
                      >
                        {locale === "de" ? `AB ${ticket.price} € KAUFEN` : `BUY FROM €${ticket.price}`}
                      </a>
                    ) : (
                      <div className="w-full text-center text-sm py-3 rounded-xl border border-bone/15 text-bone/30 font-body font-bold uppercase tracking-wider cursor-not-allowed">
                        {locale === "de" ? "Ab 1. April verf\u00fcgbar" : "Available from April 1"}
                      </div>
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
