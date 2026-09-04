/**
 * COCKTAIL X ON ICE '26, Inhaltsdaten.
 *
 * Chapters und Trails sind Arbeitsstand und aendern sich noch. Deshalb stehen
 * sie hier und nicht in den Komponenten. Preise liegen getrennt in pricing.ts.
 *
 * Alle Gasttexte sind zweisprachig. Bild, Position und Akzentfarbe stehen
 * daneben, weil sie zum Eintrag gehoeren und nicht zur Sprache. Produkt- und
 * Kapitelnamen bleiben in beiden Sprachen gleich, sie sind Markenbegriffe.
 */

import type { Bilingual } from "@/i18n/bilingual";
import { CONTACT_EMAIL, DOUBLE_SEASON_LIMIT, DOUBLE_SEASON_PRICE, EVENT } from "./pricing";

/* ── Chapters ───────────────────────────────────────────────────────── */

export interface Chapter {
  key: string;
  index: string;
  title: string;
  dates: Bilingual;
  /** Ein Satz, der den Charakter traegt. */
  claim: Bilingual;
  /** Zwei bis drei Zeilen Erklaerung. */
  text: Bilingual;
  image: string;
  imagePosition: string;
}

export const CHAPTERS: Chapter[] = [
  {
    key: "first-frost",
    index: "01",
    title: "First Frost",
    dates: { de: "17. bis 19. November", en: "17 to 19 November" },
    claim: { de: "Die Stadt taut an.", en: "The city thaws." },
    text: {
      de: "Der Auftakt liegt bewusst unter der Woche. Weniger Andrang, mehr Zeit an der Bar, und die Barkeeper haben noch Lust auf ein Gespräch. Wer die Karte in Ruhe durchprobieren will, fängt hier an.",
      en: "The opening deliberately falls on weekdays. Fewer people, more time at the bar, and the bartenders are still up for a chat. If you want to work through the menu without rushing, start here.",
    },
    image: "/images/onice/set-first-frost.jpg",
    imagePosition: "object-[center_55%]",
  },
  {
    key: "city-trails",
    index: "02",
    title: "City Trails",
    dates: { de: "20. bis 24. November", en: "20 to 24 November" },
    claim: { de: "Vier Viertel. Eine Nacht.", en: "Four neighbourhoods. One night." },
    text: {
      de: "Kuratierte Routen aus je drei Bars, die zusammenpassen und zu Fuß erreichbar sind. Du bekommst eine Reihenfolge vorgeschlagen, keine Reservierung. Wo du wirklich hängen bleibst, entscheidest du.",
      en: "Curated routes of three bars each, picked to go together and close enough to walk. You get a suggested order, not a reservation. Where you actually end up staying is your call.",
    },
    image: "/images/onice/set-drinks-four.jpg",
    imagePosition: "object-[center_45%]",
  },
  {
    key: "after-market-hours",
    index: "03",
    title: "After Market Hours",
    dates: { de: "25. bis 28. November", en: "25 to 28 November" },
    claim: {
      de: "Wenn der Weihnachtsmarkt schließt, fängt Cocktail X an.",
      en: "When the Christmas market closes, Cocktail X begins.",
    },
    /* Formulierung ist vorgegeben und darf nicht als Partnerschaft klingen.
       Das gilt fuer die englische Fassung genauso: in Laufweite, nach
       Marktschluss, keine Zusammenarbeit behaupten. */
    text: {
      de: "Unsere Bars liegen in Laufweite der Märkte, nach Marktschluss. Du gehst vom Glühwein zwei Ecken weiter und der Abend fängt nochmal von vorn an.",
      en: "Our bars are within walking distance of the markets, open once the markets close. You walk two corners on from the mulled wine and the evening starts over.",
    },
    image: "/images/onice/onice-arm-in-arm.jpg",
    imagePosition: "object-[center_42%]",
  },
];

/* ── Trails ─────────────────────────────────────────────────────────── */

export interface Trail {
  key: string;
  title: string;
  /** Guest Promise, genau ein Satz. */
  promise: Bilingual;
  accent: string;
  image: string;
  imagePosition: string;
}

