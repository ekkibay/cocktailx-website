/**
 * Tests fuer Preisfindung, Code-Einloesung und Studentenverifikation.
 *
 *   npm run test:tickets
 *
 * Laeuft mit dem Testrunner von Node und dessen TypeScript-Unterstuetzung,
 * bewusst ohne zusaetzliche Abhaengigkeit. Deshalb auch nur relative Importe:
 * Die Pfadaliase des Projekts kennt Node nicht.
 */

import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";

import { berlinWallClockToTimestamp } from "../time/berlin.ts";
import { parseWindows } from "./config.ts";
import { publicPrice, tierAt, windowIsActive, windowPrice, type PublicPriceTable } from "./pricing.ts";
import { commit, quote, release, reserve } from "./redeem.ts";
import { createInMemoryStore, hashCode, normalizeCode } from "./store.ts";
import {
  confirmVerification,
  domainAllowed,
  looksLikeEmail,
  startVerification,
} from "./students.ts";
import type { PriceWindow } from "./types.ts";

/* Der Schluessel muss stehen, bevor irgendetwas gehasht wird. */
const PREV_SECRET = process.env.TICKET_CODE_SECRET;
before(() => {
  process.env.TICKET_CODE_SECRET = "test-secret-mindestens-zweiunddreissig-zeichen";
});
after(() => {
  if (PREV_SECRET === undefined) delete process.env.TICKET_CODE_SECRET;
  else process.env.TICKET_CODE_SECRET = PREV_SECRET;
});

const REGULAR_STARTS_AT = berlinWallClockToTimestamp(2026, 10, 16, 0, 0);

const PRICES: PublicPriceTable = {
  earlyEur: 39,
  regularEur: 49,
  regularStartsAt: REGULAR_STARTS_AT,
  crewSize: 4,
  crewPaid: 3,
  doubleSeasonEur: 79,
};

/** Ein Zeitpunkt sicher innerhalb bzw. ausserhalb des Einstiegsfensters. */
const IM_FENSTER = berlinWallClockToTimestamp(2026, 9, 1, 12, 0);
const NACH_FENSTER = berlinWallClockToTimestamp(2026, 11, 1, 12, 0);

function fenster(over: Partial<PriceWindow> = {}): PriceWindow {
  return {
    id: "crm-test",
    channel: "crm",
    priceEur: 29,
    products: ["single"],
    quota: null,
    activeFrom: null,
    activeUntil: null,
    ...over,
  };
}

/* ── Preisumstellung ────────────────────────────────────────────────── */

describe("Preisumstellung", () => {
  it("schaltet erst mit dem 16. Oktober um", () => {
    const kurzDavor = REGULAR_STARTS_AT - 1;
    assert.equal(tierAt(kurzDavor, PRICES), "early");
    assert.equal(tierAt(REGULAR_STARTS_AT, PRICES), "regular");
  });

  it("haelt die letzte Minute des 15. Oktober noch beim Einstiegspreis", () => {
    const letzteMinute = berlinWallClockToTimestamp(2026, 10, 15, 23, 59);
    assert.equal(tierAt(letzteMinute, PRICES), "early");
    assert.equal(publicPrice("single", letzteMinute, PRICES).amountEur, 39);
  });

  it("rechnet die Grenze in Berliner Zeit, nicht in UTC", () => {
    // Im Oktober liegt Berlin zwei Stunden vor UTC. Der Umschaltzeitpunkt
    // muss deshalb am 15.10. um 22:00 UTC liegen.
    const alsUtc = Date.UTC(2026, 9, 15, 22, 0);
    assert.equal(REGULAR_STARTS_AT, alsUtc);
  });

  it("gibt den Einzelpass je Stufe richtig aus", () => {
    assert.equal(publicPrice("single", IM_FENSTER, PRICES).amountEur, 39);
    assert.equal(publicPrice("single", NACH_FENSTER, PRICES).amountEur, 49);
  });

  it("koppelt den Crew Pass an den jeweils gueltigen Einzelpreis", () => {
    assert.equal(publicPrice("crew", IM_FENSTER, PRICES).amountEur, 117);
    assert.equal(publicPrice("crew", NACH_FENSTER, PRICES).amountEur, 147);
  });

  it("laesst Double Season in beiden Stufen unveraendert", () => {
    assert.equal(publicPrice("doubleSeason", IM_FENSTER, PRICES).amountEur, 79);
    assert.equal(publicPrice("doubleSeason", NACH_FENSTER, PRICES).amountEur, 79);
  });

  it("gibt Double Season keinen Streichpreis", () => {
    const p = publicPrice("doubleSeason", IM_FENSTER, PRICES);
    assert.equal(p.amountEur, p.referenceEur);
  });

  it("nennt beim Crew Pass vier Einzelpaesse als Vergleich", () => {
    assert.equal(publicPrice("crew", IM_FENSTER, PRICES).referenceEur, 156);
    assert.equal(publicPrice("crew", NACH_FENSTER, PRICES).referenceEur, 196);
  });

  it("unterschreitet den Referenzpreis oeffentlich nie", () => {
    for (const now of [IM_FENSTER, NACH_FENSTER, REGULAR_STARTS_AT]) {
      const p = publicPrice("single", now, PRICES);
      assert.ok(p.amountEur >= PRICES.earlyEur, `${p.amountEur} unter der Untergrenze`);
      assert.ok(p.amountEur <= p.referenceEur);
    }
  });
});

