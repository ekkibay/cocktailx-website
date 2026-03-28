"use client";

import { useLocale } from "next-intl";

export default function CateringDatenschutzPage() {
  const locale = useLocale() as "de" | "en";

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#000000" }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(/images/pattern-3.png)", backgroundSize: "180px 180px", backgroundRepeat: "repeat" }} />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 pt-40 pb-24">
        <p className="text-xs font-body font-bold uppercase tracking-[0.25em] text-ct-green mb-4">Legal</p>
        <h1 className="font-display text-5xl md:text-6xl text-ct-cream mb-4">
          {locale === "de" ? "DATENSCHUTZ" : "PRIVACY POLICY"}
        </h1>
        <p className="text-xs font-body text-ct-cream/40 mb-12">
          {locale === "de" ? "Stand: März 2026" : "As of: March 2026"}
        </p>

        <div className="space-y-10 font-body text-ct-cream/80 leading-relaxed">
          <section>
            <h2 className="font-display text-2xl text-ct-cream mb-4 pb-2 border-b border-ct-green/20">
              {locale === "de" ? "1. Datenschutz auf einen Blick" : "1. Privacy at a Glance"}
            </h2>
            <p className="text-ct-cream/65 text-sm mb-3">
              {locale === "de"
                ? "Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen."
                : "The following information gives a simple overview of what happens to your personal data when you visit this website."}
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ct-cream mb-4 pb-2 border-b border-ct-green/20">
              {locale === "de" ? "2. Verantwortliche Stelle" : "2. Responsible Party"}
            </h2>
            <div className="bg-ct-green/[0.04] border border-ct-green/15 rounded-xl p-5 space-y-1 text-sm">
              <p className="font-bold text-ct-cream">Cocktail X Catering / Bay und Co. GmbH</p>
              <p>München, Deutschland</p>
              <p>
                <a href="mailto:catering@cocktail-x.com" className="text-ct-green hover:text-ct-green/80 transition-colors">
                  catering@cocktail-x.com
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ct-cream mb-4 pb-2 border-b border-ct-green/20">
              {locale === "de" ? "3. Datenerfassung auf dieser Website" : "3. Data Collection on This Website"}
            </h2>
            <h3 className="font-display text-lg text-ct-cream/90 mb-2">
              {locale === "de" ? "Kontaktformular" : "Contact Form"}
            </h3>
            <p className="text-ct-cream/65 text-sm mb-4">
              {locale === "de"
                ? "Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter."
                : "If you send us enquiries via the contact form, your details from the enquiry form, including the contact details you provide there, will be stored by us for the purpose of processing the enquiry and in case of follow-up questions. We do not share this data without your consent."}
            </p>
            <h3 className="font-display text-lg text-ct-cream/90 mb-2">
              {locale === "de" ? "Server-Log-Dateien" : "Server Log Files"}
            </h3>
            <p className="text-ct-cream/65 text-sm">
              {locale === "de"
                ? "Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind: Browsertyp und Browserversion, verwendetes Betriebssystem, Referrer URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage."
                : "The provider of the pages automatically collects and stores information in so-called server log files, which your browser automatically transmits to us. These are: browser type and version, operating system used, referrer URL, hostname of the accessing computer, time of the server request."}
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ct-cream mb-4 pb-2 border-b border-ct-green/20">
              {locale === "de" ? "4. Cookies" : "4. Cookies"}
            </h2>
            <p className="text-ct-cream/65 text-sm">
              {locale === "de"
                ? "Diese Website verwendet Cookies. Cookies sind kleine Datenpakete und richten auf Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend für die Dauer einer Sitzung (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem Endgerät gespeichert."
                : "This website uses cookies. Cookies are small data packages and do not cause any damage to your device. They are stored either temporarily for the duration of a session (session cookies) or permanently (permanent cookies) on your device."}
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ct-cream mb-4 pb-2 border-b border-ct-green/20">
              {locale === "de" ? "5. Ihre Rechte" : "5. Your Rights"}
            </h2>
            <p className="text-ct-cream/65 text-sm mb-3">
              {locale === "de"
                ? "Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen."
                : "You have the right at any time to receive free information about the origin, recipient and purpose of your stored personal data. You also have the right to request the correction or deletion of this data."}
            </p>
            <p className="text-ct-cream/65 text-sm">
              {locale === "de"
                ? "Wenden Sie sich hierfür an: "
                : "For this purpose, please contact: "}
              <a href="mailto:catering@cocktail-x.com" className="text-ct-green hover:text-ct-green/80 transition-colors">
                catering@cocktail-x.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ct-cream mb-4 pb-2 border-b border-ct-green/20">
              {locale === "de" ? "6. Beschwerderecht" : "6. Right to Lodge a Complaint"}
            </h2>
            <p className="text-ct-cream/65 text-sm">
              {locale === "de"
                ? "Sie haben das Recht, sich bei einer Aufsichtsbehörde zu beschweren. Zuständige Aufsichtsbehörde in Bayern ist das Bayerische Landesamt für Datenschutzaufsicht (BayLDA)."
                : "You have the right to lodge a complaint with a supervisory authority. The competent supervisory authority in Bavaria is the Bavarian State Office for Data Protection Supervision (BayLDA)."}
            </p>
            <div className="mt-3 bg-ct-green/[0.04] border border-ct-green/15 rounded-xl p-4 text-sm">
              <p className="font-bold text-ct-cream/85">Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)</p>
              <a href="https://www.lda.bayern.de" target="_blank" rel="noopener noreferrer" className="text-ct-green hover:text-ct-green/80 transition-colors">
                www.lda.bayern.de
              </a>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
