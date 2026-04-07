export interface FestivalEvent {
  id: string;
  title: {
    de: string;
    en: string;
  };
  date: string;
  dateEnd?: string;
  time: string;
  timeEnd?: string;
  location: string;
  description: {
    de: string;
    en: string;
  };
  image: string;
  type: "opening" | "festival" | "closing";
  featured?: boolean;
  program?: { de: string; en: string }[];
  tickets?: {
    label: { de: string; en: string };
    price: number;
    note?: { de: string; en: string };
    badge?: string;
  }[];
  ticketSaleStart?: string; // ISO date
  capacity?: number;
  vibe?: { de: string; en: string };
}

export const events: FestivalEvent[] = [
  {
    id: "opening-party",
    title: {
      de: "Cocktail X Opening 2026",
      en: "Cocktail X Opening 2026",
    },
    date: "2026-05-14",
    time: "14:00",
    timeEnd: "18:00",
    location: "M'Uniqo Rooftop Terrace · Andaz Munich",
    description: {
      de: "Der exklusive Auftakt des Cocktail X Festivals 2026 – Daydrinking auf einer der schönsten Rooftop-Terrassen Münchens. All you can drink Cocktails, Fingerfood, Live DJ und professioneller Content. Limitiert auf 180 Gäste.",
      en: "The exclusive opening of Cocktail X Festival 2026 – daydrinking on one of Munich's most beautiful rooftop terraces. All you can drink cocktails, fingerfood, live DJ and professional content. Limited to 180 guests.",
    },
    image: "/images/opening-rooftop.png",
    type: "opening",
    featured: true,
    program: [
      { de: "All you can drink Cocktails", en: "All you can drink cocktails" },
      { de: "Fingerfood inklusive", en: "Fingerfood included" },
      { de: "Live DJ · Rooftop Summer Vibes", en: "Live DJ · Rooftop Summer Vibes" },
      { de: "Fotowand & professioneller Content", en: "Photo wall & professional content" },
      { de: "Exklusiver Einlass · 180 Gäste", en: "Exclusive access · 180 guests" },
    ],
    tickets: [
      {
        label: { de: "Early Bird", en: "Early Bird" },
        price: 49,
        note: { de: "Limitiert · All you can drink + Fingerfood inkl.", en: "Limited · All you can drink + fingerfood incl." },
        badge: "LIMITIERT",
      },
      {
        label: { de: "Regular", en: "Regular" },
        price: 59,
        note: { de: "All you can drink + Fingerfood inkl.", en: "All you can drink + fingerfood incl." },
      },
    ],
    ticketSaleStart: "2026-04-13",
    capacity: 180,
    vibe: {
      de: "Influencer · VIPs · Cocktail-Community · Lifestyle & Hospitality",
      en: "Influencers · VIPs · Cocktail Community · Lifestyle & Hospitality",
    },
  },
  {
    id: "grand-opening",
    title: {
      de: "Festival Start",
      en: "Festival Start",
    },
    date: "2026-05-13",
    time: "17:00",
    location: "58 Bars in ganz München",
    description: {
      de: "Der offizielle Start des Cocktail X Festivals 2026. Ab sofort öffnen alle 58 teilnehmenden Bars ihre Türen – 18 Tage Cocktailkultur beginnt.",
      en: "The official start of Cocktail X Festival 2026. All 58 participating bars open their doors – 18 days of cocktail culture begins.",
    },
    image: "/images/festival-cheers.webp",
    type: "opening",
  },
  {
    id: "festival-days",
    title: {
      de: "Festival Tage",
      en: "Festival Days",
    },
    date: "2026-05-13",
    dateEnd: "2026-05-30",
    time: "ab 17:00",
    location: "58 Bars in ganz München",
    description: {
      de: "58 Bars, 18 Tage, 1 Ticket: Entdecke die Signature Cocktails von Münchens besten Bars – für nur 6€ pro Drink.",
      en: "58 bars, 18 days, 1 ticket: Discover the signature cocktails of München's best bars – for just €6 per drink.",
    },
    image: "/images/festival-bar-life.webp",
    type: "festival",
  },
  {
    id: "closing-awards",
    title: {
      de: "Closing & Awards",
      en: "Closing & Awards",
    },
    date: "2026-05-30",
    time: "20:00",
    location: "Alte Kongresshalle, München",
    description: {
      de: "Die große Abschlussfeier mit der Verleihung der Cocktail X Awards für die besten Bars und Cocktails des Festivals.",
      en: "The grand closing celebration with the Cocktail X Awards ceremony for the best bars and cocktails of the festival.",
    },
    image: "/images/festival-dj.webp",
    type: "closing",
  },
];