/* ── Fenster ────────────────────────────────────────────────────────── */

describe("Preisfenster", () => {
  it("achtet auf Start und Ende", () => {
    const w = fenster({ activeFrom: 1000, activeUntil: 2000 });
    assert.equal(windowIsActive(w, 999), false);
    assert.equal(windowIsActive(w, 1000), true);
    assert.equal(windowIsActive(w, 1999), true);
    assert.equal(windowIsActive(w, 2000), false, "Ende ist exklusiv");
  });

  it("laesst offene Fenster immer zu", () => {
    assert.equal(windowIsActive(fenster(), 0), true);
  });

  it("nimmt beim Crew Pass den dreifachen Fensterpreis", () => {
    const r = windowPrice("crew", fenster({ products: ["crew"] }), IM_FENSTER, PRICES);
    assert.equal(r.amountEur, 87);
  });

  it("laesst den oeffentlichen Referenzpreis stehen", () => {
    const r = windowPrice("single", fenster(), IM_FENSTER, PRICES);
    assert.equal(r.referenceEur, 49);
  });

  it("macht einen Kauf nie teurer, auch bei falsch gepflegtem Fenster", () => {
    const teuer = fenster({ priceEur: 99 });
    const r = windowPrice("single", teuer, IM_FENSTER, PRICES);
    assert.equal(r.amountEur, 39, "der oeffentliche Preis muss gewinnen");
  });

  it("uebernimmt Kanal und Kanalbezug in das Ergebnis", () => {
    const w = fenster({ id: "bar-07", channel: "bar", channelRef: "bar-id-7" });
    const r = windowPrice("single", w, IM_FENSTER, PRICES);
    assert.equal(r.channel, "bar");
    assert.equal(r.channelRef, "bar-id-7");
    assert.equal(r.windowId, "bar-07");
  });
});

/* ── Codes ──────────────────────────────────────────────────────────── */

