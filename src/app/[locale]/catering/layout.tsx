import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Cocktail X Catering | Premium Cocktail Catering München",
    template: "%s | Cocktail X Catering München",
  },
  description:
    "Premium Cocktail Catering für Corporate Events & Messen in München. Nitro-Technologie, 500+ Events, Angebot in 24h. Von den Machern des Cocktail X Festivals.",
  keywords: [
    "Cocktail Catering München",
    "Messe Catering München",
    "Corporate Event Bar",
    "Mobile Bar München",
    "Cocktail Catering Firma",
    "Event Catering München",
    "Firmenfeier Cocktails",
    "Messestand Cocktails",
    "Nitro Cocktails Event",
    "Premium Bar Service München",
    "Cocktail X Catering",
  ],
  openGraph: {
    title: "Cocktail X Catering | Premium Cocktail Catering München",
    description:
      "Corporate Events & Messen — professionell, zuverlässig, unvergesslich. 500+ Events, Nitro-Technologie, Angebot in 24h.",
    url: "https://cocktail-x.com/de/catering",
    siteName: "Cocktail X Catering",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cocktail X Catering | Premium Cocktail Catering München",
    description:
      "Corporate Events & Messen — professionell, zuverlässig, unvergesslich. Von den Machern des Cocktail X Festivals.",
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
