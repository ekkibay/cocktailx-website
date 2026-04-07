"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import ShopifyBuyButton from "@/components/ui/ShopifyBuyButton";
import BlurText from "@/components/ui/BlurText";
import { useReveal } from "@/hooks/useReveal";
import { trackEvent } from "@/lib/meta-pixel";

// ── Constants ─────────────────────────────────────────────────────────────────

const NORMAL_PRICE = 15;
const FESTIVAL_PRICE = 6;
const SAVINGS_PER = NORMAL_PRICE - FESTIVAL_PRICE; // 9 €

const newTicketsAvailable = true;

// ── Calculator options (shared across page) ───────────────────────────────────

type CalcOption = {
  key: string;
  label: { de: string; en: string };
  price: number;       // ticket price (or per-person for groups)
  isGroup: boolean;
  groupSize?: number;
};

// ── Ticket data ───────────────────────────────────────────────────────────────

const FESTIVAL_DATE = new Date("2026-05-13T19:00:00+02:00");

// Cutoff dates (same as landing page): Early Bird until Mar 31, Regular until Apr 30
const EB_END = new Date(FESTIVAL_DATE); EB_END.setDate(EB_END.getDate() - 42);  // Apr 1
const REG_END = new Date(FESTIVAL_DATE); REG_END.setDate(REG_END.getDate() - 13); // Apr 30

function getPassportActive(): [boolean, boolean, boolean] {
  const now = new Date();
  if (now < EB_END) return [true, false, false];
  if (now < REG_END) return [false, true, false];
  return [false, false, true];
}

const [ebActive, regActive, lmActive] = getPassportActive();

// ── Calculator options ───────────────────────────────────────────────────────

const CALC_OPTIONS: CalcOption[] = [
  { key: "passport-eb",  label: { de: "Passport · Early Bird",      en: "Passport · Early Bird"      }, price: 20,    isGroup: false },
  { key: "passport-r",   label: { de: "Passport · Regular",         en: "Passport · Regular"         }, price: 34,    isGroup: false },
  { key: "passport-lm",  label: { de: "Passport · Last Minute",     en: "Passport · Last Minute"     }, price: 49,    isGroup: false },
  { key: "group-r",      label: { de: "Group Ticket · Regular",     en: "Group Ticket · Regular"     }, price: 25.50, isGroup: true, groupSize: 4 },
  { key: "group-lm",     label: { de: "Group Ticket · Last Minute", en: "Group Ticket · Last Minute" }, price: 36.75, isGroup: true, groupSize: 4 },
];

const PASSPORT_TIERS = {
  de: [
    { label: "Early Bird",  until: "bis 31. März", price: 20, calcKey: "passport-eb", productId: "passport-early-bird", active: ebActive  },
    { label: "Regular",     until: "bis 1. Mai",   price: 34, calcKey: "passport-r",  productId: "passport-regular",    active: regActive },
    { label: "Last Minute", until: "bis 13. Mai",  price: 49, calcKey: "passport-lm", productId: "passport-late",       active: lmActive  },
  ],
  en: [
    { label: "Early Bird",  until: "until Mar 31", price: 20, calcKey: "passport-eb", productId: "passport-early-bird", active: ebActive  },
    { label: "Regular",     until: "until May 1",  price: 34, calcKey: "passport-r",  productId: "passport-regular",    active: regActive },
    { label: "Last Minute", until: "until May 13", price: 49, calcKey: "passport-lm", productId: "passport-late",       active: lmActive  },
  ],
};

type OtherTicket = {
  key: string;
  name: string;
  tagline: { de: string; en: string };
  description: { de: string; en: string };
  badge: { de: string | null; en: string | null };
  accent: "hibiscus" | "tangerine" | "everglade";
  tiers: {
    label: string;
    until: { de: string; en: string };
    price: number;
    perPerson: number | null;
    calcKey: string;
    productId: string;
    active: boolean;
  }[];
};

