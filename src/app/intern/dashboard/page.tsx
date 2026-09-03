import {
  DOUBLE_SEASON_LIMIT,
  EARLY_UNTIL_LABEL,
  EVENT,
  FULL_PRICE_STARTS_AT,
  TIERS,
  currentTier,
} from "@/config/pricing";
import { STUDENT_QUOTA } from "@/lib/tickets/students";
import { loadSales } from "@/lib/stripe/sales";
import {
  berlinDayStart,
  buildReport,
  euro,
  inRange,
  kanalLabel,
  produktLabel,
  quotaUsage,
  type Bucket,
} from "@/lib/stripe/report";

/**
 * Verkaufsdashboard fuer ON ICE.
 *
 * Baut bewusst nicht Stripe nach. Stripe kann Umsatz, Zahlungen und
 * Rueckerstattungen besser, als ich es je koennte. Was Stripe strukturell
 * nicht kann, weil es unsere Begriffe nicht kennt, ist genau das hier:
 *
 *   Welcher Kanal bringt was? Stripe kennt unsere Kanal-Tags nicht.
 *   Wie voll sind die Kontingente? Stripe kennt unsere Fenster nicht.
 *   Was passiert am 15. Oktober? Stripe kennt den Stichtag nicht.
 *
 * Deshalb steht die Kanalaufteilung oben und nicht der Gesamtumsatz.
 */

export const dynamic = "force-dynamic";

