/**
 * Nimmt das Passwort entgegen und setzt das Sitzungscookie.
 *
 * Ein gewoehnliches Formular-POST, keine Client-Logik: Die Seite muss auch
 * dann funktionieren, wenn sonst nichts geladen ist. Antwort ist immer eine
 * Weiterleitung, bei Erfolg ins Dashboard, sonst zurueck zur Anmeldung mit
 * dem Grund in der Adresse.
 *
 * Reihenfolge: erst die Bremse, dann das Passwort. Umgekehrt liesse sich
 * das Passwort trotz Bremse pruefen, und genau das soll sie verhindern.
 */

import { loginErlaubt, loginGescheitert } from "@/lib/intern/bremse";
import {
  SESSION_COOKIE,
  cookieOptionen,
  internPasswort,
  internSecret,
  passwortStimmt,
  sessionErzeugen,
} from "@/lib/intern/session";

import { internErlaubt } from "../../intern/gate";
import { weiter } from "../weiter";

export const dynamic = "force-dynamic";

/* Die Adresse, wie der Proxy des Hosters sie weitergibt. Ohne Proxy kann
   ein Client sie frei behaupten, dann zaehlt die Bremse je Behauptung. Das
   ist dieselbe Grenze wie beim Newsletter und dort bewusst hingenommen. */
function clientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    "unbekannt"
  );
}

export async function POST(request: Request) {
  if (!internErlaubt()) return new Response("Nicht gefunden", { status: 404 });

  const ip = clientIp(request);
  if (!loginErlaubt(ip)) {
    console.warn("[intern-login] Bremse hat gegriffen.");
    return weiter("/intern-login?fehler=bremse");
  }

  let eingabe = "";
  try {
    const form = await request.formData();
    const feld = form.get("passwort");
    // Leerraum weg, weil Tastaturen auf dem Handy gern ein Leerzeichen
    // anhaengen und die Anmeldung dann grundlos scheitert.
    if (typeof feld === "string") eingabe = feld.trim();
  } catch {
    // Kein Formular im Body: wie ein falsches Passwort behandeln.
  }

  const passwort = internPasswort();
  const secret = internSecret();
  if (!passwort || !secret) {
    // Nach aussen ein gewoehnlicher Fehlschlag, damit die Seite nicht
    // verraet, dass sie unkonfiguriert ist. Das Team liest es hier.
    console.error(
      "[intern-login] INTERN_PASSWORD oder INTERN_SECRET fehlt oder ist zu kurz. Niemand kann sich anmelden.",
    );
    loginGescheitert(ip);
    return weiter("/intern-login?fehler=passwort");
  }

  if (!eingabe || !passwortStimmt(eingabe, passwort)) {
    loginGescheitert(ip);
    return weiter("/intern-login?fehler=passwort");
  }

  const antwort = weiter("/intern/dashboard");
  antwort.cookies.set(
    SESSION_COOKIE,
    sessionErzeugen(secret),
    cookieOptionen(process.env.NODE_ENV === "production"),
  );
  return antwort;
}
