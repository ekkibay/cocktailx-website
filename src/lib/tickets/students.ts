/**
 * Studentenverifikation.
 *
 * Ablauf laut Auftrag: Mail eingeben, Bestaetigungslink klicken, Code wird
 * angezeigt. Kontingent 400, danach Warteliste, ein Code pro verifizierter
 * Adresse.
 *
 * Der eigentliche Zweck ist nicht, Studierende zu erkennen, sondern den
 * Rabatt an eine Huerde zu binden, die sich nicht massenhaft automatisieren
 * laesst. Eine Hochschuladresse plus ein Klick im Postfach reicht dafuer.
 * Wer den Aufwand treibt, sich eine fremde Uni-Mail zu besorgen, bekommt den
 * Rabatt, und das ist in Ordnung: Die Alternative waere ein Ausweisupload,
 * und der kostet mehr Vertrauen als der Rabatt wert ist.
 */

import { createHmac, randomBytes } from "node:crypto";
import { hashEmail } from "./store.ts";
import type { TicketStore } from "./store.ts";
import type { StudentConfirmResult, StudentStartResult } from "./types.ts";

/**
 * Voreingestellte Hochschul-Domains.
 *
 * Erweiterbar ueber STUDENT_EMAIL_DOMAINS als kommaseparierte Liste, damit
 * eine neue Hochschule kein Deployment braucht.
 */
export const DEFAULT_STUDENT_DOMAINS = ["lmu.de", "tum.de", "hm.edu"] as const;

export const STUDENT_QUOTA = 400;

/** Wie lange ein Bestaetigungslink gilt. */
export const VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;

export function allowedDomains(env: NodeJS.ProcessEnv = process.env): string[] {
  const extra = (env.STUDENT_EMAIL_DOMAINS ?? "")
    .split(",")
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);
  const all = [...DEFAULT_STUDENT_DOMAINS, ...extra];
  return all.filter((d, i) => all.indexOf(d) === i);
}

/**
 * Passt die Adresse zu einer erlaubten Domain?
 *
 * Subdomains zaehlen mit: campus.lmu.de gehoert zu lmu.de. Ohne das faellt
 * die halbe TUM heraus, dort verteilen die Fakultaeten eigene Subdomains.
 * Der Punkt vor der Domain ist wichtig, sonst wuerde auch "nichtlmu.de"
 * durchgehen.
 */
export function domainAllowed(email: string, domains: string[]): boolean {
  const at = email.lastIndexOf("@");
  if (at < 0) return false;
  const host = email.slice(at + 1).trim().toLowerCase();
  if (!host) return false;
  return domains.some((d) => host === d || host.endsWith(`.${d}`));
}

/** Grobe Formpruefung. Die echte Pruefung ist ohnehin der Bestaetigungslink. */
export function looksLikeEmail(email: string): boolean {
  const e = email.trim();
  if (e.length < 6 || e.length > 254) return false;
  if (/\s/.test(e)) return false;
  const parts = e.split("@");
  if (parts.length !== 2) return false;
  const [local, host] = parts;
  if (!local || !host) return false;
  return host.includes(".") && !host.startsWith(".") && !host.endsWith(".");
}

function tokenSecret(): string {
  const s = process.env.TICKET_CODE_SECRET;
  if (!s || s.length < 32) {
    throw new Error("TICKET_CODE_SECRET fehlt oder ist zu kurz (mindestens 32 Zeichen).");
  }
  return s;
}

export function hashToken(token: string): string {
  return createHmac("sha256", tokenSecret()).update(token).digest("hex");
}

export interface StudentDeps {
  store: TicketStore;
  /** Fenster-ID des Studentenkontingents. */
  windowId: string;
  now: number;
  domains?: string[];
  quota?: number;
  allowAttempt?: (key: string) => Promise<boolean>;
  attemptKey?: string;
}

