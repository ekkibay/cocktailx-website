import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CORPORATE_SIZES, EVENT, TIERS, corporateMailto, currentTier } from "@/config/pricing";
import { asLocale, pick, type Bilingual } from "@/i18n/bilingual";

/*
 * Die Texte dieser Seite liegen hier und nicht in der Konfiguration: Sie
 * gehoeren zu genau dieser einen Seite und werden nirgends sonst gebraucht.
 * Das Muster {de, en} ist dasselbe wie in onice.ts und pricing.ts, damit man
 * beim Lesen nicht umdenken muss.
 *
 * "Team Nights" bleibt in beiden Sprachen stehen, das ist der Produktname.
 */

/* München heisst auf Englisch Munich, und EVENT.city kennt nur die deutsche
   Form. Der deutsche Wert kommt trotzdem aus der Konstante, damit hier keine
   zweite Schreibweise der Stadt entsteht. */
const CITY: Bilingual = { de: EVENT.city, en: EVENT.cityEn };

const HEAD = {
  titleLead: { de: "Ein Abend,", en: "An evening" },
  titleRest: { de: "den keiner organisieren muss.", en: "nobody has to organise." },
  intro: {
    de: "Ihr bekommt Pässe fürs Team, eine Rechnung auf die Firma und danach einen Abend, an dem niemand eine Location suchen, Tische reservieren oder Getränke abrechnen muss.",
    en: "You get passes for the team, one invoice to the company and then a night where nobody has to find a venue, sort out tables or settle up for drinks.",
  },
};

const STEPS_HEAD = {
  lead: { de: "Drei Schritte.", en: "Three steps." },
  rest: { de: "Mehr braucht es nicht.", en: "That is all it takes." },
};

const STEPS: { step: string; title: Bilingual; text: Bilingual }[] = [
  {
    step: "01",
    title: { de: "Anzahl nennen", en: "Tell us the number" },
    text: {
      de: "Schreib uns, wie viele Pässe ihr braucht und auf welche Firma die Rechnung läuft.",
      en: "Write to us with the number of passes you need and the company the invoice goes to.",
    },
  },
  {
    step: "02",
    title: { de: "Sammelrechnung", en: "One invoice" },
    text: {
      de: "Ihr bekommt eine Rechnung mit allen Angaben für die Buchhaltung. Keine Einzelabrechnungen.",
      en: "You get one invoice with everything accounts needs. No separate expense claims.",
    },
  },
  {
    step: "03",
    title: { de: "Pässe verteilen", en: "Hand out the passes" },
    /* Hier stand "lädt die App". Die App ist eine Webanwendung, es gibt nichts
       herunterzuladen, und die englische Fassung haette den Fehler sonst
       mitgenommen. */
    text: {
      de: "Jede Person öffnet die App und löst ihren Pass ein. Wer wann losgeht, entscheidet jeder selbst.",
      en: "Everyone opens the app and redeems their pass. When to set off is up to each person.",
    },
  },
];

const SIZES = {
  headLead: { de: "Zum regulären Preis.", en: "At the regular price." },
  headRest: { de: "Ohne Rabattverhandlung.", en: "No haggling over discounts." },
  intro: {
    de: "Wir geben auf Team Nights keine Mengenrabatte. Was ihr bekommt, ist die Abwicklung: eine Rechnung, eine Ansprechpartnerin, keine Rückfragen aus der Buchhaltung.",
    en: "We give no volume discounts on Team Nights. What you get is the handling: one invoice, one contact person, no queries from accounts.",
  },
  passes: { de: "Pässe", en: "passes" },
  /* Vorher stand hier "netto, zzgl. MwSt.", gerechnet wurde aber mit derselben
     Zahl, die die Startseite als Bruttopreis ausweist. Damit bedeutete 49 € auf
     zwei Seiten derselben Domain zwei verschiedene Betraege. Der Hinweis ist
     rechtlich relevant, deshalb steht die Mehrwertsteuer im Englischen in einem
     eigenen Satz und nicht in einem Nebensatz, den man ueberliest. */
  vat: {
    de: "Preise pro Pass zum jeweils gültigen Tarif, inkl. MwSt. Andere Stückzahlen auf Anfrage.",
    en: "Price per pass at the tariff in force. All prices include VAT. Other quantities on request.",
  },
};

const CTA = {
  headLead: { de: "Sagt uns die Zahl.", en: "Tell us the number." },
  headRest: { de: "Den Rest machen wir.", en: "We do the rest." },
  reply: {
    de: "Schreib uns, wir melden uns am selben Werktag.",
    en: "Write to us and you hear back the same working day.",
  },
  request: { de: "Anfrage schreiben", en: "Send an enquiry" },
  back: { de: "Zurück zu ON ICE", en: "Back to ON ICE" },
};

/** "10, 25 oder 50" beziehungsweise "10, 25 or 50", immer aus den Staffeln. */
function sizeList(conjunction: string): string {
  const sizes = [...CORPORATE_SIZES];
  const last = sizes.pop();
  return `${sizes.join(", ")} ${conjunction} ${last}`;
}

/*
 * Die Metadaten haengen an der Sprache der Route, also an params. Ein
 * statisches metadata-Objekt kann das nicht leisten, es kennt die Route nicht.
 */
export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = asLocale(params.locale);
  const description: Bilingual = {
    de: `Pässe fürs Team für ${EVENT.name}, ${EVENT.dateLabel} in ${CITY.de}. ${sizeList("oder")} Pässe zum regulären Preis, eine Sammelrechnung auf die Firma.`,
    en: `Passes for the team at ${EVENT.name}, ${EVENT.dateLabelEn} in ${CITY.en}. ${sizeList("or")} passes at the regular price, one invoice to the company.`,
  };

  return {
    title: "Team Nights",
    description: pick(description, locale),
  };
}

