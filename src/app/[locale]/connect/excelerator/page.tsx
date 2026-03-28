"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";

export default function ExceleratorPage() {
  const locale = useLocale() as "de" | "en";
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    why: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Excelerator form submitted:", form);
  };

  const inputClasses =
    "w-full bg-transparent border border-bone/20 rounded-lg px-4 py-3 text-bone font-body placeholder:text-bone/30 focus:border-tangerine focus:outline-none transition-colors";

  return (
    <main className="section-padding min-h-screen relative">
      {/* CI background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        <div style={{ position:"absolute", inset:0, backgroundImage:"url(/images/pattern-bg.svg)", backgroundSize:"200px 200px", backgroundRepeat:"repeat", opacity:0.18 }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(25,21,19,0.55) 0%, rgba(25,21,19,0.2) 25%, rgba(25,21,19,0.2) 75%, rgba(25,21,19,0.7) 100%)" }} />
        <div style={{ position:"absolute", top:"-200px", right:"-200px", width:"600px", height:"600px", borderRadius:"50%", background:"rgba(243,146,0,0.12)", filter:"blur(120px)" }} />
        <div style={{ position:"absolute", top:"30%", left:"-200px", width:"500px", height:"500px", borderRadius:"50%", background:"rgba(189,37,110,0.10)", filter:"blur(110px)" }} />
      </div>
      <div className="max-w-2xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-6xl font-display text-bone text-center mb-4"
        >
          {locale === "de" ? "WERDE EXCELERATOR" : "BECOME AN EXCELERATOR"}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-bone/60 font-body text-center mb-16 max-w-lg mx-auto"
        >
          {locale === "de"
            ? "Werde Teil des Cocktail X Netzwerks. Empfehle Tickets, verdiene Provision und erlebe das Festival hautnah."
            : "Join the Cocktail X network. Recommend tickets, earn commission, and experience the festival up close."}
        </motion.p>

        {/* Why Excelerator */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <p className="text-[11px] font-body font-bold uppercase tracking-[0.2em] text-tangerine text-center mb-8">
            {locale === "de" ? "Warum Excelerator werden?" : "Why become an Excelerator?"}
          </p>

          {/* Benefits grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {(locale === "de" ? [
              { icon: "✦", title: "Provision auf jedes Ticket", desc: "Für jedes Ticket, das über deinen persönlichen Link verkauft wird, erhältst du eine Provision. Je mehr du empfiehlst, desto mehr verdienst du." },
              { icon: "✦", title: "Exklusiver Festivaleintritt", desc: "Als Excelerator erhältst du ein kostenloses Ticket zum Cocktail X Festival und erlebst die Eventkultur Münchens hautnah." },
              { icon: "✦", title: "Netzwerk & Community", desc: "Du wirst Teil eines wachsenden Netzwerks aus Cocktail-Enthusiasten, Bartender-Profis und Event-Insidern." },
              { icon: "✦", title: "Exklusive Previews", desc: "Erfahre als Erster, welche Bars und Cocktails beim Festival dabei sind — noch bevor es öffentlich bekannt gegeben wird." },
            ] : [
              { icon: "✦", title: "Commission on every ticket", desc: "For every ticket sold through your personal link, you earn a commission. The more you recommend, the more you earn." },
              { icon: "✦", title: "Exclusive festival access", desc: "As an Excelerator you receive a free ticket to the Cocktail X Festival and experience München's cocktail culture first-hand." },
              { icon: "✦", title: "Network & community", desc: "You become part of a growing network of cocktail enthusiasts, bartender professionals, and event insiders." },
              { icon: "✦", title: "Exclusive previews", desc: "Be the first to know which bars and cocktails will be part of the festival — before it's announced publicly." },
            ]).map((benefit) => (
              <div key={benefit.title} className="bg-bone/[0.04] border border-bone/10 rounded-xl p-5 hover:border-tangerine/30 transition-colors duration-300">
                <span className="text-tangerine text-xs block mb-3">{benefit.icon}</span>
                <h3 className="font-display text-bone text-base mb-2">{benefit.title}</h3>
                <p className="font-body text-bone/75 text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div className="border border-bone/10 rounded-xl p-6 bg-bone/[0.02]">
            <p className="text-[11px] font-body font-bold uppercase tracking-[0.2em] text-tangerine mb-6">
              {locale === "de" ? "So funktioniert's" : "How it works"}
            </p>
            <div className="space-y-5">
              {(locale === "de" ? [
                { step: "01", text: "Bewirb dich mit dem Formular unten — wir melden uns innerhalb von 48 Stunden." },
                { step: "02", text: "Du erhältst deinen persönlichen Empfehlungslink und dein Excelerator-Kit." },
                { step: "03", text: "Teile den Link in deinem Netzwerk — auf Instagram, im Freundeskreis, wo immer du willst." },
                { step: "04", text: "Für jedes verkaufte Ticket über deinen Link erhältst du deine Provision automatisch ausgezahlt." },
              ] : [
                { step: "01", text: "Apply using the form below — we'll get back to you within 48 hours." },
                { step: "02", text: "You receive your personal referral link and your Excelerator kit." },
                { step: "03", text: "Share the link in your network — on Instagram, with friends, wherever you like." },
                { step: "04", text: "For every ticket sold via your link, your commission is automatically paid out." },
              ]).map((item) => (
                <div key={item.step} className="flex gap-4 items-start">
                  <span className="font-display text-tangerine/40 text-sm flex-shrink-0 w-8">{item.step}</span>
                  <p className="font-body text-bone/80 text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 h-px bg-bone/10" />
          <span className="text-bone/30 font-body text-xs uppercase tracking-widest">
            {locale === "de" ? "Jetzt bewerben" : "Apply now"}
          </span>
          <div className="flex-1 h-px bg-bone/10" />
        </div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-6"
        >
          <div>
            <label className="block text-bone/60 font-body text-sm mb-2">
              {locale === "de" ? "Name" : "Name"}
            </label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder={locale === "de" ? "Dein Name" : "Your name"}
              className={inputClasses}
            />
          </div>

          <div>
            <label className="block text-bone/60 font-body text-sm mb-2">
              E-Mail
            </label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder={locale === "de" ? "Deine E-Mail" : "Your email"}
              className={inputClasses}
            />
          </div>

          <div>
            <label className="block text-bone/60 font-body text-sm mb-2">
              {locale === "de" ? "Telefon" : "Phone"}
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder={locale === "de" ? "Deine Telefonnummer" : "Your phone number"}
              className={inputClasses}
            />
          </div>

          <div>
            <label className="block text-bone/60 font-body text-sm mb-2">
              {locale === "de" ? "Nachricht" : "Message"}
            </label>
            <textarea
              name="message"
              rows={3}
              value={form.message}
              onChange={handleChange}
              placeholder={locale === "de" ? "Deine Nachricht" : "Your message"}
              className={inputClasses}
            />
          </div>

          <div>
            <label className="block text-bone/60 font-body text-sm mb-2">
              {locale === "de"
                ? "Warum moechtest du Excelerator werden?"
                : "Why do you want to be an Excelerator?"}
            </label>
            <textarea
              name="why"
              rows={4}
              required
              value={form.why}
              onChange={handleChange}
              placeholder={
                locale === "de"
                  ? "Erzaehl uns von deiner Motivation..."
                  : "Tell us about your motivation..."
              }
              className={inputClasses}
            />
          </div>

          <button type="submit" className="btn-primary w-full text-lg">
            {locale === "de" ? "BEWERBUNG ABSENDEN" : "SUBMIT APPLICATION"}
          </button>
        </motion.form>
      </div>
    </main>
  );
}
