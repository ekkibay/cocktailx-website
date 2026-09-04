/**
 * Bremse fuer den Anmeldeendpunkt.
 *
 * Der Endpunkt verschickt auf Zuruf Mails an beliebige Adressen. Ohne Bremse
 * laesst sich damit eine fremde Adresse zuschuetten, und unsere Domain ist
 * danach als Absender verbrannt. Der Schaden faellt also auf uns zurueck,
 * nicht nur auf das Opfer.
 *
 * Bewusst einfach und im Arbeitsspeicher: Das haelt einen Wisch aus einem
 * Skript auf, ohne dass eine weitere Abhaengigkeit dazukommt. Gegen einen
 * verteilten Angriff hilft es nicht, dafuer waere der Schutz des Hosters
 * zustaendig.
 */

const FENSTER_MS = 60 * 60 * 1000;
const MAX_JE_IP = 5;
const MAX_JE_ADRESSE = 2;

const treffer = new Map<string, number[]>();

function zaehlen(schluessel: string, max: number, jetzt: number): boolean {
  const bisher = (treffer.get(schluessel) ?? []).filter((t) => jetzt - t < FENSTER_MS);
  if (bisher.length >= max) {
    treffer.set(schluessel, bisher);
    return false;
  }
  bisher.push(jetzt);
  treffer.set(schluessel, bisher);
  return true;
}

/** Haelt die Map klein, damit sie nicht unbegrenzt waechst. */
function aufraeumen(jetzt: number): void {
  if (treffer.size < 5000) return;
  // Ueber die Schluessel statt ueber die Map: Das Projekt zielt auf es5, und
  // eine Map laesst sich dort nicht direkt durchlaufen.
  for (const k of Array.from(treffer.keys())) {
    const v = treffer.get(k) ?? [];
    if (v.every((t: number) => jetzt - t >= FENSTER_MS)) treffer.delete(k);
  }
}

export function darfAnmelden(ip: string, email: string, jetzt = Date.now()): boolean {
  aufraeumen(jetzt);
  // Beide Grenzen muessen halten, aber die Adresse zuerst pruefen waere
  // falsch: Dann kaeme ein Angreifer mit wechselnden Adressen durch.
  const ipOk = zaehlen(`ip:${ip}`, MAX_JE_IP, jetzt);
  const mailOk = zaehlen(`mail:${email}`, MAX_JE_ADRESSE, jetzt);
  return ipOk && mailOk;
}

/** Fuer Tests. */
export function bremseLeeren(): void {
  treffer.clear();
}
