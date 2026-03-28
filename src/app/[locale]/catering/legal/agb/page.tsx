"use client";

import { useLocale } from "next-intl";

const sections = [
  {
    de: { title: "\u00a7 1 Geltungsbereich", text: "Diese Allgemeinen Gesch\u00e4ftsbedingungen (AGB) gelten f\u00fcr alle Vertr\u00e4ge zwischen der Bay und Co. GmbH (nachfolgend \u201eCocktail X Catering\u201c) und dem Auftraggeber \u00fcber die Erbringung von Catering-Dienstleistungen." },
    en: { title: "\u00a7 1 Scope", text: "These Terms and Conditions apply to all contracts between Bay und Co. GmbH (hereinafter \u2018Cocktail X Catering\u2019) and the client for the provision of catering services." },
  },
  {
    de: { title: "\u00a7 2 Vertragsschluss", text: "Ein Vertrag kommt durch die schriftliche Best\u00e4tigung des Angebots durch den Auftraggeber zustande. Angebote von Cocktail X Catering sind freibleibend und unverbindlich, sofern nicht ausdr\u00fccklich anders angegeben." },
    en: { title: "\u00a7 2 Contract Formation", text: "A contract is formed upon written confirmation of the offer by the client. Offers from Cocktail X Catering are non-binding unless expressly stated otherwise." },
  },
  {
    de: { title: "\u00a7 3 Leistungsumfang", text: "Der Umfang der Leistungen ergibt sich aus dem jeweiligen Angebot bzw. der Auftragsbestätigung. \u00c4nderungen des Leistungsumfangs bed\u00fcrfen der schriftlichen Vereinbarung beider Parteien." },
    en: { title: "\u00a7 3 Scope of Services", text: "The scope of services is defined by the respective offer or order confirmation. Changes to the scope of services require written agreement by both parties." },
  },
  {
    de: { title: "\u00a7 4 Preise & Zahlung", text: "Alle Preise verstehen sich netto zuz\u00fcglich der gesetzlichen Mehrwertsteuer. Eine Anzahlung von 50% ist bei Auftragsbest\u00e4tigung f\u00e4llig. Der Restbetrag ist innerhalb von 14 Tagen nach Veranstaltung zu begleichen." },
    en: { title: "\u00a7 4 Prices & Payment", text: "All prices are net plus statutory VAT. A deposit of 50% is due upon order confirmation. The remaining balance is payable within 14 days of the event." },
  },
  {
    de: { title: "\u00a7 5 Stornierung", text: "Bei Stornierung bis 30 Tage vor dem Event werden 25% des Auftragswertes berechnet. Bei Stornierung bis 14 Tage vorher 50%, danach 100% des vereinbarten Preises." },
    en: { title: "\u00a7 5 Cancellation", text: "Cancellation up to 30 days before the event incurs a charge of 25% of the order value. Up to 14 days before: 50%, thereafter: 100% of the agreed price." },
  },
  {
    de: { title: "\u00a7 6 Haftung", text: "Cocktail X Catering haftet nur f\u00fcr Sch\u00e4den, die auf vors\u00e4tzlichem oder grob fahrl\u00e4ssigem Verhalten beruhen. Die Haftung ist auf den Auftragswert begrenzt." },
    en: { title: "\u00a7 6 Liability", text: "Cocktail X Catering is only liable for damages caused by intentional or grossly negligent conduct. Liability is limited to the order value." },
  },
  {
    de: { title: "\u00a7 7 Schlussbestimmungen", text: "Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist M\u00fcnchen. Sollte eine Bestimmung dieser AGB unwirksam sein, bleibt die Wirksamkeit der \u00fcbrigen Bestimmungen unber\u00fchrt." },
    en: { title: "\u00a7 7 Final Provisions", text: "The law of the Federal Republic of Germany applies. Place of jurisdiction is Munich. If any provision of these terms is invalid, the validity of the remaining provisions remains unaffected." },
  },
];

export default function CateringAGBPage() {
  const locale = useLocale() as "de" | "en";

  return (
    <main className="min-h-screen bg-ct-cream">
      <div className="max-w-2xl mx-auto px-4 pt-40 pb-24">
        <p className="text-xs font-body font-bold uppercase tracking-[0.25em] text-everglade/50 mb-4">Legal</p>
        <h1 className="font-display text-5xl md:text-6xl text-licorice mb-12">
          {locale === "de" ? "AGB" : "TERMS & CONDITIONS"}
        </h1>

        <div className="space-y-10 font-body text-everglade/80 leading-relaxed">
          {sections.map((section, i) => {
            const s = locale === "de" ? section.de : section.en;
            return (
              <section key={i}>
                <h2 className="font-display text-2xl text-licorice mb-4 pb-2 border-b border-everglade/15">
                  {s.title}
                </h2>
                <p>{s.text}</p>
              </section>
            );
          })}

          <section className="pt-4 border-t border-everglade/10">
            <p className="text-sm text-everglade/50">
              {locale === "de"
                ? "Stand: M\u00e4rz 2026 \u00b7 Bay und Co. GmbH \u00b7 M\u00fcnchen"
                : "Last updated: March 2026 \u00b7 Bay und Co. GmbH \u00b7 Munich"}
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
