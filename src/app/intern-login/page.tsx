import { redirect } from "next/navigation";

import { sitzungGueltig } from "../intern/gate";

/**
 * Die Anmeldeseite: ein Feld, ein Knopf.
 *
 * Kein Nutzername, weil es nur das gemeinsame Teampasswort gibt. Die
 * Fehlermeldung bleibt absichtlich vage: Ob das Passwort falsch war oder
 * der Server gar keins kennt, geht nur das Team etwas an und steht im Log.
 */

const FEHLER: Record<string, string> = {
  passwort: "Das hat nicht geklappt. Prüf das Passwort und versuch es noch einmal.",
  bremse: "Zu viele Versuche hintereinander. Warte eine Viertelstunde und versuch es dann noch einmal.",
};

export default function LoginPage({ searchParams }: { searchParams: { fehler?: string } }) {
  // Wer schon drin ist, braucht die Seite nicht.
  if (sitzungGueltig()) redirect("/intern/dashboard");

  const fehler = searchParams.fehler ? (FEHLER[searchParams.fehler] ?? FEHLER.passwort) : null;

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12 md:px-10">
      <div className="w-full max-w-sm">
        <p className="mb-3 font-body text-[11px] font-bold uppercase tracking-[0.3em] text-tangerine">
          Cocktail X
        </p>
        <h1 className="font-display text-4xl leading-none md:text-5xl">Intern</h1>
        <p className="mt-4 font-body text-sm leading-relaxed text-muted">
          Verkauf, Support und Newsletter. Nur für das Team.
        </p>

        <form method="post" action="/intern-login/anmelden" className="mt-8">
          <label
            htmlFor="passwort"
            className="block font-body text-xs font-bold uppercase tracking-wider text-muted"
          >
            Passwort
          </label>
          <input
            id="passwort"
            name="passwort"
            type="password"
            autoComplete="current-password"
            autoFocus
            required
            maxLength={200}
            className="mt-2 w-full rounded-xl border border-hairline bg-surface px-4 py-3 font-body text-sm text-bone outline-none transition-colors focus:border-tangerine"
          />
          {fehler && (
            <p role="alert" className="mt-3 font-body text-sm text-hibiscus">
              {fehler}
            </p>
          )}
          <button
            type="submit"
            className="mt-6 w-full rounded-full bg-bone px-5 py-3 font-body text-xs font-bold uppercase tracking-wider text-licorice transition-colors hover:bg-tangerine"
          >
            Anmelden
          </button>
        </form>
      </div>
    </main>
  );
}
