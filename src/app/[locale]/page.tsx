import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CheckoutButton from "@/components/onice/CheckoutButton";
import PriceCountdown from "@/components/onice/PriceCountdown";
import FaqAccordion from "@/components/onice/FaqAccordion";
import StickyPass from "@/components/onice/StickyPass";
import PhotoRail from "@/components/onice/PhotoRail";
import {
  CountUp,
  LiftCard,
  Marquee,
  ParallaxImage,
  Reveal,
  ScrollProgress,
  StaggerGroup,
  StaggerItem,
  WordReveal,
} from "@/components/ui/Motion";
import { BAR_SILHOUETTES, CHAPTERS, FAQ, HOW_IT_WORKS, TRAILS, TRAILS_BADGE } from "@/config/onice";
import {
  BUNDLES,
  CHECKOUT,
  DOUBLE_SEASON_LIMIT,
  EVENT,
  SUMMER_PROOF,
  TIERS,
  currentTier,
} from "@/config/pricing";

export const metadata: Metadata = {
  title: "COCKTAIL X ON ICE '26 | 12 Nächte, 40+ Bars, ein Pass",
  description:
    "17. bis 28. November 2026 in München. Zwölf Nächte, über 40 Bars, ein Pass. In jeder Bar ein Signature Drink, freigeschaltet über die App. Pass ab 29 €.",
};

/** Preise sollen sich zum Stichtag ohne Deployment umstellen. */
export const dynamic = "force-dynamic";

