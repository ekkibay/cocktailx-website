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
  variant = "block",
  className = "",
}: {
  tier: TierKey;
  /** Zu zeigender Preis. Bei Bundles der Bundle-Preis, sonst der Einzelpreis. */
  price: number;
  variant?: PriceTagVariant;
  className?: string;
}) {
  const isEarly = tier === "early";

  /* Streichpreis nur, wenn er zum gezeigten Preis passt. Beim Einzelpass ist
     das der Referenzpreis, bei Bundles rechnet die aufrufende Stelle ihren
     eigenen Vergleichswert aus und uebergibt ihn ueber `price`. */
  const reference = price === TIERS.early.price ? REFERENCE_PRICE : null;

  if (variant === "inline") {
    return (
      <span className={`inline-flex items-baseline gap-1.5 ${className}`}>
        {isEarly && reference !== null && (
          <span className="text-bone/45 line-through tabular-nums" aria-hidden>
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
