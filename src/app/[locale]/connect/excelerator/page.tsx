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
          className="text-bone/60 font-body text-center mb-12 max-w-lg mx-auto"
        >
          {locale === "de"
            ? "Werde Teil des Cocktail X Netzwerks und bringe die Cocktailkultur voran."
            : "Join the Cocktail X network and push cocktail culture forward."}
        </motion.p>

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
