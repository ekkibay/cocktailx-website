/**
 * Loescht das Sitzungscookie und schickt zur Anmeldung.
 *
 * Nur POST. Ein Link, den jede fremde Seite einbetten koennte, waere eine
 * billige Art, das Team nebenbei abzumelden.
 *
 * Ohne Sitzungspruefung: Abmelden muss auch gehen, wenn die Sitzung schon
 * abgelaufen ist. Nur wenn es den Bereich hier gar nicht gibt, antwortet
 * auch diese Adresse mit 404, wie alles andere unter intern.
 */

import { SESSION_COOKIE, cookieOptionen } from "@/lib/intern/session";

import { internErlaubt } from "../../intern/gate";
import { weiter } from "../weiter";

export const dynamic = "force-dynamic";

export function POST() {
  if (!internErlaubt()) return new Response("Nicht gefunden", { status: 404 });

  const antwort = weiter("/intern-login");
  // Gleiche Attribute wie beim Setzen, mit Max-Age 0: Nur so trifft der
  // Browser dasselbe Cookie.
  antwort.cookies.set(SESSION_COOKIE, "", cookieOptionen(process.env.NODE_ENV === "production", 0));
  return antwort;
}
