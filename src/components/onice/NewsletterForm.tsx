"use client";

import Link from "next/link";
import { useState } from "react";

import { EVENT } from "@/config/pricing";
import { pick, type Bilingual, type Locale } from "@/i18n/bilingual";

/**
 * Anmeldung zum Newsletter.
 *
 * Ein Feld, ein Knopf. Kein Name, keine Anrede: Jedes zusaetzliche Feld
 * kostet Anmeldungen, und wir brauchen fuer eine Bar-Ankuendigung nichts
 * ausser der Adresse.
 *
 * Nach dem Absenden steht hier bewusst nicht "du bist dabei", sondern der
 * Hinweis auf die Mail. Dabei zu sein ist erst der Klick darin, und wer das
 * hier schon als fertig liest, wartet nie auf die Bestaetigung.
 */

type Zustand = "bereit" | "sendet" | "mailRaus" | "tippfehler" | "fehler";

const COPY = {
  titel: { de: "Erfahre es zuerst.", en: "Hear it first." },
  text: {
    de: `Ab dem ${EVENT.barsRevealLabel} geben wir jeden Tag eine Bar bekannt. Wir schreiben dir, sobald eine neue dazukommt, und sonst nicht.`,
    en: `From ${EVENT.barsRevealLabelEn} we announce one bar a day. We write when a new one joins, and otherwise we leave you alone.`,
  },
  platzhalter: { de: "deine@adresse.de", en: "your@address.com" },
  knopf: { de: "Eintragen", en: "Sign up" },
  sendet: { de: "Moment", en: "One moment" },
  label: { de: "E-Mail-Adresse für den Newsletter", en: "Email address for the newsletter" },

  /* Die Einwilligung gehoert sichtbar ans Formular, nicht ins Kleingedruckte
     unten auf der Seite. */
  einwilligung: {
    de: "Wir schicken dir eine Mail zum Bestätigen. Abmelden geht jederzeit mit einem Klick.",
    en: "We will send you a mail to confirm. You can unsubscribe any time with one click.",
  },
  datenschutz: { de: "Datenschutz", en: "Privacy" },

  mailRausTitel: { de: "Schau in dein Postfach.", en: "Check your inbox." },
  mailRausText: {
    de: "Wir haben dir eine Mail geschickt. Ein Klick auf den Link darin, dann bist du dabei. Nichts angekommen? Sieh im Spam nach.",
    en: "We sent you a mail. One click on the link inside and you are in. Nothing arrived? Have a look in your spam folder.",
  },
  tippfehler: {
    de: "Diese Adresse sieht nicht vollständig aus. Magst du nochmal schauen?",
    en: "That address looks incomplete. Could you check it again?",
  },
  fehler: {
    de: "Das hat gerade nicht geklappt. Versuch es in ein paar Minuten noch einmal.",
    en: "That did not work just now. Please try again in a few minutes.",
  },
} satisfies Record<string, Bilingual>;

export function NewsletterForm({ locale }: { locale: Locale }) {
  const [email, setEmail] = useState("");
  const [zustand, setZustand] = useState<Zustand>("bereit");

  async function absenden(e: React.FormEvent) {
    e.preventDefault();
    if (zustand === "sendet") return;
    setZustand("sendet");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });

      if (res.ok) {
        setZustand("mailRaus");
        setEmail("");
        return;
      }

      const body = await res.json().catch(() => ({}));
      setZustand(body?.error === "invalid_email" ? "tippfehler" : "fehler");
    } catch {
      setZustand("fehler");
    }
  }

  if (zustand === "mailRaus") {
    return (
      <div className="rounded-2xl ring-1 ring-tangerine/40 bg-tangerine/5 p-6 md:p-8">
        <p className="font-display text-2xl text-tangerine mb-3">
          {pick(COPY.mailRausTitel, locale)}
        </p>
        <p className="font-body text-base text-bone/85 leading-relaxed max-w-lg">
          {pick(COPY.mailRausText, locale)}
        </p>
      </div>
    );
  }

  const fehlertext =
    zustand === "tippfehler"
      ? pick(COPY.tippfehler, locale)
      : zustand === "fehler"
        ? pick(COPY.fehler, locale)
        : null;

  return (
    <div className="rounded-2xl ring-1 ring-hairline bg-surface/40 p-6 md:p-8">
      <p className="font-display text-2xl mb-2">{pick(COPY.titel, locale)}</p>
      <p className="font-body text-base text-muted leading-relaxed max-w-lg mb-6">
        {pick(COPY.text, locale)}
      </p>

      <form onSubmit={absenden} noValidate className="max-w-lg">
        <div className="flex flex-col sm:flex-row gap-3">
          <label htmlFor="newsletter-email" className="sr-only">
            {pick(COPY.label, locale)}
          </label>
          <input
            id="newsletter-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              // Eine Fehlermeldung, die beim Tippen stehen bleibt, liest sich
              // wie ein Vorwurf.
              if (zustand === "tippfehler" || zustand === "fehler") setZustand("bereit");
            }}
            placeholder={pick(COPY.platzhalter, locale)}
            aria-invalid={zustand === "tippfehler"}
            aria-describedby={fehlertext ? "newsletter-fehler" : undefined}
            className={`flex-1 min-w-0 rounded-full border bg-licorice px-5 py-3 font-body text-base text-bone placeholder:text-muted focus:outline-none transition-colors ${
              zustand === "tippfehler"
                ? "border-hibiscus focus:border-hibiscus"
                : "border-hairline focus:border-tangerine"
            }`}
          />
          <button
            type="submit"
            disabled={zustand === "sendet"}
            className="rounded-full bg-tangerine text-licorice px-6 py-3 font-body text-sm font-bold uppercase tracking-wider hover:opacity-90 disabled:opacity-60 transition-opacity whitespace-nowrap"
          >
            {zustand === "sendet" ? pick(COPY.sendet, locale) : pick(COPY.knopf, locale)}
          </button>
        </div>

        {fehlertext && (
          <p
            id="newsletter-fehler"
            role="alert"
            className="mt-3 font-body text-sm text-hibiscus leading-relaxed"
          >
            {fehlertext}
          </p>
        )}

        <p className="mt-4 font-body text-xs text-muted leading-relaxed">
          {pick(COPY.einwilligung, locale)}{" "}
          <Link
            href={locale === "de" ? "/legal/datenschutz" : "/en/legal/datenschutz"}
            className="underline underline-offset-4 hover:text-bone transition-colors"
          >
            {pick(COPY.datenschutz, locale)}
          </Link>
        </p>
      </form>
    </div>
  );
}
