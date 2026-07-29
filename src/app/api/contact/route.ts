import { NextRequest, NextResponse } from "next/server";
import { MAIL_NOT_CONFIGURED, mailClient } from "@/lib/mailgun";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const mail = mailClient();
    if (!mail) {
      console.error("[contact] Mailgun nicht konfiguriert. Anfrage nicht versendet von:", email);
      return NextResponse.json(MAIL_NOT_CONFIGURED, { status: 503 });
    }

    await mail.mg.messages.create(mail.domain, {
      from: `Cocktail X Website <noreply@${mail.domain}>`,
      to: ["info@cocktail-x.com"],
      "h:Reply-To": email,
      subject: subject || `Kontaktanfrage von ${name}`,
      text: [
        "KONTAKTANFRAGE – COCKTAIL X FESTIVAL",
        "═".repeat(40),
        "",
        `Name: ${name}`,
        `E-Mail: ${email}`,
        subject ? `Betreff: ${subject}` : "",
        "",
        "─".repeat(40),
        "",
        `Nachricht:\n${message}`,
        "",
        "─".repeat(40),
        "Gesendet über cocktail-x.com/contact",
      ]
        .filter(Boolean)
        .join("\n"),
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Mailgun error:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
