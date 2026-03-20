import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Awards",
  description:
    "Die Cocktail X Awards – die prestigeträchtigsten Auszeichnungen der Münchner Cocktail-Szene.",
};

export default function AwardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
