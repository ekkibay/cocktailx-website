"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useLocale } from "next-intl";

export default function CateringPage() {
  const locale = useLocale() as "de" | "en";

  return (
    <main>
      {/* Hero */}
      <section className="section-padding min-h-[50vh] flex flex-col items-center justify-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-7xl font-display text-bone mb-8"
        >
          COCKTAIL X CATERING
        </motion.h1>
      </section>

      {/* Content */}
      <section className="section-padding pt-0">
        <div className="max-w-3xl mx-auto">
          {/* Placeholder Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="aspect-video bg-bone/5 border border-bone/10 rounded-2xl flex items-center justify-center mb-12"
          >
            <span className="text-6xl opacity-30">🍸</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-bone/80 font-body text-lg leading-relaxed space-y-6"
          >
            <p>
              {locale === "de"
                ? "Cocktail X Catering bringt die Magie des Festivals direkt zu Ihrem Event. Unser Team aus erfahrenen Mixologen kreiert massgeschneiderte Cocktail-Erlebnisse fuer private Feiern, Firmenveranstaltungen und besondere Anlaesse jeder Groesse."
                : "Cocktail X Catering brings the magic of the festival directly to your event. Our team of experienced mixologists creates bespoke cocktail experiences for private celebrations, corporate events, and special occasions of any size."}
            </p>
            <p>
              {locale === "de"
                ? "Von intimen Dinner-Partys bis hin zu grossen Firmenevents -- wir bieten ein umfassendes Catering-Erlebnis, das Ihre Gaeste begeistern wird. Unsere mobilen Bars sind mit allem ausgestattet, was man fuer erstklassige Cocktails benoetigt."
                : "From intimate dinner parties to large corporate events -- we offer a comprehensive catering experience that will delight your guests. Our mobile bars are equipped with everything needed for first-class cocktails."}
            </p>
            <p>
              {locale === "de"
                ? "Jedes Catering-Paket wird individuell auf Ihre Wuensche abgestimmt. Wir arbeiten eng mit Ihnen zusammen, um ein Cocktailmenue zu entwickeln, das perfekt zu Ihrem Anlass passt -- von klassischen Cocktails bis hin zu kreativen Eigenkreationen."
                : "Each catering package is individually tailored to your wishes. We work closely with you to develop a cocktail menu that perfectly suits your occasion -- from classic cocktails to creative original creations."}
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 text-center"
          >
            <Link href={`/${locale}/about/contact`} className="btn-primary text-lg">
              {locale === "de" ? "KONTAKTIEREN SIE UNS" : "CONTACT US"}
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
