"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { Check, Loader2 } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/Motion";
import { CONTACT_EMAIL, EVENT } from "@/config/pricing";

/**
 * Accelerator-Bewerbung.
 *
 * Vorher: Das Formular lief gegen ein console.log, jede Bewerbung ging
 * verloren, ohne dass der Bewerber etwas gemerkt haette. Die Seite nannte das
 * Programm abwechselnd "Excelerator" und "Accelerator", enthielt ae und oe
 * statt Umlauten und hartcodierte Sommerfarben, die das ON-ICE-Klima umgingen.
 *
 * Die Route heisst weiterhin /connect/excelerator, damit bestehende Links und
 * gedruckte Verweise nicht brechen. Sichtbar heisst das Programm ueberall
 * "Accelerator".
 */

interface Content {
  h1: string;
  intro: string;
  whyLabel: string;
  benefits: { title: string; desc: string }[];
  howLabel: string;
  steps: string[];
  applyLabel: string;
  fields: Record<
    "name" | "namePh" | "email" | "emailPh" | "phone" | "phonePh" | "reach" | "reachPh" | "why" | "whyPh" | "message" | "messagePh",
    string
  >;
  submit: string;
  sending: string;
  successTitle: string;
  successText: string;
  errorText: string;
}

const COPY: Record<"de" | "en", Content> = {
  de: {
    h1: "WERDE ACCELERATOR",
    intro: `Du kennst Leute, die gern ausgehen. Empfiehl COCKTAIL X ON ICE weiter, verdiene an jedem Pass mit und bist bei allen ${EVENT.nights} Nächten selbst dabei.`,
    whyLabel: "Was du davon hast",
    benefits: [
      {
        title: "Provision auf jeden Pass",
        desc: "Jeder Pass, der über deinen persönlichen Link läuft, bringt dir eine Provision. Die Höhe klären wir im Gespräch, sie hängt davon ab, wie viel du bewegst.",
      },
      {
        title: "Dein Pass ist inklusive",
        desc: `Als Accelerator bekommst du deinen eigenen Pass für alle ${EVENT.nights} Nächte, ohne dafür zu zahlen.`,
      },
      {
        title: "Du weißt es zuerst",
        desc: "Welche Bars dabei sind und wie die Trails aussehen, erfährst du vor allen anderen. Das macht das Empfehlen leichter.",
      },
      {
        title: "Netzwerk statt Linkschleuder",
        desc: "Wir nehmen wenige Leute auf und arbeiten mit denen eng. Du hast einen festen Ansprechpartner, keine Formularschleife.",
      },
    ],
    howLabel: "So läuft es ab",
    steps: [
      "Du bewirbst dich mit dem Formular unten. Wir melden uns innerhalb von 48 Stunden, auch bei einer Absage.",
      "Im Gespräch klären wir Provision, Zeitraum und welches Material du brauchst.",
      "Du bekommst deinen persönlichen Link und dein Accelerator-Kit mit Bildern und Texten.",
      "Du teilst den Link, wo es für dich passt. Die Provision rechnen wir nach dem Festival ab.",
    ],
    applyLabel: "Jetzt bewerben",
    fields: {
      name: "Name",
      namePh: "Dein Name",
      email: "E-Mail",
      emailPh: "deine@mail.de",
      phone: "Telefon",
      phonePh: "Optional",
      reach: "Wo erreichst du Leute?",
      reachPh: "Instagram, Community, Firma, Freundeskreis",
      why: "Warum willst du Accelerator werden?",
      whyPh: "Zwei, drei Sätze reichen.",
      message: "Noch etwas?",
      messagePh: "Optional",
    },
    submit: "BEWERBUNG ABSENDEN",
    sending: "WIRD GESENDET",
    successTitle: "Bewerbung ist da.",
    successText: `Wir melden uns innerhalb von 48 Stunden. Wenn es schneller gehen soll, schreib direkt an ${CONTACT_EMAIL}.`,
    errorText: `Senden hat nicht geklappt. Versuch es nochmal oder schreib uns an ${CONTACT_EMAIL}.`,
  },
  en: {
    h1: "BECOME AN ACCELERATOR",
    intro: `You know people who like going out. Recommend COCKTAIL X ON ICE, earn on every pass, and join all ${EVENT.nights} nights yourself.`,
    whyLabel: "What you get",
    benefits: [
      {
        title: "Commission on every pass",
        desc: "Every pass sold through your personal link earns you a commission. We agree the rate in a call, based on the reach you bring.",
      },
      {
        title: "Your pass is included",
        desc: `As an Accelerator you get your own pass for all ${EVENT.nights} nights, free of charge.`,
      },
      {
        title: "You know first",
        desc: "Which bars take part and how the trails look, you learn before anyone else. That makes recommending easier.",
      },
      {
        title: "A network, not a link farm",
        desc: "We take on few people and work closely with them. You get one named contact, not a ticket queue.",
      },
    ],
    howLabel: "How it works",
    steps: [
      "Apply with the form below. We reply within 48 hours, also if the answer is no.",
      "In a call we agree commission, timeframe and the material you need.",
      "You receive your personal link and your Accelerator kit with images and copy.",
      "You share the link wherever it fits. Commission is settled after the festival.",
    ],
    applyLabel: "Apply now",
    fields: {
      name: "Name",
      namePh: "Your name",
      email: "Email",
      emailPh: "you@mail.com",
      phone: "Phone",
      phonePh: "Optional",
      reach: "Where do you reach people?",
      reachPh: "Instagram, community, company, friends",
      why: "Why do you want to be an Accelerator?",
      whyPh: "Two or three sentences are enough.",
      message: "Anything else?",
      messagePh: "Optional",
    },
    submit: "SUBMIT APPLICATION",
    sending: "SENDING",
    successTitle: "Application received.",
    successText: `We reply within 48 hours. If it needs to be faster, write to ${CONTACT_EMAIL}.`,
    errorText: `Sending failed. Please try again or write to ${CONTACT_EMAIL}.`,
  },
};

