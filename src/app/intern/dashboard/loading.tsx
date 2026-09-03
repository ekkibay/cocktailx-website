/**
 * Zwischenstand, waehrend die Zahlungen aus Stripe kommen.
 *
 * Der volle Abruf dauert beim ersten Mal einige Sekunden, danach traegt der
 * Zwischenspeicher. Ohne diese Anzeige sieht die Wartezeit wie eine haengende
 * Seite aus, und genau so wurde sie auch gemeldet.
 */
export default function Laden() {
  return (
    <main className="min-h-screen px-5 py-8 md:px-10 md:py-12">
      <div className="mx-auto max-w-6xl">
        <p className="font-body text-[11px] font-bold uppercase tracking-[0.3em] text-tangerine mb-3">
          Intern
        </p>
        <h1 className="font-display text-4xl md:text-5xl leading-none">Verkauf ON ICE</h1>
        <p className="mt-6 font-body text-sm text-muted animate-pulse">
          Zahlungen kommen frisch aus Stripe, das dauert beim ersten Aufruf ein paar Sekunden.
        </p>
      </div>
    </main>
  );
}
