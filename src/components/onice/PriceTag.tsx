import { EARLY_UNTIL_SHORT, REFERENCE_PRICE, SAVING_EUR, SAVING_PCT, TIERS, type TierKey } from "@/config/pricing";

/**
 * Preisdarstellung mit Streichpreis.
 *
 * Eine Komponente fuer Header, Hero und Preiskarten, damit der Rabatt ueberall
 * gleich aussieht und, wichtiger, ueberall gleichzeitig verschwindet. Ab dem
 * regulaeren Tarif faellt die gesamte Early-Bird-Darstellung weg: kein
 * Streichpreis, kein Label, kein Hinweis auf die Frist. Uebrig bleibt eine
 * Zahl. Das ist die Vorgabe und zugleich das Ehrlichere, ein Streichpreis
 * gegen sich selbst waere eine Luege.
 *
 * Der Tarif wird bewusst hereingereicht statt hier berechnet: Die aufrufende
 * Seite kennt den serverseitigen Zeitstempel, und nur so stimmt die Anzeige
 * schon beim ersten Rendern.
 */

export type PriceTagVariant = "inline" | "block" | "card";

export default function PriceTag({
  tier,
  price,
  reference: referenceProp,
  variant = "block",
  className = "",
}: {
  tier: TierKey;
  /** Zu zeigender Preis. Bei Bundles der Bundle-Preis, sonst der Einzelpreis. */
  price: number;
  /**
   * Vergleichswert fuer den Streichpreis. Ohne Angabe der Referenzpreis des
   * Einzelpasses, aber nur wenn hier auch der Einzelpass gezeigt wird.
   *
   * Vorher schloss die Komponente allein vom Betrag auf das Produkt. Sobald
   * irgendein Bundle zufaellig denselben Preis wie der Einzelpass gehabt
   * haette, waere ihm ein falscher Streichpreis angeheftet worden.
   */
  reference?: number | null;
  variant?: PriceTagVariant;
  className?: string;
}) {
  const isEarly = tier === "early";

  const reference =
    referenceProp !== undefined
      ? referenceProp
      : price === TIERS.early.price
        ? REFERENCE_PRICE
        : null;

  if (variant === "inline") {
    return (
      /* whitespace-nowrap, sonst bricht der Knopf zwischen Zahl und Einheit um
         und es steht "PASS 49 39" ueber "SICHERN € €".

         Der Streichpreis nimmt die Textfarbe des Knopfes mit opacity statt
         einer festen hellen Farbe. Vorher stand hier text-bone/45, also helle
         Schrift auf hellem Eisblau: auf dem Kauf-Knopf war die 49 praktisch
         unsichtbar, und genau sie traegt den Rabatt. */
      <span className={`inline-flex items-baseline gap-1.5 whitespace-nowrap ${className}`}>
        {isEarly && reference !== null && (
          <span className="line-through tabular-nums opacity-50" aria-hidden>
            {reference} €
          </span>
        )}
        <span className="tabular-nums">{price} €</span>
        {isEarly && reference !== null && (
          <span className="sr-only">statt {reference} Euro regulär</span>
        )}
      </span>
    );
  }

  if (variant === "card") {
    return (
      <div className={className}>
        <div className="flex items-baseline gap-3">
          <span className="font-display text-5xl text-bone leading-none tabular-nums">{price} €</span>
          {isEarly && reference !== null && (
            <span className="font-display text-2xl text-muted/70 line-through leading-none tabular-nums" aria-hidden>
              {reference} €
            </span>
          )}
        </div>
        {isEarly && reference !== null && (
          <p className="font-body text-xs font-bold uppercase tracking-wider text-tangerine mt-2">
            Du sparst {SAVING_EUR} €
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 ${className}`}>
      <div className="flex items-baseline gap-3">
        <span className="font-display text-6xl md:text-7xl text-bone leading-none tabular-nums">{price} €</span>
        {isEarly && reference !== null && (
          <span className="font-display text-3xl md:text-4xl text-muted/60 line-through leading-none tabular-nums" aria-hidden>
            {reference} €
          </span>
        )}
      </div>
      {isEarly && reference !== null && (
        <span className="rounded-full bg-tangerine px-3.5 py-1.5 font-body text-[11px] font-bold uppercase tracking-[0.12em] text-licorice">
          {SAVING_PCT} % bis {EARLY_UNTIL_SHORT}
        </span>
      )}
    </div>
  );
}
