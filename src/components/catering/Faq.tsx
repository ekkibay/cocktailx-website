"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { MaskReveal, Reveal } from "./Motion";

/**
 * Nimmt die Einwaende vorweg, die sonst im Erstgespraech Zeit kosten.
 * Bewusst konkret: Zahlen und Zusagen statt Marketingsprache.
 */
const faqs = [
  {
    q: "Wie schnell bekommen wir ein Angebot?",
    a: "Über den Konfigurator sofort als Richtpreis. Das schriftliche Angebot mit allen Positionen kommt innerhalb von 24 Stunden.",
  },
  {
    q: "Wie kurzfristig könnt ihr noch übernehmen?",
    a: "Wir haben einen eigenen Personalpool in München und konnten Einsätze schon unter 24 Stunden besetzen. Verlässlich planbar ist es ab etwa zwei Wochen Vorlauf, im Dezember deutlich früher.",
  },
  {
    q: "Braucht die Location einen Wasseranschluss oder Starkstrom?",
    a: "Nein. Unsere Bars arbeiten autark, wir bringen Wasser, Eis und Kühlung selbst mit. Ein normaler Stromanschluss reicht, bei größeren Setups sprechen wir die Absicherung vorher ab.",
  },
  {
    q: "Was passiert, wenn mehr oder weniger Gäste kommen?",
    a: "Die endgültige Gästezahl brauchen wir 72 Stunden vorher. Nach oben können wir in der Regel nachlegen, nach unten rechnen wir bis zu 10 Prozent Abweichung ohne Aufpreis ab.",
  },
  {
    q: "Können die Drinks alkoholfrei sein?",
    a: "Jede Karte hat alkoholfreie Signature Drinks, nicht nur Saft und Limo. Auf Wunsch machen wir die komplette Bar alkoholfrei, der Preis bleibt gleich.",
  },
  {
    q: "Macht ihr auch Hochzeiten und private Feiern?",
    a: "Nein. Wir arbeiten ausschließlich mit Unternehmen. Das hält unser Team auf Firmenevents, Messen und Launches spezialisiert.",
  },
  {
    q: "Was kostet die Anfahrt außerhalb Münchens?",
    a: "Innerhalb Münchens ist die Anfahrt in der Grundpauschale enthalten. Darüber hinaus rechnen wir die tatsächliche Strecke ab und nennen sie im Angebot als eigene Position.",
  },
  {
    q: "Übernehmt ihr auch die Location-Suche?",
    a: "Ja. Wir vermitteln aus einem kuratierten Netzwerk in und um München, passend zu Gästezahl und Anlass, und übernehmen die Abstimmung.",
  },
];

function Item({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-everglade/12">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-start gap-5 py-6 text-left group"
      >
        <span className="font-body text-[11px] font-bold tracking-[0.25em] text-everglade/30 pt-1.5 tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="flex-1 font-display text-lg md:text-xl text-licorice group-hover:text-ct-red transition-colors duration-200">
          {q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="pt-1 flex-shrink-0"
        >
          <Plus className="w-5 h-5 text-ct-red" strokeWidth={1.5} aria-hidden />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="font-body text-sm md:text-base text-everglade/65 leading-relaxed pb-7 pl-12 pr-10 max-w-2xl">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Faq() {
  return (
    <section className="py-20 md:py-28 px-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-y-10 gap-x-14">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <p className="text-xs font-body font-bold uppercase tracking-[0.3em] text-ct-red mb-5">
              Vorab geklärt
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-licorice leading-[0.98] mb-5">
              <MaskReveal>Alles, was ihr</MaskReveal>
              <br />
              <MaskReveal delay={0.08}>vor der Anfrage</MaskReveal>
              <br />
              <MaskReveal delay={0.16} className="text-everglade/40">
                wissen solltet.
              </MaskReveal>
            </h2>
            <Reveal delay={0.25}>
              <p className="font-body text-sm text-everglade/60 leading-relaxed">
                Steht eure Frage nicht dabei, ruft an. 015255709985.
              </p>
            </Reveal>
          </div>
        </div>
        <div className="lg:col-span-8">
          <Reveal>
            <div className="border-t border-everglade/12">
              {faqs.map((f, i) => (
                <Item key={f.q} q={f.q} a={f.a} index={i} />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
