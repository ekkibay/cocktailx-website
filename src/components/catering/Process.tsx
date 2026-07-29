"use client";

import { MaskReveal, Reveal, StaggerGroup, StaggerItem } from "./Motion";

const steps = [
  {
    num: "01",
    title: "Anfrage",
    text: "Konfigurator oder Anruf. Wir brauchen Anlass, Datum, Gästezahl und Location. Mehr nicht.",
    time: "5 Minuten",
  },
  {
    num: "02",
    title: "Konzept & Angebot",
    text: "Ihr bekommt ein Angebot mit jeder Position im Klartext. Kein Sammelposten, keine Sternchen.",
    time: "innerhalb 24 Stunden",
  },
  {
    num: "03",
    title: "Feinplanung",
    text: "Tasting auf Wunsch, Logistik, Zeitfenster, technischer Rider. Eine Projektleitung, ein Ansprechpartner.",
    time: "bis 2 Wochen vorher",
  },
  {
    num: "04",
    title: "Eventtag",
    text: "Aufbau zwei bis vier Stunden vorher, Projektleitung durchgehend vor Ort, Abbau noch am selben Abend.",
    time: "wir sind vor euch da",
  },
];

export function Process() {
  return (
    <section className="py-20 md:py-28 px-4 bg-bone/50">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-y-8 gap-x-10 mb-14">
          <div className="lg:col-span-7">
            <p className="text-xs font-body font-bold uppercase tracking-[0.3em] text-ct-red mb-5">
              Ablauf
            </p>
            <h2 className="font-display text-4xl md:text-6xl text-licorice leading-[0.98]">
              <MaskReveal>Vier Schritte.</MaskReveal>
              <br />
              <MaskReveal delay={0.1} className="text-everglade/40">
                Kein Papierkrieg.
              </MaskReveal>
            </h2>
          </div>
          <Reveal className="lg:col-span-5 lg:pt-4" delay={0.2}>
            <p className="font-body text-sm text-everglade/65 leading-relaxed">
              Die meiste Zeit verlieren Events zwischen Anfrage und Angebot. Genau da setzen wir an:
              Wer den Konfigurator nutzt, hat den Richtpreis vor dem ersten Telefonat.
            </p>
          </Reveal>
        </div>

        <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-everglade/12 rounded-2xl overflow-hidden">
          {steps.map((s) => (
            <StaggerItem key={s.num} className="bg-ct-cream">
              <div className="h-full p-7 md:p-8 flex flex-col">
                <span className="font-display text-5xl text-ct-red/20 leading-none mb-6">{s.num}</span>
                <h3 className="font-display text-xl text-licorice mb-3">{s.title}</h3>
                <p className="font-body text-sm text-everglade/65 leading-relaxed mb-6">{s.text}</p>
                <span className="mt-auto font-body text-[11px] uppercase tracking-wider text-ct-red">
                  {s.time}
                </span>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
