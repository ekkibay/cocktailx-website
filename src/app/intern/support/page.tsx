import { berlinDayStart, euro, produktLabel, statusOf } from "@/lib/stripe/report";
import { loadSales } from "@/lib/stripe/sales";
import { antwortVorschlag, type Antwort } from "@/lib/mail/antworten";
import { loadMails, supportMailbox } from "@/lib/mail/graph";
import { kaufKontext, type KaufKontext } from "@/lib/mail/kontext";
import { KATEGORIEN, KATEGORIE_LABEL, triage, type Kategorie, type Triage } from "@/lib/mail/triage";
import type { SupportMail } from "@/lib/mail/types";

import { DemoLeiste } from "../demo";
import { InternNav } from "../nav";
import { Kopieren } from "./kopieren";

/**
 * Supportbereich: der Posteingang, verknuepft mit den Kaeufen, vorsortiert
 * und mit fertigem Antwortentwurf.
 *
 * Eine Kundenmail ist fast immer eine von wenigen Fragen, und die Antwort
 * steht in den Zahlungen. Deshalb steht neben jeder Mail, ob der Absender
 * gekauft hat, ob seine Zahlung durchging, scheiterte oder erstattet wurde,
 * und in welche Schublade die Mail gehoert. Darunter liegt der Entwurf, der
 * zu Schublade und Kauf passt. Das ist der Unterschied zwischen einem
 * Mailprogramm und einem Support-Werkzeug: Die Antwort steht schon da,
 * bevor jemand sucht.
 *
 * Gesendet wird in Outlook oder im Mailprogramm, nicht hier. Ein eigener
 * Antworteditor waere ein zweites Mailprogramm, das keiner pflegt.
 */

export const dynamic = "force-dynamic";

/* Dieselbe Spanne wie im Verkaufsdashboard, damit die Verknuepfung beider
   Seiten auf denselben Kaeufen steht. */
const HISTORIE_TAGE = 400;

interface Zeile {
  mail: SupportMail;
  kontext: KaufKontext;
  sichtung: Triage;
  entwurf: Antwort;
}

function istKategorie(wert: string | undefined): wert is Kategorie {
  return wert !== undefined && (KATEGORIEN as string[]).includes(wert);
}

