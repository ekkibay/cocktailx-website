import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Offizielle Cocktail X Festival Merchandise – Passport, T-Shirts und mehr.",
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
