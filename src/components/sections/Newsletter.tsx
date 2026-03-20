"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function Newsletter() {
  const t = useTranslations("newsletter");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 opacity-20 bg-[url('/images/placeholder/newsletter-bg.svg')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-gradient-to-b from-licorice via-licorice/80 to-licorice" />

      <div className="relative z-10 max-w-xl mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-display text-bone mb-8"
        >
          {t("headline")}
        </motion.h2>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("placeholder")}
            className="flex-1 bg-transparent border border-bone/20 rounded-lg px-4 py-3 text-bone font-body placeholder:text-bone/30 focus:border-tangerine focus:outline-none transition-colors"
          />
          <button type="submit" className="btn-primary whitespace-nowrap">
            {t("submit")}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
