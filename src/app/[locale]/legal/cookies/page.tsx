import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie-Richtlinie",
  description: "Cookie-Richtlinie der bayundco GmbH (Cocktail X), München.",
};

export default function CookiesPage() {
  return (
    <main className="bg-bone text-licorice min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-display mb-12">
          COOKIE-RICHTLINIE
        </h1>

        <div className="font-body text-licorice/80 leading-relaxed space-y-8">
          <section>
            <h2 className="text-2xl font-display text-licorice mb-4">
              1. Was sind Cookies?
            </h2>
            <p>
              Cookies sind kleine Textdateien, die auf Ihrem Computer oder mobilen
              Gerät gespeichert werden, wenn Sie eine Website besuchen. Sie ermöglichen
              es der Website, sich an Ihre Aktionen und Einstellungen zu erinnern und
              Ihnen eine personalisierte Erfahrung zu bieten.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display text-licorice mb-4">
              2. Welche Cookies verwenden wir?
            </h2>
            <p className="mb-4">Wir verwenden folgende Kategorien von Cookies:</p>
            <ul className="list-disc list-inside space-y-3">
              <li>
                <strong>Notwendige Cookies:</strong> Diese Cookies sind für den
                technischen Betrieb der Website erforderlich und können nicht
                deaktiviert werden. Sie ermöglichen grundlegende Funktionen wie
                Navigation und Zugang zu gesicherten Bereichen.
              </li>
              <li>
                <strong>Shopify-Cookies:</strong> Da unsere Shop-Funktionalität von
                Shopify bereitgestellt wird, setzt Shopify Cookies zur
                Warenkorb-Verwaltung, Authentifizierung und Betrugsprävention ein.
              </li>
              <li>
                <strong>Präferenz-Cookies:</strong> Diese Cookies speichern Ihre
                Einstellungen wie Sprachauswahl, damit Sie diese beim nächsten Besuch
                nicht erneut eingeben müssen.
              </li>
              <li>
                <strong>Analyse-Cookies:</strong> Diese Cookies helfen uns zu
                verstehen, wie Besucher unsere Website nutzen, damit wir sie
                verbessern können. Die erhobenen Daten sind anonymisiert.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-display text-licorice mb-4">
              3. Cookies von Drittanbietern
            </h2>
            <p>
              Einige Cookies werden von Drittanbietern gesetzt, zum Beispiel von
              Shopify für die Shop-Funktionalität oder von sozialen Netzwerken, wenn
              Sie über deren Schaltflächen interagieren. Diese Drittanbieter haben
              eigene Datenschutzrichtlinien.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display text-licorice mb-4">
              4. Cookies verwalten und deaktivieren
            </h2>
            <p>
              Sie können Ihre Cookie-Einstellungen jederzeit über Ihren Browser
              anpassen oder Cookies löschen. Bitte beachten Sie, dass das Deaktivieren
              bestimmter Cookies die Funktionalität dieser Website beeinträchtigen kann
              (z. B. Warenkorb-Funktion beim Online-Shop).
            </p>
            <p className="mt-3">
              Anleitungen für gängige Browser:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Chrome: Einstellungen → Datenschutz und Sicherheit → Cookies</li>
              <li>Firefox: Einstellungen → Datenschutz &amp; Sicherheit</li>
              <li>Safari: Einstellungen → Datenschutz</li>
              <li>Edge: Einstellungen → Cookies und Websiteberechtigungen</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-display text-licorice mb-4">
              5. Kontakt
            </h2>
            <p>
              Bei Fragen zu unserer Cookie-Richtlinie wenden Sie sich bitte an:{" "}
              <a href="mailto:info@cocktail-x.com" className="text-licorice underline">
                info@cocktail-x.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
