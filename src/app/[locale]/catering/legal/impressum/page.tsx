"use client";

import { useLocale } from "next-intl";
import { useReveal } from "@/hooks/useReveal";

/* ────────────────────────── REVEAL HELPER ────────────────────────── */

function RevealDiv({
  children,
  className,
  delay = 0,
  direction = "up" as const,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
}) {
  const { ref, style } = useReveal<HTMLDivElement>({ delay, direction, distance: 30 });
  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}

/* ────────────────────────── PAGE ────────────────────────── */

export default function CateringImpressumPage() {
  const locale = useLocale() as "de" | "en";

  return (
    <main className="min-h-screen bg-ct-cream">
      {/* ── HEADER ── */}
      <section className="bg-licorice pt-40 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <RevealDiv>
            <p className="text-xs font-body font-bold uppercase tracking-[0.25em] text-ct-red mb-4">Legal</p>
            <h1 className="font-display text-5xl md:text-6xl text-ct-cream">
              {locale === "de" ? "Impressum" : "Imprint"}
            </h1>
          </RevealDiv>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-3xl mx-auto space-y-10 font-body text-everglade/80 leading-relaxed">
          <RevealDiv>
            <h2 className="font-display text-2xl text-licorice mb-4 pb-2 border-b border-everglade/15">
              {locale === "de" ? "Angaben gemäß § 5 TMG" : "Information pursuant to § 5 TMG"}
            </h2>
            <div className="bg-white/60 border border-everglade/10 rounded-xl p-5 space-y-1">
              <p className="font-bold text-licorice">Cocktail X Catering</p>
              <p>Bay und Co. GmbH</p>
              <p>c/o Ekkehard Bay</p>
              <p>München, Deutschland</p>
            </div>
          </RevealDiv>

          <RevealDiv delay={80}>
            <h2 className="font-display text-2xl text-licorice mb-4 pb-2 border-b border-everglade/15">
              {locale === "de" ? "Kontakt" : "Contact"}
            </h2>
            <div className="space-y-2">
              <p>
                <span className="text-everglade/50 text-sm">E-Mail: </span>
                <a href="mailto:info@cocktail-x.com" className="text-ct-red hover:text-ct-red/70 transition-colors">
                  info@cocktail-x.com
                </a>
              </p>
            </div>
          </RevealDiv>

          <RevealDiv delay={160}>
            <h2 className="font-display text-2xl text-licorice mb-4 pb-2 border-b border-everglade/15">
              {locale === "de" ? "Vertretungsberechtigte Personen" : "Authorised Representatives"}
            </h2>
            <p>Ekkehard Bay, Vincent Kerger</p>
          </RevealDiv>

          <RevealDiv delay={240}>
            <h2 className="font-display text-2xl text-licorice mb-4 pb-2 border-b border-everglade/15">
              {locale === "de" ? "Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV" : "Responsible for content pursuant to § 55 (2) RStV"}
            </h2>
            <p>Ekkehard Bay</p>
          </RevealDiv>

          <RevealDiv delay={320}>
            <h2 className="font-display text-2xl text-licorice mb-4 pb-2 border-b border-everglade/15">
              {locale === "de" ? "Haftungsausschluss" : "Disclaimer"}
            </h2>
            <p className="text-everglade/60 text-sm">
              {locale === "de"
                ? "Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen."
                : "The contents of our pages were created with the greatest care. However, we cannot guarantee the accuracy, completeness or timeliness of the content."}
            </p>
          </RevealDiv>

          <RevealDiv delay={400}>
            <h2 className="font-display text-2xl text-licorice mb-4 pb-2 border-b border-everglade/15">
              {locale === "de" ? "Urheberrecht" : "Copyright"}
            </h2>
            <p className="text-everglade/60 text-sm">
              {locale === "de"
                ? "Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers."
                : "The content and works created by the site operators on these pages are subject to German copyright law. Duplication, processing, distribution and any form of commercialisation of such material beyond the scope of the copyright law shall require the prior written consent of its respective author."}
            </p>
          </RevealDiv>
        </div>
      </section>
    </main>
  );
}