const OTHER_TICKETS: OtherTicket[] = [
  {
    key: "group",
    name: "Group Ticket",
    tagline: { de: "4 Passports zum Preis von 3", en: "4 Passports for the price of 3" },
    description: {
      de: "Der perfekte Pass für Gruppen – ein Passport gratis. Jede Person erhält einen vollwertigen Festival-Passport für alle 18 Tage.",
      en: "The perfect pass for groups – one Passport free. Each person receives a full festival Passport for all 18 days.",
    },
    badge: { de: null, en: null },
    accent: "tangerine",
    tiers: [
      { label: "Regular",     until: { de: "bis 1. Mai",  en: "until May 1"  }, price: 102, perPerson: 25.50, calcKey: "group-r",  productId: "group-regular", active: regActive  },
      { label: "Last Minute", until: { de: "bis 13. Mai", en: "until May 13" }, price: 147, perPerson: 36.75, calcKey: "group-lm", productId: "group-late",    active: lmActive  },
    ],
  },
];

const ACCENT = {
  tangerine: { border: "border-tangerine/40", ring: "ring-tangerine/60", badge: "bg-tangerine text-licorice", text: "text-tangerine", dot: "bg-tangerine" },
  hibiscus:  { border: "border-hibiscus/40",  ring: "ring-hibiscus/60",  badge: "bg-hibiscus text-bone",      text: "text-hibiscus",  dot: "bg-hibiscus"  },
  everglade: { border: "border-everglade/40", ring: "ring-everglade/60", badge: "bg-everglade text-bone",     text: "text-everglade", dot: "bg-everglade" },
};

// ── Savings Calculator ────────────────────────────────────────────────────────

function SavingsCalculator({
  locale,
  selectedKey,
  onKeyChange,
}: {
  locale: "de" | "en";
  selectedKey: string;
  onKeyChange: (key: string) => void;
}) {
  const [count, setCount] = useState(5);
  const availableKeys = CALC_OPTIONS;
  const option = availableKeys.find((o) => o.key === selectedKey) ?? availableKeys[0];
  const ticketPrice = option.price;
  const barTotal = count * NORMAL_PRICE;
  const festivalTotal = ticketPrice + count * FESTIVAL_PRICE;
  const savings = barTotal - festivalTotal;
  const breakEven = (ticketPrice / SAVINGS_PER).toFixed(1);

  const perPersonNote = option.isGroup
    ? locale === "de"
      ? `(${ticketPrice.toFixed(2).replace(".", ",")} € pro Person bei ${option.groupSize} Personen)`
      : `(€${ticketPrice.toFixed(2)} per person for ${option.groupSize} people)`
    : null;

  return (
    <div className="rounded-2xl bg-bone/[0.04] border border-bone/10 p-6 md:p-8 max-w-2xl mx-auto">
      <p className="text-[11px] font-body font-bold uppercase tracking-[0.15em] text-tangerine mb-1">
        {locale === "de" ? "Lohnt sich das Ticket?" : "Is the ticket worth it?"}
      </p>
      <h3 className="text-xl md:text-2xl font-display text-bone mb-2">
        {locale === "de" ? "Dein Spar-Rechner" : "Your Savings Calculator"}
      </h3>
      <p className="text-sm font-body text-bone/55 mb-6">
        {locale === "de"
          ? "Wähle ein Ticket oben aus oder passe hier manuell an."
          : "Select a ticket above or adjust manually here."}
      </p>

      {/* Ticket selector pills — only available tickets */}
      <div className="mb-6">
        <p className="text-xs font-body text-bone/55 uppercase tracking-wider mb-2">
          {locale === "de" ? "Ticket" : "Ticket"}
        </p>
        <div className="flex flex-wrap gap-2">
          {CALC_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => onKeyChange(opt.key)}
              className={`text-xs font-body px-3 py-1.5 rounded-full border transition-colors ${
                opt.key === selectedKey
                  ? "bg-tangerine text-licorice border-tangerine font-bold"
                  : "border-bone/20 text-bone/65 hover:border-bone/40 hover:text-bone/85"
              }`}
            >
              {opt.label[locale]}
            </button>
          ))}
        </div>
      </div>

      {/* Cocktail slider */}
      <label className="block text-sm font-body text-bone/80 mb-3">
        {locale === "de" ? "Wie viele Cocktails planst du? — " : "How many cocktails are you planning? — "}
        <span className="text-bone font-bold">{count}</span>
      </label>
      <input
        type="range" min={1} max={30} step={1} value={count}
        onChange={(e) => setCount(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-tangerine bg-bone/10 mb-6"
      />

      {/* Comparison rows */}
      <div className="space-y-3 mb-5">
        <div className="flex justify-between items-center text-sm font-body">
          <span className="text-bone/65">
            {locale === "de" ? `Normale Bar (${count} × 15 €)` : `Normal bar (${count} × €15)`}
          </span>
          <span className="text-bone/80 font-bold tabular-nums">
            {locale === "de" ? `${barTotal} €` : `€${barTotal}`}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm font-body">
          <span className="text-bone/65">
            {locale === "de"
              ? `Festival (${ticketPrice.toFixed(2).replace(".", ",")} € + ${count} × 6 €)`
              : `Festival (€${ticketPrice.toFixed(2)} + ${count} × €6)`}
          </span>
          <span className="text-bone font-bold tabular-nums">
            {locale === "de" ? `${festivalTotal.toFixed(2).replace(".", ",")} €` : `€${festivalTotal.toFixed(2)}`}
          </span>
        </div>
        <div className="h-px bg-bone/10" />
        <div className="flex justify-between items-center">
          <span className="text-sm font-body text-bone/65">
            {locale === "de" ? "Deine Ersparnis" : "Your savings"}
          </span>
          <span className={`text-xl font-display tabular-nums ${savings > 0 ? "text-emerald-400" : "text-hibiscus"}`}>
            {savings > 0
              ? locale === "de" ? `+ ${savings.toFixed(2).replace(".", ",")} €` : `+ €${savings.toFixed(2)}`
              : locale === "de" ? `− ${Math.abs(savings).toFixed(2).replace(".", ",")} €` : `− €${Math.abs(savings).toFixed(2)}`}
          </span>
        </div>
      </div>

      <p className="text-xs font-body text-bone/35 text-center">
        {locale === "de"
          ? `Ab ${breakEven} Cocktails lohnt sich das Ticket${perPersonNote ? " " + perPersonNote : ""} — du bist schon bei ${count}.`
          : `The ticket pays off after ${breakEven} cocktails${perPersonNote ? " " + perPersonNote : ""} — you're already at ${count}.`}
      </p>
    </div>
  );
}

