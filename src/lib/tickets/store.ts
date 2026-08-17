/**
 * Speicherschnittstelle des Ticketmoduls.
 *
 * Das Modul kennt keine Datenbank. Es beschreibt nur, welche Operationen es
 * braucht, und ueberlaesst die Umsetzung dem Zielsystem. Das ist hier keine
 * Architektur-Kosmetik, sondern die Bedingung dafuer, dass der Shop das Modul
 * uebernehmen kann, ohne unsere Infrastruktur zu uebernehmen.
 *
 * ATOMARITAET, bitte beim Umsetzen nicht ueberlesen:
 *
 * `consumeCode` und `takeQuotaSlot` muessen atomar sein. Wer sie als
 * "lesen, pruefen, schreiben" umsetzt, verkauft denselben Code zweimal,
 * sobald zwei Klicks gleichzeitig ankommen, und genau das passiert bei einem
 * Drop mit begrenztem Kontingent im Sekundentakt.
 *
 * In SQL: ein UPDATE mit Bedingung, und den betroffenen Zeilen vertrauen.
 *
 *   UPDATE ticket_codes
 *      SET redeemed_at = now(), purchase_id = $2
 *    WHERE code_hash = $1 AND redeemed_at IS NULL
 *
 * Wenn das null Zeilen trifft, war der Code schon weg. Nicht vorher zaehlen.
 *
 *   UPDATE price_windows
 *      SET redeemed_count = redeemed_count + 1
 *    WHERE id = $1 AND (quota IS NULL OR redeemed_count < quota)
 *
 * Dasselbe Muster fuer das Kontingent.
 */

import { createHmac, timingSafeEqual } from "node:crypto";
import type { PurchaseRecord } from "./types.ts";

/* ── Codes ──────────────────────────────────────────────────────────── */

export interface CodeRecord {
  codeHash: string;
  windowId: string;
  /** Gesetzt, sobald der Code verbraucht ist. */
  redeemedAt: number | null;
}

/* ── Studenten ──────────────────────────────────────────────────────── */

export interface StudentVerification {
  tokenHash: string;
  emailHash: string;
  expiresAt: number;
  consumedAt: number | null;
}

/* ── Schnittstelle ──────────────────────────────────────────────────── */

export interface TicketStore {
  /** Liest einen Code, ohne ihn zu verbrauchen. Nur fuer Vorschau-Anfragen. */
  findCode(codeHash: string): Promise<CodeRecord | null>;

  /**
   * Verbraucht einen Code endgueltig. MUSS atomar sein.
   * Gibt den Datensatz zurueck, wenn dieser Aufruf ihn verbraucht hat,
   * sonst null. Ein null heisst: schon weg oder nie da gewesen.
   */
  consumeCode(codeHash: string, purchaseId: string): Promise<CodeRecord | null>;

  /** Gibt einen verbrauchten Code wieder frei, wenn die Zahlung scheitert. */
  releaseCode(codeHash: string): Promise<void>;

  /**
   * Belegt einen Platz im Kontingent eines Fensters. MUSS atomar sein.
   * true, wenn noch Platz war.
   */
  takeQuotaSlot(windowId: string, quota: number | null): Promise<boolean>;

  /** Gibt einen Kontingentplatz frei, wenn die Zahlung scheitert. */
  releaseQuotaSlot(windowId: string): Promise<void>;

  /** Wie viele Plaetze eines Fensters sind belegt. Nur fuer Auswertung. */
  countRedeemed(windowId: string): Promise<number>;

  /** Schreibt den Kaufdatensatz fort. */
  recordPurchase(record: PurchaseRecord): Promise<void>;

  /* ── Studentenverifikation ── */

  createVerification(v: StudentVerification): Promise<void>;

  /** Verbraucht einen Bestaetigungslink. MUSS atomar sein. */
  consumeVerification(tokenHash: string, now: number): Promise<StudentVerification | null>;

  /** Hat diese Adresse schon einen Code bekommen? */
  hasStudentCode(emailHash: string): Promise<boolean>;

  /** Merkt sich, dass diese Adresse ihren Code hat. Eine pro Adresse. */
  markStudentCodeIssued(emailHash: string, codeHash: string): Promise<void>;

  /**
   * Nimmt einen freien Studentencode aus dem Vorrat und ordnet ihn der
   * Adresse zu. MUSS atomar sein. null, wenn keiner mehr frei ist.
   */
  claimStudentCode(windowId: string, emailHash: string): Promise<{ code: string; codeHash: string } | null>;

  /** Setzt eine Adresse auf die Warteliste und liefert ihre Position. */
  addToWaitlist(emailHash: string): Promise<number>;
}

/* ── Hashing ────────────────────────────────────────────────────────────
   Codes und Mailadressen werden nie im Klartext gespeichert. Ein Leck der
   Datenbank soll keinen einzigen gueltigen Code hergeben.

   HMAC statt blankem SHA: Ohne Schluessel liesse sich der ganze Coderaum
   durchrechnen, weil Codes kurz und nach festem Muster gebaut sind.         */

/**
 * Wirft absichtlich beim Start, wenn das Geheimnis fehlt.
 * Ein zufaelliger Ersatzwert waere schlimmer: Nach jedem Neustart passte
 * kein einziger Hash mehr, und niemand koennte einen Code einloesen.
 */
function secret(): string {
  const s = process.env.TICKET_CODE_SECRET;
  if (!s || s.length < 32) {
    throw new Error(
      "TICKET_CODE_SECRET fehlt oder ist zu kurz (mindestens 32 Zeichen). " +
        "Ohne den Schluessel lassen sich Codes weder pruefen noch speichern.",
    );
  }
  return s;
}

