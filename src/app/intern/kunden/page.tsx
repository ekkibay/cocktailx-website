import { EVENT } from "@/config/pricing";
import { kundenAus, kundenBericht, sucheKunden, type Kunde } from "@/lib/crm/kunden";
import { loadMitglieder, type MitgliederErgebnis } from "@/lib/newsletter/mitglieder";
import { berlinDayStart, euro, produktLabel } from "@/lib/stripe/report";
import { loadSales, type SalesResult } from "@/lib/stripe/sales";

import { DemoLeiste } from "../demo";
import { InternNav } from "../nav";

/**
 * Kundensicht fuer ON ICE: Wer hat gekauft, wie oft, liest die Person den
 * Newsletter mit, und bei wem ist die Zahlung gescheitert.
 *
 * Stripe zeigt Zahlungen, Mailgun zeigt Adressen. Die Frage nach der Person
 * dahinter beantwortet keiner von beiden, und genau die stellt sich vor dem
 * Event: Wen erreicht die Mail mit den Routen, wer hat zweimal gekauft, wer
 * wollte kaufen und kam nicht durch. Die Rechnung dazu steht in
 * lib/crm/kunden.ts, diese Seite zeigt sie nur.
 */

export const dynamic = "force-dynamic";

/* Dieselbe Spanne wie Verkauf und Support, damit alle drei Seiten auf
   denselben Kaeufen stehen. */
const HISTORIE_TAGE = 400;

/* Mehr Zeilen liest niemand von oben nach unten. Wer weiter hinten steht,
   ist ueber die Suche schneller gefunden als durch Scrollen. */
const MAX_ZEILEN = 50;

