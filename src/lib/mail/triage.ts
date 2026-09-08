/**
 * Sortiert eine Supportmail in eine von sechs Schubladen. Ohne KI, ohne Netz.
 *
 * Warum so schlicht: Der Posteingang fuellt sich in Wellen, und die Sichtung
 * soll auf jedem Rechner in Millisekunden dasselbe Ergebnis liefern. Ein
 * Sprachmodell waere bei seltenen Formulierungen treffsicherer, aber weder
 * nachvollziehbar noch testbar. Hier steht jede Regel als Wort in einer
 * Liste. Wer eine Fehleinordnung sieht, ergaenzt das Wort, und ein Test
 * haelt fest, dass die Aenderung die anderen Faelle nicht kippt.
 *
 * Die Trefferliste kommt mit zurueck, damit die Seite zeigen kann, warum
 * eine Mail in einer Schublade liegt.
 */

import type { KaufKontext } from "./kontext";
import type { SupportMail } from "./types";

export type Kategorie = "zahlung" | "ticket" | "gruppe" | "partner" | "presse" | "sonstiges";

/* Die Reihenfolge ist zugleich der Stichentscheid bei gleicher Punktzahl:
   Eine Geldfrage ist dringender als eine Ticketfrage, und beide sind
   dringender als Anfragen, die ohnehin an eine andere Person weitergehen. */
export const KATEGORIEN: Kategorie[] = ["zahlung", "ticket", "gruppe", "partner", "presse", "sonstiges"];

export const KATEGORIE_LABEL: Record<Kategorie, string> = {
  zahlung: "Zahlung",
  ticket: "Ticket",
  gruppe: "Gruppe",
  partner: "Partner",
  presse: "Presse",
  sonstiges: "Sonstiges",
};

export interface Triage {
  kategorie: Kategorie;
  /** 0 bis 1. Bei 0 hat kein Stichwort gezogen, die Mail muss gelesen werden. */
  sicherheit: number;
  /** Die Stichwoerter, die gezogen haben, in der Schreibung der Liste. */
  treffer: string[];
}

/* ── Gewichte ────────────────────────────────────────────────────────── */

/* Der Betreff sagt meist, worum es geht, die Vorschau schweift ab. Deshalb
   zaehlt ein Treffer im Betreff doppelt. */
const GEWICHT_BETREFF = 2;
const GEWICHT_VORSCHAU = 1;

/* Eine gescheiterte Zahlung im Kaufkontext wiegt mehr als ein Betreff: "Ich
   habe keine Bestaetigung bekommen" klingt nach Ticket, ist aber fast immer
   eine Zahlungsfrage, und die Stripe-Daten wissen das sicherer als der Text. */
const SCHUB_FEHLGESCHLAGEN = 3;

/* Ab dieser Punktzahl gilt die Einordnung als satt. Ein einzelnes Wort im
   Betreff bringt 2 Punkte und damit hoechstens die halbe Sicherheit; erst
   mehrere Treffer zusammen kommen an die 1 heran. */
const SATT = 4;

/* ── Stichwoerter ────────────────────────────────────────────────────── */

interface Stichwort {
  /** Anzeigename fuer die Trefferliste. */
  label: string;
  /**
   * Formen in Kleinschreibung. Ein Stern am Ende erlaubt Weiterfuehrung im
   * Wort: "ticket*" trifft auch Tickets und Ticketkauf. Ohne Stern muss das
   * Wort dort enden, sonst traefe "pass" auch "passiert" und "app" "apple".
   */
  formen: string[];
}

