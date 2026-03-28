"use client";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import Image from "next/image";

export default function FounderPage() {
  const locale = useLocale() as "de" | "en";

  return (
    <main className="section-padding min-h-screen relative">
      {/* CI background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        <div style={{ position:"absolute", inset:0, backgroundImage:"url(/images/pattern-bg.svg)", backgroundSize:"200px 200px", backgroundRepeat:"repeat", opacity:0.18 }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(25,21,19,0.55) 0%, rgba(25,21,19,0.2) 25%, rgba(25,21,19,0.2) 75%, rgba(25,21,19,0.7) 100%)" }} />
        <div style={{ position:"absolute", top:"-200px", right:"-200px", width:"600px", height:"600px", borderRadius:"50%", background:"rgba(243,146,0,0.12)", filter:"blur(120px)" }} />
        <div style={{ position:"absolute", top:"30%", left:"-200px", width:"500px", height:"500px", borderRadius:"50%", background:"rgba(189,37,110,0.10)", filter:"blur(110px)" }} />
      </div>

      <div className="max-w-3xl mx-auto relative">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-7xl font-display text-bone text-center mb-6"
        >
          {locale === "de" ? "GRÜNDER" : "FOUNDERS"}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-bone/60 font-body text-center text-base md:text-lg leading-relaxed mb-10 max-w-2xl mx-auto"
        >
          {locale === "de"
            ? "Cocktail X entstand aus einer einfachen Überzeugung: Münchens Barkultur verdient eine Bühne. Zwei Männer haben sie gebaut."
            : "Cocktail X was born from a simple belief: Munich's bar culture deserves a stage. Two men built it."}
        </motion.p>

        {/* Founders photo */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative w-full aspect-[3/2] rounded-2xl overflow-hidden mb-16"
        >
          <Image
            src="/images/founders.jpg"
            alt="Ekkehard Bay & Vincent Kerger — Gründer Cocktail X"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-licorice/70 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-6 right-6 flex justify-between items-end">
            <div>
              <p className="text-xs font-body font-bold text-tangerine uppercase tracking-[0.2em]">Ekkehard Bay</p>
              <p className="text-bone/60 font-body text-xs">{locale === "de" ? "Co-Gründer" : "Co-Founder"}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-body font-bold text-tangerine uppercase tracking-[0.2em]">Vincent Kerger</p>
              <p className="text-bone/60 font-body text-xs">{locale === "de" ? "Co-Gründer" : "Co-Founder"}</p>
            </div>
          </div>
        </motion.div>

        {/* Founding Story */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-bone/[0.04] border border-bone/10 rounded-2xl p-8 mb-14"
        >
          <p className="text-[11px] font-body font-bold uppercase tracking-[0.2em] text-tangerine mb-3">
            {locale === "de" ? "Die Geschichte" : "The Story"}
          </p>
          <p className="text-bone/85 font-body text-base md:text-lg leading-relaxed mb-5">
            {locale === "de"
              ? "Während der Pandemie lag Münchens Gastronomie am Boden. Bars geschlossen, Bartender ohne Bühne, eine ganze Kulturszene im Wartezustand. Genau in dieser Zeit entwickelten Ekkehard Bay und Vincent Kerger eine Idee, die größer war als der Moment: ein Festival, das Münchens Barszene sichtbar macht – für alle."
              : "During the pandemic, Munich's gastronomy scene was at a standstill. Bars closed, bartenders without a stage, an entire cultural scene on hold. It was precisely in this moment that Ekkehard Bay and Vincent Kerger developed an idea bigger than the crisis: a festival that puts Munich's bar scene in the spotlight — for everyone."}
          </p>
          <p className="text-bone/85 font-body text-base md:text-lg leading-relaxed mb-5">
            {locale === "de"
              ? "Die Inspiration kam aus London: Die London Cocktail Week zeigt, wie ein dezentrales Festival-Format funktioniert – Gäste besuchen mit einem einzigen Ticket zahlreiche Bars und entdecken die Stadt neu. Bay und Kerger übertrugen dieses Konzept auf München und schufen etwas Eigenes: ein Festival, bei dem jede Bar einen exklusiven Signature Cocktail kreiert – nur für diese 18 Tage."
              : "The inspiration came from London: London Cocktail Week demonstrates how a decentralised festival format works — guests visit numerous bars with a single ticket and rediscover the city. Bay and Kerger adapted this concept for Munich and created something of their own: a festival where every bar creates an exclusive signature cocktail — only for these 18 days."}
          </p>
          <p className="text-bone/85 font-body text-base md:text-lg leading-relaxed">
            {locale === "de"
              ? "Im April 2023 öffnete Cocktail X zum ersten Mal seine Türen – mit 32 teilnehmenden Bars und der klaren Vision, Deutschlands größtes Cocktail-Festival zu werden. Heute, in der 4. Ausgabe, sind 58 Bars dabei und über 5.000 Gäste erwartet."
              : "In April 2023, Cocktail X opened its doors for the first time — with 32 participating bars and a clear vision to become Germany's largest cocktail festival. Today, in its 4th edition, 58 bars participate and over 5,000 guests are expected."}
          </p>
        </motion.div>

        {/* Founders */}
        <div className="space-y-12">

          {/* Ekkehard Bay */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col md:flex-row gap-8 items-start"
          >
            <div className="w-full md:w-1/3 flex-shrink-0">
              <div className="aspect-[3/4] bg-bone/5 border border-bone/10 rounded-2xl overflow-hidden relative">
                <Image
                  src="/images/founders.jpg"
                  alt="Founders"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 250px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-licorice/60 via-transparent to-transparent" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-display text-bone mb-1">Ekkehard Bay</h2>
              <p className="text-tangerine font-body mb-1">
                {locale === "de" ? "Co-Gründer & Geschäftsführer" : "Co-Founder & Managing Director"}
              </p>
              <p className="text-bone/40 font-body text-sm mb-5">bayundco GmbH</p>
              <div className="text-bone/75 font-body text-base leading-relaxed space-y-4">
                <p>
                  {locale === "de"
                    ? "Ekkehard Bay ist preisgekrönter Mixologe, leidenschaftlicher F&B-Manager und einer der prägenden Köpfe der Münchner Barszene. Sein Fokus gilt Barkonzepten, der Entwicklung von Teams und dem Erschaffen unvergesslicher Momente – Werte, die er seit Jahren bei Marriott International und zuletzt in der Ory Bar des Mandarin Oriental München lebt."
                    : "Ekkehard Bay is an award-winning mixologist, passionate F&B manager, and one of the defining figures of Munich's bar scene. His focus lies in bar concepts, team development, and creating unforgettable moments — values he has lived for years at Marriott International and most recently at the Ory Bar of Mandarin Oriental Munich."}
                </p>
                <p>
                  {locale === "de"
                    ? "Mit bayundco GmbH hat er eine Plattform geschaffen, die über 500 Events und 182.905 servierte Drinks umfasst. Cocktail X ist der logische nächste Schritt: Münchens Bartender und ihre Kreativität in den Mittelpunkt zu stellen – nicht nur für eine Nacht, sondern 18 Tage lang, in der ganzen Stadt."
                    : "With bayundco GmbH he has built a platform spanning over 500 events and 182,905 served drinks. Cocktail X is the logical next step: putting Munich's bartenders and their creativity centre stage — not just for one night, but for 18 days across the entire city."}
                </p>
                <blockquote className="border-l-2 border-tangerine pl-4 text-bone/60 italic">
                  {locale === "de"
                    ? "\u201eEs fasziniert mich, Menschen miteinander zu verbinden.\u201c"
                    : "\"It fascinates me to connect people with one another.\""}
                </blockquote>
              </div>
            </div>
          </motion.div>

          {/* Divider */}
          <div className="h-px bg-bone/10" />

          {/* Vincent Kerger */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col md:flex-row gap-8 items-start"
          >
            <div className="w-full md:w-1/3 flex-shrink-0">
              <div className="aspect-[3/4] bg-bone/5 border border-bone/10 rounded-2xl overflow-hidden relative">
                <Image
                  src="/images/founders.jpg"
                  alt="Founders"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 250px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-licorice/60 via-transparent to-transparent" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-display text-bone mb-1">Vincent Kerger</h2>
              <p className="text-tangerine font-body mb-1">
                {locale === "de" ? "Co-Gründer & Geschäftsführer" : "Co-Founder & Managing Director"}
              </p>
              <p className="text-bone/40 font-body text-sm mb-5">bayundco GmbH</p>
              <div className="text-bone/75 font-body text-base leading-relaxed space-y-4">
                <p>
                  {locale === "de"
                    ? "Vincent Kerger ist Gastro-Unternehmer mit einem Master in Steuerrecht. Er bringt das analytische Fundament mit, auf dem Cocktail X gebaut ist: skalierbare Strukturen, digitale Infrastruktur und die strategische Vision, aus einer Pandemie-Idee Deutschlands größtes Cocktail-Festival zu machen."
                    : "Vincent Kerger is a gastronomy entrepreneur with a Master's degree in tax law. He brings the analytical foundation on which Cocktail X is built: scalable structures, digital infrastructure, and the strategic vision to turn a pandemic-era idea into Germany's largest cocktail festival."}
                </p>
                <p>
                  {locale === "de"
                    ? "Wo Ekkehard die Barkultur verkörpert, schafft Vincent die Voraussetzungen, damit sie wachsen kann. Gemeinsam haben sie Cocktail X von 32 Bars und 5 Tagen im Jahr 2023 auf 58 Bars und 18 Tage in 2026 geführt – mit über 5.000 erwarteten Gästen."
                    : "Where Ekkehard embodies bar culture, Vincent creates the conditions for it to grow. Together they have taken Cocktail X from 32 bars and 5 days in 2023 to 58 bars and 18 days in 2026 — with over 5,000 guests expected."}
                </p>
                <blockquote className="border-l-2 border-tangerine pl-4 text-bone/60 italic">
                  {locale === "de"
                    ? "\u201eCocktails stehen f\u00fcr globale Einfl\u00fcsse und Verbindungen \u2013 sie vereinen Traditionen und moderne Techniken aus der ganzen Welt.\u201c"
                    : "\"Cocktails represent global influences and connections \u2014 uniting traditions and modern techniques from around the world.\""}
                </blockquote>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 pt-12 border-t border-bone/10"
        >
          <p className="text-[11px] font-body font-bold uppercase tracking-[0.2em] text-tangerine mb-8 text-center">
            {locale === "de" ? "Von der Idee zum Festival" : "From idea to festival"}
          </p>
          <div className="space-y-6">
            {[
              {
                year: "2022",
                de: "Gründung von bayundco GmbH. Entwicklung des Cocktail X Konzepts während der Pandemie, inspiriert von der London Cocktail Week.",
                en: "bayundco GmbH founded. Development of the Cocktail X concept during the pandemic, inspired by London Cocktail Week.",
              },
              {
                year: "2023",
                de: "Erste Ausgabe: 32 Bars, 5 Tage, 1.400 Gäste. München entdeckt sein Cocktail-Festival.",
                en: "First edition: 32 bars, 5 days, 1,400 guests. Munich discovers its cocktail festival.",
              },
              {
                year: "2024",
                de: "Zweite Ausgabe mit B2B-Erweiterung: das Petit Symposium für die Barszene. 42 Bars, 5 Tage, 1.200 Gäste.",
                en: "Second edition with B2B extension: the Petit Symposium for the bar industry. 42 bars, 5 days, 1,200 guests.",
              },
              {
                year: "2025",
                de: "Dritte Ausgabe: 45 Bars, 12 Tage, 2.500 Gäste. Deutschlands größtes Cocktail-Festival.",
                en: "Third edition: 45 bars, 12 days, 2,500 guests. Germany's largest cocktail festival.",
              },
              {
                year: "2026",
                de: "Vierte Ausgabe: 58 Bars, 18 Tage, 5.000+ erwartete Gäste. 13.–30. Mai, München.",
                en: "Fourth edition: 58 bars, 18 days, 5,000+ expected guests. May 13–30, Munich.",
                highlight: true,
              },
            ].map((item) => (
              <div key={item.year} className="flex gap-6 items-start">
                <span className={`text-sm font-display flex-shrink-0 w-12 ${item.highlight ? "text-tangerine" : "text-bone/40"}`}>
                  {item.year}
                </span>
                <p className={`font-body text-sm leading-relaxed ${item.highlight ? "text-bone/90" : "text-bone/55"}`}>
                  {locale === "de" ? item.de : item.en}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </main>
  );
}
