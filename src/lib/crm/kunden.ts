/**
 * Kundensicht auf die Verkaeufe. Reine Funktionen, keine Netzaufrufe.
 *
 * Stripe kennt Zahlungen, Mailgun kennt Adressen. Was keiner von beiden
 * beantwortet, ist die Frage nach der Person dahinter: Wer hat mehrfach
 * gekauft, wer liest den Newsletter mit, und bei wem ist die Zahlung
 * gescheitert, ohne dass je ein Kauf durchging. Genau das wird hier
 * zusammengefuehrt, ueber die E-Mail-Adresse, weil sie das einzige Feld ist,
 * das beide Quellen kennen.
 *
 * Gescheiterte Zahlungen werden mitgenommen und nicht weggefiltert: Ein
 * Kunde, bei dem nur ein Fehlversuch steht, ist der Supportfall, der sich von
 * selbst meldet, und dann soll er hier schon stehen.
 */

import type { Mitglied } from "@/lib/newsletter/mitglieder";
import type { Sale } from "@/lib/stripe/report";

export type NewsletterStand = "aktiv" | "abgemeldet" | "nein";

export interface Kunde {
  /** Adresse, bereinigt: ohne Rand, in Kleinbuchstaben. */
  email: string;
  /** Der zuletzt angegebene Name, falls je einer angegeben wurde. */
  name?: string;
  /** Bezahlte Kaeufe, neueste zuerst. */
  kaeufe: Sale[];
  /** Zahlungen, die nicht durchgingen. */
  fehlversuche: number;
  /** Summe der bezahlten Kaeufe abzueglich Erstattungen. */
  nettoCents: number;
  /** Sekunden seit 1970. Fehlt, wenn nie ein Kauf durchging. */
  ersterKauf?: number;
  letzterKauf?: number;
  /** Juengster Fehlversuch, damit ein Kunde ohne Kauf trotzdem ein Datum hat. */
  letzterFehlversuch?: number;
  /** Verschiedene Produkte aus den bezahlten Kaeufen, zuletzt gekauftes zuerst. */
  produkte: string[];
  newsletter: NewsletterStand;
  /** Sprache aus dem Verteiler, falls dort bekannt. */
  locale?: "de" | "en";
}

export interface KundenErgebnis {
  /** Neueste Aktivitaet zuerst, siehe zuletzt(). */
  kunden: Kunde[];
  /**
   * Zahlungen ohne E-Mail-Adresse. Sie lassen sich niemandem zuordnen und
   * stehen deshalb nicht in der Liste, sollen aber nicht still verschwinden.
   */
  ohneAdresse: number;
}

/** Trim und Kleinschreibung. Leer, wenn nichts Brauchbares uebrig bleibt. */
function normalisiert(email: string | undefined): string {
  return (email ?? "").trim().toLowerCase();
}

/**
 * Sortierschluessel: der letzte Kauf, und wenn es keinen gibt, der letzte
 * Fehlversuch. So landet jemand, der gestern vergeblich zahlen wollte, oben
 * und nicht am Ende hinter allen, die je etwas gekauft haben.
 */
function zuletzt(k: Kunde): number {
  return k.letzterKauf ?? k.letzterFehlversuch ?? 0;
}

function zuKunde(email: string, alle: Sale[], mitglied: Mitglied | undefined): Kunde {
  const sortiert = [...alle].sort((a, b) => b.created - a.created);
  const kaeufe = sortiert.filter((s) => s.paid);
  const fehlversuche = sortiert.filter((s) => !s.paid);

  // Der juengste Name, der nicht leer ist. Stripe liefert den Namen aus dem
  // Checkout, und der kann bei einem spaeteren Kauf fehlen oder anders
  // geschrieben sein. Der neueste ist der, unter dem die Person zuletzt
  // aufgetreten ist.
  const name = sortiert.map((s) => s.name?.trim()).find((n) => n);

  const produkte: string[] = [];
  for (const s of kaeufe) {
    const p = s.metadata.product?.trim();
    if (p && !produkte.includes(p)) produkte.push(p);
  }

  return {
    email,
    name,
    kaeufe,
    fehlversuche: fehlversuche.length,
    nettoCents: kaeufe.reduce((n, s) => n + Math.max(0, s.amountCents - s.refundedCents), 0),
    ersterKauf: kaeufe.length ? kaeufe[kaeufe.length - 1].created : undefined,
    letzterKauf: kaeufe[0]?.created,
    letzterFehlversuch: fehlversuche[0]?.created,
    produkte,
    newsletter: mitglied ? (mitglied.subscribed ? "aktiv" : "abgemeldet") : "nein",
    locale: mitglied?.locale,
  };
}

/**
 * Fasst Zahlungen zu Kunden zusammen und gleicht sie mit dem Verteiler ab.
 *
 * Gruppiert wird ueber die bereinigte Adresse. Gross- und Kleinschreibung
 * gelten als gleich, weil dieselbe Person im Checkout mal so und mal so
 * tippt und sonst zweimal in der Liste staende.
 */
export function kundenAus(sales: Sale[], mitglieder: Mitglied[]): KundenErgebnis {
  const verteiler = new Map<string, Mitglied>();
  for (const m of mitglieder) {
    const adresse = normalisiert(m.email);
    if (adresse) verteiler.set(adresse, m);
  }

  const gruppen = new Map<string, Sale[]>();
  let ohneAdresse = 0;
  for (const s of sales) {
    const adresse = normalisiert(s.email);
    if (!adresse) {
      ohneAdresse += 1;
      continue;
    }
    const gruppe = gruppen.get(adresse);
    if (gruppe) gruppe.push(s);
    else gruppen.set(adresse, [s]);
  }

  const kunden = Array.from(gruppen.entries()).map(([email, alle]) =>
    zuKunde(email, alle, verteiler.get(email)),
  );
  kunden.sort((a, b) => zuletzt(b) - zuletzt(a));

  return { kunden, ohneAdresse };
}

export interface KundenBericht {
  gesamt: number;
  /** Zwei oder mehr bezahlte Kaeufe. */
  mehrfachkaeufer: number;
  /** Nur die Aktiven: An Abgemeldete wird nicht geschrieben. */
  imNewsletter: number;
  /**
   * Mindestens ein Fehlversuch und kein bezahlter Kauf. Das sind die, die
   * sich beim Support melden, und die Zahl soll auffallen, bevor sie es tun.
   */
  nurFehlversuch: number;
}

export function kundenBericht(kunden: Kunde[]): KundenBericht {
  return {
    gesamt: kunden.length,
    mehrfachkaeufer: kunden.filter((k) => k.kaeufe.length >= 2).length,
    imNewsletter: kunden.filter((k) => k.newsletter === "aktiv").length,
    nurFehlversuch: kunden.filter((k) => k.kaeufe.length === 0 && k.fehlversuche > 0).length,
  };
}

/**
 * Sucht in Adresse und Name, ab zwei Zeichen. Unter zwei Zeichen passt fast
 * alles, und eine Liste mit allem drin ist keine Antwort.
 */
export function sucheKunden(kunden: Kunde[], q: string): Kunde[] {
  const n = q.trim().toLowerCase();
  if (n.length < 2) return [];
  return kunden.filter((k) => k.email.includes(n) || (k.name?.toLowerCase().includes(n) ?? false));
}
