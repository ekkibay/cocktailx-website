"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import BlurText from "@/components/ui/BlurText";
import { useReveal } from "@/hooks/useReveal";
import {
  EARLY_BIRD_PRICE,
  ANCHOR_PRICE,
  EARLY_BIRD_SAVINGS_PCT,
  EARLY_BIRD_CONTINGENT,
} from "@/data/ticket-tiers";

const NORMAL_PRICE = 15;
const FESTIVAL_PRICE = 6;
const SAVINGS_PER = NORMAL_PRICE - FESTIVAL_PRICE;

const featureIcons = [
  <svg key="bars" className="w-5 h-5 text-tangerine" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>,
  <svg key="drinks" className="w-5 h-5 text-tangerine" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M5 14.5h14m-7 0v6.5m-3.5 0h7" /></svg>,
  <svg key="days" className="w-5 h-5 text-tangerine" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>,
  <svg key="stamps" className="w-5 h-5 text-tangerine" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-4.5A3.375 3.375 0 0019.875 10.875 3.375 3.375 0 0016.5 7.5h0V3.75m-9 15v-4.5A3.375 3.375 0 014.125 10.875 3.375 3.375 0 017.5 7.5h0V3.75m0 0h9m-9 0H6a2.25 2.25 0 00-2.25 2.25v0M16.5 3.75H18a2.25 2.25 0 012.25 2.25v0" /></svg>,
  <svg key="events" className="w-5 h-5 text-tangerine" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>,
];

// ── Savings Calculator (inline), 2027 Early-Bird logic ───────────────────

