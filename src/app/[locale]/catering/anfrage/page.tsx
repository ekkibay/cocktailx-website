import type { Metadata } from "next";
import { AnfrageWizard } from "@/components/catering/AnfrageWizard";
import { ScrollProgress } from "@/components/catering/Motion";
import { publicPackages } from "@/lib/pricing/packages";

export const metadata: Metadata = {
  title: "Anfrage & Richtpreis in 60 Sekunden",
  description:
    "Anlass, Datum und Gästezahl eingeben, Pakete wählen, Richtpreis sofort sehen. Eventcatering für Firmenfeiern, Sommerfeste und Messen in München.",
};

export default function AnfragePage() {
  // Pakete serverseitig laden: der _internal-Block mit den Einkaufspreisen
  // wird in publicPackages() abgestreift und erreicht den Browser nie.
  const packages = publicPackages();

  // Datum serverseitig setzen, damit das min-Attribut nicht bei der Hydration abweicht.
  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="min-h-screen bg-ct-cream">
      <ScrollProgress />
      <div className="max-w-6xl mx-auto px-4 pt-32 md:pt-40 pb-24">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-body font-bold uppercase tracking-[0.3em] text-ct-red mb-5">
            Anfrage
          </p>
          <h1 className="font-display text-4xl md:text-6xl text-licorice mb-5 leading-[0.98]">
            Fünf Schritte bis zum Preis.
          </h1>
          <p className="font-body text-base md:text-lg text-everglade/65 leading-relaxed">
            Kein Formular, das in einem Postfach verschwindet. Ihr sieht den Richtpreis, während ihr
            konfiguriert, und könnt die Zusammenstellung intern weiterleiten, bevor jemand mit uns
            gesprochen hat.
          </p>
        </div>

        <AnfrageWizard packages={packages} today={today} />
      </div>
    </main>
  );
}
