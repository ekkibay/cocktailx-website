import { Suspense } from "react";
import type { Metadata } from "next";
import Configurator from "@/components/catering/Configurator";

export const metadata: Metadata = {
  title: "Event-Konfigurator: Richtpreis in 60 Sekunden | Cocktail X Eventcatering",
  description:
    "Gäste, Dauer und Bar-Konzept eingeben, Richtpreis sofort sehen. Kein Warten auf ein Angebot. Eventcatering für Firmenevents und Messen in München.",
};

export default function KonfiguratorPage() {
  return (
    <main className="min-h-screen bg-ct-cream">
      <div className="max-w-6xl mx-auto px-4 pt-32 md:pt-40 pb-24">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-body font-bold uppercase tracking-[0.25em] text-ct-red mb-4">
            Richtpreis in 60 Sekunden
          </p>
          <h1 className="font-display text-4xl md:text-6xl text-licorice mb-4 leading-[1.05]">
            Konfiguriert euer Event.
          </h1>
          <p className="font-body text-lg text-everglade/65 leading-relaxed">
            Kein Formular, das in einem Postfach verschwindet. Stellt euer Setup zusammen und
            seht sofort, was es kostet, inklusive der Bars und Barkeeper, die dafür nötig sind.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="h-96 rounded-2xl bg-white/50 border border-everglade/10 animate-pulse" />
          }
        >
          <Configurator />
        </Suspense>
      </div>
    </main>
  );
}
