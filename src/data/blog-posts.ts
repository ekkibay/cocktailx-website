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

/* Der Beitrag "cocktail-x-2026-lineup" ist hier entfernt und nicht nur
   ausgeblendet. Er nannte zwei Bars beim Namen, waehrend das Re-Signing noch
   laeuft, und beschrieb mit 60+ Bars, 174+ Cocktails und 18 Tagen das
   Sommerformat als das, was 2026 stattfindet. Beides stand live unter /blog.
   Nach dem Bar-Reveal kann ein neuer Beitrag mit den richtigen Zahlen
   entstehen, der alte Text taugt dafuer nicht. */
export const blogPosts: BlogPost[] = [
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
