/**
 * Erfundene Verkaeufe, damit das Dashboard ohne Stripe-Zugang etwas zeigt.
 *
 * Zweck ist nicht Schoenheit, sondern Einrichtbarkeit: Wer die Seite zum
 * ersten Mal oeffnet, soll sehen, wie sie mit Daten aussieht, statt vor
 * lauter Nullen zu raten, ob etwas kaputt ist.
 *
 * Die Zahlen sind bewusst so gewaehlt, dass die unangenehmen Faelle sichtbar
 * werden: Kaeufe ohne Metadaten, eine Rueckerstattung, ein fast volles
 * Kontingent. Ein Demodatensatz, in dem alles glatt laeuft, versteckt genau
 * die Zustaende, fuer die man ein Dashboard baut.
 *
 * Die Betraege sind frei erfunden und ausdruecklich NICHT die echten. Der
 * Preis der Code-Fenster steht nirgends im Repository, auch nicht als
 * Demozahl: So rutscht er sonst irgendwann in etwas Oeffentliches. Wer die
 * Demo mit echten Zahlen sehen will, hinterlegt den Stripe-Schluessel.
 */

import type { Sale } from "./report";

/** Frei erfundener Betrag fuer Kaeufe mit Code. Nicht der echte. */
const DEMO_CODE_CENT = 2500;

/**
 * Erfundene Kaeufer, damit sich die Suche ohne Stripe-Zugang ausprobieren
 * laesst. Die Domain ist bewusst beispiel.de: So ist auf einen Blick klar,
 * dass hier niemand Echtes steht.
 */
const NAMEN = [
  "Lena Hoffmann",
  "Jonas Brandt",
  "Mira Yilmaz",
  "Paul Reinhardt",
  "Sofia Kellner",
  "Tobias Wagner",
  "Amelie Kruse",
  "Nils Bergmann",
  "Clara Wendt",
  "Elias Fassbender",
  "Johanna Steiner",
  "Ben Lorenz",
];

function kaeufer(n: number): { name: string; email: string } {
  const name = NAMEN[n % NAMEN.length];
  const [vor, nach] = name.toLowerCase().split(" ");
  // Ab dem zweiten Durchlauf eine Ziffer anhaengen, sonst haetten zwei
  // verschiedene Kaeufe dieselbe Adresse.
  const nummer = Math.floor(n / NAMEN.length);
  return {
    name,
    email: `${vor}.${nach}${nummer > 0 ? nummer : ""}@beispiel.de`,
  };
}

interface Muster {
  produkt: "single" | "crew" | "doubleSeason";
  stufe: "early" | "regular";
  kanal: "public" | "crm" | "student" | "drop" | "bar";
  fenster?: string;
  barRef?: string;
  cent: number;
  anteil: number;
}

const MUSTER: Muster[] = [
  { produkt: "single", stufe: "early", kanal: "public", cent: 3900, anteil: 46 },
  { produkt: "crew", stufe: "early", kanal: "public", cent: 11700, anteil: 12 },
  { produkt: "doubleSeason", stufe: "early", kanal: "public", cent: 7900, anteil: 8 },
  { produkt: "single", stufe: "early", kanal: "crm", fenster: "crm-newsletter-2026", cent: DEMO_CODE_CENT, anteil: 14 },
  { produkt: "single", stufe: "early", kanal: "student", fenster: "student-2026", cent: DEMO_CODE_CENT, anteil: 9 },
  { produkt: "single", stufe: "early", kanal: "drop", fenster: "drop-halloween", cent: DEMO_CODE_CENT, anteil: 4 },
  { produkt: "single", stufe: "early", kanal: "bar", fenster: "bar-0007", barRef: "bar-0007", cent: DEMO_CODE_CENT, anteil: 3 },
  { produkt: "single", stufe: "early", kanal: "bar", fenster: "bar-0012", barRef: "bar-0012", cent: DEMO_CODE_CENT, anteil: 2 },
];

/**
 * Wiederholbare Pseudozufallszahlen.
 *
 * Ein echtes Math.random wuerde bei jedem Neuladen andere Zahlen zeigen, und
 * dann laesst sich nicht unterscheiden, ob sich die Daten geaendert haben
 * oder nur der Zufall.
 */
function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function demoSales(fromSeconds: number, jetzt: number = Math.floor(Date.now() / 1000)): Sale[] {
  const zufall = rng(20261117);
  const spanne = Math.max(3600, jetzt - fromSeconds);
  const sales: Sale[] = [];
  let n = 0;

  for (const m of MUSTER) {
    for (let i = 0; i < m.anteil; i++) {
      // Neuere Kaeufe haeufiger als alte, das entspricht einem Vorverkauf,
      // der anzieht.
      const t = jetzt - Math.floor(spanne * Math.pow(zufall(), 1.8));
      const person = kaeufer(n);
      sales.push({
        ...person,
        receiptUrl: "https://dashboard.stripe.com/",
        id: `demo_${String(n++).padStart(4, "0")}`,
        amountCents: m.cent,
        refundedCents: 0,
        currency: "eur",
        created: t,
        paid: true,
        metadata: {
          product: m.produkt,
          tier: m.stufe,
          channel: m.kanal,
          ...(m.fenster ? { windowId: m.fenster } : {}),
          ...(m.barRef ? { channelRef: m.barRef } : {}),
        },
      });
    }
  }

  /* Zwei Faelle, die im Betrieb wehtun und deshalb in die Demo gehoeren. */

  // Eine Rueckerstattung, damit brutto und netto sichtbar auseinanderlaufen.
  if (sales.length) sales[0] = { ...sales[0], refundedCents: sales[0].amountCents };

  // Kaeufe ohne Metadaten. Genau die entstehen, wenn der Shop die Felder
  // nicht mitschickt, und genau die will man im Dashboard bemerken.
  for (let i = 0; i < 6; i++) {
    sales.push({
      ...kaeufer(100 + i),
      id: `demo_ohne_${i}`,
      amountCents: 3900,
      refundedCents: 0,
      currency: "eur",
      created: jetzt - Math.floor(spanne * zufall()),
      paid: true,
      metadata: {},
    });
  }

  // Eine gescheiterte Zahlung, die nicht mitzaehlen darf.
  // Eine gescheiterte Zahlung mit Namen: Genau danach wird gesucht, wenn
  // jemand schreibt, er habe nichts bekommen. Die Nummer liegt bewusst weit
  // ausserhalb der Schleife oben, damit die Adresse sonst nirgends kauft.
  // Nur so zeigt der Supportbereich den Fall "Zahlung gescheitert, kein
  // bezahlter Kauf" unverfaelscht.
  sales.push({
    ...kaeufer(200),
    id: "demo_fehlgeschlagen",
    amountCents: 3900,
    refundedCents: 0,
    currency: "eur",
    created: jetzt - 900,
    paid: false,
    metadata: { product: "single", tier: "early", channel: "public" },
  });

  return sales.sort((a, b) => b.created - a.created);
}
