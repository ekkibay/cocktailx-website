import type { Metadata } from "next";

/**
 * Die Bestaetigungsseite gehoert nicht in den Index.
 *
 * Sie ist nur nach einem Kauf sinnvoll, und ohne diese Angabe landet sie mit
 * einer Ueberschrift wie "Danke" in den Suchergebnissen, wo sie Leute
 * abfaengt, die eigentlich kaufen wollen. Vorher gab es hier gar kein
 * Layout, also auch keinen eigenen Titel und keine Anweisung an Suchmaschinen.
 */
export const metadata: Metadata = {
  title: "Danke",
  robots: { index: false, follow: false },
};

/**
 * Die Seite zeigt den jeweils gueltigen Passpreis, unter anderem im
 * Teilen-Text. Ohne diese Zeile friert er beim Bauen ein. Route Segment
 * Config muss aus einer Serverkomponente kommen, die Seite selbst ist
 * "use client".
 */
export const dynamic = "force-dynamic";

export default function DankeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
