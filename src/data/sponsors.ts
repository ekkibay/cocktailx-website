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
    name: "Diageo Germany",
    logo: "/images/sponsors/diageo.webp",
    url: "https://www.diageo.com",
    tier: "platinum",
  },
  {
    id: "campari",
    name: "Campari",
    logo: "/images/sponsors/campari.webp",
    url: "https://www.campari.com",
    tier: "platinum",
  },
  {
    id: "olymp",
    name: "OLYMP",
    logo: "/images/sponsors/olymp.webp",
    url: "https://www.olymp.com",
    tier: "gold",
  },
  {
    id: "lucid-motors",
    name: "Lucid Motors",
    logo: "/images/sponsors/lucid-motors.webp",
    url: "https://www.lucidmotors.com",
    tier: "gold",
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
