import type { Metadata } from "next";
import Link from "next/link";

import { CONTACT_EMAIL, EVENT } from "@/config/pricing";
import { asLocale, pick, type Bilingual, type Locale } from "@/i18n/bilingual";
import { eintragen } from "@/lib/newsletter/store";
import { newsletterSecret, tokenPruefen, type TokenFehler } from "@/lib/newsletter/token";

/**
 * Newsletter, Schritt zwei von zwei: der Klick aus der Bestaetigungsmail.
 *
 * Erst hier wird jemand in den Verteiler eingetragen. Vorher steht die
 * Anmeldung nirgends, sie steckt nur signiert im Link.
 *
 * Dass ein Aufruf der Seite etwas veraendert, ist hier Absicht und nicht zu
 * vermeiden: Der Klick in der Mail IST die Einwilligung. Ein zweiter Schritt
 * mit Knopf waere sauberer im Sinne von HTTP und schlechter im Sinne der
 * Sache, weil jeder zusaetzliche Klick Anmeldungen kostet, die eigentlich
 * gewollt waren.
 *
 * Kein Index: Die Seite ergibt nur mit Token Sinn.
 */

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = asLocale(params.locale);
  return {
    title: locale === "en" ? "Newsletter confirmed" : "Newsletter bestätigt",
    robots: { index: false, follow: false },
  };
}

const COPY = {
  okTitel: { de: "Du bist dabei.", en: "You are in." },
  okText: {
    de: `Deine Adresse ist bestätigt. Ab dem ${EVENT.barsRevealLabel} schreiben wir dir, sobald eine neue Bar dazukommt. Abmelden kannst du dich in jeder Mail mit einem Klick.`,
    en: `Your address is confirmed. From ${EVENT.barsRevealLabelEn} we will write whenever a new bar joins. You can unsubscribe from any mail with one click.`,
  },
  abgelaufenTitel: { de: "Der Link ist abgelaufen.", en: "That link has expired." },
  abgelaufenText: {
    de: "Bestätigungslinks gelten sieben Tage. Melde dich einfach noch einmal an, dann schicken wir dir einen neuen.",
    en: "Confirmation links are valid for seven days. Just sign up again and we will send a new one.",
  },
  ungueltigTitel: { de: "Der Link stimmt nicht.", en: "That link is not valid." },
  ungueltigText: {
    de: "Wahrscheinlich ist er beim Kopieren abgeschnitten worden. Öffne ihn direkt aus der Mail, oder melde dich noch einmal an.",
    en: "It was probably cut off when copied. Open it straight from the mail, or sign up again.",
  },
  fehlerTitel: { de: "Das hat gerade nicht geklappt.", en: "That did not work." },
  fehlerText: {
    de: "An deiner Anmeldung liegt es nicht, bei uns hat etwas gehakt. Versuch es in ein paar Minuten noch einmal.",
    en: "Nothing wrong on your side, something failed on ours. Please try again in a few minutes.",
  },
  zurueck: { de: "Zurück zur Startseite", en: "Back to the home page" },
  hilfe: { de: "Frage dazu? Schreib uns an", en: "Any questions? Write to us at" },
} satisfies Record<string, Bilingual>;

type Ausgang = "ok" | TokenFehler | "fehler";

async function bestaetigen(token: string | undefined): Promise<{ ausgang: Ausgang }> {
  if (!token) return { ausgang: "form" };

  const secret = newsletterSecret();
  if (!secret) {
    console.error("[newsletter] NEWSLETTER_SECRET fehlt, Bestätigung nicht möglich.");
    return { ausgang: "fehler" };
  }

  const geprueft = tokenPruefen(token, secret);
  if (!geprueft.ok) return { ausgang: geprueft.grund };

  try {
    await eintragen({
      email: geprueft.inhalt.email,
      locale: geprueft.inhalt.locale,
      angemeldetAm: geprueft.inhalt.at,
      bestaetigtAm: Date.now(),
    });
    return { ausgang: "ok" };
  } catch (err) {
    console.error("[newsletter] Eintragen in den Verteiler fehlgeschlagen:", err);
    return { ausgang: "fehler" };
  }
}

function texte(ausgang: Ausgang, locale: Locale): { titel: string; text: string } {
  switch (ausgang) {
    case "ok":
      return { titel: pick(COPY.okTitel, locale), text: pick(COPY.okText, locale) };
    case "abgelaufen":
      return {
        titel: pick(COPY.abgelaufenTitel, locale),
        text: pick(COPY.abgelaufenText, locale),
      };
    case "form":
    case "signatur":
      return {
        titel: pick(COPY.ungueltigTitel, locale),
        text: pick(COPY.ungueltigText, locale),
      };
    default:
      return { titel: pick(COPY.fehlerTitel, locale), text: pick(COPY.fehlerText, locale) };
  }
}

export default async function BestaetigenPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { token?: string };
}) {
  const locale = asLocale(params.locale);
  const { ausgang } = await bestaetigen(searchParams.token);
  const { titel, text } = texte(ausgang, locale);
  const geschafft = ausgang === "ok";

  return (
    <main className="min-h-[70vh] flex items-center px-5 py-20 md:py-28">
      <div className="mx-auto max-w-xl w-full">
        <p
          className={`font-body text-[11px] font-bold uppercase tracking-[0.3em] mb-5 ${
            geschafft ? "text-tangerine" : "text-hibiscus"
          }`}
        >
          Newsletter
        </p>

        <h1 className="font-display text-4xl md:text-5xl leading-[1.05] mb-5">{titel}</h1>

        <p className="font-body text-base md:text-lg text-bone/85 leading-relaxed mb-8">{text}</p>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            href={locale === "de" ? "/" : "/en"}
            className="inline-flex items-center rounded-full bg-tangerine text-licorice px-6 py-3 font-body text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            {pick(COPY.zurueck, locale)}
          </Link>

          <p className="font-body text-sm text-muted">
            {pick(COPY.hilfe, locale)}{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-tangerine hover:underline underline-offset-4">
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
