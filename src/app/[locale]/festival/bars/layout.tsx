import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bars",
  description:
    "Entdecke alle teilnehmenden Bars beim Cocktail X Festival München 2026.",
};

export default function BarsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
