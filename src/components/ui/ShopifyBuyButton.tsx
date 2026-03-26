"use client";

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
}

export default function ShopifyBuyButton({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  productId,
  buttonText,
  className = "",
}: ShopifyBuyButtonProps) {
  const handleClick = () => {
    // TODO: Replace with real Shopify checkout flow
    // See comment at top of file for implementation pattern
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