export default function AcceleratorPage() {
  const locale = (useLocale() === "en" ? "en" : "de") as "de" | "en";
  const c = COPY[locale];

  const [form, setForm] = useState({ name: "", email: "", phone: "", reach: "", why: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/accelerator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  const input =
    "w-full bg-surface border border-hairline rounded-xl px-4 py-3.5 text-bone font-body placeholder:text-muted/45 focus:border-tangerine focus:outline-none transition-colors";
  const label = "block text-muted font-body text-sm mb-2";

  if (status === "done") {
    return (
      <main className="min-h-screen flex items-center justify-center px-5 py-32">
        <Reveal className="max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-tangerine/10 border border-tangerine/30 flex items-center justify-center mx-auto mb-7">
            <Check className="w-7 h-7 text-tangerine" strokeWidth={2} />
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-bone mb-4">{c.successTitle}</h1>
          <p className="font-body text-base text-muted leading-relaxed">{c.successText}</p>
        </Reveal>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-5 pt-32 pb-24">
      <div className="max-w-2xl mx-auto">
        <Reveal>
          <p className="font-body text-[11px] font-bold uppercase tracking-[0.3em] text-tangerine mb-5 text-center">
            Accelerator
          </p>
          <h1 className="font-display text-4xl md:text-6xl text-bone text-center mb-5 leading-[0.95]">{c.h1}</h1>
          <p className="font-body text-base text-muted text-center mb-16 max-w-lg mx-auto leading-relaxed">
            {c.intro}
          </p>
        </Reveal>

        <Reveal>
          <p className="font-body text-[11px] font-bold uppercase tracking-[0.3em] text-tangerine mb-6">
            {c.whyLabel}
          </p>
        </Reveal>
        <StaggerGroup className="grid sm:grid-cols-2 gap-4 mb-14">
          {c.benefits.map((b) => (
            <StaggerItem
              key={b.title}
              className="bg-surface border border-hairline rounded-xl p-5 hover:border-tangerine/40 transition-colors duration-300"
            >
              <h2 className="font-display text-bone text-lg mb-2">{b.title}</h2>
              <p className="font-body text-muted text-sm leading-relaxed">{b.desc}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <Reveal className="border border-hairline rounded-xl p-6 bg-surface/50 mb-16">
          <p className="font-body text-[11px] font-bold uppercase tracking-[0.3em] text-tangerine mb-6">
            {c.howLabel}
          </p>
          <ol className="space-y-5">
            {c.steps.map((step, i) => (
              <li key={i} className="flex gap-4 items-start">
                <span className="font-display text-tangerine/45 text-sm flex-shrink-0 w-8 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="font-body text-muted text-sm leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </Reveal>

        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-hairline" />
          <span className="text-muted font-body text-xs uppercase tracking-widest">{c.applyLabel}</span>
          <div className="flex-1 h-px bg-hairline" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="acc-name" className={label}>
                {c.fields.name} <span className="text-tangerine">*</span>
              </label>
              <input
                id="acc-name"
                type="text"
                name="name"
                required
                value={form.name}
                onChange={change}
                placeholder={c.fields.namePh}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="acc-email" className={label}>
                {c.fields.email} <span className="text-tangerine">*</span>
              </label>
              <input
                id="acc-email"
                type="email"
                name="email"
                required
                value={form.email}
                onChange={change}
                placeholder={c.fields.emailPh}
                className={input}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="acc-phone" className={label}>
                {c.fields.phone}
              </label>
              <input
                id="acc-phone"
                type="tel"
                name="phone"
                value={form.phone}
                onChange={change}
                placeholder={c.fields.phonePh}
                className={input}
              />
            </div>
            <div>
              <label htmlFor="acc-reach" className={label}>
                {c.fields.reach}
              </label>
              <input
                id="acc-reach"
                type="text"
                name="reach"
                value={form.reach}
                onChange={change}
                placeholder={c.fields.reachPh}
                className={input}
              />
            </div>
          </div>

          <div>
            <label htmlFor="acc-why" className={label}>
              {c.fields.why} <span className="text-tangerine">*</span>
            </label>
            <textarea
              id="acc-why"
              name="why"
              rows={4}
              required
              value={form.why}
              onChange={change}
              placeholder={c.fields.whyPh}
              className={`${input} resize-none`}
            />
          </div>

          <div>
            <label htmlFor="acc-message" className={label}>
              {c.fields.message}
            </label>
            <textarea
              id="acc-message"
              name="message"
              rows={3}
              value={form.message}
              onChange={change}
              placeholder={c.fields.messagePh}
              className={`${input} resize-none`}
            />
          </div>

          {status === "error" && (
            <p className="font-body text-sm text-tangerine" role="alert">
              {c.errorText}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="btn-primary w-full text-base disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
          >
            {status === "sending" && <Loader2 className="w-4 h-4 animate-spin" />}
            {status === "sending" ? c.sending : c.submit}
          </button>
        </form>
      </div>
    </main>
  );
}
