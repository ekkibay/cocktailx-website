export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  url: string;
  tier: "platinum" | "gold" | "silver";
  displayH: number;
  displayW: number;
}

export const sponsors: Sponsor[] = [
  { id: "diageo", name: "Diageo", logo: "/images/sponsors-opt/diageo-new-v3.webp", url: "https://www.diageo.com", tier: "platinum", displayH: 76, displayW: 354 },
  { id: "talisker", name: "Talisker", logo: "/images/sponsors-opt/talisker-v3.webp", url: "https://www.malts.com/en-gb/distilleries/talisker", tier: "gold", displayH: 78, displayW: 382 },
  { id: "maison-routin", name: "Maison Routin", logo: "/images/sponsors-opt/maison-routin-v3.webp", url: "https://www.maison-routin.com", tier: "silver", displayH: 78, displayW: 70 },
  { id: "tanqueray", name: "Tanqueray", logo: "/images/sponsors-opt/tanqueray-v3.webp", url: "https://www.tanqueray.com", tier: "platinum", displayH: 76, displayW: 325 },
  { id: "planteray", name: "Planteray", logo: "/images/sponsors-opt/planteray-v3.webp", url: "https://www.planterayrum.com", tier: "gold", displayH: 73, displayW: 113 },
  { id: "hendricks", name: "Hendrick's Gin", logo: "/images/sponsors-opt/hendricks-v3.webp", url: "https://www.hendricksgin.com", tier: "platinum", displayH: 76, displayW: 324 },
  { id: "storck-club", name: "Storck Club", logo: "/images/sponsors-opt/storck-club-v3.webp", url: "#", tier: "silver", displayH: 76, displayW: 59 },
  { id: "monkey-shoulder", name: "Monkey Shoulder", logo: "/images/sponsors-opt/monkey-shoulder-v3.webp", url: "https://www.monkeyshoulder.com", tier: "gold", displayH: 76, displayW: 260 },
  { id: "brlo", name: "BRLO", logo: "/images/sponsors-opt/brlo-v3.webp", url: "https://www.brlo.de", tier: "silver", displayH: 76, displayW: 178 },
  { id: "le-freak", name: "Le Freak", logo: "/images/sponsors-opt/le-freak-v3.webp", url: "#", tier: "silver", displayH: 77, displayW: 282 },
  { id: "koegler", name: "Koegler", logo: "/images/sponsors-opt/koegler-v3.webp", url: "#", tier: "silver", displayH: 78, displayW: 98 },
  { id: "ron-zacapa", name: "Ron Zacapa", logo: "/images/sponsors-opt/ron-zacapa-v3.webp", url: "https://www.ronzacapa.com", tier: "gold", displayH: 76, displayW: 268 },
  { id: "licellino", name: "Licellino", logo: "/images/sponsors-opt/licellino-v3.webp", url: "#", tier: "silver", displayH: 75, displayW: 107 },
  { id: "scaramanga", name: "Scaramanga", logo: "/images/sponsors-opt/scaramanga-v3.webp", url: "#", tier: "silver", displayH: 55, displayW: 400 },
  { id: "marquis-de-montesquiou", name: "Marquis de Montesquiou", logo: "/images/sponsors-opt/marquis-de-montesquiou-v3.webp", url: "#", tier: "silver", displayH: 77, displayW: 77 },
  { id: "hydro-lion", name: "Hydro Lion", logo: "/images/sponsors-opt/hydro-lion-v3.webp", url: "#", tier: "silver", displayH: 77, displayW: 348 },
  { id: "horse-with-no-name", name: "Horse With No Name", logo: "/images/sponsors-opt/horse-with-no-name-v3.webp", url: "#", tier: "silver", displayH: 76, displayW: 76 },
  { id: "rising-brands", name: "Rising Brands", logo: "/images/sponsors-opt/rising-brands-v3.webp", url: "#", tier: "silver", displayH: 64, displayW: 390 },
  { id: "kota-pandan", name: "Kota Pandan", logo: "/images/sponsors-opt/kota-pandan-v3.webp", url: "#", tier: "silver", displayH: 75, displayW: 64 },
  { id: "rum-malecon", name: "Rum Malecon", logo: "/images/sponsors-opt/rum-malecon-v3.webp", url: "#", tier: "silver", displayH: 76, displayW: 158 },
  { id: "johnnie-walker", name: "Johnnie Walker", logo: "/images/sponsors-opt/johnnie-walker-v3.webp", url: "https://www.johnniewalker.com", tier: "platinum", displayH: 77, displayW: 147 },
  { id: "azzurino", name: "Azzurino", logo: "/images/sponsors-opt/azzurino-v3.webp", url: "#", tier: "silver", displayH: 76, displayW: 170 },
  { id: "ketel-one", name: "Ketel One Vodka", logo: "/images/sponsors-opt/ketel-one-v3.webp", url: "https://www.ketelone.com", tier: "platinum", displayH: 76, displayW: 158 },
  { id: "ferrand", name: "Ferrand", logo: "/images/sponsors-opt/ferrand-v3.webp", url: "https://www.ferrands.com", tier: "gold", displayH: 62, displayW: 189 },
  { id: "san-cosme", name: "San Cosme", logo: "/images/sponsors-opt/san-cosme-v3.webp", url: "#", tier: "silver", displayH: 77, displayW: 106 },
  { id: "belsazar", name: "Belsazar", logo: "/images/sponsors-opt/belsazar-v3.webp", url: "https://www.belsazar.com", tier: "gold", displayH: 76, displayW: 134 },
  { id: "bergkristall", name: "Bergkristall", logo: "/images/sponsors-opt/bergkristall-v3.webp", url: "#", tier: "silver", displayH: 2036, displayW: 8158 },
  { id: "rauch", name: "Rauch", logo: "/images/sponsors-opt/rauch-v3.webp", url: "https://www.rauch.cc", tier: "platinum", displayH: 72, displayW: 796 },
  { id: "don-julio", name: "Don Julio", logo: "/images/sponsors-opt/don-julio-v3.webp", url: "https://www.donjulio.com", tier: "gold", displayH: 128, displayW: 424 },
  { id: "dionys", name: "Dionys", logo: "/images/sponsors-opt/dionys-v3.webp", url: "#", tier: "silver", displayH: 128, displayW: 743 },
  { id: "evoila", name: "EvoilA", logo: "/images/sponsors-opt/evoila-v3.webp", url: "#", tier: "silver", displayH: 57, displayW: 52 },
  { id: "maison-acme", name: "Maison ACME", logo: "/images/sponsors-opt/maison-acme-v3.webp", url: "#", tier: "silver", displayH: 128, displayW: 270 },
  { id: "nbm", name: "NBM", logo: "/images/sponsors-opt/nbm-v3.webp", url: "#", tier: "silver", displayH: 128, displayW: 111 },
];

export interface PressLogo {
  id: string;
  name: string;
  logo: string;
}

export const pressLogos: PressLogo[] = [
  { id: "sueddeutsche", name: "Süddeutsche Zeitung", logo: "/images/press/sueddeutsche.webp" },
  { id: "ard", name: "ARD", logo: "/images/press/ard.webp" },
  { id: "mit-vergnuegen", name: "Mit Vergnügen", logo: "/images/press/mit-vergnuegen.webp" },
  { id: "az", name: "Abendzeitung München", logo: "/images/press/az.webp" },
  { id: "kaefer", name: "Käfer die Zeitung", logo: "/images/press/kaefer.webp" },
];