/** Normalisiert und hasht einen Code. Gross- und Kleinschreibung egal. */
export function hashCode(code: string): string {
  return createHmac("sha256", secret()).update(normalizeCode(code)).digest("hex");
}

/** Normalisiert und hasht eine Mailadresse. */
export function hashEmail(email: string): string {
  return createHmac("sha256", secret()).update(email.trim().toLowerCase()).digest("hex");
}

/**
 * Codes kommen abgetippt an: mit Bindestrichen, Leerzeichen, in beliebiger
 * Schreibweise. Ohne Normalisierung scheitert die Haelfte der Einloesungen an
 * einem Leerzeichen, und der Support darf es ausbaden.
 */
export function normalizeCode(code: string): string {
  return code.replace(/[\s-]/g, "").toUpperCase();
}

/** Zeitkonstanter Vergleich zweier Hex-Hashes. */
export function hashesEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a, "hex");
  const bb = Buffer.from(b, "hex");
  if (ba.length !== bb.length || ba.length === 0) return false;
  return timingSafeEqual(ba, bb);
}

/* ── Referenzumsetzung im Speicher ──────────────────────────────────────
   Fuer Tests und die lokale Entwicklung. Nicht fuer den Betrieb: Der Zustand
   lebt im Prozess, und sobald zwei Instanzen laufen, zaehlt jede fuer sich.   */

export function createInMemoryStore(seed?: {
  codes?: { code: string; windowId: string }[];
}): TicketStore {
  const codes = new Map<string, CodeRecord>();
  const quota = new Map<string, number>();
  const purchases: PurchaseRecord[] = [];
  const verifications = new Map<string, StudentVerification>();
  const studentCodes = new Map<string, string>();
  const waitlist: string[] = [];
  /** Klartext nur hier, damit claimStudentCode ihn ausgeben kann. */
  const plain = new Map<string, string>();
  /** Reihenfolge der Code-Hashes, als Objekt statt Map wegen des tsconfig. */
  const codeIndex: Record<string, true> = {};
  /** Zuordnung Adresse zu Code, ebenfalls als Objekt iterierbar. */
  const studentAssignments: Record<string, string> = {};

  for (const c of seed?.codes ?? []) {
    const h = hashCode(c.code);
    codes.set(h, { codeHash: h, windowId: c.windowId, redeemedAt: null });
    plain.set(h, normalizeCode(c.code));
    codeIndex[h] = true;
  }

  return {
    async findCode(codeHash) {
      return codes.get(codeHash) ?? null;
    },

    async consumeCode(codeHash) {
      const rec = codes.get(codeHash);
      // Ein Map-Zugriff in Node ist nicht unterbrechbar, deshalb ist dieses
      // Lesen-und-Schreiben hier tatsaechlich atomar. In einer echten
      // Datenbank ist es das nicht, siehe Kopfkommentar.
      if (!rec || rec.redeemedAt !== null) return null;
      rec.redeemedAt = Date.now();
      return rec;
    },

    async releaseCode(codeHash) {
      const rec = codes.get(codeHash);
      if (rec) rec.redeemedAt = null;
    },

    async takeQuotaSlot(windowId, cap) {
      const used = quota.get(windowId) ?? 0;
      if (cap !== null && used >= cap) return false;
      quota.set(windowId, used + 1);
      return true;
    },

    async releaseQuotaSlot(windowId) {
      const used = quota.get(windowId) ?? 0;
      if (used > 0) quota.set(windowId, used - 1);
    },

    async countRedeemed(windowId) {
      return quota.get(windowId) ?? 0;
    },

    async recordPurchase(record) {
      purchases.push(record);
    },

    async createVerification(v) {
      verifications.set(v.tokenHash, v);
    },

    async consumeVerification(tokenHash, now) {
      const v = verifications.get(tokenHash);
      if (!v || v.consumedAt !== null) return null;
      // Abgelaufene Token werden zurueckgegeben, damit der Aufrufer den
      // Unterschied zwischen "unbekannt" und "abgelaufen" melden kann. Das
      // ist hier unbedenklich, weil ein Token nicht erraten werden kann.
      if (v.expiresAt <= now) return v;
      v.consumedAt = now;
      return v;
    },

    async hasStudentCode(emailHash) {
      return studentCodes.has(emailHash);
    },

    async markStudentCodeIssued(emailHash, codeHash) {
      studentCodes.set(emailHash, codeHash);
    },

    async claimStudentCode(windowId, emailHash) {
      // Object.keys statt Map-Iteration: Das tsconfig des Projekts setzt kein
      // target, damit ist for...of ueber eine Map ein Fehler.
      const assigned = new Set(Object.values(studentAssignments));
      for (const hash of Object.keys(codeIndex)) {
        const rec = codes.get(hash);
        if (!rec || rec.windowId !== windowId || rec.redeemedAt !== null) continue;
        if (assigned.has(hash)) continue;
        const code = plain.get(hash);
        if (!code) continue;
        studentCodes.set(emailHash, hash);
        studentAssignments[emailHash] = hash;
        return { code, codeHash: hash };
      }
      return null;
    },

    async addToWaitlist(emailHash) {
      const existing = waitlist.indexOf(emailHash);
      if (existing >= 0) return existing + 1;
      waitlist.push(emailHash);
      return waitlist.length;
    },
  };
}
