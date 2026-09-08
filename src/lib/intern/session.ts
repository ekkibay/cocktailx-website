/**
 * Sitzung fuer den internen Bereich, ohne Datenbank.
 *
 * Der Bereich zeigt Namen, Adressen und Umsaetze. Bisher war er im Betrieb
 * entweder ganz aus oder fuer jeden offen, der die Adresse kannte. Das Team
 * braucht ihn aber im Betrieb, also muss etwas davor.
 *
 * Ein Nutzerverzeichnis waere fuer eine Handvoll Leute mit einem Werkzeug
 * zu viel Apparat. Stattdessen ein gemeinsames Teampasswort, und nach der
 * Anmeldung ein signiertes Cookie, das zwoelf Stunden gilt. Wie beim
 * Newsletter traegt das Token seinen Zustand selbst: Es enthaelt nur den
 * Ablaufzeitpunkt und eine Signatur, die nur der Server erzeugen kann.
 *
 *   Anmeldung  ->  Passwort pruefen, Token ins Cookie
 *   Aufruf     ->  Signatur und Ablauf pruefen, sonst zur Anmeldung
 *
 * Der Schluessel steht in INTERN_SECRET. Wird er gewechselt, sind alle
 * Sitzungen auf einmal abgemeldet. Das ist zugleich der Notausgang, falls
 * ein Cookie in falsche Haende geraet.
 *
 * Bewusst ohne Next-Importe, damit die Logik im Testrunner von Node laeuft.
 */

import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/** Ein Arbeitstag mit Reserve. Kurz genug, dass ein vergessener Rechner im
    Buero nicht wochenlang offen steht, lang genug, dass sich niemand
    mittags erneut anmelden muss. */
export const SESSION_GUELTIG_MS = 12 * 60 * 60 * 1000;

/** Name des Cookies. HttpOnly, das Skript im Browser sieht es nie. */
export const SESSION_COOKIE = "intern_session";

const MIN_PASSWORT = 12;
const MIN_SECRET = 32;

export function internSecret(): string | null {
  const s = process.env.INTERN_SECRET?.trim();
  // Ein kurzer Schluessel ist schlimmer als keiner, weil er Sicherheit
  // vortaeuscht. Lieber niemanden hereinlassen und es im Log sagen.
  return s && s.length >= MIN_SECRET ? s : null;
}

export function internPasswort(): string | null {
  const p = process.env.INTERN_PASSWORD?.trim();
  return p && p.length >= MIN_PASSWORT ? p : null;
}

/**
 * Attribute des Cookies, einmal fuer Setzen und Loeschen. Beide muessen
 * uebereinstimmen, sonst loescht der Browser beim Abmelden ein anderes
 * Cookie als das, das er beim Anmelden bekommen hat.
 */
export function cookieOptionen(produktion: boolean, maxAgeSek = Math.floor(SESSION_GUELTIG_MS / 1000)) {
  return {
    httpOnly: true,
    // Lokal laeuft die Seite ueber http, dort wuerde Secure das Cookie schlucken.
    secure: produktion,
    sameSite: "lax" as const,
    // Wurzel statt /intern: Die Anmeldung liegt unter /intern-login, und ein
    // Cookie-Pfad /intern gilt dort nicht.
    path: "/",
    maxAge: maxAgeSek,
  };
}

function signieren(nutzlast: string, secret: string): string {
  // Mit Praefix, damit eine Signatur aus einem anderen Zusammenhang, etwa
  // dem Newsletter, falls jemand denselben Schluessel eintraegt, nie als
  // Sitzung durchgeht.
  return createHmac("sha256", secret).update(`intern-session:${nutzlast}`).digest("base64url");
}

export function sessionErzeugen(secret: string, jetzt = Date.now()): string {
  // Nur der Ablauf steht im Token. Wer angemeldet ist, ist "das Team",
  // mehr gibt es nicht zu tragen.
  const ablauf = String(jetzt + SESSION_GUELTIG_MS);
  return `${ablauf}.${signieren(ablauf, secret)}`;
}

export function sessionPruefen(token: string, secret: string, jetzt = Date.now()): boolean {
  // Das Cookie kommt vom Client und kann alles sein. Nichts hier darf
  // werfen, sonst wird aus einem manipulierten Cookie ein Serverfehler
  // statt einer Weiterleitung zur Anmeldung.
  if (typeof token !== "string" || token.length === 0 || token.length > 128) return false;
  if (typeof secret !== "string" || secret.length === 0) return false;

  const punkt = token.indexOf(".");
  if (punkt <= 0) return false;
  const ablaufText = token.slice(0, punkt);
  const signatur = token.slice(punkt + 1);

  // Nur Ziffern, damit Number() unten nicht aus "1e3" oder " 12" etwas macht.
  if (!/^\d{1,15}$/.test(ablaufText)) return false;

  // Zeitgleicher Vergleich, damit sich die Signatur nicht Zeichen fuer
  // Zeichen erraten laesst. Vorher die Laenge pruefen, timingSafeEqual
  // wirft bei ungleich langen Puffern.
  const a = Buffer.from(signatur);
  const b = Buffer.from(signieren(ablaufText, secret));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  const ablauf = Number(ablaufText);
  if (jetzt >= ablauf) return false;
  // Weiter in der Zukunft, als eine frische Sitzung reichen kann: Dann geht
  // eine Uhr falsch oder der Schluessel ist unterwegs. Beides kein Grund,
  // die Tuer aufzumachen.
  if (ablauf - jetzt > SESSION_GUELTIG_MS + 60_000) return false;

  return true;
}

export function passwortStimmt(eingabe: string, erwartet: string): boolean {
  if (typeof eingabe !== "string" || typeof erwartet !== "string") return false;
  // Ein leeres Soll passt zu nichts, auch nicht zu einer leeren Eingabe.
  if (erwartet.length === 0) return false;
  // Beide erst hashen: timingSafeEqual verlangt gleich lange Puffer, und
  // ein frueher Abbruch bei ungleicher Laenge wuerde die Laenge des
  // Passworts verraten. Nach dem Hash sind beide immer 32 Byte.
  const a = createHash("sha256").update(eingabe, "utf8").digest();
  const b = createHash("sha256").update(erwartet, "utf8").digest();
  return timingSafeEqual(a, b);
}
