"use client";

import Image from "next/image";
import { Marquee } from "@/components/ui/Motion";
import { pick, type Bilingual, type Locale } from "@/i18n/bilingual";

/**
 * Endlos laufendes Bildband.
 *
 * Loest zwei Dinge auf einmal: Es bringt Bewegung in die Seite und zeigt mehr
 * Motive, als eine statische Galerie unterbringen wuerde, ohne dafuer Hoehe zu
 * kosten. Zwei Reihen laufen gegeneinander, das liest sich lebendiger als eine.
 *
 * Die Bilder sind bewusst schmal ausgegeben (1100 px), weil sie nie groesser
 * als eine Kachel dargestellt werden.
 *
 * Die Bildbeschreibungen sind zweisprachig. Sie sind kein Beiwerk: Fuer
 * Screenreader sind sie der ganze Inhalt dieses Abschnitts, und deutsche
 * Beschreibungen zwischen englischem Text vorzulesen ist schlechter, als gar
 * nichts zu sagen.
 */

interface Motiv {
  src: string;
  alt: Bilingual;
}

const ROW_A: Motiv[] = [
  {
    src: "/images/onice/onice-talk.jpg",
    alt: { de: "Gäste im Gespräch, Gläser in der Hand", en: "Guests talking, glasses in hand" },
  },
  {
    src: "/images/onice/onice-toast-two.jpg",
    alt: { de: "Zwei Gäste heben ihre Drinks", en: "Two guests raising their drinks" },
  },
  {
    src: "/images/onice/set-drinks-four.jpg",
    alt: { de: "Vier verschiedene Drinks auf einem Tisch", en: "Four different drinks on a table" },
  },
  {
    src: "/images/onice/onice-portrait.jpg",
    alt: { de: "Gast mit Drink in der Hand", en: "A guest holding a drink" },
  },
  {
    src: "/images/onice/onice-drinks-row.jpg",
    alt: {
      de: "Reihe frisch gebauter Drinks im Gegenlicht",
      en: "A row of freshly built drinks, backlit",
    },
  },
  {
    src: "/images/onice/set-eis.jpg",
    alt: { de: "Eis wird ins Glas gefüllt", en: "Ice going into the glass" },
  },
  {
    src: "/images/onice/onice-skyline.jpg",
    alt: {
      de: "Runde am Geländer, dahinter die Lichter der Stadt",
      en: "A group at the railing, city lights behind them",
    },
  },
];

const ROW_B: Motiv[] = [
  {
    src: "/images/onice/set-coupe.jpg",
    alt: { de: "Coupe mit Schaumkrone auf Marmor", en: "A coupe with a foam crown on marble" },
  },
  {
    src: "/images/onice/onice-bar-pour.jpg",
    alt: { de: "Drink wird am Tresen übergeben", en: "A drink handed over at the bar" },
  },
  {
    src: "/images/onice/onice-drink-solo.jpg",
    alt: {
      de: "Longdrink mit Eis und frischer Garnitur",
      en: "A tall drink with ice and fresh garnish",
    },
  },
  {
    src: "/images/onice/onice-bar-friends.jpg",
    alt: { de: "Zwei Gäste lachen an der Bar", en: "Two guests laughing at the bar" },
  },
  {
    src: "/images/onice/onice-ice-logo.jpg",
    alt: {
      de: "Eisskulptur mit eingraviertem Cocktail X Logo",
      en: "An ice sculpture engraved with the Cocktail X logo",
    },
  },
  {
    src: "/images/onice/onice-bar-table.jpg",
    alt: { de: "Gruppe am Tisch in einer dunklen Bar", en: "A group at a table in a dark bar" },
  },
  {
    src: "/images/onice/onice-bar-clink.jpg",
    alt: { de: "Angestoßene Gläser über dem Tresen", en: "Glasses meeting over the bar" },
  },
  {
    src: "/images/onice/onice-group-table.jpg",
    alt: { de: "Runde am Tresen, Drinks in der Hand", en: "A group at the bar, drinks in hand" },
  },
  {
    src: "/images/onice/onice-two-women.jpg",
    alt: { de: "Zwei Gäste lachen miteinander", en: "Two guests laughing together" },
  },
];

const SECTION_LABEL: Bilingual = {
  de: "Eindrücke aus den Bars",
  en: "Impressions from the bars",
};

function Tile({ src, alt, locale }: Motiv & { locale: Locale }) {
  return (
    <div className="relative w-[210px] sm:w-[260px] aspect-[3/4] mx-1.5 rounded-xl overflow-hidden ring-1 ring-hairline">
      <Image src={src} alt={pick(alt, locale)} fill sizes="260px" className="object-cover" />
    </div>
  );
}

export default function PhotoRail({ locale }: { locale: Locale }) {
  return (
    <section className="py-6 md:py-10 overflow-hidden" aria-label={pick(SECTION_LABEL, locale)}>
      <div className="relative">
        <Marquee speed={46}>
          {ROW_A.map((p) => (
            <Tile key={p.src} {...p} locale={locale} />
          ))}
        </Marquee>
        <div className="h-3" />
        {/* Zweite Reihe laeuft langsamer und startet versetzt, dadurch wirken
            die beiden Baender nicht wie eine einzige Flaeche. */}
        <Marquee speed={62} reverse>
          {ROW_B.map((p) => (
            <Tile key={p.src} {...p} locale={locale} />
          ))}
        </Marquee>

        {/* Weiche Kanten, damit die Kacheln nicht hart abgeschnitten wirken */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-licorice to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-licorice to-transparent" />
      </div>
    </section>
  );
}
