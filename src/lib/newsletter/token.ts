/**
 * Double Opt-in ohne Datenbank.
 *
 * In Deutschland ist die bestaetigte Anmeldung Pflicht, nicht Kuer: Ohne
 * Nachweis, dass der Inhaber der Adresse selbst zugestimmt hat, ist jede
 * Newslettermail eine unzulaessige Werbung, und der Nachweis liegt bei uns.
 *
 * Ueblich waere dafuer eine Tabelle mit offenen Anmeldungen. Die gibt es in
 * diesem Projekt nicht, und eine Datenbank nur fuer den Zwischenzustand
 * einzufuehren waere teuer erkauft. Stattdessen traegt der Bestaetigungslink
 * die Anmeldung selbst mit sich, signiert mit einem Schluessel, den nur der
 * Server kennt.
 *
 * Damit ist der Zwischenzustand zustandslos:
 *
 *   Anmeldung  ->  signiertes Token in den Link, Mail an die Adresse
 *   Klick      ->  Signatur und Frist pruefen, erst dann eintragen
 *
 * Wer die Adresse eines anderen eintraegt, loest damit nur eine Mail an
 * genau diese Adresse aus. Ohne den Klick darin passiert nichts.
 *
 * Der Schluessel steht in NEWSLETTER_SECRET. Wird er gewechselt, verfallen
 * alle offenen Bestaetigungslinks. Das ist verkraftbar, sie gelten ohnehin
 * nur wenige Tage.
 */

import { createHmac, timingSafeEqual } from "node:crypto";

/** Wie lange ein Bestaetigungslink gilt. Kurz genug, dass eine vergessene
    Mail nicht Monate spaeter noch jemanden eintraegt. */
export const TOKEN_GUELTIG_MS = 7 * 24 * 60 * 60 * 1000;

export function newsletterSecret(): string | null {
  const s = process.env.NEWSLETTER_SECRET?.trim();
  // Ein kurzer Schluessel ist schlimmer als keiner, weil er Sicherheit
  // vortaeuscht. Lieber ausfallen und es im Log sagen.
  return s && s.length >= 32 ? s : null;
}

function signieren(nutzlast: string, secret: string): string {
  return createHmac("sha256", secret).update(nutzlast).digest("base64url");
}

/**
 * Adressen vereinheitlichen, damit "Max@Example.de " und "max@example.de"
 * nicht als zwei Anmeldungen gelten.
 */
export function normalisiereEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Reicht fuer ein Anmeldeformular: ein @ mit Text davor und einem Punkt danach. */
export function istEmail(email: string): boolean {
  const e = normalisiereEmail(email);
  return e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
}

export interface TokenInhalt {
  email: string;
  /** Sprache der Anmeldung, damit die Bestaetigungsseite passt. */
  locale: "de" | "en";
  /** Zeitpunkt der Anmeldung, fuer Frist und Nachweis. */
  at: number;
}

export function tokenErzeugen(inhalt: TokenInhalt, secret: string): string {
  // Die Adresse steckt lesbar im Token, damit die Bestaetigungsseite ohne
  // Datenbank weiss, wen sie eintraegt. Geheim ist sie nicht, geschuetzt ist
  // sie gegen Veraenderung.
  const nutzlast = Buffer.from(JSON.stringify(inhalt), "utf8").toString("base64url");
  return `${nutzlast}.${signieren(nutzlast, secret)}`;
}

export type TokenFehler = "form" | "signatur" | "abgelaufen";

export function tokenPruefen(
  token: string,
  secret: string,
  jetzt = Date.now(),
): { ok: true; inhalt: TokenInhalt } | { ok: false; grund: TokenFehler } {
  const punkt = token.lastIndexOf(".");
  if (punkt <= 0) return { ok: false, grund: "form" };

  const nutzlast = token.slice(0, punkt);
  const signatur = token.slice(punkt + 1);
  const erwartet = signieren(nutzlast, secret);

  // Zeitgleicher Vergleich, damit sich die Signatur nicht Zeichen fuer
  // Zeichen erraten laesst. Vorher die Laenge pruefen, timingSafeEqual
  // wirft bei ungleich langen Puffern.
  const a = Buffer.from(signatur);
  const b = Buffer.from(erwartet);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return { ok: false, grund: "signatur" };

  let inhalt: TokenInhalt;
  try {
    inhalt = JSON.parse(Buffer.from(nutzlast, "base64url").toString("utf8"));
  } catch {
    return { ok: false, grund: "form" };
  }

  if (!inhalt?.email || !istEmail(inhalt.email)) return { ok: false, grund: "form" };
  if (inhalt.locale !== "de" && inhalt.locale !== "en") return { ok: false, grund: "form" };
  if (typeof inhalt.at !== "number") return { ok: false, grund: "form" };
  if (jetzt - inhalt.at > TOKEN_GUELTIG_MS) return { ok: false, grund: "abgelaufen" };
  // Ein Token aus der Zukunft heisst, dass jemand am Inhalt gedreht hat,
  // oder dass eine Uhr falsch geht. Beides kein Grund einzutragen.
  if (inhalt.at - jetzt > 60_000) return { ok: false, grund: "form" };

  return { ok: true, inhalt: { ...inhalt, email: normalisiereEmail(inhalt.email) } };
}
