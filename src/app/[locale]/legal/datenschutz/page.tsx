import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Datenschutzerklärung der Cocktail X GmbH.",
};

export default function DatenschutzPage() {
  return (
    <main className="bg-bone text-licorice min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-display mb-12">
          DATENSCHUTZ
        </h1>

        <div className="font-body text-licorice/80 leading-relaxed space-y-8">
          <section>
            <h2 className="text-2xl font-display text-licorice mb-4">
              1. Verantwortlicher
            </h2>
            <p>
              Verantwortlich fuer die Datenverarbeitung auf dieser Website ist:
              Cocktail X GmbH, Musterstrasse 1, 80331 Muenchen, Deutschland.
              E-Mail: hello@cocktailx.de
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display text-licorice mb-4">
              2. Erhebung und Speicherung personenbezogener Daten
            </h2>
            <p>
              [Platzhalter] Bei dem blossen informatorischen Nutzung der Website
              erheben wir nur die personenbezogenen Daten, die Ihr Browser an
              unseren Server uebermittelt. Diese Daten werden temporaer in einem
              sog. Logfile gespeichert und nach 14 Tagen automatisch geloescht.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display text-licorice mb-4">
              3. Weitergabe von Daten
            </h2>
            <p>
              [Platzhalter] Eine Uebermittlung Ihrer persoenlichen Daten an Dritte
              zu anderen als den im Folgenden aufgefuehrten Zwecken findet nicht
              statt. Wir geben Ihre persoenlichen Daten nur an Dritte weiter, wenn
              Sie Ihre ausdrueckliche Einwilligung dazu erteilt haben.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display text-licorice mb-4">
              4. Ihre Rechte
            </h2>
            <p>
              [Platzhalter] Sie haben das Recht auf Auskunft, Berichtigung,
              Loeschung, Einschraenkung der Verarbeitung sowie Datenuebertragbarkeit.
              Bitte wenden Sie sich hierzu an die oben genannte Kontaktadresse.
            </p>
          </section>

          <p className="text-sm text-licorice/40 mt-12">
            [Dies ist ein Platzhalter. Bitte ersetzen Sie diesen Text durch Ihre
            tatsaechliche Datenschutzerklaerung.]
          </p>
        </div>
      </div>
    </main>
  );
}
