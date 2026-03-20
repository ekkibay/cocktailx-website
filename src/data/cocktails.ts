export interface Cocktail {
  id: string;
  name: string;
  bar: string;
  barId: string;
  description: {
    de: string;
    en: string;
  };
  image: string;
  accentColor: string;
}

export const cocktails: Cocktail[] = [
  {
    id: "golden-munich-mule",
    name: "Golden Munich Mule",
    bar: "Goldene Bar",
    barId: "goldene-bar",
    description: {
      de: "Ein erfrischender Twist auf den Moscow Mule mit bayerischem Ingwerbier und Blattgold.",
      en: "A refreshing twist on the Moscow Mule with Bavarian ginger beer and gold leaf.",
    },
    image: "/images/placeholder/cocktail-1.svg",
    accentColor: "#D4A843",
  },
  {
    id: "schumann-s-negroni",
    name: "Schumann\u2019s Negroni",
    bar: "Schumann\u2019s Bar",
    barId: "schumann-s",
    description: {
      de: "Der Klassiker in Perfektion \u2013 nach Charles Schumanns pers\u00f6nlichem Rezept.",
      en: "The classic perfected \u2013 according to Charles Schumann\u2019s personal recipe.",
    },
    image: "/images/placeholder/cocktail-2.svg",
    accentColor: "#C1440E",
  },
  {
    id: "zephyr-sour",
    name: "Zephyr Sour",
    bar: "Zephyr Bar",
    barId: "zephyr-bar",
    description: {
      de: "Saisonaler Whiskey Sour mit hausgemachtem Lavendelsirup und Zitrus.",
      en: "Seasonal whiskey sour with homemade lavender syrup and citrus.",
    },
    image: "/images/placeholder/cocktail-3.svg",
    accentColor: "#7B6BA0",
  },
];
