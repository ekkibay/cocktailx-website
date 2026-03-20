import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum der Cocktail X GmbH, München.",
};

export default function ImpressumPage() {
  return (
    <main className="bg-bone text-licorice min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-display mb-12">IMPRESSUM</h1>

        <div className="font-body text-licorice/80 leading-relaxed space-y-8">
          <section>
            <h2 className="text-2xl font-display text-licorice mb-4">
              Angaben gemaess &sect; 5 TMG
            </h2>
            <p>
              Cocktail X GmbH
              <br />
              Musterstrasse 1
              <br />
              80331 Muenchen
              <br />
              Deutschland
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display text-licorice mb-4">
              Vertreten durch
            </h2>
            <p>Jennifer Mindl, Geschaeftsfuehrerin</p>
          </section>

          <section>
            <h2 className="text-2xl font-display text-licorice mb-4">
              Kontakt
            </h2>
            <p>
              E-Mail: hello@cocktailx.de
              <br />
              Telefon: +49 (0) 89 123 456 78
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display text-licorice mb-4">
              Handelsregister
            </h2>
            <p>
              [Platzhalter] Registergericht: Amtsgericht Muenchen
              <br />
              Registernummer: HRB XXXXXX
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display text-licorice mb-4">
              Umsatzsteuer-ID
            </h2>
            <p>
              [Platzhalter] Umsatzsteuer-Identifikationsnummer gemaess &sect; 27a
              UStG: DE XXXXXXXXX
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display text-licorice mb-4">
              Haftungsausschluss
            </h2>
            <p>
              [Platzhalter] Trotz sorgfaeltiger inhaltlicher Kontrolle uebernehmen
              wir keine Haftung fuer die Inhalte externer Links. Fuer den Inhalt
              der verlinkten Seiten sind ausschliesslich deren Betreiber
              verantwortlich.
            </p>
          </section>

          <p className="text-sm text-licorice/40 mt-12">
            [Dies ist ein Platzhalter. Bitte ersetzen Sie diesen Text durch Ihr
            tatsaechliches Impressum.]
          </p>
        </div>
      </div>
    </main>
  );
}
