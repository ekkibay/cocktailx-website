/**
 * Vertrag des Ticketmoduls.
 *
 * Dieses Modul ist bewusst rahmenfrei: keine Next-, React- oder
 * Projekt-Importe, nur relative Pfade und Node-Bordmittel. Es soll
 * unveraendert in den Shop uebernommen werden koennen, der auf einer anderen
 * Codebasis laeuft.
 *
 * Zwei Regeln bestimmen den ganzen Zuschnitt:
 *
 * 1. Preishoheit liegt beim Server. Der Client schickt nie einen Preis,
 *    sondern hoechstens einen Code. Was etwas kostet, entscheidet
 *    resolvePrice(), und nur das Ergebnis geht in die Zahlung.
 * 2. Preise unterhalb der oeffentlichen Untergrenze existieren nicht im
 *    ausgelieferten Code. Sie stehen in einer Konfiguration, die nur der
 *    Server liest, und tauchen in keiner Antwort auf, solange kein gueltiger
 *    Code vorliegt.
 */

/* ── Produkte ───────────────────────────────────────────────────────── */

/** Die drei oeffentlich kaufbaren Produkte. Mehr gibt es nicht. */
export type ProductKey = "single" | "crew" | "doubleSeason";

/** Oeffentliche Preisstufe. Ergibt sich allein aus dem Zeitpunkt. */
export type PriceTier = "early" | "regular";

/* ── Kanaele ────────────────────────────────────────────────────────── */

/**
 * Woher ein Kauf kommt. Wird bei jedem Kauf mitgeschrieben, damit sich
 * hinterher beantworten laesst, welcher Kanal was gebracht hat.
 *
 * "public" ist der Normalfall ohne Code.
 */
export type Channel = "public" | "crm" | "student" | "drop" | "bar";

/* ── Preisfenster ───────────────────────────────────────────────────── */

/**
 * Ein Preisfenster hinter einem Code. Nie oeffentlich sichtbar.
 *
 * Die Codes selbst stehen NICHT hier drin. Sie liegen im Store, und zwar
 * ausschliesslich als Hash. Ein Fenster beschreibt nur die Bedingungen.
 */
export interface PriceWindow {
  /** Stabile Kennung, taucht im Kaufdatensatz auf. */
  id: string;
  channel: Exclude<Channel, "public">;
  /** Preis in ganzen Euro fuer den Einzelpass. */
  priceEur: number;
  /** Auf welche Produkte der Code anwendbar ist. */
  products: ProductKey[];
  /**
   * Wie viele Einloesungen das Fenster insgesamt zulaesst.
   * null bedeutet unbegrenzt.
   */
  quota: number | null;
  /** Beginn der Gueltigkeit als Zeitstempel in ms. null = ab sofort. */
  activeFrom: number | null;
  /** Ende der Gueltigkeit als Zeitstempel in ms. null = unbefristet. */
  activeUntil: number | null;
  /**
   * Freies Feld fuer die Kanalzuordnung, etwa die Bar-ID bei Bar-Codes.
   * Wird unveraendert in den Kaufdatensatz uebernommen.
   */
  channelRef?: string;
}

/* ── Ergebnis der Preisfindung ──────────────────────────────────────── */

export interface PriceResolution {
  product: ProductKey;
  /** Zu zahlender Betrag in ganzen Euro, inklusive Mehrwertsteuer. */
  amountEur: number;
  /**
   * Oeffentlicher Referenzpreis desselben Produkts zum selben Zeitpunkt.
   * Grundlage jeder Streichpreis-Darstellung. Nie kleiner als amountEur.
   */
  referenceEur: number;
  tier: PriceTier;
  channel: Channel;
  /** Gesetzt, wenn ein Code den Preis bestimmt hat. */
  windowId?: string;
  channelRef?: string;
}

/* ── Fehler ─────────────────────────────────────────────────────────── */

/**
 * Warum eine Einloesung abgelehnt wurde.
 *
 * Bewusst grob: Nach aussen darf nicht unterscheidbar sein, ob ein Code gar
 * nicht existiert oder ob er existiert und schon verbraucht ist. Sonst laesst
 * sich ueber die Antwortzeiten und Texte der Codebestand abfragen.
 */
export type RedeemFailure =
  | "unknown_code"
  | "already_used"
  | "window_inactive"
  | "quota_exhausted"
  | "product_mismatch"
  | "rate_limited";

export type RedeemResult =
  | { ok: true; resolution: PriceResolution }
  | { ok: false; reason: RedeemFailure };

/* ── Kaufdatensatz ──────────────────────────────────────────────────── */

/** Was bei jedem Kauf festgehalten wird. Vorgabe aus dem Brief. */
export interface PurchaseRecord {
  id: string;
  product: ProductKey;
  amountEur: number;
  tier: PriceTier;
  channel: Channel;
  windowId?: string;
  channelRef?: string;
  /** Hash des verwendeten Codes, nie der Code selbst. */
  codeHash?: string;
  /** Zeitpunkt in ms. */
  at: number;
}

/* ── Studentenverifikation ──────────────────────────────────────────── */

export type StudentVerificationFailure =
  | "domain_not_allowed"
  | "invalid_email"
  | "already_verified"
  | "rate_limited";

export type StudentStartResult =
  | { ok: true; token: string; expiresAt: number }
  | { ok: false; reason: StudentVerificationFailure };

export type StudentConfirmFailure = "invalid_token" | "expired_token" | "already_verified";

export type StudentConfirmResult =
  /** Es war noch Kontingent frei, der Code steht bereit. */
  | { ok: true; status: "code_issued"; code: string }
  /** Kontingent erschoepft, die Mailadresse steht jetzt auf der Warteliste. */
  | { ok: true; status: "waitlisted"; position: number }
  | { ok: false; reason: StudentConfirmFailure };