export const TRAILS: Trail[] = [
  {
    key: "nightcap",
    title: "Nightcap & Whisky",
    promise: {
      de: "Dunkles Holz, braune Spirituosen, das letzte Glas des Abends.",
      en: "Dark wood, brown spirits, the last glass of the night.",
    },
    accent: "text-tangerine",
    image: "/images/onice/onice-bar-keeper.jpg",
    imagePosition: "object-[center_45%]",
  },
  {
    key: "fire-fruit",
    title: "Fire & Fruit",
    promise: {
      de: "Geräuchert, scharf, süß. Drinks, die dich wach halten.",
      en: "Smoked, sharp, sweet. Drinks that keep you going.",
    },
    accent: "text-hibiscus",
    /* Rote Drinks in Nahaufnahme statt eines zweiten Barkeeper-Portraets:
       Zero & Light daneben zeigt denselben Mann an derselben Bar, und zwei
       fast gleiche Fotos nebeneinander lesen sich wie ein Versehen. Die
       roten Drinks passen ausserdem zum pinken Label. */
    image: "/images/onice/onice-drinks-row.jpg",
    imagePosition: "object-[center_45%]",
  },
  {
    key: "zero-light",
    title: "Zero & Light",
    promise: {
      de: "Alkoholfrei und leicht, ohne dass es nach Verzicht schmeckt.",
      en: "Alcohol free and light, without tasting like you are missing out.",
    },
    accent: "text-tangerine",
    image: "/images/onice/set-garnish.jpg",
    imagePosition: "object-[center_28%]",
  },
  {
    key: "hotel-icons",
    title: "Hotel Bar Icons",
    promise: {
      de: "Die großen Hotelbars der Stadt, an einem Abend.",
      en: "The city's grand hotel bars, in a single evening.",
    },
    accent: "text-bone",
    image: "/images/onice/set-craft.jpg",
    imagePosition: "object-[center_62%]",
  },
];

export const TRAILS_BADGE: Bilingual = {
  de: "Weitere Trails folgen",
  en: "More trails to come",
};

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

export interface HowItWorksStep {
  step: string;
  title: Bilingual;
  text: Bilingual;
}

export const HOW_IT_WORKS: HowItWorksStep[] = [
  {
    step: "01",
    title: { de: "Pass sichern", en: "Get your pass" },
    text: {
      de: `Einmal kaufen, gilt für alle ${EVENT.nights} Nächte und alle Bars.`,
      en: `Buy once, valid for all ${EVENT.nights} nights and every bar.`,
    },
  },
  {
    step: "02",
    title: { de: "App öffnen", en: "Open the app" },
    text: {
      de: "Die App ist dein Pass. Sie läuft im Browser, es gibt nichts zu installieren.",
      en: "The app is your pass. It runs in the browser, there is nothing to install.",
    },
  },
  {
    step: "03",
    title: { de: "QR in der Bar scannen", en: "Scan the QR code at the bar" },
    text: {
      de: "An der Bar den Code scannen. Das Team sieht sofort, dass du dabei bist.",
      en: "Scan the code at the bar. The team sees straight away that you are in.",
    },
  },
  {
    step: "04",
    title: { de: "Signature Drink freischalten", en: "Unlock the signature drink" },
    text: {
      de: "Jede Bar hat einen eigenen Drink für ON ICE. Einen pro Bar, so oft du Bars besuchst.",
      en: "Every bar has its own drink for ON ICE. One per bar, as often as you visit bars.",
    },
  },
];

/* ── FAQ ────────────────────────────────────────────────────────────────
   Basis ist die Sommer-FAQ, auf ON ICE umgeschrieben, plus die neuen
   Punkte zu Crew Pass, Double Season, Widerruf und alkoholfrei.

   Zwei Zusagen sind hier bewusst nicht mehr drin: kostenloses Wasser, das
   wir nicht anbieten und nirgends zusichern koennen, und die Pflicht jeder
   Bar zu einer alkoholfreien Variante. Die Bars koennen eine anbieten,
   muessen aber nicht. Bitte nicht wieder als Tatsache formulieren.            */

export interface FaqItem {
  q: Bilingual;
  a: Bilingual;
}

