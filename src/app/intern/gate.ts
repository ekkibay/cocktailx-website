/**
 * Die Sperre fuer den internen Bereich, an einer Stelle.
 *
 * Sie steht hier und nicht im Layout, weil Route Handler das Layout nicht
 * durchlaufen. Eine Pruefung nur in layout.tsx haette den Export offen
 * gelassen, waehrend die Seite daneben 404 liefert: Der Export gibt Namen
 * und Adressen der Kaeufer heraus, also genau das, was am wenigsten offen
 * stehen darf.
 *
 * Das ist kein Login. Wer den Bereich dauerhaft ins Netz stellt, braucht
 * einen davor, etwa ueber den Zugriffsschutz des Hosters.
 */
export function internErlaubt(): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  return process.env.DASHBOARD_ENABLED === "true";
}
