/**
 * Tests fuer die Auswertung.
 *
 *   npm run test:report
 *
 * Die Rechnung ist von den Netzaufrufen getrennt, deshalb braucht kein Test
 * hier einen Stripe-Zugang. Das ist der eigentliche Grund fuer die Trennung:
 * Zahlen, die im Dashboard stehen und Entscheidungen tragen, muessen pruefbar
 * sein, ohne dass jemand echte Umsaetze anfassen muss.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  berlinDayStart,
  buildReport,
  dailySeries,
  euro,
  findSales,
  inRange,
  kanalLabel,
  pace,
  produktLabel,
  quotaUsage,
  statusOf,
  type Sale,
} from "./report.ts";

/** Kurzschreibweise fuer einen Kauf. */
function kauf(over: Partial<Sale> = {}): Sale {
  return {
    id: `s${Math.random().toString(36).slice(2, 8)}`,
    amountCents: 3900,
    refundedCents: 0,
    currency: "eur",
    created: 1_760_000_000,
    paid: true,
    metadata: {},
    ...over,
  };
}

/* ── Grundrechnung ──────────────────────────────────────────────────── */

describe("Bericht", () => {
  it("zaehlt nur bezahlte Kaeufe", () => {
    const r = buildReport([kauf(), kauf(), kauf({ paid: false })], 0, 0);
    assert.equal(r.count, 2);
    assert.equal(r.grossCents, 7800);
  });

  it("zieht Erstattungen vom Umsatz ab", () => {
    const r = buildReport([kauf(), kauf({ refundedCents: 3900 })], 0, 0);
    assert.equal(r.grossCents, 7800);
    assert.equal(r.refundedCents, 3900);
    assert.equal(r.netCents, 3900);
  });

  it("rechnet eine Teilerstattung anteilig", () => {
    const r = buildReport([kauf({ amountCents: 11700, refundedCents: 3900 })], 0, 0);
    assert.equal(r.netCents, 7800);
  });

  it("laesst den Nettowert eines Kaufs nie unter null fallen", () => {
    // Sollte nicht vorkommen, aber eine negative Zahl im Dashboard waere
    // schlimmer als eine falsche Null, weil sie andere Summen mitreisst.
    const r = buildReport([kauf({ amountCents: 3900, refundedCents: 9999 })], 0, 0);
    assert.equal(r.byChannel[0].netCents, 0);
  });

  it("kommt mit einer leeren Liste zurecht", () => {
    const r = buildReport([], 0, 0);
    assert.equal(r.count, 0);
    assert.equal(r.netCents, 0);
    assert.equal(r.untaggedShare, 0);
    assert.deepEqual(r.byChannel, []);
  });
});

/* ── Gruppierung ────────────────────────────────────────────────────── */

describe("Gruppierung", () => {
  it("fasst nach Kanal zusammen und sortiert nach Umsatz", () => {
    const r = buildReport(
      [
        kauf({ metadata: { channel: "crm" }, amountCents: 2000 }),
        kauf({ metadata: { channel: "public" }, amountCents: 9000 }),
        kauf({ metadata: { channel: "public" }, amountCents: 1000 }),
      ],
      0,
      0,
    );
    assert.equal(r.byChannel[0].key, "public");
    assert.equal(r.byChannel[0].count, 2);
    assert.equal(r.byChannel[0].netCents, 10000);
    assert.equal(r.byChannel[1].key, "crm");
  });

  it("haelt Ohne Angabe immer am Ende, auch wenn es der groesste Posten ist", () => {
    // Sonst stuende der Hinweis auf fehlende Metadaten ganz oben und saehe
    // aus wie ein Kanal, den es gibt.
    const r = buildReport(
      [
        kauf({ metadata: {}, amountCents: 99000 }),
        kauf({ metadata: { channel: "crm" }, amountCents: 100 }),
      ],
      0,
      0,
    );
    assert.equal(r.byChannel[r.byChannel.length - 1].key, "__none");
    assert.equal(r.byChannel[r.byChannel.length - 1].label, "Ohne Angabe");
  });

  it("beschriftet bekannte Werte und laesst unbekannte stehen", () => {
    const r = buildReport(
      [kauf({ metadata: { product: "crew" } }), kauf({ metadata: { product: "sonderposten" } })],
      0,
      0,
    );
    const labels = r.byProduct.map((b) => b.label);
    assert.ok(labels.includes("Crew Pass"));
    assert.ok(labels.includes("sonderposten"));
  });

  it("behandelt leere Zeichenketten wie fehlende Angaben", () => {
    const r = buildReport([kauf({ metadata: { channel: "   " } })], 0, 0);
    assert.equal(r.byChannel[0].key, "__none");
  });

  it("zeigt bei Bar-Codes nur die Bar-Kaeufe", () => {
    const r = buildReport(
      [
        kauf({ metadata: { channel: "bar", channelRef: "bar-7" } }),
        kauf({ metadata: { channel: "bar", channelRef: "bar-7" } }),
        kauf({ metadata: { channel: "public" } }),
      ],
      0,
      0,
    );
    assert.equal(r.byBar.length, 1);
    assert.equal(r.byBar[0].key, "bar-7");
    assert.equal(r.byBar[0].count, 2);
  });
});

