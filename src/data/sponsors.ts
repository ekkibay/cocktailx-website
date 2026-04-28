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
  { id: "diageo", name: "Diageo", logo: "/images/sponsors-opt/diageo-new.webp", url: "https://www.diageo.com", tier: "platinum", displayH: 38, displayW: 177 },
  { id: "talisker", name: "Talisker", logo: "/images/sponsors-opt/talisker.webp", url: "https://www.malts.com/en-gb/distilleries/talisker", tier: "gold", displayH: 228, displayW: 228 },
  { id: "maison-routin", name: "Maison Routin", logo: "/images/sponsors-opt/maison-routin.webp", url: "https://www.maison-routin.com", tier: "silver", displayH: 100, displayW: 100 },
  { id: "tanqueray", name: "Tanqueray", logo: "/images/sponsors-opt/tanqueray.webp", url: "https://www.tanqueray.com", tier: "platinum", displayH: 213, displayW: 213 },
  { id: "planteray", name: "Planteray", logo: "/images/sponsors-opt/planteray.webp", url: "https://www.planterayrum.com", tier: "gold", displayH: 100, displayW: 100 },
  { id: "hendricks", name: "Hendrick's Gin", logo: "/images/sponsors-opt/hendricks.webp", url: "https://www.hendricksgin.com", tier: "platinum", displayH: 183, displayW: 183 },
  { id: "storck-club", name: "Storck Club", logo: "/images/sponsors-opt/storck-club.webp", url: "#", tier: "silver", displayH: 100, displayW: 100 },
  { id: "monkey-shoulder", name: "Monkey Shoulder", logo: "/images/sponsors-opt/monkey-shoulder.webp", url: "https://www.monkeyshoulder.com", tier: "gold", displayH: 143, displayW: 143 },
  { id: "brlo", name: "BRLO", logo: "/images/sponsors-opt/brlo.webp", url: "https://www.brlo.de", tier: "silver", displayH: 50, displayW: 118 },
  { id: "le-freak", name: "Le Freak", logo: "/images/sponsors-opt/le-freak.webp", url: "#", tier: "silver", displayH: 184, displayW: 184 },
  { id: "koegler", name: "Koegler", logo: "/images/sponsors-opt/koegler.webp", url: "#", tier: "silver", displayH: 100, displayW: 100 },
  { id: "ron-zacapa", name: "Ron Zacapa", logo: "/images/sponsors-opt/ron-zacapa.webp", url: "https://www.ronzacapa.com", tier: "gold", displayH: 156, displayW: 156 },
  { id: "licellino", name: "Licellino", logo: "/images/sponsors-opt/licellino.webp", url: "#", tier: "silver", displayH: 100, displayW: 100 },
  { id: "scaramanga", name: "Scaramanga", logo: "/images/sponsors-opt/scaramanga.webp", url: "#", tier: "silver", displayH: 240, displayW: 240 },
  { id: "marquis-de-montesquiou", name: "Marquis de Montesquiou", logo: "/images/sponsors-opt/marquis-de-montesquiou.webp", url: "#", tier: "silver", displayH: 100, displayW: 100 },
  { id: "hydro-lion", name: "Hydro Lion", logo: "/images/sponsors-opt/hydro-lion.webp", url: "#", tier: "silver", displayH: 199, displayW: 199 },
  { id: "horse-with-no-name", name: "Horse With No Name", logo: "/images/sponsors-opt/horse-with-no-name.webp", url: "#", tier: "silver", displayH: 100, displayW: 100 },
  { id: "rising-brands", name: "Rising Brands", logo: "/images/sponsors-opt/rising-brands.webp", url: "#", tier: "silver", displayH: 240, displayW: 240 },
  { id: "kota-pandan", name: "Kota Pandan", logo: "/images/sponsors-opt/kota-pandan.webp", url: "#", tier: "silver", displayH: 100, displayW: 100 },
  { id: "rum-malecon", name: "Rum Malecon", logo: "/images/sponsors-opt/rum-malecon.webp", url: "#", tier: "silver", displayH: 103, displayW: 103 },
  { id: "johnnie-walker", name: "Johnnie Walker", logo: "/images/sponsors-opt/johnnie-walker.webp", url: "https://www.johnniewalker.com", tier: "platinum", displayH: 100, displayW: 100 },
  { id: "azzurino", name: "Azzurino", logo: "/images/sponsors-opt/azzurino.webp", url: "#", tier: "silver", displayH: 109, displayW: 109 },
  { id: "ketel-one", name: "Ketel One Vodka", logo: "/images/sponsors-opt/ketel-one.webp", url: "https://www.ketelone.com", tier: "platinum", displayH: 100, displayW: 100 },
  { id: "ferrand", name: "Ferrand", logo: "/images/sponsors-opt/ferrand.webp", url: "https://www.ferrands.com", tier: "gold", displayH: 109, displayW: 109 },
  { id: "san-cosme", name: "San Cosme", logo: "/images/sponsors-opt/san-cosme.webp", url: "#", tier: "silver", displayH: 100, displayW: 100 },
  { id: "belsazar", name: "Belsazar", logo: "/images/sponsors-opt/belsazar.webp", url: "https://www.belsazar.com", tier: "gold", displayH: 100, displayW: 100 },
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
