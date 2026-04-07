import { NextRequest, NextResponse } from "next/server";
import FormData from "form-data";
import Mailgun from "mailgun.js";

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY!,
  url: "https://api.eu.mailgun.net", // EU region — change to https://api.mailgun.net if US
});

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: `Cocktail X Website <noreply@${process.env.MAILGUN_DOMAIN}>`,
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
