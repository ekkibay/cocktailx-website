"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import ShopifyBuyButton from "@/components/ui/ShopifyBuyButton";

const features = [
  "Access to 50+ participating bars",
  "200+ exclusive cocktails",
  "Collect stamps & win prizes",
  "18 days of festival fun",
  "Exclusive events & tastings",
];

export default function Tickets() {
  const t = useTranslations("tickets");

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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto bg-licorice border-2 border-tangerine rounded-2xl p-8 relative"
        >
          {/* Badge */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-tangerine text-licorice text-xs font-display tracking-wider px-4 py-1 rounded-full">
            MOST POPULAR
          </div>

          <h3 className="text-2xl font-display text-bone text-center mt-2">
            Passport
          </h3>
          <p className="text-5xl font-display text-tangerine text-center my-6">
            &euro;15
          </p>

          <ul className="space-y-3 mb-8">
            {features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 text-bone/70 font-body"
              >
                <span className="text-tangerine mt-0.5">✦</span>
                {feature}
              </li>
            ))}
          </ul>

          <ShopifyBuyButton
            productId="passport"
            buttonText={t("buyNow")}
            className="w-full text-center"
          />
        </motion.div>
      </div>
    </section>
  );
}