describe("Code-Einloesung", () => {
  function aufbau(over: Partial<PriceWindow> = {}) {
    const window = fenster(over);
    const store = createInMemoryStore({ codes: [{ code: "ICE-2026-AAAA", windowId: window.id }] });
    return { store, deps: { store, windows: [window], prices: PRICES, now: IM_FENSTER } };
  }

  it("gibt ohne Code den oeffentlichen Preis", async () => {
    const { deps } = aufbau();
    const r = await quote("single", null, deps);
    assert.ok(r.ok);
    assert.equal(r.resolution.amountEur, 39);
    assert.equal(r.resolution.channel, "public");
  });

  it("erkennt den Code unabhaengig von Schreibweise und Bindestrichen", async () => {
    const { deps } = aufbau();
    for (const eingabe of ["ICE-2026-AAAA", "ice2026aaaa", " Ice-2026 aaaa "]) {
      const r = await quote("single", eingabe, deps);
      assert.ok(r.ok, `${eingabe} wurde nicht erkannt`);
    }
  });

  it("verbraucht bei der Vorschau nichts", async () => {
    const { store, deps } = aufbau();
    await quote("single", "ICE-2026-AAAA", deps);
    const rec = await store.findCode(hashCode("ICE-2026-AAAA"));
    assert.equal(rec?.redeemedAt, null);
  });

  it("lehnt unbekannte Codes ab", async () => {
    const { deps } = aufbau();
    const r = await quote("single", "GIBTESNICHT", deps);
    assert.ok(!r.ok);
    assert.equal(r.reason, "unknown_code");
  });

  it("laesst einen Code genau einmal zu", async () => {
    const { deps } = aufbau();
    const erst = await reserve("single", "ICE-2026-AAAA", deps);
    assert.ok(erst.ok);
    const zweit = await reserve("single", "ICE-2026-AAAA", deps);
    assert.ok(!zweit.ok);
    assert.equal(zweit.reason, "already_used");
  });

  it("gibt den Code nach einem Abbruch wieder frei", async () => {
    const { deps } = aufbau();
    const res = await reserve("single", "ICE-2026-AAAA", deps);
    assert.ok(res.ok);
    await release(res.reservation, deps);
    const nochmal = await reserve("single", "ICE-2026-AAAA", deps);
    assert.ok(nochmal.ok, "nach Freigabe muss der Code wieder gehen");
  });

  it("lehnt den Code fuer ein anderes Produkt ab", async () => {
    const { deps } = aufbau({ products: ["single"] });
    const r = await quote("crew", "ICE-2026-AAAA", deps);
    assert.ok(!r.ok);
    assert.equal(r.reason, "product_mismatch");
  });

  it("achtet auf das Zeitfenster eines Drops", async () => {
    const { deps } = aufbau({
      channel: "drop",
      activeFrom: IM_FENSTER + 1000,
      activeUntil: IM_FENSTER + 2000,
    });
    const r = await quote("single", "ICE-2026-AAAA", deps);
    assert.ok(!r.ok);
    assert.equal(r.reason, "window_inactive");
  });

  it("haelt das Kontingent ein", async () => {
    const window = fenster({ quota: 1 });
    const store = createInMemoryStore({
      codes: [
        { code: "CODE-A", windowId: window.id },
        { code: "CODE-B", windowId: window.id },
      ],
    });
    const deps = { store, windows: [window], prices: PRICES, now: IM_FENSTER };

    const a = await reserve("single", "CODE-A", deps);
    assert.ok(a.ok);
    const b = await reserve("single", "CODE-B", deps);
    assert.ok(!b.ok);
    assert.equal(b.reason, "quota_exhausted");
  });

  it("gibt den Code frei, wenn nur das Kontingent voll ist", async () => {
    const window = fenster({ quota: 1 });
    const store = createInMemoryStore({
      codes: [
        { code: "CODE-A", windowId: window.id },
        { code: "CODE-B", windowId: window.id },
      ],
    });
    const deps = { store, windows: [window], prices: PRICES, now: IM_FENSTER };
    await reserve("single", "CODE-A", deps);
    await reserve("single", "CODE-B", deps);
    const rec = await store.findCode(hashCode("CODE-B"));
    assert.equal(rec?.redeemedAt, null, "CODE-B darf nicht verbrannt sein");
  });

  it("schreibt Preisstufe, Kanal, Code und Zeitstempel fort", async () => {
    const window = fenster({ id: "bar-12", channel: "bar", channelRef: "bar-id-12" });
    const store = createInMemoryStore({ codes: [{ code: "BAR-12-XYZ", windowId: window.id }] });
    const deps = { store, windows: [window], prices: PRICES, now: IM_FENSTER };

    const res = await reserve("single", "BAR-12-XYZ", deps);
    assert.ok(res.ok);
    const record = await commit(res.reservation, deps);

    assert.equal(record.tier, "early");
    assert.equal(record.channel, "bar");
    assert.equal(record.channelRef, "bar-id-12");
    assert.equal(record.windowId, "bar-12");
    assert.equal(record.codeHash, hashCode("BAR-12-XYZ"));
    assert.equal(record.at, IM_FENSTER);
    assert.equal(record.amountEur, 29);
  });

  it("merkt sich beim oeffentlichen Kauf den Kanal public und keinen Code", async () => {
    const { deps } = aufbau();
    const res = await reserve("single", null, deps);
    assert.ok(res.ok);
    const record = await commit(res.reservation, deps);
    assert.equal(record.channel, "public");
    assert.equal(record.codeHash, undefined);
    assert.equal(record.amountEur, 39);
  });

  it("greift die Bremse, bevor der Code geprueft wird", async () => {
    const { deps } = aufbau();
    const r = await quote("single", "ICE-2026-AAAA", {
      ...deps,
      allowAttempt: async () => false,
      attemptKey: "ip-1",
    });
    assert.ok(!r.ok);
    assert.equal(r.reason, "rate_limited");
  });
});

