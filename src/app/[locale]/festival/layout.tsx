import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Festival",
  description:
    "Erlebe das Cocktail X Festival in München. 18 Tage, 50+ Bars, unvergessliche Drinks.",
};

export default function FestivalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
