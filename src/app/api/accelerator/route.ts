import { NextRequest, NextResponse } from "next/server";
import { MAIL_NOT_CONFIGURED, mailClient } from "@/lib/mailgun";

/**
 * Bewerbungen fuer das Accelerator-Programm.
 *
 * Vorher lief das Formular auf /connect/excelerator gegen ein console.log.
 * Jede Bewerbung ging verloren, und der Bewerber sah trotzdem nichts, was auf
 * einen Fehler hingedeutet haette.
 */
export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message, why, reach } = await req.json();

    if (!name || !email || !why) {
      return NextResponse.json({ error: "Name, E-Mail und Motivation sind erforderlich" }, { status: 400 });
    }

    const text = [
      "BEWERBUNG ACCELERATOR",
      "=".repeat(40),
      "",
      `Name:      ${name}`,
      `E-Mail:    ${email}`,
      phone ? `Telefon:   ${phone}` : "",
      reach ? `Reichweite: ${reach}` : "",
      "",
      "-".repeat(40),
      "MOTIVATION",
      "-".repeat(40),
      why,
      "",
      message ? `Nachricht:\n${message}` : "",
      "",
      "-".repeat(40),
      "Gesendet ueber cocktail-x.com/connect/excelerator",
    ]
      .filter((l) => l !== "")
      .join("\n");

    const mail = mailClient();
    if (!mail) {
      console.error("[accelerator] Mailgun nicht konfiguriert. Bewerbung nicht versendet:\n" + text);
      return NextResponse.json(MAIL_NOT_CONFIGURED, { status: 503 });
    }

    await mail.mg.messages.create(mail.domain, {
      from: `Cocktail X Website <noreply@${mail.domain}>`,
      to: ["info@cocktail-x.com"],
      "h:Reply-To": email,
      subject: `Accelerator-Bewerbung: ${name}`,
      text,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Accelerator-Bewerbung fehlgeschlagen:", err);
    return NextResponse.json({ error: "Bewerbung konnte nicht gesendet werden" }, { status: 500 });
  }
}
