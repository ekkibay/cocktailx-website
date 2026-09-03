import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../globals.css";

/**
 * Interner Bereich. Kein Gastauftritt, keine Sprachfuehrung, kein Index.
 */
export const metadata: Metadata = {
  title: "Intern",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

/**
 * Der Bereich ist standardmaessig aus.
 *
 * Er zeigt Umsatz, Kanaele und Kontingente. Auf einer oeffentlich erreichbaren
 * Domain darf so etwas nicht einfach unter einer erratbaren Adresse liegen,
 * nur weil niemand sie verlinkt. In der Entwicklung ist er offen, im Betrieb
 * nur, wenn DASHBOARD_ENABLED ausdruecklich auf "true" steht.
 *
 * Das ist kein Login. Wer das Dashboard dauerhaft ins Netz stellt, braucht
 * einen davor, etwa ueber den Zugriffsschutz des Hosters.
 */
function erlaubt(): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  return process.env.DASHBOARD_ENABLED === "true";
}

export default function InternLayout({ children }: { children: React.ReactNode }) {
  if (!erlaubt()) notFound();

  return (
    <html lang="de" className="bg-licorice">
      <body className="bg-licorice text-bone antialiased">{children}</body>
    </html>
  );
}
