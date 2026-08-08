"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { LIMITS } from "@/lib/pricing/assumptions";
import {
  GROUP_LABELS,
  formatEuro,
  formatEuroExact,
  type BarConcept,
  type EventConfig,
  type EventKind,
  type FoodOption,
  type LineGroup,
  type PublicQuote,
} from "@/lib/pricing/types";

const DEFAULTS: EventConfig = {
  kind: "corporate",
  guests: 150,
  hours: 4,
  drinksPerGuest: 3,
  concept: "classic",
  food: "none",
  softDrinks: true,
};

const KINDS: { value: EventKind; label: string }[] = [
  { value: "corporate", label: "Firmenevent" },
  { value: "messe", label: "Messe" },
  { value: "launch", label: "Product Launch" },
  { value: "team", label: "Team Event" },
  { value: "networking", label: "Networking" },
];

const CONCEPTS: { value: BarConcept; label: string; hint: string; badge?: string }[] = [
  { value: "classic", label: "Classic", hint: "Klassisch geschüttelt, kuratierte Karte" },
  { value: "nitro", label: "Nitro High-Volume", hint: "Höchster Durchsatz, kürzeste Wartezeit", badge: "Empfehlung" },
  { value: "signature", label: "Signature", hint: "Drinks in eurer Markenwelt entwickelt" },
  { value: "highball", label: "Highballs", hint: "Schnell, leicht, sommerlich" },
];

const FOODS: { value: FoodOption; label: string; hint: string }[] = [
  { value: "none", label: "Nur Bar", hint: "Kein Food" },
  { value: "fingerfood", label: "One Bites", hint: "Mundgerechtes Fingerfood, einhändig" },
  { value: "flyingBuffet", label: "Flying Buffet", hint: "Ersetzt eine Mahlzeit" },
];

const GROUP_ORDER: LineGroup[] = ["drinks", "food", "staff", "equipment", "logistics"];

function configFromParams(params: URLSearchParams): EventConfig {
  const int = (key: string, fallback: number, min: number, max: number) => {
    const n = Math.round(Number(params.get(key)));
    return Number.isFinite(n) && n !== 0 ? Math.min(max, Math.max(min, n)) : fallback;
  };
  const oneOf = <T extends string>(key: string, allowed: readonly T[], fallback: T): T => {
    const v = params.get(key) as T | null;
    return v && allowed.includes(v) ? v : fallback;
  };
  return {
    kind: oneOf("anlass", KINDS.map((k) => k.value), DEFAULTS.kind),
    guests: int("gaeste", DEFAULTS.guests, LIMITS.minGuests, LIMITS.maxGuests),
    hours: int("stunden", DEFAULTS.hours, LIMITS.minHours, LIMITS.maxHours),
    drinksPerGuest: int("drinks", DEFAULTS.drinksPerGuest, LIMITS.minDrinksPerGuest, LIMITS.maxDrinksPerGuest),
    concept: oneOf("bar", CONCEPTS.map((c) => c.value), DEFAULTS.concept),
    food: oneOf("food", FOODS.map((f) => f.value), DEFAULTS.food),
    softDrinks: params.get("softs") !== "0",
  };
}

function paramsFromConfig(config: EventConfig): string {
  return new URLSearchParams({
    anlass: config.kind,
    gaeste: String(config.guests),
    stunden: String(config.hours),
    drinks: String(config.drinksPerGuest),
    bar: config.concept,
    food: config.food,
    softs: config.softDrinks ? "1" : "0",
  }).toString();
}

function Slider({
  label, value, min, max, step = 1, suffix, onChange, hint,
}: {
  label: string; value: number; min: number; max: number; step?: number;
  suffix: string; onChange: (v: number) => void; hint?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label className="font-body text-xs uppercase tracking-wider text-everglade/55">{label}</label>
        <span className="font-display text-xl text-licorice tabular-nums">
          {value.toLocaleString("de-DE")} <span className="text-sm text-everglade/50">{suffix}</span>
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-ct-red"
        aria-label={label}
      />
      {hint && <p className="font-body text-xs text-everglade/45 mt-1.5">{hint}</p>}
    </div>
  );
}