/* ── Studenten ──────────────────────────────────────────────────────── */

describe("Studentenverifikation", () => {
  const DOMAINS = ["lmu.de", "tum.de", "hm.edu"];

  it("erlaubt die hinterlegten Hochschulen", () => {
    assert.ok(domainAllowed("a@lmu.de", DOMAINS));
    assert.ok(domainAllowed("a@tum.de", DOMAINS));
    assert.ok(domainAllowed("a@hm.edu", DOMAINS));
  });

  it("erlaubt Subdomains der Hochschulen", () => {
    assert.ok(domainAllowed("a@campus.lmu.de", DOMAINS));
    assert.ok(domainAllowed("a@mytum.tum.de", DOMAINS));
  });

  it("faellt nicht auf angehaengte Domains herein", () => {
    assert.equal(domainAllowed("a@nichtlmu.de", DOMAINS), false);
    assert.equal(domainAllowed("a@lmu.de.example.com", DOMAINS), false);
    assert.equal(domainAllowed("a@tum.de.evil.tld", DOMAINS), false);
  });

  it("lehnt freie Anbieter ab", () => {
    assert.equal(domainAllowed("a@gmail.com", DOMAINS), false);
  });

  it("prueft die Form der Adresse", () => {
    assert.equal(looksLikeEmail("keinAt"), false);
    assert.equal(looksLikeEmail("a@b"), false);
    assert.equal(looksLikeEmail("a b@lmu.de"), false);
    assert.ok(looksLikeEmail("vorname.nachname@lmu.de"));
  });

  function studentAufbau(anzahlCodes: number, quota: number) {
    const windowId = "student-2026";
    const codes = Array.from({ length: anzahlCodes }, (_, i) => ({
      code: `STU-${String(i).padStart(4, "0")}`,
      windowId,
    }));
    const store = createInMemoryStore({ codes });
    return { store, deps: { store, windowId, now: 1_000_000, domains: DOMAINS, quota } };
  }

  it("fuehrt vom Link zum Code", async () => {
    const { deps } = studentAufbau(3, 3);
    const start = await startVerification("studi@lmu.de", deps);
    assert.ok(start.ok);
    const confirm = await confirmVerification(start.token, deps);
    assert.ok(confirm.ok);
    assert.equal(confirm.status, "code_issued");
  });

  it("lehnt eine fremde Domain schon beim Start ab", async () => {
    const { deps } = studentAufbau(3, 3);
    const start = await startVerification("studi@gmail.com", deps);
    assert.ok(!start.ok);
    assert.equal(start.reason, "domain_not_allowed");
  });

  it("gibt pro Adresse nur einen Code", async () => {
    const { deps } = studentAufbau(3, 3);
    const erst = await startVerification("studi@lmu.de", deps);
    assert.ok(erst.ok);
    await confirmVerification(erst.token, deps);

    const zweit = await startVerification("studi@lmu.de", deps);
    assert.ok(!zweit.ok);
    assert.equal(zweit.reason, "already_verified");
  });

  it("laesst denselben Link nicht zweimal ziehen", async () => {
    const { deps } = studentAufbau(3, 3);
    const start = await startVerification("studi@lmu.de", deps);
    assert.ok(start.ok);
    await confirmVerification(start.token, deps);
    const nochmal = await confirmVerification(start.token, deps);
    assert.ok(!nochmal.ok);
  });

  it("setzt auf die Warteliste, sobald das Kontingent voll ist", async () => {
    const { deps } = studentAufbau(5, 1);
    const a = await startVerification("a@lmu.de", deps);
    assert.ok(a.ok);
    const ersteBestaetigung = await confirmVerification(a.token, deps);
    assert.ok(ersteBestaetigung.ok);
    assert.equal(ersteBestaetigung.status, "code_issued");

    const b = await startVerification("b@lmu.de", deps);
    assert.ok(b.ok);
    const zweiteBestaetigung = await confirmVerification(b.token, deps);
    assert.ok(zweiteBestaetigung.ok);
    assert.equal(zweiteBestaetigung.status, "waitlisted");
    assert.equal(zweiteBestaetigung.position, 1);
  });

  it("setzt auf die Warteliste, wenn das Kontingent Platz hat aber kein Code mehr da ist", async () => {
    const { deps } = studentAufbau(1, 5);
    const a = await startVerification("a@lmu.de", deps);
    assert.ok(a.ok);
    await confirmVerification(a.token, deps);

    const b = await startVerification("b@lmu.de", deps);
    assert.ok(b.ok);
    const zweite = await confirmVerification(b.token, deps);
    assert.ok(zweite.ok);
    assert.equal(zweite.status, "waitlisted");
  });

  it("weist einen abgelaufenen Link ab", async () => {
    const { store, deps } = studentAufbau(3, 3);
    const start = await startVerification("studi@lmu.de", deps);
    assert.ok(start.ok);
    const spaeter = { store, windowId: deps.windowId, now: start.expiresAt + 1, domains: DOMAINS, quota: 3 };
    const r = await confirmVerification(start.token, spaeter);
    assert.ok(!r.ok);
    assert.equal(r.reason, "expired_token");
  });

  it("weist einen erfundenen Link ab", async () => {
    const { deps } = studentAufbau(3, 3);
    const r = await confirmVerification("ausgedacht", deps);
    assert.ok(!r.ok);
    assert.equal(r.reason, "invalid_token");
  });
});

