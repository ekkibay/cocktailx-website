"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { sponsors } from "@/data/sponsors";

const mainPartners = sponsors.filter((s) => s.tier === "platinum");
const partners = sponsors.filter((s) => s.tier === "gold" || s.tier === "silver");

export default function SponsorenPage() {
  return (
    <main className="section-padding">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl lg:text-7xl font-display text-bone text-center mb-16"
        >
          SPONSOREN
        </motion.h1>

        {/* Main Partners */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-display text-tangerine text-center mb-10">
            MAIN PARTNERS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-20">
            {mainPartners.map((sponsor, i) => (
              <motion.a
                key={sponsor.id}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex flex-col items-center gap-4 p-8 rounded-2xl bg-licorice border border-bone/10 transition-all duration-300 hover:-translate-y-1 hover:border-tangerine/30"
              >
                <div className="relative w-40 h-40">
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-lg font-display text-bone group-hover:text-tangerine transition-colors">
                  {sponsor.name}
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Partners */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-display text-bone/70 text-center mb-10">
            PARTNERS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {partners.map((sponsor, i) => (
              <motion.a
                key={sponsor.id}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-licorice border border-bone/10 transition-all duration-300 hover:-translate-y-1 hover:border-tangerine/30"
              >
                <div className="relative w-28 h-28">
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-base font-display text-bone group-hover:text-tangerine transition-colors">
                  {sponsor.name}
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