function OptionGrid<T extends string>({
  label, value, options, onChange, columns = 2,
}: {
  label: string;
  value: T;
  options: { value: T; label: string; hint?: string; badge?: string }[];
  onChange: (v: T) => void;
  columns?: number;
}) {
  return (
    <div>
      <p className="font-body text-xs uppercase tracking-wider text-everglade/55 mb-3">{label}</p>
      <div className={`grid gap-2 ${columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              aria-pressed={active}
              className={`relative text-left rounded-xl border px-4 py-3 transition-colors duration-150 ${
                active
                  ? "border-ct-red bg-ct-red/5"
                  : "border-everglade/15 bg-white/60 hover:border-everglade/35"
              }`}
            >
              <span className="block font-body font-bold text-sm text-licorice">{o.label}</span>
              {o.hint && <span className="block font-body text-xs text-everglade/55 mt-0.5">{o.hint}</span>}
              {o.badge && (
                <span className="absolute top-2 right-2 rounded-full bg-ct-red px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-wider text-white">
                  {o.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Configurator() {
  const locale = useLocale() as "de" | "en";
  const router = useRouter();
  const searchParams = useSearchParams();

  const [config, setConfig] = useState<EventConfig>(() => configFromParams(new URLSearchParams(searchParams.toString())));
  const [quote, setQuote] = useState<PublicQuote | null>(null);
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [copied, setCopied] = useState(false);
  const requestId = useRef(0);

  const set = useCallback(<K extends keyof EventConfig>(key: K, value: EventConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Debounced server-side calculation. The engine stays on the server so purchase
  // prices never reach the browser.
  useEffect(() => {
    const id = ++requestId.current;
    setPending(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(config),
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (id === requestId.current) {
          setQuote(data.quote);
          setFailed(false);
        }
      } catch {
        if (id === requestId.current) setFailed(true);
      } finally {
        if (id === requestId.current) setPending(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [config]);

  // Keep the URL in sync so a configuration can be forwarded internally.
  useEffect(() => {
    const query = paramsFromConfig(config);
    router.replace(`?${query}`, { scroll: false });
  }, [config, router]);

  const grouped = useMemo(() => {
    if (!quote) return [];
    return GROUP_ORDER.map((group) => ({
      group,
      items: quote.items.filter((i) => i.group === group),
      total: quote.items.filter((i) => i.group === group).reduce((s, i) => s + i.total, 0),
    })).filter((g) => g.items.length > 0);
  }, [quote]);

  const blocked = (quote?.blockers.length ?? 0) > 0;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard denied, the URL is in the address bar either way */
    }
  };

  return (
    <div className="grid lg:grid-cols-[1fr,400px] gap-10 lg:gap-14 items-start">
      {/* ── Controls ── */}
      <div className="space-y-9">
        <OptionGrid
          label="Anlass"
          value={config.kind}
          options={KINDS}
          onChange={(v) => set("kind", v)}
          columns={3}
        />

        <div className="grid sm:grid-cols-2 gap-6">
          <Slider
            label="Gäste"
            value={config.guests}
            min={LIMITS.minGuests}
            max={LIMITS.maxGuests}
            step={config.guests >= 500 ? 50 : 10}
            suffix="Personen"
            onChange={(v) => set("guests", v)}
          />
          <Slider
            label="Dauer"
            value={config.hours}
            min={LIMITS.minHours}
            max={LIMITS.maxHours}
            suffix="Stunden"
            onChange={(v) => set("hours", v)}
            hint="Auf- und Abbau sind separat kalkuliert."
          />
        </div>

        <Slider
          label="Drinks pro Gast"
          value={config.drinksPerGuest}
          min={LIMITS.minDrinksPerGuest}
          max={LIMITS.maxDrinksPerGuest}
          suffix={config.drinksPerGuest === 1 ? "Drink" : "Drinks"}
          onChange={(v) => set("drinksPerGuest", v)}
          hint="Erfahrungswert: 2 bei kurzen Empfängen, 3 bis 4 bei Abendveranstaltungen."
        />

        <OptionGrid
          label="Bar-Konzept"
          value={config.concept}
          options={CONCEPTS}
          onChange={(v) => set("concept", v)}
        />

        <OptionGrid
          label="Food"
          value={config.food}
          options={FOODS}
          onChange={(v) => set("food", v)}
          columns={3}
        />

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={config.softDrinks}
            onChange={(e) => set("softDrinks", e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-ct-red"
          />
          <span>
            <span className="block font-body font-bold text-sm text-licorice">
              Softdrinks & Wasser inklusive
            </span>
            <span className="block font-body text-xs text-everglade/55">
              Pauschale pro Gast, deckt 5 Stunden ab.
            </span>
          </span>
        </label>
      </div>

      {/* ── Live summary ── */}
      <div className="lg:sticky lg:top-28">
        <div className="rounded-2xl bg-white border border-everglade/10 shadow-xl shadow-everglade/5 overflow-hidden">
          <div className="bg-licorice px-6 py-6">
            <p className="font-body text-[10px] uppercase tracking-[0.25em] text-ct-cream/45 mb-2">
              Richtpreis · netto
            </p>
            {blocked ? (
              <p className="font-display text-2xl text-ct-cream leading-tight">
                Individuelles Angebot
              </p>
            ) : (
              <div className={pending ? "opacity-50 transition-opacity" : "transition-opacity"}>
                <p className="font-display text-4xl text-ct-cream tabular-nums leading-none">
                  {quote ? formatEuro(quote.net) : "…"}
                </p>
                <p className="font-body text-sm text-ct-cream/55 mt-2 tabular-nums">
                  {quote ? `${formatEuroExact(quote.netPerGuest)} pro Gast` : " "}
                </p>
              </div>
            )}
          </div>

          {failed && (
            <p className="px-6 py-4 font-body text-xs text-ct-red">
              Berechnung fehlgeschlagen. Bitte kurz warten oder Seite neu laden.
            </p>
          )}

          {blocked ? (
            <div className="px-6 py-5">
              <p className="font-body text-sm text-everglade/70 leading-relaxed">
                Diese Konfiguration liegt außerhalb des Standardrahmens. Wir kalkulieren sie
                individuell, meist innerhalb von 24 Stunden.
              </p>
            </div>
          ) : (
            quote && (
              <div className="px-6 py-5 space-y-4">
                <div className="space-y-2">
                  {grouped.map(({ group, total }) => (
                    <div key={group} className="flex justify-between font-body text-sm">
                      <span className="text-everglade/65">{GROUP_LABELS[group]}</span>
                      <span className="text-licorice tabular-nums">{formatEuro(total)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-everglade/10 space-y-1.5">
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-everglade/65">Netto</span>
                    <span className="text-licorice tabular-nums">{formatEuroExact(quote.net)}</span>
                  </div>
                  <div className="flex justify-between font-body text-xs">
                    <span className="text-everglade/50">zzgl. 19% MwSt.</span>
                    <span className="text-everglade/50 tabular-nums">{formatEuroExact(quote.vat)}</span>
                  </div>
                  <div className="flex justify-between font-body font-bold text-sm pt-1">
                    <span className="text-licorice">Brutto</span>
                    <span className="text-licorice tabular-nums">{formatEuroExact(quote.gross)}</span>
                  </div>
                </div>

                <div className="rounded-xl bg-ct-cream/60 px-4 py-3">
                  <p className="font-body text-[10px] uppercase tracking-wider text-everglade/50 mb-1.5">
                    Setup
                  </p>
                  <p className="font-body text-xs text-everglade/70 leading-relaxed">
                    {quote.staffing.bars} {quote.staffing.bars === 1 ? "Bar" : "Bars"} ·{" "}
                    {quote.staffing.barkeepers} {quote.staffing.barkeepers === 1 ? "Barkeeper" : "Barkeeper"}
                    {quote.staffing.barBacks > 0 && ` · ${quote.staffing.barBacks} Barschankkräfte`}
                    {quote.staffing.serviceStaff > 0 && ` · ${quote.staffing.serviceStaff} Servicekräfte`}
                    {" · "}
                    {config.guests * config.drinksPerGuest} Drinks
                  </p>
                </div>

                {quote.notes.length > 0 && (
                  <ul className="space-y-2">
                    {quote.notes.map((note, i) => (
                      <li key={i} className="flex gap-2 font-body text-xs text-everglade/60 leading-relaxed">
                        <span className="text-ct-red mt-0.5 flex-shrink-0">→</span>
                        {note}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          )}

          <div className="px-6 pb-6 pt-2 space-y-2">
            <Link
              href={`/${locale}/catering/kontakt?${paramsFromConfig(config)}`}
              className="block w-full text-center px-6 py-4 rounded-full bg-ct-red text-white font-body font-bold text-sm uppercase tracking-wider hover:bg-ct-red/85 transition-colors"
            >
              Angebot anfordern
            </Link>
            <button
              type="button"
              onClick={copyLink}
              className="block w-full text-center px-6 py-3 rounded-full border border-everglade/20 font-body font-bold text-xs uppercase tracking-wider text-everglade/70 hover:border-everglade/40 transition-colors"
            >
              {copied ? "Link kopiert" : "Konfiguration teilen"}
            </button>
            <p className="font-body text-[11px] text-everglade/45 text-center leading-relaxed pt-1">
              Richtpreis auf Basis eurer Angaben, keine verbindliche Zusage. Anfahrt innerhalb
              Münchens enthalten.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
