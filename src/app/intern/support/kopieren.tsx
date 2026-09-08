"use client";

import { useState } from "react";

/**
 * Kopiert den Antwortentwurf in die Zwischenablage.
 *
 * Die einzige Client-Komponente der Supportseite, und zwar nur, weil die
 * Zwischenablage im Browser lebt. Der mailto-Link daneben oeffnet das
 * Standardprogramm, das ist nicht immer das Outlook des Postfachs. Wer im
 * Outlook-Tab antwortet, will den Text einfach einfuegen.
 */
export function Kopieren({ text }: { text: string }) {
  const [zustand, setZustand] = useState<"bereit" | "kopiert" | "fehler">("bereit");

  async function kopieren() {
    try {
      await navigator.clipboard.writeText(text);
      setZustand("kopiert");
      setTimeout(() => setZustand("bereit"), 2000);
    } catch {
      // Ohne HTTPS oder ohne Erlaubnis verweigert der Browser. Dann bleibt
      // Markieren und Kopieren, und das sagen wir statt stumm zu scheitern.
      setZustand("fehler");
    }
  }

  return (
    <button
      type="button"
      onClick={kopieren}
      className="font-body text-xs text-tangerine hover:underline underline-offset-4"
    >
      {zustand === "kopiert"
        ? "Kopiert"
        : zustand === "fehler"
          ? "Kopieren geht hier nicht, bitte Text markieren"
          : "Text kopieren"}
    </button>
  );
}