/**
 * Eigener Zaehler fuer die Ausgabe.
 *
 * Ohne den zaehlt jeder Student zweimal gegen dasselbe Kontingent: einmal
 * beim Ausstellen des Codes und ein zweites Mal, wenn er ihn an der Kasse
 * einloest. Bei 400 waeren also nur 200 Codes nutzbar gewesen, und nach 400
 * Verifikationen haette der Shop jeden ausgegebenen Studentencode mit
 * "Kontingent erschoepft" abgelehnt. Ausgabe und Einloesung sind zwei
 * verschiedene Ereignisse und brauchen zwei verschiedene Zaehler.
 */
export function issuanceCounterId(windowId: string): string {
  return `${windowId}:issued`;
}

/**
 * Schritt eins: Adresse pruefen und Bestaetigungslink vorbereiten.
 *
 * Gibt den Token im Klartext zurueck, damit der Aufrufer ihn in die Mail
 * schreiben kann. Gespeichert wird nur sein Hash. Wer die Datenbank liest,
 * kann damit keinen Link bauen.
 */
export async function startVerification(
  email: string,
  deps: StudentDeps,
): Promise<StudentStartResult> {
  if (deps.allowAttempt && deps.attemptKey) {
    const allowed = await deps.allowAttempt(deps.attemptKey);
    if (!allowed) return { ok: false, reason: "rate_limited" };
  }

  const clean = email.trim().toLowerCase();
  if (!looksLikeEmail(clean)) return { ok: false, reason: "invalid_email" };
  if (!domainAllowed(clean, deps.domains ?? allowedDomains())) {
    return { ok: false, reason: "domain_not_allowed" };
  }

  const emailHash = hashEmail(clean);
  if (await deps.store.hasStudentCode(emailHash)) {
    return { ok: false, reason: "already_verified" };
  }

  const token = randomBytes(32).toString("base64url");
  const expiresAt = deps.now + VERIFICATION_TTL_MS;
  await deps.store.createVerification({
    tokenHash: hashToken(token),
    emailHash,
    email: clean,
    expiresAt,
    consumedAt: null,
  });

  return { ok: true, token, expiresAt };
}

/**
 * Schritt zwei: Link geklickt. Jetzt entscheidet sich Code oder Warteliste.
 *
 * Die Reihenfolge ist wichtig. Zuerst wird geprueft, ob diese Adresse schon
 * einen Code hat, denn ein zweiter Klick auf denselben Link darf keinen
 * zweiten Code ziehen. Erst danach wird ein Code beansprucht.
 */
export async function confirmVerification(
  token: string,
  deps: StudentDeps,
): Promise<StudentConfirmResult> {
  const v = await deps.store.consumeVerification(hashToken(token), deps.now);
  if (!v) return { ok: false, reason: "invalid_token" };
  if (v.expiresAt <= deps.now) return { ok: false, reason: "expired_token" };

  if (await deps.store.hasStudentCode(v.emailHash)) {
    return { ok: false, reason: "already_verified" };
  }

  const quota = deps.quota ?? STUDENT_QUOTA;
  const counter = issuanceCounterId(deps.windowId);
  const gotSlot = await deps.store.takeQuotaSlot(counter, quota);
  if (!gotSlot) {
    const position = await deps.store.addToWaitlist(v.emailHash, v.email);
    return { ok: true, status: "waitlisted", position };
  }

  const claimed = await deps.store.claimStudentCode(deps.windowId, v.emailHash);
  if (!claimed) {
    // Kontingent sagt ja, aber es liegt kein Code mehr im Vorrat. Das ist ein
    // Betriebsfehler, kein Kundenfehler: Platz zurueckgeben und warten lassen,
    // statt den Platz verfallen zu lassen.
    await deps.store.releaseQuotaSlot(counter);
    const position = await deps.store.addToWaitlist(v.emailHash, v.email);
    return { ok: true, status: "waitlisted", position };
  }

  await deps.store.markStudentCodeIssued(v.emailHash, claimed.codeHash);
  return { ok: true, status: "code_issued", code: claimed.code };
}
