export interface FestivalEvent {
  id: string;
  title: {
    de: string;
    en: string;
  };
  date: string;
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
    location: "Alte Kongresshalle, M\u00fcnchen",
    description: {
      de: "Der gro\u00dfe Auftakt zum Cocktail X Festival 2026 mit Live-Musik, Top-Bartendern und exklusiven Cocktailkreationen.",
      en: "The grand kick-off of Cocktail X Festival 2026 featuring live music, top bartenders, and exclusive cocktail creations.",
    },
    image: "/images/placeholder/event-1.svg",
    type: "opening",
  },
  {
    id: "festival-days",
    title: {
      de: "Festival Tage",
      en: "Festival Days",
    },
    date: "2026-05-14",
    time: "12:00",
    location: "50+ Bars in ganz M\u00fcnchen",
    description: {
      de: "18 Tage voller einzigartiger Cocktails in \u00fcber 50 Bars in ganz M\u00fcnchen. Sammle Stempel und entdecke neue Lieblingsdrinks.",
      en: "18 days of unique cocktails across 50+ bars throughout Munich. Collect stamps and discover new favorite drinks.",
    },
    image: "/images/placeholder/event-2.svg",
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
    image: "/images/placeholder/event-3.svg",
    type: "closing",
  },
];
