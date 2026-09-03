/**
 * Der Demohinweis, der nicht wegscrollt.
 *
 * Der Hinweis im Seitenkopf reicht nicht: Wer weiter unten einen Ausschnitt
 * anschaut oder abfotografiert, sieht ihn nicht, und dann sehen erfundene
 * Zahlen aus wie echte. Genau so ist es passiert. Diese Leiste klebt am
 * oberen Rand des Fensters und ist damit auf jedem Bildschirmausschnitt und
 * jedem Screenshot drauf.
 */
export function DemoLeiste({ text }: { text: string }) {
  return (
    <div className="sticky top-0 z-50 border-b border-tangerine/40 bg-licorice/95 backdrop-blur px-5 md:px-10 py-2">
      <p className="mx-auto max-w-6xl font-body text-xs font-bold uppercase tracking-wider text-tangerine">
        {text}
      </p>
    </div>
  );
}