const STICHWOERTER: Record<Exclude<Kategorie, "sonstiges">, Stichwort[]> = {
  zahlung: [
    { label: "Zahlung", formen: ["zahlung*", "bezahl*", "zahlen", "gezahlt", "payment*", "paid", "pay"] },
    { label: "abgebucht", formen: ["abgebucht", "abbuchung*", "belastet", "charged", "charge"] },
    { label: "Rückerstattung", formen: ["rückerstatt*", "zurückerstatt*", "erstatt*", "refund*", "geld zurück", "money back"] },
    { label: "Rechnung", formen: ["rechnung*", "invoice*", "quittung*", "receipt*", "beleg"] },
    { label: "Storno", formen: ["storno*", "stornier*", "cancel*", "widerruf*", "kündig*"] },
    { label: "doppelt", formen: ["doppelt*", "zweimal", "twice"] },
    { label: "Zahlungsart", formen: ["kreditkarte*", "credit card", "paypal", "klarna", "lastschrift*", "überweisung*", "bank", "bank account"] },
  ],
  ticket: [
    { label: "Pass", formen: ["pass", "pässe", "passes"] },
    { label: "Ticket", formen: ["ticket*"] },
    { label: "Kauf", formen: ["kauf*", "gekauft", "bestell*", "purchase*", "bought", "buy"] },
    { label: "Bestätigung", formen: ["bestätigung*", "confirmation*", "confirm*"] },
    { label: "QR", formen: ["qr*"] },
    { label: "Code", formen: ["code", "codes", "gutschein*", "voucher*", "einlös*", "redeem*"] },
    { label: "App", formen: ["app"] },
    { label: "Login", formen: ["login", "log in", "anmeld*", "einlogg*", "sign in", "signin"] },
    { label: "Zugang", formen: ["zugang*", "access"] },
    { label: "Gültigkeit", formen: ["gültig*", "valid", "validity"] },
    { label: "Route", formen: ["route*", "trail*", "reservier*", "reservation*", "book*"] },
    { label: "Double Season", formen: ["double season"] },
    { label: "Crew Pass", formen: ["crew pass*", "crew-pass*"] },
  ],
  gruppe: [
    { label: "Team", formen: ["team", "teams", "team nights", "team night", "teamevent*", "team event*"] },
    { label: "Firma", formen: ["firma", "firmen*", "company", "companies", "unternehmen"] },
    { label: "Corporate", formen: ["corporate"] },
    { label: "Gruppe", formen: ["gruppe*", "group*"] },
    { label: "Weihnachtsfeier", formen: ["weihnachtsfeier*", "christmas party", "xmas party", "betriebsausflug*", "betriebsfeier*"] },
    { label: "Kollegen", formen: ["kolleg*", "colleague*", "mitarbeiter*", "employee*", "staff"] },
    { label: "Sammelrechnung", formen: ["sammelrechnung*", "single invoice", "auf firma"] },
    { label: "JGA", formen: ["jga", "junggesell*", "bachelor*", "hen party", "stag party"] },
  ],
  partner: [
    { label: "Bar", formen: ["bar", "unsere bar", "meine bar", "our bar", "my bar", "als bar", "barbetreiber*", "bar owner*", "cocktailbar"] },
    { label: "teilnehmen als Bar", formen: ["teilnehmen als bar", "als bar teilnehmen", "mitmachen", "participate", "join as"] },
    { label: "Sponsoring", formen: ["sponsor*"] },
    { label: "Kooperation", formen: ["kooperation*", "kooperier*", "cooperation*", "collaborat*", "zusammenarbeit*"] },
    { label: "Partner", formen: ["partner*"] },
    { label: "Betreiber", formen: ["betreib*", "inhaber*", "owner", "gastronom*", "gastro"] },
    { label: "Werbung", formen: ["werbung*", "advertis*", "brand", "marke", "lieferant*", "supplier*"] },
  ],
  presse: [
    { label: "Presse", formen: ["presse*", "press", "press release", "pressemitteilung*"] },
    { label: "Redaktion", formen: ["redaktion*", "redakteur*", "journalist*", "zeitung*", "magazin*", "magazine", "verlag*", "podcast*", "blogger*"] },
    { label: "Akkreditierung", formen: ["akkredit*", "accredit*"] },
    { label: "Interview", formen: ["interview*"] },
    { label: "Medien", formen: ["media", "medien*", "bildmaterial", "pressefoto*", "press photo*", "fotograf*", "photograph*", "drehgenehmigung*", "filmen"] },
    { label: "Bericht", formen: ["berichten", "berichterstatt*", "coverage", "artikel", "article", "beitrag"] },
  ],
};

