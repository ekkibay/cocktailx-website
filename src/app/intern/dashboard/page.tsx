import { TagesBalken } from "../balken";
import { DemoLeiste } from "../demo";
import { InternNav } from "../nav";

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
  filterOnIce,
  findSales,
  inRange,
  kanalLabel,
  pace,
  produktLabel,
  quotaUsage,
  statusOf,
  type Bucket,
  type OnIceFilter,
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
  searchParams: { z?: string; q?: string; alle?: string };
}) {
  const zeitraum = ZEITRAEUME.find((z) => z.key === searchParams.z) ?? ZEITRAEUME[1];
  const alle = searchParams.alle === "1";

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
  const { sales, demo, error, vollstaendig } = await loadSales(historieVon);

  /* Das Stripe-Konto ist geteilt: Catering, anderes Geschaeft und ON ICE
     laufen ueber dasselbe Konto. Voreinstellung ist deshalb "nur ON ICE",
     und was herausfaellt, steht mit Zahl und Betrag ueber den Kennzahlen.
     Mit alle=1 zaehlt die Seite das ganze Konto. */
  const sichtbar = alle ? sales : filterOnIce(sales).onice;

  const bericht = buildReport(inRange(sichtbar, von, jetztSek + 1), von, jetztSek);
  const gesamt = buildReport(sichtbar, historieVon, jetztSek);
  const heute = buildReport(inRange(sichtbar, berlinDayStart(jetzt), jetztSek + 1), 0, 0);

  /* Fuer die Hinweise ueber den Kennzahlen: Was liegt im gewaehlten Zeitraum
     ausserhalb von ON ICE, und wie viele ON ICE Kaeufe sind nur am Betrag
     erkannt. Die Warnung zu fehlenden Metadaten richtet sich an den Shop und
     wird deshalb immer auf ON ICE gerechnet. In der Ansicht des ganzen
     Kontos wuerde sie sonst Catering-Rechnungen vorwerfen, keinen Kanal zu
     tragen. */
  const bereiche = filterOnIce(inRange(sales, von, jetztSek + 1));
  const onIceBericht = alle ? buildReport(bereiche.onice, von, jetztSek) : bericht;

  // Die Suche geht ueber alle Zahlungen des Kontos: Wer nach einem Namen
  // sucht, will den Kauf finden, auch wenn die Zuordnung danebenlag.
  const suchbegriff = (searchParams.q ?? "").trim();
  const treffer = suchbegriff ? findSales(sales, suchbegriff) : [];

  const reihe = dailySeries(sichtbar, jetzt, HISTORIE_TAGE);
  const tagLabel = new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin", day: "2-digit", month: "2-digit" });
  const tempo = pace(reihe, zeitraum.tage, jetzt.getTime(), FULL_PRICE_STARTS_AT);

  const tier = currentTier(jetzt.getTime());
  const tageBisUmstellung = Math.ceil((FULL_PRICE_STARTS_AT - jetzt.getTime()) / 86_400_000);

  const kontingente = quotaUsage(sichtbar, [
    { id: "student-2026", label: "Studierende", quota: STUDENT_QUOTA },
    { id: "crm-newsletter-2026", label: "CRM und Newsletter", quota: null },
    { id: "drop-halloween", label: "Drop Halloween", quota: 150 },
  ]);

  // Aus der Gesamthistorie, nicht aus dem Zeitraum: Das Limit gilt fuer den
  // ganzen Vorverkauf, nicht fuer die letzten sieben Tage.
  const doubleVerkauft = gesamt.byProduct.find((b) => b.key === "doubleSeason")?.count ?? 0;

  return (
    <main className="min-h-screen pb-8 md:pb-12">
      {demo && <DemoLeiste text="Demodaten, keine echten Verkäufe" />}
      <div className="mx-auto max-w-6xl px-5 pt-8 md:px-10 md:pt-12">
        <InternNav aktiv="verkauf" />
        <Kopf demo={demo} fehler={error} />

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Zeitwahl aktiv={zeitraum.key} alle={alle} suche={suchbegriff} />
          <Suche zeitraum={zeitraum.key} alle={alle} wert={suchbegriff} />
        </div>

        {suchbegriff && (
          <Treffer sales={treffer} begriff={suchbegriff} zurueck={adresse({ z: zeitraum.key, alle })} />
        )}

        <Bereiche
          alle={alle}
          ausgeblendet={bereiche.ausgeblendet}
          vermutet={bereiche.vermutet}
          wechsel={adresse({ z: zeitraum.key, alle: !alle, q: suchbegriff })}
        />

        {/* Die vier Zahlen, die man morgens sehen will */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-px bg-hairline rounded-2xl overflow-hidden">
          <Kennzahl
            label={alle ? "Zahlungen" : "Pässe verkauft"}
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

        {!vollstaendig && <Unvollstaendig />}

        {onIceBericht.untaggedShare > 0 && <Warnung anteil={onIceBericht.untaggedShare} />}

        {bericht.failedCount > 0 && (
          <Gescheitert anzahl={bericht.failedCount} betrag={bericht.failedCents} />
        )}

        <Abschnitt
          titel="Verlauf"
          hinweis={`Bezahlte Käufe je Tag, ${zeitraum.zusatz}. Der laufende Tag ist noch nicht voll.`}
        >
          <TagesBalken
            leer="Noch keine Käufe in diesem Zeitraum."
            tage={reihe.slice(-zeitraum.tage).map((t) => ({
              start: t.start,
              count: t.count,
              titel: `${tagLabel.format(new Date(t.start * 1000))}: ${t.count} ${t.count === 1 ? "Pass" : "Pässe"}, ${euro(t.netCents)}`,
            }))}
          />
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
          <Liste sales={sichtbar.filter((s) => s.paid).slice(0, 12)} />
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
          Rechnungsstelle bayundco GmbH. Zahlen kommen direkt aus Stripe und sind höchstens zwei
          Minuten alt.
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

/**
 * Baut die Adresse so, dass Zeitraum, Ansicht und Suche zusammen erhalten
 * bleiben. Jeder Link auf der Seite geht hier durch, sonst faellt bei einem
 * Klick auf den Zeitraum still die Ansicht auf "nur ON ICE" zurueck.
 */
function adresse(p: { z: string; alle: boolean; q?: string }): string {
  const teile = [`z=${p.z}`];
  if (p.alle) teile.push("alle=1");
  if (p.q) teile.push(`q=${encodeURIComponent(p.q)}`);
  return `?${teile.join("&")}`;
}

function Zeitwahl({ aktiv, alle, suche }: { aktiv: string; alle: boolean; suche: string }) {
  return (
    <nav className="flex gap-2">
      {ZEITRAEUME.map((z) => (
        <a
          key={z.key}
          href={adresse({ z: z.key, alle, q: suche })}
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

/**
 * Was ausserhalb von ON ICE liegt, und was nur vermutet ist.
 *
 * Leise, als Saetze statt als Kasten: Das ist keine Stoerung, sondern die
 * Erklaerung, warum die Zahlen unten kleiner sind als in Stripe. Dastehen
 * muss es trotzdem, sonst vergleicht jemand beide Summen und traut keiner
 * von beiden mehr.
 */
function Bereiche({
  alle,
  ausgeblendet,
  vermutet,
  wechsel,
}: {
  alle: boolean;
  ausgeblendet: OnIceFilter["ausgeblendet"];
  vermutet: number;
  wechsel: string;
}) {
  const link = (text: string) => (
    <a href={wechsel} className="text-tangerine hover:underline underline-offset-4">
      {text}
    </a>
  );
  const zeilen: React.ReactNode[] = [];

  if (alle) {
    zeilen.push(
      <p key="alle">
        Ansicht des ganzen Stripe-Kontos.{" "}
        {ausgeblendet.count > 0
          ? `${zahlungen(ausgeblendet.count)} (${euro(ausgeblendet.netCents)}) ${
              ausgeblendet.count === 1 ? "gehört" : "gehören"
            } nicht zu ON ICE und ${ausgeblendet.count === 1 ? "zählt" : "zählen"} hier mit.`
          : "Im Zeitraum liegt nichts außerhalb von ON ICE."}{" "}
        {link("Nur ON ICE anzeigen")}
      </p>,
    );
  } else if (ausgeblendet.count > 0) {
    zeilen.push(
      <p key="ausgeblendet">
        {zahlungen(ausgeblendet.count)} außerhalb ON ICE ausgeblendet ({euro(ausgeblendet.netCents)}),{" "}
        {herkunft(ausgeblendet.bereiche)}. {link("Alle anzeigen")}
      </p>,
    );
  }

  if (vermutet > 0) {
    zeilen.push(
      <p key="vermutet">
        {vermutet === 1 ? "Ein Kauf ist" : `${vermutet} Käufe sind`} nur am Betrag erkannt, weil der
        Shop keine Produktangabe mitschickt.
      </p>,
    );
  }

  if (zeilen.length === 0) return null;
  return <div className="mt-8 space-y-1.5 font-body text-sm text-muted leading-relaxed">{zeilen}</div>;
}

function zahlungen(n: number): string {
  return n === 1 ? "Eine Zahlung" : `${n} Zahlungen`;
}

/**
 * Woher die ausgeblendeten Zahlungen vermutlich stammen.
 *
 * "Vermutlich Catering" nur, wenn die Erkennung das auch hergibt. Solange
 * der Shop und die Rechnungen keine Angaben mitschicken, weiss die Seite
 * nur, dass die Betraege zu keinem Pass passen, und sagt genau das.
 */
function herkunft(bereiche: OnIceFilter["ausgeblendet"]["bereiche"]): string {
  const catering = bereiche.catering ?? 0;
  const sonstiges = bereiche.sonstiges ?? 0;
  if (catering > 0 && sonstiges === 0) return "als Catering erkannt";
  if (catering > 0) return `${catering} davon als Catering erkannt, der Rest anderes Geschäft`;
  return "vermutlich Catering oder anderes Geschäft";
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
                {b.count === 1 ? "1 Kauf" : `${b.count} Käufe`} · {euro(b.netCents)}
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
function Suche({ zeitraum, alle, wert }: { zeitraum: string; alle: boolean; wert: string }) {
  return (
    <form method="get" className="flex gap-2 md:w-[26rem]">
      {/* Sonst faellt die Ansicht bei jeder Suche auf die Voreinstellung zurueck. */}
      <input type="hidden" name="z" value={zeitraum} />
      {alle && <input type="hidden" name="alle" value="1" />}
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
function Treffer({ sales, begriff, zurueck }: { sales: Sale[]; begriff: string; zurueck: string }) {
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
        <a href={zurueck} className="font-body text-xs text-muted hover:text-bone underline underline-offset-4">
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

/**
 * Gescheiterte Zahlungen.
 *
 * Bewusst als Hinweis und nicht als Alarm: Ein paar sind immer dabei,
 * abgelaufene Karten, abgelehnte Lastschriften. Interessant ist der Sprung,
 * und den sieht man nur, wenn die Zahl ueberhaupt dasteht. Der Link fuehrt
 * in die Suche, wo die Faelle mit Namen stehen.
 */
function Gescheitert({ anzahl, betrag }: { anzahl: number; betrag: number }) {
  return (
    <p className="mt-5 font-body text-sm text-muted leading-relaxed">
      {anzahl === 1 ? "Eine Zahlung ist" : `${anzahl} Zahlungen sind`} in diesem Zeitraum
      gescheitert, zusammen {euro(betrag)}. Nicht im Umsatz oben enthalten. Wer dahintersteckt,
      steht in der Suche, sobald der Name oder die Adresse bekannt ist.
    </p>
  );
}

/**
 * Wird nur gezeigt, wenn die Obergrenze des Abrufs erreicht wurde. Dann
 * fehlen Zahlungen, und jede Summe auf der Seite ist zu klein. Das muss
 * lauter sein als jede andere Meldung, weil es jede andere Zahl betrifft.
 */
function Unvollstaendig() {
  return (
    <div className="mt-5 rounded-xl border border-hibiscus bg-hibiscus/15 px-5 py-4">
      <p className="font-body text-sm font-bold text-hibiscus mb-1">
        Achtung: Nicht alle Zahlungen geladen
      </p>
      <p className="font-body text-sm text-bone/85 leading-relaxed">
        Im Zeitraum liegen mehr Zahlungen, als der Abruf hereinholt. Alle Summen auf dieser Seite
        sind deshalb zu niedrig. Das passiert erst bei sehr vielen Zahlungen je Zeitscheibe; sag
        Bescheid, dann drehen wir die Grenze hoch.
      </p>
    </div>
  );
}
