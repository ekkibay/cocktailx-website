"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";

const socialLinks = [
  { name: "Instagram", url: "https://www.instagram.com/cocktailx_festival/" },
  { name: "TikTok", url: "https://www.tiktok.com/@cocktailxfestival" },
  { name: "Facebook", url: "https://www.facebook.com/cocktailxfestival" },
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
    console.log("Contact form submitted:", form);
  };

  const inputClasses =
    "w-full bg-transparent border border-bone/20 rounded-lg px-4 py-3 text-bone font-body placeholder:text-bone/30 focus:border-tangerine focus:outline-none transition-colors";

  return (
    <main className="section-padding min-h-screen">
      <div className="max-w-5xl mx-auto">
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
              <label className="block text-bone/60 font-body text-sm mb-2">
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
              <p className="text-bone/60 font-body leading-relaxed">
                Cocktail X GmbH
                <br />
                Musterstrasse 1
                <br />
                80331 Muenchen
                <br />
                {locale === "de" ? "Deutschland" : "Germany"}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-display text-bone mb-3">E-MAIL</h3>
              <a
                href="mailto:hello@cocktailx.de"
                className="text-tangerine font-body hover:underline"
              >
                hello@cocktailx.de
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
                    className="text-bone/60 font-body hover:text-tangerine transition-colors"
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
