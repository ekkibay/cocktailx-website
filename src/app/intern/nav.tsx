/**
 * Umschalter zwischen den internen Seiten. Bewusst schlicht: zwei Ziele,
 * keine Zustandslogik, der aktive Reiter kommt von der Seite selbst.
 */
export function InternNav({ aktiv }: { aktiv: "verkauf" | "support" }) {
  const reiter = [
    { key: "verkauf", label: "Verkauf", href: "/intern/dashboard" },
    { key: "support", label: "Support", href: "/intern/support" },
  ] as const;

  return (
    <nav className="mb-6 flex gap-2">
      {reiter.map((r) => (
        <a
          key={r.key}
          href={r.href}
          className={`rounded-full px-4 py-2 font-body text-xs font-bold uppercase tracking-wider transition-colors ${
            r.key === aktiv
              ? "bg-bone text-licorice"
              : "border border-hairline text-muted hover:text-bone hover:border-tangerine/50"
          }`}
        >
          {r.label}
        </a>
      ))}
    </nav>
  );
}
