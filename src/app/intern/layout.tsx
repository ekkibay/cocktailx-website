import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { hatSitzungscookie, zugriff } from "./gate";
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
  const z = zugriff();
  if (z === "aus") notFound();
  if (z === "login") redirect("/intern-login");

  return (
    <html lang="de" className="bg-licorice">
      <body className="bg-licorice text-bone antialiased">
        {hatSitzungscookie() && <Abmelden />}
        {children}
      </body>
    </html>
  );
}

/**
 * Abmelden oben rechts, ueber dem Inhalt statt in ihm: Die Seiten bringen
 * ihren Kopf selbst mit, das Layout soll ihn nicht verschieben. Auf breiten
 * Schirmen als Pille auf Hoehe der Reiter, auf schmalen nur als Text ueber
 * ihnen, weil die drei Reiter dort die ganze Zeile brauchen.
 *
 * POST statt Link, damit kein fremder Link das Team nebenbei abmeldet.
 */
function Abmelden() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-6xl justify-end px-5 pt-2 sm:pt-8 md:px-10 md:pt-12">
        <form action="/intern-login/abmelden" method="post" className="pointer-events-auto">
          <button
            type="submit"
            className="rounded-full font-body text-xs font-bold uppercase tracking-wider text-muted transition-colors hover:text-bone sm:border sm:border-hairline sm:px-4 sm:py-2 sm:hover:border-tangerine/50"
          >
            Abmelden
          </button>
        </form>
      </div>
    </div>
  );
}
