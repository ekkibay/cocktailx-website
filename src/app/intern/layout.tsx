import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { internErlaubt } from "./gate";
import "../globals.css";

/**
 * Interner Bereich. Kein Gastauftritt, keine Sprachfuehrung, kein Index.
 */
export const metadata: Metadata = {
  title: "Intern",
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default function InternLayout({ children }: { children: React.ReactNode }) {
  if (!internErlaubt()) notFound();

  return (
    <html lang="de" className="bg-licorice">
      <body className="bg-licorice text-bone antialiased">{children}</body>
    </html>
  );
}
