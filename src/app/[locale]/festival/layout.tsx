import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Festival",
  description:
    "Erlebe das Cocktail X Festival in München. 58 Bars. 18 Tage. 1 Ticket. Jede Bar kreiert einen exklusiven Signature Cocktail.",
};

export default function FestivalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
