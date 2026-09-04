import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CheckoutButton from "@/components/onice/CheckoutButton";
import PriceCountdown from "@/components/onice/PriceCountdown";
import PriceTag from "@/components/onice/PriceTag";
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
import { NewsletterForm } from "@/components/onice/NewsletterForm";
import {
  BUNDLES,
  CHECKOUT,
  DOUBLE_SEASON_LIMIT,
  CREW_SIZE,
  EVENT,
  FULL_FROM_LABEL,
  FULL_FROM_LABEL_EN,
  SUMMER_PROOF,
  TIERS,
  currentTier,
} from "@/config/pricing";
import { asLocale, pick, pickAll, type Bilingual } from "@/i18n/bilingual";

/* ── Seitentexte ────────────────────────────────────────────────────────
   Kapitel, Trails, FAQ und Bundles bringen ihre Texte selbst mit. Hier steht
   nur, was ausschliesslich auf dieser Seite vorkommt, nach Abschnitten
   sortiert wie die Seite selbst. Das ist der einzige Ort, an dem eine
   Uebersetzung fehlen kann, und beim Umbauen faellt sofort auf, welcher
   Abschnitt gerade seinen Text verliert.

   Zahlen und Daten kommen auch hier aus den Konstanten. Ein getippter Preis
   oder ein getipptes Datum laeuft sonst genau dann auseinander, wenn es
   niemand mehr nachliest.                                                  */

