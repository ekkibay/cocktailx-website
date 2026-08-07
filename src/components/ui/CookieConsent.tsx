"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import Link from "next/link";
import { grantConsent, readConsent, revokeConsent } from "@/lib/meta-pixel";

export default function CookieConsent() {
  const locale = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Banner nur zeigen, solange keine Entscheidung gespeichert ist.
    // grantConsent/revokeConsent schreiben sie, deshalb erscheint es danach nicht wieder.
    if (readConsent() === null) setVisible(true);
  }, []);

  function handleAccept() {
    grantConsent();
    setVisible(false);
    window.dispatchEvent(new Event("cc:resolved"));
  }

  function handleDecline() {
    revokeConsent();
    setVisible(false);
    window.dispatchEvent(new Event("cc:resolved"));
  }

  const de = locale === "de";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-[60] p-4 md:p-6"
        >
          <div className="max-w-3xl mx-auto rounded-2xl bg-licorice/95 backdrop-blur-xl border border-bone/10 shadow-2xl shadow-black/40 p-5 md:p-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-body font-bold text-bone mb-1.5">
                  {de ? "Wir nutzen Cookies" : "We use cookies"}
                </p>
                <p className="text-xs font-body text-bone/65 leading-relaxed">
                  {de
                    ? "Wir verwenden Cookies und ähnliche Technologien, um dir das beste Erlebnis zu bieten. Marketing-Cookies helfen uns, relevante Inhalte anzuzeigen. Mehr dazu in unserer "
                    : "We use cookies and similar technologies to give you the best experience. Marketing cookies help us show relevant content. Learn more in our "}
                  <Link
                    href={`/${locale}/legal/datenschutz`}
                    className="text-tangerine hover:text-tangerine/80 transition-colors underline underline-offset-2"
                  >
                    {de ? "Datenschutzerklärung" : "Privacy Policy"}
                  </Link>
                  .
                </p>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={handleDecline}
                  className="text-xs font-body font-bold text-bone/60 hover:text-bone transition-colors uppercase tracking-wider px-4 py-2.5 rounded-full border border-bone/15 hover:border-bone/30"
                >
                  {de ? "Ablehnen" : "Decline"}
                </button>
                <button
                  onClick={handleAccept}
                  className="text-xs font-body font-bold text-licorice bg-tangerine hover:bg-tangerine/90 transition-colors uppercase tracking-wider px-6 py-2.5 rounded-full"
                >
                  {de ? "Akzeptieren" : "Accept"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
