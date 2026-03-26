"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import BlurText from "@/components/ui/BlurText";
import { useReveal } from "@/hooks/useReveal";

export default function Newsletter() {
  const t = useTranslations("newsletter");
  const [email, setEmail] = useState("");

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const incentive = useReveal<HTMLParagraphElement>({ delay: 150 });
  const formReveal = useReveal<HTMLFormElement>({ delay: 250 });
  const trust = useReveal<HTMLParagraphElement>({ delay: 350 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to newsletter provider (e.g. Mailchimp, ConvertKit)
    setStatus("success");
    setEmail("");
  };

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 opacity-20 bg-[url('/images/placeholder/newsletter-bg.svg')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-gradient-to-b from-licorice via-licorice/80 to-licorice" />

      <div className="relative z-10 max-w-xl mx-auto px-4 text-center">
        <BlurText
          text={t("headline")}
          tag="h2"
          className="text-3xl md:text-4xl font-display text-bone mb-4"
          delay={70}
          duration={0.7}
        />

        <p
          ref={incentive.ref}
          style={incentive.style}
          className="text-sm font-body text-tangerine font-bold mb-8"
        >
          {t("incentive")}
        </p>

        {status === "success" ? (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-tangerine font-body font-bold text-lg py-4"
          >
            ✓ Du bist dabei! Wir melden uns bald.
          </motion.p>
        ) : (
          <form
            ref={formReveal.ref}
            style={formReveal.style}
            onSubmit={handleSubmit}
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
          </form>
        )}

        <p
          ref={trust.ref}
          style={trust.style}
          className="text-xs font-body text-bone/40 mt-4"
        >
          {t("trust")}
        </p>
      </div>
    </section>
  );
}
