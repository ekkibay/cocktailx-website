"use client";

import { useEffect, useState } from "react";
import {
  EARLY_UNTIL_SHORT,
  EVENT,
  TIERS,
  currentTier,
  daysUntilFullPrice,
} from "@/config/pricing";
import { pick, type Locale } from "@/i18n/bilingual";

/**
 * Zeigt bis zum 15.10. den Rabattdruck, danach einen ruhigen Hinweis.
 *
 * Der Serverwert wird als Startwert gerendert und nach dem Mount mit der
 * Uhrzeit des Besuchers nachgezogen, damit die Anzeige auch bei einer
 * zwischengespeicherten Seite stimmt. Die Preishoheit liegt trotzdem beim
 * Server: currentTier() rechnet gegen einen festen Zeitstempel, nicht gegen
 * die Zeitzone des Besuchers.
 *
 * Hier stand nach dem Stichtag: "Die Nächte mit den kürzesten Wegen sind
 * zuerst voll." Das ist eine Aussage ueber Auslastung, und es gibt nichts,
 * was sie belegt: keine Reservierung, keine Kontingente je Nacht, keine
 * Zaehlung. Sie ist ersatzlos raus.
 */
const COPY = {
  afterDeadline: {
    de: "Der Pass gilt für alle Nächte. Wann du losziehst, entscheidest du spontan.",
    en: "The pass covers every night. When you head out is up to you.",
  },
  endsToday: {
    de: `Early Bird endet heute, ${EARLY_UNTIL_SHORT}`,
    en: `Early Bird ends today, ${EVENT.earlyUntilShortEn}`,
  },
} as const;

export default function PriceCountdown({
  serverNow,
  locale,
  className = "",
  variant = "sentence",
}: {
  serverNow: number;
  locale: Locale;
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
    return <p className={className}>{pick(COPY.afterDeadline, locale)}</p>;
  }

  /* daysUntilFullPrice faellt am Stichtag selbst auf null, solange der
     Einstiegspreis noch gilt. "noch 0 Tage" liest sich wie ein Fehler,
     deshalb an diesem einen Tag eine eigene Formulierung. */
  if (days === 0) {
    return <p className={className}>{pick(COPY.endsToday, locale)}</p>;
  }

  const rest =
    locale === "en"
      ? days === 1
        ? "1 day left"
        : `${days} days left`
      : days === 1
        ? "noch 1 Tag"
        : `noch ${days} Tage`;

  const until = locale === "en" ? EVENT.earlyUntilShortEn : EARLY_UNTIL_SHORT;

  if (variant === "badge") {
    return (
      <p className={className}>
        {locale === "en"
          ? `Early Bird ends ${until}, ${rest}`
          : `Early Bird endet ${until}, ${rest}`}
      </p>
    );
  }

  return (
    <p className={className}>
      {locale === "en" ? (
        <>
          Early Bird ends {until}, {rest} at {TIERS.early.price} €.{" "}
          <span className="text-muted">After that {TIERS.full.price} €.</span>
        </>
      ) : (
        <>
          Early Bird endet {until}, {rest} zu {TIERS.early.price} €.{" "}
          <span className="text-muted">Danach {TIERS.full.price} €.</span>
        </>
      )}
    </p>
  );
}
