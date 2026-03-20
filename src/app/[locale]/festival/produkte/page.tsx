"use client";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import Image from "next/image";
import { cocktails } from "@/data/cocktails";

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.15 },
  }),
};

export default function ProduktePage() {
  const locale = useLocale() as "de" | "en";

  return (
    <main className="section-padding">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl lg:text-7xl font-display text-bone text-center mb-16"
        >
          SIGNATURE COCKTAILS
        </motion.h1>

        {/* Cocktails Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cocktails.map((cocktail, i) => (
            <motion.div
              key={cocktail.id}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              className="rounded-2xl overflow-hidden bg-licorice border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              style={{ borderColor: cocktail.accentColor }}
            >
              {/* Image */}
              <div className="relative aspect-[3/4]">
                <Image
                  src={cocktail.image}
                  alt={cocktail.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-display text-bone">
                  {cocktail.name}
                </h3>
                <p
                  className="text-sm font-body mt-1"
                  style={{ color: cocktail.accentColor }}
                >
                  {cocktail.bar}
                </p>
                <p className="text-sm font-body text-bone/60 mt-3">
                  {cocktail.description[locale]}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
