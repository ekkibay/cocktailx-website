"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { loadPixel, trackEvent, hasConsent } from "@/lib/meta-pixel";

/**
 * Inner component — must live inside <Suspense> because useSearchParams
 * requires it in Next.js App Router.
 */
function MetaPixelEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Load pixel on mount (respects consent)
  useEffect(() => {
    loadPixel();
  }, []);

  // Fire PageView on every client-side navigation
  useEffect(() => {
    if (hasConsent()) {
      trackEvent("PageView");
    }
  }, [pathname, searchParams]);

  return null;
}

/**
 * Mounts in root layout. Loads the pixel (if consent granted) and
 * fires PageView on every client-side navigation.
 */
export default function MetaPixel() {
  return (
    <Suspense fallback={null}>
      <MetaPixelEvents />
    </Suspense>
  );
}
