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
  { src: "/images/onice/onice-bar-clink.jpg", alt: "Gäste stoßen mit Cocktails an" },
  { src: "/images/onice/onice-bar-keeper.jpg", alt: "Barkeeper mixt einen Drink" },
  { src: "/images/onice/onice-bar-coats.jpg", alt: "Gäste im Mantel bei Kerzenlicht in der Bar" },
  { src: "/images/onice/onice-bar-serve.jpg", alt: "Cocktail wird auf dem Tresen serviert" },
  { src: "/images/onice/onice-bar-pour.jpg", alt: "Drink wird eingeschenkt" },
];

const ROW_B = [
  { src: "/images/onice/onice-bar-qr.jpg", alt: "Drink neben dem QR-Code für die App" },
  { src: "/images/onice/onice-bar-friends.jpg", alt: "Zwei Gäste lachen an der Bar" },
  { src: "/images/onice/onice-bar-clink2.jpg", alt: "Angestoßene Gläser über dem Tresen" },
  { src: "/images/onice/onice-bar-pass.jpg", alt: "Pass in der Hand neben den Drinks" },
  { src: "/images/onice/onice-bar-winter.jpg", alt: "Gäste in Winterjacken mit dem Pass" },
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
