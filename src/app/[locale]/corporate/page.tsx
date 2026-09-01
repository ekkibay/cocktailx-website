import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CORPORATE_SIZES, EVENT, TIERS, corporateMailto, currentTier } from "@/config/pricing";

export const metadata: Metadata = {
  title: "Team Nights",
  description:
    "Pässe fürs Team für COCKTAIL X ON ICE, 17. bis 28. November 2026 in München. 10, 25 oder 50 Pässe zum regulären Preis, eine Sammelrechnung auf die Firma.",
};

export const dynamic = "force-dynamic";

export default function CorporatePage({ params }: { params: { locale: string } }) {
  const locale = params.locale;
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
            Ein Abend, <span className="text-bone/70">den keiner organisieren muss.</span>
          </h1>
          <p className="font-body text-base md:text-lg text-bone/85 leading-relaxed max-w-xl">
            Ihr bekommt Pässe fürs Team, eine Rechnung auf die Firma und danach einen Abend, an dem
            niemand eine Location suchen, Tische reservieren oder Getränke abrechnen muss.
          </p>
        </div>
      </section>

      {/* ══ Wie es läuft ══ */}
      <section className="max-w-6xl mx-auto px-5 py-20 md:py-24">
        <h2 className="font-display text-3xl md:text-5xl leading-[0.95] mb-12 max-w-2xl">
          Drei Schritte. <span className="text-muted">Mehr braucht es nicht.</span>
        </h2>
        <ol className="grid sm:grid-cols-3 gap-px bg-hairline rounded-2xl overflow-hidden">
          {[
            {
              step: "01",
              title: "Anzahl nennen",
              text: "Schreib uns, wie viele Pässe ihr braucht und auf welche Firma die Rechnung läuft.",
            },
            {
              step: "02",
              title: "Sammelrechnung",
              text: "Ihr bekommt eine Rechnung mit allen Angaben für die Buchhaltung. Keine Einzelabrechnungen.",
            },
            {
              step: "03",
              title: "Pässe verteilen",
              text: "Jede Person lädt die App und löst ihren Pass ein. Wer wann losgeht, entscheidet jeder selbst.",
            },
          ].map((s) => (
            <li key={s.step} className="bg-licorice p-6 md:p-8">
              <span className="font-display text-4xl text-tangerine/25 block mb-5 leading-none">{s.step}</span>
              <h3 className="font-body font-bold text-base text-bone mb-2">{s.title}</h3>
              <p className="font-body text-sm text-muted leading-relaxed">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ══ Staffeln ══ */}
      <section className="border-y border-hairline">
        <div className="max-w-6xl mx-auto px-5 py-20 md:py-24">
          <h2 className="font-display text-3xl md:text-5xl leading-[0.95] mb-4 max-w-2xl">
            Zum regulären Preis. <span className="text-muted">Ohne Rabattverhandlung.</span>
          </h2>
          <p className="font-body text-base text-muted leading-relaxed max-w-xl mb-12">
            Wir geben auf Team Nights keine Mengenrabatte. Was ihr bekommt, ist die Abwicklung: eine
            Rechnung, eine Ansprechpartnerin, keine Rückfragen aus der Buchhaltung.
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            {CORPORATE_SIZES.map((size) => (
              <div key={size} className="rounded-2xl bg-surface ring-1 ring-hairline p-7 flex flex-col">
                <p className="font-display text-5xl text-bone leading-none mb-2 tabular-nums">{size}</p>
                <p className="font-body text-sm text-muted mb-6">Pässe</p>
                <p className="font-body text-sm text-bone/80 mb-1">
                  {size} × {price} €
                </p>
                <p className="font-display text-2xl text-tangerine mb-6 tabular-nums">{size * price} €</p>
                <a
                  href={corporateMailto(size)}
                  className="mt-auto block w-full text-center rounded-full border border-hairline px-6 py-3 font-body text-xs font-bold uppercase tracking-wider text-bone hover:border-tangerine transition-colors"
                >
                  {size} Pässe anfragen
                </a>
              </div>
            ))}
          </div>

          <p className="font-body text-xs text-muted mt-6">
            {/* Vorher stand hier "netto, zzgl. MwSt.", gerechnet wurde aber mit
                derselben Zahl, die die Startseite als Bruttopreis ausweist.
                Damit bedeutete 49 € auf zwei Seiten derselben Domain zwei
                verschiedene Betraege. */}
            Preise pro Pass zum jeweils gültigen Tarif, inkl. MwSt. Andere Stückzahlen auf Anfrage.
          </p>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="max-w-3xl mx-auto px-5 py-20 md:py-28 text-center">
        <h2 className="font-display text-3xl md:text-5xl leading-[0.95] mb-5">
          Sagt uns die Zahl. <span className="text-tangerine">Den Rest machen wir.</span>
        </h2>
        <p className="font-body text-base text-muted mb-9 max-w-lg mx-auto leading-relaxed">
          {EVENT.dateLabel} in {EVENT.city}. Schreib uns, wir melden uns am selben Werktag.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href={corporateMailto()} className="btn-primary text-sm">
            Anfrage schreiben
          </a>
          <Link
            href={`/${locale}`}
            className="font-body text-xs font-bold uppercase tracking-wider text-muted hover:text-bone transition-colors"
          >
            Zurück zu ON ICE
          </Link>
        </div>
      </section>
    </main>
  );
}
