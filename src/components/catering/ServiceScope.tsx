"use client";

import { Building2, ClipboardList, MapPin, Martini, UtensilsCrossed, Users } from "lucide-react";
import { DrawLine, Reveal, StaggerGroup, StaggerItem } from "./Motion";

/**
 * Der tatsaechliche Leistungsumfang. Full-Service ist die Klammer darueber,
 * die sechs Bausteine sind das, was einzeln oder gemeinsam buchbar ist.
 */
const services = [
  {
    icon: Martini,
    title: "Bar & Getränke",
    text: "Mobile Bars von der Einzelstation bis zum Multi-Bar-Setup. Cocktails, Signature Drinks, Nitro-Ausgabe für hohen Durchsatz, Wein, Bier und alkoholfreie Karte.",
    points: ["Bis 3.000 Gäste", "Bis 180 Drinks pro Stunde und Barkeeper", "Komplettes Glaswerk und Equipment"],
  },
  {
    icon: UtensilsCrossed,
    title: "Food",
    text: "Mundgerechtes Fingerfood bis zum Flying Buffet. Gebaut für Formate, bei denen die Gäste stehen und ein Glas in der Hand halten.",
    points: ["One Bites, einhändig", "Flying Buffet als Mahlzeitersatz", "Vegetarisch und vegan immer dabei"],
  },
  {
    icon: Users,
    title: "Hospitality Personal",
    text: "Barkeeper, Barschankkräfte, Servicekräfte und Hostessen aus dem eigenen Münchner Pool. Mehrsprachig und mit Messeroutine.",
    points: ["Eigener Pool, keine Zeitarbeit", "Express-Staffing oft unter 24 Stunden", "Einsatz auch white-label in eurer CI"],
  },
  {
    icon: ClipboardList,
    title: "Eventmanagement",
    text: "Konzept, Kalkulation, Logistik, Genehmigungen und die Projektleitung, die am Eventtag vor Ort ist. Ein Ansprechpartner von der Anfrage bis zum Abbau.",
    points: ["Konzeption und Ablaufplanung", "Technischer Rider und Standlogistik", "Projektleitung vor Ort"],
  },
  {
    icon: Building2,
    title: "Messe & Großevents",
    text: "Standpartys, Hallenauftritte und Abendveranstaltungen im Messeumfeld. Wir kennen die Abläufe auf dem Münchner Messegelände.",
    points: ["INHORGENTA, ISPO, IAA Mobility", "Ausweise, Anlieferung, Zeitfenster", "Aufbau innerhalb der Standzeiten"],
  },
  {
    icon: MapPin,
    title: "Partner-Locations",
    text: "Wenn die Location noch fehlt, vermitteln wir aus einem kuratierten Netzwerk in und um München. Vom Rooftop bis zur Industriehalle.",
    points: ["Kuratiertes Netzwerk München", "Passend zu Gästezahl und Anlass", "Abstimmung übernehmen wir"],
  },
];

export function ServiceScope() {
  return (
    <section className="relative py-20 md:py-28 px-4 bg-licorice text-ct-cream overflow-hidden">
      <div className="max-w-6xl mx-auto relative">
        <Reveal className="max-w-2xl mb-14">
          <p className="text-xs font-body font-bold uppercase tracking-[0.25em] text-ct-red mb-4">
            Leistungsumfang
          </p>
          <h2 className="font-display text-3xl md:text-5xl mb-5 leading-[1.05]">
            Alles aus einer Hand. Oder genau der Teil, den ihr braucht.
          </h2>
          <p className="font-body text-base md:text-lg text-ct-cream/65 leading-relaxed">
            Die meisten buchen uns für die Bar und merken im Gespräch, dass wir das ganze Event
            tragen können. Beides geht: einzelne Bausteine oder die vollständige Umsetzung.
          </p>
        </Reveal>

        <DrawLine className="mb-14 bg-ct-cream/15" />

        <StaggerGroup className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
          {services.map(({ icon: Icon, title, text, points }) => (
            <StaggerItem key={title}>
              <Icon className="w-6 h-6 text-ct-red mb-4" strokeWidth={1.5} aria-hidden />
              <h3 className="font-display text-xl mb-3">{title}</h3>
              <p className="font-body text-sm text-ct-cream/60 leading-relaxed mb-4">{text}</p>
              <ul className="space-y-1.5">
                {points.map((p) => (
                  <li key={p} className="font-body text-xs text-ct-cream/45 flex gap-2">
                    <span className="text-ct-red/70" aria-hidden>
                      /
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
