"use client";

import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useReveal } from "@/hooks/useReveal";

function RevealDiv({
  children, className, delay = 0, direction = "up" as const,
}: { children: React.ReactNode; className?: string; delay?: number; direction?: "up" | "down" | "left" | "right" | "none" }) {
  const { ref, style } = useReveal<HTMLDivElement>({ delay, direction, distance: 30 });
  return <div ref={ref} style={style} className={className}>{children}</div>;
}

function Check() {
  return <svg className="w-4 h-4 text-ct-red flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
}

function SectionCTA({ locale, label }: { locale: "de" | "en"; label?: string }) {
  return (
    <Link
      href={`/${locale}/catering/kontakt`}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ct-red text-white font-body font-bold text-xs uppercase tracking-wider hover:bg-ct-red/85 hover:gap-3 transition-all duration-200 mt-6"
    >
      {label ?? (locale === "de" ? "Jetzt anfragen" : "Get in Touch")}
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
    </Link>
  );
}

const references = [
  "Tesla", "Lucid", "McKinsey & Company", "foodaffairs", "GHM",
  "Siemens", "IAA Mobility", "INHORGENTA",
];

const testimonials = [
  {
    de: { quote: "Das Cocktail X Team hat unseren Produktlaunch auf ein neues Level gehoben. Die Signature Drinks waren perfekt auf unsere Marke abgestimmt.", who: "Marketing Director, Automotive Brand" },
    en: { quote: "The Cocktail X team elevated our product launch to a new level. The signature drinks were perfectly aligned with our brand.", who: "Marketing Director, Automotive Brand" },
  },
  {
    de: { quote: "Professionell, kreativ, zuverlässig. Wir buchen Cocktail X seit 3 Jahren für unsere Messeauftritte und wurden noch nie enttäuscht.", who: "Head of Events, INHORGENTA" },
    en: { quote: "Professional, creative, reliable. We've been booking Cocktail X for our trade fair appearances for 3 years and have never been disappointed.", who: "Head of Events, INHORGENTA" },
  },
];

