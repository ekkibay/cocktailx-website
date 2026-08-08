"use client";

import Image from "next/image";
import { Marquee } from "@/components/ui/Motion";

/**
 * Endlos laufendes Bildband.
 *
 * Loest zwei Dinge auf einmal: Es bringt Bewegung in die Seite und zeigt mehr
 * Motive, als eine statische Galerie unterbringen wuerde, ohne dafuer Hoehe zu
 * kosten. Zwei Reihen laufen gegeneinander, das liest sich lebendiger als eine.
 *
 * Die Bilder sind bewusst schmal ausgegeben (1100 px), weil sie nie groesser
 * als eine Kachel dargestellt werden.
 */

const ROW_A = [
  { src: "/images/onice/onice-talk.jpg", alt: "Gäste im Gespräch, Gläser in der Hand" },
  { src: "/images/onice/onice-toast-two.jpg", alt: "Zwei Gäste heben ihre Drinks" },
  { src: "/images/onice/set-drinks-four.jpg", alt: "Vier verschiedene Drinks auf einem Tisch" },
  { src: "/images/onice/onice-portrait.jpg", alt: "Gast mit Drink in der Hand" },
  { src: "/images/onice/set-stir.jpg", alt: "Barkeeper rührt einen Highball" },
  { src: "/images/onice/onice-bar-pour.jpg", alt: "Drink wird am Tresen übergeben" },
  { src: "/images/onice/onice-two-women.jpg", alt: "Zwei Gäste lachen miteinander" },
];

const ROW_B = [
  { src: "/images/onice/onice-skyline.jpg", alt: "Runde am Geländer, dahinter die Lichter der Stadt" },
  { src: "/images/onice/onice-drink-solo.jpg", alt: "Longdrink mit Eis und frischer Garnitur" },
  { src: "/images/onice/onice-bar-friends.jpg", alt: "Zwei Gäste lachen an der Bar" },
  { src: "/images/onice/onice-ice-logo.jpg", alt: "Eisskulptur mit eingraviertem Cocktail X Logo" },
  { src: "/images/onice/onice-bar-table.jpg", alt: "Gruppe am Tisch in einer dunklen Bar" },
  { src: "/images/onice/onice-bar-clink.jpg", alt: "Angestoßene Gläser über dem Tresen" },
  { src: "/images/onice/onice-group-table.jpg", alt: "Runde am Tresen, Drinks in der Hand" },
];

function Tile({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-[210px] sm:w-[260px] aspect-[3/4] mx-1.5 rounded-xl overflow-hidden ring-1 ring-hairline">
      <Image src={src} alt={alt} fill sizes="260px" className="object-cover" />
    </div>
  );
}

export default function PhotoRail() {
  return (
    <section className="py-6 md:py-10 overflow-hidden" aria-label="Eindrücke aus den Bars">
      <div className="relative">
        <Marquee speed={46}>
          {ROW_A.map((p) => (
            <Tile key={p.src} {...p} />
          ))}
        </Marquee>
        <div className="h-3" />
        {/* Zweite Reihe laeuft langsamer und startet versetzt, dadurch wirken
            die beiden Baender nicht wie eine einzige Flaeche. */}
        <Marquee speed={62} reverse>
          {ROW_B.map((p) => (
            <Tile key={p.src} {...p} />
          ))}
        </Marquee>

        {/* Weiche Kanten, damit die Kacheln nicht hart abgeschnitten wirken */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-licorice to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-licorice to-transparent" />
      </div>
    </section>
  );
}
