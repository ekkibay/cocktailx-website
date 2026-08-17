"use client";

import { useEffect, useState } from "react";
import {
  CHECKOUT,
  EARLY_UNTIL_SHORT,
  EVENT,
  REFERENCE_PRICE,
  TIERS,
  currentTier,
  daysUntilFullPrice,
} from "@/config/pricing";
import CheckoutButton from "./CheckoutButton";

/**
 * Mobile Kaufleiste. Erscheint erst, wenn der Hero-CTA aus dem Bild gescrollt
 * ist, damit sie ihn nicht doppelt. Auf Desktop ausgeblendet, dort steht der
 * CTA im Header.
 *
 * Preis und Ziel kommen aus der Config, der Tarif wird nach dem Mount mit der
 * Uhrzeit des Besuchers nachgezogen.
 */
export default function StickyPass({ serverNow }: { serverNow: number }) {
  const [visible, setVisible] = useState(false);
  const [now, setNow] = useState(serverNow);

  useEffect(() => {
    setNow(Date.now());
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tier = currentTier(now);
  const price = TIERS[tier].price;
  const days = daysUntilFullPrice(now);

  return (
    <div
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-licorice/95 backdrop-blur-md border-t border-hairline px-4 py-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl text-tangerine leading-none tabular-nums">{price} €</span>
            {/* Streichpreis nur im Einstiegsfenster. Danach faellt er weg,
                sonst stuende der Preis gegen sich selbst. */}
            {tier === "early" && (
              <span className="font-display text-base text-muted/70 line-through leading-none tabular-nums" aria-hidden>
                {REFERENCE_PRICE} €
              </span>
            )}
            <span className="font-body text-[11px] text-muted">pro Pass</span>
          </div>
          <p className="font-body text-[11px] text-muted mt-0.5 truncate">
            {tier === "early"
              ? `Early Bird bis ${EARLY_UNTIL_SHORT}, noch ${days} ${days === 1 ? "Tag" : "Tage"}`
              : `Alle ${EVENT.nights} Nächte, alle Bars`}
          </p>
        </div>
        <CheckoutButton
          href={CHECKOUT.single}
          label="Pass sichern"
          value={price}
          contentName="ON ICE Pass (Sticky)"
          className="btn-primary text-sm whitespace-nowrap px-5 py-3 shrink-0"
        />
      </div>
    </div>
  );
}
