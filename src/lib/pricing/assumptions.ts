/**
 * OPERATIVE ANNAHMEN — bitte prüfen.
 *
 * Diese Zahlen stehen NICHT in easybill. Sie beschreiben, wie ein Event besetzt und
 * ausgestattet wird, und übersetzen eine Kundenkonfiguration in Katalogpositionen.
 * Alles andere im Konfigurator rechnet mit echten easybill-Preisen — nur dieser Block
 * ist geschätzt und sollte gegen die Realität abgeglichen werden.
 *
 * Preise ändern sich über das Sync-Skript, Betriebslogik hier.
 */

/** Cocktails, die EIN Barkeeper pro Stunde nachhaltig ausgibt (nicht der Spitzenwert). */
export const THROUGHPUT_PER_BARKEEPER_HOUR = {
  /** Klassisch geschüttelt — der limitierende Faktor ist das Shaken selbst. */
  classic: 70,
  /** Signature Drinks: aufwendigere Zubereitung, Garnitur, Erklärung am Gast. */
  signature: 60,
  /** Vorgemixt und aus dem Nitro-Tap ausgegeben — daher der Durchsatzvorteil. */
  nitro: 180,
  /** Highballs: Eis, Spirit, Filler — schnell, aber ohne Nitro-Vorteil. */
  highball: 100,
} as const;

export type BarConcept = keyof typeof THROUGHPUT_PER_BARKEEPER_HOUR;

/** Ein Barkeeper deckt maximal so viele Gäste ab — Untergrenze unabhängig vom Durchsatz. */
export const GUESTS_PER_BARKEEPER = 75;

/** Zwei Barkeeper pro Bar-Einheit. Bestimmt, wie viele Bars aufgebaut werden müssen. */
export const BARKEEPERS_PER_BAR = 2;

/** Auf- und Abbau zusätzlich zur Eventdauer — Personal wird für die Gesamtzeit bezahlt. */
export const SETUP_TEARDOWN_HOURS = 3;

/** Ab dieser Gästezahl kommt eine Barschankkraft je angefangene zwei Barkeeper dazu. */
export const BAR_BACK_FROM_GUESTS = 100;

/** Eine Servicekraft je so vielen Gästen — nur bei Food-Ausgabe. */
export const GUESTS_PER_SERVICE_STAFF = 50;

/** Logistiker für Auf-/Abbau: Anzahl und angesetzte Stunden. */
export const LOGISTICS_CREW = 2;
export const LOGISTICS_HOURS = 4;

/** Ab dieser Gästezahl zusätzlich eine Logistikleitung. */
export const LOGISTICS_LEAD_FROM_GUESTS = 300;

/** Projektleitung (Tagessatz) ab dieser Gästezahl ODER ab dieser Eventdauer. */
export const PROJECT_LEAD_FROM_GUESTS = 150;
export const PROJECT_LEAD_FROM_HOURS = 5;

/** Kühlwagen ab dieser Gästezahl. */
export const COOLING_TRUCK_FROM_GUESTS = 300;

/** Zweite Transportpauschale ab dieser Gästezahl. */
export const SECOND_TRANSPORT_FROM_GUESTS = 500;

/** Die Softs-Pauschale (30005) deckt 5 Stunden ab. */
export const SOFT_DRINK_PACKAGE_HOURS = 5;

/**
 * Mengenrabatt — bewusst NUR auf Getränke.
 *
 * Getränke tragen 56–77% Deckungsbeitrag, Personal nur 17%. Ein Rabatt auf die
 * Personalpositionen würde die Marge sofort auffressen, deshalb bleibt Personal
 * immer unrabattiert. Sobald in easybill echte Staffelpreise (sale_price2..10)
 * gepflegt sind, ersetzen diese Werte hier.
 */
export const DRINK_VOLUME_DISCOUNT: ReadonlyArray<{ fromGuests: number; discount: number }> = [
  { fromGuests: 1000, discount: 0.1 },
  { fromGuests: 500, discount: 0.08 },
  { fromGuests: 300, discount: 0.05 },
  { fromGuests: 150, discount: 0.03 },
  { fromGuests: 0, discount: 0 },
];

/**
 * Deckungsbeitrags-Schwellen. Unter WARN wird im Konfigurator gewarnt, unter FLOOR
 * wird kein Preis mehr angezeigt, sondern auf ein persönliches Angebot verwiesen —
 * damit nie eine Konfiguration rausgeht, die Geld kostet.
 */
export const MARGIN_WARN_BELOW = 0.35;
export const MARGIN_FLOOR = 0.25;

/** Grenzen der Konfiguration. Außerhalb: individuelles Angebot. */
export const LIMITS = {
  minGuests: 20,
  maxGuests: 3000,
  minHours: 2,
  maxHours: 10,
  minDrinksPerGuest: 1,
  maxDrinksPerGuest: 6,
} as const;
