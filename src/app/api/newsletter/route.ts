/**
 * Anmeldung zum Newsletter, Schritt eins von zwei.
 *
 * Hier wird noch niemand eingetragen. Diese Route verschickt ausschliesslich
 * die Bestaetigungsmail. Eingetragen wird erst, wenn der Link darin geklickt
 * wurde, siehe /[locale]/newsletter/bestaetigen. Das ist in Deutschland
 * keine Kuer, sondern die Bedingung dafuer, dass wir ueberhaupt schreiben
 * duerfen.
 *
 * Die Antwort ist bewusst immer dieselbe, egal ob die Adresse neu ist,
 * schon im Verteiler steht oder die Bremse gegriffen hat. Wer hier
 * unterschiedliche Antworten bekaeme, koennte den Verteiler Adresse fuer
 * Adresse abfragen.
 */

import { NextRequest, NextResponse } from "next/server";

import { EVENT } from "@/config/pricing";
import { mailClient } from "@/lib/mailgun";
import { darfAnmelden } from "@/lib/newsletter/bremse";
import { listeKonfiguriert } from "@/lib/newsletter/store";
import { istEmail, newsletterSecret, normalisiereEmail, tokenErzeugen } from "@/lib/newsletter/token";

export const dynamic = "force-dynamic";

/* Immer dieselbe Antwort nach aussen, damit sich der Verteiler nicht
   abfragen laesst. */
const ANGENOMMEN = { ok: true } as const;

function absenderBasis(req: NextRequest): string {
  // Erst die konfigurierte Adresse, sonst die des Aufrufs. Der Link muss in
  // der Mail absolut sein, eine relative Adresse hilft dort niemandem.
  const konfiguriert = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");
  return konfiguriert || req.nextUrl.origin;
}

function mailText(locale: "de" | "en", link: string): { subject: string; text: string } {
  if (locale === "en") {
    return {
      subject: `Confirm your ${EVENT.name} newsletter signup`,
      text: [
        "One click and you are in.",
        "",
        "You asked to hear from us first when a new bar joins",
        `${EVENT.name} ${EVENT.edition}. Confirm your address here:`,
        "",
        link,
        "",
        "The link is valid for seven days.",
        "",
        "If you did not sign up, just ignore this mail. Nothing happens",
        "without that click, and we will not write to you again.",
        "",
        "bayundco GmbH",
      ].join("\n"),
    };
  }

  return {
    subject: `Bestätige deine Anmeldung zum ${EVENT.name} Newsletter`,
    text: [
      "Ein Klick, dann bist du dabei.",
      "",
      "Du willst als Erste:r erfahren, welche Bar bei",
      `${EVENT.name} ${EVENT.edition} dazukommt. Bestätige dafür kurz deine Adresse:`,
      "",
      link,
      "",
      "Der Link gilt sieben Tage.",
      "",
      "Wenn du dich nicht angemeldet hast, ignorier diese Mail einfach.",
      "Ohne den Klick passiert nichts, und wir schreiben dir nicht wieder.",
      "",
      "bayundco GmbH",
    ].join("\n"),
  };
}

export async function POST(req: NextRequest) {
  let email: string;
  let locale: "de" | "en";

  try {
    const body = await req.json();
    email = normalisiereEmail(String(body?.email ?? ""));
    locale = body?.locale === "en" ? "en" : "de";
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }

  // Die einzige Auskunft, die nach aussen geht: ob die Adresse ueberhaupt
  // eine sein kann. Das braucht das Formular, um einen Tippfehler zu melden.
  if (!istEmail(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const secret = newsletterSecret();
  if (!secret || !listeKonfiguriert()) {
    console.error(
      "[newsletter] Nicht eingerichtet. Es fehlen NEWSLETTER_SECRET (mindestens 32 Zeichen), MAILGUN_NEWSLETTER_LIST oder die Mailgun-Zugänge.",
    );
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    "unbekannt";

  // Ab hier immer dieselbe Antwort, auch wenn nichts mehr passiert.
  if (!darfAnmelden(ip, email)) {
    console.warn("[newsletter] Bremse hat gegriffen.");
    return NextResponse.json(ANGENOMMEN);
  }

  const mail = mailClient();
  if (!mail) return NextResponse.json(ANGENOMMEN);

  const token = tokenErzeugen({ email, locale, at: Date.now() }, secret);
  const pfad = locale === "de" ? "/newsletter/bestaetigen" : "/en/newsletter/bestaetigen";
  const link = `${absenderBasis(req)}${pfad}?token=${token}`;
  const { subject, text } = mailText(locale, link);

  try {
    await mail.mg.messages.create(mail.domain, {
      from: `${EVENT.name} <noreply@${mail.domain}>`,
      to: [email],
      subject,
      text,
    });
  } catch (err) {
    // Auch hier nach aussen dieselbe Antwort: Ob eine Adresse zustellbar ist,
    // geht den Absender des Formulars nichts an.
    console.error("[newsletter] Bestätigungsmail nicht versendet:", err);
  }

  return NextResponse.json(ANGENOMMEN);
}
