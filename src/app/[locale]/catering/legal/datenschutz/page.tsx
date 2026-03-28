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

export default function CateringDatenschutzPage() {
  const locale = useLocale() as "de" | "en";

  return (
    <main className="min-h-screen bg-ct-cream">
      {/* ── HEADER ── */}
      <section className="bg-licorice pt-40 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <RevealDiv>
            <p className="text-xs font-body font-bold uppercase tracking-[0.25em] text-ct-red mb-4">Legal</p>
            <h1 className="font-display text-5xl md:text-6xl text-ct-cream mb-3">
              {locale === "de" ? "Datenschutz" : "Privacy Policy"}
            </h1>
            <p className="text-xs font-body text-ct-cream/40">
              {locale === "de" ? "Stand: März 2026" : "As of: March 2026"}
            </p>
          </RevealDiv>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-3xl mx-auto space-y-10 font-body text-everglade/80 leading-relaxed">
          <RevealDiv>
            <h2 className="font-display text-2xl text-licorice mb-4 pb-2 border-b border-everglade/15">
              {locale === "de" ? "1. Datenschutz auf einen Blick" : "1. Privacy at a Glance"}
            </h2>
            <p className="text-everglade/60 text-sm">
              {locale === "de"
                ? "Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen."
                : "The following information gives a simple overview of what happens to your personal data when you visit this website."}
            </p>
          </RevealDiv>

          <RevealDiv delay={80}>
            <h2 className="font-display text-2xl text-licorice mb-4 pb-2 border-b border-everglade/15">
              {locale === "de" ? "2. Verantwortliche Stelle" : "2. Responsible Party"}
            </h2>
            <div className="bg-white/60 border border-everglade/10 rounded-xl p-5 space-y-1 text-sm">
              <p className="font-bold text-licorice">Cocktail X Catering / Bay und Co. GmbH</p>
              <p>München, Deutschland</p>
              <p>
                <a href="mailto:info@cocktail-x.com" className="text-ct-red hover:text-ct-red/70 transition-colors">
                  info@cocktail-x.com
                </a>
              </p>
            </div>
          </RevealDiv>

          <RevealDiv delay={160}>
            <h2 className="font-display text-2xl text-licorice mb-4 pb-2 border-b border-everglade/15">
              {locale === "de" ? "3. Datenerfassung auf dieser Website" : "3. Data Collection on This Website"}
            </h2>
            <h3 className="font-display text-lg text-licorice/90 mb-2">
              {locale === "de" ? "Kontaktformular" : "Contact Form"}
            </h3>
            <p className="text-everglade/60 text-sm mb-4">
              {locale === "de"
                ? "Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter."
                : "If you send us enquiries via the contact form, your details from the enquiry form, including the contact details you provide there, will be stored by us for the purpose of processing the enquiry and in case of follow-up questions. We do not share this data without your consent."}
            </p>
            <h3 className="font-display text-lg text-licorice/90 mb-2">
              {locale === "de" ? "Server-Log-Dateien" : "Server Log Files"}
            </h3>
            <p className="text-everglade/60 text-sm">
              {locale === "de"
                ? "Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt. Dies sind: Browsertyp und Browserversion, verwendetes Betriebssystem, Referrer URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage."
                : "The provider of the pages automatically collects and stores information in so-called server log files, which your browser automatically transmits to us. These are: browser type and version, operating system used, referrer URL, hostname of the accessing computer, time of the server request."}
            </p>
          </RevealDiv>

          <RevealDiv delay={240}>
            <h2 className="font-display text-2xl text-licorice mb-4 pb-2 border-b border-everglade/15">
              {locale === "de" ? "4. Cookies" : "4. Cookies"}
            </h2>
            <p className="text-everglade/60 text-sm">
              {locale === "de"
                ? "Diese Website verwendet Cookies. Cookies sind kleine Datenpakete und richten auf Ihrem Endgerät keinen Schaden an. Sie werden entweder vorübergehend für die Dauer einer Sitzung (Session-Cookies) oder dauerhaft (permanente Cookies) auf Ihrem Endgerät gespeichert."
                : "This website uses cookies. Cookies are small data packages and do not cause any damage to your device. They are stored either temporarily for the duration of a session (session cookies) or permanently (permanent cookies) on your device."}
            </p>
          </RevealDiv>

          <RevealDiv delay={320}>
            <h2 className="font-display text-2xl text-licorice mb-4 pb-2 border-b border-everglade/15">
              {locale === "de" ? "5. Ihre Rechte" : "5. Your Rights"}
            </h2>
            <p className="text-everglade/60 text-sm mb-3">
              {locale === "de"
                ? "Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen."
                : "You have the right at any time to receive free information about the origin, recipient and purpose of your stored personal data. You also have the right to request the correction or deletion of this data."}
            </p>
            <p className="text-everglade/60 text-sm">
              {locale === "de"
                ? "Wenden Sie sich hierfür an: "
                : "For this purpose, please contact: "}
              <a href="mailto:info@cocktail-x.com" className="text-ct-red hover:text-ct-red/70 transition-colors">
                info@cocktail-x.com
              </a>
            </p>
          </RevealDiv>

          <RevealDiv delay={400}>
            <h2 className="font-display text-2xl text-licorice mb-4 pb-2 border-b border-everglade/15">
              {locale === "de" ? "6. Beschwerderecht" : "6. Right to Lodge a Complaint"}
            </h2>
            <p className="text-everglade/60 text-sm">
              {locale === "de"
                ? "Sie haben das Recht, sich bei einer Aufsichtsbehörde zu beschweren. Zuständige Aufsichtsbehörde in Bayern ist das Bayerische Landesamt für Datenschutzaufsicht (BayLDA)."
                : "You have the right to lodge a complaint with a supervisory authority. The competent supervisory authority in Bavaria is the Bavarian State Office for Data Protection Supervision (BayLDA)."}
            </p>
            <div className="mt-3 bg-white/60 border border-everglade/10 rounded-xl p-4 text-sm">
              <p className="font-bold text-licorice/85">Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)</p>
              <a href="https://www.lda.bayern.de" target="_blank" rel="noopener noreferrer" className="text-ct-red hover:text-ct-red/70 transition-colors">
                www.lda.bayern.de
              </a>
            </div>
          </RevealDiv>
        </div>
      </section>
    </main>
  );
}
