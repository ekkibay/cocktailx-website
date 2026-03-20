"use client";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";

const steps = [
  {
    icon: "📱",
    bg: "bg-tangerine/10",
    border: "border-tangerine/30",
    iconColor: "text-tangerine",
    title: { de: "Passport holen", en: "Get Passport" },
    description: {
      de: "Lade die Cocktail X App herunter und aktiviere deinen digitalen Festival-Pass.",
      en: "Download the Cocktail X app and activate your digital festival passport.",
    },
  },
  {
    icon: "🗺️",
    bg: "bg-hibiscus/10",
    border: "border-hibiscus/30",
    iconColor: "text-hibiscus",
    title: { de: "Bars entdecken", en: "Discover Bars" },
    description: {
      de: "Finde teilnehmende Bars auf der Karte und entdecke exklusive Cocktails.",
      en: "Find participating bars on the map and discover exclusive cocktails.",
    },
  },
  {
    icon: "⭐",
    bg: "bg-bay-of-many/10",
    border: "border-bay-of-many/30",
    iconColor: "text-bay-of-many",
    title: { de: "Stempel sammeln", en: "Collect Stamps" },
    description: {
      de: "Sammle Stempel bei jeder Bar und schalte exklusive Belohnungen frei.",
      en: "Collect stamps at each bar and unlock exclusive rewards.",
    },
  },
];

const features = [
  {
    icon: "📍",
    title: { de: "Interaktive Karte", en: "Interactive Map" },
  },
  {
    icon: "🍸",
    title: { de: "Cocktail-Sammlung", en: "Cocktail Collection" },
  },
  {
    icon: "🔔",
    title: { de: "Event-Benachrichtigungen", en: "Event Notifications" },
  },
  {
    icon: "🎁",
    title: { de: "Belohnungen & Preise", en: "Rewards & Prizes" },
  },
];

export default function AppPage() {
  const locale = useLocale() as "de" | "en";

  return (
    <main>
      {/* Hero with Phone Mockup */}
      <section className="section-padding min-h-[80vh] flex flex-col items-center justify-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-7xl lg:text-8xl font-display text-bone mb-8"
        >
          COCKTAIL X APP
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg md:text-xl font-body text-bone/70 max-w-xl mb-12"
        >
          {locale === "de"
            ? "Dein digitaler Begleiter fuer das Cocktail X Festival."
            : "Your digital companion for the Cocktail X Festival."}
        </motion.p>

        {/* Phone Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative max-w-[300px] w-full aspect-[9/16] bg-bone/5 border-2 border-bone/20 rounded-[2.5rem] flex items-center justify-center overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-licorice rounded-b-xl" />
          <div className="text-center px-6">
            <span className="text-4xl">🍸</span>
            <p className="text-bone/40 font-body mt-4 text-sm">
              {locale === "de" ? "App-Vorschau" : "App Preview"}
            </p>
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-display text-bone text-center mb-16"
          >
            {locale === "de" ? "SO FUNKTIONIERT'S" : "HOW IT WORKS"}
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.title.en}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className={`${step.bg} border ${step.border} rounded-2xl p-10 text-center`}
              >
                <span className="text-5xl">{step.icon}</span>
                <p className="text-bone/40 text-sm font-body mt-6 mb-2">
                  {locale === "de" ? "SCHRITT" : "STEP"} {i + 1}
                </p>
                <h3 className="text-xl font-display text-bone mb-3">
                  {step.title[locale]}
                </h3>
                <p className="text-bone/60 font-body">{step.description[locale]}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-jambalaya/10">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-display text-bone text-center mb-12"
          >
            FEATURES
          </motion.h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title.en}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex items-center gap-4 bg-licorice/50 border border-bone/10 rounded-xl p-5"
              >
                <span className="text-3xl">{feature.icon}</span>
                <span className="text-lg font-display text-bone">
                  {feature.title[locale]}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Download CTAs */}
      <section className="section-padding text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-display text-bone mb-8"
        >
          {locale === "de" ? "JETZT HERUNTERLADEN" : "DOWNLOAD NOW"}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button className="btn-primary text-lg px-8 py-4">
            App Store
          </button>
          <button className="btn-secondary text-lg px-8 py-4">
            Google Play
          </button>
        </motion.div>
      </section>
    </main>
  );
}
