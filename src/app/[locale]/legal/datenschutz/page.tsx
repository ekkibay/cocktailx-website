import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Datenschutzerklärung der bayundco GmbH (Cocktail X), München.",
};

export default function DatenschutzPage() {
  return (
    <main className="bg-bone text-licorice min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-display mb-4">
          DATENSCHUTZ
        </h1>
        <p className="font-body text-licorice/50 text-sm mb-12">
          Stand: 27. Januar 2026
        </p>

        <div className="font-body text-licorice/80 leading-relaxed space-y-8">
          <section>
            <h2 className="text-2xl font-display text-licorice mb-4">
              1. Verantwortlicher
            </h2>
            <p>
              Verantwortlich für die Datenverarbeitung auf dieser Website ist:
            </p>
            <p className="mt-3">
              bayundco GmbH (Handelsname: Cocktail X)
              <br />
              Türkenstr. 61 RGB
              <br />
              80799 München, Deutschland
              <br />
              E-Mail: info@cocktail-x.com
              <br />
              Telefon: +49 1525 5709985
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display text-licorice mb-4">
              2. Erhobene personenbezogene Daten
            </h2>
            <p>Wir erheben und verarbeiten folgende Kategorien personenbezogener Daten:</p>
            <ul className="list-disc list-inside mt-3 space-y-1">
              <li><strong>Kontaktdaten:</strong> Name, Adresse, Rechnungsadresse, Lieferadresse, Telefonnummer, E-Mail-Adresse</li>
              <li><strong>Finanzdaten:</strong> Zahlungskarteninformationen, Transaktionsdetails, Zahlungsbestätigungen</li>
              <li><strong>Kontoinformationen:</strong> Benutzername, Passwort, Sicherheitsfragen, Einstellungen und Präferenzen</li>
              <li><strong>Transaktionsdaten:</strong> Bestellhistorie, Warenkorbinhalte, Rückgaben und Stornierungen</li>
              <li><strong>Kommunikationsdaten:</strong> Inhalte von Kundenanfragen und Support-Nachrichten</li>
              <li><strong>Gerätedaten:</strong> Gerät, Browser, Netzwerkverbindung, IP-Adresse, eindeutige Kennungen</li>
              <li><strong>Nutzungsdaten:</strong> Interaktionsdetails zur Nutzung unserer Dienste</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-display text-licorice mb-4">
              3. Datenquellen
            </h2>
            <p>Wir erheben personenbezogene Daten aus folgenden Quellen:</p>
            <ul className="list-disc list-inside mt-3 space-y-1">
              <li>Direkt von Ihnen, wenn Sie ein Konto erstellen, unsere Dienste nutzen oder uns kontaktieren</li>
              <li>Automatisch über Geräte, Websites, Cookies und ähnliche Technologien</li>
              <li>Von Dienstleistungsanbietern, die für uns tätig sind</li>
              <li>Von Partnern und sonstigen Dritten</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-display text-licorice mb-4">
              4. Zwecke der Datenverarbeitung
            </h2>
            <p>Wir verwenden Ihre personenbezogenen Daten zu folgenden Zwecken:</p>
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li><strong>Bereitstellung unserer Dienste:</strong> Vertragserfüllung, Zahlungsabwicklung, Bestellbearbeitung, Kontoverwaltung, Versand</li>
              <li><strong>Marketing und Werbung:</strong> Versand von Marketing-E-Mails und Werbemitteilungen (mit Ihrer Einwilligung)</li>
              <li><strong>Sicherheit und Betrugsprävention:</strong> Authentifizierung, Erkennung und Verhinderung betrügerischer Aktivitäten</li>
              <li><strong>Kommunikation:</strong> Kundensupport und Beantwortung Ihrer Anfragen</li>
              <li><strong>Rechtliche Verpflichtungen:</strong> Einhaltung geltender Gesetze und Beantwortung behördlicher Anfragen</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-display text-licorice mb-4">
              5. Weitergabe von Daten
            </h2>
            <p>Wir geben Ihre personenbezogenen Daten in folgenden Fällen weiter:</p>
            <ul className="list-disc list-inside mt-3 space-y-1">
              <li><strong>Shopify:</strong> Unsere Website wird von Shopify gehostet. Shopify verarbeitet Daten gemäß der Shopify-Datenschutzrichtlinie.</li>
              <li><strong>Dienstleister:</strong> An Dritte, die Dienstleistungen in unserem Auftrag erbringen (z. B. Zahlungsabwicklung, Versand)</li>
              <li><strong>Marketing-Partner:</strong> Zur Bereitstellung von Werbedienstleistungen</li>
              <li><strong>Behörden:</strong> Wenn gesetzlich vorgeschrieben oder zur Durchsetzung unserer Rechte erforderlich</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-display text-licorice mb-4">
              6. Internationale Datenübertragungen
            </h2>
            <p>
              Wir können Ihre personenbezogenen Daten außerhalb Ihres Landes übertragen,
              speichern und verarbeiten. Bei Übertragungen aus dem Europäischen Wirtschaftsraum
              oder dem Vereinigten Königreich stützen wir uns auf anerkannte
              Übertragungsmechanismen wie die Standardvertragsklauseln der Europäischen
              Kommission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display text-licorice mb-4">
              7. Datensicherheit und Speicherdauer
            </h2>
            <p>
              Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein, um Ihre
              Daten zu schützen. Die Speicherdauer richtet sich nach dem Zweck der
              Verarbeitung, gesetzlichen Aufbewahrungspflichten sowie der Notwendigkeit zur
              Vertragserfüllung und Streitbeilegung.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display text-licorice mb-4">
              8. Ihre Rechte
            </h2>
            <p>Sie haben nach der DSGVO folgende Rechte:</p>
            <ul className="list-disc list-inside mt-3 space-y-1">
              <li><strong>Auskunftsrecht:</strong> Recht auf Auskunft über die von uns gespeicherten Daten</li>
              <li><strong>Berichtigungsrecht:</strong> Recht auf Berichtigung unrichtiger Daten</li>
              <li><strong>Löschungsrecht:</strong> Recht auf Löschung Ihrer personenbezogenen Daten</li>
              <li><strong>Einschränkung der Verarbeitung:</strong> Recht auf Einschränkung der Verarbeitung</li>
              <li><strong>Datenübertragbarkeit:</strong> Recht auf Erhalt Ihrer Daten in maschinenlesbarem Format</li>
              <li><strong>Widerspruchsrecht:</strong> Recht auf Widerspruch gegen die Verarbeitung</li>
              <li><strong>Widerruf der Einwilligung:</strong> Recht auf Widerruf einer erteilten Einwilligung</li>
            </ul>
            <p className="mt-4">
              Zur Ausübung Ihrer Rechte wenden Sie sich bitte an:{" "}
              <a href="mailto:info@cocktail-x.com" className="text-licorice underline">
                info@cocktail-x.com
              </a>
            </p>
            <p className="mt-3">
              Sie haben außerdem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde
              zu beschweren. Die zuständige Behörde in Bayern ist das Bayerische Landesamt
              für Datenschutzaufsicht (BayLDA).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display text-licorice mb-4">
              9. Cookies
            </h2>
            <p>
              Wir verwenden Cookies und ähnliche Technologien, um unsere Dienste
              bereitzustellen und zu verbessern. Weitere Informationen finden Sie in
              unserer{" "}
              <a href="./cookies" className="text-licorice underline">
                Cookie-Richtlinie
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display text-licorice mb-4">
              10. Kinder
            </h2>
            <p>
              Unsere Dienste richten sich nicht an Kinder unter 18 Jahren. Wir erheben
              wissentlich keine personenbezogenen Daten von Minderjährigen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display text-licorice mb-4">
              11. Änderungen dieser Datenschutzerklärung
            </h2>
            <p>
              Wir können diese Datenschutzerklärung von Zeit zu Zeit aktualisieren.
              Änderungen werden auf dieser Seite veröffentlicht und das Datum
              „Stand" wird aktualisiert.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display text-licorice mb-4">
              12. Kontakt
            </h2>
            <p>
              Bei Fragen zur Verarbeitung Ihrer personenbezogenen Daten:
            </p>
            <p className="mt-3">
              bayundco GmbH (Cocktail X)
              <br />
              Türkenstr. 61 RGB, 80799 München
              <br />
              E-Mail:{" "}
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