export default async function SupportPage({ searchParams }: { searchParams: { kat?: string } }) {
  const jetzt = new Date();

  const [post, verkauf] = await Promise.all([
    loadMails(),
    loadSales(berlinDayStart(jetzt, -(HISTORIE_TAGE - 1))),
  ]);

  /* Kontext, Sichtung und Entwurf einmal je Mail, hier statt in der Zeile:
     Die Zaehler oben und der Filter brauchen dieselbe Einordnung wie die
     Zeile, sonst zaehlt der Kopf anders als die Liste. */
  const zeilen: Zeile[] = post.mails.map((mail) => {
    const kontext = kaufKontext(verkauf.sales, mail.from.email);
    const sichtung = triage(mail, kontext);
    const entwurf = antwortVorschlag({
      mail,
      kategorie: sichtung.kategorie,
      kontext,
      jetzt: jetzt.getTime(),
    });
    return { mail, kontext, sichtung, entwurf };
  });

  const filter: Kategorie | "alle" = istKategorie(searchParams.kat) ? searchParams.kat : "alle";
  const sichtbar = filter === "alle" ? zeilen : zeilen.filter((z) => z.sichtung.kategorie === filter);

  const zaehler = KATEGORIEN.map((k) => ({
    key: k,
    label: KATEGORIE_LABEL[k],
    anzahl: zeilen.filter((z) => z.sichtung.kategorie === k).length,
  }));

  const heuteStart = berlinDayStart(jetzt);
  const ungelesen = zeilen.filter((z) => z.mail.unread).length;
  const heute = zeilen.filter((z) => z.mail.receivedAt >= heuteStart).length;
  const gescheitert = zeilen.filter((z) => z.kontext.einordnung === "fehlgeschlagen").length;
  const eingeordnet = zeilen.filter((z) => z.sichtung.kategorie !== "sonstiges").length;

  const postfach = supportMailbox();

  return (
    <main className="min-h-screen pb-8 md:pb-12">
      {post.demo && <DemoLeiste text="Demodaten, keine echten Mails" />}
      <div className="mx-auto max-w-6xl px-5 pt-8 md:px-10 md:pt-12">
        <InternNav aktiv="support" />

        <header>
          <p className="font-body text-[11px] font-bold uppercase tracking-[0.3em] text-tangerine mb-3">
            Intern
          </p>
          <h1 className="font-display text-4xl md:text-5xl leading-none">Support ON ICE</h1>
          {postfach && (
            <p className="font-body text-sm text-muted mt-3">Posteingang von {postfach}</p>
          )}

          {!verkauf.vollstaendig && (
            <p className="mt-4 font-body text-sm text-hibiscus">
              Die Kaufhistorie ist unvollständig geladen, die Einordnung neben den Mails kann
              deshalb Käufe übersehen.
            </p>
          )}

          {post.demo && (
            <div className="mt-5 rounded-xl border border-tangerine/40 bg-tangerine/10 px-5 py-4">
              <p className="font-body text-sm font-bold text-tangerine mb-1">
                Demodaten, keine echten Mails
              </p>
              <p className="font-body text-sm text-bone/85 leading-relaxed">
                {post.error
                  ? `Microsoft hat abgelehnt: ${post.error}`
                  : "Der Zugang zum Postfach fehlt noch. Die Einrichtung steht in docs/intern-support-mail.md und dauert einmalig etwa 15 Minuten. Sobald die vier Werte in .env.local stehen, zeigt diese Seite den echten Posteingang."}
              </p>
            </div>
          )}
        </header>

        {/* Die vier Zahlen fuer die Sichtung */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-px bg-hairline rounded-2xl overflow-hidden">
          <Kennzahl label="Ungelesen" wert={String(ungelesen)} hervorgehoben={ungelesen > 0} />
          <Kennzahl label="Heute eingegangen" wert={String(heute)} />
          <Kennzahl
            label="Zahlung gescheitert"
            wert={String(gescheitert)}
            zusatz={gescheitert > 0 ? "zuerst beantworten" : undefined}
            hervorgehoben={gescheitert > 0}
          />
          <Kennzahl
            label="Eingeordnet"
            wert={String(eingeordnet)}
            zusatz={
              zeilen.length > 0
                ? `von ${zeilen.length}, der Rest steht unter Sonstiges`
                : undefined
            }
          />
        </div>

        <section className="mt-5 rounded-2xl border border-hairline p-5 md:p-6">
          <h2 className="font-display text-xl text-bone">Posteingang</h2>
          <p className="font-body text-xs text-muted mt-1.5 mb-5 leading-relaxed max-w-2xl">
            Neueste zuerst. Die Kategorie kommt aus Stichwörtern in Betreff und Vorschau, die
            Einordnung daneben aus den Zahlungen. Unter jeder Mail liegt ein Antwortvorschlag
            zum Einfügen.
          </p>

          <KategorieFilter aktiv={filter} zaehler={zaehler} gesamt={zeilen.length} />

          {zeilen.length === 0 ? (
            <p className="font-body text-sm text-muted">Der Posteingang ist leer.</p>
          ) : sichtbar.length === 0 ? (
            <p className="font-body text-sm text-muted">
              Keine Mail in dieser Kategorie.{" "}
              <a href="/intern/support?kat=alle" className="text-tangerine hover:underline underline-offset-4">
                Alle zeigen
              </a>
            </p>
          ) : (
            <div className="divide-y divide-hairline/50">
              {sichtbar.map((z) => (
                <MailZeile key={z.mail.id} zeile={z} />
              ))}
            </div>
          )}
        </section>

        <p className="mt-10 font-body text-xs text-muted/70 leading-relaxed">
          Nur lesend. Der Antwortvorschlag ist ein Entwurf zum Gegenlesen und Einfügen, gesendet
          wird in Outlook oder im Mailprogramm. Mails kommen frisch aus dem Postfach, die Käufe
          dahinter sind höchstens zwei Minuten alt.
        </p>
      </div>
    </main>
  );
}

/* ── Bausteine ──────────────────────────────────────────────────────── */

function Kennzahl({
  label,
  wert,
  zusatz,
  hervorgehoben,
}: {
  label: string;
  wert: string;
  zusatz?: string;
  hervorgehoben?: boolean;
}) {
  return (
    <div className={`bg-licorice p-5 md:p-6 ${hervorgehoben ? "ring-1 ring-inset ring-tangerine/50" : ""}`}>
      <p className="font-body text-[11px] uppercase tracking-wider text-muted mb-2">{label}</p>
      <p className="font-display text-3xl md:text-4xl leading-none tabular-nums text-bone">{wert}</p>
      {zusatz && <p className="font-body text-xs text-muted mt-2 leading-snug">{zusatz}</p>}
    </div>
  );
}

/**
 * Filter als schlichte GET-Links, kein Zustand im Browser: Die Adresse ist
 * der Filter, laesst sich weitergeben und ueberlebt das Neuladen.
 */
function KategorieFilter({
  aktiv,
  zaehler,
  gesamt,
}: {
  aktiv: Kategorie | "alle";
  zaehler: Array<{ key: Kategorie; label: string; anzahl: number }>;
  gesamt: number;
}) {
  const eintraege: Array<{ key: Kategorie | "alle"; label: string; anzahl: number }> = [
    { key: "alle", label: "Alle", anzahl: gesamt },
    ...zaehler,
  ];

  return (
    <nav aria-label="Kategorie" className="mb-5 flex gap-2 flex-wrap">
      {eintraege.map((e) => (
        <a
          key={e.key}
          href={`/intern/support?kat=${e.key}`}
          aria-current={e.key === aktiv ? "page" : undefined}
          className={`rounded-full px-3 py-1.5 font-body text-xs font-bold uppercase tracking-wider transition-colors ${
            e.key === aktiv
              ? "bg-bone text-licorice"
              : "border border-hairline text-muted hover:text-bone hover:border-tangerine/50"
          }`}
        >
          {e.label} <span className="tabular-nums font-normal">{e.anzahl}</span>
        </a>
      ))}
    </nav>
  );
}

const EINORDNUNG_STIL: Record<string, string> = {
  bezahlt: "border-tangerine/50 text-tangerine",
  erstattet: "border-hibiscus/50 text-hibiscus",
  "teilweise erstattet": "border-hibiscus/50 text-hibiscus",
  fehlgeschlagen: "border-hibiscus/50 text-hibiscus",
  "kein Kauf": "border-hairline text-muted",
};

/* Nur wo das eine Wort allein missverstaendlich waere. */
const EINORDNUNG_TEXT: Record<string, string> = {
  fehlgeschlagen: "Zahlung gescheitert",
};

function MailZeile({ zeile }: { zeile: Zeile }) {
  const { mail, kontext, sichtung, entwurf } = zeile;

  const zeit = new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const einordnung = kontext.einordnung;

  return (
    <div className="py-4 flex gap-4">
      {/* Ungelesen-Punkt mit fester Spalte, damit die Zeilen fluchten */}
      <div className="w-2 pt-2 shrink-0">
        {mail.unread && (
          <span className="block h-2 w-2 rounded-full bg-tangerine" aria-label="ungelesen" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <p className="font-body text-sm min-w-0">
            <span className={mail.unread ? "font-bold text-bone" : "text-bone"}>
              {mail.from.name ?? mail.from.email}
            </span>
            {mail.from.name && <span className="text-muted"> · {mail.from.email}</span>}
          </p>
          <div className="flex items-center gap-3 shrink-0">
            {/* Kategorie gedaempft, Kaufkontext farbig: Der Kauf ist die
                harte Information, die Kategorie eine Vermutung aus Woertern. */}
            <span
              className="rounded-full border border-hairline px-2.5 py-0.5 font-body text-[11px] font-bold uppercase tracking-wider whitespace-nowrap text-muted"
              title={
                sichtung.treffer.length > 0
                  ? `Stichwörter: ${sichtung.treffer.join(", ")}`
                  : "Kein Stichwort erkannt"
              }
            >
              {KATEGORIE_LABEL[sichtung.kategorie]}
            </span>
            <span
              className={`rounded-full border px-2.5 py-0.5 font-body text-[11px] font-bold uppercase tracking-wider whitespace-nowrap ${EINORDNUNG_STIL[einordnung]}`}
            >
              {EINORDNUNG_TEXT[einordnung] ?? einordnung}
            </span>
            <span className="font-body text-xs text-muted tabular-nums whitespace-nowrap">
              {zeit.format(new Date(mail.receivedAt * 1000))}
            </span>
          </div>
        </div>

        <p className={`font-body text-sm mt-1 ${mail.unread ? "font-bold text-bone" : "text-bone/85"}`}>
          {mail.subject}
        </p>
        <p className="font-body text-sm text-muted mt-0.5 leading-relaxed line-clamp-2">
          {mail.preview}
        </p>

        <KontextZeile kontext={kontext} email={mail.from.email} webLink={mail.webLink} />
        <AntwortBlock entwurf={entwurf} email={mail.from.email} />
      </div>
    </div>
  );
}

/**
 * Die Zeile unter der Mail: was der Absender gekauft hat, und die zwei Wege
 * weiter. Kauf suchen springt in die Suche des Verkaufsdashboards, dieselbe
 * Adresse, keine zweite Suchlogik.
 */
function KontextZeile({
  kontext,
  email,
  webLink,
}: {
  kontext?: KaufKontext;
  email: string;
  webLink?: string;
}) {
  const sale = kontext?.sale;

  return (
    <div className="mt-2 flex items-baseline gap-4 flex-wrap font-body text-xs">
      {sale ? (
        <span className="text-muted">
          {produktLabel(sale.metadata.product)},{" "}
          {/* Bei einem Fehlversuch ist kein Geld geflossen. "39 € von 39 €"
              saehe aus wie eine Buchung, die es nie gab. */}
          {statusOf(sale) === "fehlgeschlagen" ? (
            <span className="tabular-nums">Versuch über {euro(sale.amountCents)}</span>
          ) : (
            <span className="tabular-nums">
              {euro(Math.max(0, sale.amountCents - sale.refundedCents))}
            </span>
          )}
          {sale.refundedCents > 0 && (
            <span className="tabular-nums"> von ursprünglich {euro(sale.amountCents)}</span>
          )}
          {kontext && kontext.anzahlBezahlt > 1 && <> · {kontext.anzahlBezahlt} bezahlte Käufe</>}
          {kontext && kontext.anzahlBezahlt > 0 && kontext.anzahlGescheitert > 0 && (
            <>
              {" "}
              · dazu{" "}
              {kontext.anzahlGescheitert === 1
                ? "ein Fehlversuch"
                : `${kontext.anzahlGescheitert} Fehlversuche`}
            </>
          )}
        </span>
      ) : (
        <span className="text-muted italic">kein Kauf zu dieser Adresse</span>
      )}

      <span className="flex gap-4">
        {webLink && (
          <a
            href={webLink}
            target="_blank"
            rel="noreferrer"
            className="text-tangerine hover:underline underline-offset-4"
          >
            In Outlook öffnen
          </a>
        )}
        <a
          href={`/intern/dashboard?q=${encodeURIComponent(email)}`}
          className="text-tangerine hover:underline underline-offset-4"
        >
          Kauf suchen
        </a>
      </span>
    </div>
  );
}

/**
 * Der Antwortentwurf, zugeklappt, damit die Liste ueberschaubar bleibt.
 * Der mailto-Link fuellt Empfaenger, Betreff und Text vor; Kopieren ist fuer
 * alle, die im offenen Outlook-Tab antworten.
 */
function AntwortBlock({ entwurf, email }: { entwurf: Antwort; email: string }) {
  // Zeilenumbrueche als CRLF: Einige Mailprogramme verschlucken ein nacktes
  // LF im mailto-Body, und dann steht der Entwurf als ein Absatz da.
  const mailto =
    `mailto:${email}` +
    `?subject=${encodeURIComponent(entwurf.betreff)}` +
    `&body=${encodeURIComponent(entwurf.text.replace(/\n/g, "\r\n"))}`;

  return (
    <details className="mt-3">
      <summary className="cursor-pointer inline-flex items-baseline gap-2 font-body text-xs text-tangerine hover:underline underline-offset-4">
        Antwortvorschlag
        {entwurf.locale === "en" && <span className="text-muted no-underline">auf Englisch</span>}
      </summary>
      <div className="mt-3 rounded-xl border border-hairline bg-surface p-4 md:p-5">
        <p className="font-body text-xs text-muted mb-3">
          Betreff: <span className="text-bone/85">{entwurf.betreff}</span>
        </p>
        <pre className="whitespace-pre-wrap font-body text-sm text-bone/90 leading-relaxed">
          {entwurf.text}
        </pre>
        <div className="mt-4 flex items-baseline gap-4 flex-wrap font-body text-xs">
          <a href={mailto} className="text-tangerine hover:underline underline-offset-4">
            In Mailprogramm öffnen
          </a>
          <Kopieren text={entwurf.text} />
          <span className="text-muted">Entwurf, vor dem Senden gegenlesen.</span>
        </div>
      </div>
    </details>
  );
}
