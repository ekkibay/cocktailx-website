import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Neuigkeiten, Trends und Geschichten rund um das Cocktail X Festival und die Münchner Barszene.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
