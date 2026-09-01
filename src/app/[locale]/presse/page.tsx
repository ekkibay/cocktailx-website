import type { Metadata } from "next";
import Link from "next/link";
import {
  CONTACT_EMAIL,
  EARLY_UNTIL_LABEL,
  EARLY_UNTIL_LABEL_EN,
  EVENT,
  SUMMER_PROOF,
  TIERS,
} from "@/config/pricing";
import { asLocale, pick, type Bilingual, type Locale } from "@/i18n/bilingual";

/**
 * Die Metadaten haengen an der Sprache der Route, deshalb generateMetadata
 * statt eines statischen Objekts. Zeitraum und Preise kommen aus der
 * Preisdatei, damit eine Verschiebung nicht ausgerechnet in den
 * Suchergebnissen haengenbleibt.
 */
export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = asLocale(params.locale);

  return {
    title: pick({ de: "Presse", en: "Press" }, locale),
    description: pick(
      {
        de: `Pressekontakt und Eckdaten zu COCKTAIL X ON ICE, ${EVENT.dateLabel} in München. Pressemappe auf Anfrage.`,
        en: `Press contact and key facts on COCKTAIL X ON ICE, ${EVENT.dateLabelEn} in ${EVENT.cityEn}. Press kit on request.`,
      },
      locale,
    ),
  };
}

/**
 * Die Eckdaten sind das, was Redaktionen abschreiben. Sie stehen deshalb
 * geschlossen an einer Stelle und ziehen jede Zahl aus der Preisdatei.
 * Die Bars bleiben in beiden Sprachen bei "40+", vor dem Reveal geht keine
 * genauere Angabe nach draussen.
 */
const FACTS: { label: Bilingual; value: Bilingual }[] = [
  {
    label: { de: "Titel", en: "Title" },
    value: { de: "COCKTAIL X ON ICE '26", en: "COCKTAIL X ON ICE '26" },
  },
  {
    label: { de: "Zeitraum", en: "Dates" },
    value: {
      de: `${EVENT.dateLabel}, ${EVENT.nights} Nächte`,
      en: `${EVENT.dateLabelEn}, ${EVENT.nights} nights`,
    },
  },
  {
    label: { de: "Ort", en: "Location" },
    value: {
      de: `${EVENT.city}, Bars über das Stadtgebiet verteilt`,
      en: `${EVENT.cityEn}, bars spread across the city`,
    },
  },
  {
    label: { de: "Teilnehmende Bars", en: "Participating bars" },
    value: {
      de: `${EVENT.barsLabel}, Bekanntgabe ab ${EVENT.barsRevealLabel}`,
      en: `${EVENT.barsLabel}, announced from ${EVENT.barsRevealLabelEn}`,
    },
  },
  {
    label: { de: "Zugang", en: "Access" },
    value: {
      de: "Ein Pass für alle Nächte, eingelöst über die Cocktail X App",
      en: "One pass for every night, redeemed in the Cocktail X app",
    },
  },
  {
    label: { de: "Preis", en: "Price" },
    value: {
      de: `${TIERS.early.price} € ${TIERS.early.label} bis ${EARLY_UNTIL_LABEL}, danach ${TIERS.full.price} € ${TIERS.full.label}. Alle Preise inklusive Mehrwertsteuer.`,
      en: `€${TIERS.early.price} ${TIERS.early.labelEn} until ${EARLY_UNTIL_LABEL_EN}, then €${TIERS.full.price} ${TIERS.full.labelEn}. All prices include VAT.`,
    },
  },
  {
    label: { de: "Vorgängerausgabe", en: "Previous edition" },
    value: {
      de: `${SUMMER_PROOF.guests.toLocaleString("de-DE")} Gäste, ${SUMMER_PROOF.bars} Bars`,
      en: `${SUMMER_PROOF.guests.toLocaleString("en-GB")} guests, ${SUMMER_PROOF.bars} bars`,
    },
  },
  {
    label: { de: "Veranstalter", en: "Organiser" },
    value: { de: `bayundco GmbH, ${EVENT.city}`, en: `bayundco GmbH, ${EVENT.cityEn}` },
  },
];

/** Was bis zur fertigen Mappe auf Anfrage rausgeht. */
const KIT_ITEMS: Bilingual[] = [
  { de: "Pressetext, kurz und lang", en: "Press text, short and long" },
  {
    de: "Logos in Weiß und Schwarz, Vektor und PNG",
    en: "Logos in white and black, vector and PNG",
  },
  {
    de: "Bildauswahl aus der Vorgängerausgabe, honorarfrei mit Nennung",
    en: "A selection of images from the previous edition, free of charge with a credit",
  },
  { de: "Zitate der Gründer auf Anfrage", en: "Founder quotes on request" },
];

/**
 * Fliesstext der Seite, gesammelt statt im JSX verstreut. Sonst besteht jede
 * zweite Zeile aus einem Objektliteral und die Struktur der Seite
 * verschwindet darunter.
 */