const COPY = {
  meta: {
    title: {
      de: `${EVENT.name} ${EVENT.edition} | ${EVENT.nights} Nächte, ${EVENT.barsLabel} Bars, ein Pass`,
      en: `${EVENT.name} ${EVENT.edition} | ${EVENT.nights} nights, ${EVENT.barsLabel} bars, one pass`,
    },
    /* Kein Preis in der Beschreibung.

       Vorher stand hier ein Einstiegspreis als fester Text. Er zog nicht aus
       der Preisquelle, wanderte also unveraendert in jedes Suchergebnis und
       jede Link-Vorschau, und er unterschritt die oeffentliche Untergrenze.
       Ein Preis im Meta-Tag ist ausserdem immer veraltet, sobald die Stufe
       umschaltet, weil Suchmaschinen ihn tagelang zwischenspeichern. */
    description: {
      de: `${EVENT.dateLabel} in ${EVENT.city}. ${EVENT.nights} Nächte, ${EVENT.barsLabel} Bars, ein Pass. In jeder Bar ein Signature Drink, freigeschaltet über die App.`,
      en: `${EVENT.dateLabelEn} in ${EVENT.cityEn}. ${EVENT.nights} nights, ${EVENT.barsLabel} bars, one pass. A signature drink in every bar, unlocked through the app.`,
    },
  },

  hero: {
    claim: {
      de: `${EVENT.nights} Nächte. ${EVENT.barsLabel} Bars. Ein Pass.`,
      en: `${EVENT.nights} nights. ${EVENT.barsLabel} bars. One pass.`,
    },
    when: {
      de: `${EVENT.dateLabel}, ${EVENT.city}`,
      en: `${EVENT.dateLabelEn}, ${EVENT.cityEn}`,
    },
  },

  /* Der Einstieg fuer alle, die die Marke nicht kennen. Traegt im Englischen
     dieselbe Last wie im Deutschen, deshalb ganze Saetze und kein Stichwort. */
  intro: {
    eyebrow: { de: "Kurz erklärt", en: "In short" },
    /* Weiches Trennzeichen im Deutschen, damit "Barszene" in der grossen
       Schrift umbrechen darf. Im Englischen steht dort ohnehin ein Leerraum. */
    heading: {
      de: "Zwölf Nächte lang gehört dir die Bar­szene deiner Stadt.",
      en: "For twelve nights the bar scene of your city belongs to you.",
    },
    body: [
      {
        de: "Du kaufst einen Pass, öffnest die App und ziehst los. In jeder teilnehmenden Bar bekommst du einen Signature Drink, den es nur in diesen zwölf Nächten gibt. Danach entscheidest du: noch einen hier, oder weiter zur nächsten.",
        en: "You buy a pass, open the app and set off. In every participating bar you get a signature drink that exists only in these twelve nights. Then it is your call: another one here, or on to the next bar.",
      },
      {
        de: "Kein Programm, das du abarbeiten musst, und keine feste Route. Die App schlägt dir Wege vor, den Abend baust du selbst. Die meisten kommen zu zweit und gehen mit fünf Leuten weiter, die sie an der Bar daneben getroffen haben.",
        en: "No programme to work through and no fixed route. The app suggests ways to go, the evening is yours to build. Most people turn up as a pair and move on as a group of five they met at the bar next to them.",
      },
    ],
  },

  proof: {
    guests: { de: "Gäste im Sommer", en: "Guests last summer" },
    bars: { de: "Bars im Sommer", en: "Bars last summer" },
    press: { de: "Gesehen in", en: "Seen in" },
  },

  how: {
    eyebrow: { de: "So funktioniert’s", en: "How it works" },
    heading: { de: "Einmal kaufen.", en: "Buy once." },
    headingMuted: { de: "Zwölf Nächte lang nutzen.", en: "Use it for twelve nights." },
    caption: { de: "Der Rest passiert von selbst.", en: "The rest takes care of itself." },
    /* Die App empfiehlt, sie reserviert nicht. Der Satz muss in beiden
       Sprachen genauso hart bleiben, sonst wird daraus ein Versprechen. */
    noBooking: {
      de: "Die App empfiehlt Routen. Reservieren kann sie nicht.",
      en: "The app suggests routes. It cannot book you a table.",
    },
  },

  chapters: {
    eyebrow: { de: "Drei Kapitel", en: "Three chapters" },
    heading: { de: "Zwölf Nächte,", en: "Twelve nights," },
    headingMuted: { de: "die sich unterscheiden.", en: "no two the same." },
  },

  trails: {
    eyebrow: { de: "Trails", en: "Trails" },
    heading: { de: "Drei Bars,", en: "Three bars," },
    headingMuted: { de: "die zusammenpassen.", en: "that belong together." },
    body: {
      de: "Jeder Trail folgt einem Geschmack, nicht einer Adressliste. Du gehst zu Fuß von Bar zu Bar und schmeckst über einen Abend, wie unterschiedlich derselbe Gedanke ausfallen kann.",
      en: "Every trail follows a taste, not a list of addresses. You walk from bar to bar and taste over one evening how differently the same idea can turn out.",
    },
  },

  banner: {
    heading: {
      de: "Zwölf Nächte, in denen du deine Stadt neu kennenlernst.",
      en: "Twelve nights to get to know your city again.",
    },
    body: {
      de: "Losziehen mit den Leuten, die du magst, und mit denen, die du an der Bar daneben triffst. Jede Bar bringt ihren eigenen Drink, du bringst die Runde mit.",
      en: "Head out with the people you like, and with the ones you meet at the bar next to you. Every bar brings its own drink, you bring the round.",
    },
  },

  pass: {
    eyebrow: { de: "Der Pass", en: "The pass" },
    heading: { de: "Ein Preis.", en: "One price." },
    headingMuted: { de: "Alle Nächte, alle Bars.", en: "Every night, every bar." },
    cta: { de: "Pass sichern", en: "Get your pass" },
    includes: [
      {
        de: `Alle ${EVENT.nights} Nächte, alle Bars`,
        en: `All ${EVENT.nights} nights, every bar`,
      },
      {
        de: "In jeder Bar ein Signature Drink inklusive",
        en: "A signature drink included in every bar",
      },
      {
        de: "Die App ist dein Ticket, nichts abzuholen",
        en: "The app is your ticket, nothing to collect",
      },
    ],
    /* Nur im Einstiegsfenster sichtbar. Ab dem Stichtag faellt der Hinweis in
       beiden Sprachen weg, sonst stuende der Preis gegen sich selbst. */
    fullFrom: {
      de: `Ab ${FULL_FROM_LABEL} gilt der reguläre Preis von ${TIERS.full.price} €. `,
      en: `From ${FULL_FROM_LABEL_EN} the regular price of ${TIERS.full.price} € applies. `,
    },
    /* Preisangabenverordnung. Steht immer, in beiden Sprachen. */
    vat: { de: "Alle Preise inkl. MwSt.", en: "All prices include VAT." },
  },

  bundles: {
    featured: { de: "Meistgekauft", en: "Most bought" },
    cta: { de: "Sichern", en: "Get it" },
    onRequest: { de: "Auf Anfrage", en: "On request" },
    onRequestNote: { de: "Zum jeweils regulären Preis", en: "At the regular price of the day" },
    onRequestCta: { de: "Team Nights ansehen", en: "See Team Nights" },
    limited: {
      de: `Limitiert auf ${DOUBLE_SEASON_LIMIT} Stück`,
      en: `Limited to ${DOUBLE_SEASON_LIMIT}`,
    },
  },

  bars: {
    eyebrow: { de: "Bars", en: "Bars" },
    /* Oeffentlich nur "40+", keine genaue Zahl und keine Namen, solange die
       Vereinbarungen nicht unterschrieben sind. */
    heading: { de: `${EVENT.barsLabel} Bars.`, en: `${EVENT.barsLabel} bars.` },
    headingAccent: {
      de: `Die erste am ${EVENT.barsRevealLabel}.`,
      en: `The first on ${EVENT.barsRevealLabelEn}.`,
    },
    body: {
      de: `Von der großen Hotelbar bis zum Kellerlokal, das nur die Nachbarschaft kennt, verteilt über die ganze Stadt. Ab dem ${EVENT.barsRevealLabel} geben wir jeden Tag eine neue bekannt, bis alle stehen.`,
      en: `From the grand hotel bar to the basement place only the neighbourhood knows, spread across the whole city. From ${EVENT.barsRevealLabelEn} we announce a new one every day until they are all in.`,
    },
    silhouettes: {
      de: `Die ersten Namen ab ${EVENT.barsRevealLabel}, danach kommt täglich eine dazu.`,
      en: `First names from ${EVENT.barsRevealLabelEn}, then one more every day.`,
    },
  },

  faq: {
    eyebrow: { de: "Fragen", en: "Questions" },
    heading: { de: "Alles,", en: "Everything" },
    headingMuted: { de: "was du wissen musst.", en: "you need to know." },
    contact: {
      de: "Steht deine Frage nicht dabei, schreib uns an",
      en: "If your question is not here, write to us at",
    },
  },

  cta: {
    heading: { de: `${EVENT.nights} Nächte.`, en: `${EVENT.nights} nights.` },
    headingAccent: { de: "Ein Pass.", en: "One pass." },
    body: {
      de: `${EVENT.dateLabel} in ${EVENT.city}. Die App ist dein Pass, den Rest entscheidest du unterwegs.`,
      en: `${EVENT.dateLabelEn} in ${EVENT.cityEn}. The app is your pass, the rest you decide as you go.`,
    },
    teams: { de: "Für Teams", en: "For teams" },
  },

  /* Bildbeschreibungen gehoeren zum Text der Seite, nicht zum Bild: Wer sie
     hoert, hoert die Sprache, in der die Seite gerade steht. */
  alt: {
    heroCrew: {
      de: "Fünf Gäste stoßen mit ihren Cocktails an",
      en: "Five guests raising their cocktails",
    },
    toastTwo: { de: "Zwei Gäste heben ihre Drinks", en: "Two guests raising their drinks" },
    ice: {
      de: "Eis wird in ein Glas mit Zuckerrand gefüllt",
      en: "Ice going into a glass with a sugar rim",
    },
    clink: { de: "Angestoßene Gläser über dem Tresen", en: "Glasses meeting over the bar" },
    smile: { de: "Gast lacht, Drink in der Hand", en: "A guest laughing, drink in hand" },
  },
} as const;

