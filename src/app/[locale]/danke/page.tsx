"use client";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { hasConsent, loadPixel, trackEvent } from "@/lib/meta-pixel";
import { BUNDLES, CONTACT_EMAIL, EVENT, TIERS, currentPrice } from "@/config/pricing";

/* ── Plausible Kaufwerte ──────────────────────────────────────────────
   Der Shop haengt value und order_id als reine Query-Parameter an den
   Ruecksprung. Vorher wurde jede Zahl groesser null ungeprueft als Umsatz an
   Meta gemeldet, /danke?value=99999&order_id=beliebig also auch, und jeder
   Reload zaehlte erneut. Deshalb zwei Huerden: eine Whitelist aus der
   Preisquelle und ein Merker gegen Doppelzaehlung.

   Das ist bewusst keine Absicherung. Ein Wert, der ueber die URL reist,
   bleibt clientseitig faelschbar. Sauber wird das erst mit einem
   serverseitigen Purchase ueber die Conversions API, das haengt am Shop. */

const ALLOWED_PRICES: number[] = [
  TIERS.early.price,
  TIERS.full.price,
  // Bundlepreise kommen aus derselben Quelle. Nicht tippen, sonst laeuft die
  // Whitelist bei der naechsten Preisaenderung still gegen den Shop.
  ...BUNDLES.filter((b) => !b.requestOnly).flatMap((b) => [b.price.early, b.price.full]),
].filter((price) => price > 0);

/** Untergrenze ist der guenstigste echte Preis, aktuell der Early Bird. */
const MIN_VALUE = Math.min(...ALLOWED_PRICES);
/** Deckel gegen aufgeblasene Betraege. Groessere Bestellungen laufen ueber Team Nights. */
const MAX_VALUE = 5000;

/**
 * Plausibel ist nur ein ganzes Vielfaches eines echten Einzelpreises.
 * Gemischte Bestellungen, etwa ein Pass plus ein Double Season, fallen damit
 * durch und werden ohne value gemeldet. Das ist der gewollte Fehlerfall:
 * lieber ein Kauf ohne Umsatzwert als ein erfundener Umsatzwert.
 */
function isPlausibleValue(value: number): boolean {
  if (!Number.isFinite(value) || !Number.isInteger(value)) return false;
  if (value < MIN_VALUE || value > MAX_VALUE) return false;
  return ALLOWED_PRICES.some((price) => value % price === 0);
}

/** Ein Reload der Dankeseite ist kein zweiter Kauf. Der Merker haelt eine Session lang. */
const TRACKED_KEY = "onice_purchase_tracked";

function alreadyTracked(id: string): boolean {
  try {
    return window.sessionStorage.getItem(TRACKED_KEY) === id;
  } catch {
    // sessionStorage kann blockiert sein (Private Mode, Policies). Dann lieber
    // einmal zu viel zaehlen als den Kauf gar nicht zu melden.
    return false;
  }
}

function markTracked(id: string) {
  try {
    window.sessionStorage.setItem(TRACKED_KEY, id);
  } catch {
    /* nicht speicherbar, siehe oben */
  }
}

/**
 * Liest die Rueckgabeparameter und feuert das Purchase-Event.
 * In <Suspense> gewickelt, weil useSearchParams() das im App Router verlangt.
 *
 * Erwarteter Ruecksprung aus dem Shop:
 *   /de/danke?value=39&order_id=ABC123
 */
function PurchaseTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const rawValue = searchParams.get("value");
    const orderId = searchParams.get("order_id");

    // Ohne Bestellnummer greift der Merker trotzdem, sonst zaehlt ein Reload erneut.
    const trackingId = orderId ?? "ohne-bestellnummer";
    if (alreadyTracked(trackingId)) return;

    const params: Record<string, string | number | boolean> = {
      // Nomenklatur wie in Header und CheckoutButton. Vorher stand hier die
      // Sommerbenennung, damit lief die Attribution zwischen InitiateCheckout
      // und Purchase auseinander.
      content_name: "ON ICE Pass",
      content_category: "ON ICE",
      currency: "EUR",
    };

    if (rawValue) {
      // Number statt parseFloat: parseFloat("39abc") ergibt 39 und haette den
      // Wert durch die Pruefung gelassen. Number ergibt NaN und faellt durch.
      const value = Number(rawValue);
      if (isPlausibleValue(value)) {
        params.value = value;
      }
    }

    if (orderId) {
      params.content_ids = orderId;
    }

    // Feuern und nur bei Erfolg vermerken.
    //
    // Vorher stand hier ein Aufruf ohne Auswertung, direkt gefolgt vom
    // Merker. Beim ersten Aufruf der Seite ist der Pixel aber oft noch nicht
    // geladen, etwa weil die Einwilligung erst im Banner erteilt wird.
    // trackEvent brach dann still ab, der Merker wurde trotzdem gesetzt, und
    // der Kauf kam nie bei Meta an, auch nach einem Neuladen nicht.
    const fire = () => {
      if (!hasConsent()) return false;
      loadPixel();
      if (!trackEvent("Purchase", params)) return false;
      markTracked(trackingId);
      return true;
    };

    if (fire()) return;

    // Kurz nachfassen, falls die Einwilligung gleich noch kommt. Nach dreissig
    // Sekunden aufgeben: Wer bis dahin nicht zugestimmt hat, will nicht.
    const versuch = setInterval(() => {
      if (fire()) clearInterval(versuch);
    }, 1000);
    const aufgeben = setTimeout(() => clearInterval(versuch), 30_000);
    return () => {
      clearInterval(versuch);
      clearTimeout(aufgeben);
    };
  }, [searchParams]);

  return null;
}

