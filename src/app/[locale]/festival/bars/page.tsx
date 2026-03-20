"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import Image from "next/image";
import { bars, districts } from "@/data/bars";

export default function BarsPage() {
  const locale = useLocale() as "de" | "en";
  const [activeFilter, setActiveFilter] = useState<string>("Alle");

  const filteredBars =
    activeFilter === "Alle"
      ? bars
      : bars.filter((bar) => bar.district === activeFilter);

  return (
    <main className="section-padding">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl lg:text-7xl font-display text-bone text-center mb-12"
        >
          BARS
        </motion.h1>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {["Alle", ...districts].map((district) => (
            <button
              key={district}
              onClick={() => setActiveFilter(district)}
              className={`px-4 py-2 rounded-lg font-body text-sm transition-colors duration-200 ${
                activeFilter === district
                  ? "bg-tangerine text-licorice"
                  : "border border-bone/20 text-bone/60 hover:text-bone hover:border-bone/40"
              }`}
            >
              {district}
            </button>
          ))}
        </motion.div>

        {/* Bars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredBars.map((bar) => (
              <motion.div
                key={bar.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35 }}
                className="group rounded-2xl bg-licorice border border-bone/10 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-tangerine/10"
              >
                {/* Image */}
                <div className="relative aspect-video">
                  <Image
                    src={bar.image}
                    alt={bar.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-display text-bone">{bar.name}</h3>
                  <p className="text-sm font-body text-bone/50 mt-1">
                    {bar.address}
                  </p>
                  <p className="text-sm font-body text-tangerine mt-2">
                    {bar.signatureCocktail}
                  </p>
                  <p className="text-sm font-body text-bone/60 mt-3">
                    {bar.description[locale]}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
