import { berlinDayStart, euro, produktLabel, statusOf } from "@/lib/stripe/report";
import { loadSales } from "@/lib/stripe/sales";
import { loadMails, supportMailbox } from "@/lib/mail/graph";
import { kaufKontext, type KaufKontext } from "@/lib/mail/kontext";
import type { SupportMail } from "@/lib/mail/types";

import { DemoLeiste } from "../demo";
import { InternNav } from "../nav";

/**
 * Supportbereich: der Posteingang, verknuepft mit den Kaeufen.
 *
 * Eine Kundenmail ist fast immer eine von drei Fragen, und die Antwort steht
 * in den Zahlungen. Deshalb steht neben jeder Mail, ob der Absender gekauft
 * hat, ob seine Zahlung durchging, scheiterte oder erstattet wurde. Das ist
 * der Unterschied zwischen einem Mailprogramm und einem Support-Werkzeug:
 * Die Antwort steht schon da, bevor jemand sucht.
 *
 * Beantwortet wird in Outlook, nicht hier. Ein eigener Antworteditor waere
 * ein zweites Mailprogramm, das keiner pflegt.
 */

export const dynamic = "force-dynamic";

/* Dieselbe Spanne wie im Verkaufsdashboard, damit die Verknuepfung beider
   Seiten auf denselben Kaeufen steht. */
const HISTORIE_TAGE = 400;

export default async function SupportPage() {
  const jetzt = new Date();

  const [post, verkauf] = await Promise.all([
    loadMails(),
    loadSales(berlinDayStart(jetzt, -(HISTORIE_TAGE - 1))),
  ]);

  const kontexte = new Map<string, KaufKontext>(
    post.mails.map((m) => [m.id, kaufKontext(verkauf.sales, m.from.email)]),
  );

  const heuteStart = berlinDayStart(jetzt);
  const ungelesen = post.mails.filter((m) => m.unread).length;
  const heute = post.mails.filter((m) => m.receivedAt >= heuteStart).length;
  const gescheitert = post.mails.filter(
    (m) => kontexte.get(m.id)?.einordnung === "fehlgeschlagen",
  ).length;

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

        {/* Die drei Zahlen fuer die Sichtung */}
        <div className="mt-8 grid grid-cols-3 gap-px bg-hairline rounded-2xl overflow-hidden">
          <Kennzahl label="Ungelesen" wert={String(ungelesen)} hervorgehoben={ungelesen > 0} />
          <Kennzahl label="Heute eingegangen" wert={String(heute)} />
          <Kennzahl
            label="Zahlung gescheitert"
            wert={String(gescheitert)}
            zusatz={gescheitert > 0 ? "zuerst beantworten" : undefined}
            hervorgehoben={gescheitert > 0}
          />
        </div>

        <section className="mt-5 rounded-2xl border border-hairline p-5 md:p-6">
          <h2 className="font-display text-xl text-bone">Posteingang</h2>
          <p className="font-body text-xs text-muted mt-1.5 mb-5 leading-relaxed max-w-2xl">
            Neueste zuerst. Die Einordnung daneben kommt aus den Zahlungen: was wir über den
            Absender wissen, bevor jemand sucht.
          </p>

          {post.mails.length === 0 ? (
            <p className="font-body text-sm text-muted">Der Posteingang ist leer.</p>
          ) : (
            <div className="divide-y divide-hairline/50">
              {post.mails.map((m) => (
                <MailZeile key={m.id} mail={m} kontext={kontexte.get(m.id)} />
              ))}
            </div>
          )}
        </section>

        <p className="mt-10 font-body text-xs text-muted/70 leading-relaxed">
          Nur lesend. Beantwortet wird in Outlook, der Link an jeder Mail öffnet sie dort. Mails
          und Käufe werden nicht zwischengespeichert.
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

function MailZeile({ mail, kontext }: { mail: SupportMail; kontext?: KaufKontext }) {
  const zeit = new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const einordnung = kontext?.einordnung ?? "kein Kauf";

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
