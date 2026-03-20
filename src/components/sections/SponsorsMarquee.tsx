"use client";

import { sponsors } from "@/data/sponsors";
import Image from "next/image";

const doubled = [...sponsors, ...sponsors];

export default function SponsorsMarquee() {
  return (
    <section className="py-16 border-y border-bone/5 overflow-hidden">
      <div className="flex animate-marquee">
        {doubled.map((sponsor, i) => (
          <a
            key={`${sponsor.id}-${i}`}
            href={sponsor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 mx-12 opacity-40 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300"
          >
            <Image
              src={sponsor.logo}
              alt={sponsor.name}
              width={120}
              height={48}
              className="h-12 w-auto object-contain"
            />
          </a>
        ))}
      </div>
    </section>
  );
}
