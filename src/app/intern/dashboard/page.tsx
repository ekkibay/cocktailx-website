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
  dailySeries,
  euro,
  findSales,
  inRange,
  kanalLabel,
  pace,
  produktLabel,
  quotaUsage,
  statusOf,
  type Bucket,
  type Day,
  type Sale,
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

/* Wie weit zurueck geladen wird, unabhaengig von der Ansicht. Deckt den
   Vorverkauf ab und laesst Raum fuer den Vergleich mit dem Zeitraum davor. */
const HISTORIE_TAGE = 400;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { z?: string; q?: string };
}) {
  const zeitraum = ZEITRAEUME.find((z) => z.key === searchParams.z) ?? ZEITRAEUME[1];

  const jetzt = new Date();
  const jetztSek = Math.floor(jetzt.getTime() / 1000);
  const von = berlinDayStart(jetzt, -(zeitraum.tage - 1));

  /* Immer die volle Historie holen und im Speicher filtern, statt nur den
     gewaehlten Zeitraum zu laden.

     Kontingente sind kumulativ: "47 von 500" meint alle jemals eingeloesten,
     nicht die der letzten sieben Tage. Wuerde nur der Zeitraum geladen, saehe
     ein fast volles Kontingent in der 7-Tage-Ansicht leer aus, und das ist
     genau die Zahl, wegen der man die Seite aufmacht.

     Der Vergleich mit dem Zeitraum davor braucht ohnehin mehr Tage als der
     angezeigte. */
  const historieVon = berlinDayStart(jetzt, -(HISTORIE_TAGE - 1));
  const { sales, demo, error } = await loadSales(historieVon);

  const bericht = buildReport(inRange(sales, von, jetztSek + 1), von, jetztSek);
  const gesamt = buildReport(sales, historieVon, jetztSek);
  const heute = buildReport(inRange(sales, berlinDayStart(jetzt), jetztSek + 1), 0, 0);

  const suchbegriff = (searchParams.q ?? "").trim();
  const treffer = suchbegriff ? findSales(sales, suchbegriff) : [];

  const reihe = dailySeries(sales, jetzt, HISTORIE_TAGE);
  const tempo = pace(reihe, zeitraum.tage, jetzt.getTime(), FULL_PRICE_STARTS_AT);

  const tier = currentTier(jetzt.getTime());
  const tageBisUmstellung = Math.ceil((FULL_PRICE_STARTS_AT - jetzt.getTime()) / 86_400_000);

  const kontingente = quotaUsage(sales, [
    { id: "student-2026", label: "Studierende", quota: STUDENT_QUOTA },
    { id: "crm-newsletter-2026", label: "CRM und Newsletter", quota: null },
    { id: "drop-halloween", label: "Drop Halloween", quota: 150 },
  ]);

  // Aus der Gesamthistorie, nicht aus dem Zeitraum: Das Limit gilt fuer den
  // ganzen Vorverkauf, nicht fuer die letzten sieben Tage.
  const doubleVerkauft = gesamt.byProduct.find((b) => b.key === "doubleSeason")?.count ?? 0;

  return (
    <main className="min-h-screen px-5 py-8 md:px-10 md:py-12">
      <div className="mx-auto max-w-6xl">
        <Kopf demo={demo} fehler={error} />

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Zeitwahl aktiv={zeitraum.key} suche={suchbegriff} />
          <Suche zeitraum={zeitraum.key} wert={suchbegriff} />
        </div>

        {suchbegriff && <Treffer sales={treffer} begriff={suchbegriff} />}

        {/* Die vier Zahlen, die man morgens sehen will */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-px bg-hairline rounded-2xl overflow-hidden">
          <Kennzahl
            label="Pässe verkauft"
            wert={String(bericht.count)}
            zusatz={trendText(tempo.trend) ?? zeitraum.zusatz}
          />
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

        <Abschnitt
          titel="Verlauf"
          hinweis={`Bezahlte Käufe je Tag, ${zeitraum.zusatz}. Der laufende Tag ist noch nicht voll.`}
        >
          <Verlauf tage={reihe.slice(-zeitraum.tage)} />
          <Tempo tempo={tempo} tage={zeitraum.tage} />
        </Abschnitt>

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

        <Abschnitt
          titel="Export"
          hinweis="Der ganze geladene Vorverkauf als Tabelle, mit Semikolon und Byte Order Mark, damit deutsches Excel sie ohne Nacharbeit öffnet."
        >
          <div className="flex flex-wrap gap-3">
            <Herunterladen href="/intern/dashboard/export">Bezahlte Käufe</Herunterladen>
            <Herunterladen href="/intern/dashboard/export?alle=1">
              Mit gescheiterten Zahlungen
            </Herunterladen>
          </div>
          <p className="font-body text-xs text-muted mt-4 max-w-2xl leading-relaxed">
            Die Datei enthält Namen und Adressen der Käufer. Sie gehört nicht in einen geteilten
            Ordner und nicht in einen Mailverteiler.
          </p>
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

function Zeitwahl({ aktiv, suche }: { aktiv: string; suche: string }) {
  const ziel = (key: string) => `?z=${key}${suche ? `&q=${encodeURIComponent(suche)}` : ""}`;

  return (
    <nav className="flex gap-2">
      {ZEITRAEUME.map((z) => (
        <a
          key={z.key}
          href={ziel(z.key)}
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
    <div className="divide-y divide-hairline/50 -my-2.5">
      {sales.map((s) => (
        <div key={s.id} className="flex items-baseline justify-between gap-4 py-2.5">
          <div className="min-w-0">
            <p
              className={`font-body text-sm truncate ${
                s.metadata.product ? "text-bone" : "text-muted italic"
              }`}
            >
              {produktLabel(s.metadata.product)}
            </p>
            <p className="font-body text-xs text-muted mt-0.5">
              <span className="tabular-nums">{zeit.format(new Date(s.created * 1000))}</span>
              {s.metadata.channel ? (
                <> · {kanalLabel(s.metadata.channel)}</>
              ) : (
                <> · <span className="italic">ohne Angabe</span></>
              )}
            </p>
          </div>
          <p className="font-body text-sm text-bone tabular-nums whitespace-nowrap">
            {euro(s.amountCents - s.refundedCents)}
            {s.refundedCents > 0 && <span className="text-hibiscus ml-2">erstattet</span>}
          </p>
        </div>
      ))}
    </div>
  );
}

/**
 * Veraenderung gegenueber dem gleich langen Zeitraum davor, als Satz.
 *
 * Bewusst in Worten und nicht als Zahl mit Vorzeichen: "12 % weniger als
 * davor" ist auf einen Blick klar, ein vorangestelltes Minus vor einer
 * Prozentzahl liest sich in einer Kennzahlenreihe leicht als Betrag.
 */
function trendText(trend: number | null): string | undefined {
  if (trend === null) return undefined;
  const prozent = Math.round(Math.abs(trend) * 100);
  if (prozent === 0) return "gleich viel wie im Zeitraum davor";
  return `${prozent} % ${trend > 0 ? "mehr" : "weniger"} als im Zeitraum davor`;
}

function Verlauf({ tage }: { tage: Day[] }) {
  if (tage.every((t) => t.count === 0)) {
    return <p className="font-body text-sm text-muted">Noch keine Käufe in diesem Zeitraum.</p>;
  }

  const spitze = Math.max(...tage.map((t) => t.count));
  // Nie durch null teilen, und ein einzelner Kauf soll nicht als voller
  // Balken dastehen, als waere es ein Rekordtag.
  const skala = Math.max(3, spitze);

  const tagLabel = new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    day: "2-digit",
    month: "2-digit",
  });
  const beschriftung = (t: Day) => tagLabel.format(new Date(t.start * 1000));

  return (
    <figure className="m-0">
      <div className="flex items-end gap-[2px] h-24" role="presentation">
        {tage.map((t, i) => {
          const heute = i === tage.length - 1;
          return (
            <div
              key={t.start}
              className="flex-1 min-w-[2px] h-full flex items-end"
              title={`${beschriftung(t)}: ${t.count} ${t.count === 1 ? "Pass" : "Pässe"}, ${euro(t.netCents)}`}
            >
              <div
                className={`w-full rounded-sm ${heute ? "bg-tangerine/40" : "bg-tangerine"}`}
                style={{ height: `${Math.max((t.count / skala) * 100, t.count > 0 ? 3 : 0)}%` }}
              />
            </div>
          );
        })}
      </div>
      <figcaption className="flex justify-between mt-2 font-body text-[11px] tabular-nums text-muted">
        <span>{beschriftung(tage[0])}</span>
        <span>Höchster Tag: {spitze}</span>
        <span>heute</span>
      </figcaption>
    </figure>
  );
}

/**
 * Was aus dem gemessenen Tempo bis zur Preisumstellung wird.
 *
 * Die Hochrechnung ist eine gerade Verlaengerung, nicht mehr. Sie steht hier
 * mit dieser Einschraenkung dabei, weil die Frage "reicht das noch" sonst gar
 * nicht beantwortet wird. Eine Zahl ohne den Hinweis waere schlimmer als
 * keine, weil sie nach Vorhersage aussaehe.
 */
function Tempo({ tempo, tage }: { tempo: ReturnType<typeof pace>; tage: number }) {
  const proTag = tempo.perDay.toLocaleString("de-DE", { maximumFractionDigits: 1 });
  // "1 Pässe pro Tag" liest sich wie ein Fehler und laesst die ganze Seite
  // unfertig wirken.
  const einheit = proTag === "1" ? "Pass" : "Pässe";

  return (
    <div className="mt-5 pt-5 border-t border-hairline font-body text-sm leading-relaxed">
      <p className="text-bone">
        <span className="tabular-nums font-bold">{proTag}</span> {einheit} pro Tag über die letzten{" "}
        {tage} Tage.
        {tempo.daysLeft > 0 && (
          <>
            {" "}
            Bei diesem Tempo kommen bis zur Umstellung am Ende des {EARLY_UNTIL_LABEL} noch rund{" "}
            <span className="tabular-nums font-bold">{tempo.expected}</span> dazu.
          </>
        )}
      </p>
      {tempo.daysLeft > 0 && (
        <p className="text-muted text-xs mt-2 max-w-2xl">
          Gerade verlängert, ohne Aufschlag. Vorverkäufe ziehen vor einem Stichtag erfahrungsgemäß
          an, die Zahl ist also eher eine Untergrenze als eine Vorhersage. Der laufende Tag zählt
          nicht mit, sonst sähe jeder Vormittag wie ein Einbruch aus.
        </p>
      )}
    </div>
  );
}

/**
 * Suche nach einem einzelnen Kauf.
 *
 * Ein gewoehnliches Formular mit GET, kein Client-JavaScript. Die Suche steht
 * damit in der Adresszeile und laesst sich als Lesezeichen ablegen oder in
 * einen Ticketkommentar kopieren, was bei einem Supportfall haeufiger
 * vorkommt, als man denkt.
 */
function Suche({ zeitraum, wert }: { zeitraum: string; wert: string }) {
  return (
    <form method="get" className="flex gap-2 md:w-[26rem]">
      {/* Sonst faellt die Ansicht bei jeder Suche auf die Voreinstellung zurueck. */}
      <input type="hidden" name="z" value={zeitraum} />
      <input
        type="search"
        name="q"
        defaultValue={wert}
        placeholder="E-Mail, Name oder Zahlungs-ID"
        aria-label="Kauf suchen"
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

const STATUSFARBE: Record<ReturnType<typeof statusOf>, string> = {
  bezahlt: "text-tangerine",
  "teilweise erstattet": "text-hibiscus",
  erstattet: "text-hibiscus",
  fehlgeschlagen: "text-hibiscus",
};

/**
 * Trefferliste.
 *
 * Zeigt bewusst auch gescheiterte Zahlungen und den Beleglink. Der haeufigste
 * Supportfall ist "ich habe nichts bekommen", und die Antwort steht damit
 * vollstaendig auf dieser Seite, statt in Stripe.
 */
function Treffer({ sales, begriff }: { sales: Sale[]; begriff: string }) {
  const zeit = new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <section className="mt-5 rounded-2xl border border-tangerine/40 p-5 md:p-6">
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <h2 className="font-display text-xl text-bone">
          {sales.length === 0
            ? "Nichts gefunden"
            : `${sales.length} Treffer`}
        </h2>
        <a href="?" className="font-body text-xs text-muted hover:text-bone underline underline-offset-4">
          Suche zurücksetzen
        </a>
      </div>

      {sales.length > 0 && (
        <p className="font-body text-xs text-muted mt-1.5">
          Über den ganzen geladenen Vorverkauf, unabhängig vom gewählten Zeitraum oben.
        </p>
      )}

      {sales.length === 0 ? (
        <p className="font-body text-sm text-muted mt-3 max-w-2xl leading-relaxed">
          Zu „{begriff}“ gibt es keinen Kauf im geladenen Zeitraum. Gesucht wird in Adresse, Name,
          Zahlungs-ID und Bar-Kennung, ab drei Zeichen. Wenn jemand mit einer anderen Adresse
          bezahlt hat als der, mit der er schreibt, hilft die Suche nach dem Nachnamen.
        </p>
      ) : (
        <div className="mt-5 space-y-4">
          {sales.map((s) => {
            const status = statusOf(s);
            return (
              <div key={s.id} className="rounded-xl bg-surface p-4">
                <div className="flex items-baseline justify-between gap-4 flex-wrap">
                  <p className="font-body text-sm text-bone">
                    {s.name ?? <span className="text-muted italic">ohne Namen</span>}
                    {s.email && <span className="text-muted"> · {s.email}</span>}
                  </p>
                  <p className={`font-body text-xs font-bold uppercase tracking-wider ${STATUSFARBE[status]}`}>
                    {status}
                  </p>
                </div>

                <p className="font-body text-sm text-muted mt-2">
                  <span className="tabular-nums">{zeit.format(new Date(s.created * 1000))}</span> ·{" "}
                  {produktLabel(s.metadata.product)}
                  {s.metadata.channel && <> · {kanalLabel(s.metadata.channel)}</>} ·{" "}
                  <span className="tabular-nums text-bone">{euro(s.amountCents - s.refundedCents)}</span>
                  {s.refundedCents > 0 && (
                    <span className="tabular-nums"> von ursprünglich {euro(s.amountCents)}</span>
                  )}
                </p>

                <div className="flex gap-4 mt-3 flex-wrap items-center">
                  <code className="font-mono text-[11px] text-muted break-all">{s.id}</code>
                  {s.receiptUrl && (
                    <a
                      href={s.receiptUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-body text-xs text-tangerine hover:underline underline-offset-4"
                    >
                      Beleg öffnen
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function Herunterladen({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      // download hier bewusst nicht: Der Dateiname kommt aus dem
      // Content-Disposition-Header und traegt den Stand und den Hinweis auf
      // Demodaten. Ein download-Attribut wuerde ihn ueberschreiben.
      className="rounded-full border border-hairline bg-surface px-4 py-2 font-body text-xs font-bold uppercase tracking-wider text-bone hover:border-tangerine/50 transition-colors"
    >
      {children}
    </a>
  );
}