const ZEITRAEUME = [
  { key: "7", label: "7 Tage", zusatz: "in den letzten 7 Tagen", tage: 7 },
  { key: "30", label: "30 Tage", zusatz: "in den letzten 30 Tagen", tage: 30 },
  { key: "all", label: "Gesamt", zusatz: "seit Verkaufsstart", tage: 400 },
] as const;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { z?: string };
}) {
  const zeitraum = ZEITRAEUME.find((z) => z.key === searchParams.z) ?? ZEITRAEUME[1];

  const jetzt = new Date();
  const jetztSek = Math.floor(jetzt.getTime() / 1000);
  const von = berlinDayStart(jetzt, -(zeitraum.tage - 1));

  const { sales, demo, error } = await loadSales(von);

  const bericht = buildReport(sales, von, jetztSek);
  const heute = buildReport(inRange(sales, berlinDayStart(jetzt), jetztSek + 1), 0, 0);

  const tier = currentTier(jetzt.getTime());
  const tageBisUmstellung = Math.ceil((FULL_PRICE_STARTS_AT - jetzt.getTime()) / 86_400_000);

  const kontingente = quotaUsage(sales, [
    { id: "student-2026", label: "Studierende", quota: STUDENT_QUOTA },
    { id: "crm-newsletter-2026", label: "CRM und Newsletter", quota: null },
    { id: "drop-halloween", label: "Drop Halloween", quota: 150 },
  ]);

  const doubleVerkauft =
    bericht.byProduct.find((b) => b.key === "doubleSeason")?.count ?? 0;

  return (
    <main className="min-h-screen px-5 py-8 md:px-10 md:py-12">
      <div className="mx-auto max-w-6xl">
        <Kopf demo={demo} fehler={error} />

        <Zeitwahl aktiv={zeitraum.key} />

        {/* Die vier Zahlen, die man morgens sehen will */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-px bg-hairline rounded-2xl overflow-hidden">
          <Kennzahl label="Pässe verkauft" wert={String(bericht.count)} zusatz={zeitraum.zusatz} />
          <Kennzahl label="Netto" wert={euro(bericht.netCents)} zusatz={bericht.refundedCents > 0 ? `abzüglich ${euro(bericht.refundedCents)} erstattet` : "keine Erstattungen"} />
          <Kennzahl label="Heute" wert={String(heute.count)} zusatz={euro(heute.netCents)} />
          <Kennzahl
            label={tier === "early" ? "Bis zur Umstellung" : "Tarif"}
            wert={tier === "early" ? `${Math.max(0, tageBisUmstellung)} Tage` : `${TIERS.full.price} €`}
            zusatz={tier === "early" ? `dann ${TIERS.full.price} € statt ${TIERS.early.price} €` : "regulär, seit dem Stichtag"}
            hervorgehoben={tier === "early" && tageBisUmstellung <= 14}
          />
        </div>

        {bericht.untaggedShare > 0 && <Warnung anteil={bericht.untaggedShare} />}

        {/* Kanaele zuerst. Das ist die Frage, die Stripe nicht beantwortet. */}
        <Abschnitt
          titel="Woher die Käufe kommen"
          hinweis="Aus den Metadaten der Zahlung. Ohne Angabe heißt: Der Shop hat den Kanal nicht mitgeschickt."
        >
          <Balken eimer={bericht.byChannel} gesamt={bericht.netCents} />
        </Abschnitt>

        <div className="grid lg:grid-cols-2 gap-5 mt-5">
          <Abschnitt titel="Nach Produkt">
            <Balken eimer={bericht.byProduct} gesamt={bericht.netCents} />
          </Abschnitt>

          <Abschnitt
            titel="Nach Preisstufe"
            hinweis={`Die Stufe zum Kaufzeitpunkt. Umstellung am Ende des ${EARLY_UNTIL_LABEL}.`}
          >
            <Balken eimer={bericht.byTier} gesamt={bericht.netCents} />
          </Abschnitt>
        </div>

        <Abschnitt
          titel="Kontingente"
          hinweis="Gezählt wird gegen die Fenster-Kennung, nicht gegen den Kanal. Mehrere Drops füllen sich also nicht gegenseitig auf."
        >
          <div className="space-y-4">
            {kontingente.map((k) => (
              <Fortschritt key={k.key} label={k.label} benutzt={k.used} gesamt={k.total} />
            ))}
            <Fortschritt label="Double Season" benutzt={doubleVerkauft} gesamt={DOUBLE_SEASON_LIMIT} />
          </div>
        </Abschnitt>

        {bericht.byBar.length > 0 && (
          <Abschnitt titel="Bar-Codes" hinweis="Nur Käufe, die über einen Bar-Code liefen.">
            <Balken eimer={bericht.byBar} gesamt={bericht.byBar.reduce((n, b) => n + b.netCents, 0)} />
          </Abschnitt>
        )}

        <Abschnitt titel="Zuletzt" hinweis="Die letzten zwölf bezahlten Käufe.">
          <Liste sales={sales.filter((s) => s.paid).slice(0, 12)} />
        </Abschnitt>

        <p className="mt-10 font-body text-xs text-muted/70 leading-relaxed">
          {EVENT.name} {EVENT.edition}, {EVENT.dateLabel}. Alle Beträge inklusive Mehrwertsteuer.
          Rechnungsstelle bayundco GmbH. Zahlen kommen direkt aus Stripe und werden nicht
          zwischengespeichert.
        </p>
      </div>
    </main>
  );
}

/* ── Bausteine ──────────────────────────────────────────────────────── */

function Kopf({ demo, fehler }: { demo: boolean; fehler?: string }) {
  return (
    <header>
      <p className="font-body text-[11px] font-bold uppercase tracking-[0.3em] text-tangerine mb-3">
        Intern
      </p>
      <h1 className="font-display text-4xl md:text-5xl leading-none">Verkauf ON ICE</h1>

      {demo && (
        <div className="mt-5 rounded-xl border border-tangerine/40 bg-tangerine/10 px-5 py-4">
          <p className="font-body text-sm font-bold text-tangerine mb-1">
            Demodaten, keine echten Verkäufe
          </p>
          <p className="font-body text-sm text-bone/85 leading-relaxed">
            {fehler
              ? `Stripe hat abgelehnt: ${fehler}`
              : "STRIPE_SECRET_KEY fehlt in .env.local. Sobald der Schlüssel dort steht, zeigt diese Seite echte Zahlen, ohne dass sonst etwas zu tun wäre."}
          </p>
        </div>
      )}
    </header>
  );
}

function Zeitwahl({ aktiv }: { aktiv: string }) {
  return (
    <nav className="mt-6 flex gap-2">
      {ZEITRAEUME.map((z) => (
        <a
          key={z.key}
          href={`?z=${z.key}`}
          className={`rounded-full px-4 py-2 font-body text-xs font-bold uppercase tracking-wider transition-colors ${
            z.key === aktiv
              ? "bg-tangerine text-licorice"
              : "border border-hairline text-muted hover:text-bone hover:border-tangerine/50"
          }`}
        >
          {z.label}
        </a>
      ))}
    </nav>
  );
}

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

function Warnung({ anteil }: { anteil: number }) {
  const prozent = Math.round(anteil * 100);
  return (
    <div className="mt-5 rounded-xl border border-hibiscus/40 bg-hibiscus/10 px-5 py-4">
      <p className="font-body text-sm font-bold text-hibiscus mb-1">
        {prozent} % der Käufe kommen ohne Kanal an
      </p>
      <p className="font-body text-sm text-bone/85 leading-relaxed">
        Für diese Käufe lässt sich nicht sagen, woher sie kamen. Der Shop muss bei jeder Zahlung
        die Felder product, tier, channel und windowId als Metadaten mitschicken. Solange das
        fehlt, ist jede Aussage über Kanäle unvollständig.
      </p>
    </div>
  );
}

function Abschnitt({
  titel,
  hinweis,
  children,
}: {
  titel: string;
  hinweis?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-5 rounded-2xl border border-hairline p-5 md:p-6">
      <h2 className="font-display text-xl text-bone">{titel}</h2>
      {hinweis && <p className="font-body text-xs text-muted mt-1.5 mb-5 leading-relaxed max-w-2xl">{hinweis}</p>}
      <div className={hinweis ? "" : "mt-5"}>{children}</div>
    </section>
  );
}

function Balken({ eimer, gesamt }: { eimer: Bucket[]; gesamt: number }) {
  if (eimer.length === 0) {
    return <p className="font-body text-sm text-muted">Noch keine Käufe in diesem Zeitraum.</p>;
  }

  return (
    <div className="space-y-3">
      {eimer.map((b) => {
        const anteil = gesamt > 0 ? b.netCents / gesamt : 0;
        const ohneAngabe = b.key === "__none";
        return (
          <div key={b.key}>
            <div className="flex items-baseline justify-between gap-4 mb-1.5">
              <span className={`font-body text-sm ${ohneAngabe ? "text-muted italic" : "text-bone"}`}>
                {b.label}
              </span>
              <span className="font-body text-sm tabular-nums text-bone/85 whitespace-nowrap">
                {b.count} · {euro(b.netCents)}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-surface overflow-hidden">
              <div
                className={`h-full rounded-full ${ohneAngabe ? "bg-muted/40" : "bg-tangerine"}`}
                style={{ width: `${Math.max(anteil * 100, anteil > 0 ? 1.5 : 0)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Fortschritt({
  label,
  benutzt,
  gesamt,
}: {
  label: string;
  benutzt: number;
  gesamt: number | null;
}) {
  if (gesamt === null) {
    return (
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-body text-sm text-bone">{label}</span>
        <span className="font-body text-sm tabular-nums text-muted">{benutzt} eingelöst, ohne Limit</span>
      </div>
    );
  }

  const anteil = gesamt > 0 ? benutzt / gesamt : 0;
  // Ab drei Vierteln wird es knapp, dann soll es ins Auge fallen.
  const knapp = anteil >= 0.75;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 mb-1.5">
        <span className="font-body text-sm text-bone">{label}</span>
        <span className={`font-body text-sm tabular-nums ${knapp ? "text-hibiscus" : "text-muted"}`}>
          {benutzt} von {gesamt}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-surface overflow-hidden">
        <div
          className={`h-full rounded-full ${knapp ? "bg-hibiscus" : "bg-tangerine"}`}
          style={{ width: `${Math.min(100, anteil * 100)}%` }}
        />
      </div>
    </div>
  );
}

function Liste({ sales }: { sales: { id: string; created: number; amountCents: number; refundedCents: number; metadata: Record<string, string | undefined> }[] }) {
  if (sales.length === 0) {
    return <p className="font-body text-sm text-muted">Noch nichts verkauft.</p>;
  }

  const zeit = new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-hairline">
            {["Zeit", "Produkt", "Kanal", "Betrag"].map((h) => (
              <th key={h} className="font-body text-[11px] uppercase tracking-wider text-muted pb-2 pr-4 font-bold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sales.map((s) => (
            <tr key={s.id} className="border-b border-hairline/50">
              <td className="font-body text-sm text-muted py-2.5 pr-4 tabular-nums whitespace-nowrap">
                {zeit.format(new Date(s.created * 1000))}
              </td>
              <td className="font-body text-sm text-bone py-2.5 pr-4">{produktLabel(s.metadata.product)}</td>
              <td className="font-body text-sm py-2.5 pr-4">
                {s.metadata.channel ? (
                  <span className="text-bone/85">{kanalLabel(s.metadata.channel)}</span>
                ) : (
                  <span className="text-muted italic">ohne Angabe</span>
                )}
              </td>
              <td className="font-body text-sm text-bone py-2.5 tabular-nums whitespace-nowrap">
                {euro(s.amountCents - s.refundedCents)}
                {s.refundedCents > 0 && <span className="text-hibiscus ml-2">erstattet</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
