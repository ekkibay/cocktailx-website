/**
 * COCKTAIL X ON ICE '26, Inhaltsdaten.
 *
 * Chapters und Trails sind Arbeitsstand und aendern sich noch. Deshalb stehen
 * sie hier und nicht in den Komponenten. Preise liegen getrennt in pricing.ts.
 */

import { EVENT } from "./pricing";

/* ── Chapters ───────────────────────────────────────────────────────── */

export interface Chapter {
  key: string;
  index: string;
  title: string;
  dates: string;
  /** Ein Satz, der den Charakter traegt. */
  claim: string;
  /** Zwei bis drei Zeilen Erklaerung. */
  text: string;
  image: string;
  imagePosition: string;
}

export const CHAPTERS: Chapter[] = [
  {
    key: "first-frost",
    index: "01",
    title: "First Frost",
    dates: "17. bis 19. November",
    claim: "Die Stadt taut an.",
    text: "Der Auftakt liegt bewusst unter der Woche. Weniger Andrang, mehr Zeit an der Bar, und die Barkeeper haben noch Lust auf ein Gespräch. Wer die Karte in Ruhe durchprobieren will, fängt hier an.",
    image: "/images/onice/set-first-frost.jpg",
    imagePosition: "object-[center_55%]",
  },
  {
    key: "city-trails",
    index: "02",
    title: "City Trails",
    dates: "20. bis 24. November",
    claim: "Vier Viertel. Eine Nacht.",
    text: "Kuratierte Routen aus je drei Bars, die zusammenpassen und zu Fuß erreichbar sind. Du bekommst eine Reihenfolge vorgeschlagen, keine Reservierung. Wo du wirklich hängen bleibst, entscheidest du.",
    image: "/images/onice/set-drinks-four.jpg",
    imagePosition: "object-[center_45%]",
  },
  {
    key: "after-market-hours",
    index: "03",
    title: "After Market Hours",
    dates: "25. bis 28. November",
    claim: "Wenn der Weihnachtsmarkt schließt, fängt Cocktail X an.",
    // Formulierung ist vorgegeben und darf nicht als Partnerschaft klingen.
    text: "Unsere Bars liegen in Laufweite der Märkte, nach Marktschluss. Du gehst vom Glühwein zwei Ecken weiter und der Abend fängt nochmal von vorn an.",
    image: "/images/onice/onice-arm-in-arm.jpg",
    imagePosition: "object-[center_42%]",
  },
];

/* ── Trails ─────────────────────────────────────────────────────────── */

export interface Trail {
  key: string;
  title: string;
  /** Guest Promise, genau ein Satz. */
  promise: string;
  accent: string;
  image: string;
  imagePosition: string;
}

export const TRAILS: Trail[] = [
  {
    key: "nightcap",
    title: "Nightcap & Whisky",
    promise: "Dunkles Holz, braune Spirituosen, das letzte Glas des Abends.",
    accent: "text-tangerine",
    image: "/images/onice/onice-bar-keeper.jpg",
    imagePosition: "object-[center_45%]",
  },
  {
    key: "fire-fruit",
    title: "Fire & Fruit",
    promise: "Geräuchert, scharf, süß. Drinks, die dich wach halten.",
    accent: "text-hibiscus",
    image: "/images/onice/set-stir.jpg",
    imagePosition: "object-[center_55%]",
  },
  {
    key: "zero-light",
    title: "Zero & Light",
    promise: "Alkoholfrei und leicht, ohne dass es nach Verzicht schmeckt.",
    accent: "text-tangerine",
    image: "/images/onice/set-garnish.jpg",
    imagePosition: "object-[center_28%]",
  },
  {
    key: "hotel-icons",
    title: "Hotel Bar Icons",
    promise: "Die großen Hotelbars der Stadt, an einem Abend.",
    accent: "text-bone",
    image: "/images/onice/set-craft.jpg",
    imagePosition: "object-[center_62%]",
  },
];

export const TRAILS_BADGE = "Weitere Trails folgen";

/* ── Bars ───────────────────────────────────────────────────────────────
   Solange das Re-Signing laeuft, gibt es weder Namen noch genaue Zahlen,
   nur "40+". Die Struktur steht aber schon, damit ab dem Reveal taeglich
   Kacheln nachgeladen werden koennen, ohne dass Code angefasst wird.        */

export interface Bar {
  /** Sichtbar ab Reveal. */
  name: string;
  viertel: string;
  /** Verweist auf Trail.key */
  trail: string;
  image: string;
  instagram: string;
}