export default function LeistungenPage() {
  const locale = useLocale() as "de" | "en";

  return (
    <main className="min-h-screen bg-ct-cream">
      {/* ── HERO ── */}
      <section className="relative min-h-[65vh] flex items-center justify-center overflow-hidden">
        <Image src="/images/catering/ct-cocktail-flowers.jpg" alt="Cocktail X Catering Services" fill priority className="object-cover object-[center_40%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/70" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-ct-cream to-transparent" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <RevealDiv delay={100}>
            <p className="text-xs font-body font-bold uppercase tracking-[0.3em] text-ct-red mb-6">
              {locale === "de" ? "Unsere Leistungen" : "Our Services"}
            </p>
            <h1 className="font-display text-5xl md:text-7xl text-white mb-6 leading-[0.95]">
              {locale === "de" ? "Fünf Formate. Ein Versprechen." : "Five Formats. One Promise."}
            </h1>
          </RevealDiv>
          <RevealDiv delay={250}>
            <p className="font-body text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              {locale === "de"
                ? "Von der Masterclass bis zum Großevent — jedes Format individuell, jedes Detail durchdacht."
                : "From masterclass to large-scale event — every format individual, every detail thought through."}
            </p>
          </RevealDiv>
        </div>
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
        </motion.div>
      </section>

      {/* ── WHY US — TRUST BAR ── */}
      <section className="py-10 md:py-14 px-4 bg-licorice">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8">
            {[
              { num: "500+", de: "Events durchgeführt", en: "Events delivered" },
              { num: "200k+", de: "Cocktails serviert", en: "Cocktails served" },
              { num: "48h", de: "Angebot nach Anfrage", en: "Quote after enquiry" },
              { num: "4. Jahr", de: "in Folge", en: "Running" },
            ].map((stat, i) => (
              <RevealDiv key={i} delay={i * 80} className="text-center">
                <span className="font-display text-2xl md:text-3xl text-ct-red block">{stat.num}</span>
                <span className="font-body text-[10px] text-ct-cream/55 uppercase tracking-wider">{locale === "de" ? stat.de : stat.en}</span>
              </RevealDiv>
            ))}
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 pt-6 border-t border-ct-cream/10">
            <span className="text-[10px] font-body font-bold uppercase tracking-[0.2em] text-ct-cream/30">
              {locale === "de" ? "Vertrauen von" : "Trusted by"}
            </span>
            {references.map((name) => (
              <span key={name} className="font-display text-sm text-ct-cream/25 hover:text-ct-cream/40 transition-colors duration-300 cursor-default">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 01 MASTERCLASS ── */}
      <section id="masterclass" className="py-12 md:py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-[1fr,320px] gap-8 items-start">
            <div>
              <RevealDiv>
                <p className="text-xs font-body font-bold uppercase tracking-[0.25em] text-ct-red mb-3">01 — Masterclass</p>
                <h2 className="font-display text-3xl md:text-4xl text-licorice mb-2">
                  {locale === "de" ? "Das Team-Erlebnis, das niemand vergisst." : "The Team Experience No One Forgets."}
                </h2>
                <p className="font-body text-base text-everglade/75 italic mb-5">
                  {locale === "de"
                    ? "Kein Vortrag. Kein Lehrbuch. Einfach ein verdammt guter Nachmittag mit eurem Team."
                    : "No lectures. No textbooks. Just a damn good afternoon with your team."}
                </p>
                <p className="font-body text-sm text-everglade/65 leading-relaxed mb-6">
                  {locale === "de"
                    ? "Unsere Masterclasses sind gemacht für Teams, die gemeinsam etwas Neues erleben wollen — ganz ohne Vorkenntnisse. Spaß, Teamgeist und der Moment, wenn der erste selbst gemixter Cocktail schmeckt. Lachen ist garantiert."
                    : "Our masterclasses are made for teams who want to experience something new together — no prior knowledge required. Fun, team spirit and the moment when your first cocktail actually tastes incredible."}
                </p>
              </RevealDiv>
              <RevealDiv delay={100} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {(locale === "de"
                  ? [{ title: "Shake & Play", text: "Welcome Drink, 2 Cocktails mixen, Team-Challenge." }, { title: "Flavour Battle", text: "Blind Tastings, Speed Mixing, Garnish-Challenge." }, { title: "Around the World", text: "Geschmacksreise durch verschiedene Drink-Kulturen." }]
                  : [{ title: "Shake & Play", text: "Welcome drink, mix 2 cocktails, team challenge." }, { title: "Flavour Battle", text: "Blind tastings, speed mixing, garnish challenge." }, { title: "Around the World", text: "Taste journey through different drink cultures." }]
                ).map((f, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/60 border border-everglade/8">
                    <h4 className="font-display text-sm text-licorice mb-1">{f.title}</h4>
                    <p className="font-body text-xs text-everglade/60 leading-relaxed">{f.text}</p>
                  </div>
                ))}
              </RevealDiv>
              <RevealDiv delay={150}>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(locale === "de"
                    ? ["Barkeeper / Moderator", "Welcome Drink", "Alle Zutaten", "Equipment", "Rezeptkarten", "Alkoholfrei"]
                    : ["Bartender / host", "Welcome drink", "All ingredients", "Equipment", "Recipe cards", "Non-alcoholic"]
                  ).map((item, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-everglade/5 text-[11px] font-body text-everglade/65"><Check /> {item}</span>
                  ))}
                </div>
                <p className="font-body text-xs font-bold text-licorice/70 mb-2">2,5–3,5 Std. · 10–30 Personen · Keine Vorkenntnisse</p>
                <SectionCTA locale={locale} />
              </RevealDiv>
            </div>
            <RevealDiv delay={200} direction="left" className="hidden md:block">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                <Image src="/images/catering/ct-drinks-hand.jpg" alt="Masterclass" fill className="object-cover object-[center_60%]" />
              </div>
            </RevealDiv>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4"><div className="h-px bg-everglade/10" /></div>

      {/* ── 02 TEAM EXPERIENCE ── */}
      <section id="team-experience" className="py-12 md:py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-[320px,1fr] gap-8 items-start">
            <RevealDiv delay={100} direction="right" className="hidden md:block">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                <Image src="/images/catering/ct-bartender-pour.jpg" alt="Team Experience" fill className="object-cover object-[center_30%]" />
              </div>
            </RevealDiv>
            <div>
              <RevealDiv>
                <p className="text-xs font-body font-bold uppercase tracking-[0.25em] text-ct-red mb-3">02 — Team Experience</p>
                <h2 className="font-display text-3xl md:text-4xl text-licorice mb-2">
                  {locale === "de" ? "Shaken, nicht gerührt." : "Shaken, Not Stirred."}
                </h2>
                <p className="font-body text-base text-everglade/75 italic mb-5">
                  {locale === "de" ? "Gemeinsam mixen. Gemeinsam lachen. Gemeinsam anstoßen." : "Mix together. Laugh together. Raise a glass together."}
                </p>
                <p className="font-body text-sm text-everglade/65 leading-relaxed mb-6">
                  {locale === "de"
                    ? "Unter professioneller Anleitung lernen eure Teilnehmer die Grundlagen der Barkultur — vom richtigen Shaken bis zur perfekten Garnitur. Teams treten in einer kreativen Challenge gegeneinander an: Wer kreiert den besten Signature Drink?"
                    : "Guided by a professional bartender, participants learn bar culture fundamentals. Teams compete in a creative challenge: Who can craft the best signature drink?"}
                </p>
                <p className="font-body text-xs font-bold text-licorice/70 mb-2">ca. 3 Stunden · bis 20 Personen</p>
                <SectionCTA locale={locale} />
              </RevealDiv>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4"><div className="h-px bg-everglade/10" /></div>

      {/* ── 03 X YOUR BRAND ── */}
      <section id="your-brand" className="py-12 md:py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-[1fr,320px] gap-8 items-start">
            <div>
              <RevealDiv>
                <p className="text-xs font-body font-bold uppercase tracking-[0.25em] text-ct-red mb-3">03 — Cocktail X x Your Brand</p>
                <h2 className="font-display text-3xl md:text-4xl text-licorice mb-2">
                  {locale === "de" ? "Euer Event. Unsere Bar. Ein gemeinsames Statement." : "Your Event. Our Bar. One Shared Statement."}
                </h2>
                <p className="font-body text-base text-everglade/75 italic mb-5">
                  {locale === "de" ? "Wir bringen nicht einfach Drinks. Wir bringen eure Marke ins Glas." : "We don't just bring drinks. We bring your brand to the glass."}
                </p>
                <p className="font-body text-sm text-everglade/65 leading-relaxed mb-6">
                  {locale === "de"
                    ? "Cocktail X x Your Brand ist mehr als mobiler Barservice. Es ist eine Kollaboration. Wir tauchen in eure Marke ein, entwickeln Drinks, die eure Story erzählen, und schaffen ein Bar-Erlebnis in jedem Detail."
                    : "Cocktail X x Your Brand is more than mobile bar service. It's a collaboration. We develop drinks that tell your story and create a bar experience in every detail."}
                </p>
              </RevealDiv>
              <RevealDiv delay={100} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {(locale === "de"
                  ? [{ title: "x Classic", text: "4 Cocktails, 2 Barkeeper, 3h, Menükarten." }, { title: "x Premium", text: "6 Cocktails, Welcome Drink, 5h, volles Branding." }, { title: "x Deluxe", text: "Plus Drink-Entwicklung, Showelemente, Fotodoku." }]
                  : [{ title: "x Classic", text: "4 cocktails, 2 bartenders, 3h, menu cards." }, { title: "x Premium", text: "6 cocktails, welcome drink, 5h, full branding." }, { title: "x Deluxe", text: "Plus drink development, show elements, photo docs." }]
                ).map((pkg, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/60 border border-everglade/8">
                    <h4 className="font-display text-sm text-licorice mb-1">{pkg.title}</h4>
                    <p className="font-body text-xs text-everglade/60 leading-relaxed">{pkg.text}</p>
                  </div>
                ))}
              </RevealDiv>
              <RevealDiv delay={150}>
                <p className="font-body text-xs text-everglade/50 mb-2">
                  {locale === "de" ? "Ideal für: Produktlaunches, Kunden- & Partnerevents, VIP-Empfänge" : "Ideal for: Product launches, client events, VIP receptions"}
                </p>
                <SectionCTA locale={locale} />
              </RevealDiv>
            </div>
            <RevealDiv delay={200} direction="left" className="hidden md:block">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                <Image src="/images/catering/ct-cocktail-red.jpg" alt="Your Brand" fill className="object-cover" />
              </div>
            </RevealDiv>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL BREAK ── */}
      <section className="py-12 md:py-16 px-4 bg-licorice relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(/images/pattern-bg.svg)", backgroundSize: "150px 150px" }} />
        <div className="max-w-4xl mx-auto relative">
          <RevealDiv className="text-center mb-8">
            <p className="text-[10px] font-body font-bold uppercase tracking-[0.25em] text-ct-cream/30 mb-2">
              {locale === "de" ? "Was unsere Kunden sagen" : "What Our Clients Say"}
            </p>
          </RevealDiv>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => {
              const q = locale === "de" ? t.de : t.en;
              return (
                <RevealDiv key={i} delay={i * 100} className="p-6 rounded-2xl bg-white/[0.04] border border-ct-cream/10">
                  <p className="font-body text-sm text-ct-cream/75 italic leading-relaxed mb-4">"{q.quote}"</p>
                  <p className="font-body text-xs text-ct-red font-bold">{q.who}</p>
                </RevealDiv>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 04 POP-UP FESTIVAL ── */}
      <section id="festival" className="py-12 md:py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-[320px,1fr] gap-8 items-start">
            <RevealDiv delay={100} direction="right" className="hidden md:block">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                <Image src="/images/catering/ct-molecular.jpg" alt="Pop-Up Festival" fill className="object-cover" />
              </div>
            </RevealDiv>
            <div>
              <RevealDiv>
                <p className="text-xs font-body font-bold uppercase tracking-[0.25em] text-ct-red mb-3">04 — Pop-Up Eventreihe</p>
                <h2 className="font-display text-3xl md:text-4xl text-licorice mb-2">
                  {locale === "de" ? "Drinks. Beats. Atmosphäre." : "Drinks. Beats. Atmosphere."}
                </h2>
                <p className="font-body text-base text-everglade/75 italic mb-5">
                  {locale === "de" ? "Kein fester Ort. Kein festes Datum. Aber immer ein Abend, für den sich jede Warteliste lohnt." : "No fixed location. No fixed date. But always a night worth every spot on the waitlist."}
                </p>
                <p className="font-body text-sm text-everglade/65 leading-relaxed mb-6">
                  {locale === "de"
                    ? "Das Cocktail X Festival ist unsere wandernde Bühne für außergewöhnliche Drink-Kultur. Zusammen mit Partnern aus Food, Musik und Lifestyle schaffen wir Abende, die es so kein zweites Mal gibt."
                    : "The Cocktail X Festival is our travelling stage for extraordinary drink culture. Together with partners from food, music and lifestyle, we create nights that can't be replicated."}
                </p>
              </RevealDiv>
              <RevealDiv delay={100} className="grid grid-cols-2 gap-2 mb-6">
                {["Tropical Noir", "Smoke & Oak", "Citrus District", "Spice Route"].map((ed, i) => (
                  <div key={i} className="p-3 rounded-xl bg-licorice text-center">
                    <p className="font-display text-xs text-ct-cream">{ed}</p>
                  </div>
                ))}
              </RevealDiv>
              <RevealDiv delay={150}>
                <p className="font-body text-xs font-bold text-licorice/70 mb-2">4–5 Std. · 80–300 Personen · Quartalsweise</p>
                <SectionCTA locale={locale} label={locale === "de" ? "Partner werden" : "Become a Partner"} />
              </RevealDiv>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4"><div className="h-px bg-everglade/10" /></div>

      {/* ── 05 EVENT CATERING ── */}
      <section id="event-catering" className="py-12 md:py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-[1fr,320px] gap-8 items-start">
            <div>
              <RevealDiv>
                <p className="text-xs font-body font-bold uppercase tracking-[0.25em] text-ct-red mb-3">05 — Event Catering</p>
                <h2 className="font-display text-3xl md:text-4xl text-licorice mb-2">
                  {locale === "de" ? "Für Anlässe, die nach mehr schmecken." : "For Occasions That Deserve More."}
                </h2>
                <p className="font-body text-base text-everglade/75 italic mb-5">
                  {locale === "de" ? "Von 20 bis 3.000 Gäste — wir liefern nicht nur Drinks, wir liefern den richtigen Vibe." : "From 20 to 3,000 guests — we don't just deliver drinks, we deliver the right vibe."}
                </p>
              </RevealDiv>
              <RevealDiv delay={100} className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {(locale === "de"
                  ? [{ t: "Corporate Events", s: "bis 3.000 Pers." }, { t: "Messe-Events", s: "Hoher Durchlauf" }, { t: "Productlaunches", s: "Drink = Produktstory" }, { t: "Store Caterings", s: "Nahtlos im Design" }, { t: "Afterwork", s: "20–150 Pers." }, { t: "Networking", s: "Bar als Brücke" }]
                  : [{ t: "Corporate Events", s: "up to 3,000" }, { t: "Trade Fair Events", s: "High throughput" }, { t: "Product Launches", s: "Drink = product story" }, { t: "Store Caterings", s: "Seamless design" }, { t: "Afterwork", s: "20–150 people" }, { t: "Networking", s: "Bar as bridge" }]
                ).map((sub, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/60 border border-everglade/8">
                    <h4 className="font-display text-xs text-licorice mb-0.5">{sub.t}</h4>
                    <p className="font-body text-[10px] text-everglade/50">{sub.s}</p>
                  </div>
                ))}
              </RevealDiv>
              <RevealDiv delay={150}>
                <SectionCTA locale={locale} />
              </RevealDiv>
            </div>
            <RevealDiv delay={200} direction="left" className="hidden md:block">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                <Image src="/images/catering/ct-bartender-glasses.jpg" alt="Event Catering" fill className="object-cover object-[center_40%]" />
              </div>
            </RevealDiv>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-16 md:py-24 px-4 relative overflow-hidden">
        <Image src="/images/catering/ct-bar-kempinski.jpg" alt="" fill className="object-cover object-[70%_center]" />
        <div className="absolute inset-0 bg-licorice/85" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <RevealDiv>
            <p className="text-xs font-body font-bold uppercase tracking-[0.25em] text-ct-red mb-4">
              {locale === "de" ? "Bereit?" : "Ready?"}
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-ct-cream mb-4">
              {locale === "de" ? "Erzählt uns vom Anlass." : "Tell Us About the Occasion."}
            </h2>
            <p className="font-body text-base text-ct-cream/55 mb-8 max-w-lg mx-auto leading-relaxed">
              {locale === "de"
                ? "Unverbindliches Angebot innerhalb von 48 Stunden. Kostenlose Beratung. Kein Risiko."
                : "Non-binding quote within 48 hours. Free consultation. No risk."}
            </p>
          </RevealDiv>
          <RevealDiv delay={150} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/catering/kontakt`}
              className="inline-block px-10 py-4 rounded-full bg-ct-red text-white font-body font-bold text-sm uppercase tracking-wider hover:bg-ct-red/85 transition-all duration-200 shadow-lg shadow-ct-red/25"
            >
              {locale === "de" ? "Jetzt anfragen" : "Get in Touch"}
            </Link>
          </RevealDiv>
          {/* Trust badges */}
          <RevealDiv delay={250} className="flex flex-wrap justify-center gap-6 mt-8">
            {(locale === "de"
              ? ["Antwort in 48h", "500+ Events", "Kostenlose Beratung", "Flexible Stornierung"]
              : ["Response in 48h", "500+ Events", "Free consultation", "Flexible cancellation"]
            ).map((badge, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 text-[10px] font-body text-ct-cream/40 uppercase tracking-wider">
                <svg className="w-3 h-3 text-ct-red/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {badge}
              </span>
            ))}
          </RevealDiv>
        </div>
      </section>
    </main>
  );
}
