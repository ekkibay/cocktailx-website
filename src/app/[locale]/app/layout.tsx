import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "App",
  description:
    "Die Cocktail X App – dein digitaler Begleiter für das Festival. Passport, Karte und mehr.",
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
