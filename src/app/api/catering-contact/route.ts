import { NextRequest, NextResponse } from "next/server";
import FormData from "form-data";
import Mailgun from "mailgun.js";

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY!,
  url: "https://api.eu.mailgun.net", // EU region — change to https://api.mailgun.net if US
});

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

    await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: `Cocktail X Catering Website <noreply@${process.env.MAILGUN_DOMAIN}>`,
      to: ["info@bayundco.com"],
      "h:Reply-To": email,
      subject: `Catering-Anfrage: ${eventLabel}${company ? ` — ${company}` : ""}`,
      text: [
        "CATERING-ANFRAGE – COCKTAIL X CATERING",
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
