"use client";

import { trackEvent } from "@/lib/meta-pixel";

/*
 * Shopify Buy Button Component
 *
 * Currently renders a placeholder button. To connect to a real Shopify store:
 *
 * 1. Set NEXT_PUBLIC_SHOPIFY_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN
 *    in your .env.local file.
 *
 * 2. Uncomment the real implementation below and remove the placeholder.
 *
 * Real implementation pattern:
 *
 * import Client from "shopify-buy";
 *
 * const client = Client.buildClient({
 *   domain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN!,
 *   storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!,
 *   apiVersion: "2024-01",
 * });
 *
 * // In the component:
 * useEffect(() => {
 *   client.checkout.create().then((checkout) => {
 *     setCheckoutId(checkout.id);
 *   });
 * }, []);
 *
 * const handleBuy = async () => {
 *   const checkout = await client.checkout.addLineItems(checkoutId, [
 *     { variantId: productId, quantity: 1 },
 *   ]);
 *   window.location.href = checkout.webUrl;
 * };
 */

interface ShopifyBuyButtonProps {
  productId: string;
  buttonText: string;
  className?: string;
  price?: number;
}

export default function ShopifyBuyButton({
  productId,
  buttonText,
  className = "",
  price,
}: ShopifyBuyButtonProps) {
  const handleClick = () => {
    // Meta Pixel: track AddToCart when user clicks buy
    trackEvent("AddToCart", {
      content_name: productId,
      content_category: "Festival",
      content_type: "product",
      currency: "EUR",
      ...(price != null && { value: price }),
    });

    window.open("https://cocktailx.app/", "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      className={`btn-primary ${className}`}
    >
      {buttonText}
    </button>
  );
}
