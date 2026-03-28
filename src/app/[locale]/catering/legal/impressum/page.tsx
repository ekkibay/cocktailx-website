"use client";

import { useLocale } from "next-intl";

export default function CateringImpressumPage() {
  const locale = useLocale() as "de" | "en";

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#000000" }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(/images/pattern-3.png)", backgroundSize: "180px 180px", backgroundRepeat: "repeat" }} />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 pt-40 pb-24">
        <p className="text-xs font-body font-bold uppercase tracking-[0.25em] text-ct-green mb-4">Legal</p>
        <h1 className="font-display text-5xl md:text-6xl text-ct-cream mb-12">
          {locale === "de" ? "IMPRESSUM" : "IMPRINT"}
        </h1>

        <div className="space-y-10 font-body text-ct-cream/80 leading-relaxed">
          <section>
            <h2 className="font-display text-2xl text-ct-cream mb-4 pb-2 border-b border-ct-green/20">
              {locale === "de" ? "Angaben gemäß § 5 TMG" : "Information pursuant to § 5 TMG"}
            </h2>
            <div className="bg-ct-green/[0.04] border border-ct-green/15 rounded-xl p-5 space-y-1">
              <p className="font-bold text-ct-cream">Cocktail X Catering</p>
              <p>Bay und Co. GmbH</p>
              <p>c/o Ekkehard Bay</p>
              <p>München, Deutschland</p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ct-cream mb-4 pb-2 border-b border-ct-green/20">
              {locale === "de" ? "Kontakt" : "Contact"}
            </h2>
            <div className="space-y-2">
              <p>
                <span className="text-ct-cream/55 text-sm">E-Mail: </span>
                <a href="mailto:catering@cocktail-x.com" className="text-ct-green hover:text-ct-green/80 transition-colors">
                  catering@cocktail-x.com
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ct-cream mb-4 pb-2 border-b border-ct-green/20">
              {locale === "de" ? "Vertretungsberechtigte Personen" : "Authorised Representatives"}
            </h2>
            <p>Ekkehard Bay, Vincent Kerger</p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ct-cream mb-4 pb-2 border-b border-ct-green/20">
              {locale === "de" ? "Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV" : "Responsible for content pursuant to § 55 (2) RStV"}
            </h2>
            <p>Ekkehard Bay</p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ct-cream mb-4 pb-2 border-b border-ct-green/20">
              {locale === "de" ? "Haftungsausschluss" : "Disclaimer"}
            </h2>
            <p className="text-ct-cream/65 text-sm">
              {locale === "de"
                ? "Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen."
                : "The contents of our pages were created with the greatest care. However, we cannot guarantee the accuracy, completeness or timeliness of the content."}
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ct-cream mb-4 pb-2 border-b border-ct-green/20">
              {locale === "de" ? "Urheberrecht" : "Copyright"}
            </h2>
            <p className="text-ct-cream/65 text-sm">
              {locale === "de"
                ? "Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers."
                : "The content and works created by the site operators on these pages are subject to German copyright law. Duplication, processing, distribution and any form of commercialisation of such material beyond the scope of the copyright law shall require the prior written consent of its respective author."}
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
