"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";

const socialLinks = [
  { name: "Instagram", url: "https://www.instagram.com/cocktailxfestival/" },
  { name: "TikTok", url: "https://www.tiktok.com/@cocktailxfestival" },
  { name: "Facebook", url: "https://www.facebook.com/profile.php?id=100090270165472" },
  { name: "LinkedIn", url: "https://www.linkedin.com/company/cocktailx" },
];

export default function ContactPage() {
  const locale = useLocale() as "de" | "en";
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = encodeURIComponent(
      form.subject || (locale === "de" ? "Kontaktanfrage – Cocktail X Festival" : "Contact – Cocktail X Festival")
    );

    const lines = [
      locale === "de" ? "KONTAKTANFRAGE – COCKTAIL X FESTIVAL" : "CONTACT – COCKTAIL X FESTIVAL",
      "═".repeat(40),
      "",
      `${locale === "de" ? "Name" : "Name"}: ${form.name}`,
      `E-Mail: ${form.email}`,
      form.subject ? `${locale === "de" ? "Betreff" : "Subject"}: ${form.subject}` : "",
      "",
      "─".repeat(40),
      "",
      `${locale === "de" ? "Nachricht" : "Message"}:\n${form.message}`,
      "",
      "─".repeat(40),
      locale === "de" ? "Gesendet über cocktail-x.com/contact" : "Sent via cocktail-x.com/contact",
    ]
      .filter(Boolean)
      .join("\n");

    const body = encodeURIComponent(lines);
    window.location.href = `mailto:info@cocktail-x.com?subject=${subject}&body=${body}`;
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
      <div className="max-w-5xl mx-auto relative">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-7xl font-display text-bone text-center mb-16"
        >
          CONTACT
        </motion.h1>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-bone/80 font-body text-sm mb-2">
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
              <label className="block text-bone/80 font-body text-sm mb-2">
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
              <label className="block text-bone/80 font-body text-sm mb-2">
                {locale === "de" ? "Betreff" : "Subject"}
              </label>
              <input
                type="text"
                name="subject"
                required
                value={form.subject}
                onChange={handleChange}
                placeholder={locale === "de" ? "Betreff" : "Subject"}
                className={inputClasses}
              />
            </div>

            <div>
              <label className="block text-bone/80 font-body text-sm mb-2">
                {locale === "de" ? "Nachricht" : "Message"}
              </label>
              <textarea
                name="message"
                rows={5}
                required
                value={form.message}
                onChange={handleChange}
                placeholder={locale === "de" ? "Deine Nachricht" : "Your message"}
                className={inputClasses}
              />
            </div>

            <button type="submit" className="btn-primary w-full text-lg">
              {locale === "de" ? "NACHRICHT SENDEN" : "SEND MESSAGE"}
            </button>
            <p className="text-xs font-body text-bone/35 text-center">
              {locale === "de"
                ? "Euer E-Mail-Programm öffnet sich mit den vorausgefüllten Daten."
                : "Your email client will open with pre-filled details."}
            </p>
          </motion.form>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-xl font-display text-bone mb-3">
                {locale === "de" ? "ADRESSE" : "ADDRESS"}
              </h3>
              <p className="text-bone/80 font-body leading-relaxed">
                bayundco GmbH
                <br />
                Türkenstr. 61 RGB
                <br />
                80799 München
                <br />
                {locale === "de" ? "Deutschland" : "Germany"}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-display text-bone mb-3">E-MAIL</h3>
              <a
                href="mailto:info@cocktail-x.com"
                className="text-tangerine font-body hover:underline"
              >
                info@cocktail-x.com
              </a>
            </div>

            <div>
              <h3 className="text-xl font-display text-bone mb-3">SOCIAL</h3>
              <div className="flex flex-col gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-bone/80 font-body hover:text-tangerine transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
