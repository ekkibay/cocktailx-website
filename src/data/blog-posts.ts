export interface BlogPost {
  slug: string;
  title: {
    de: string;
    en: string;
  };
  excerpt: {
    de: string;
    en: string;
  };
  content: {
    de: string;
    en: string;
  };
  date: string;
  image: string;
  category: string;
  featured: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "cocktail-x-2026-lineup",
    title: {
      de: "Das Cocktail X 2026 Line-Up ist da!",
      en: "The Cocktail X 2026 Line-Up Is Here!",
    },
    excerpt: {
      de: "\u00dcber 50 Bars, 200 exklusive Cocktails und 18 Tage voller Genuss \u2013 entdecke das komplette Festival-Programm.",
      en: "Over 50 bars, 200 exclusive cocktails, and 18 days of indulgence \u2013 discover the complete festival program.",
    },
    content: {
      de: "Wir freuen uns, das vollst\u00e4ndige Line-Up f\u00fcr das Cocktail X Festival 2026 bekannt zu geben. Dieses Jahr erwarten euch \u00fcber 50 teilnehmende Bars aus ganz M\u00fcnchen, mehr als 200 exklusive Cocktailkreationen und 18 unvergessliche Tage. Von der Goldenen Bar bis zur Zephyr Bar \u2013 jede Location hat einen einzigartigen Signature Cocktail f\u00fcr das Festival kreiert.",
      en: "We are excited to announce the complete line-up for the Cocktail X Festival 2026. This year, you can look forward to over 50 participating bars from across Munich, more than 200 exclusive cocktail creations, and 18 unforgettable days. From Goldene Bar to Zephyr Bar \u2013 each location has created a unique signature cocktail for the festival.",
    },
    date: "2026-03-15",
    image: "/images/placeholder/blog-1.svg",
    category: "Festival",
    featured: true,
  },
  {
    slug: "top-cocktail-trends-2026",
    title: {
      de: "Die Top Cocktail-Trends 2026",
      en: "Top Cocktail Trends 2026",
    },
    excerpt: {
      de: "Von Zero-Waste-Mixology bis hin zu regionalen Zutaten \u2013 diese Trends pr\u00e4gen die Cocktailkultur in diesem Jahr.",
      en: "From zero-waste mixology to regional ingredients \u2013 these trends are shaping cocktail culture this year.",
    },
    content: {
      de: "Die Cocktailwelt entwickelt sich st\u00e4ndig weiter. 2026 stehen Nachhaltigkeit und Regionalit\u00e4t im Mittelpunkt. Zero-Waste-Mixology ist kein Nischenthema mehr, sondern Standard in den besten Bars. Bartender verwenden Zutaten komplett \u2013 von der Schale bis zum Kern. Dazu kommen regionale Destillate und saisonale Botanicals direkt aus Bayern.",
      en: "The cocktail world is constantly evolving. In 2026, sustainability and regionality take center stage. Zero-waste mixology is no longer a niche topic but standard practice in the best bars. Bartenders use ingredients completely \u2013 from peel to core. Add to that regional distillates and seasonal botanicals sourced directly from Bavaria.",
    },
    date: "2026-03-10",
    image: "/images/placeholder/blog-2.svg",
    category: "Trends",
    featured: false,
  },
];