const DATUM = new Intl.DateTimeFormat("de-DE", {
  timeZone: "Europe/Berlin",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export default async function KundenPage({ searchParams }: { searchParams: { q?: string; nur?: string } }) {
  const jetzt = new Date();

  const [verkauf, verteiler] = await Promise.all([
    loadSales(berlinDayStart(jetzt, -(HISTORIE_TAGE - 1))),
    loadMitglieder(),
  ]);

  const { kunden, ohneAdresse } = kundenAus(verkauf.sales, verteiler.mitglieder);
  const b = kundenBericht(kunden);

  const suchbegriff = (searchParams.q ?? "").trim();
  // Der Filter haengt an der Kennzahl oben: Wer die hervorgehobene Zahl
  // sieht, will die Faelle dahinter, und die stehen bei vielen Kunden nicht
  // in den ersten fuenfzig Zeilen. Eine Suche geht vor.
  const nurFehlversuch = !suchbegriff && searchParams.nur === "fehlversuch";
  const liste = suchbegriff
    ? sucheKunden(kunden, suchbegriff)
    : nurFehlversuch
      ? kunden.filter((k) => k.kaeufe.length === 0 && k.fehlversuche > 0)
      : kunden;
  const gezeigt = liste.slice(0, MAX_ZEILEN);
  const { titel, hinweis } = ueberschrift(suchbegriff, nurFehlversuch, liste.length);

  const demo = verkauf.demo || verteiler.demo;

  return (
    <main className="min-h-screen pb-8 md:pb-12">
      {demo && <DemoLeiste text={demoText(verkauf.demo, verteiler.demo)} />}
      <div className="mx-auto max-w-6xl px-5 pt-8 md:px-10 md:pt-12">
        <InternNav aktiv="kunden" />

        <header>
          <p className="font-body text-[11px] font-bold uppercase tracking-[0.3em] text-tangerine mb-3">
            Intern
          </p>
          <h1 className="font-display text-4xl md:text-5xl leading-none">Kunden ON ICE</h1>

          {demo && (
            <div className="mt-5 rounded-xl border border-tangerine/40 bg-tangerine/10 px-5 py-4">
              <p className="font-body text-sm font-bold text-tangerine mb-1">
                {demoText(verkauf.demo, verteiler.demo)}
              </p>
              <p className="font-body text-sm text-bone/85 leading-relaxed">
                {demoErklaerung(verkauf, verteiler)}
              </p>
            </div>
          )}

          {!verkauf.vollstaendig && (
            <p className="mt-4 font-body text-sm text-hibiscus">
              Achtung: Nicht alle Zahlungen geladen. Kunden können fehlen, und jede Zahl auf dieser
              Seite ist zu niedrig.
            </p>
          )}
          {!verteiler.vollstaendig && (
            <p className="mt-4 font-body text-sm text-hibiscus">
              Achtung: Der Verteiler ist größer, als die Seite lädt. Der Newsletter-Abgleich kann
              Mitglieder übersehen.
            </p>
          )}
        </header>

        {/* Die vier Zahlen, um die es geht */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-px bg-hairline rounded-2xl overflow-hidden">
          <Kennzahl
            label="Kunden"
            wert={String(b.gesamt)}
            zusatz={
              ohneAdresse > 0
                ? `dazu ${ohneAdresse === 1 ? "eine Zahlung" : `${ohneAdresse} Zahlungen`} ohne Adresse`
                : "jede Zahlung mit Adresse"
            }
          />
          <Kennzahl label="Mehrfachkäufer" wert={String(b.mehrfachkaeufer)} zusatz="zwei oder mehr bezahlte Käufe" />
          <Kennzahl label="Im Newsletter" wert={String(b.imNewsletter)} zusatz={anteil(b.imNewsletter, b.gesamt)} />
          <Kennzahl
            label="Nur Fehlversuch"
            wert={String(b.nurFehlversuch)}
            zusatz={
              b.nurFehlversuch > 0
                ? "wollten kaufen, kein Kauf ging durch. Anklicken zeigt sie"
                : "hinter jedem Kunden steht ein Kauf"
            }
            hervorgehoben={b.nurFehlversuch > 0}
            href={b.nurFehlversuch > 0 ? "?nur=fehlversuch" : undefined}
          />
        </div>

        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Suche wert={suchbegriff} />
          {(suchbegriff || nurFehlversuch) && (
            <a href="?" className="font-body text-xs text-muted hover:text-bone underline underline-offset-4">
              {suchbegriff ? "Suche zurücksetzen" : "Alle Kunden anzeigen"}
            </a>
          )}
        </div>

        <Abschnitt titel={titel} hinweis={hinweis}>
          {liste.length === 0 ? (
            <Leer suchbegriff={suchbegriff} nurFehlversuch={nurFehlversuch} />
          ) : (
            <div className="divide-y divide-hairline/50 -my-3">
              {gezeigt.map((k) => (
                <KundenZeile key={k.email} kunde={k} />
              ))}
            </div>
          )}

          {liste.length > MAX_ZEILEN && (
            <p className="mt-5 pt-5 border-t border-hairline font-body text-xs text-muted leading-relaxed max-w-2xl">
              Gezeigt werden die ersten {MAX_ZEILEN} von {liste.length}. Wer weiter hinten steht, ist
              über die Suche schneller zu finden; die ganze Liste steht im Export unten.
            </p>
          )}
        </Abschnitt>

        <Abschnitt
          titel="Export"
          hinweis="Alle Kunden als Tabelle für deutsches Excel, mit Käufen, Netto, Produkten und Newsletter-Stand."
        >
          <a
            href="/intern/kunden/export"
            className="inline-block rounded-full border border-hairline bg-surface px-4 py-2 font-body text-xs font-bold uppercase tracking-wider text-bone hover:border-tangerine/50 transition-colors"
          >
            Kunden herunterladen
          </a>
          <p className="font-body text-xs text-muted mt-4 max-w-2xl leading-relaxed">
            Die Datei enthält Namen und Adressen der Käufer. Sie gehört nicht in einen geteilten
            Ordner und nicht in einen Mailverteiler.
          </p>
        </Abschnitt>

        <p className="mt-10 font-body text-xs text-muted/70 leading-relaxed">
          {EVENT.name} {EVENT.edition}. Käufe kommen aus Stripe, der Newsletter-Abgleich aus
          Mailgun. Beides ist höchstens zwei Minuten alt.
        </p>
      </div>
    </main>
  );
}

/* ── Bausteine ──────────────────────────────────────────────────────── */

function demoText(verkaufDemo: boolean, verteilerDemo: boolean): string {
  if (verkaufDemo && verteilerDemo) return "Demodaten, keine echten Kunden";
  if (verkaufDemo) return "Demodaten, keine echten Käufe";
  return "Newsletter-Abgleich aus Demodaten";
}

/**
 * Sagt, welcher Zugang fehlt. Beide Quellen koennen unabhaengig voneinander
 * ausfallen, und "Demodaten" allein laesst raten, welche gemeint ist.
 */
function demoErklaerung(verkauf: SalesResult, verteiler: MitgliederErgebnis): string {
  const teile: string[] = [];
  if (verkauf.demo) {
    teile.push(
      verkauf.error
        ? `Stripe hat abgelehnt: ${verkauf.error}.`
        : "STRIPE_SECRET_KEY fehlt in .env.local, die Käufe sind erfunden.",
    );
  }
  if (verteiler.demo) {
    teile.push(
      verteiler.error
        ? `Mailgun hat abgelehnt: ${verteiler.error}.`
        : "Für den Newsletter-Abgleich fehlen MAILGUN_API_KEY, MAILGUN_DOMAIN oder MAILGUN_NEWSLETTER_LIST in .env.local.",
    );
  }
  teile.push("Sobald die Zugänge stehen, zeigt diese Seite echte Kunden, ohne dass sonst etwas zu tun wäre.");
  return teile.join(" ");
}

function anteil(n: number, von: number): string {
  if (von === 0) return "noch keine Kunden";
  return `${Math.round((n / von) * 100)} % der Kunden lesen mit`;
}

/** Ueberschrift und Erklaerung der Liste, je nachdem, was gerade gezeigt wird. */
function ueberschrift(
  suchbegriff: string,
  nurFehlversuch: boolean,
  treffer: number,
): { titel: string; hinweis: string } {
  if (suchbegriff) {
    return {
      titel: treffer === 0 ? "Nichts gefunden" : treffer === 1 ? "Ein Treffer" : `${treffer} Treffer`,
      hinweis: `Zu „${suchbegriff}“, gesucht in Adresse und Name.`,
    };
  }
  if (nurFehlversuch) {
    return {
      titel: "Nur Fehlversuch",
      hinweis:
        "Kunden ohne bezahlten Kauf, neuester Versuch zuerst. Das sind die, die sich beim Support melden, und hier stehen sie, bevor sie es tun.",
    };
  }
  return {
    titel: "Alle Kunden",
    hinweis:
      "Neueste zuerst. Käufe ansehen springt in die Suche des Verkaufsdashboards, dort stehen Beleg und Zahlungs-ID.",
  };
}

/**
 * Kennzahl-Kachel. Mit href wird die ganze Kachel zum Link, damit die Zahl
 * nicht nur alarmiert, sondern auch zu den Faellen fuehrt.
 */
function Kennzahl({
  label,
  wert,
  zusatz,
  hervorgehoben,
  href,
}: {
  label: string;
  wert: string;
  zusatz?: string;
  hervorgehoben?: boolean;
  href?: string;
}) {
  const klasse = `block bg-licorice p-5 md:p-6 ${hervorgehoben ? "ring-1 ring-inset ring-tangerine/50" : ""} ${
    href ? "hover:bg-surface transition-colors" : ""
  }`;
  const inhalt = (
    <>
      <p className="font-body text-[11px] uppercase tracking-wider text-muted mb-2">{label}</p>
      <p className="font-display text-3xl md:text-4xl leading-none tabular-nums text-bone">{wert}</p>
      {zusatz && <p className="font-body text-xs text-muted mt-2 leading-snug">{zusatz}</p>}
    </>
  );
  return href ? (
    <a href={href} className={klasse}>
      {inhalt}
    </a>
  ) : (
    <div className={klasse}>{inhalt}</div>
  );
}

function Abschnitt({ titel, hinweis, children }: { titel: string; hinweis?: string; children: React.ReactNode }) {
  return (
    <section className="mt-5 rounded-2xl border border-hairline p-5 md:p-6">
      <h2 className="font-display text-xl text-bone">{titel}</h2>
      {hinweis && <p className="font-body text-xs text-muted mt-1.5 mb-5 leading-relaxed max-w-2xl">{hinweis}</p>}
      <div className={hinweis ? "" : "mt-5"}>{children}</div>
    </section>
  );
}

/**
 * Suche nach einem Kunden.
 *
 * Ein gewoehnliches Formular mit GET, wie im Verkaufsdashboard: Die Suche
 * steht in der Adresszeile und laesst sich in einen Ticketkommentar kopieren.
 */
function Suche({ wert }: { wert: string }) {
  return (
    <form method="get" className="flex gap-2 md:w-[26rem]">
      <input
        type="search"
        name="q"
        defaultValue={wert}
        placeholder="E-Mail oder Name"
        aria-label="Kunden suchen"
        className="flex-1 min-w-0 rounded-full border border-hairline bg-surface px-4 py-2 font-body text-sm text-bone placeholder:text-muted focus:border-tangerine/60 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-full bg-surface border border-hairline px-4 py-2 font-body text-xs font-bold uppercase tracking-wider text-bone hover:border-tangerine/50 transition-colors"
      >
        Suchen
      </button>
    </form>
  );
}

function Leer({ suchbegriff, nurFehlversuch }: { suchbegriff: string; nurFehlversuch: boolean }) {
  if (!suchbegriff) {
    return (
      <p className="font-body text-sm text-muted">
        {nurFehlversuch
          ? "Niemand. Hinter jedem Kunden steht ein bezahlter Kauf."
          : "Noch keine Kunden im geladenen Vorverkauf."}
      </p>
    );
  }
  if (suchbegriff.length < 2) {
    return (
      <p className="font-body text-sm text-muted max-w-2xl leading-relaxed">
        Bitte mindestens zwei Zeichen. Mit einem passt fast jede Adresse, und eine Liste mit allem
        drin ist keine Antwort.
      </p>
    );
  }
  return (
    <p className="font-body text-sm text-muted max-w-2xl leading-relaxed">
      Zu „{suchbegriff}“ gibt es keinen Kunden im geladenen Vorverkauf. Gesucht wird in Adresse und
      Name. Wenn jemand mit einer anderen Adresse bezahlt hat als der, mit der er schreibt, hilft
      der Nachname.
    </p>
  );
}

const MARKE = {
  tangerine: "border-tangerine/50 text-tangerine",
  muted: "border-hairline text-muted",
  hibiscus: "border-hibiscus/50 text-hibiscus",
} as const;

function Marke({ ton, children }: { ton: keyof typeof MARKE; children: React.ReactNode }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 font-body text-[11px] font-bold uppercase tracking-wider whitespace-nowrap ${MARKE[ton]}`}
    >
      {children}
    </span>
  );
}

/**
 * Eine Zeile je Kunde. Links die Person und was sie gekauft hat, rechts der
 * letzte Kauf und der Sprung in die Kaufsuche. Bewusst keine Tabelle: Auf
 * dem Telefon bricht eine Tabelle mit sieben Spalten, eine Zeile mit zwei
 * Haelften bricht sauber untereinander.
 */
function KundenZeile({ kunde }: { kunde: Kunde }) {
  const nurFehlversuch = kunde.kaeufe.length === 0 && kunde.fehlversuche > 0;
  const anzahl = kunde.kaeufe.length;

  return (
    <div className="py-3 flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between md:gap-4">
      <div className="min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <p className="font-body text-sm min-w-0">
            {kunde.name ? (
              <span className="text-bone">{kunde.name}</span>
            ) : (
              <span className="text-muted italic">ohne Namen</span>
            )}
            <span className="text-muted"> · {kunde.email}</span>
          </p>
          {kunde.newsletter === "aktiv" && <Marke ton="tangerine">Newsletter</Marke>}
          {kunde.newsletter === "abgemeldet" && <Marke ton="muted">Newsletter abgemeldet</Marke>}
          {nurFehlversuch && <Marke ton="hibiscus">Zahlung gescheitert</Marke>}
        </div>

        <p className="font-body text-xs text-muted mt-1">
          {nurFehlversuch ? (
            <>
              kein bezahlter Kauf
              {kunde.fehlversuche > 1 && <>, {kunde.fehlversuche} Versuche</>}
            </>
          ) : (
            <>
              {kunde.produkte.length > 0 ? (
                kunde.produkte.map(produktLabel).join(", ")
              ) : (
                <span className="italic">Produkt ohne Angabe</span>
              )}
              {" · "}
              <span className="tabular-nums">
                {anzahl === 1 ? "1 Kauf" : `${anzahl} Käufe`} · {euro(kunde.nettoCents)}
              </span>
              {kunde.fehlversuche > 0 && (
                <> · dazu {kunde.fehlversuche === 1 ? "ein Fehlversuch" : `${kunde.fehlversuche} Fehlversuche`}</>
              )}
            </>
          )}
        </p>
      </div>

      <div className="flex items-baseline gap-4 shrink-0 font-body text-xs">
        <span className="text-muted tabular-nums whitespace-nowrap">
          {kunde.letzterKauf
            ? DATUM.format(new Date(kunde.letzterKauf * 1000))
            : kunde.letzterFehlversuch
              ? `Versuch am ${DATUM.format(new Date(kunde.letzterFehlversuch * 1000))}`
              : ""}
        </span>
        <a
          href={`/intern/dashboard?q=${encodeURIComponent(kunde.email)}`}
          className="text-tangerine hover:underline underline-offset-4 whitespace-nowrap"
        >
          Käufe ansehen
        </a>
      </div>
    </div>
  );
}
