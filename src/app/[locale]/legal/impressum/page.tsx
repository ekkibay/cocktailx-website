import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum der bayundco GmbH (Cocktail X), München.",
};

export default function ImpressumPage() {
  return (
    <main className="bg-bone text-licorice min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-display mb-12">IMPRESSUM</h1>

        <div className="font-body text-licorice/80 leading-relaxed space-y-8">
          <section>
            <h2 className="text-2xl font-display text-licorice mb-4">
              Angaben gemäß § 5 TMG
            </h2>
            <p>
              bayundco GmbH
              <br />
              (Handelsname: Cocktail X)
              <br />
              Türkenstr. 61 RGB
              <br />
              80799 München
              <br />
              Deutschland
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display text-licorice mb-4">
              Vertreten durch
            </h2>
            <p>Vincent Kerger, Ekkehard Bay (Geschäftsführer)</p>
          </section>

          <section>
            <h2 className="text-2xl font-display text-licorice mb-4">
              Kontakt
            </h2>
            <p>
              E-Mail: info@cocktail-x.com
              <br />
              Telefon: +49 1525 5709985
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display text-licorice mb-4">
              Handelsregister
            </h2>
            <p>
              Registergericht: Amtsgericht München
              <br />
              Registernummer: HRB 278992
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display text-licorice mb-4">
              Umsatzsteuer-ID
            </h2>
            <p>
              Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG:
              <br />
              DE359069377
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display text-licorice mb-4">
              Verantwortlich i. S. d. § 18 Abs. 2 MStV
            </h2>
            <p>
              Vincent Kerger, Ekkehard Bay
              <br />
              Türkenstr. 61 RGB, 80799 München
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display text-licorice mb-4">
              Streitschlichtung
            </h2>
            <p>
              Wir sind weder bereit noch verpflichtet, an Streitbeilegungsverfahren
              vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display text-licorice mb-4">
              Haftungsausschluss
            </h2>
            <p>
              Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine
              Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten
              Seiten sind ausschließlich deren Betreiber verantwortlich.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display text-licorice mb-4">
              Urheberrecht
            </h2>
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen
              Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung,
              Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
              Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des
              jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite
              sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
