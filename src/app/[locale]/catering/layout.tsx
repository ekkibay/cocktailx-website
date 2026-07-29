import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Cocktail X Eventcatering | Firmenevents & Messen München",
    template: "%s | Cocktail X Eventcatering München",
  },
  description:
    "Eventcatering für Firmenevents, Messen und Produktlaunches in München. Bar, Food, Personal und Eventmanagement aus einer Hand. 500+ Events, Richtpreis in 60 Sekunden.",
  keywords: [
    // Eventcatering als Anker, Cocktail-Begriffe bleiben als Long-Tail erhalten,
    // weil sie echtes Suchvolumen mit Kaufabsicht tragen.
    "Eventcatering München",
    "Event Catering München",
    "Messe Catering München",
    "Firmenevent Catering München",
    "Barcatering Firmenevent",
    "Mobile Bar München",
    "Corporate Event Bar",
    "Cocktail Catering München",
    "Messestand Catering",
    "Nitro Cocktails Event",
    "Eventcatering Firma München",
    "Cocktail X Eventcatering",
  ],
  openGraph: {
    title: "Cocktail X Eventcatering | Firmenevents & Messen München",
    description:
      "Bar, Food, Personal und Eventmanagement aus einer Hand. Von 20 bis 3.000 Gästen. 500+ Events in München und Umgebung.",
    url: "https://cocktail-x.com/de/catering",
    siteName: "Cocktail X Eventcatering",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cocktail X Eventcatering | Firmenevents & Messen München",
    description:
      "Bar, Food, Personal und Eventmanagement aus einer Hand. Von den Machern des Cocktail X Festivals.",
  },
  alternates: {
    canonical: "https://cocktail-x.com/de/catering",
    languages: {
      de: "https://cocktail-x.com/de/catering",
      en: "https://cocktail-x.com/en/catering",
    },
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CateringLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