// ── Check icon ────────────────────────────────────────────────────────────────

function Check() {
  return (
    <svg className="w-4 h-4 text-tangerine shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

const trustPoints = {
  de: ["Sofort per E-Mail", "18 Tage gültig", "58 Bars", "Kostenlose Stornierung"],
  en: ["Instant email delivery", "Valid for 18 days", "58 Bars", "Free cancellation"],
};

const passportFeatures = {
  de: [
    "Zugang zu allen 58 teilnehmenden Bars",
    "Signature Cocktails für nur 6 € statt 12–16 €",
    "Gilt für alle 18 Festivaltage – 1 Signature Cocktail pro Bar",
    "Digitaler Stempelpass mit Belohnungen",
    "Exklusive Events",
  ],
  en: [
    "Access to all 58 participating bars",
    "Signature cocktails for just €6 instead of €12–16",
    "Valid for all 18 festival days – 1 signature cocktail per bar",
    "Digital stamp passport with rewards",
    "Exclusive events",
  ],
};

export default function ShopPage() {
  const locale = useLocale() as "de" | "en";
  const activeTier = PASSPORT_TIERS[locale].find((t) => t.active)!;
  const [calcKey, setCalcKey] = useState(activeTier.calcKey);
  const calcRef = useRef<HTMLDivElement>(null);

  const heroReveal = useReveal({ delay: 150 });
  const trustReveal = useReveal({ delay: 250 });
  const otherReveal = useReveal({ delay: 200 });

  useEffect(() => {
    trackEvent("ViewContent", {
      content_name: "Shop — Festival Tickets",
      content_category: "Festival",
      content_type: "product_group",
      content_ids: activeTier.productId,
      currency: "EUR",
      value: activeTier.price,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function selectAndScroll(key: string) {
    setCalcKey(key);
    setTimeout(() => {
      calcRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  }

  return (
    <main className="relative">

      {/* ── BACKGROUND ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        <div style={{ position:"absolute", inset:0, backgroundImage:"url(/images/pattern-bg.svg)", backgroundSize:"200px 200px", backgroundRepeat:"repeat", opacity:0.18 }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(25,21,19,0.55) 0%, rgba(25,21,19,0.2) 25%, rgba(25,21,19,0.2) 75%, rgba(25,21,19,0.7) 100%)" }} />
        <div style={{ position:"absolute", top:"-200px", right:"-200px", width:"600px", height:"600px", borderRadius:"50%", background:"rgba(243,146,0,0.12)", filter:"blur(120px)" }} />
        <div style={{ position:"absolute", top:"30%", left:"-200px", width:"500px", height:"500px", borderRadius:"50%", background:"rgba(189,37,110,0.10)", filter:"blur(110px)" }} />
      </div>

      {/* ── HERO — COCKTAIL X PASSPORT ── */}
      <section className="section-padding min-h-[80vh] flex flex-col items-center justify-center relative">
        <p className="text-[11px] font-body font-bold uppercase tracking-[0.2em] text-tangerine mb-3">
          13.–30. Mai 2026 · München
        </p>
        <BlurText
          text={locale === "de" ? "SICHERE DIR DEIN TICKET" : "GET YOUR TICKET"}
          tag="h1"
          className="text-4xl md:text-6xl lg:text-7xl font-display text-bone text-center mb-4"
          delay={80}
          duration={0.7}
        />
        <p className="text-base font-body text-bone/65 text-center max-w-lg mb-10">
          {locale === "de"
            ? "Dein All-Access-Pass für 58 Bars, 18 Tage, unzählige Cocktails – zum Festivalpreis von 6 €."
            : "Your all-access pass for 58 bars, 18 days, countless cocktails – at the festival price of €6."}
        </p>

        <div ref={heroReveal.ref} style={heroReveal.style} className="w-full max-w-3xl mx-auto">
          {/* Passport card */}
          <div
            className={`relative rounded-3xl overflow-hidden border-2 bg-gradient-to-br from-tangerine/[0.10] via-licorice to-licorice cursor-pointer transition-all duration-200 ${
              calcKey.startsWith("passport")
                ? "border-tangerine/70 ring-2 ring-tangerine/30"
                : "border-tangerine/40 hover:border-tangerine/60"
            }`}
            onClick={() => selectAndScroll(activeTier.calcKey)}
          >
            <div style={{ position:"absolute", top:"-80px", right:"-80px", width:"256px", height:"256px", borderRadius:"50%", background:"rgba(243,146,0,0.14)", filter:"blur(60px)", pointerEvents:"none" }} />
            <div style={{ position:"absolute", bottom:"-64px", left:"-64px", width:"192px", height:"192px", borderRadius:"50%", background:"rgba(189,37,110,0.11)", filter:"blur(50px)", pointerEvents:"none" }} />
            <div style={{ position:"absolute", inset:0, backgroundImage:"url(/images/pattern-bg.svg)", backgroundSize:"120px 120px", backgroundRepeat:"repeat", opacity:0.08 }} />

            <div className="relative p-6 md:p-10">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="text-[10px] font-body font-bold uppercase tracking-wider text-licorice bg-tangerine px-3 py-1 rounded-full">
                  {locale === "de" ? "BESTER PREIS JETZT" : "BEST PRICE NOW"}
                </span>
                <span className="text-[10px] font-body font-bold uppercase tracking-wider text-tangerine/80 bg-tangerine/10 border border-tangerine/20 px-3 py-1 rounded-full">
                  {activeTier.label} · {activeTier.until}
                </span>
                {calcKey.startsWith("passport") && (
                  <span className="text-[10px] font-body font-bold uppercase tracking-wider text-licorice bg-emerald-400 px-3 py-1 rounded-full">
                    {locale === "de" ? "Im Rechner aktiv" : "Active in calculator"}
                  </span>
                )}
              </div>

              <div className="grid md:grid-cols-[1fr,auto] gap-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-display text-bone mb-1">COCKTAIL X PASSPORT</h2>
                  <p className="text-sm font-body text-bone/55 mb-5">
                    {locale === "de" ? "Vollzugang · Alle Tage · Alle Bars" : "Full access · All days · All bars"}
                  </p>
                  <ul className="space-y-2.5 mb-6">
                    {passportFeatures[locale].map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm font-body text-bone/85">
                        <Check />{f}
                      </li>
                    ))}
                  </ul>

                  {/* Pricing tiers */}
                  <div className="border-t border-bone/10 pt-5">
                    <p className="text-[10px] font-body font-bold uppercase tracking-[0.12em] text-bone/30 mb-3">
                      {locale === "de" ? "Preisentwicklung" : "Pricing schedule"}
                    </p>
                    <div className="space-y-2">
                      {PASSPORT_TIERS[locale].map((tier) => (
                        <button
                          key={tier.calcKey}
                          onClick={(e) => { e.stopPropagation(); selectAndScroll(tier.calcKey); }}
                          className={`w-full flex items-center justify-between text-sm font-body rounded-lg px-2 py-1.5 transition-colors ${
                            tier.calcKey === calcKey
                              ? "bg-tangerine/10 text-bone"
                              : tier.active
                                ? "text-bone hover:bg-bone/5"
                                : "text-bone/35 hover:bg-bone/5"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${tier.active ? "bg-tangerine" : "bg-bone/20"}`} />
                            <span>{tier.label}</span>
                            <span className={`text-xs ${tier.active ? "text-bone/65" : "text-bone/25"}`}>· {tier.until}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-xs ${tier.active ? "text-bone/55" : "text-bone/20"}`}>
                              {locale === "de"
                                ? `ab ${(tier.price / SAVINGS_PER).toFixed(1)} Cocktails`
                                : `from ${(tier.price / SAVINGS_PER).toFixed(1)} cocktails`}
                            </span>
                            <span className={`font-bold tabular-nums ${tier.active ? "text-tangerine" : ""}`}>
                              {tier.price} €
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price + CTA */}
                <div className="flex flex-col items-center justify-center md:min-w-[200px] md:border-l md:border-bone/10 md:pl-8">
                  <div className="flex items-baseline gap-3 mb-1">
                    {activeTier.price < 49 && (
                      <span className="text-2xl font-display text-bone/25 line-through">€49</span>
                    )}
                    <span className="text-6xl md:text-7xl font-display text-tangerine">€{activeTier.price}</span>
                  </div>
                  {activeTier.price < 49 && (
                    <span className="text-xs font-body text-emerald-400 font-bold mb-1">
                      {locale === "de" ? `Du sparst ${49 - activeTier.price} €` : `You save €${49 - activeTier.price}`}
                    </span>
                  )}
                  <span className="text-[11px] font-body text-bone/55 mb-6">
                    {locale === "de" ? "pro Person" : "per person"}
                  </span>
                  <ShopifyBuyButton
                    productId={activeTier.productId}
                    buttonText={locale === "de" ? "JETZT KAUFEN" : "BUY NOW"}
                    className="w-full text-center text-base py-4"
                    price={activeTier.price}
                  />
                  <div className="flex items-center gap-1.5 mt-3 text-[11px] font-body font-bold text-tangerine/70">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-tangerine animate-pulse" />
                    {locale === "de" ? "Limitiertes Kontingent" : "Limited availability"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust bar */}
        <div ref={trustReveal.ref} style={trustReveal.style} className="flex flex-wrap justify-center gap-6 md:gap-10 mt-8">
          {trustPoints[locale].map((point, i) => (
            <div key={i} className="flex items-center gap-2 text-xs font-body text-bone/55">
              <svg className="w-3.5 h-3.5 text-tangerine/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {point}
            </div>
          ))}
        </div>
      </section>


      {/* ── WEITERE TICKETS ── */}
      <section className="py-16 md:py-24 px-4 relative">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-display text-bone text-center mb-2">
            {locale === "de" ? "WEITERE TICKETS" : "MORE TICKETS"}
          </h2>
          <p className="text-sm font-body text-bone/55 text-center mb-3">
            {locale === "de"
              ? "Gruppen-Tickets und mehr – für jeden das passende Angebot."
              : "Group tickets and more – the right option for everyone."}
          </p>
          {!newTicketsAvailable && (
            <p className="text-xs font-body text-tangerine/70 text-center mb-10 font-bold uppercase tracking-wider">
              {locale === "de" ? "Ab 1. April verfügbar" : "Available from April 1"}
            </p>
          )}
          {newTicketsAvailable && <div className="mb-10" />}

          <div ref={otherReveal.ref} style={otherReveal.style} className="grid md:grid-cols-3 gap-5">
            {OTHER_TICKETS.map((ticket) => {
              const c = ACCENT[ticket.accent];
              const activeTierHere = ticket.tiers.find((t) => t.active)!;
              const isSelected = ticket.tiers.some((t) => t.calcKey === calcKey);

              return (
                <div
                  key={ticket.key}
                  onClick={() => newTicketsAvailable && selectAndScroll(activeTierHere.calcKey)}
                  className={`relative rounded-2xl border bg-licorice/60 p-6 flex flex-col transition-all duration-200 ${
                    newTicketsAvailable ? "cursor-pointer" : "cursor-default opacity-70"
                  } ${
                    isSelected && newTicketsAvailable
                      ? `${c.border} ring-2 ${c.ring}`
                      : c.border
                  } ${newTicketsAvailable ? "hover:bg-licorice/80" : ""}`}
                >
                  {/* Coming soon overlay */}
                  {!newTicketsAvailable && (
                    <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
                      <span className="text-[10px] font-body font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-bone/10 text-bone/65">
                        {locale === "de" ? "Ab 1. April" : "From April 1"}
                      </span>
                    </div>
                  )}

                  {/* Badge (NEW etc.) */}
                  {ticket.badge[locale] && newTicketsAvailable && (
                    <span className={`absolute top-4 right-4 text-[10px] font-body font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${c.badge}`}>
                      {ticket.badge[locale]}
                    </span>
                  )}

                  {/* Active in calculator badge */}
                  {isSelected && newTicketsAvailable && (
                    <span className="absolute top-4 right-4 text-[10px] font-body font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-400 text-licorice">
                      {locale === "de" ? "Im Rechner" : "In calculator"}
                    </span>
                  )}

                  <h3 className="text-xl font-display text-bone mb-1 mt-1">{ticket.name}</h3>
                  <p className={`text-xs font-body font-bold mb-4 ${c.text}`}>{ticket.tagline[locale]}</p>
                  <p className="text-sm font-body text-bone/75 leading-relaxed mb-6 flex-1">
                    {ticket.description[locale]}
                  </p>

                  {/* Pricing tiers */}
                  <div className="space-y-2 mb-6">
                    {ticket.tiers.map((tier) => (
                      <button
                        key={tier.calcKey}
                        disabled={!newTicketsAvailable}
                        onClick={(e) => { e.stopPropagation(); selectAndScroll(tier.calcKey); }}
                        className={`w-full flex items-center justify-between text-sm font-body rounded-lg px-2 py-1.5 transition-colors ${
                          tier.calcKey === calcKey && newTicketsAvailable
                            ? "bg-bone/10 text-bone"
                            : tier.active
                              ? "text-bone hover:bg-bone/5"
                              : "text-bone/35 hover:bg-bone/5"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${tier.active ? c.dot : "bg-bone/20"}`} />
                          <span>{tier.label}</span>
                          <span className={`text-xs ${tier.active ? "text-bone/55" : "text-bone/20"}`}>· {tier.until[locale]}</span>
                        </div>
                        <div className="text-right">
                          <span className={`font-bold tabular-nums ${tier.active && newTicketsAvailable ? c.text : ""}`}>
                            {tier.price} €
                          </span>
                          <span className={`block text-[10px] ${tier.active ? "text-bone/55" : "text-bone/20"}`}>
                            {tier.perPerson
                              ? locale === "de"
                                ? `≙ ${tier.perPerson.toFixed(2).replace(".", ",")} €/Person`
                                : `≙ €${tier.perPerson.toFixed(2)}/person`
                              : locale === "de"
                                ? `ab ${(tier.price / SAVINGS_PER).toFixed(1)} Cocktails`
                                : `from ${(tier.price / SAVINGS_PER).toFixed(1)} cocktails`}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* CTA */}
                  {newTicketsAvailable ? (
                    <ShopifyBuyButton
                      productId={activeTierHere.productId}
                      buttonText={locale === "de" ? `AB ${activeTierHere.price} € KAUFEN` : `BUY FROM €${activeTierHere.price}`}
                      className="w-full text-center text-sm py-3"
                      price={activeTierHere.price}
                    />
                  ) : (
                    <div className="w-full text-center text-sm py-3 rounded-xl border border-bone/15 text-bone/30 font-body font-bold uppercase tracking-wider cursor-not-allowed">
                      {locale === "de" ? "Ab 1. April verfügbar" : "Available from April 1"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SAVINGS CALCULATOR ── */}
      <section className="pb-16 md:pb-24 px-4 relative" ref={calcRef}>
        <SavingsCalculator locale={locale} selectedKey={calcKey} onKeyChange={setCalcKey} />
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="section-padding text-center relative">
        <p className="text-sm font-body text-bone/55 mb-4">
          {locale === "de" ? "Fragen zum Festival oder Ticket?" : "Questions about the festival or ticket?"}
        </p>
        <Link
          href={`/${locale}/about/contact`}
          className="text-sm font-body font-bold text-tangerine hover:text-tangerine/80 transition-colors underline underline-offset-4"
        >
          {locale === "de" ? "Kontaktiere uns" : "Contact us"}
        </Link>
      </section>
    </main>
  );
}
