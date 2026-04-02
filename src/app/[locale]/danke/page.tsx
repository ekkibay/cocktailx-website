"use client";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import Link from "next/link";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/meta-pixel";

/**
 * Inner component that reads search params and fires the Purchase event.
 * Wrapped in <Suspense> because useSearchParams() requires it in Next.js App Router.
 *
 * Expected redirect URL from cocktailx.app:
 *   /de/danke?value=20&order_id=ABC123
 */
function PurchaseTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const rawValue = searchParams.get("value");
    const orderId = searchParams.get("order_id");

    const params: Record<string, string | number | boolean> = {
      content_name: "Festival Ticket",
      content_category: "Festival",
      currency: "EUR",
    };

    if (rawValue) {
      const value = parseFloat(rawValue);
      if (!isNaN(value) && value > 0) {
        params.value = value;
      }
    }

    if (orderId) {
      params.content_ids = orderId;
    }

    trackEvent("Purchase", params);
  }, [searchParams]);

  return null;
}

export default function DankePage() {
  const locale = useLocale() as "de" | "en";

  return (
    <main className="section-padding pt-32 md:pt-40 min-h-screen relative flex items-center justify-center">
      <Suspense fallback={null}>
        <PurchaseTracker />
      </Suspense>

      {/* CI background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(/images/pattern-bg.svg)", backgroundSize: "200px 200px", backgroundRepeat: "repeat", opacity: 0.18 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(25,21,19,0.55) 0%, rgba(25,21,19,0.2) 25%, rgba(25,21,19,0.2) 75%, rgba(25,21,19,0.7) 100%)" }} />
        <div style={{ position: "absolute", top: "-200px", right: "-200px", width: "600px", height: "600px", borderRadius: "50%", background: "rgba(243,146,0,0.12)", filter: "blur(120px)" }} />
        <div style={{ position: "absolute", bottom: "-100px", left: "-150px", width: "450px", height: "450px", borderRadius: "50%", background: "rgba(189,37,110,0.10)", filter: "blur(110px)" }} />
      </div>

      <div className="max-w-2xl mx-auto text-center relative">
        {/* Confetti star */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-8 rounded-full bg-tangerine/10 border border-tangerine/30 flex items-center justify-center"
        >
          <svg className="w-10 h-10 text-tangerine" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-4xl md:text-6xl font-display text-bone mb-4"
        >
          {locale === "de" ? "DANKE!" : "THANK YOU!"}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-lg md:text-xl font-body text-bone/85 leading-relaxed mb-4"
        >
          {locale === "de"
            ? "Dein Ticket ist auf dem Weg zu dir."
            : "Your ticket is on its way to you."}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="text-base font-body text-bone/65 leading-relaxed mb-10"
        >
          {locale === "de"
            ? "Du erhaltst in Kurze eine Bestatigung per E-Mail. Lade dir die Cocktail X App herunter, um dein Ticket zu aktivieren und alle 58 Bars zu entdecken."
            : "You'll receive a confirmation email shortly. Download the Cocktail X App to activate your ticket and discover all 58 bars."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <Link
            href={`/${locale}/app`}
            className="btn-primary text-sm md:text-base"
          >
            {locale === "de" ? "APP HERUNTERLADEN" : "DOWNLOAD APP"}
          </Link>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              locale === "de"
                ? "Ich hab mir gerade ein Ticket fur das Cocktail X Festival geholt! 58 Bars, 18 Tage, Signature Cocktails fur nur 6 Euro. Komm mit! https://www.cocktail-x.com/shop"
                : "I just got a ticket for the Cocktail X Festival! 58 bars, 18 days, signature cocktails for just 6 Euro. Join me! https://www.cocktail-x.com/en/shop"
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-bone/20 text-bone font-body font-bold text-sm hover:bg-bone/5 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {locale === "de" ? "FREUNDEN WEITERLEITEN" : "SHARE WITH FRIENDS"}
          </a>
        </motion.div>

        {/* Next steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="bg-bone/[0.04] border border-bone/10 rounded-2xl p-6 md:p-8 text-left"
        >
          <p className="text-[11px] font-body font-bold uppercase tracking-[0.15em] text-tangerine mb-4">
            {locale === "de" ? "So geht's weiter" : "Next Steps"}
          </p>
          <div className="space-y-4">
            {(locale === "de"
              ? [
                  "Bestatigungsmail checken",
                  "Cocktail X App herunterladen",
                  "Ticket in der App aktivieren",
                  "Ab 13. Mai: Bars entdecken & Cocktails geniessen!",
                ]
              : [
                  "Check your confirmation email",
                  "Download the Cocktail X App",
                  "Activate your ticket in the app",
                  "From May 13: Discover bars & enjoy cocktails!",
                ]
            ).map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-tangerine/10 border border-tangerine/20 flex items-center justify-center text-xs font-display text-tangerine flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-sm font-body text-bone/80">{step}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