export default function DankePage() {
  const locale = useLocale() as "de" | "en";

  // Preis nie tippen. Am 16.10. schaltet die Preisquelle um, ein getippter Preis
  // waere danach falsch und liefe ueber den Teilen-Text weiter durch WhatsApp.
  const price = currentPrice();
  // Im Teilen-Text traegt die Edition das Jahr, deshalb ohne Jahreszahl.
  const dateRange = EVENT.dateLabel.replace(" 2026", "");

  const shareText =
    locale === "de"
      ? `Ich hab mir gerade meinen Pass für COCKTAIL X ON ICE '26 geholt. ${EVENT.nights} Nächte, ${EVENT.barsLabel} Bars in München, in jeder Bar ein Signature Drink. ${dateRange}. Der Pass kostet ${price} €. Komm mit: https://www.cocktail-x.com?utm_source=whatsapp&utm_medium=share&utm_campaign=onice26`
      : `I just got my pass for COCKTAIL X ON ICE '26. ${EVENT.nights} nights, ${EVENT.barsLabel} bars in Munich, one signature drink in every bar. November 17 to 28. The pass is ${price} €. Join me: https://www.cocktail-x.com/en?utm_source=whatsapp&utm_medium=share&utm_campaign=onice26`;

  return (
    <main className="section-padding pt-32 md:pt-40 min-h-screen relative flex items-center justify-center">
      <Suspense fallback={null}>
        <PurchaseTracker />
      </Suspense>

      {/* CI-Hintergrund.
          Hier lag das Kachelmuster aus /images/pattern-bg.svg, das das alte
          Jambalaya-Braun fest in die Datei schreibt und deshalb nicht mit dem
          Farbklima schaltet, dazu Verlaeufe im warmen Grund und ein oranger
          Schleier. Auf einer ON ICE Seite ist beides falsch. Ersetzt durch reine
          Tokenflaechen, die unter :root kalt aufloesen. Das kalte Kachelmuster
          gibt es im Repo noch nicht, ein Verweis darauf waere heute ein 404. */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-surface/40 via-transparent to-licorice/80" />
        <div className="absolute -top-52 -right-52 w-[600px] h-[600px] rounded-full bg-tangerine/10 blur-[120px]" />
        <div className="absolute -bottom-24 -left-36 w-[450px] h-[450px] rounded-full bg-hibiscus/10 blur-[110px]" />
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
          {/* Das Produkt heisst Pass, nicht Ticket, und es ist nicht unterwegs,
              es liegt bereit. "auf dem Weg zu dir" hat eine Zustellung versprochen,
              die es nicht gibt. */}
          {locale === "de" ? "Dein Pass gehört dir." : "Your pass is yours."}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="text-base font-body text-bone/65 leading-relaxed mb-10"
        >
          {/* Hier stand "Lade dir die Cocktail X App herunter". Die App laeuft im
              Browser und sagt das auf /app selbst. Ein Downloadversprechen erzeugt
              genau die Rueckfrage, die diese Seite verhindern soll. */}
          {locale === "de"
            ? "Du erhältst in Kürze eine Bestätigung per E-Mail. Öffne die Cocktail X App und melde dich mit derselben Adresse an, dann liegt dein Pass dort bereit. Installieren musst du nichts, die App läuft im Browser."
            : "You will receive a confirmation email shortly. Open the Cocktail X App and sign in with the same address, your pass is waiting there. Nothing to install, the app runs in your browser."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          {/* Fuehrte auf /app, also auf die eigene Marketingseite, die selbst sagt,
              dass es nichts zu installieren gibt. Nach dem Kauf will der Gast in
              die App, nicht in ihre Beschreibung. */}
          <a
            href="https://cocktailx.app"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm md:text-base"
          >
            {locale === "de" ? "APP ÖFFNEN" : "OPEN APP"}
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
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
            {/* Schritt 4 nannte den 5. Mai 2027, das Startdatum des Sommerfestivals
                aus src/data/events.ts. Auf der Dankeseite eines Novemberpasses war
                das der teuerste Fehler der Seite. */}
            {(locale === "de"
              ? [
                  "Bestätigungsmail checken",
                  "App öffnen, kein Download nötig",
                  "Mit deiner E-Mail anmelden, der Pass liegt bereit",
                  "Ab 17. November: Bars entdecken und Signature Drinks freischalten",
                ]
              : [
                  "Check your confirmation email",
                  "Open the app, no download needed",
                  "Sign in with your email, your pass is waiting",
                  "From November 17: discover bars and unlock signature drinks",
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

        {/* Haeufigste Rueckfrage nach dem Kauf. Steht hier, damit sie nicht als
            Mail im Postfach landet. */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="text-xs font-body text-muted mt-6"
        >
          {locale === "de"
            ? "Keine Mail bekommen? Schau kurz in den Spam-Ordner oder schreib uns an "
            : "No email yet? Check your spam folder or write to us at "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-tangerine hover:underline">
            {CONTACT_EMAIL}
          </a>
          .
        </motion.p>
      </div>
    </main>
  );
}
