import Link from "next/link";
import {
  CountUp,
  CyclingWord,
  DrawLine,
  GridBackdrop,
  Marquee,
  MaskReveal,
  ParallaxImage,
  Reveal,
  ScrollProgress,
  StaggerGroup,
  StaggerItem,
  WordReveal,
} from "@/components/ui/Motion";
import { Occasions } from "@/components/catering/Occasions";
import { Process } from "@/components/catering/Process";
import { Faq } from "@/components/catering/Faq";
import { ServiceScope } from "@/components/catering/ServiceScope";

/**
 * Landingpage Eventcatering. Ausschließlich B2B.
 *
 * Bewusst NICHT hier: Masterclass, Team Experience und die Pop-Up Eventreihe.
 * Die ersten beiden sind Teamformate und stehen als Pakete auf /catering/pakete,
 * die Eventreihe ist ein eigenes Festivalformat und kein Kundenangebot.
 */

const tickerItems = [
  "Firmenfeier",
  "Sommerfest",
  "Messe",
  "Produktlaunch",
  "Weihnachtsfeier",
  "Jubiläum",
  "Kunden-Dinner",
  "Afterwork",
  "Store-Opening",
];

const usps = [
  { value: 500, suffix: "+", label: "Firmenevents durchgeführt" },
  { value: 200, suffix: "k+", label: "Cocktails serviert" },
  { value: 3000, suffix: "", label: "Gäste pro Event möglich" },
  { value: 60, suffix: " Sek.", label: "bis zum Richtpreis" },
];

const values = [
  {
    title: "Handwerk vor Volumen",
    text: "Jeder Drink wird frisch gemixt. Wir setzen auf frische Zutaten und eigene Rezepturen statt auf Fertigmischungen. Das kostet Vorbereitungszeit und man schmeckt den Unterschied.",
  },
  {
    title: "Technik gegen Wartezeit",
    text: "Unsere Nitro-Ausgabe schafft bis zu 180 Cocktails pro Stunde und Barkeeper. Auf der INHORGENTA waren das 48.000 Drinks in drei Tagen, ohne dass eine Schlange entstanden ist.",
  },
  {
    title: "Ein Ansprechpartner, ein Preis",
    text: "Konzept, Logistik, Personal, Aufbau, Abbau. Ihr bekommt eine Projektleitung, die am Eventtag vor Ort ist, und ein Angebot ohne Sternchen. Was drinsteht, steht auf der Rechnung.",
  },
];

const cases = [
  { client: "INHORGENTA", value: 48000, unit: "Drinks in 3 Tagen" },
  { client: "Automotive OEM", value: 5000, unit: "Gäste an einem Abend" },
  { client: "ISPO", value: 3200, unit: "Drinks am Messestand" },
];

const references = ["Tesla", "Lucid", "McKinsey & Company", "Siemens", "IAA Mobility", "GHM", "foodaffairs"];

