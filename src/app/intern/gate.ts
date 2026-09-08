/**
 * Die Sperre fuer den internen Bereich, an einer Stelle.
 *
 * Sie steht hier und nicht im Layout, weil Route Handler das Layout nicht
 * durchlaufen. Eine Pruefung nur in layout.tsx haette den Export offen
 * gelassen, waehrend die Seite daneben 404 liefert: Der Export gibt Namen
 * und Adressen der Kaeufer heraus, also genau das, was am wenigsten offen
 * stehen darf.
 *
 * Zwei Fragen, getrennt gestellt:
 *
 *   internErlaubt()  Gibt es den Bereich hier ueberhaupt? Im Betrieb nur mit
 *                    DASHBOARD_ENABLED, sonst 404, als gaebe es ihn nicht.
 *   angemeldet()     Hat dieser Aufruf ein gueltiges Sitzungscookie? Sonst
 *                    zur Anmeldung unter /intern-login.
 *
 * zugriff() fasst beides zusammen und ist das, was Layout und Route Handler
 * fragen. Die Anmeldung selbst liegt neben /intern statt darin, weil das
 * Layout hier sonst seine eigene Anmeldeseite wegleiten wuerde.
 */

import { cookies } from "next/headers";

import { SESSION_COOKIE, internSecret, sessionPruefen } from "@/lib/intern/session";

export function internErlaubt(): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  return process.env.DASHBOARD_ENABLED === "true";
}

/** Liegt ein Sitzungscookie bei, gueltig oder nicht? Fuer den Abmeldelink. */
export function hatSitzungscookie(): boolean {
  return cookies().has(SESSION_COOKIE);
}

/** Prueft das Cookie, unabhaengig von der Umgebung. */
export function sitzungGueltig(): boolean {
  const secret = internSecret();
  // Ohne brauchbaren Schluessel gibt es keine gueltigen Sitzungen. Lieber
  // alle zur Anmeldung schicken als mit einem schwachen Schluessel pruefen.
  if (!secret) return false;
  const token = cookies().get(SESSION_COOKIE)?.value;
  return !!token && sessionPruefen(token, secret);
}

export function angemeldet(): boolean {
  // Lokal bleibt der Bereich ohne Anmeldung offen, damit die Entwicklung
  // nicht an einem Passwort haengt, das in keiner .env.local steht.
  if (process.env.NODE_ENV !== "production") return true;
  return sitzungGueltig();
}

export type Zugriff = "aus" | "login" | "ok";

export function zugriff(): Zugriff {
  if (!internErlaubt()) return "aus";
  return angemeldet() ? "ok" : "login";
}
