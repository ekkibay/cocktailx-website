"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2, Share2 } from "lucide-react";
import { LIMITS } from "@/lib/pricing/assumptions";
import {
  BAR_PACKAGE_KEYS,
  formatEuro,
  formatEuroExact,
  type PackageQuote,
  type PublicPackage,
} from "@/lib/pricing/types";

const EASE = [0.16, 1, 0.3, 1] as const;

const OCCASIONS = [
  { key: "Firmenfeier", image: "/images/catering/ct-guest-1.jpg", accent: "bg-tangerine" },
  { key: "Sommerfest", image: "/images/catering/ct-cocktail-green.jpg", accent: "bg-ct-green" },
  { key: "Messe & Standparty", image: "/images/catering/ct-bar-1.jpg", accent: "bg-bay-of-many" },
  { key: "Produktlaunch", image: "/images/catering/ct-molecular.jpg", accent: "bg-hibiscus" },
  { key: "Weihnachtsfeier", image: "/images/catering/ct-tuxedo-drinks.jpg", accent: "bg-ct-wine" },
  { key: "Jubiläum & Gala", image: "/images/catering/ct-champagne.jpg", accent: "bg-jambalaya" },
  { key: "Kunden-Dinner", image: "/images/catering/ct-table-cocktails.jpg", accent: "bg-everglade" },
  { key: "Afterwork", image: "/images/catering/ct-drinks-hand.jpg", accent: "bg-ct-navy" },
];

const STEPS = ["Anlass", "Eckdaten", "Bar", "Ergänzen", "Kontakt"] as const;

/** Erlebnisformate ersetzen das Bar-Paket, weil sie Personal und Anfahrt selbst tragen. */
const EXPERIENCE_KEYS = ["masterclass", "team-experience"];

const EXTRA_GROUPS: { label: string; hint: string; keys: string[] }[] = [
  { label: "Getränke dazu", hint: "Ergänzt euer Bar-Paket", keys: ["welcome-drink", "softs-flat"] },
  { label: "Food", hint: "Für Formate im Stehen gebaut", keys: ["one-bites", "flying-buffet"] },
  { label: "Erlebnis", hint: "Statt Bar: Team selbst hinter den Shaker", keys: ["masterclass", "team-experience"] },
  {
    label: "Zusatzleistungen",
    hint: "Einzeln zubuchbar",
    keys: ["signature-development", "bar-branding", "service-staff", "dj", "photo-wall", "media-tech"],
  },
];

interface Contact {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
}

interface State {
  occasion: string;
  date: string;
  guests: number;
  hours: number;
  barPackage: string | null;
  extras: string[];
}

const DEFAULTS: State = {
  occasion: "",
  date: "",
  guests: 150,
  hours: 4,
  barPackage: null,
  extras: [],
};

function stateFromParams(params: URLSearchParams): State {
  const int = (k: string, fb: number, min: number, max: number) => {
    const n = Math.round(Number(params.get(k)));
    return Number.isFinite(n) && n > 0 ? Math.min(max, Math.max(min, n)) : fb;
  };
  return {
    occasion: params.get("anlass") ?? "",
    date: /^\d{4}-\d{2}-\d{2}$/.test(params.get("datum") ?? "") ? params.get("datum")! : "",
    guests: int("gaeste", DEFAULTS.guests, LIMITS.minGuests, LIMITS.maxGuests),
    hours: int("stunden", DEFAULTS.hours, LIMITS.minHours, LIMITS.maxHours),
    barPackage: params.get("bar"),
    extras: (params.get("extras") ?? "").split(",").filter(Boolean),
  };
}

function paramsFromState(s: State): string {
  const p = new URLSearchParams();
  if (s.occasion) p.set("anlass", s.occasion);
  if (s.date) p.set("datum", s.date);
  p.set("gaeste", String(s.guests));
  p.set("stunden", String(s.hours));
  if (s.barPackage) p.set("bar", s.barPackage);
  if (s.extras.length) p.set("extras", s.extras.join(","));
  return p.toString();
}