export default function CateringPage({ params }: { params: { locale: string } }) {
  const locale = params.locale;

  return (
    <main className="min-h-screen bg-ct-cream">
      <ScrollProgress />

      {/* ══ Hero ══ */}
      <section className="relative min-h-[90vh] flex flex-col justify-end overflow-hidden">
        <ParallaxImage
          src="/images/catering/ct-barkeeper-station.jpg"
          alt="Cocktail X Eventcatering München"
          objectPosition="object-[center_35%]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-licorice/88 via-licorice/65 to-licorice/88" />
        <GridBackdrop className="text-white" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 pb-16 pt-40">
          <Reveal y={10}>
            <p className="text-xs font-body font-bold uppercase tracking-[0.35em] text-ct-red mb-8">
              Eventcatering für Unternehmen · München
            </p>
          </Reveal>
          <h1 className="font-display text-[13.5vw] leading-[0.84] sm:text-7xl md:text-8xl lg:text-[7.5rem] text-white mb-8 tracking-[-0.02em]">
            <WordReveal text="Firmenfeier." />
            <br />
            <span className="text-white/45">
              <WordReveal text="Sommerfest." />
            </span>
            <br />
            <span className="text-ct-red">
              <CyclingWord
                words={["Messe.", "Produktlaunch.", "Weihnachtsfeier.", "Jubiläum.", "Store-Opening."]}
                fallback="Messe."
              />
            </span>
          </h1>

          <Reveal delay={0.45}>
            <p className="font-display text-2xl md:text-4xl text-white mb-5 leading-tight">
              Wir übernehmen alles dahinter.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-12 gap-y-6 gap-x-10 items-end">
            <Reveal delay={0.55} className="md:col-span-7">
              <p className="font-body text-base md:text-lg text-white/70 leading-relaxed max-w-xl">
                Bar, Food, Personal und Eventmanagement aus einer Hand. Von 20 bis 3.000 Gästen in
                München und Umgebung. Ausschließlich für Unternehmen.
              </p>
            </Reveal>
            <Reveal delay={0.66} className="md:col-span-5 flex flex-wrap gap-3 md:justify-end">
              <Link
                href={`/${locale}/catering/anfrage`}
                className="px-8 py-4 rounded-full bg-ct-red text-white font-body font-bold text-sm uppercase tracking-wider hover:bg-ct-red/85 transition-colors shadow-lg shadow-ct-red/25"
              >
                Richtpreis berechnen
              </Link>
              <Link
                href="#anlaesse"
                className="px-8 py-4 rounded-full border border-white/25 text-white font-body font-bold text-sm uppercase tracking-wider hover:border-white/60 hover:bg-white/5 transition-colors"
              >
                Anlässe
              </Link>
            </Reveal>
          </div>
        </div>

        <div className="relative z-10 border-t border-white/10 bg-licorice/40 backdrop-blur-sm py-4">
          <Marquee speed={38}>
            {tickerItems.map((t) => (
              <span
                key={t}
                className="flex items-center gap-6 px-6 font-display text-lg md:text-xl text-white/30 whitespace-nowrap"
              >
                {t}
                <span className="text-ct-red/60 text-sm">✦</span>
              </span>
            ))}
          </Marquee>
        </div>
      </section>

      {/* ══ Kennzahlen ══ */}
      <section className="relative py-10 md:py-12 bg-licorice overflow-hidden">
        <GridBackdrop className="text-ct-cream" />
        <StaggerGroup className="relative max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {usps.map((u) => (
            <StaggerItem key={u.label} className="text-center md:text-left">
              <span className="font-display text-3xl md:text-5xl text-ct-red block tabular-nums leading-none mb-2">
                <CountUp value={u.value} suffix={u.suffix} />
              </span>
              <span className="font-body text-[11px] text-ct-cream/55 uppercase tracking-wider leading-snug block">
                {u.label}
              </span>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* ══ Anlässe ══ */}
      <Occasions locale={locale} />

      {/* ══ Statement ══ */}
      <section className="relative py-24 md:py-36 px-4 bg-everglade overflow-hidden">
        <GridBackdrop className="text-ct-cream" />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="font-display text-3xl md:text-5xl lg:text-[3.5rem] text-ct-cream leading-[1.08]">
            <MaskReveal>Ein gutes Event läuft.</MaskReveal>
            <br />
            <MaskReveal delay={0.12} className="text-tangerine">
              Ein gutes Event bleibt hängen.
            </MaskReveal>
          </p>
          <Reveal delay={0.3}>
            <p className="font-body text-sm md:text-base text-ct-cream/55 mt-8 max-w-lg mx-auto leading-relaxed">
              Der Unterschied liegt selten im Budget. Er liegt darin, ob jemand die zwanzig kleinen
              Dinge vorher durchdacht hat.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══ Leistungsumfang ══ */}
      <ServiceScope />

      {/* ══ Haltung ══ */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <Reveal className="max-w-3xl mb-14">
            <p className="text-xs font-body font-bold uppercase tracking-[0.3em] text-ct-red mb-5">
              Wofür wir stehen
            </p>
            <h2 className="font-display text-4xl md:text-6xl text-licorice leading-[0.98]">
              <MaskReveal>Drei Dinge, bei denen</MaskReveal>
              <br />
              <MaskReveal delay={0.1} className="text-everglade/40">
                wir nicht abkürzen.
              </MaskReveal>
            </h2>
          </Reveal>
          <DrawLine className="mb-12" />
          <StaggerGroup className="grid md:grid-cols-3 gap-x-10 gap-y-12">
            {values.map((v, i) => (
              <StaggerItem key={v.title}>
                <span className="font-display text-5xl text-ct-red/20 block mb-4 leading-none">
                  0{i + 1}
                </span>
                <h3 className="font-display text-2xl text-licorice mb-4">{v.title}</h3>
                <p className="font-body text-sm text-everglade/65 leading-relaxed">{v.text}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* ══ Cases ══ */}
      <section className="pb-8 md:pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <StaggerGroup className="grid sm:grid-cols-3 gap-4">
            {cases.map((c) => (
              <StaggerItem key={c.client}>
                <div className="relative rounded-2xl bg-licorice px-7 py-8 text-ct-cream h-full overflow-hidden">
                  <GridBackdrop className="text-ct-cream" />
                  <div className="relative">
                    <p className="font-display text-4xl md:text-5xl text-tangerine mb-2 tabular-nums leading-none">
                      <CountUp value={c.value} />
                    </p>
                    <p className="font-body text-xs text-ct-cream/65 mb-6">{c.unit}</p>
                    <p className="font-body text-[11px] font-bold uppercase tracking-[0.2em] text-ct-cream/45">
                      {c.client}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* ══ Referenzen ══ */}
      <section className="py-12 md:py-16 border-y border-everglade/10">
        <p className="text-center text-[10px] font-body font-bold uppercase tracking-[0.3em] text-everglade/35 mb-7">
          Unternehmen, die uns buchen
        </p>
        <Marquee speed={44}>
          {references.map((r) => (
            <span
              key={r}
              className="flex items-center gap-10 px-10 font-display text-2xl md:text-3xl text-everglade/25 whitespace-nowrap"
            >
              {r}
            </span>
          ))}
        </Marquee>
      </section>

      {/* ══ Pakete anteasern ══ */}
      <section className="py-20 md:py-28 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-y-8 gap-x-14 items-center">
          <div className="lg:col-span-7">
            <p className="text-xs font-body font-bold uppercase tracking-[0.3em] text-ct-red mb-5">
              Pakete & Preise
            </p>
            <h2 className="font-display text-4xl md:text-6xl text-licorice leading-[0.98] mb-6">
              <MaskReveal>Preise stehen online.</MaskReveal>
              <br />
              <MaskReveal delay={0.1} className="text-everglade/40">
                Alle. Nachlesbar.
              </MaskReveal>
            </h2>
            <Reveal delay={0.2}>
              <p className="font-body text-base text-everglade/65 leading-relaxed max-w-xl mb-8">
                Bar-Pakete ab 36 € pro Gast, inklusive Barteam, Glaswerk und Equipment. Dazu Food,
                Personal und Zusatzleistungen, jede Position einzeln ausgewiesen. Freitag und
                Samstag mit Aufschlag, weil dann alle wollen.
              </p>
            </Reveal>
            <Reveal delay={0.3} className="flex flex-wrap gap-3">
              <Link
                href={`/${locale}/catering/pakete`}
                className="px-8 py-4 rounded-full bg-licorice text-ct-cream font-body font-bold text-sm uppercase tracking-wider hover:bg-licorice/85 transition-colors"
              >
                Alle Pakete ansehen
              </Link>
              <Link
                href={`/${locale}/catering/anfrage`}
                className="px-8 py-4 rounded-full border border-everglade/25 text-everglade font-body font-bold text-sm uppercase tracking-wider hover:border-everglade/50 transition-colors"
              >
                Richtpreis berechnen
              </Link>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-5" delay={0.15}>
            <div className="rounded-2xl bg-white ring-1 ring-everglade/10 p-7 md:p-8">
              <p className="font-body text-[11px] uppercase tracking-[0.2em] text-everglade/45 mb-5">
                Beispiel: 200 Gäste, Mittwoch
              </p>
              <div className="space-y-3 font-body text-sm">
                <div className="flex justify-between">
                  <span className="text-everglade/65">Bar Premium, 4 Drinks pro Gast</span>
                  <span className="text-licorice tabular-nums">8.800 €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-everglade/65">Softdrinks & Wasser Flat</span>
                  <span className="text-licorice tabular-nums">2.200 €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-everglade/65">Anfahrt, Aufbau, Projektleitung</span>
                  <span className="text-licorice tabular-nums">1.620 €</span>
                </div>
                <div className="pt-3 border-t border-everglade/12 flex justify-between font-bold">
                  <span className="text-licorice">Netto</span>
                  <span className="text-licorice tabular-nums">12.620 €</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-everglade/50">pro Gast</span>
                  <span className="text-everglade/50 tabular-nums">63,10 €</span>
                </div>
              </div>
              <p className="font-body text-[11px] text-everglade/40 mt-5 leading-relaxed">
                Richtpreis netto, zzgl. 19 % MwSt. Anfahrt innerhalb Münchens enthalten.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ Ablauf ══ */}
      <Process />

      {/* ══ FAQ ══ */}
      <Faq />

      {/* ══ CTA ══ */}
      <section className="relative py-24 md:py-32 px-4 overflow-hidden">
        <ParallaxImage
          src="/images/catering/ct-tuxedo-drinks.jpg"
          alt=""
          objectPosition="object-[center_35%]"
        />
        <div className="absolute inset-0 bg-licorice/90" />
        <GridBackdrop className="text-ct-cream" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <Reveal>
            <p className="text-xs font-body font-bold uppercase tracking-[0.3em] text-ct-red mb-6">
              Richtpreis in 60 Sekunden
            </p>
          </Reveal>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl text-ct-cream mb-7 leading-[0.95]">
            <MaskReveal>Erzählt uns</MaskReveal>
            <br />
            <MaskReveal delay={0.1} className="text-ct-cream/35">
              vom Anlass.
            </MaskReveal>
          </h2>
          <Reveal delay={0.25}>
            <p className="font-body text-base text-ct-cream/60 mb-10 max-w-xl mx-auto leading-relaxed">
              Anlass, Datum und Gästezahl eingeben. Ihr seht sofort den Gesamtpreis, inklusive der
              Bars und Barkeeper, die dafür nötig sind.
            </p>
          </Reveal>
          <Reveal delay={0.35} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/catering/anfrage`}
              className="px-10 py-4 rounded-full bg-ct-red text-white font-body font-bold text-sm uppercase tracking-wider hover:bg-ct-red/85 transition-colors shadow-lg shadow-ct-red/25"
            >
              Anfrage starten
            </Link>
            <Link
              href={`/${locale}/catering/kontakt`}
              className="px-10 py-4 rounded-full border border-white/25 text-white font-body font-bold text-sm uppercase tracking-wider hover:border-white/55 transition-colors"
            >
              Persönlich sprechen
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