export default function OnIcePage({ params }: { params: { locale: string } }) {
  const locale = params.locale;
  const now = Date.now();
  const tier = currentTier(now);
  const price = TIERS[tier].price;

  return (
    <main className="bg-licorice text-bone pb-16 lg:pb-0">
      <ScrollProgress />
      <StickyPass serverNow={now} />
      {/* ══ Hero ══ */}
      <section className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden">
        {/* Warme Gesichter vor der kalten blauen Nachtfront, Drinks in der Hand.
            Das ist das Klima der Marke in einem Bild, und man erkennt sofort
            Menschen statt Produktdetail. Driftet beim Scrollen leicht mit. */}
        <ParallaxImage
          src="/images/onice/onice-talk.jpg"
          alt="Gäste im Gespräch mit Drinks in der Hand, dahinter die nächtliche Stadt"
          objectPosition="object-[center_28%]"
          priority
        />
        {/* Zwei Verläufe: einer für die Lesbarkeit unten, einer für das kalte Klima */}
        <div className="absolute inset-0 bg-gradient-to-t from-licorice via-licorice/70 to-licorice/30" />
        <div className="absolute inset-0 bg-[rgb(var(--c-accent-soft))]/10 mix-blend-overlay" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-5 pb-14 pt-32">
          <Image
            src="/images/onice/logo-onice-white.png"
            alt="Cocktail X"
            width={200}
            height={71}
            priority
            className="w-[140px] md:w-[180px] h-auto mb-8 opacity-95"
          />

          <h1 className="font-display text-[15vw] leading-[0.85] sm:text-7xl md:text-8xl lg:text-[7rem] tracking-[-0.02em] mb-6">
            <span className="block text-bone">
              <WordReveal text="COCKTAIL X" />
            </span>
            <span className="block text-tangerine">
              <WordReveal text="ON ICE" />
            </span>
          </h1>

          <Reveal delay={0.35}>
            <p className="font-display text-2xl md:text-4xl text-bone mb-3 leading-tight">
              {EVENT.nights} Nächte. {EVENT.barsLabel} Bars. Ein Pass.
            </p>
            <p className="font-body text-base md:text-lg text-muted mb-9">
              {EVENT.dateLabel}, {EVENT.city}
            </p>
          </Reveal>

          <Reveal delay={0.5} className="flex flex-col sm:flex-row sm:items-center gap-4">
            <CheckoutButton
              href={CHECKOUT.single}
              label={`Pass sichern, ${price} €`}
              value={price}
              contentName="ON ICE Pass"
              className="btn-primary text-sm md:text-base"
            />
            <PriceCountdown serverNow={now} className="font-body text-sm text-bone/80" />
          </Reveal>
        </div>

        {/* Laufband mit den Anlaessen: gibt dem Hero-Fuss Bewegung, ohne Video */}
        <div className="relative z-10 border-t border-white/10 bg-licorice/40 backdrop-blur-sm py-3">
          <Marquee speed={34}>
            {[...CHAPTERS.map((c) => c.title), ...TRAILS.map((t) => t.title)].map((label, i) => (
              <span
                key={`${label}-${i}`}
                className="flex items-center gap-5 px-5 font-display text-base md:text-lg text-bone/35 whitespace-nowrap uppercase"
              >
                {label}
                <span className="text-tangerine/60 text-xs">✦</span>
              </span>
            ))}
          </Marquee>
        </div>
      </section>

      {/* ══ Sommer-Proof ══ */}
      <section className="border-y border-hairline bg-deep/0">
        <StaggerGroup className="max-w-6xl mx-auto px-5 py-8 md:py-10 grid grid-cols-2 md:grid-cols-4 gap-6 items-start">
          <StaggerItem>
            <p className="font-display text-3xl md:text-4xl text-tangerine leading-none tabular-nums">
              <CountUp value={SUMMER_PROOF.guests} />
            </p>
            <p className="font-body text-[11px] uppercase tracking-wider text-muted mt-2">Gäste im Sommer</p>
          </StaggerItem>
          <StaggerItem>
            <p className="font-display text-3xl md:text-4xl text-tangerine leading-none tabular-nums">
              <CountUp value={SUMMER_PROOF.bars} />
            </p>
            <p className="font-body text-[11px] uppercase tracking-wider text-muted mt-2">Bars im Sommer</p>
          </StaggerItem>
          <StaggerItem className="col-span-2">
            <p className="font-body text-[11px] uppercase tracking-wider text-muted mb-2">Gesehen in</p>
            <p className="font-display text-lg md:text-xl text-bone/70">{SUMMER_PROOF.press.join(" · ")}</p>
          </StaggerItem>
        </StaggerGroup>
      </section>

      {/* ══ So funktioniert's ══ */}
      <section className="max-w-6xl mx-auto px-5 py-20 md:py-28">
        <p className="font-body text-[11px] font-bold uppercase tracking-[0.3em] text-tangerine mb-5">
          So funktioniert&rsquo;s
        </p>
        <h2 className="font-display text-4xl md:text-6xl leading-[0.95] mb-12 max-w-2xl">
          Einmal kaufen. <span className="text-muted">Zwölf Nächte lang nutzen.</span>
        </h2>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          <ol className="lg:col-span-7 grid sm:grid-cols-2 gap-px bg-hairline rounded-2xl overflow-hidden">
            {HOW_IT_WORKS.map((s) => (
              <li key={s.step} className="bg-licorice p-6 md:p-7">
                <span className="font-display text-4xl text-tangerine/25 block mb-5 leading-none">{s.step}</span>
                <h3 className="font-body font-bold text-base text-bone mb-2">{s.title}</h3>
                <p className="font-body text-sm text-muted leading-relaxed">{s.text}</p>
              </li>
            ))}
          </ol>

          {/* Bild traegt hier die Emotion, die vier Schritte tragen die Mechanik. */}
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden ring-1 ring-hairline min-h-[320px] lg:min-h-0">
            <Image
              src="/images/onice/onice-bar-pour.jpg"
              alt="Signature Drink wird am Tresen übergeben"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-[center_45%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-licorice via-licorice/40 to-transparent" />
            <p className="absolute bottom-0 left-0 right-0 p-6 font-display text-2xl md:text-3xl text-bone leading-tight">
              Der Rest passiert von selbst.
            </p>
          </div>
        </div>

        <p className="font-body text-xs text-muted mt-6">
          Die App empfiehlt Routen und zeigt dir, wo Platz ist. Reservieren kann sie nicht.
        </p>
      </section>

      {/* ══ Chapters ══ */}
      <section className="max-w-6xl mx-auto px-5 pb-20 md:pb-28">
        <p className="font-body text-[11px] font-bold uppercase tracking-[0.3em] text-tangerine mb-5">
          Drei Kapitel
        </p>
        <h2 className="font-display text-4xl md:text-6xl leading-[0.95] mb-12 max-w-2xl">
          Zwölf Nächte, <span className="text-muted">die sich unterscheiden.</span>
        </h2>

        <div className="space-y-5">
          {CHAPTERS.map((c, i) => (
            <LiftCard
              key={c.key}
              className={`group grid md:grid-cols-2 rounded-2xl overflow-hidden ring-1 ring-hairline ${
                i % 2 === 1 ? "md:grid-flow-dense" : ""
              }`}
            >
              <div className={`relative h-56 md:h-auto md:min-h-[340px] ${i % 2 === 1 ? "md:col-start-2" : ""}`}>
                <Image
                  src={c.image}
                  alt={c.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={`object-cover ${c.imagePosition} transition-transform duration-[1100ms] ease-out group-hover:scale-[1.06]`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-licorice/70 to-transparent" />
              </div>
              <div className={`p-7 md:p-10 flex flex-col justify-center ${i % 2 === 1 ? "md:col-start-1" : ""}`}>
                <span className="font-body text-[11px] font-bold tracking-[0.3em] text-muted mb-4">
                  {c.index} · {c.dates}
                </span>
                <h3 className="font-display text-3xl md:text-4xl text-bone mb-3 leading-tight">{c.title}</h3>
                <p className="font-display text-lg md:text-xl text-tangerine mb-4">{c.claim}</p>
                <p className="font-body text-sm md:text-base text-muted leading-relaxed">{c.text}</p>
              </div>
            </LiftCard>
          ))}
        </div>
      </section>

      {/* ══ Bildband ══ */}
      <PhotoRail />

      {/* ══ Trails ══ */}
      <section id="trails" className="border-y border-hairline scroll-mt-24">
        <div className="max-w-6xl mx-auto px-5 py-20 md:py-28">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
            <div>
              <p className="font-body text-[11px] font-bold uppercase tracking-[0.3em] text-tangerine mb-5">
                Trails
              </p>
              <h2 className="font-display text-4xl md:text-6xl leading-[0.95] max-w-2xl mb-5">
                Drei Bars, <span className="text-muted">die zusammenpassen.</span>
              </h2>
              <p className="font-body text-base md:text-lg text-muted leading-relaxed max-w-xl">
                Jeder Trail folgt einem Geschmack, nicht einer Adressliste. Du gehst zu Fuß von Bar zu
                Bar und schmeckst über einen Abend, wie unterschiedlich derselbe Gedanke ausfallen kann.
              </p>
            </div>
            <span className="rounded-full border border-hairline px-4 py-2 font-body text-[11px] uppercase tracking-wider text-muted">
              {TRAILS_BADGE}
            </span>
          </div>

          <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TRAILS.map((t) => (
              <StaggerItem
                key={t.key}
                className="group relative rounded-2xl overflow-hidden ring-1 ring-hairline min-h-[290px] flex flex-col justify-end hover:ring-tangerine/40 transition-colors duration-300"
              >
                <Image
                  src={t.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className={`object-cover ${t.imagePosition} transition-transform duration-[1100ms] ease-out group-hover:scale-[1.07]`}
                />
                {/* Kraeftiger Verlauf von unten, damit die Schrift auf jedem Motiv steht */}
                <div className="absolute inset-0 bg-gradient-to-t from-licorice via-licorice/75 to-licorice/15" />
                <div className="relative p-6">
                  <h3 className={`font-display text-xl mb-3 uppercase ${t.accent}`}>{t.title}</h3>
                  <p className="font-body text-sm text-bone/85 leading-relaxed">{t.promise}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* ══ Bildbanner ══
          Bricht die Textstrecke auf und traegt die Haltung: gemeinsam
          losziehen, Stadt erkunden, Leute kennenlernen. */}
      <section className="relative h-[65svh] min-h-[420px] overflow-hidden">
        <ParallaxImage
          src="/images/onice/onice-bar-clink.jpg"
          alt="Gäste stoßen mit ihren Cocktails an"
          objectPosition="object-[center_40%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-licorice via-licorice/50 to-licorice/25" />
        <div className="relative h-full max-w-6xl mx-auto px-5 flex flex-col justify-end pb-14 md:pb-20">
          <Reveal>
            <h2 className="font-display text-4xl md:text-6xl leading-[0.95] text-bone max-w-2xl mb-4">
              Zwölf Nächte, in denen du deine Stadt neu kennenlernst.
            </h2>
            <p className="font-body text-base md:text-lg text-bone/85 leading-relaxed max-w-xl">
              Losziehen mit den Leuten, die du magst, und mit denen, die du an der Bar daneben triffst.
              Jede Bar bringt ihren eigenen Drink, du bringst die Runde mit.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══ Preise ══ */}
      <section id="pass" className="max-w-6xl mx-auto px-5 py-20 md:py-28 scroll-mt-24">
        <p className="font-body text-[11px] font-bold uppercase tracking-[0.3em] text-tangerine mb-5">
          Der Pass
        </p>
        <h2 className="font-display text-4xl md:text-6xl leading-[0.95] mb-12 max-w-2xl">
          Ein Preis. <span className="text-muted">Alle Nächte, alle Bars.</span>
        </h2>

        {/* Early und Full nebeneinander, transparent */}
        <div className="grid sm:grid-cols-2 gap-4 mb-14">
          <div
            className={`rounded-2xl p-7 md:p-8 ring-1 ${
              tier === "early" ? "bg-surface ring-tangerine/50" : "bg-surface/40 ring-hairline"
            }`}
          >
            <div className="flex items-baseline justify-between gap-3 mb-2">
              <span className="font-body text-[11px] uppercase tracking-[0.25em] text-muted">Early</span>
              {tier === "early" && (
                <span className="rounded-full bg-tangerine px-3 py-1 font-body text-[10px] font-bold uppercase tracking-wider text-licorice">
                  Gilt jetzt
                </span>
              )}
            </div>
            <p className="font-display text-5xl text-bone leading-none mb-2 tabular-nums">{TIERS.early.price} €</p>
            <p className="font-body text-sm text-muted">Bis 31. Oktober 2026</p>
          </div>

          <div
            className={`rounded-2xl p-7 md:p-8 ring-1 ${
              tier === "full" ? "bg-surface ring-tangerine/50" : "bg-surface/40 ring-hairline"
            }`}
          >
            <div className="flex items-baseline justify-between gap-3 mb-2">
              <span className="font-body text-[11px] uppercase tracking-[0.25em] text-muted">Full</span>
              {tier === "full" && (
                <span className="rounded-full bg-tangerine px-3 py-1 font-body text-[10px] font-bold uppercase tracking-wider text-licorice">
                  Gilt jetzt
                </span>
              )}
            </div>
            <p
              className={`font-display text-5xl leading-none mb-2 tabular-nums ${
                tier === "full" ? "text-bone" : "text-muted"
              }`}
            >
              {TIERS.full.price} €
            </p>
            <p className="font-body text-sm text-muted">Ab 1. November 2026</p>
          </div>
        </div>

        {/* Bundles */}
        <div className="grid md:grid-cols-3 gap-4">
          {BUNDLES.map((b) => {
            const bundlePrice = b.price[tier];
            const href = b.key === "crew" ? CHECKOUT.crew : CHECKOUT.doubleSeason;
            return (
              <div
                key={b.key}
                className={`rounded-2xl p-7 flex flex-col ring-1 ${
                  b.featured ? "bg-surface ring-tangerine/50 shadow-xl shadow-black/30" : "bg-surface/50 ring-hairline"
                }`}
              >
                {b.featured && (
                  <span className="self-start rounded-full bg-tangerine px-3 py-1 font-body text-[10px] font-bold uppercase tracking-wider text-licorice mb-4">
                    Meistgekauft
                  </span>
                )}
                <h3 className="font-display text-2xl text-bone mb-2">{b.title}</h3>
                <p className="font-body text-sm text-muted leading-relaxed mb-5">{b.promise}</p>

                <ul className="space-y-2 mb-5">
                  {b.includes.map((inc) => (
                    <li key={inc} className="flex gap-2.5 font-body text-sm text-bone/80">
                      <span className="text-tangerine flex-shrink-0">/</span>
                      {inc}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-5 border-t border-hairline">
                  {b.requestOnly ? (
                    <>
                      <p className="font-display text-2xl text-bone mb-1">Auf Anfrage</p>
                      <p className="font-body text-xs text-muted mb-4">Zum jeweils regulären Preis</p>
                      <Link
                        href={`/${locale}/corporate`}
                        className="block w-full text-center rounded-full border border-hairline px-6 py-3 font-body text-xs font-bold uppercase tracking-wider text-bone hover:border-tangerine transition-colors"
                      >
                        Team Nights ansehen
                      </Link>
                    </>
                  ) : (
                    <>
                      <p className="font-display text-3xl text-bone mb-1 tabular-nums">{bundlePrice} €</p>
                      <p className="font-body text-xs text-muted mb-4">
                        {b.key === "doubleSeason"
                          ? `Limitiert auf ${DOUBLE_SEASON_LIMIT} Stück`
                          : `Statt ${TIERS[tier].price * 4} € für vier Pässe`}
                      </p>
                      <CheckoutButton
                        href={href}
                        label="Sichern"
                        value={bundlePrice}
                        contentName={b.title}
                        className={`block w-full text-center rounded-full px-6 py-3 font-body text-xs font-bold uppercase tracking-wider transition-colors ${
                          b.featured
                            ? "bg-tangerine text-licorice hover:bg-tangerine/85"
                            : "border border-hairline text-bone hover:border-tangerine"
                        }`}
                      />
                    </>
                  )}
                  <ul className="mt-4 space-y-1">
                    {b.terms.map((t) => (
                      <li key={t} className="font-body text-[11px] text-muted/80 leading-snug">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══ Bars ══ */}
      <section id="bars" className="border-y border-hairline scroll-mt-24">
        <div className="max-w-6xl mx-auto px-5 py-20 md:py-28">
          <p className="font-body text-[11px] font-bold uppercase tracking-[0.3em] text-tangerine mb-5">Bars</p>
          <h2 className="font-display text-4xl md:text-6xl leading-[0.95] mb-5 max-w-3xl">
            Über 40 Bars. <span className="text-tangerine">Die erste am {EVENT.barsRevealLabel}.</span>
          </h2>
          <p className="font-body text-base md:text-lg text-muted leading-relaxed max-w-xl mb-3">
            Von der großen Hotelbar bis zum Kellerlokal, das nur die Nachbarschaft kennt, verteilt über
            die ganze Stadt. Ab dem {EVENT.barsRevealLabel} geben wir jeden Tag eine neue bekannt, bis
            alle stehen.
          </p>
          <p className="font-body text-base text-bone/70 leading-relaxed max-w-xl mb-12">
            Wer den Pass jetzt sichert, zahlt {TIERS.early.price} € und kann ab dem ersten Tag planen.
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {Array.from({ length: BAR_SILHOUETTES }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-xl bg-surface ring-1 ring-hairline overflow-hidden relative"
                aria-hidden
              >
                {/* Schimmer statt Fragezeichen: wirkt wie etwas, das gleich kommt,
                    nicht wie eine leere Kachel. Versetzt, damit es lebt. */}
                <div
                  className="absolute inset-0 shimmer"
                  style={{ animationDelay: `${(i % 6) * 0.35}s` }}
                />
              </div>
            ))}
          </div>
          <p className="font-body text-sm text-muted mt-5">
            {BAR_SILHOUETTES} von über 40. Der Rest folgt bis zum Festivalstart.
          </p>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section className="max-w-6xl mx-auto px-5 py-20 md:py-28">
        <div className="grid lg:grid-cols-12 gap-y-10 gap-x-14">
          <div className="lg:col-span-4">
            <p className="font-body text-[11px] font-bold uppercase tracking-[0.3em] text-tangerine mb-5">
              Fragen
            </p>
            <h2 className="font-display text-4xl md:text-5xl leading-[0.95] mb-5">
              Alles, <span className="text-muted">was du wissen musst.</span>
            </h2>
            <p className="font-body text-sm text-muted leading-relaxed">
              Steht deine Frage nicht dabei, schreib uns an{" "}
              <a href="mailto:info@cocktail-x.com" className="text-tangerine hover:underline">
                info@cocktail-x.com
              </a>
              .
            </p>
            <div className="relative mt-8 rounded-2xl overflow-hidden ring-1 ring-hairline aspect-[4/5] hidden lg:block">
              <Image
                src="/images/onice/onice-laugh2.jpg"
                alt="Zwei Gäste lachen an der Bar"
                fill
                sizes="33vw"
                className="object-cover object-[center_30%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-licorice/70 to-transparent" />
            </div>
          </div>
          <div className="lg:col-span-8">
            <FaqAccordion items={FAQ} />
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="relative overflow-hidden">
        {/* Eisblock mit eingraviertem Logo. Der Deckel liegt hoch genug fuer die
            Lesbarkeit, aber niedrig genug, dass man die Gravur noch erkennt. */}
        <Image
          src="/images/onice/onice-ice-logo.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[center_40%]"
        />
        <div className="absolute inset-0 bg-licorice/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-licorice via-transparent to-licorice" />
        <div className="relative max-w-3xl mx-auto px-5 py-24 md:py-32 text-center">
          <h2 className="font-display text-4xl md:text-6xl leading-[0.95] mb-5">
            {EVENT.nights} Nächte. <span className="text-tangerine">Ein Pass.</span>
          </h2>
          <p className="font-body text-base text-muted mb-9 max-w-lg mx-auto leading-relaxed">
            {EVENT.dateLabel} in {EVENT.city}. Die App ist dein Ticket, den Rest entscheidest du unterwegs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <CheckoutButton
              href={CHECKOUT.single}
              label={`Pass sichern, ${price} €`}
              value={price}
              contentName="ON ICE Pass"
              className="btn-primary text-sm md:text-base"
            />
            <Link
              href={`/${locale}/corporate`}
              className="font-body text-xs font-bold uppercase tracking-wider text-muted hover:text-bone transition-colors"
            >
              Für Teams
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
