"use client";

import { useEffect, useState } from "react";
import { TIERS, currentTier, daysUntilFullPrice } from "@/config/pricing";

/**
 * Zeigt bis zum 31.10. den Rabattdruck ("Noch X Tage zu 29 €"), danach ein
 * Kapazitaets-Framing. Der Serverwert wird als Startwert gerendert und nach
 * dem Mount mit der Uhrzeit des Besuchers nachgezogen, damit die Anzeige auch
 * bei einer zwischengespeicherten Seite stimmt.
 */
export default function PriceCountdown({
  serverNow,
  className = "",
}: {
  serverNow: number;
  className?: string;
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
    return (
      <p className={className}>
        Die Nächte mit den kürzesten Wegen sind zuerst voll. Wer den Pass hat, entscheidet spontan.
      </p>
    );
  }

  return (
    <p className={className}>
      {days === 1 ? "Noch 1 Tag" : `Noch ${days} Tage`} zu {TIERS.early.price} €.{" "}
      <span className="text-muted">Danach {TIERS.full.price} €.</span>
    </p>
  );
}
