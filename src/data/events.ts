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
  dresscode?: string;
  tagline?: { de: string; en: string };
  awards?: {
    title: { de: string; en: string };
    body: { de: string; en: string };
    icon: "trophy" | "vote";
  }[];
  inclusions?: { label: { de: string; en: string }; detail: { de: string; en: string } }[];
}

export const events: FestivalEvent[] = [
  {
    id: "grand-opening",
    title: {
      de: "Festival Start",
      en: "Festival Start",
    },
    date: "2026-05-13",
    time: "17:00",
    location: "60+ Bars in ganz München",
    description: {
      de: "Der offizielle Start des Cocktail X Festivals 2026. Ab sofort öffnen alle teilnehmenden Bars ihre Türen – 18 Tage Cocktailkultur beginnt.",
      en: "The official start of Cocktail X Festival 2026. All participating bars open their doors – 18 days of cocktail culture begins.",
    },
    image: "/images/festival-cheers.webp",
    type: "opening",
  },
  {
    id: "opening-party",
    title: {
      de: "Cocktail X Opening 2026",
      en: "Cocktail X Opening 2026",
    },
    date: "2026-05-14",
    time: "14:00",
    timeEnd: "18:00",
    location: "M'Uniqo Rooftop Terrace · Andaz München Schwabinger Tor",
    description: {
      de: "Der exklusive Auftakt des Cocktail X Festivals 2026 – Daydrinking auf einer der schönsten Rooftop-Terrassen Münchens. Drinks & Canapés inklusive, Live DJ und professioneller Content. Limitiert auf 180 Gäste.",
      en: "The exclusive opening of Cocktail X Festival 2026 – daydrinking on one of Munich's most beautiful rooftop terraces. Drinks & canapés included, live DJ and professional content. Limited to 180 guests.",
    },
    image: "/images/opening-rooftop.jpg",
    type: "opening",
    featured: true,
    program: [
      { de: "Drinks inklusive", en: "Drinks included" },
      { de: "Canapés inklusive", en: "Canapés included" },
      { de: "Live DJ · Rooftop Summer Vibes", en: "Live DJ · Rooftop Summer Vibes" },
      { de: "Exklusiver Einlass · 180 Gäste", en: "Exclusive access · 180 guests" },
    ],
    tickets: [
      {
        label: { de: "Ticket", en: "Ticket" },
        price: 59,
        note: { de: "Drinks & Canapés inkl.", en: "Drinks & canapés incl." },
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
    id: "festival-days",
    title: {
      de: "Festival Tage",
      en: "Festival Days",
    },
    date: "2026-05-13",
    dateEnd: "2026-05-30",
    time: "ab 17:00",
    location: "60+ Bars in ganz München",
    description: {
      de: "60+ Bars, 18 Tage, 1 Ticket: Entdecke die Signature Cocktails von Münchens besten Bars – für nur 6€ pro Drink.",
      en: "60+ bars, 18 days, 1 ticket: Discover the signature cocktails of München's best bars – for just €6 per drink.",
    },
    image: "/images/festival-key-visual.jpg",
    type: "festival",
  },
  {
    id: "closing-awards",
    title: {
      de: "Closing & Award Night",
      en: "Closing & Award Night",
    },
    tagline: {
      de: "Die Grammys der deutschen Bar-Szene.",
      en: "The Grammys of the German bar scene.",
    },
    date: "2026-05-31",
    time: "19:00",
    timeEnd: "23:00",
    location: "Brenner Operngrill, Max-Joseph-Platz 5, München",
    description: {
      de: "500 Gäste. Zwei Award-Verleihungen. Red Carpet. All-Inclusive bis zum letzten Toast.",
      en: "500 guests. Two award ceremonies. Red carpet. All-inclusive until the last toast.",
    },
    image: "/images/festival-dj.webp",
    type: "closing",
    featured: true,
    capacity: 500,
    dresscode: "Black Tie",
    vibe: {
      de: "Black Tie · 500 Bar-Profis · Red Carpet · Award Night",
      en: "Black Tie · 500 Bar Professionals · Red Carpet · Award Night",
    },
    awards: [
      {
        title: {
          de: "Top 30 Best Bars Deutschland",
          en: "Top 30 Best Bars Germany",
        },
        body: {
          de: "Die einzige Live-Auszeichnung Deutschlands: 30 Bars werden vor 500 geladenen Bar-Profis ausgezeichnet. 1× pro Jahr. Exklusiv auf der Closing Gala.",
          en: "Germany's only live ranking ceremony: 30 bars are honoured in front of 500 invited bar professionals. Once a year. Exclusive to the Closing Gala.",
        },
        icon: "trophy",
      },
      {
        title: {
          de: "Cocktail X Awards – Du entscheidest.",
          en: "Cocktail X Awards – You decide.",
        },
        body: {
          de: "Während der 18 Festival-Tage bewerten alle Cocktail X Passport-Inhaber die Bars live über die App. Drei Awards, gewählt von den Gästen selbst: Best Cocktail · Best Service · Best Bar Overall. Live gekrönt auf der Closing Gala – wer ein Festival-Passport hat, entscheidet mit.",
          en: "Throughout the 18 festival days, all Cocktail X Passport holders rate the bars live via the app. Three awards, voted by the guests themselves: Best Cocktail · Best Service · Best Bar Overall. Crowned live at the Closing Gala – every passport holder gets a vote.",
        },
        icon: "vote",
      },
    ],
    inclusions: [
      {
        label: { de: "Red Carpet Empfang", en: "Red Carpet Welcome" },
        detail: { de: "Ankommen, wie es sich gehört.", en: "Arrive in style." },
      },
      {
        label: { de: "All-Inclusive Drinks", en: "All-Inclusive Drinks" },
        detail: {
          de: "Kuratierte Spirits- & Cocktail-Selektion, gemixt von Deutschlands Top-Bartendern.",
          en: "Curated spirits & cocktail selection, mixed by Germany's top bartenders.",
        },
      },
      {
        label: { de: "3-Gang-Menü", en: "3-Course Menu" },
        detail: {
          de: "Aus der Brenner-Küche, mediterran.",
          en: "From the Brenner kitchen, Mediterranean.",
        },
      },
      {
        label: { de: "Midnight Snack", en: "Midnight Snack" },
        detail: { de: "Für die, die bleiben.", en: "For those who stay." },
      },
      {
        label: { de: "Top 30 Best Bars Award", en: "Top 30 Best Bars Award" },
        detail: { de: "Live-Verleihung.", en: "Live ceremony." },
      },
      {
        label: { de: "Cocktail X Awards", en: "Cocktail X Awards" },
        detail: {
          de: "Live-Verleihung: Best Cocktail · Best Service · Best Bar.",
          en: "Live ceremony: Best Cocktail · Best Service · Best Bar.",
        },
      },
      {
        label: { de: "Live-Musik & DJ-Set", en: "Live Music & DJ Set" },
        detail: { de: "Bis spät.", en: "Late into the night." },
      },
      {
        label: { de: "Networking", en: "Networking" },
        detail: {
          de: "500 Bar-Profis, Gastronomen & 20 Lifestyle-Influencer (4 Mio. Reach).",
          en: "500 bar professionals, restaurateurs & 20 lifestyle influencers (4M reach).",
        },
      },
      {
        label: { de: "Foto-Wall & Social Content", en: "Photo Wall & Social Content" },
        detail: { de: "Dein Abend, dein Content.", en: "Your night, your content." },
      },
    ],
    tickets: [
      {
        label: { de: "Ticket", en: "Ticket" },
        price: 89,
        note: { de: "Wenige verfügbar · Nächster Preis: 99 €", en: "Few left · Next price: €99" },
        badge: "FAST WEG",
      },
      {
        label: { de: "Nächster Preis", en: "Next Price" },
        price: 99,
        note: { de: "Letzte Tickets", en: "Final tickets" },
      },
    ],
  },
];