/* ── Muster ──────────────────────────────────────────────────────────── */

/* Wortgrenzen von Hand statt \b: \b kennt nur ASCII und wuerde in "Pässe"
   nach dem P eine Grenze sehen. Kein u-Flag, das ist im Projekt so
   vereinbart. */
const BUCHSTABE = "a-z0-9äöüß";

function muster(form: string): RegExp {
  const offen = form.endsWith("*");
  const kern = (offen ? form.slice(0, -1) : form).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const ende = offen ? "" : `(?![${BUCHSTABE}])`;
  return new RegExp(`(^|[^${BUCHSTABE}])${kern}${ende}`);
}

interface Regel {
  kategorie: Exclude<Kategorie, "sonstiges">;
  label: string;
  muster: RegExp[];
}

/* Einmal beim Laden uebersetzt, nicht bei jeder Mail. */
const REGELN: Regel[] = (Object.keys(STICHWOERTER) as Array<Exclude<Kategorie, "sonstiges">>).flatMap(
  (kategorie) =>
    STICHWOERTER[kategorie].map((s) => ({
      kategorie,
      label: s.label,
      muster: s.formen.map(muster),
    })),
);

function normalisieren(text: string): string {
  /* Kleinschreibung statt i-Flag, damit die Umlaute sicher gleich behandelt
     werden. Leerraum zusammenziehen, damit "log  in" wie "log in" trifft. */
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

/* ── Einordnung ──────────────────────────────────────────────────────── */

export function triage(
  mail: Pick<SupportMail, "subject" | "preview">,
  kontext?: Pick<KaufKontext, "einordnung">,
): Triage {
  const betreff = normalisieren(mail.subject);
  const vorschau = normalisieren(mail.preview);

  const punkte: Record<Kategorie, number> = {
    zahlung: 0,
    ticket: 0,
    gruppe: 0,
    partner: 0,
    presse: 0,
    sonstiges: 0,
  };
  const treffer: string[] = [];

  for (const regel of REGELN) {
    // Jedes Stichwort zaehlt pro Feld hoechstens einmal. Sonst gewinnt eine
    // Mail, die fuenfmal "Ticket" schreibt, gegen den Kaufkontext.
    const imBetreff = regel.muster.some((m) => m.test(betreff));
    const inVorschau = regel.muster.some((m) => m.test(vorschau));
    if (!imBetreff && !inVorschau) continue;

    punkte[regel.kategorie] += (imBetreff ? GEWICHT_BETREFF : 0) + (inVorschau ? GEWICHT_VORSCHAU : 0);
    treffer.push(regel.label);
  }

  if (kontext?.einordnung === "fehlgeschlagen") {
    punkte.zahlung += SCHUB_FEHLGESCHLAGEN;
    treffer.push("Zahlung gescheitert");
  }

  const gesamt = KATEGORIEN.reduce((summe, k) => summe + punkte[k], 0);
  if (gesamt === 0) return { kategorie: "sonstiges", sicherheit: 0, treffer: [] };

  // Erste Kategorie mit der hoechsten Punktzahl gewinnt, in der Reihenfolge
  // von KATEGORIEN. Das ist der Stichentscheid.
  let beste: Kategorie = "sonstiges";
  let hoechste = 0;
  for (const k of KATEGORIEN) {
    if (punkte[k] > hoechste) {
      beste = k;
      hoechste = punkte[k];
    }
  }

  // Anteil an allen Punkten, gedaempft nach absoluter Hoehe: Ein einzelnes
  // Wort ist auch dann keine sichere Einordnung, wenn es das einzige war.
  const anteil = hoechste / gesamt;
  const saettigung = Math.min(1, hoechste / SATT);
  const sicherheit = Math.round(anteil * saettigung * 100) / 100;

  return { kategorie: beste, sicherheit, treffer };
}
