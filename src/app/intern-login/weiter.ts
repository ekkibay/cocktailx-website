import { NextResponse } from "next/server";

/**
 * Weiterleitung nach einem Formular-POST.
 *
 * Relatives Ziel statt einer absoluten Adresse aus request.url: Hinter dem
 * Proxy des Hosters steht dort unter Umstaenden der interne Hostname, und
 * der Browser landete im Nirgendwo. 303, damit er nach dem POST mit GET
 * weitergeht und ein Neuladen das Passwort nicht noch einmal schickt.
 */
export function weiter(ziel: string): NextResponse {
  return new NextResponse(null, { status: 303, headers: { Location: ziel } });
}