function guestsAllowed(pkg: PublicPackage, guests: number) {
  if (pkg.minPersons !== null && guests < pkg.minPersons) return { ok: false, why: `ab ${pkg.minPersons} Gästen` };
  if (pkg.maxPersons !== null && guests > pkg.maxPersons) return { ok: false, why: `bis ${pkg.maxPersons} Gäste` };
  return { ok: true, why: "" };
}

function Slider({
  label, value, min, max, step = 1, suffix, onChange, hint,
}: {
  label: string; value: number; min: number; max: number; step?: number;
  suffix: string; onChange: (v: number) => void; hint?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <label className="font-body text-xs uppercase tracking-[0.2em] text-everglade/55">{label}</label>
        <span className="font-display text-3xl text-licorice tabular-nums leading-none">
          {value.toLocaleString("de-DE")}{" "}
          <span className="font-body text-sm text-everglade/50">{suffix}</span>
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
      {hint && <p className="font-body text-xs text-everglade/45 mt-2">{hint}</p>}
    </div>
  );
}

export function AnfrageWizard({ packages, today }: { packages: PublicPackage[]; today: string }) {
  const byKey = useMemo(() => new Map(packages.map((p) => [p.key, p])), [packages]);
  const barPackages = useMemo(
    () => BAR_PACKAGE_KEYS.map((k) => byKey.get(k)).filter((p): p is PublicPackage => Boolean(p)),
    [byKey],
  );

  const [step, setStep] = useState(0);
  const [state, setState] = useState<State>(DEFAULTS);
  const [contact, setContact] = useState<Contact>({ name: "", company: "", email: "", phone: "", message: "" });
  const [quote, setQuote] = useState<PackageQuote | null>(null);
  const [pending, setPending] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [copied, setCopied] = useState(false);
  const reqId = useRef(0);

  // Beim ersten Rendern die URL lesen, damit geteilte Konfigurationen aufgehen.
  useEffect(() => {
    const s = stateFromParams(new URLSearchParams(window.location.search));
    setState(s);
    if (s.barPackage) setStep(3);
    else if (s.occasion) setStep(1);
  }, []);

  const set = useCallback(<K extends keyof State>(k: K, v: State[K]) => {
    setState((prev) => ({ ...prev, [k]: v }));
  }, []);

  const toggleExtra = useCallback((key: string) => {
    setState((prev) => ({
      ...prev,
      extras: prev.extras.includes(key) ? prev.extras.filter((k) => k !== key) : [...prev.extras, key],
    }));
  }, []);

  // Preis serverseitig, damit Einkaufspreise nie im Browser landen.
  useEffect(() => {
    if (!state.barPackage && state.extras.length === 0) {
      setQuote(null);
      return;
    }
    const id = ++reqId.current;
    setPending(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch("/api/paket-angebot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...state, date: state.date || null }),
        });
        const data = await res.json();
        if (id === reqId.current) setQuote(data.quote);
      } catch {
        if (id === reqId.current) setQuote(null);
      } finally {
        if (id === reqId.current) setPending(false);
      }
    }, 220);
    return () => clearTimeout(t);
  }, [state]);

  // URL mitschreiben, ohne Navigation.
  useEffect(() => {
    const q = paramsFromState(state);
    window.history.replaceState(null, "", q ? `?${q}` : window.location.pathname);
  }, [state]);

  const canAdvance = useMemo(() => {
    switch (step) {
      case 0:
        return state.occasion !== "";
      case 1:
        return state.guests >= LIMITS.minGuests;
      case 2:
        // Bar ist optional: wer nur eine Masterclass will, überspringt sie.
        return true;
      case 3:
        return state.barPackage !== null || state.extras.some((k) => EXPERIENCE_KEYS.includes(k));
      case 4:
        return (
          contact.name.trim() !== "" &&
          /\S+@\S+\.\S+/.test(contact.email) &&
          (state.barPackage !== null || state.extras.some((k) => EXPERIENCE_KEYS.includes(k)))
        );
      default:
        return false;
    }
  }, [step, state, contact]);

  const submit = async () => {
    setSubmitState("sending");
    try {
      const res = await fetch("/api/anfrage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...state, date: state.date || null, contact }),
      });
      if (!res.ok) throw new Error();
      setSubmitState("done");
    } catch {
      setSubmitState("error");
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Zwischenablage verweigert, die URL steht ohnehin in der Adressleiste */
    }
  };

  const blocked = (quote?.blockers.length ?? 0) > 0;

  if (submitState === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="max-w-xl mx-auto text-center py-20"
      >
        <div className="w-16 h-16 rounded-full bg-ct-red/10 border border-ct-red/25 flex items-center justify-center mx-auto mb-7">
          <Check className="w-7 h-7 text-ct-red" strokeWidth={2} />
        </div>
        <h2 className="font-display text-3xl md:text-4xl text-licorice mb-4">Anfrage ist bei uns.</h2>
        <p className="font-body text-base text-everglade/65 leading-relaxed mb-8">
          Ihr bekommt das schriftliche Angebot innerhalb von 24 Stunden. Wenn es schneller gehen
          soll, ruft an: 015255709985.
        </p>
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex items-center gap-2 font-body text-xs font-bold uppercase tracking-wider text-ct-red hover:text-ct-red/70 transition-colors"
        >
          <Share2 className="w-4 h-4" strokeWidth={2} />
          {copied ? "Link kopiert" : "Konfiguration teilen"}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[1fr,380px] gap-10 lg:gap-14 items-start">
      <div>
        {/* ── Schrittleiste ── */}
        <div className="flex items-center gap-1.5 mb-10">
          {STEPS.map((label, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <button
                key={label}
                type="button"
                onClick={() => i <= step && setStep(i)}
                disabled={i > step}
                className="flex-1 text-left group"
                aria-current={active ? "step" : undefined}
              >
                <div className="h-[3px] rounded-full bg-everglade/12 overflow-hidden mb-2.5">
                  <motion.div
                    className="h-full bg-ct-red origin-left"
                    initial={false}
                    animate={{ scaleX: done || active ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  />
                </div>
                <span
                  className={`font-body text-[10px] uppercase tracking-[0.18em] transition-colors ${
                    active ? "text-ct-red font-bold" : done ? "text-everglade/55" : "text-everglade/30"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            {/* ══ 0 Anlass ══ */}
            {step === 0 && (
              <div>
                <h2 className="font-display text-3xl md:text-4xl text-licorice mb-2">Was ist der Anlass?</h2>
                <p className="font-body text-sm text-everglade/60 mb-8">
                  Danach richtet sich alles: Trinkgeschwindigkeit, Personal, Aufbau.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {OCCASIONS.map((o) => {
                    const active = state.occasion === o.key;
                    return (
                      <button
                        key={o.key}
                        type="button"
                        onClick={() => {
                          set("occasion", o.key);
                          setStep(1);
                        }}
                        className={`group relative h-36 md:h-44 rounded-xl overflow-hidden text-left ring-2 transition-all duration-300 ${
                          active ? "ring-ct-red" : "ring-transparent hover:ring-everglade/25"
                        }`}
                      >
                        <Image
                          src={o.image}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-licorice via-licorice/40 to-licorice/5" />
                        <div className={`absolute left-0 top-0 h-full w-[3px] ${o.accent}`} />
                        <span className="absolute bottom-3 left-4 right-3 font-display text-base md:text-lg text-white leading-tight">
                          {o.key}
                        </span>
                        {active && (
                          <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-ct-red flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ══ 1 Eckdaten ══ */}
            {step === 1 && (
              <div className="space-y-9">
                <div>
                  <h2 className="font-display text-3xl md:text-4xl text-licorice mb-2">Die Eckdaten.</h2>
                  <p className="font-body text-sm text-everglade/60">
                    Das Datum bestimmt den Preis: Montag bis Donnerstag ist am günstigsten.
                  </p>
                </div>

                <div>
                  <label className="block font-body text-xs uppercase tracking-[0.2em] text-everglade/55 mb-3">
                    Datum
                  </label>
                  <input
                    type="date"
                    min={today}
                    value={state.date}
                    onChange={(e) => set("date", e.target.value)}
                    className="w-full sm:w-auto bg-white border border-everglade/15 rounded-xl px-5 py-4 font-body text-licorice focus:outline-none focus:border-ct-red transition-colors"
                  />
                  <p className="font-body text-xs text-everglade/45 mt-2">
                    Noch offen? Lasst es leer, wir rechnen mit dem Wochentarif.
                  </p>
                </div>

                <Slider
                  label="Gäste"
                  value={state.guests}
                  min={LIMITS.minGuests}
                  max={LIMITS.maxGuests}
                  step={state.guests >= 500 ? 50 : 10}
                  suffix="Personen"
                  onChange={(v) => set("guests", v)}
                />

                <Slider
                  label="Dauer"
                  value={state.hours}
                  min={LIMITS.minHours}
                  max={LIMITS.maxHours}
                  suffix="Stunden"
                  onChange={(v) => set("hours", v)}
                  hint="Auf- und Abbau kommen dazu und sind separat kalkuliert."
                />
              </div>
            )}

            {/* ══ 2 Bar ══ */}
            {step === 2 && (
              <div>
                <h2 className="font-display text-3xl md:text-4xl text-licorice mb-2">Welche Bar?</h2>
                <p className="font-body text-sm text-everglade/60 mb-8">
                  Barteam, Glaswerk und Equipment sind in jedem Paket enthalten.
                </p>
                <div className="space-y-3">
                  {barPackages.map((pkg) => {
                    const allowed = guestsAllowed(pkg, state.guests);
                    const active = state.barPackage === pkg.key;
                    const line = quote?.lines.find((l) => l.key === pkg.key);
                    return (
                      <button
                        key={pkg.key}
                        type="button"
                        disabled={!allowed.ok}
                        onClick={() => set("barPackage", pkg.key)}
                        className={`w-full flex gap-5 rounded-xl border p-4 md:p-5 text-left transition-all duration-200 ${
                          active
                            ? "border-ct-red bg-ct-red/[0.04]"
                            : allowed.ok
                              ? "border-everglade/12 bg-white hover:border-everglade/30"
                              : "border-everglade/8 bg-everglade/[0.02] opacity-45 cursor-not-allowed"
                        }`}
                      >
                        {pkg.image && (
                          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={pkg.image} alt="" fill sizes="96px" className="object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-display text-lg text-licorice">{pkg.title}</h3>
                            {pkg.isRecommended && (
                              <span className="rounded-full bg-ct-red px-2 py-0.5 font-body text-[9px] font-bold uppercase tracking-wider text-white">
                                Empfehlung
                              </span>
                            )}
                          </div>
                          <p className="font-body text-xs text-everglade/60 leading-relaxed mb-2 line-clamp-2">
                            {pkg.description}
                          </p>
                          <p className="font-body text-[11px] text-everglade/45">
                            {allowed.ok ? pkg.highlights.slice(0, 2).join(" · ") : `Nur ${allowed.why}`}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-display text-xl text-licorice tabular-nums leading-none">
                            {formatEuroExact(line?.unitPrice ?? pkg.price)}
                          </p>
                          <p className="font-body text-[10px] text-everglade/45 mt-1">pro Gast</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    set("barPackage", null);
                    setStep(3);
                  }}
                  className="mt-5 font-body text-xs text-everglade/50 hover:text-ct-red underline underline-offset-4 transition-colors"
                >
                  Wir wollen nur ein Erlebnisformat, keine Bar
                </button>
              </div>
            )}

            {/* ══ 3 Ergänzen ══ */}
            {step === 3 && (
              <div className="space-y-8">
                <div>
                  <h2 className="font-display text-3xl md:text-4xl text-licorice mb-2">Noch etwas dazu?</h2>
                  <p className="font-body text-sm text-everglade/60">
                    Alles optional. Der Preis oben aktualisiert sich sofort.
                  </p>
                </div>
                {EXTRA_GROUPS.map((group) => {
                  const items = group.keys.map((k) => byKey.get(k)).filter((p): p is PublicPackage => Boolean(p));
                  if (!items.length) return null;
                  return (
                    <div key={group.label}>
                      <div className="flex items-baseline gap-3 mb-3">
                        <h3 className="font-display text-lg text-licorice">{group.label}</h3>
                        <span className="font-body text-[11px] text-everglade/45">{group.hint}</span>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        {items.map((pkg) => {
                          const allowed = guestsAllowed(pkg, state.guests);
                          const active = state.extras.includes(pkg.key);
                          return (
                            <button
                              key={pkg.key}
                              type="button"
                              disabled={!allowed.ok}
                              onClick={() => toggleExtra(pkg.key)}
                              className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200 ${
                                active
                                  ? "border-ct-red bg-ct-red/[0.04]"
                                  : allowed.ok
                                    ? "border-everglade/12 bg-white hover:border-everglade/30"
                                    : "border-everglade/8 opacity-45 cursor-not-allowed"
                              }`}
                            >
                              <span
                                className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-colors ${
                                  active ? "bg-ct-red border-ct-red" : "border-everglade/25"
                                }`}
                              >
                                {active && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                              </span>
                              <span className="flex-1 min-w-0">
                                <span className="block font-body font-bold text-sm text-licorice mb-0.5">
                                  {pkg.title}
                                </span>
                                <span className="block font-body text-[11px] text-everglade/55 leading-snug">
                                  {allowed.ok
                                    ? `${pkg.pricingLabel === "from" ? "ab " : ""}${formatEuroExact(pkg.price)} ${
                                        pkg.priceType === "person"
                                          ? "pro Gast"
                                          : pkg.priceType === "hour"
                                            ? "pro Stunde"
                                            : "pauschal"
                                      }`
                                    : `Nur ${allowed.why}`}
                                </span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ══ 4 Kontakt ══ */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-3xl md:text-4xl text-licorice mb-2">Wohin schicken wir es?</h2>
                  <p className="font-body text-sm text-everglade/60">
                    Das schriftliche Angebot kommt innerhalb von 24 Stunden.
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    required
                    value={contact.name}
                    onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                    placeholder="Name *"
                    className="bg-white border border-everglade/15 rounded-xl px-4 py-3.5 font-body text-licorice placeholder-everglade/35 focus:outline-none focus:border-ct-red transition-colors"
                  />
                  <input
                    value={contact.company}
                    onChange={(e) => setContact((c) => ({ ...c, company: e.target.value }))}
                    placeholder="Unternehmen"
                    className="bg-white border border-everglade/15 rounded-xl px-4 py-3.5 font-body text-licorice placeholder-everglade/35 focus:outline-none focus:border-ct-red transition-colors"
                  />
                  <input
                    type="email"
                    required
                    value={contact.email}
                    onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                    placeholder="E-Mail *"
                    className="bg-white border border-everglade/15 rounded-xl px-4 py-3.5 font-body text-licorice placeholder-everglade/35 focus:outline-none focus:border-ct-red transition-colors"
                  />
                  <input
                    type="tel"
                    value={contact.phone}
                    onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                    placeholder="Telefon"
                    className="bg-white border border-everglade/15 rounded-xl px-4 py-3.5 font-body text-licorice placeholder-everglade/35 focus:outline-none focus:border-ct-red transition-colors"
                  />
                </div>
                <textarea
                  rows={4}
                  value={contact.message}
                  onChange={(e) => setContact((c) => ({ ...c, message: e.target.value }))}
                  placeholder="Location, besondere Wünsche, Ablauf ..."
                  className="w-full bg-white border border-everglade/15 rounded-xl px-4 py-3.5 font-body text-licorice placeholder-everglade/35 focus:outline-none focus:border-ct-red transition-colors resize-none"
                />
                {submitState === "error" && (
                  <p className="font-body text-sm text-ct-red">
                    Senden fehlgeschlagen. Bitte erneut versuchen oder anrufen: 015255709985.
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Navigation ── */}
        <div className="flex items-center justify-between gap-4 mt-10 pt-8 border-t border-everglade/12">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-2 font-body text-xs font-bold uppercase tracking-wider text-everglade/55 hover:text-everglade disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            Zurück
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canAdvance}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-ct-red text-white font-body font-bold text-sm uppercase tracking-wider hover:bg-ct-red/85 disabled:opacity-35 disabled:cursor-not-allowed transition-all"
            >
              Weiter
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={!canAdvance || submitState === "sending"}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-ct-red text-white font-body font-bold text-sm uppercase tracking-wider hover:bg-ct-red/85 disabled:opacity-35 disabled:cursor-not-allowed transition-all"
            >
              {submitState === "sending" && <Loader2 className="w-4 h-4 animate-spin" />}
              Anfrage senden
            </button>
          )}
        </div>
      </div>

      {/* ══ Live-Zusammenfassung ══ */}
      <div className="lg:sticky lg:top-28">
        <div className="rounded-2xl bg-white ring-1 ring-everglade/10 shadow-xl shadow-everglade/5 overflow-hidden">
          <div className="bg-licorice px-6 py-6">
            <p className="font-body text-[10px] uppercase tracking-[0.25em] text-ct-cream/45 mb-2">
              Richtpreis · netto
            </p>
            {blocked ? (
              <p className="font-display text-2xl text-ct-cream leading-tight">Individuelles Angebot</p>
            ) : (
              <div className={pending ? "opacity-45 transition-opacity" : "transition-opacity"}>
                <p className="font-display text-4xl text-ct-cream tabular-nums leading-none">
                  {quote ? formatEuro(quote.net) : "…"}
                </p>
                <p className="font-body text-sm text-ct-cream/55 mt-2 tabular-nums">
                  {quote && quote.netPerGuest > 0 ? `${formatEuroExact(quote.netPerGuest)} pro Gast` : " "}
                </p>
              </div>
            )}
          </div>

          <div className="px-6 py-5 space-y-4">
            {state.occasion && (
              <div className="flex justify-between font-body text-xs">
                <span className="text-everglade/50">Anlass</span>
                <span className="text-licorice font-bold">{state.occasion}</span>
              </div>
            )}
            <div className="flex justify-between font-body text-xs">
              <span className="text-everglade/50">Gäste · Dauer</span>
              <span className="text-licorice font-bold tabular-nums">
                {state.guests} · {state.hours} Std.
              </span>
            </div>
            {quote && (
              <div className="flex justify-between font-body text-xs">
                <span className="text-everglade/50">Termin</span>
                <span className="text-licorice font-bold">
                  {state.date ? `${quote.weekdayLabel}, ${state.date.split("-").reverse().join(".")}` : "offen"}
                </span>
              </div>
            )}

            {quote && quote.lines.length > 0 && !blocked && (
              <div className="pt-4 border-t border-everglade/10 space-y-2">
                {quote.lines.map((l) => (
                  <div key={l.key} className="flex justify-between gap-3 font-body text-xs">
                    <span className="text-everglade/65 min-w-0">
                      {l.title}
                      {l.auto && <span className="text-everglade/35"> · autom.</span>}
                    </span>
                    <span className="text-licorice tabular-nums flex-shrink-0">{formatEuro(l.total)}</span>
                  </div>
                ))}
                <div className="pt-3 border-t border-everglade/10 flex justify-between font-body text-xs">
                  <span className="text-everglade/50">zzgl. 19 % MwSt.</span>
                  <span className="text-everglade/50 tabular-nums">{formatEuroExact(quote.vat)}</span>
                </div>
                <div className="flex justify-between font-body font-bold text-sm">
                  <span className="text-licorice">Brutto</span>
                  <span className="text-licorice tabular-nums">{formatEuroExact(quote.gross)}</span>
                </div>
              </div>
            )}

            {blocked && (
              <p className="font-body text-xs text-everglade/65 leading-relaxed pt-2">
                Diese Kombination rechnen wir individuell. Schickt die Anfrage ab, wir melden uns
                innerhalb von 24 Stunden.
              </p>
            )}

            {quote && quote.notes.length > 0 && (
              <ul className="pt-3 border-t border-everglade/10 space-y-2">
                {quote.notes.map((n, i) => (
                  <li key={i} className="flex gap-2 font-body text-[11px] text-everglade/60 leading-relaxed">
                    <span className="text-ct-red flex-shrink-0">→</span>
                    {n}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="px-6 pb-6 pt-1">
            <button
              type="button"
              onClick={copyLink}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full border border-everglade/15 font-body text-[11px] font-bold uppercase tracking-wider text-everglade/60 hover:border-everglade/35 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" strokeWidth={2} />
              {copied ? "Link kopiert" : "Konfiguration teilen"}
            </button>
            <p className="font-body text-[10px] text-everglade/40 text-center leading-relaxed mt-3">
              Richtpreis auf Basis eurer Angaben, keine verbindliche Zusage. Anfahrt innerhalb
              Münchens enthalten.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
