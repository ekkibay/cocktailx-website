"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { loadPixel, trackEvent, hasConsent } from "@/lib/meta-pixel";

/**
 * Mounts in root layout. Loads the pixel (if consent granted) and
 * fires PageView on every client-side navigation.
 */
export default function MetaPixel() {
  // Load pixel on mount (respects consent)
  useEffect(() => {
    loadPixel();
  }, []);

  // Fire PageView on route change
  const pathname = usePathname();
  useEffect(() => {
    if (hasConsent()) {
      trackEvent("PageView");
    }
  }, [pathname]);

  return null;
}
