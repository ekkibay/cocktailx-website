"use client";

import { trackEvent } from "@/lib/meta-pixel";

/**
 * Kauf-CTA. Ziel kommt aus der Preis-Config, nicht aus der Komponente.
 * Feuert InitiateCheckout, allerdings nur mit Einwilligung: trackEvent()
 * bricht ohne sie ab.
 */
export default function CheckoutButton({
  href,
  label,
  value,
  contentName,
  className = "",
  onNavigate,
}: {
  href: string;
  label: string;
  value: number;
  contentName: string;
  className?: string;
  /** Optional, etwa um ein offenes Menue zu schliessen. */
  onNavigate?: () => void;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        trackEvent("InitiateCheckout", {
          content_name: contentName,
          content_type: "product",
          currency: "EUR",
          value,
        });
        onNavigate?.();
      }}
      className={className}
    >
      {label}
    </a>
  );
}
