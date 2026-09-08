/**
 * Bremse fuer die Anmeldung am internen Bereich.
 *
 * Ein gemeinsames Passwort laesst sich raten, und ohne Bremse probiert ein
 * Skript in einer Minute mehr Woerter durch als das Team in einem Jahr
 * tippt. Fuenf Fehlversuche je IP und Viertelstunde reichen fuer jeden,
 * der sich vertippt, und machen das Raten sinnlos langsam.
 *
 * Gezaehlt werden nur Fehlversuche. Das Team sitzt oft hinter einer
 * gemeinsamen Adresse, und wenn morgens sechs Leute nacheinander
 * hereinkommen, darf das nicht die Tuer zuschlagen.
 *
 * Im Arbeitsspeicher, wie die Bremse am Newsletter: Ein Neustart vergisst
 * die Zaehler, und mehrere Instanzen zaehlen getrennt. Fuer das, was hier
 * geschuetzt wird, ist das der richtige Preis. Gegen einen verteilten
 * Angriff hilft es nicht, dafuer waere der Schutz des Hosters zustaendig.
 */

const FENSTER_MS = 15 * 60 * 1000;
const MAX_FEHLVERSUCHE = 5;

const fehlversuche = new Map<string, number[]>();

function frisch(ip: string, jetzt: number): number[] {
  return (fehlversuche.get(ip) ?? []).filter((t) => jetzt - t < FENSTER_MS);
}

/** Haelt die Map klein. Wer nach dem Fenster nie wiederkommt, faellt heraus. */
function aufraeumen(jetzt: number): void {
  if (fehlversuche.size < 1000) return;
  // Ueber die Schluessel statt ueber die Map: Das Projekt zielt auf es5, und
  // eine Map laesst sich dort nicht direkt durchlaufen.
  for (const ip of Array.from(fehlversuche.keys())) {
    if (frisch(ip, jetzt).length === 0) fehlversuche.delete(ip);
  }
}

/** Darf diese IP gerade einen Versuch machen? Veraendert nichts. */
export function loginErlaubt(ip: string, jetzt = Date.now()): boolean {
  aufraeumen(jetzt);
  return frisch(ip, jetzt).length < MAX_FEHLVERSUCHE;
}

/** Nach einem falschen Passwort aufrufen. Gelungene Anmeldungen zaehlen nicht. */
export function loginGescheitert(ip: string, jetzt = Date.now()): void {
  const liste = frisch(ip, jetzt);
  liste.push(jetzt);
  fehlversuche.set(ip, liste);
}

/** Fuer Tests. */
export function bremseLeeren(): void {
  fehlversuche.clear();
}