/* ── Fehlende Metadaten ─────────────────────────────────────────────── */

describe("Anteil ohne Angabe", () => {
  it("meldet den Anteil der Kaeufe ganz ohne Kanal und Produkt", () => {
    const r = buildReport([kauf({ metadata: {} }), kauf({ metadata: { channel: "crm" } })], 0, 0);
    assert.equal(r.untaggedShare, 0.5);
  });

  it("zaehlt einen Kauf mit Produkt aber ohne Kanal nicht als voellig ohne Angabe", () => {
    const r = buildReport([kauf({ metadata: { product: "single" } })], 0, 0);
    assert.equal(r.untaggedShare, 0);
  });

  it("beruecksichtigt nur bezahlte Kaeufe", () => {
    const r = buildReport([kauf({ paid: false, metadata: {} }), kauf({ metadata: { channel: "crm" } })], 0, 0);
    assert.equal(r.untaggedShare, 0);
  });
});

/* ── Kontingente ────────────────────────────────────────────────────── */

describe("Kontingente", () => {
  it("zaehlt gegen die Fenster-Kennung, nicht gegen den Kanal", () => {
    // Zwei Drops im selben Kanal duerfen sich nicht gegenseitig auffuellen.
    const sales = [
      kauf({ metadata: { channel: "drop", windowId: "drop-a" } }),
      kauf({ metadata: { channel: "drop", windowId: "drop-a" } }),
      kauf({ metadata: { channel: "drop", windowId: "drop-b" } }),
    ];
    const rows = quotaUsage(sales, [
      { id: "drop-a", label: "Drop A", quota: 10 },
      { id: "drop-b", label: "Drop B", quota: 10 },
    ]);
    assert.equal(rows[0].used, 2);
    assert.equal(rows[1].used, 1);
  });

  it("laesst unbezahlte Kaeufe kein Kontingent belegen", () => {
    const rows = quotaUsage([kauf({ paid: false, metadata: { windowId: "w" } })], [
      { id: "w", label: "W", quota: 5 },
    ]);
    assert.equal(rows[0].used, 0);
  });

  it("kommt mit einem Fenster ohne Obergrenze zurecht", () => {
    const rows = quotaUsage([kauf({ metadata: { windowId: "w" } })], [
      { id: "w", label: "W", quota: null },
    ]);
    assert.equal(rows[0].total, null);
    assert.equal(rows[0].used, 1);
  });
});

/* ── Zeitraum ───────────────────────────────────────────────────────── */

describe("Zeitraum", () => {
  it("schliesst den Beginn ein und das Ende aus", () => {
    const sales = [kauf({ created: 100 }), kauf({ created: 199 }), kauf({ created: 200 })];
    assert.equal(inRange(sales, 100, 200).length, 2);
  });

  it("bestimmt den Tagesbeginn in Berliner Zeit, nicht in UTC", () => {
    // 2026-07-01 00:30 UTC ist in Berlin bereits der 1. Juli, 02:30.
    // Der Tagesbeginn muss also der 30. Juni 22:00 UTC sein.
    const start = berlinDayStart(new Date(Date.UTC(2026, 6, 1, 0, 30)));
    assert.equal(start, Math.floor(Date.UTC(2026, 5, 30, 22, 0) / 1000));
  });

  it("liegt im Winter eine Stunde anders als im Sommer", () => {
    const winter = berlinDayStart(new Date(Date.UTC(2026, 11, 15, 12, 0)));
    assert.equal(winter, Math.floor(Date.UTC(2026, 11, 14, 23, 0) / 1000));
  });

  it("rechnet Tage zurueck", () => {
    const heute = berlinDayStart(new Date(Date.UTC(2026, 6, 10, 12, 0)));
    const vorSieben = berlinDayStart(new Date(Date.UTC(2026, 6, 10, 12, 0)), -7);
    assert.equal(heute - vorSieben, 7 * 86400);
  });
});

