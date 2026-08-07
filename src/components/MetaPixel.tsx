"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { hasConsent, loadPixel, trackEvent } from "@/lib/meta-pixel";

/**
 * Inner component — must live inside <Suspense> because useSearchParams
 * requires it in Next.js App Router.
 */
function MetaPixelEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [consented, setConsented] = useState(false);

  // Einwilligungsstand lesen und auf die Entscheidung im Banner reagieren.
  // Vorher wird nichts geladen und nichts gesendet.
  useEffect(() => {
    const sync = () => setConsented(hasConsent());
    sync();
    window.addEventListener("cc:resolved", sync);
    return () => window.removeEventListener("cc:resolved", sync);
  }, []);

  useEffect(() => {
    if (consented) loadPixel();
  }, [consented]);

  // PageView bei jeder clientseitigen Navigation, aber nur mit Einwilligung.
  // loadPixel() feuert den ersten PageView selbst, deshalb hier nur die Folgeaufrufe.
  useEffect(() => {
    if (consented) trackEvent("PageView");
  }, [consented, pathname, searchParams]);

  return null;
}

/**
 * Mounts in root layout. Lädt den Pixel nur nach Einwilligung und
 * feuert PageView bei jeder clientseitigen Navigation.
 */
export default function MetaPixel() {
  return (
    <Suspense fallback={null}>
      <MetaPixelEvents />
    </Suspense>
  );
}
