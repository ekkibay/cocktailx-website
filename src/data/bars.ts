export interface Bar {
  id: string;
  name: string;
  district: string;
  address: string;
  signatureCocktail: string;
  image: string;
  description: {
    de: string;
    en: string;
  };
}

export const districts = [
  "Altstadt-Lehel",
  "Maxvorstadt",
  "Schwabing",
  "Glockenbachviertel",
  "Haidhausen",
  "Sendling",
];

export const bars: Bar[] = [
  {
    id: "goldene-bar",
    name: "Goldene Bar",
    district: "Altstadt-Lehel",
    address: "Prinzregentenstra\u00dfe 1, 80538 M\u00fcnchen",
    signatureCocktail: "Golden Munich Mule",
    image: "/images/placeholder/bar-1.svg",
    description: {
      de: "Elegante Bar im Haus der Kunst mit erstklassigen Cocktails und glamour\u00f6sem Ambiente.",
      en: "Elegant bar in the Haus der Kunst with first-class cocktails and glamorous ambiance.",
    },
  },
  {
    id: "schumann-s",
    name: "Schumann\u2019s Bar",
    district: "Maxvorstadt",
    address: "Odeonsplatz 6, 80539 M\u00fcnchen",
    signatureCocktail: "Schumann\u2019s Negroni",
    image: "/images/placeholder/bar-2.svg",
    description: {
      de: "Legendäre Cocktailbar am Odeonsplatz \u2013 eine M\u00fcnchner Institution seit 1982.",
      en: "Legendary cocktail bar at Odeonsplatz \u2013 a Munich institution since 1982.",
    },
  },
  {
    id: "zephyr-bar",
    name: "Zephyr Bar",
    district: "Glockenbachviertel",
    address: "Baaderstra\u00dfe 68, 80469 M\u00fcnchen",
    signatureCocktail: "Zephyr Sour",
    image: "/images/placeholder/bar-3.svg",
    description: {
      de: "Kreative Cocktailbar im Glockenbachviertel mit saisonalen Eigenkreationen.",
      en: "Creative cocktail bar in the Glockenbachviertel with seasonal house creations.",
    },
  },
  {
    id: "pusser-s",
    name: "Pusser\u2019s",
    district: "Altstadt-Lehel",
    address: "Falkenturmstra\u00dfe 9, 80331 M\u00fcnchen",
    signatureCocktail: "Painkiller",
    image: "/images/placeholder/bar-4.svg",
    description: {
      de: "Karibisches Flair mitten in M\u00fcnchen \u2013 bekannt f\u00fcr Rum-Cocktails und gute Laune.",
      en: "Caribbean flair in the heart of Munich \u2013 known for rum cocktails and good vibes.",
    },
  },
  {
    id: "hearts",
    name: "HEARTS",
    district: "Altstadt-Lehel",
    address: "Maximiliansplatz 5, 80333 M\u00fcnchen",
    signatureCocktail: "Heart Beat",
    image: "/images/placeholder/bar-5.svg",
    description: {
      de: "Stilvolle Rooftop-Bar mit atemberaubendem Blick \u00fcber die M\u00fcnchner Altstadt.",
      en: "Stylish rooftop bar with a breathtaking view over Munich\u2019s old town.",
    },
  },
  {
    id: "salon-rouge",
    name: "Salon Rouge",
    district: "Schwabing",
    address: "Leopoldstra\u00dfe 28, 80802 M\u00fcnchen",
    signatureCocktail: "Rouge Martini",
    image: "/images/placeholder/bar-6.svg",
    description: {
      de: "Gem\u00fctliche Bar in Schwabing mit klassischen Cocktails und entspannter Atmosph\u00e4re.",
      en: "Cozy bar in Schwabing with classic cocktails and a relaxed atmosphere.",
    },
  },
];