/* ── Darstellung ────────────────────────────────────────────────────── */

describe("Darstellung", () => {
  it("zeigt runde Betraege ohne Nachkommastellen", () => {
    assert.match(euro(3900), /^39\s?€$/);
  });

  it("zeigt krumme Betraege mit Nachkommastellen", () => {
    assert.match(euro(3950), /39,50/);
  });

  it("beschriftet Produkt und Kanal und benennt fehlende Angaben", () => {
    assert.equal(produktLabel("single"), "ON ICE Pass");
    assert.equal(produktLabel(undefined), "ohne Angabe");
    assert.equal(kanalLabel("bar"), "Bar-Codes");
    assert.equal(kanalLabel(undefined), "");
  });
});

/* ── Verlauf ────────────────────────────────────────────────────────── */

describe("Verlauf", () => {
  // 10. Juli 2026, 14 Uhr Berliner Zeit. Fest verdrahtet, damit der Test
  // nicht davon abhaengt, wann er laeuft.
  const anker = new Date(Date.UTC(2026, 6, 10, 12, 0));

  it("liefert genau so viele Tage wie verlangt, heute zuletzt", () => {
    const reihe = dailySeries([], anker, 3);
    assert.equal(reihe.length, 3);
    assert.equal(reihe[2].start, berlinDayStart(anker));
  });

  it("sortiert Kaeufe in den richtigen Tag", () => {
    const reihe = dailySeries(
      [
        kauf({ created: Math.floor(Date.UTC(2026, 6, 10, 12, 0) / 1000) }),
        // 8. Juli 23 Uhr UTC ist in Berlin schon der 9. Juli.
        kauf({ created: Math.floor(Date.UTC(2026, 6, 8, 23, 0) / 1000) }),
      ],
      anker,
      3,
    );
    assert.deepEqual(reihe.map((t) => t.count), [0, 1, 1]);
  });

  it("laesst Kaeufe vor dem Zeitraum weg", () => {
    const reihe = dailySeries([kauf({ created: Math.floor(Date.UTC(2026, 6, 1) / 1000) })], anker, 3);
    assert.deepEqual(reihe.map((t) => t.count), [0, 0, 0]);
  });

  it("zaehlt nur bezahlte Kaeufe und zieht Erstattungen ab", () => {
    const heute = Math.floor(Date.UTC(2026, 6, 10, 12, 0) / 1000);
    const reihe = dailySeries(
      [
        kauf({ created: heute, amountCents: 11700, refundedCents: 3900 }),
        kauf({ created: heute, paid: false }),
      ],
      anker,
      2,
    );
    assert.equal(reihe[1].count, 1);
    assert.equal(reihe[1].netCents, 7800);
  });

  it("haelt die Tagesgrenzen auch ueber die Zeitumstellung", () => {
    // Am 25. Oktober 2026 endet die Sommerzeit, der Tag hat 25 Stunden.
    // Eine feste Schrittweite von 86400 Sekunden waere hier daneben.
    const nachUmstellung = new Date(Date.UTC(2026, 9, 26, 12, 0));
    const reihe = dailySeries([], nachUmstellung, 2);
    assert.equal(reihe[1].start - reihe[0].start, 25 * 3600);
  });
});

/* ── Tempo ──────────────────────────────────────────────────────────── */

