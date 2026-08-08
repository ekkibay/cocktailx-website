import { NextRequest, NextResponse } from "next/server";
import { MAIL_NOT_CONFIGURED, mailClient } from "@/lib/mailgun";

const eventLabels: Record<string, string> = {
  corporate: "Firmenevent / Produktlaunch",
  messe: "Messe / Konferenz",
  gala: "Gala / VIP-Empfang",
  networking: "Networking / After-Work",
  other: "Sonstiges",
};

export async function POST(req: NextRequest) {
  try {
    const { name, company, email, phone, eventType, guestCount, date, message } =
      await req.json();

    if (!name || !email || !eventType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const eventLabel = eventLabels[eventType] || eventType;

    const mail = mailClient();
    if (!mail) {
      console.error("[catering-contact] Mailgun nicht konfiguriert. Anfrage nicht versendet von:", email);
      return NextResponse.json(MAIL_NOT_CONFIGURED, { status: 503 });
    }

    await mail.mg.messages.create(mail.domain, {
      from: `Cocktail X Eventcatering Website <noreply@${mail.domain}>`,
      to: ["info@bayundco.com"],
      "h:Reply-To": email,
      subject: `Catering-Anfrage: ${eventLabel}${company ? `, ${company}` : ""}`,
      text: [
        "ANFRAGE, COCKTAIL X EVENTCATERING",
        "═".repeat(40),
        "",
        `Name: ${name}`,
        company ? `Unternehmen: ${company}` : "",
        `E-Mail: ${email}`,
        phone ? `Telefon: ${phone}` : "",
        "",
        "─".repeat(40),
        "",
        `Event-Art: ${eventLabel}`,
        guestCount ? `Gästeanzahl: ${guestCount}` : "",
        date ? `Event-Datum: ${date}` : "",
        "",
        message ? `Nachricht:\n${message}` : "",
        "",
        "─".repeat(40),
        "Gesendet über cocktail-x.com/catering/kontakt",
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
