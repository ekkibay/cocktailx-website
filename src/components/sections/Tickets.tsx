"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import ShopifyBuyButton from "@/components/ui/ShopifyBuyButton";

const FESTIVAL_DATE = new Date("2026-05-13T19:00:00+02:00");

const tiers = [
  {
    key: "earlyBird",
    price: 16,
    productId: "passport-early-bird",
    // Sold out 30 days before festival
    soldOutDaysBefore: 30,
  },
  {
    key: "regular",
    price: 20,
    productId: "passport-regular",
    // Sold out 10 days before festival
    soldOutDaysBefore: 10,
  },
  {
    key: "late",
    price: 25,
    productId: "passport-late",
    // Available until festival ends
    soldOutDaysBefore: -18,
  },
];

function getTierStatus(soldOutDaysBefore: number) {
  const now = new Date();
  const cutoff = new Date(FESTIVAL_DATE);
  cutoff.setDate(cutoff.getDate() - soldOutDaysBefore);

  return now >= cutoff ? "soldOut" : "available";
}

export default function Tickets() {
  const t = useTranslations("tickets");

  const features = [
    t("feature1"),
    t("feature2"),
    t("feature3"),
    t("feature4"),
    t("feature5"),
  ];

  const tiersWithStatus = useMemo(() => {
    return tiers.map((tier) => ({
      ...tier,
      status: getTierStatus(tier.soldOutDaysBefore),
    }));
  }, []);

  // The best available tier gets highlighted
  const bestAvailableKey = tiersWithStatus.find(
    (t) => t.status === "available"
  )?.key;

  return (
    <section id="tickets" className="py-20 bg-jambalaya/30">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-display text-bone text-center mb-16"
        >
          {t("headline")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center text-sm md:text-base font-body text-bone/60 -mt-10 mb-16"
        >
          {t("subtitle")}
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {tiersWithStatus.map((tier, i) => {
            const isBest = tier.key === bestAvailableKey;
            const isSoldOut = tier.status === "soldOut";
            const isAvailable = tier.status === "available";

            return (
              <motion.div
                key={tier.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative rounded-2xl p-8 flex flex-col items-center ${
                  isSoldOut
                    ? "bg-licorice/40 border border-bone/5 opacity-60"
                    : isBest
                    ? "bg-licorice border-2 border-tangerine md:scale-105"
                    : "bg-licorice border border-bone/10"
                }`}
              >
                {/* Badge */}
                {isSoldOut && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-bone/20 text-bone text-xs font-body font-bold tracking-wider px-4 py-1 rounded-full uppercase whitespace-nowrap">
                    {t("soldOut")}
                  </div>
                )}
                {isBest && !isSoldOut && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-tangerine text-licorice text-xs font-body font-bold tracking-wider px-4 py-1 rounded-full uppercase whitespace-nowrap">
                    {t("activeBadge")}
                  </div>
                )}

                <h3
                  className={`text-lg font-display tracking-wider mt-2 ${
                    isSoldOut
                      ? "text-bone/30 line-through"
                      : isBest
                      ? "text-bone"
                      : "text-bone/70"
                  }`}
                >
                  {t(`${tier.key}.name`)}
                </h3>

                <p
                  className={`text-5xl font-display my-4 ${
                    isSoldOut
                      ? "text-bone/20 line-through"
                      : isBest
                      ? "text-tangerine"
                      : "text-tangerine/70"
                  }`}
                >
                  &euro;{tier.price}
                </p>

                {!isSoldOut && tier.price < 25 && (
                  <span className="text-xs font-body text-emerald-400 font-bold mt-1">
                    {t("savings", { amount: 25 - tier.price })}
                  </span>
                )}

                <p
                  className={`text-xs font-body text-center mb-6 ${
                    isSoldOut ? "text-bone/20" : "text-bone/60"
                  }`}
                >
                  {t(`${tier.key}.info`)}
                </p>

                {isSoldOut ? (
                  <div className="mt-auto">
                    <span className="text-sm font-body text-bone/20 uppercase tracking-wider">
                      {t("soldOut")}
                    </span>
                  </div>
                ) : (
                  <>
                    {(isBest || isAvailable) && (
                      <ul className="space-y-3 mb-8 w-full">
                        {features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-3 text-bone/70 font-body text-sm"
                          >
                            <span className="text-tangerine mt-0.5">✦</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}

                    <ShopifyBuyButton
                      productId={tier.productId}
                      buttonText={t("buyNow")}
                      className="w-full text-center"
                    />
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