/** Haengt am geltenden Tarif, deshalb Funktion statt Konstante. */
const crewCompare = (comparePrice: number): Bilingual => ({
  de: `Statt ${comparePrice} € für ${CREW_SIZE} Pässe`,
  en: `Instead of ${comparePrice} € for ${CREW_SIZE} passes`,
});

/**
 * Der Hinweis im Bars-Abschnitt zog vorher fest den Early-Bird-Preis, auch
 * nach der Umstellung. Ab dem Stichtag haette dort ein Preis gestanden, den es
 * nicht mehr gibt. Jetzt zieht er den geltenden Tarif mit.
 */
const barsPlanNote = (activePrice: number): Bilingual => ({
  de: `Wer den Pass jetzt sichert, zahlt ${activePrice} € und kann ab dem ersten Tag planen.`,
  en: `Get your pass now, pay ${activePrice} € and you can plan from day one.`,
});

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = asLocale(params.locale);
  return {
    title: pick(COPY.meta.title, locale),
    description: pick(COPY.meta.description, locale),
  };
}

/** Preise sollen sich zum Stichtag ohne Deployment umstellen. */
export const dynamic = "force-dynamic";

export default function OnIcePage({ params }: { params: { locale: string } }) {
  const locale = asLocale(params.locale);
  const now = Date.now();
  const tier = currentTier(now);
  const price = TIERS[tier].price;
  const tierLabel = locale === "en" ? TIERS[tier].labelEn : TIERS[tier].label;

  return (
    <main className="bg-licorice text-bone pb-16 lg:pb-0">
      <ScrollProgress />
      <StickyPass serverNow={now} locale={locale} />
      {/* ══ Hero ══ */}
      <section className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden">
        {/* Menschen im Header, und zwar quer ueber die volle Breite.
            Das Motiv ist ein Band von etwa 1,9 zu 1. In einer halben Spalte
            blieben davon zwei der fuenf Gaeste uebrig, deshalb hier Vollbild.

            Zwei Verlaeufe tragen die Lesbarkeit: einer von unten fuer den
            Textblock, einer von links, damit die Headline nicht auf einem
            Gesicht steht. */}
        <ParallaxImage
          src="/images/onice/set-crew-toast.jpg"
          alt={pick(COPY.alt.heroCrew, locale)}
          objectPosition="object-[center_45%]"
          priority
        />
        {/* Zwei Verlaeufe mit engen Stopps statt zwei flaechigen Schleiern.
            Uebereinandergelegt haben die flaechigen Fassungen das ganze Bild
            grau gezogen, aus der Runde wurde ein Schemen. Jetzt deckt der eine
            nur das untere Drittel, der andere nur die linke Haelfte, und die
            Glaeser in der Mitte bleiben unangetastet. */}
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(var(--c-ground))_0%,rgb(var(--c-ground)/0.55)_20%,transparent_52%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(var(--c-ground))_0%,rgb(var(--c-ground)/0.72)_26%,transparent_56%)]" />
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
              {pick(COPY.hero.claim, locale)}
            </p>
            <p className="font-body text-base md:text-lg text-muted mb-9">
              {pick(COPY.hero.when, locale)}
            </p>
          </Reveal>

          <Reveal delay={0.5} className="flex flex-col sm:flex-row sm:items-center gap-4">
            <CheckoutButton
              href={CHECKOUT.single}
              value={price}
              contentName="ON ICE Pass"
              className="btn-primary text-sm md:text-base whitespace-nowrap"
            >
              <span className="inline-flex items-baseline gap-2">
                {pick(COPY.pass.cta, locale)}
                <PriceTag tier={tier} price={price} locale={locale} variant="inline" />
              </span>
            </CheckoutButton>
            <PriceCountdown serverNow={now} locale={locale} className="font-body text-sm text-bone/80" />
          </Reveal>
        </div>

        {/* Laufband mit den Anlaessen: gibt dem Hero-Fuss Bewegung, ohne Video.
            Kapitel- und Trailnamen sind Markenbegriffe und stehen in beiden
            Sprachen gleich. */}
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

      {/* ══ Was ist das hier ══
          Alles darunter ist strukturiert und konkret: Zahlen, Kacheln,
          Aufzaehlungen. Das liest sich gut, wenn man die Marke kennt, und laesst
          jeden anderen mit der Frage stehen, was das eigentlich ist. Deshalb
          einmal, an einer Stelle, in ganzen Saetzen ausgeschrieben, bevor die
          Seite ins Detail geht. */}
      <section className="border-b border-hairline">
        <div className="max-w-6xl mx-auto px-5 py-16 md:py-24 grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-7">
            <p className="font-body text-[11px] font-bold uppercase tracking-[0.3em] text-tangerine mb-5">
              {pick(COPY.intro.eyebrow, locale)}
            </p>
            <Reveal>
              <h2 className="font-display text-3xl md:text-5xl leading-[1.05] mb-6">
                {pick(COPY.intro.heading, locale)}
              </h2>
              <div className="space-y-4 font-body text-base md:text-lg text-bone/85 leading-relaxed max-w-xl">
                {pickAll([...COPY.intro.body], locale).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Ein Gesicht neben dem Text. Der Absatz erklaert das Miteinander,
              und ein Bild dazu sagt es schneller als der zweite Satz. */}
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden ring-1 ring-hairline aspect-[4/5]">
            <Image
              src="/images/onice/onice-toast-two.jpg"
              alt={pick(COPY.alt.toastTwo, locale)}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-[center_30%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-licorice/60 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* ══ Sommer-Proof ══ */}
      <section className="border-y border-hairline bg-deep/0">
        <StaggerGroup className="max-w-6xl mx-auto px-5 py-8 md:py-10 grid grid-cols-2 md:grid-cols-4 gap-6 items-start">
          <StaggerItem>
            <p className="font-display text-3xl md:text-4xl text-tangerine leading-none tabular-nums">
              <CountUp value={SUMMER_PROOF.guests} />
            </p>
            <p className="font-body text-[11px] uppercase tracking-wider text-muted mt-2">
              {pick(COPY.proof.guests, locale)}
            </p>
          </StaggerItem>
          <StaggerItem>
            <p className="font-display text-3xl md:text-4xl text-tangerine leading-none tabular-nums">
              <CountUp value={SUMMER_PROOF.bars} />
            </p>
            <p className="font-body text-[11px] uppercase tracking-wider text-muted mt-2">
              {pick(COPY.proof.bars, locale)}
            </p>
          </StaggerItem>
          <StaggerItem className="col-span-2">
            <p className="font-body text-[11px] uppercase tracking-wider text-muted mb-2">
              {pick(COPY.proof.press, locale)}
            </p>
            <p className="font-display text-lg md:text-xl text-bone/70">{SUMMER_PROOF.press.join(" · ")}</p>
          </StaggerItem>
        </StaggerGroup>
      </section>

      {/* ══ So funktioniert's ══ */}
      <section className="max-w-6xl mx-auto px-5 py-20 md:py-28">
        <p className="font-body text-[11px] font-bold uppercase tracking-[0.3em] text-tangerine mb-5">
          {pick(COPY.how.eyebrow, locale)}
        </p>
        <h2 className="font-display text-4xl md:text-6xl leading-[0.95] mb-12 max-w-2xl">
          {pick(COPY.how.heading, locale)}{" "}
          <span className="text-muted">{pick(COPY.how.headingMuted, locale)}</span>
        </h2>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          <ol className="lg:col-span-7 grid sm:grid-cols-2 gap-px bg-hairline rounded-2xl overflow-hidden">
            {HOW_IT_WORKS.map((s) => (
              <li key={s.step} className="bg-licorice p-6 md:p-7">
                <span className="font-display text-4xl text-tangerine/25 block mb-5 leading-none">{s.step}</span>
                <h3 className="font-body font-bold text-base text-bone mb-2">{pick(s.title, locale)}</h3>
                <p className="font-body text-sm text-muted leading-relaxed">{pick(s.text, locale)}</p>
              </li>
            ))}
          </ol>

          {/* Bild traegt hier die Emotion, die vier Schritte tragen die Mechanik. */}
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden ring-1 ring-hairline min-h-[320px] lg:min-h-0">
            <Image
              src="/images/onice/set-eis.jpg"
              alt={pick(COPY.alt.ice, locale)}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-[center_55%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-licorice via-licorice/40 to-transparent" />
            <p className="absolute bottom-0 left-0 right-0 p-6 font-display text-2xl md:text-3xl text-bone leading-tight">
              {pick(COPY.how.caption, locale)}
            </p>
          </div>
        </div>

        <p className="font-body text-xs text-muted mt-6">{pick(COPY.how.noBooking, locale)}</p>
      </section>

      {/* ══ Chapters ══ */}
      <section className="max-w-6xl mx-auto px-5 pb-20 md:pb-28">
        <p className="font-body text-[11px] font-bold uppercase tracking-[0.3em] text-tangerine mb-5">
          {pick(COPY.chapters.eyebrow, locale)}
        </p>
        <h2 className="font-display text-4xl md:text-6xl leading-[0.95] mb-12 max-w-2xl">
          {pick(COPY.chapters.heading, locale)}{" "}
          <span className="text-muted">{pick(COPY.chapters.headingMuted, locale)}</span>
        </h2>

        <div className="space-y-5">
          {CHAPTERS.map((c, i) => (
            <LiftCard
              key={c.key}
              /* Bildspalte schmaler als die Textspalte. Alle Motive sind
                 Hochformat, in einer halben Kartenbreite bleibt davon ein
                 flacher Streifen uebrig und die Koepfe werden abgeschnitten.
                 5 zu 7 ergibt eine nahezu quadratische Flaeche.
                 Bei der gespiegelten Karte muessen die Spaltenbreiten mit
                 tauschen, sonst bekommt dort das Bild die breite Spalte und
                 die Karte wird hoeher als ihre Nachbarn. */
              className={`group grid rounded-2xl overflow-hidden ring-1 ring-hairline ${
                i % 2 === 1 ? "md:grid-cols-[7fr_5fr] md:grid-flow-dense" : "md:grid-cols-[5fr_7fr]"
              }`}
            >
              <div className={`relative h-72 md:h-auto md:min-h-[440px] ${i % 2 === 1 ? "md:col-start-2" : ""}`}>
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
                  {c.index} · {pick(c.dates, locale)}
                </span>
                <h3 className="font-display text-3xl md:text-4xl text-bone mb-3 leading-tight">{c.title}</h3>
                <p className="font-display text-lg md:text-xl text-tangerine mb-4">{pick(c.claim, locale)}</p>
                <p className="font-body text-sm md:text-base text-muted leading-relaxed">{pick(c.text, locale)}</p>
              </div>
            </LiftCard>
          ))}
        </div>
      </section>

      {/* ══ Bildband ══ */}
      <PhotoRail locale={locale} />

      {/* ══ Trails ══ */}
      <section id="trails" className="border-y border-hairline scroll-mt-24">
        <div className="max-w-6xl mx-auto px-5 py-20 md:py-28">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
            <div>
              <p className="font-body text-[11px] font-bold uppercase tracking-[0.3em] text-tangerine mb-5">
                {pick(COPY.trails.eyebrow, locale)}
              </p>
              <h2 className="font-display text-4xl md:text-6xl leading-[0.95] max-w-2xl mb-5">
                {pick(COPY.trails.heading, locale)}{" "}
                <span className="text-muted">{pick(COPY.trails.headingMuted, locale)}</span>
              </h2>
              <p className="font-body text-base md:text-lg text-muted leading-relaxed max-w-xl">
                {pick(COPY.trails.body, locale)}
              </p>
            </div>
            <span className="rounded-full border border-hairline px-4 py-2 font-body text-[11px] uppercase tracking-wider text-muted">
              {pick(TRAILS_BADGE, locale)}
            </span>
          </div>

          <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TRAILS.map((t) => (
              <StaggerItem
                key={t.key}
                /* Hochformat wie die Motive selbst. Vorher war die Kachel fast
                   quadratisch, dazu lag der Verlauf ueber der unteren Haelfte:
                   uebrig blieb ein Streifen, auf dem nichts mehr zu erkennen war. */
                className="group relative rounded-2xl overflow-hidden ring-1 ring-hairline aspect-[3/4] flex flex-col justify-end hover:ring-tangerine/40 transition-colors duration-300"
              >
                <Image
                  src={t.image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className={`object-cover ${t.imagePosition} transition-transform duration-[1100ms] ease-out group-hover:scale-[1.07]`}
                />
                {/* Verlauf nur ueber dem unteren Drittel, darueber bleibt das Bild frei */}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-licorice via-licorice/85 to-transparent" />
                <div className="relative p-5">
                  <h3 className={`font-display text-lg mb-2 uppercase ${t.accent}`}>{t.title}</h3>
                  <p className="font-body text-[13px] text-bone/85 leading-relaxed">{pick(t.promise, locale)}</p>
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
          alt={pick(COPY.alt.clink, locale)}
          objectPosition="object-[center_45%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-licorice via-licorice/50 to-licorice/25" />
        {/* Von links abdunkeln: ohne das steht die Headline auf einem Gesicht */}
        <div className="absolute inset-0 bg-gradient-to-r from-licorice via-licorice/40 to-transparent" />
        <div className="relative h-full max-w-6xl mx-auto px-5 flex flex-col justify-end pb-14 md:pb-20">
          <Reveal>
            <h2 className="font-display text-4xl md:text-6xl leading-[0.95] text-bone max-w-2xl mb-4">
              {pick(COPY.banner.heading, locale)}
            </h2>
            <p className="font-body text-base md:text-lg text-bone/85 leading-relaxed max-w-xl">
              {pick(COPY.banner.body, locale)}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══ Preise ══ */}
      <section id="pass" className="max-w-6xl mx-auto px-5 py-20 md:py-28 scroll-mt-24">
        <p className="font-body text-[11px] font-bold uppercase tracking-[0.3em] text-tangerine mb-5">
          {pick(COPY.pass.eyebrow, locale)}
        </p>
        <h2 className="font-display text-4xl md:text-6xl leading-[0.95] mb-12 max-w-2xl">
          {pick(COPY.pass.heading, locale)}{" "}
          <span className="text-muted">{pick(COPY.pass.headingMuted, locale)}</span>
        </h2>

        {/* ON ICE PASS als fuehrende Karte. Vorher standen hier Early und Full
            als zwei gleichrangige Kaesten nebeneinander. Das las sich wie eine
            Tarifuebersicht und nicht wie ein Angebot, und der Rabatt ging
            darin unter, weil beide Zahlen gleich gross waren. */}
        <div className="rounded-2xl bg-surface ring-1 ring-tangerine/50 shadow-xl shadow-black/30 p-7 md:p-10 mb-4">
          <div className="grid lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="font-body text-[11px] font-bold uppercase tracking-[0.25em] text-muted">
                  ON ICE Pass
                </span>
                <span className="rounded-full bg-tangerine px-3 py-1 font-body text-[10px] font-bold uppercase tracking-wider text-licorice">
                  {tierLabel}
                </span>
              </div>

              <PriceTag tier={tier} price={price} locale={locale} variant="block" className="mb-4" />

              <PriceCountdown
                serverNow={now}
                locale={locale}
                variant="badge"
                className="font-body text-sm text-tangerine mb-1"
              />
              {/* Die Mehrwertsteuerangabe stand vorher im else-Zweig und fehlte
                  damit bis zum Stichtag auf der ganzen Seite. Sie gehoert
                  immer hin, das verlangt der Auftrag und die Preisangaben-
                  verordnung. */}
              <p className="font-body text-sm text-muted">
                {tier === "early" && pick(COPY.pass.fullFrom, locale)}
                {pick(COPY.pass.vat, locale)}
              </p>
            </div>

            <ul className="space-y-2.5 lg:min-w-[300px]">
              {pickAll([...COPY.pass.includes], locale).map((item) => (
                <li key={item} className="flex gap-2.5 font-body text-sm text-bone/85">
                  <span className="text-tangerine flex-shrink-0">/</span>
                  {item}
                </li>
              ))}
              <li className="pt-3">
                <CheckoutButton
                  href={CHECKOUT.single}
                  value={price}
                  contentName="ON ICE Pass (Preisblock)"
                  className="block w-full text-center rounded-full bg-tangerine px-6 py-3.5 font-body text-xs font-bold uppercase tracking-wider text-licorice hover:bg-tangerine/85 transition-colors"
                >
                  <span className="inline-flex items-baseline gap-2">
                    {pick(COPY.pass.cta, locale)}
                    <PriceTag tier={tier} price={price} locale={locale} variant="inline" />
                  </span>
                </CheckoutButton>
              </li>
            </ul>
          </div>
        </div>

        {/* Crew Pass und Double Season darunter, Team Nights als Anfrage */}
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
                    {pick(COPY.bundles.featured, locale)}
                  </span>
                )}
                <h3 className="font-display text-2xl text-bone mb-1">{b.title}</h3>
                {b.claim && (
                  <p className="font-display text-base text-tangerine mb-2">{pick(b.claim, locale)}</p>
                )}
                <p className="font-body text-sm text-muted leading-relaxed mb-5">{pick(b.promise, locale)}</p>

                <ul className="space-y-2 mb-5">
                  {pickAll(b.includes, locale).map((inc) => (
                    <li key={inc} className="flex gap-2.5 font-body text-sm text-bone/80">
                      <span className="text-tangerine flex-shrink-0">/</span>
                      {inc}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-5 border-t border-hairline">
                  {b.requestOnly ? (
                    <>
                      <p className="font-display text-2xl text-bone mb-1">
                        {pick(COPY.bundles.onRequest, locale)}
                      </p>
                      <p className="font-body text-xs text-muted mb-4">
                        {pick(COPY.bundles.onRequestNote, locale)}
                      </p>
                      <Link
                        href={`/${locale}/corporate`}
                        className="block w-full text-center rounded-full border border-hairline px-6 py-3 font-body text-xs font-bold uppercase tracking-wider text-bone hover:border-tangerine transition-colors"
                      >
                        {pick(COPY.bundles.onRequestCta, locale)}
                      </Link>
                    </>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-2.5 mb-1">
                        <p className="font-display text-3xl text-bone tabular-nums">{bundlePrice} €</p>
                        {/* Streichpreis nur beim Crew Pass. Double Season hat
                            keinen Vergleichswert, dort waere er erfunden. */}
                        {b.key === "crew" && (
                          <p className="font-display text-lg text-muted/70 line-through tabular-nums" aria-hidden>
                            {TIERS[tier].price * CREW_SIZE} €
                          </p>
                        )}
                      </div>
                      <p className="font-body text-xs text-muted mb-4">
                        {b.key === "doubleSeason"
                          ? pick(COPY.bundles.limited, locale)
                          : pick(crewCompare(TIERS[tier].price * CREW_SIZE), locale)}
                      </p>
                      <CheckoutButton
                        href={href}
                        label={pick(COPY.bundles.cta, locale)}
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
                    {pickAll(b.terms, locale).map((t) => (
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
          <p className="font-body text-[11px] font-bold uppercase tracking-[0.3em] text-tangerine mb-5">
            {pick(COPY.bars.eyebrow, locale)}
          </p>
          <h2 className="font-display text-4xl md:text-6xl leading-[0.95] mb-5 max-w-3xl">
            {pick(COPY.bars.heading, locale)}{" "}
            <span className="text-tangerine">{pick(COPY.bars.headingAccent, locale)}</span>
          </h2>
          <p className="font-body text-base md:text-lg text-muted leading-relaxed max-w-xl mb-3">
            {pick(COPY.bars.body, locale)}
          </p>
          <p className="font-body text-base text-bone/70 leading-relaxed max-w-xl mb-12">
            {pick(barsPlanNote(price), locale)}
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
          <p className="font-body text-sm text-muted mt-5">{pick(COPY.bars.silhouettes, locale)}</p>

          {/* Der Newsletter steht hier und nicht im Fuss: Direkt darueber
              versprechen wir taegliche Ankuendigungen ab dem Stichtag, und
              das ist der einzige Moment auf der Seite, in dem jemand von
              selbst wissen will, wie er das mitbekommt. */}
          <div className="mt-12">
            <NewsletterForm locale={locale} />
          </div>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section className="max-w-6xl mx-auto px-5 py-20 md:py-28">
        <div className="grid lg:grid-cols-12 gap-y-10 gap-x-14">
          <div className="lg:col-span-4">
            <p className="font-body text-[11px] font-bold uppercase tracking-[0.3em] text-tangerine mb-5">
              {pick(COPY.faq.eyebrow, locale)}
            </p>
            <h2 className="font-display text-4xl md:text-5xl leading-[0.95] mb-5">
              {pick(COPY.faq.heading, locale)}{" "}
              <span className="text-muted">{pick(COPY.faq.headingMuted, locale)}</span>
            </h2>
            <p className="font-body text-sm text-muted leading-relaxed">
              {pick(COPY.faq.contact, locale)}{" "}
              <a href="mailto:info@cocktail-x.com" className="text-tangerine hover:underline">
                info@cocktail-x.com
              </a>
              .
            </p>
            <div className="relative mt-8 rounded-2xl overflow-hidden ring-1 ring-hairline aspect-[4/5] hidden lg:block">
              <Image
                src="/images/onice/onice-smile.jpg"
                alt={pick(COPY.alt.smile, locale)}
                fill
                sizes="33vw"
                className="object-cover object-[center_25%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-licorice/70 to-transparent" />
            </div>
          </div>
          <div className="lg:col-span-8">
            <FaqAccordion items={FAQ} locale={locale} />
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
            {pick(COPY.cta.heading, locale)}{" "}
            <span className="text-tangerine">{pick(COPY.cta.headingAccent, locale)}</span>
          </h2>
          <p className="font-body text-base text-muted mb-9 max-w-lg mx-auto leading-relaxed">
            {pick(COPY.cta.body, locale)}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <CheckoutButton
              href={CHECKOUT.single}
              value={price}
              contentName="ON ICE Pass"
              className="btn-primary text-sm md:text-base whitespace-nowrap"
            >
              <span className="inline-flex items-baseline gap-2">
                {pick(COPY.pass.cta, locale)}
                <PriceTag tier={tier} price={price} locale={locale} variant="inline" />
              </span>
            </CheckoutButton>
            <Link
              href={`/${locale}/corporate`}
              className="font-body text-xs font-bold uppercase tracking-wider text-muted hover:text-bone transition-colors"
            >
              {pick(COPY.cta.teams, locale)}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
