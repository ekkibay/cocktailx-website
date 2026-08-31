import type { Metadata } from "next";

/**
 * Die Beschreibung stand noch im Sommer und nannte "Festival" und "Passport",
 * also genau die Woerter, die auf der Seite selbst getilgt wurden. Ein
 * Meta-Tag ist die einzige Stelle, die man beim Umschreiben einer Seite
 * zuverlaessig vergisst, und die einzige, die in jedem Suchergebnis steht.
 */
export const metadata: Metadata = {
  title: "Die App",
  description:
    "Die Cocktail X App ist dein Pass für ON ICE. Teilnehmende Bars, Signature Drinks und dein Stempelpass, direkt im Browser, ohne Installation.",
  openGraph: {
    title: "Die Cocktail X App | COCKTAIL X ON ICE '26",
    description:
      "Dein Pass, die teilnehmenden Bars und dein Stempelpass. Läuft im Browser, nichts zu installieren.",
    type: "website",
  },
};

/**
 * Die Seite zeigt den jeweils gueltigen Passpreis. Ohne diese Zeile wird sie
 * beim Bauen vorgerendert und liefert nach dem 16. Oktober weiter den
 * Einstiegspreis aus, im Mockup und im Kauf-Link. Route Segment Config muss
 * aus einer Serverkomponente kommen, deshalb steht sie hier und nicht in der
 * Seite, die "use client" ist.
 */
export const dynamic = "force-dynamic";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return children;
}
