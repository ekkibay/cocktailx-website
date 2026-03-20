"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";

const subpages = [
  {
    href: "/festival/bars",
    title: { de: "Bars", en: "Bars" },
    image: "/images/placeholder/bar-1.svg",
  },
  {
    href: "/festival/produkte",
    title: { de: "Produkte", en: "Products" },
    image: "/images/placeholder/cocktail-1.svg",
  },
  {
    href: "/festival/sponsoren",
    title: { de: "Sponsoren", en: "Sponsors" },
    image: "/images/placeholder/sponsor-1.svg",
  },
  {
    href: "/festival/events",
    title: { de: "Events", en: "Events" },
    image: "/images/placeholder/event-1.svg",
  },
  {
    href: "/festival/history",
    title: { de: "History", en: "History" },
    image: "/images/placeholder/hero-bg.svg",
  },
  {
    href: "/festival/about",
    title: { de: "About Us", en: "About Us" },
    image: "/images/placeholder/about.svg",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

export default function FestivalOverviewPage() {
  const locale = useLocale() as "de" | "en";

  return (
    <main>
      {/* Hero Banner */}
      <section className="relative bg-jambalaya/30 section-padding flex flex-col items-center justify-center text-center min-h-[60vh]">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-7xl lg:text-8xl font-display text-bone"
        >
          COCKTAIL &#10022; FESTIVAL
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg md:text-xl font-body text-bone/70 mt-6 max-w-xl"
        >
          {locale === "de"
            ? "Erlebe Münchens größtes Cocktail-Festival. 18 Tage, 50+ Bars, unvergessliche Drinks."
            : "Experience Munich's biggest cocktail festival. 18 days, 50+ bars, unforgettable drinks."}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-8"
        >
          <Link href={`/${locale}/festival/bars`} className="btn-primary text-lg">
            {locale === "de" ? "TEILNEHMEN" : "PARTICIPATE"}
          </Link>
        </motion.div>
      </section>

      {/* Subpage Cards Grid */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subpages.map((page, i) => (
            <motion.div
              key={page.href}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
            >
              <Link
                href={`/${locale}${page.href}`}
                className="group block rounded-2xl bg-licorice border border-bone/10 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-tangerine/10"
              >
                <div className="relative aspect-video">
                  <Image
                    src={page.image}
                    alt={page.title[locale]}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-licorice/80 to-transparent" />
                  <h3 className="absolute bottom-4 left-4 text-2xl font-display text-bone">
                    {page.title[locale]}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
