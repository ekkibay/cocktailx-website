/** Siehe dashboard/loading.tsx: Wartezeit sichtbar machen statt haengen. */
export default function Laden() {
  return (
    <main className="min-h-screen px-5 py-8 md:px-10 md:py-12">
      <div className="mx-auto max-w-6xl">
        <p className="font-body text-[11px] font-bold uppercase tracking-[0.3em] text-tangerine mb-3">
          Intern
        </p>
        <h1 className="font-display text-4xl md:text-5xl leading-none">Newsletter ON ICE</h1>
        <p className="mt-6 font-body text-sm text-muted animate-pulse">
          Der Verteiler wird aus Mailgun geladen.
        </p>
      </div>
    </main>
  );
}