/* ── Konfiguration ──────────────────────────────────────────────────── */

describe("Fensterkonfiguration", () => {
  const gueltig = {
    windows: [
      { id: "crm-1", channel: "crm", priceEur: 29, products: ["single"], quota: 100 },
      {
        id: "drop-1",
        channel: "drop",
        priceEur: 29,
        products: ["single"],
        quota: null,
        activeFrom: "2026-09-01T00:00:00Z",
        activeUntil: "2026-09-02T00:00:00Z",
      },
    ],
  };

  it("liest gueltige Fenster", () => {
    const w = parseWindows(gueltig);
    assert.equal(w.length, 2);
    assert.equal(w[0].quota, 100);
    assert.equal(w[1].activeFrom, Date.parse("2026-09-01T00:00:00Z"));
  });

  it("meckert bei doppelten Kennungen", () => {
    assert.throws(
      () => parseWindows({ windows: [gueltig.windows[0], gueltig.windows[0]] }),
      /doppelt/,
    );
  });

  it("verlangt bei Bar-Fenstern die Bar-Kennung", () => {
    assert.throws(
      () => parseWindows({ windows: [{ ...gueltig.windows[0], id: "bar-1", channel: "bar" }] }),
      /channelRef/,
    );
  });

  it("weist ein Ende vor dem Start zurueck", () => {
    assert.throws(
      () =>
        parseWindows({
          windows: [{ ...gueltig.windows[1], activeFrom: "2026-09-02T00:00:00Z", activeUntil: "2026-09-01T00:00:00Z" }],
        }),
      /activeUntil/,
    );
  });

  it("weist unbekannte Kanaele zurueck", () => {
    assert.throws(
      () => parseWindows({ windows: [{ ...gueltig.windows[0], channel: "alumni" }] }),
      /channel/,
    );
  });
});

/* ── Normalisierung ─────────────────────────────────────────────────── */

describe("Codenormalisierung", () => {
  it("entfernt Bindestriche und Leerzeichen und vereinheitlicht die Schreibweise", () => {
    assert.equal(normalizeCode(" ice-2026 aaaa "), "ICE2026AAAA");
  });
});
