"use client";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import ShopifyBuyButton from "@/components/ui/ShopifyBuyButton";

const products = [
  {
    productId: "passport",
    name: { de: "Festival Passport", en: "Festival Passport" },
    price: 15,
    image: "📖",
    description: {
      de: "Dein Zugang zum Cocktail X Festival. Entdecke 50+ Bars und sammle Stempel.",
      en: "Your access to the Cocktail X Festival. Discover 50+ bars and collect stamps.",
    },
  },
  {
    productId: "tshirt",
    name: { de: "T-Shirt", en: "T-Shirt" },
    price: 39,
    image: "👕",
    description: {
      de: "Offizielles Cocktail X Festival T-Shirt. 100% Bio-Baumwolle.",
      en: "Official Cocktail X Festival T-Shirt. 100% organic cotton.",
    },
  },
  {
    productId: "giftcard",
    name: { de: "Geschenkkarte", en: "Gift Card" },
    price: 15,
    image: "🎁",
    description: {
      de: "Das perfekte Geschenk fuer Cocktail-Liebhaber.",
      en: "The perfect gift for cocktail lovers.",
    },
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.15 },
  }),
};

export default function ShopPage() {
  const locale = useLocale() as "de" | "en";

  return (
    <main>
      {/* Hero */}
      <section className="section-padding text-center min-h-[40vh] flex flex-col items-center justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-7xl lg:text-8xl font-display text-bone"
        >
          SHOP
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg md:text-xl font-body text-bone/70 mt-6 max-w-xl"
        >
          {locale === "de"
            ? "Offizielle Cocktail X Merchandise und Festival-Essentials."
            : "Official Cocktail X merchandise and festival essentials."}
        </motion.p>
      </section>

      {/* Product Grid */}
      <section className="section-padding pt-0">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {products.map((product, i) => (
            <motion.div
              key={product.name.en}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              className="bg-bone/5 border border-bone/10 rounded-2xl overflow-hidden group hover:-translate-y-2 transition-transform duration-300"
            >
              {/* Placeholder Image */}
              <div className="aspect-square bg-bone/5 flex items-center justify-center">
                <span className="text-7xl group-hover:scale-110 transition-transform duration-300">
                  {product.image}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-display text-bone mb-2">
                  {product.name[locale]}
                </h3>
                <p className="text-bone/60 font-body text-sm mb-4">
                  {product.description[locale]}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-display text-tangerine">
                    &euro;{product.price}
                  </span>
                  <ShopifyBuyButton
                    productId={product.productId}
                    buttonText={locale === "de" ? "In den Warenkorb" : "Add to Cart"}
                    className="text-sm"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
