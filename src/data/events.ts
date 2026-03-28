export interface FestivalEvent {
  id: string;
  title: {
    de: string;
    en: string;
  };
  date: string;
  dateEnd?: string;
  time: string;
  location: string;
  description: {
    de: string;
    en: string;
  };
  image: string;
  type: "opening" | "festival" | "closing";
}

export const events: FestivalEvent[] = [
  {
    id: "grand-opening",
    title: {
      de: "Grand Opening",
      en: "Grand Opening",
    },
    date: "2026-05-13",
    time: "19:00",
    location: "M\u00fcnchen",
    description: {
      de: "Der offizielle Auftakt des Cocktail X Festivals 2026. Der Startschuss f\u00fcr 18 Tage Cocktailkultur in M\u00fcnchens besten Bars.",
      en: "The official kick-off of Cocktail X Festival 2026. The starting gun for 18 days of cocktail culture in M\u00fcnchen's best bars.",
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
    location: "58 Bars in ganz M\u00fcnchen",
    description: {
      de: "58 Bars, 18 Tage, 1 Ticket: Entdecke die Signature Cocktails von M\u00fcnchens besten Bars \u2013 f\u00fcr nur 6\u20ac pro Drink.",
      en: "58 bars, 18 days, 1 ticket: Discover the signature cocktails of M\u00fcnchen's best bars \u2013 for just \u20ac6 per drink.",
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
    location: "Alte Kongresshalle, M\u00fcnchen",
    description: {
      de: "Die gro\u00dfe Abschlussfeier mit der Verleihung der Cocktail X Awards f\u00fcr die besten Bars und Cocktails des Festivals.",
      en: "The grand closing celebration with the Cocktail X Awards ceremony for the best bars and cocktails of the festival.",
    },
    image: "/images/festival-dj.webp",
    type: "closing",
  },
];
