import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Datenschutz — Cocktail X",
  description: "Datenschutzerklärung der bayundco GmbH (Cocktail X), München.",
};

export default function DatenschutzPage() {
  return (
    <main className="min-h-screen relative">
      {/* CI background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(/images/pattern-bg.svg)", backgroundSize: "200px 200px", backgroundRepeat: "repeat", opacity: 0.1 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(25,21,19,0.7) 0%, rgba(25,21,19,0.3) 40%, rgba(25,21,19,0.3) 80%, rgba(25,21,19,0.8) 100%)" }} />
        <div style={{ position: "absolute", top: "-150px", right: "-150px", width: "500px", height: "500px", borderRadius: "50%", background: "rgba(243,146,0,0.07)", filter: "blur(120px)" }} />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 py-20 md:py-28">

        {/* Header */}
        <p className="text-xs font-body font-bold text-tangerine uppercase tracking-[0.25em] mb-4">Legal</p>
        <h1 className="text-5xl md:text-7xl font-display text-bone mb-3">DATENSCHUTZ</h1>
        <p className="font-body text-bone/40 text-sm mb-16">Stand: 27. Januar 2026</p>

        <div className="space-y-12 font-body text-bone/70 leading-relaxed">

          {/* 1 */}
          <section>
            <h2 className="text-xl md:text-2xl font-display text-bone mb-5 pb-3 border-b border-bone/10">
              1. Verantwortlicher
            </h2>
            <p className="mb-4">
              Diese Website wird von der bayundco GmbH (Handelsname: Cocktail X) betrieben. Verantwortlich für die Datenverarbeitung im Sinne der DSGVO ist:
            </p>
            <div className="bg-bone/[0.04] border border-bone/10 rounded-xl p-5 text-bone/80">
              bayundco GmbH (Cocktail X)<br />
              Türkenstraße 61 RGB<br />
              80799 München, Deutschland<br />
              <a href="mailto:info@cocktail-x.com" className="text-tangerine hover:text-tangerine/80 transition-colors">info@cocktail-x.com</a><br />
              +49 1525 5709985
            </div>
            <p className="mt-4">
              Die Dienste werden über Shopify gehostet. Shopify erhebt und verarbeitet personenbezogene Daten zur Verbesserung seiner Dienste gemäß der{" "}
              <a href="https://www.shopify.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-tangerine hover:text-tangerine/80 transition-colors underline underline-offset-4">
                Shopify-Datenschutzrichtlinie
              </a>
              .
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl md:text-2xl font-display text-bone mb-5 pb-3 border-b border-bone/10">
              2. Erhobene personenbezogene Daten
            </h2>
            <p className="mb-4">Wir erheben und verarbeiten folgende Kategorien personenbezogener Daten:</p>
            <ul className="space-y-3">
              {[
                ["Kontaktdaten", "Name, Adresse, Rechnungsadresse, Lieferadresse, Telefonnummer, E-Mail-Adresse"],
                ["Finanzdaten", "Zahlungskarteninformationen, Transaktionsdetails, Zahlungsbestätigungen"],
                ["Kontoinformationen", "Benutzername, Passwort, Sicherheitsfragen, Einstellungen und Präferenzen"],
                ["Transaktionsdaten", "Bestellhistorie, angesehene und gekaufte Artikel, Warenkorbinhalte, Wunschlisten, Rückgaben und Stornierungen"],
                ["Kommunikationsdaten", "Inhalte von Kundenanfragen und Support-Nachrichten"],
                ["Gerätedaten", "Gerät, Browser, Netzwerkverbindung, IP-Adresse, eindeutige Kennungen"],
                ["Nutzungsdaten", "Interaktionsdetails zur Nutzung unserer Dienste"],
              ].map(([title, desc]) => (
                <li key={title} className="flex gap-3">
                  <span className="text-tangerine mt-1 flex-shrink-0">✦</span>
                  <span><span className="text-bone/90 font-medium">{title}:</span> {desc}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl md:text-2xl font-display text-bone mb-5 pb-3 border-b border-bone/10">
              3. Datenquellen
            </h2>
            <p className="mb-4">Wir erheben personenbezogene Daten aus folgenden Quellen:</p>
            <ul className="space-y-3">
              {[
                "Direkt von Ihnen, wenn Sie ein Konto erstellen, unsere Dienste nutzen oder uns kontaktieren",
                "Automatisch über Ihre Geräte, Websites, Cookies und ähnliche Tracking-Technologien",
                "Von Dienstleistungsanbietern, die für uns tätig sind",
                "Von Partnern und sonstigen Dritten",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-tangerine mt-1 flex-shrink-0">✦</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl md:text-2xl font-display text-bone mb-5 pb-3 border-b border-bone/10">
              4. Zwecke der Datenverarbeitung
            </h2>
            <p className="mb-4">Wir verwenden Ihre personenbezogenen Daten zu folgenden Zwecken:</p>
            <ul className="space-y-3">
              {[
                ["Bereitstellung unserer Dienste", "Vertragserfüllung, Zahlungsabwicklung, Bestellbearbeitung, Kontoverwaltung, Versand und Lieferung"],
                ["Marketing und Werbung", "Versand von Marketing-E-Mails und Werbemitteilungen (nur mit Ihrer ausdrücklichen Einwilligung)"],
                ["Sicherheit und Betrugsprävention", "Authentifizierung, Erkennung und Verhinderung betrügerischer Aktivitäten"],
                ["Kommunikation", "Kundensupport, Beantwortung Ihrer Anfragen und Bereitstellung von Informationen"],
                ["Verbesserung unserer Dienste", "Analyse der Nutzung und Weiterentwicklung unserer Angebote"],
                ["Rechtliche Verpflichtungen", "Einhaltung geltender Gesetze und Beantwortung behördlicher Anfragen"],
              ].map(([title, desc]) => (
                <li key={title} className="flex gap-3">
                  <span className="text-tangerine mt-1 flex-shrink-0">✦</span>
                  <span><span className="text-bone/90 font-medium">{title}:</span> {desc}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl md:text-2xl font-display text-bone mb-5 pb-3 border-b border-bone/10">
              5. Weitergabe von Daten
            </h2>
            <p className="mb-4">Wir geben Ihre personenbezogenen Daten in folgenden Fällen weiter:</p>
            <ul className="space-y-3">
              {[
                ["Shopify", "Unsere Website und unser Shop werden von Shopify gehostet. Shopify verarbeitet Daten gemäß seiner eigenen Datenschutzrichtlinie."],
                ["Dienstleister", "An Dritte, die Dienstleistungen in unserem Auftrag erbringen (z. B. Zahlungsabwicklung, Versanddienstleister, IT-Infrastruktur)"],
                ["Marketing-Partner", "Zur Bereitstellung von Werbedienstleistungen, soweit Sie eingewilligt haben"],
                ["Verbundene Unternehmen", "An Tochter- oder Schwestergesellschaften im Rahmen unserer Unternehmensgruppe"],
                ["Behörden", "Wenn gesetzlich vorgeschrieben oder zur Durchsetzung unserer Rechte erforderlich"],
                ["Unternehmenstransaktionen", "Im Zusammenhang mit Fusionen, Übernahmen oder dem Verkauf von Unternehmensteilen"],
              ].map(([title, desc]) => (
                <li key={title} className="flex gap-3">
                  <span className="text-tangerine mt-1 flex-shrink-0">✦</span>
                  <span><span className="text-bone/90 font-medium">{title}:</span> {desc}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl md:text-2xl font-display text-bone mb-5 pb-3 border-b border-bone/10">
              6. Internationale Datenübertragungen
            </h2>
            <p>
              Wir können Ihre personenbezogenen Daten außerhalb Ihres Landes übertragen, speichern und verarbeiten,
              insbesondere in Länder, in denen unsere Dienstleister ansässig sind. Bei Übertragungen aus dem
              Europäischen Wirtschaftsraum (EWR) oder dem Vereinigten Königreich stützen wir uns auf anerkannte
              Übertragungsmechanismen wie die Standardvertragsklauseln (SCC) der Europäischen Kommission oder
              gleichwertige Garantien.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl md:text-2xl font-display text-bone mb-5 pb-3 border-b border-bone/10">
              7. Datensicherheit und Speicherdauer
            </h2>
            <p className="mb-4">
              Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein, um Ihre personenbezogenen
              Daten vor unbefugtem Zugriff, Verlust oder Missbrauch zu schützen.
            </p>
            <p>
              Die Dauer der Speicherung hängt von verschiedenen Faktoren ab, z. B. ob wir die Daten zur
              Aufrechterhaltung Ihres Kontos benötigen, ob gesetzliche Aufbewahrungspflichten bestehen und
              ob die Daten zur Vertragserfüllung oder Streitbeilegung erforderlich sind. Nach Wegfall des
              Speicherzwecks werden die Daten gelöscht oder anonymisiert.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl md:text-2xl font-display text-bone mb-5 pb-3 border-b border-bone/10">
              8. Ihre Rechte
            </h2>
            <p className="mb-4">
              Sie haben nach der DSGVO und je nach Ihrem Wohnsitzland folgende Rechte:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                ["Auskunftsrecht", "Recht auf Auskunft über die von uns gespeicherten personenbezogenen Daten"],
                ["Berichtigungsrecht", "Recht auf Berichtigung unrichtiger oder unvollständiger Daten"],
                ["Löschungsrecht", "Recht auf Löschung Ihrer personenbezogenen Daten (\"Recht auf Vergessenwerden\")"],
                ["Einschränkung der Verarbeitung", "Recht auf Einschränkung der Verarbeitung unter bestimmten Voraussetzungen"],
                ["Datenübertragbarkeit", "Recht auf Erhalt Ihrer Daten in einem strukturierten, maschinenlesbaren Format"],
                ["Widerspruchsrecht", "Recht auf Widerspruch gegen die Verarbeitung Ihrer personenbezogenen Daten"],
                ["Widerruf der Einwilligung", "Recht auf jederzeitigen Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft"],
                ["Verwaltung von Kommunikationspräferenzen", "Abmeldung von Marketing-E-Mails jederzeit über den Abmeldelink oder Ihre Kontoeinstellungen"],
              ].map(([title, desc]) => (
                <li key={title} className="flex gap-3">
                  <span className="text-tangerine mt-1 flex-shrink-0">✦</span>
                  <span><span className="text-bone/90 font-medium">{title}:</span> {desc}</span>
                </li>
              ))}
            </ul>
            <div className="bg-bone/[0.04] border border-bone/10 rounded-xl p-5">
              <p className="text-bone/80 mb-2">Zur Ausübung Ihrer Rechte wenden Sie sich bitte an:</p>
              <a href="mailto:info@cocktail-x.com" className="text-tangerine hover:text-tangerine/80 transition-colors font-medium">
                info@cocktail-x.com
              </a>
              <p className="text-bone/50 text-sm mt-3">
                Sie können Ihre Rechte auch über das{" "}
                <a href="https://privacy.shopify.com/en" target="_blank" rel="noopener noreferrer" className="text-tangerine/80 hover:text-tangerine transition-colors underline underline-offset-4">
                  Shopify Privacy Portal
                </a>{" "}
                ausüben, soweit Shopify Daten als Verarbeiter hält.
              </p>
            </div>
            <p className="mt-4 text-bone/50 text-sm">
              Sie haben außerdem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren.
              Die zuständige Behörde in Bayern ist das{" "}
              <a href="https://www.lda.bayern.de" target="_blank" rel="noopener noreferrer" className="text-tangerine/80 hover:text-tangerine transition-colors underline underline-offset-4">
                Bayerische Landesamt für Datenschutzaufsicht (BayLDA)
              </a>
              .
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl md:text-2xl font-display text-bone mb-5 pb-3 border-b border-bone/10">
              9. Cookies und Tracking-Technologien
            </h2>
            <p className="mb-4">
              Wir verwenden Cookies und ähnliche Technologien, um unsere Dienste bereitzustellen, zu
              verbessern und zu personalisieren. Dazu gehören technisch notwendige Cookies sowie — mit
              Ihrer Einwilligung — Analyse- und Marketing-Cookies.
            </p>
            <p>
              Weitere Informationen sowie die Möglichkeit, Ihre Cookie-Einstellungen zu verwalten, finden
              Sie in unserer{" "}
              <Link href="./cookies" className="text-tangerine hover:text-tangerine/80 transition-colors underline underline-offset-4">
                Cookie-Richtlinie
              </Link>
              .
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl md:text-2xl font-display text-bone mb-5 pb-3 border-b border-bone/10">
              10. Minderjährige
            </h2>
            <p>
              Unsere Dienste richten sich ausschließlich an Personen ab 18 Jahren. Wir erheben wissentlich
              keine personenbezogenen Daten von Minderjährigen. Sollten Sie feststellen, dass ein
              Minderjähriger uns Daten übermittelt hat, kontaktieren Sie uns bitte umgehend unter{" "}
              <a href="mailto:info@cocktail-x.com" className="text-tangerine hover:text-tangerine/80 transition-colors">
                info@cocktail-x.com
              </a>
              , damit wir die Daten löschen können.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-xl md:text-2xl font-display text-bone mb-5 pb-3 border-b border-bone/10">
              11. Änderungen dieser Datenschutzerklärung
            </h2>
            <p>
              Wir können diese Datenschutzerklärung von Zeit zu Zeit aktualisieren, um Änderungen unserer
              Praktiken oder geltender Rechtsvorschriften zu berücksichtigen. Änderungen werden auf dieser
              Seite veröffentlicht und das Datum „Stand" wird entsprechend aktualisiert. Bei wesentlichen
              Änderungen werden wir Sie gegebenenfalls gesondert informieren.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-xl md:text-2xl font-display text-bone mb-5 pb-3 border-b border-bone/10">
              12. Kontakt
            </h2>
            <p className="mb-4">
              Bei Fragen zur Verarbeitung Ihrer personenbezogenen Daten oder zur Ausübung Ihrer Rechte
              wenden Sie sich bitte an uns:
            </p>
            <div className="bg-bone/[0.04] border border-bone/10 rounded-xl p-5 text-bone/80">
              bayundco GmbH (Cocktail X)<br />
              Türkenstraße 61 RGB<br />
              80799 München, Deutschland<br />
              <a href="mailto:info@cocktail-x.com" className="text-tangerine hover:text-tangerine/80 transition-colors">
                info@cocktail-x.com
              </a>
            </div>
          </section>

        </div>

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-bone/10">
          <Link href="." className="text-sm font-body text-bone/40 hover:text-bone/70 transition-colors">
            ← {("Zurück")}
          </Link>
        </div>

      </div>
    </main>
  );
}