/** Bleibt leer bis zum Reveal. Danach hier befuellen oder aus einer Quelle laden. */
export const BARS: Bar[] = [];

/** Anzahl Silhouetten im Platzhalter-Raster vor dem Reveal. */
export const BAR_SILHOUETTES = 12;

/* ── So funktioniert's ──────────────────────────────────────────────── */

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Pass sichern",
    text: "Einmal kaufen, gilt für alle 12 Nächte und alle Bars.",
  },
  {
    step: "02",
    title: "App öffnen",
    text: "Die App ist dein Pass. Sie läuft im Browser, es gibt nichts zu installieren.",
  },
  {
    step: "03",
    title: "QR in der Bar scannen",
    text: "An der Bar den Code scannen. Das Team sieht sofort, dass du dabei bist.",
  },
  {
    step: "04",
    title: "Signature Drink freischalten",
    text: "Jede Bar hat einen eigenen Drink für ON ICE. Einen pro Bar, so oft du Bars besuchst.",
  },
] as const;

/* ── FAQ ────────────────────────────────────────────────────────────────
   Basis ist die Sommer-FAQ, auf ON ICE umgeschrieben, plus die neuen
   Punkte zu Crew Pass, Double Season, Widerruf und alkoholfrei.            */

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ: FaqItem[] = [
  {
    q: "Was bekomme ich für den Pass?",
    a: "Zugang zu allen teilnehmenden Bars über die gesamten 12 Nächte. In jeder Bar schaltest du einen Signature Drink frei, der eigens für ON ICE entwickelt wurde. Der Drink ist im Pass enthalten, du zahlst an der Bar nichts nach.",
  },
  {
    q: "Wie funktioniert das mit der App?",
    a: "Die App ist dein Pass. Nach dem Kauf öffnest du sie und meldest dich an, dein Pass liegt dort hinterlegt. In der Bar scannst du den QR-Code, das Team schaltet deinen Drink frei. Du brauchst nichts auszudrucken und nichts abzuholen.",
  },
  {
    q: "Muss ich vorher reservieren?",
    a: "Nein, und wir reservieren auch nicht für dich. Die App schlägt dir Routen vor. Ob du reinkommst, entscheidet die Bar wie an jedem anderen Abend auch.",
  },
  {
    q: "Kann ich alle Bars an einem Abend machen?",
    a: "Technisch ja, sinnvoll nein. Die Trails sind auf drei Bars pro Nacht ausgelegt, zu Fuß erreichbar. Der Pass gilt über alle 12 Nächte, du musst also nichts erzwingen.",
  },
  {
    q: "Geht das auch ohne Alkohol?",
    a: "Ja. Der Trail ZERO & LIGHT besteht komplett aus alkoholfreien Drinks, und jede teilnehmende Bar hat mindestens eine alkoholfreie Variante ihres Signature Drinks. Wasser bekommst du überall kostenlos.",
  },
  {
    q: "Was ist der Crew Pass?",
    a: "Vier Pässe zum Preis von drei, für alle, die ohnehin zusammen losziehen. Maximal zwei Crew Passes pro Käufer, nicht mit anderen Angeboten kombinierbar. Die Pässe kommen einzeln in die App, ihr müsst also nicht zusammenbleiben.",
  },
  {
    q: "Was ist Double Season?",
    a: "ON ICE im November und das Sommerfestival 2027 in einem Kauf, für 79 €. Der Preis gilt durchgehend, dafür gibt es kein Rabattfenster. Limitiert auf 300 Stück. Der Termin für Sommer 2027 wird rechtzeitig bekannt gegeben.",
  },
  {
    q: "Wann werden die Bars bekannt gegeben?",
    a: `Ab dem ${EVENT.barsRevealLabel}. Danach kommen laufend weitere dazu, bis alle über 40 Bars stehen. Wir veröffentlichen keine Namen, solange die Vereinbarungen nicht unterschrieben sind.`,
  },
  {
    q: "Kann ich den Pass zurückgeben?",
    a: "Zu Widerruf und Erstattung folgt an dieser Stelle der endgültige Text. Bis dahin gilt: Schreib uns an info@cocktail-x.com, wir klären jeden Fall persönlich.",
  },
  {
    q: "Wir sind ein Team. Geht das auch für die Firma?",
    a: "Ja. Für 10, 25 oder 50 Pässe gibt es eine Sammelrechnung auf die Firma, zum jeweils regulären Preis. Anfrage per Mail, dann meldet sich jemand persönlich.",
  },
];