function SavingsCalculator({ locale }: { locale: "de" | "en" }) {
  const [count, setCount] = useState(5);
  const ticketPrice = EARLY_BIRD_PRICE;
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
        <p className="text-xs font-body text-bone/70 uppercase tracking-wider mb-2">Ticket</p>
        <span className="inline-block text-xs font-body px-3 py-1.5 rounded-full border bg-tangerine text-licorice border-tangerine font-bold">
          {locale === "de" ? "Early Bird 2027" : "Early Bird 2027"} · €{ticketPrice}
        </span>
      </div>

      <label className="block text-sm font-body text-bone/85 mb-3">
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
          <span className="text-bone/75">
            {locale === "de" ? `Normale Bar (${count} × 15 €)` : `Normal bar (${count} × €15)`}
          </span>
          <span className="text-bone/90 font-bold tabular-nums">
            {locale === "de" ? `${barTotal} €` : `€${barTotal}`}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm font-body">
          <span className="text-bone/75">
            {locale === "de"
              ? `Festival (${ticketPrice} € + ${count} × 6 €)`
              : `Festival (€${ticketPrice} + ${count} × €6)`}
          </span>
          <span className="text-bone font-bold tabular-nums">
            {locale === "de" ? `${festivalTotal} €` : `€${festivalTotal}`}
          </span>
        </div>
        <div className="h-px bg-bone/10" />
        <div className="flex justify-between items-center">
          <span className="text-sm font-body text-bone/75">
            {locale === "de" ? "Deine Ersparnis" : "Your savings"}
          </span>
          <span className={`text-2xl md:text-3xl font-display tabular-nums transition-colors ${savings > 0 ? "text-emerald-400" : "text-hibiscus"}`}>
            {savings > 0
              ? locale === "de" ? `+ ${savings} €` : `+ €${savings}`
              : locale === "de" ? `− ${Math.abs(savings)} €` : `− €${Math.abs(savings)}`}
          </span>
        </div>
      </div>

      {/* Threshold banner */}
      {savings > 0 ? (
        <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/[0.08] p-4 mb-3">
          <p className="text-sm font-body font-bold text-emerald-300 text-center mb-3">
            {locale === "de"
              ? `Du sparst ${savings} €, Ticket lohnt sich.`
              : `You save €${savings}, the ticket pays off.`}
          </p>
          <a
            href={`/${locale}/shop#passport`}
            className="block w-full text-center btn-primary text-sm py-3"
          >
            {locale === "de" ? "Early-Bird-Ticket sichern" : "Get your Early-Bird ticket"}
          </a>
        </div>
      ) : (
        <div className="rounded-xl border border-hibiscus/30 bg-hibiscus/[0.08] p-4 mb-3">
          <p className="text-sm font-body text-bone/85 text-center">
            {locale === "de"
              ? `Lohnt sich schon ab wenigen Drinks, ein Cocktail in einer Top-Bar kostet sonst ${NORMAL_PRICE}-16 €.`
              : `Pays off after just a few drinks, a cocktail in a top bar usually costs €${NORMAL_PRICE}-16.`}
          </p>
        </div>
      )}

      <p className="text-xs font-body text-bone/60 text-center">
        {locale === "de"
          ? `Ab ${breakEven} Cocktails lohnt sich das Ticket, du bist bei ${count}.`
          : `The ticket pays off after ${breakEven} cocktails, you're at ${count}.`}
      </p>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────

export default function Tickets() {
  const t = useTranslations("tickets");
  const locale = useLocale() as "de" | "en";

  const subtitle = useReveal<HTMLParagraphElement>({ delay: 150 });
  const card = useReveal({ delay: 250, scale: 0.95 });
  const benefits = useReveal({ delay: 350 });
  const calcReveal = useReveal({ delay: 200 });

  const features = [t("feature1"), t("feature2"), t("feature3"), t("feature4")];

  return (
    <section id="tickets" className="py-14 md:py-16 bg-licorice relative scroll-mt-24">
      {/* CI background, same as Hero */}
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
        <p ref={subtitle.ref} style={subtitle.style} className="text-center text-sm md:text-base font-body text-bone/80 mb-8 max-w-2xl mx-auto">
          {t("subtitle", { count: EARLY_BIRD_CONTINGENT, price: EARLY_BIRD_PRICE, anchor: ANCHOR_PRICE })}
        </p>

        {/* Honest scarcity badge, fixed contingent, no fake countdown */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-tangerine/40 bg-tangerine/5 text-xs font-body font-bold uppercase tracking-[0.15em] text-tangerine text-center">
            <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {t("scarcityBadge", { count: EARLY_BIRD_CONTINGENT, price: EARLY_BIRD_PRICE })}
          </span>
        </div>

        {/* Pinned testimonial for social proof above pricing */}
        <figure className="max-w-2xl mx-auto mb-10 text-center">
          <blockquote className="text-base md:text-lg font-body text-bone/85 italic leading-relaxed">
            &ldquo;{locale === "de"
              ? "Ein Ticket, 18 Tage, über 60 Bars, und überall Signature Cocktails für 6€. So lernt man München kennen."
              : "One ticket, 18 days, 60+ bars, signature cocktails for €6 everywhere. This is how you experience Munich."}&rdquo;
          </blockquote>
          <figcaption className="mt-2 text-xs font-body font-bold text-tangerine tracking-wider uppercase">, Marco, 31
          </figcaption>
        </figure>

        {/* ── Single Early-Bird Pricing Card ── */}
        <div ref={card.ref} style={card.style} className="flex justify-center">
          <div className="relative rounded-2xl px-8 md:px-12 pt-9 pb-7 flex flex-col items-center text-center bg-licorice/95 border-2 border-tangerine hover:shadow-[0_0_40px_rgba(227,168,62,0.12)] transition-all duration-300 ease-out w-full max-w-sm">
            {/* Best-price badge */}
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-body font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-tangerine text-licorice">
              {t("activeBadge")}
            </span>

            <p className="text-sm font-display tracking-[0.15em] text-bone/90">
              {t("earlyBird.name")}
            </p>

            <div className="mt-3 mb-1 flex items-baseline justify-center gap-3">
              <span className="text-5xl md:text-[3.5rem] leading-none font-display text-tangerine">
                &euro;{EARLY_BIRD_PRICE}
              </span>
              <span className="text-2xl md:text-3xl font-display text-bone/40 line-through leading-none">
                &euro;{ANCHOR_PRICE}
              </span>
            </div>

            <span className="mt-1 inline-block text-[11px] font-body font-bold uppercase tracking-wider bg-tangerine/15 text-tangerine px-2.5 py-1 rounded-full">
              {t("savings", { pct: EARLY_BIRD_SAVINGS_PCT })}
            </span>

            <p className="mt-3 text-xs font-body leading-tight text-bone/55 min-h-[20px] flex items-center">
              {t("earlyBird.info")}
            </p>

            <div className="w-full mt-5">
              <a
                href={`/${locale}/shop#passport`}
                className="block w-full text-center btn-primary text-sm py-3"
              >
                {t("buyNow")}
              </a>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-body font-bold text-tangerine text-center">
                <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2M12 22a10 10 0 100-20 10 10 0 000 20z" />
                </svg>
                {t("priceWindow", { count: EARLY_BIRD_CONTINGENT, price: EARLY_BIRD_PRICE })}
              </p>
              <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-body font-bold text-bone/55">
                <svg className="w-3 h-3 text-bone/55" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {t("freeCancelHint")}
              </div>
            </div>
          </div>
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

        {/* ── Mini-FAQ, top 3 conversion blockers ── */}
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
                q: locale === "de" ? "Wann findet das Festival statt?" : "When is the festival?",
                a: locale === "de"
                  ? "Cocktail X 2027 läuft vom 05. bis 22. Mai 2027. Passt der Termin nicht, stornierst du kostenlos, volle Rückerstattung."
                  : "Cocktail X 2027 runs May 5 bis 22, 2027. If it doesn't suit you, cancel for free, full refund.",
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
                <p className="text-xs font-body text-bone/70 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Savings Calculator ── */}
        <div ref={calcReveal.ref} style={calcReveal.style} className="mt-12 max-w-2xl mx-auto">
          <SavingsCalculator locale={locale} />
        </div>

        <p className="mt-4 text-center text-[11px] font-body text-bone/45">
          {t("afterBuy")}
        </p>
      </div>
    </section>
  );
}
