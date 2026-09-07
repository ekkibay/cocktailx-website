import { EVENT } from "@/config/pricing";
import { newsletterBericht } from "@/lib/newsletter/auswertung";
import { loadMitglieder } from "@/lib/newsletter/mitglieder";

import { TagesBalken } from "../balken";
import { DemoLeiste } from "../demo";
import { InternNav } from "../nav";

/**
 * Newsletter im internen Bereich: Wie viele lesen mit, wie schnell waechst
 * es, wer kam zuletzt dazu.
 *
 * Die Zahlen kommen aus der Mailgun-Liste. Mailgun selbst zeigt eine
 * Mitgliederzahl und sonst wenig; Verlauf, Sprachen und Vergleich zur
 * Vorwoche gibt es dort nicht, und genau die braucht man, um zu wissen, ob
 * ein Post oder eine Ankuendigung etwas gebracht hat.
 */

export const dynamic = "force-dynamic";

export default async function NewsletterPage() {
  const jetzt = new Date();
  const { mitglieder, demo, error, vollstaendig } = await loadMitglieder();
  const b = newsletterBericht(mitglieder, jetzt, 30);

  const zeit = new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const tag = new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin", day: "2-digit", month: "2-digit" });

  return (
    <main className="min-h-screen pb-8 md:pb-12">
      {demo && <DemoLeiste text="Demodaten, keine echten Anmeldungen" />}
      <div className="mx-auto max-w-6xl px-5 pt-8 md:px-10 md:pt-12">
        <InternNav aktiv="newsletter" />

        <header>
          <p className="font-body text-[11px] font-bold uppercase tracking-[0.3em] text-tangerine mb-3">
            Intern
          </p>
          <h1 className="font-display text-4xl md:text-5xl leading-none">Newsletter ON ICE</h1>

          {demo && (
            <div className="mt-5 rounded-xl border border-tangerine/40 bg-tangerine/10 px-5 py-4">
              <p className="font-body text-sm font-bold text-tangerine mb-1">
                Demodaten, keine echten Anmeldungen
              </p>
              <p className="font-body text-sm text-bone/85 leading-relaxed">
                {error
                  ? `Mailgun hat abgelehnt: ${error}`
                  : "Es fehlen MAILGUN_API_KEY, MAILGUN_DOMAIN oder MAILGUN_NEWSLETTER_LIST in .env.local. Sobald die drei stehen, zeigt diese Seite den echten Verteiler."}
              </p>
            </div>
          )}

          {!vollstaendig && (
            <p className="mt-4 font-body text-sm text-hibiscus">
              Achtung: Der Verteiler ist groesser, als die Seite laedt. Alle Zahlen sind zu niedrig.
            </p>
          )}
        </header>

        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-px bg-hairline rounded-2xl overflow-hidden">
          <Kennzahl label="Lesen mit" wert={String(b.aktiv)} zusatz={b.abgemeldet > 0 ? `${b.abgemeldet} abgemeldet` : "niemand abgemeldet"} />
          <Kennzahl label="Heute" wert={String(b.heute)} zusatz="bestätigte Anmeldungen" hervorgehoben={b.heute > 0} />
          <Kennzahl label="Letzte 7 Tage" wert={String(b.letzte7)} zusatz={vergleich(b.letzte7, b.vorherige7)} />
          <Kennzahl
            label="Sprachen"
            wert={`${anteil(b.sprachen.de, b.aktiv)} / ${anteil(b.sprachen.en, b.aktiv)}`}
            zusatz={b.sprachen.unbekannt > 0 ? `Deutsch / Englisch, ${b.sprachen.unbekannt} ohne Angabe` : "Deutsch / Englisch"}
          />
        </div>

        <Abschnitt
          titel="Verlauf"
          hinweis="Bestätigte Anmeldungen je Tag, die letzten 30 Tage. Der laufende Tag ist noch nicht voll."
        >
          <TagesBalken
            leer="Noch keine Anmeldungen in diesem Zeitraum."
            tage={b.tage.map((t) => ({
              ...t,
              titel: `${tag.format(new Date(t.start * 1000))}: ${t.count} ${t.count === 1 ? "Anmeldung" : "Anmeldungen"}`,
            }))}
          />
          {b.ohneDatum > 0 && (
            <p className="mt-4 font-body text-xs text-muted">
              {b.ohneDatum === 1 ? "Ein Eintrag" : `${b.ohneDatum} Einträge`} ohne Bestätigungsdatum, vermutlich von Hand in Mailgun
              angelegt. Zählt oben mit, im Verlauf nicht.
            </p>
          )}
        </Abschnitt>

        <Abschnitt titel="Zuletzt dazugekommen" hinweis="Die zwölf neuesten Bestätigungen.">
          {b.letzte.length === 0 ? (
            <p className="font-body text-sm text-muted">Noch niemand.</p>
          ) : (
            <div className="divide-y divide-hairline/50 -my-2.5">
              {b.letzte.map((m) => (
                <div key={m.email} className="flex items-baseline justify-between gap-4 py-2.5">
                  <p className={`font-body text-sm truncate ${m.subscribed ? "text-bone" : "text-muted line-through"}`}>
                    {m.email}
                  </p>
                  <p className="font-body text-xs text-muted tabular-nums whitespace-nowrap">
                    {m.locale ? `${m.locale.toUpperCase()} · ` : ""}
                    {m.bestaetigtAm ? zeit.format(new Date(m.bestaetigtAm * 1000)) : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Abschnitt>

        <Abschnitt
          titel="Export"
          hinweis="Der ganze Verteiler als Tabelle für deutsches Excel, mit Sprache, Datum und Status."
        >
          <a
            href="/intern/newsletter/export"
            className="inline-block rounded-full border border-hairline bg-surface px-4 py-2 font-body text-xs font-bold uppercase tracking-wider text-bone hover:border-tangerine/50 transition-colors"
          >
            Verteiler herunterladen
          </a>
          <p className="font-body text-xs text-muted mt-4 max-w-2xl leading-relaxed">
            Die Datei enthält E-Mail-Adressen. Sie gehört nicht in einen geteilten Ordner. Wer sie in
            ein anderes Werkzeug lädt, nimmt die Einwilligungsnachweise mit, die stehen in den
            Spalten daneben.
          </p>
        </Abschnitt>

        <p className="mt-10 font-body text-xs text-muted/70 leading-relaxed">
          {EVENT.name} {EVENT.edition}. Abmeldungen führt Mailgun, die Zahlen hier sind höchstens zwei Minuten alt.
        </p>
      </div>
    </main>
  );
}

/* ── Bausteine ──────────────────────────────────────────────────────── */

function anteil(n: number, von: number): string {
  if (von === 0) return "0 %";
  return `${Math.round((n / von) * 100)} %`;
}

function vergleich(jetzt: number, vorher: number): string {
  if (vorher === 0) return jetzt > 0 ? "in der Woche davor keine" : "wie in der Woche davor";
  const p = Math.round(((jetzt - vorher) / vorher) * 100);
  if (p === 0) return "gleich viel wie in der Woche davor";
  return `${Math.abs(p)} % ${p > 0 ? "mehr" : "weniger"} als in der Woche davor`;
}

function Kennzahl({ label, wert, zusatz, hervorgehoben }: { label: string; wert: string; zusatz?: string; hervorgehoben?: boolean }) {
  return (
    <div className={`bg-licorice p-5 md:p-6 ${hervorgehoben ? "ring-1 ring-inset ring-tangerine/50" : ""}`}>
      <p className="font-body text-[11px] uppercase tracking-wider text-muted mb-2">{label}</p>
      <p className="font-display text-3xl md:text-4xl leading-none tabular-nums text-bone">{wert}</p>
      {zusatz && <p className="font-body text-xs text-muted mt-2 leading-snug">{zusatz}</p>}
    </div>
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