export const dynamic = "force-dynamic";

export default function CorporatePage({ params }: { params: { locale: string } }) {
  const locale = asLocale(params.locale);
  const price = TIERS[currentTier()].price;

  return (
    <main className="bg-licorice text-bone">
      {/* ══ Kopf ══ */}
      <section className="relative overflow-hidden">
        <Image
          src="/images/onice/set-crew-toast.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[center_45%]"
        />
        {/* Ein flaechiger Schleier reichte hier nicht. Das Motiv ist hell und
            unruhig, und Schrift auf einem unruhigen Grund braucht mehr als
            einen rechnerisch ausreichenden Kontrastwert: Die Buchstaben
            konkurrieren mit Gesichtern und Glaesern um dieselbe Flaeche.
            Deshalb zwei Verlaeufe mit engen Stopps, die genau dort decken, wo
            der Text steht, und das Bild rechts frei lassen. */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(var(--c-ground))_0%,rgb(var(--c-ground)/0.92)_38%,rgb(var(--c-ground)/0.55)_70%,rgb(var(--c-ground)/0.35)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(var(--c-ground))_0%,rgb(var(--c-ground)/0.35)_35%,transparent_75%)]" />
        <div className="relative max-w-6xl mx-auto px-5 pt-32 md:pt-40 pb-16">
          <p className="font-body text-[11px] font-bold uppercase tracking-[0.3em] text-tangerine mb-6">
            Team Nights
          </p>
          <h1 className="font-display text-5xl md:text-7xl leading-[0.9] mb-6 max-w-3xl">
            {pick(HEAD.titleLead, locale)}{" "}
            <span className="text-bone/70">{pick(HEAD.titleRest, locale)}</span>
          </h1>
          <p className="font-body text-base md:text-lg text-bone/85 leading-relaxed max-w-xl">
            {pick(HEAD.intro, locale)}
          </p>
        </div>
      </section>

      {/* ══ Wie es läuft ══ */}
      <section className="max-w-6xl mx-auto px-5 py-20 md:py-24">
        <h2 className="font-display text-3xl md:text-5xl leading-[0.95] mb-12 max-w-2xl">
          {pick(STEPS_HEAD.lead, locale)}{" "}
          <span className="text-muted">{pick(STEPS_HEAD.rest, locale)}</span>
        </h2>
        <ol className="grid sm:grid-cols-3 gap-px bg-hairline rounded-2xl overflow-hidden">
          {STEPS.map((s) => (
            <li key={s.step} className="bg-licorice p-6 md:p-8">
              <span className="font-display text-4xl text-tangerine/25 block mb-5 leading-none">{s.step}</span>
              <h3 className="font-body font-bold text-base text-bone mb-2">{pick(s.title, locale)}</h3>
              <p className="font-body text-sm text-muted leading-relaxed">{pick(s.text, locale)}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ══ Staffeln ══ */}
      <section className="border-y border-hairline">
        <div className="max-w-6xl mx-auto px-5 py-20 md:py-24">
          <h2 className="font-display text-3xl md:text-5xl leading-[0.95] mb-4 max-w-2xl">
            {pick(SIZES.headLead, locale)}{" "}
            <span className="text-muted">{pick(SIZES.headRest, locale)}</span>
          </h2>
          <p className="font-body text-base text-muted leading-relaxed max-w-xl mb-12">
            {pick(SIZES.intro, locale)}
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            {CORPORATE_SIZES.map((size) => (
              <div key={size} className="rounded-2xl bg-surface ring-1 ring-hairline p-7 flex flex-col">
                <p className="font-display text-5xl text-bone leading-none mb-2 tabular-nums">{size}</p>
                <p className="font-body text-sm text-muted mb-6">{pick(SIZES.passes, locale)}</p>
                <p className="font-body text-sm text-bone/80 mb-1">
                  {size} × {price} €
                </p>
                <p className="font-display text-2xl text-tangerine mb-6 tabular-nums">{size * price} €</p>
                <a
                  href={corporateMailto(size)}
                  className="mt-auto block w-full text-center rounded-full border border-hairline px-6 py-3 font-body text-xs font-bold uppercase tracking-wider text-bone hover:border-tangerine transition-colors"
                >
                  {/* Die Anzahl steht mitten im Satz und wandert je Sprache an
                      eine andere Stelle, deshalb hier zwei ganze Saetze. */}
                  {locale === "en" ? `Request ${size} passes` : `${size} Pässe anfragen`}
                </a>
              </div>
            ))}
          </div>

          <p className="font-body text-xs text-muted mt-6">{pick(SIZES.vat, locale)}</p>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="max-w-3xl mx-auto px-5 py-20 md:py-28 text-center">
        <h2 className="font-display text-3xl md:text-5xl leading-[0.95] mb-5">
          {pick(CTA.headLead, locale)} <span className="text-tangerine">{pick(CTA.headRest, locale)}</span>
        </h2>
        <p className="font-body text-base text-muted mb-9 max-w-lg mx-auto leading-relaxed">
          {locale === "en" ? EVENT.dateLabelEn : EVENT.dateLabel} in {pick(CITY, locale)}.{" "}
          {pick(CTA.reply, locale)}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href={corporateMailto()} className="btn-primary text-sm">
            {pick(CTA.request, locale)}
          </a>
          <Link
            href={locale === "en" ? "/en" : "/"}
            className="font-body text-xs font-bold uppercase tracking-wider text-muted hover:text-bone transition-colors"
          >
            {pick(CTA.back, locale)}
          </Link>
        </div>
      </section>
    </main>
  );
}
