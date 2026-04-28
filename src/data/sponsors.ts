export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  url: string;
  tier: "platinum" | "gold" | "silver";
}

export const sponsors: Sponsor[] = [
  {
    id: "diageo",
    name: "Diageo",
    logo: "/images/sponsors/diageo-new.png",
    url: "https://www.diageo.com",
    tier: "platinum",
  },
  {
    id: "johnnie-walker",
    name: "Johnnie Walker",
    logo: "/images/sponsors/johnnie-walker.webp",
    url: "https://www.johnniewalker.com",
    tier: "platinum",
  },
  {
    id: "hendricks",
    name: "Hendrick's Gin",
    logo: "/images/sponsors/hendricks.webp",
    url: "https://www.hendricksgin.com",
    tier: "platinum",
  },
  {
    id: "tanqueray",
    name: "Tanqueray",
    logo: "/images/sponsors/tanqueray.webp",
    url: "https://www.tanqueray.com",
    tier: "platinum",
  },
  {
    id: "ketel-one",
    name: "Ketel One Vodka",
    logo: "/images/sponsors/ketel-one.webp",
    url: "https://www.ketelone.com",
    tier: "platinum",
  },
  {
    id: "talisker",
    name: "Talisker",
    logo: "/images/sponsors/talisker.webp",
    url: "https://www.malts.com/en-gb/distilleries/talisker",
    tier: "gold",
  },
  {
    id: "monkey-shoulder",
    name: "Monkey Shoulder",
    logo: "/images/sponsors/monkey-shoulder.webp",
    url: "https://www.monkeyshoulder.com",
    tier: "gold",
  },
  {
    id: "belsazar",
    name: "Belsazar",
    logo: "/images/sponsors/belsazar.webp",
    url: "https://www.belsazar.com",
    tier: "gold",
  },
  {
    id: "ferrand",
    name: "Ferrand",
    logo: "/images/sponsors/ferrand.webp",
    url: "https://www.ferrands.com",
    tier: "gold",
  },
  {
    id: "planteray",
    name: "Planteray",
    logo: "/images/sponsors/planteray.webp",
    url: "https://www.planterayrum.com",
    tier: "gold",
  },
  {
    id: "ron-zacapa",
    name: "Ron Zacapa",
    logo: "/images/sponsors/ron-zacapa.webp",
    url: "https://www.ronzacapa.com",
    tier: "gold",
  },
  {
    id: "rum-malecon",
    name: "Rum Malecon",
    logo: "/images/sponsors/rum-malecon.webp",
    url: "#",
    tier: "silver",
  },
  {
    id: "maison-routin",
    name: "Maison Routin",
    logo: "/images/sponsors/maison-routin.webp",
    url: "https://www.maison-routin.com",
    tier: "silver",
  },
  {
    id: "marquis-de-montesquiou",
    name: "Marquis de Montesquiou",
    logo: "/images/sponsors/marquis-de-montesquiou.webp",
    url: "#",
    tier: "silver",
  },
  {
    id: "san-cosme",
    name: "San Cosme",
    logo: "/images/sponsors/san-cosme.webp",
    url: "#",
    tier: "silver",
  },
  {
    id: "horse-with-no-name",
    name: "Horse With No Name",
    logo: "/images/sponsors/horse-with-no-name.webp",
    url: "#",
    tier: "silver",
  },
  {
    id: "hydro-lion",
    name: "Hydro Lion",
    logo: "/images/sponsors/hydro-lion.webp",
    url: "#",
    tier: "silver",
  },
  {
    id: "koegler",
    name: "Koegler",
    logo: "/images/sponsors/koegler.webp",
    url: "#",
    tier: "silver",
  },
  {
    id: "kota-pandan",
    name: "Kota Pandan",
    logo: "/images/sponsors/kota-pandan.webp",
    url: "#",
    tier: "silver",
  },
  {
    id: "le-freak",
    name: "Le Freak",
    logo: "/images/sponsors/le-freak.webp",
    url: "#",
    tier: "silver",
  },
  {
    id: "scaramanga",
    name: "Scaramanga",
    logo: "/images/sponsors/scaramanga.webp",
    url: "#",
    tier: "silver",
  },
  {
    id: "storck-club",
    name: "Storck Club",
    logo: "/images/sponsors/storck-club.webp",
    url: "#",
    tier: "silver",
  },
  {
    id: "brlo",
    name: "BRLO",
    logo: "/images/sponsors/brlo.png",
    url: "https://www.brlo.de",
    tier: "silver",
  },
  {
    id: "azzurino",
    name: "Azzurino",
    logo: "/images/sponsors/azzurino.webp",
    url: "#",
    tier: "silver",
  },
  {
    id: "licellino",
    name: "Licellino",
    logo: "/images/sponsors/licellino.webp",
    url: "#",
    tier: "silver",
  },
  {
    id: "rising-brands",
    name: "Rising Brands",
    logo: "/images/sponsors/rising-brands.webp",
    url: "#",
    tier: "silver",
  },
];

export interface PressLogo {
  id: string;
  name: string;
  logo: string;
}

export const pressLogos: PressLogo[] = [
  {
    id: "sueddeutsche",
    name: "Süddeutsche Zeitung",
    logo: "/images/press/sueddeutsche.webp",
  },
  {
    id: "ard",
    name: "ARD",
    logo: "/images/press/ard.webp",
  },
  {
    id: "mit-vergnuegen",
    name: "Mit Vergnügen",
    logo: "/images/press/mit-vergnuegen.webp",
  },
  {
    id: "az",
    name: "Abendzeitung München",
    logo: "/images/press/az.webp",
  },
  {
    id: "kaefer",
    name: "Käfer die Zeitung",
    logo: "/images/press/kaefer.webp",
  },
];