const COPY = {
  eyebrow: { de: "Presse", en: "Press" },
  headline: { de: "Zahlen, Bilder,", en: "Figures, images," },
  headlineMuted: { de: "Ansprechpartner.", en: "someone to ask." },
  intro: {
    de: "Für Anfragen, Interviews und Akkreditierungen schreib uns direkt. Wir antworten am selben Werktag und schicken dir Bildmaterial in Druckauflösung.",
    en: "For enquiries, interviews and accreditation, write to us directly. We reply the same working day and send you images at print resolution.",
  },
  factsTitle: { de: "Eckdaten", en: "Key facts" },
  kitTitle: { de: "Pressemappe", en: "Press kit" },
  kitLead: {
    de: `Die Mappe mit Bildmaterial, Logos und Hintergrundtexten wird derzeit zusammengestellt und steht ab dem Bar-Reveal am ${EVENT.barsRevealLabel} zum Download bereit. Bis dahin schicken wir dir alles auf Anfrage direkt zu.`,
    en: `The kit with images, logos and background texts is being put together and will be ready to download from the bar reveal on ${EVENT.barsRevealLabelEn}. Until then we send you everything directly on request.`,
  },
  kitListTitle: { de: "Bis zum Download verfügbar", en: "Available on request until then" },
  contactTitle: { de: "Kontakt", en: "Contact" },
  contactLead: {
    de: "Schreib direkt an die Redaktionsadresse, dann landet die Anfrage ohne Umweg bei der richtigen Person.",
    en: "Write straight to the press address and your enquiry lands with the right person, no detour.",
  },
  contactSubject: { de: "Presseanfrage ON ICE '26", en: "Press enquiry ON ICE '26" },
  contactCta: { de: "Presseanfrage schreiben", en: "Write to the press desk" },
  imprint: { de: `bayundco GmbH, ${EVENT.city}`, en: `bayundco GmbH, ${EVENT.cityEn}` },
  /* Die Bitte um Zurueckhaltung geht an Journalisten. Sie muss in beiden
     Sprachen dasselbe sein: eine Bitte, keine Auflage, und mit dem Grund
     dahinter. Ohne den Grund liest sie sich wie eine Bedingung. */
  embargo: {
    de: `Bitte keine Bar-Namen vor dem ${EVENT.barsRevealLabel} veröffentlichen. Die Vereinbarungen laufen noch, und wir wollen keinem Partner vorgreifen.`,
    en: `Please hold back any bar names until ${EVENT.barsRevealLabelEn}. The agreements are still running, and we would rather not get ahead of any partner.`,
  },
  back: { de: "Zurück zu ON ICE", en: "Back to ON ICE" },
} satisfies Record<string, Bilingual>;

export default function PressePage({ params }: { params: { locale: string } }) {
  const locale: Locale = asLocale(params.locale);

  return (
    <main className="bg-licorice text-bone">
      <section className="max-w-6xl mx-auto px-5 pt-32 md:pt-40 pb-16">
        <p className="font-body text-[11px] font-bold uppercase tracking-[0.3em] text-tangerine mb-6">
          {pick(COPY.eyebrow, locale)}
        </p>
        <h1 className="font-display text-5xl md:text-7xl leading-[0.9] mb-6 max-w-3xl">
          {pick(COPY.headline, locale)}{" "}
          <span className="text-muted">{pick(COPY.headlineMuted, locale)}</span>
        </h1>
        <p className="font-body text-base md:text-lg text-muted leading-relaxed max-w-xl">
          {pick(COPY.intro, locale)}
        </p>
      </section>

      {/* ══ Eckdaten ══ */}
      <section className="border-y border-hairline">
        <div className="max-w-6xl mx-auto px-5 py-16 md:py-20">
          <h2 className="font-display text-3xl md:text-4xl mb-10">{pick(COPY.factsTitle, locale)}</h2>
          <dl className="grid sm:grid-cols-2 gap-px bg-hairline rounded-2xl overflow-hidden">
            {FACTS.map((f) => (
              <div key={f.label.de} className="bg-licorice p-6">
                <dt className="font-body text-[11px] uppercase tracking-wider text-muted mb-2">
                  {pick(f.label, locale)}
                </dt>
                <dd className="font-body text-sm text-bone leading-relaxed">{pick(f.value, locale)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ══ Pressemappe ══ */}
      <section className="max-w-6xl mx-auto px-5 py-16 md:py-20">
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl mb-4">{pick(COPY.kitTitle, locale)}</h2>
            <p className="font-body text-sm text-muted leading-relaxed mb-6 max-w-lg">
              {pick(COPY.kitLead, locale)}
            </p>
            <div className="rounded-2xl bg-surface ring-1 ring-hairline p-6">
              <p className="font-body text-[11px] uppercase tracking-wider text-muted mb-3">
                {pick(COPY.kitListTitle, locale)}
              </p>
              <ul className="space-y-2">
                {KIT_ITEMS.map((item) => (
                  <li key={item.de} className="flex gap-2.5 font-body text-sm text-bone/80">
                    <span className="text-tangerine flex-shrink-0">/</span>
                    {pick(item, locale)}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h2 className="font-display text-3xl md:text-4xl mb-4">{pick(COPY.contactTitle, locale)}</h2>
            <p className="font-body text-sm text-muted leading-relaxed mb-6 max-w-lg">
              {pick(COPY.contactLead, locale)}
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(pick(COPY.contactSubject, locale))}`}
              className="btn-primary text-sm"
            >
              {pick(COPY.contactCta, locale)}
            </a>
            <p className="font-body text-sm text-muted mt-6">
              {CONTACT_EMAIL}
              <br />
              {pick(COPY.imprint, locale)}
            </p>
            <p className="font-body text-xs text-muted/70 mt-6 leading-relaxed max-w-md">
              {pick(COPY.embargo, locale)}
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 pb-20">
        <Link
          href={locale === "en" ? "/en" : "/"}
          className="font-body text-xs font-bold uppercase tracking-wider text-muted hover:text-bone transition-colors"
        >
          {pick(COPY.back, locale)}
        </Link>
      </section>
    </main>
  );
}