export const FAQ: FaqItem[] = [
  {
    q: { de: "Was bekomme ich für den Pass?", en: "What do I get for the pass?" },
    a: {
      de: `Zugang zu allen teilnehmenden Bars über die gesamten ${EVENT.nights} Nächte. In jeder Bar schaltest du einen Signature Drink frei, der eigens für ON ICE entwickelt wurde. Der Drink ist im Pass enthalten, du zahlst an der Bar nichts nach.`,
      en: `Access to every participating bar across all ${EVENT.nights} nights. In each bar you unlock a signature drink created specifically for ON ICE. The drink is included in the pass, you pay nothing extra at the bar.`,
    },
  },
  {
    q: { de: "Wie funktioniert das mit der App?", en: "How does the app work?" },
    a: {
      de: "Die App ist dein Pass. Nach dem Kauf öffnest du sie und meldest dich an, dein Pass liegt dort hinterlegt. In der Bar scannst du den QR-Code, das Team schaltet deinen Drink frei. Du brauchst nichts auszudrucken und nichts abzuholen.",
      en: "The app is your pass. After buying you open it and sign in, your pass is waiting there. At the bar you scan the QR code and the team unlocks your drink. Nothing to print, nothing to collect.",
    },
  },
  {
    q: { de: "Muss ich vorher reservieren?", en: "Do I need to book ahead?" },
    a: {
      de: "Nein, und wir reservieren auch nicht für dich. Die App schlägt dir Routen vor. Ob du reinkommst, entscheidet die Bar wie an jedem anderen Abend auch.",
      en: "No, and we do not book for you either. The app suggests routes. Whether you get in is the bar's call, just like on any other night.",
    },
  },
  {
    q: { de: "Kann ich alle Bars an einem Abend machen?", en: "Can I do every bar in one night?" },
    a: {
      de: `Technisch ja, sinnvoll nein. Die Trails sind auf drei Bars pro Nacht ausgelegt, zu Fuß erreichbar. Der Pass gilt über alle ${EVENT.nights} Nächte, du musst also nichts erzwingen.`,
      en: `Technically yes, sensibly no. The trails are built around three bars a night, all within walking distance. The pass covers all ${EVENT.nights} nights, so there is nothing to force.`,
    },
  },
  {
    q: { de: "Geht das auch ohne Alkohol?", en: "Does this work without alcohol?" },
    a: {
      de: "Ja. Der Trail ZERO & LIGHT ist genau dafür zusammengestellt. Viele Bars bieten außerdem eine alkoholfreie Variante ihres Signature Drinks an. Verpflichtet ist dazu keine, frag am besten direkt an der Bar.",
      en: "Yes. The ZERO & LIGHT trail is put together for exactly that. Many bars also offer an alcohol free version of their signature drink. None of them has to, so it is worth asking at the bar.",
    },
  },
  {
    q: { de: "Was ist der Crew Pass?", en: "What is the Crew Pass?" },
    a: {
      de: "Vier Pässe zum Preis von drei, für alle, die ohnehin zusammen losziehen. Maximal zwei Crew Passes pro Käufer, nicht mit anderen Angeboten kombinierbar. Die Pässe kommen einzeln in die App, ihr müsst also nicht zusammenbleiben.",
      en: "Four passes for the price of three, for everyone heading out together anyway. Two Crew Passes per buyer at most, not combinable with other offers. The passes land individually in the app, so you do not have to stay together.",
    },
  },
  {
    q: { de: "Was ist Double Season?", en: "What is Double Season?" },
    a: {
      de: `ON ICE im November und das Sommerfestival 2027 in einem Kauf, für ${DOUBLE_SEASON_PRICE} €. Der Preis gilt durchgehend, dafür gibt es kein Rabattfenster. Limitiert auf ${DOUBLE_SEASON_LIMIT} Stück. Der Termin für Sommer 2027 wird rechtzeitig bekannt gegeben.`,
      en: `ON ICE in November plus the summer festival 2027 in one purchase, for ${DOUBLE_SEASON_PRICE} €. The price holds throughout, so there is no discount window for it. Limited to ${DOUBLE_SEASON_LIMIT}. The date for summer 2027 will be announced in good time.`,
    },
  },
  {
    q: { de: "Wann werden die Bars bekannt gegeben?", en: "When are the bars announced?" },
    a: {
      de: `Ab dem ${EVENT.barsRevealLabel}. Danach kommen laufend weitere dazu, bis alle ${EVENT.barsLabel} Bars stehen. Wir veröffentlichen keine Namen, solange die Vereinbarungen nicht unterschrieben sind.`,
      en: `From ${EVENT.barsRevealLabelEn}. After that more follow continuously until all ${EVENT.barsLabel} bars are set. We publish no names until the agreements are signed.`,
    },
  },
  {
    q: { de: "Kann ich den Pass zurückgeben?", en: "Can I return the pass?" },
    a: {
      de: `Zu Widerruf und Erstattung folgt an dieser Stelle der endgültige Text. Bis dahin gilt: Schreib uns an ${CONTACT_EMAIL}, wir klären jeden Fall persönlich.`,
      en: `The final wording on cancellation and refunds will follow here. Until then: write to ${CONTACT_EMAIL} and we will sort out each case personally.`,
    },
  },
  {
    q: {
      de: "Wir sind ein Team. Geht das auch für die Firma?",
      en: "We are a team. Does this work for a company?",
    },
    a: {
      de: "Ja. Für 10, 25 oder 50 Pässe gibt es eine Sammelrechnung auf die Firma, zum jeweils regulären Preis. Anfrage per Mail, dann meldet sich jemand persönlich.",
      en: "Yes. For 10, 25 or 50 passes there is a single invoice to the company, at the regular price of the day. Enquire by email and someone will get back to you personally.",
    },
  },
];
