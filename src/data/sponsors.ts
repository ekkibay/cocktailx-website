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
    logo: "/images/placeholder/sponsor-1.svg",
    url: "https://www.diageo.com",
    tier: "platinum",
  },
  {
    id: "olymp",
    name: "Olymp",
    logo: "/images/placeholder/sponsor-2.svg",
    url: "https://www.olymp.com",
    tier: "platinum",
  },
  {
    id: "lucid-motors",
    name: "Lucid Motors",
    logo: "/images/placeholder/sponsor-3.svg",
    url: "https://www.lucidmotors.com",
    tier: "gold",
  },
  {
    id: "campari",
    name: "Campari",
    logo: "/images/placeholder/sponsor-4.svg",
    url: "https://www.campari.com",
    tier: "gold",
  },
  {
    id: "studio-vom-berg",
    name: "Studio vom Berg",
    logo: "/images/placeholder/sponsor-5.svg",
    url: "https://www.studiovomberg.com",
    tier: "silver",
  },
];
