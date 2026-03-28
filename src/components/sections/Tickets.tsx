"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import ShopifyBuyButton from "@/components/ui/ShopifyBuyButton";
import BlurText from "@/components/ui/BlurText";
import { useReveal } from "@/hooks/useReveal";

const FESTIVAL_DATE = new Date("2026-05-13T19:00:00+02:00");

const tiers = [
  {
    key: "earlyBird",
    price: 20,
    productId: "passport-early-bird",
    soldOutDaysBefore: 43, // ends March 31
  },
  {
    key: "regular",
    price: 34,
    productId: "passport-regular",
    soldOutDaysBefore: 13, // ends April 30
  },
  {
    key: "late",
    price: 49,
    productId: "passport-late",
    soldOutDaysBefore: -18,
  },
];

function getTierStatus(soldOutDaysBefore: number) {
  const now = new Date();
  const cutoff = new Date(FESTIVAL_DATE);
  cutoff.setDate(cutoff.getDate() - soldOutDaysBefore);
  return now >= cutoff ? "soldOut" : "available";
}

function getDaysLeft(soldOutDaysBefore: number): number {
  const now = new Date();
  const cutoff = new Date(FESTIVAL_DATE);
  cutoff.setDate(cutoff.getDate() - soldOutDaysBefore);
  const diff = cutoff.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

const featureIcons = [
  // Bars — map pin
  <svg key="bars" className="w-5 h-5 text-tangerine" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>,
  // Cocktails — wine glass
  <svg key="drinks" className="w-5 h-5 text-tangerine" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M5 14.5h14m-7 0v6.5m-3.5 0h7" /></svg>,
  // 18 days — calendar
  <svg key="days" className="w-5 h-5 text-tangerine" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>,
  // Stamps — trophy/star
  <svg key="stamps" className="w-5 h-5 text-tangerine" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-4.5A3.375 3.375 0 0019.875 10.875 3.375 3.375 0 0016.5 7.5h0V3.75m-9 15v-4.5A3.375 3.375 0 014.125 10.875 3.375 3.375 0 017.5 7.5h0V3.75m0 0h9m-9 0H6a2.25 2.25 0 00-2.25 2.25v0M16.5 3.75H18a2.25 2.25 0 012.25 2.25v0" /></svg>,
  // Events — sparkles
  <svg key="events" className="w-5 h-5 text-tangerine" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>,
];

export default function Tickets() {
  const t = useTranslations("tickets");

  const subtitle = useReveal<HTMLParagraphElement>({ delay: 150 });
  const cards = useReveal({ delay: 250, scale: 0.95 });
  const benefits = useReveal({ delay: 350 });
  const afterBuy = useReveal<HTMLParagraphElement>({ delay: 450 });

  const features = [
    t("feature1"),
    t("feature2"),
    t("feature3"),
    t("feature4"),
    t("feature5"),
  ];

  const tiersWithStatus = useMemo(() => {
    return tiers.map((tier) => ({
      ...tier,
      status: getTierStatus(tier.soldOutDaysBefore),
      daysLeft: getDaysLeft(tier.soldOutDaysBefore),
    }));
  }, []);

  const bestAvailableKey = tiersWithStatus.find(
    (t) => t.status === "available"
  )?.key;

  return (
    <section id="tickets" className="py-20 bg-jambalaya/30 relative">
      {/* CI background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        <div style={{ position:"absolute", inset:0, backgroundImage:"url(/images/pattern-3.png)", backgroundSize:"300px 300px", backgroundRepeat:"repeat", opacity:0.12 }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(25,21,19,0.55) 0%, rgba(25,21,19,0.2) 25%, rgba(25,21,19,0.2) 75%, rgba(25,21,19,0.7) 100%)" }} />
        <div style={{ position:"absolute", top:"-150px", right:"-150px", width:"500px", height:"500px", borderRadius:"50%", background:"rgba(243,146,0,0.10)", filter:"blur(120px)" }} />
        <div style={{ position:"absolute", bottom:"-100px", left:"-150px", width:"450px", height:"450px", borderRadius:"50%", background:"rgba(189,37,110,0.08)", filter:"blur(110px)" }} />
      </div>
      <div className="max-w-4xl mx-auto px-4 relative">
        {/* Headline */}
        <BlurText
          text={t("headline")}
          tag="h2"
          className="text-3xl md:text-4xl font-display text-bone text-center mb-3"
          delay={70}
          duration={0.7}
        />

        <p
          ref={subtitle.ref}
          style={subtitle.style}
          className="text-center text-sm md:text-base font-body text-bone/80 mb-10"
        >
          {t("subtitle")}
        </p>

        {/* Price phase cards */}
        <div ref={cards.ref} style={cards.style} className="grid lg:grid-cols-3 gap-4">
          {tiersWithStatus.map((tier) => {
            const isBest = tier.key === bestAvailableKey;
            const isSoldOut = tier.status === "soldOut";

            return (
              <div
                key={tier.key}
                className={`relative rounded-2xl px-6 md:px-8 pt-8 pb-6 flex flex-col items-center text-center transition-all duration-300 ease-out ${
                  isSoldOut
                    ? "bg-licorice/40 border border-bone/5 opacity-50"
                    : isBest
                    ? "bg-licorice border-2 border-tangerine md:scale-[1.04] hover:shadow-[0_0_40px_rgba(227,168,62,0.12)]"
                    : "bg-licorice border border-bone/10 hover:border-bone/20 hover:bg-bone/[0.02]"
                }`}
              >
                {/* Badge */}
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

                {/* Tier name */}
                <p
                  className={`text-sm font-display tracking-[0.15em] ${
                    isSoldOut
                      ? "text-bone/25 line-through"
                      : isBest
                      ? "text-bone/90"
                      : "text-bone/80"
                  }`}
                >
                  {t(`${tier.key}.name`)}
                </p>

                {/* Price */}
                <div className="mt-3 mb-2 flex items-baseline justify-center gap-2.5">
                  {!isSoldOut && tier.price < 49 && (
                    <span className="text-xl font-display text-bone/25 line-through">
                      &euro;49
                    </span>
                  )}
                  <span
                    className={`text-5xl md:text-[3.5rem] leading-none font-display ${
                      isSoldOut
                        ? "text-bone/15 line-through"
                        : isBest
                        ? "text-tangerine"
                        : "text-tangerine/60"
                    }`}
                  >
                    &euro;{tier.price}
                  </span>
                </div>

                {/* Savings + info — fixed height for alignment */}
                <div className="h-[40px] flex flex-col items-center justify-center">
                  {!isSoldOut && tier.price < 49 && (
                    <span className="text-xs font-body text-emerald-400 font-bold leading-tight">
                      {t("savings", { amount: 49 - tier.price })}
                    </span>
                  )}
                  <p
                    className={`text-xs font-body leading-tight ${
                      isSoldOut ? "text-bone/15" : "text-bone/45"
                    }`}
                  >
                    {t(`${tier.key}.info`)}
                  </p>
                </div>

                {/* CTA or Sold Out */}
                <div className="w-full mt-1">
                  {isSoldOut ? (
                    <span className="block text-xs font-body text-bone/15 uppercase tracking-wider py-3">
                      {t("soldOut")}
                    </span>
                  ) : (
                    <>
                      <ShopifyBuyButton
                        productId={tier.productId}
                        buttonText={t("buyNow")}
                        className="w-full text-center"
                      />

                      {/* Timer */}
                      <div
                        className={`mt-2.5 flex items-center justify-center gap-1.5 text-[11px] font-body font-bold ${
                          tier.key !== "late" && tier.daysLeft > 0
                            ? "text-tangerine/70"
                            : "text-bone/30"
                        }`}
                      >
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

        {/* Benefits — icon grid below cards */}
        <div
          ref={benefits.ref}
          style={benefits.style}
          className="mt-10"
        >
          <p className="text-[11px] font-body font-bold text-tangerine/80 uppercase tracking-[0.15em] mb-6 text-center">
            {t("includedHeadline")}
          </p>
          {/* Mobile: vertical list, Desktop: icon grid */}
          <div className="hidden lg:grid lg:grid-cols-5 gap-4">
            {features.map((feature, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center gap-2.5"
              >
                <div className="w-10 h-10 rounded-full bg-tangerine/10 border border-tangerine/20 flex items-center justify-center">
                  {featureIcons[i]}
                </div>
                <span className="text-xs font-body text-bone/80 leading-snug">{feature}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3 lg:hidden">
            {features.map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-4"
              >
                <div className="w-9 h-9 shrink-0 rounded-full bg-tangerine/10 border border-tangerine/20 flex items-center justify-center">
                  {featureIcons[i]}
                </div>
                <span className="text-sm font-body text-bone/80 leading-snug">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* After-buy hint */}
        <p
          ref={afterBuy.ref}
          style={afterBuy.style}
          className="mt-4 text-center text-[11px] font-body text-bone/30"
        >
          {t("afterBuy")}
        </p>
      </div>
    </section>
  );
}
