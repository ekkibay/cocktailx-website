import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, EVENT, SUMMER_PROOF, TIERS } from "@/config/pricing";

export const metadata: Metadata = {
  title: "Presse | COCKTAIL X ON ICE '26",
  description:
    "Pressekontakt und Eckdaten zu COCKTAIL X ON ICE, 17. bis 28. November 2026 in München. Pressemappe auf Anfrage.",
};

const FACTS: { label: string; value: string }[] = [
  { label: "Titel", value: "COCKTAIL X ON ICE '26" },
  { label: "Zeitraum", value: `${EVENT.dateLabel}, ${EVENT.nights} Nächte` },
  { label: "Ort", value: `${EVENT.city}, Bars über das Stadtgebiet verteilt` },
  { label: "Teilnehmende Bars", value: `${EVENT.barsLabel}, Bekanntgabe ab ${EVENT.barsRevealLabel}` },
  { label: "Zugang", value: "Ein Pass für alle Nächte, eingelöst über die Cocktail X App" },
  { label: "Preis", value: `${TIERS.early.price} € Early bis 31. Oktober, danach ${TIERS.full.price} €` },
  {
    label: "Vorgängerausgabe",
    value: `${SUMMER_PROOF.guests.toLocaleString("de-DE")} Gäste, ${SUMMER_PROOF.bars} Bars`,
  },
  { label: "Veranstalter", value: "Bay und Co. GmbH, München" },
];

export default function PressePage({ params }: { params: { locale: string } }) {
  const locale = params.locale;

  return (
    <main className="bg-licorice text-bone">
      <section className="max-w-6xl mx-auto px-5 pt-32 md:pt-40 pb-16">
        <p className="font-body text-[11px] font-bold uppercase tracking-[0.3em] text-tangerine mb-6">Presse</p>
        <h1 className="font-display text-5xl md:text-7xl leading-[0.9] mb-6 max-w-3xl">
          Zahlen, Bilder, <span className="text-muted">Ansprechpartner.</span>
        </h1>
        <p className="font-body text-base md:text-lg text-muted leading-relaxed max-w-xl">
          Für Anfragen, Interviews und Akkreditierungen schreib uns direkt. Wir antworten am selben
          Werktag und schicken dir Bildmaterial in Druckauflösung.
        </p>
      </section>

      {/* ══ Eckdaten ══ */}
      <section className="border-y border-hairline">
        <div className="max-w-6xl mx-auto px-5 py-16 md:py-20">
          <h2 className="font-display text-3xl md:text-4xl mb-10">Eckdaten</h2>
          <dl className="grid sm:grid-cols-2 gap-px bg-hairline rounded-2xl overflow-hidden">
            {FACTS.map((f) => (
              <div key={f.label} className="bg-licorice p-6">
                <dt className="font-body text-[11px] uppercase tracking-wider text-muted mb-2">{f.label}</dt>
                <dd className="font-body text-sm text-bone leading-relaxed">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ══ Pressemappe ══ */}
      <section className="max-w-6xl mx-auto px-5 py-16 md:py-20">
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl mb-4">Pressemappe</h2>
            <p className="font-body text-sm text-muted leading-relaxed mb-6 max-w-lg">
              Die Mappe mit Bildmaterial, Logos und Hintergrundtexten wird derzeit zusammengestellt
              und steht ab dem Bar-Reveal am {EVENT.barsRevealLabel} zum Download bereit. Bis dahin
              schicken wir dir alles auf Anfrage direkt zu.
            </p>
            <div className="rounded-2xl bg-surface ring-1 ring-hairline p-6">
              <p className="font-body text-[11px] uppercase tracking-wider text-muted mb-3">
                Bis zum Download verfügbar
              </p>
              <ul className="space-y-2">
                {[
                  "Pressetext, kurz und lang",
                  "Logos in Weiß und Schwarz, Vektor und PNG",
                  "Bildauswahl aus der Vorgängerausgabe, honorarfrei mit Nennung",
                  "Zitate der Gründer auf Anfrage",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5 font-body text-sm text-bone/80">
                    <span className="text-tangerine flex-shrink-0">/</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h2 className="font-display text-3xl md:text-4xl mb-4">Kontakt</h2>
            <p className="font-body text-sm text-muted leading-relaxed mb-6 max-w-lg">
              Schreib direkt an die Redaktionsadresse, dann landet die Anfrage ohne Umweg bei der
              richtigen Person.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Presseanfrage ON ICE '26")}`}
              className="btn-primary text-sm"
            >
              Presseanfrage schreiben
            </a>
            <p className="font-body text-sm text-muted mt-6">
              {CONTACT_EMAIL}
              <br />
              Bay und Co. GmbH, München
            </p>
            <p className="font-body text-xs text-muted/70 mt-6 leading-relaxed max-w-md">
              Bitte keine Bar-Namen vor dem {EVENT.barsRevealLabel} veröffentlichen. Die
              Vereinbarungen laufen noch, und wir wollen keinem Partner vorgreifen.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 pb-20">
        <Link
          href={`/${locale}`}
          className="font-body text-xs font-bold uppercase tracking-wider text-muted hover:text-bone transition-colors"
        >
          Zurück zu ON ICE
        </Link>
      </section>
    </main>
  );
}