describe("Tempo", () => {
  /** Reihe aus Tageszahlen, letzter Wert ist der laufende Tag. */
  const reihe = (counts: number[]) =>
    counts.map((c, i) => ({ start: i * 86400, count: c, netCents: c * 3900 }));

  const jetzt = Date.UTC(2026, 6, 10);
  const in10Tagen = jetzt + 10 * 86_400_000;

  it("laesst den laufenden Tag aus dem Schnitt heraus", () => {
    // Ohne diese Regel saehe jeder Vormittag wie ein Einbruch aus.
    const p = pace(reihe([2, 2, 2, 0]), 3, jetzt, in10Tagen);
    assert.equal(p.perDay, 2);
    assert.equal(p.window, 6);
  });

  it("rechnet das Tempo bis zum Stichtag hoch", () => {
    const p = pace(reihe([2, 2, 2, 99]), 3, jetzt, in10Tagen);
    assert.equal(p.daysLeft, 10);
    assert.equal(p.expected, 20);
  });

  it("vergleicht mit dem gleich langen Zeitraum davor", () => {
    const p = pace(reihe([1, 1, 1, 2, 2, 2, 99]), 3, jetzt, in10Tagen);
    assert.equal(p.trend, 1);
  });

  it("meldet keinen Trend, wenn der Vergleichszeitraum unvollstaendig ist", () => {
    const p = pace(reihe([1, 2, 2, 2, 99]), 3, jetzt, in10Tagen);
    assert.equal(p.trend, null);
  });

  it("meldet keinen Trend, wenn der Vergleichszeitraum leer war", () => {
    // Sonst stuende dort eine Steigerung um unendlich Prozent.
    const p = pace(reihe([0, 0, 0, 2, 2, 2, 99]), 3, jetzt, in10Tagen);
    assert.equal(p.trend, null);
  });

  it("gibt nach dem Stichtag null Tage zurueck, nicht negative", () => {
    const p = pace(reihe([2, 2, 2, 0]), 3, jetzt, jetzt - 86_400_000);
    assert.equal(p.daysLeft, 0);
    assert.equal(p.expected, 0);
  });

  it("kommt mit einer Reihe ohne vollstaendige Tage zurecht", () => {
    const p = pace(reihe([5]), 7, jetzt, in10Tagen);
    assert.equal(p.perDay, 0);
    assert.equal(p.trend, null);
  });
});

/* ── Suche ──────────────────────────────────────────────────────────── */

describe("Suche", () => {
  const alle = [
    kauf({ id: "ch_aaa", email: "lena.hoffmann@beispiel.de", name: "Lena Hoffmann", created: 100 }),
    kauf({ id: "ch_bbb", email: "jonas@beispiel.de", name: "Jonas Brandt", created: 200 }),
    kauf({ id: "ch_ccc", paid: false, email: "lena.hoffmann@beispiel.de", name: "Lena Hoffmann", created: 300 }),
  ];

  it("findet ueber die Adresse", () => {
    assert.deepEqual(findSales(alle, "jonas@beispiel.de").map((s) => s.id), ["ch_bbb"]);
  });

  it("findet ueber einen Teil des Namens, ohne Ruecksicht auf Gross- und Kleinschreibung", () => {
    assert.equal(findSales(alle, "HOFFMANN").length, 2);
  });

  it("findet ueber die Zahlungs-ID", () => {
    assert.deepEqual(findSales(alle, "ch_bbb").map((s) => s.id), ["ch_bbb"]);
  });

  it("findet auch gescheiterte Zahlungen", () => {
    // Sie sind meist die Antwort auf "ich habe nichts bekommen".
    assert.ok(findSales(alle, "lena").some((s) => !s.paid));
  });

  it("zeigt den neuesten Treffer zuerst", () => {
    assert.deepEqual(findSales(alle, "lena").map((s) => s.id), ["ch_ccc", "ch_aaa"]);
  });

  it("liefert bei unter drei Zeichen nichts, statt alles", () => {
    assert.deepEqual(findSales(alle, "le"), []);
    assert.deepEqual(findSales(alle, "  "), []);
  });

  it("kommt mit Kaeufen ohne Namen und Adresse zurecht", () => {
    assert.deepEqual(findSales([kauf({ id: "ch_leer" })], "lena"), []);
  });

  it("findet ueber die Bar-Kennung", () => {
    const mitBar = [kauf({ id: "ch_bar", metadata: { channelRef: "bar-0007" } })];
    assert.equal(findSales(mitBar, "bar-0007").length, 1);
  });
});

describe("Status", () => {
  it("unterscheidet bezahlt, teilweise erstattet, erstattet und gescheitert", () => {
    assert.equal(statusOf(kauf()), "bezahlt");
    assert.equal(statusOf(kauf({ amountCents: 11700, refundedCents: 3900 })), "teilweise erstattet");
    assert.equal(statusOf(kauf({ amountCents: 3900, refundedCents: 3900 })), "erstattet");
    assert.equal(statusOf(kauf({ paid: false })), "fehlgeschlagen");
  });

  it("nennt eine gescheiterte Zahlung auch dann gescheitert, wenn etwas erstattet wurde", () => {
    assert.equal(statusOf(kauf({ paid: false, refundedCents: 3900 })), "fehlgeschlagen");
  });
});
