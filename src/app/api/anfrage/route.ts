import { NextRequest, NextResponse } from "next/server";
import { MAIL_NOT_CONFIGURED, mailClient } from "@/lib/mailgun";
import {
  calculatePackageQuote,
  packageQuoteNeedsReview,
  parseSelection,
} from "@/lib/pricing/packageQuote";

const euro = (cents: number) =>
  (cents / 100).toLocaleString("de-DE", { style: "currency", currency: "EUR" });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contact } = body as {
      contact?: { name?: string; company?: string; email?: string; phone?: string; message?: string };
    };

    if (!contact?.name || !contact?.email) {
      return NextResponse.json({ error: "Name und E-Mail sind erforderlich" }, { status: 400 });
    }

    const selection = parseSelection(body);
    const quote = calculatePackageQuote(selection);

    if (quote.blockers.includes("noSelection")) {
      return NextResponse.json({ error: "Es ist noch kein Paket gewählt" }, { status: 400 });
    }

    const lineRows = quote.lines.map(
      (l) =>
        `  ${l.title}${l.auto ? " (automatisch)" : ""}\n` +
        `    ${l.qty} × ${euro(l.unitPrice)} ${l.unitLabel} = ${euro(l.total)}`,
    );

    // Der Review-Hinweis geht nur intern raus, nie an den Kunden.
    const review = packageQuoteNeedsReview(selection)
      ? "\n!! MARGE PRÜFEN: Diese Konfiguration liegt unter der Zielmarge.\n"
      : "";

    const text = [
      "ANFRAGE – COCKTAIL X EVENTCATERING",
      "=".repeat(46),
      "",
      `Anlass:      ${selection.occasion || "nicht angegeben"}`,
      `Datum:       ${selection.date ?? "noch offen"} (${quote.weekdayLabel})`,
      `Gäste:       ${selection.guests}`,
      `Dauer:       ${selection.hours} Stunden`,
      "",
      "-".repeat(46),
      "KONFIGURATION",
      "-".repeat(46),
      ...lineRows,
      "",
      `Netto:       ${euro(quote.net)}`,
      `MwSt 19%:    ${euro(quote.vat)}`,
      `Brutto:      ${euro(quote.gross)}`,
      `Pro Gast:    ${euro(quote.netPerGuest)} netto`,
      review,
      "-".repeat(46),
      "KONTAKT",
      "-".repeat(46),
      `Name:        ${contact.name}`,
      contact.company ? `Unternehmen: ${contact.company}` : "",
      `E-Mail:      ${contact.email}`,
      contact.phone ? `Telefon:     ${contact.phone}` : "",
      "",
      contact.message ? `Nachricht:\n${contact.message}` : "",
      "",
      "-".repeat(46),
      "Gesendet über den Anfrage-Wizard auf cocktail-x.com",
    ]
      .filter((l) => l !== "")
      .join("\n");

    const mail = mailClient();
    if (!mail) {
      // Die Anfrage darf nicht still verloren gehen, deshalb landet sie im Log.
      console.error("[anfrage] MAILGUN_API_KEY oder MAILGUN_DOMAIN fehlt. Anfrage nicht versendet:\n" + text);
      return NextResponse.json(MAIL_NOT_CONFIGURED, { status: 503 });
    }

    await mail.mg.messages.create(mail.domain, {
      from: `Cocktail X Eventcatering Website <noreply@${mail.domain}>`,
      to: ["info@bayundco.com"],
      "h:Reply-To": contact.email,
      subject: `Anfrage: ${selection.occasion || "Event"}, ${selection.guests} Gäste${
        contact.company ? ` — ${contact.company}` : ""
      }`,
      text,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Anfrage failed:", err);
    return NextResponse.json({ error: "Anfrage konnte nicht gesendet werden" }, { status: 500 });
  }
}
