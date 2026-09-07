/**
 * Tagesbalken, geteilt zwischen Verkauf und Newsletter.
 *
 * Ein Balken je Tag, der laufende Tag blasser, weil er noch nicht voll ist.
 * Die Beschriftung je Balken liefert der Aufrufer, denn was in einem Tag
 * steckt, ist je Seite anders: einmal Paesse und Euro, einmal Anmeldungen.
 */

export interface BalkenTag {
  /** Tagesbeginn in Sekunden seit 1970. */
  start: number;
  count: number;
  /** Text fuer den Mauszeiger. */
  titel: string;
}

export function TagesBalken({ tage, leer }: { tage: BalkenTag[]; leer: string }) {
  if (tage.every((t) => t.count === 0)) {
    return <p className="font-body text-sm text-muted">{leer}</p>;
  }

  const spitze = Math.max(...tage.map((t) => t.count));
  // Nie durch null teilen, und ein einzelner Eintrag soll nicht als voller
  // Balken dastehen, als waere es ein Rekordtag.
  const skala = Math.max(3, spitze);

  const tagLabel = new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    day: "2-digit",
    month: "2-digit",
  });

  return (
    <figure className="m-0">
      <div className="flex items-end gap-[2px] h-24" role="presentation">
        {tage.map((t, i) => {
          const heute = i === tage.length - 1;
          return (
            <div key={t.start} className="flex-1 min-w-[2px] h-full flex items-end" title={t.titel}>
              <div
                className={`w-full rounded-sm ${heute ? "bg-tangerine/40" : "bg-tangerine"}`}
                style={{ height: `${Math.max((t.count / skala) * 100, t.count > 0 ? 3 : 0)}%` }}
              />
            </div>
          );
        })}
      </div>
      <figcaption className="flex justify-between mt-2 font-body text-[11px] tabular-nums text-muted">
        <span>{tagLabel.format(new Date(tage[0].start * 1000))}</span>
        <span>Höchster Tag: {spitze}</span>
        <span>heute</span>
      </figcaption>
    </figure>
  );
}
