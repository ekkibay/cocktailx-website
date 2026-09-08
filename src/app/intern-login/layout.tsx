import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { internErlaubt } from "../intern/gate";
import "../globals.css";

/**
 * Eigene Wurzel fuer die Anmeldung, neben /intern statt darin.
 *
 * Das Layout von /intern schickt jeden ohne Sitzung zur Anmeldung. Laege
 * sie darin, wuerde sie sich selbst wegleiten. Ein Layout kennt in Next 14
 * den aufgerufenen Pfad nicht, also gibt es keine saubere Ausnahme fuer
 * eine einzelne Seite. Deshalb ein Segment daneben, gleiches Klima,
 * gleiche Sperre fuer die Frage, ob es den Bereich ueberhaupt gibt.
 *
 * Die Middleware laesst /intern-login wie /intern ohne Sprachpraefix durch,
 * weil ihr Muster alles ausnimmt, was mit "intern" beginnt.
 */
export const metadata: Metadata = {
  title: "Intern",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  // Ist der Bereich aus, gibt es auch keine Anmeldeseite dafuer. Sonst
  // verraet sie, dass hinter der Tuer etwas liegt.
  if (!internErlaubt()) notFound();

  return (
    <html lang="de" className="bg-licorice">
      <body className="bg-licorice text-bone antialiased">{children}</body>
    </html>
  );
}
