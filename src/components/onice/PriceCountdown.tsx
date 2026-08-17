"use client";

import { useEffect, useState } from "react";
import { EARLY_UNTIL_SHORT, TIERS, currentTier, daysUntilFullPrice } from "@/config/pricing";

/**
 * Zeigt bis zum 15.10. den Rabattdruck, danach ein Kapazitaets-Framing.
 *
 * Der Serverwert wird als Startwert gerendert und nach dem Mount mit der
 * Uhrzeit des Besuchers nachgezogen, damit die Anzeige auch bei einer
 * zwischengespeicherten Seite stimmt. Die Preishoheit liegt trotzdem beim
 * Server: currentTier() rechnet gegen einen festen Zeitstempel, nicht gegen
 * die Zeitzone des Besuchers.
 */
export default function PriceCountdown({
  serverNow,
  className = "",
  variant = "sentence",
}: {
  serverNow: number;
  className?: string;
  /** "sentence" fuer Fliesstext, "badge" fuer die Preiskarte. */
  variant?: "sentence" | "badge";
}) {
  const [now, setNow] = useState(serverNow);

  useEffect(() => {
    setNow(Date.now());
    // Einmal pro Minute reicht: die Anzeige laeuft in Tagen.
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const tier = currentTier(now);
  const days = daysUntilFullPrice(now);

  if (tier === "full") {
    // Ab dem regulaeren Tarif verschwindet jeder Hinweis auf den Early Bird.
    if (variant === "badge") return null;
    return (
      <p className={className}>
        Die Nächte mit den kürzesten Wegen sind zuerst voll. Wer den Pass hat, entscheidet spontan.
      </p>
    );
  }

  const rest = days === 1 ? "noch 1 Tag" : `noch ${days} Tage`;

  if (variant === "badge") {
    return (
      <p className={className}>
        Early Bird endet {EARLY_UNTIL_SHORT}, {rest}
      </p>
    );
  }

  return (
    <p className={className}>
      Early Bird endet {EARLY_UNTIL_SHORT}, {rest} zu {TIERS.early.price} €.{" "}
      <span className="text-muted">Danach {TIERS.full.price} €.</span>
    </p>
  );
}
