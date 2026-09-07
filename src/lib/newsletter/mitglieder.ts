/**
 * Liest den Verteiler fuer die Auswertung im internen Bereich.
 *
 * Nach demselben Muster wie der Stripe-Abruf: nur lesend, mit Frist, kurzem
 * Zwischenspeicher und Demodaten, wenn der Zugang fehlt. Die Mitglieder
 * kommen ueber die Mailgun-REST-Schnittstelle, nicht ueber die Bibliothek,
 * weil wir hier nur eine Liste blaettern und nichts weiter brauchen.
 *
 * Die Zeitpunkte stammen aus den Zusatzfeldern, die die Bestaetigungsseite
 * beim Eintragen setzt (siehe store.ts). Ein Mitglied, das jemand von Hand
 * in Mailgun angelegt hat, traegt sie nicht und erscheint deshalb ohne
 * Datum. Das ist Absicht, ein erfundenes Datum waere schlimmer.
 */

import { mailClient } from "@/lib/mailgun";

import { listeKonfiguriert } from "./store";

export interface Mitglied {
  email: string;
  /** false, wenn abgemeldet. Mailgun behaelt Abgemeldete in der Liste. */
  subscribed: boolean;
  locale?: "de" | "en";
  /** Zeitpunkt der Bestaetigung in Sekunden seit 1970, falls bekannt. */
  bestaetigtAm?: number;
}

export interface MitgliederErgebnis {
  mitglieder: Mitglied[];
  /** true, wenn die Daten erfunden sind, weil kein Zugang vorliegt. */
  demo: boolean;
  error?: string;
  /** false, wenn die Obergrenze griff und Mitglieder fehlen. */
  vollstaendig: boolean;
}

/* ── Abruf ──────────────────────────────────────────────────────────── */

const BASIS = "https://api.eu.mailgun.net/v3";
const MAX_MITGLIEDER = 20_000;

interface MailgunMitglied {
  address: string;
  subscribed: boolean;
  vars?: Record<string, unknown> | null;
}

interface MailgunSeite {
  items: MailgunMitglied[];
  paging?: { next?: string };
}

function zuMitglied(m: MailgunMitglied): Mitglied {
  const vars = m.vars ?? {};
  const locale = vars.locale === "en" ? "en" : vars.locale === "de" ? "de" : undefined;
  const roh = typeof vars.bestaetigt_am === "string" ? Date.parse(vars.bestaetigt_am) : NaN;
  return {
    email: m.address,
    subscribed: m.subscribed,
    locale,
    bestaetigtAm: Number.isFinite(roh) ? Math.floor(roh / 1000) : undefined,
  };
}

async function seiteLaden(url: string, key: string): Promise<MailgunSeite> {
  const res = await fetch(url, {
    headers: { Authorization: `Basic ${Buffer.from(`api:${key}`).toString("base64")}` },
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });
  const body = (await res.json()) as MailgunSeite & { message?: string };
  if (!res.ok) throw new Error(body?.message ?? `Mailgun antwortete mit ${res.status}`);
  return body;
}

async function alleLaden(liste: string, key: string): Promise<{ items: Mitglied[]; vollstaendig: boolean }> {
  const out: Mitglied[] = [];
  let url: string | undefined = `${BASIS}/lists/${encodeURIComponent(liste)}/members/pages?limit=100`;

  while (url && out.length < MAX_MITGLIEDER) {
    const seite: MailgunSeite = await seiteLaden(url, key);
    if (!seite.items?.length) break;
    out.push(...seite.items.map(zuMitglied));
    // Mailgun liefert die naechste Seite als vollstaendige Adresse. Ist sie
    // gleich der aktuellen, sind wir am Ende, sonst liefe das endlos.
    url = seite.paging?.next && seite.paging.next !== url ? seite.paging.next : undefined;
  }

  return { items: out, vollstaendig: out.length < MAX_MITGLIEDER };
}

/* ── Zwischenspeicher ───────────────────────────────────────────────── */

const CACHE_DAUER_MS = 120_000;
let cache: { um: number; ergebnis: MitgliederErgebnis } | null = null;

/** Fuer Tests. */
export function mitgliederCacheLeeren(): void {
  cache = null;
}

export async function loadMitglieder(): Promise<MitgliederErgebnis> {
  const liste = process.env.MAILGUN_NEWSLETTER_LIST?.trim();
  const mail = mailClient();
  if (!liste || !mail || !listeKonfiguriert()) {
    return { mitglieder: demoMitglieder(), demo: true, vollstaendig: true };
  }

  if (cache && Date.now() - cache.um < CACHE_DAUER_MS) return cache.ergebnis;

  try {
    const key = process.env.MAILGUN_API_KEY!.trim();
    const { items, vollstaendig } = await alleLaden(liste, key);
    const ergebnis: MitgliederErgebnis = { mitglieder: items, demo: false, vollstaendig };
    cache = { um: Date.now(), ergebnis };
    return ergebnis;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Mailgun war nicht erreichbar";
    return { mitglieder: demoMitglieder(), demo: true, error: msg, vollstaendig: true };
  }
}

/* ── Demodaten ──────────────────────────────────────────────────────── */

/**
 * Erfundene Anmeldungen, damit die Seite ohne Zugang zeigt, wie sie mit
 * Daten aussieht. Wiederholbar, damit sich Aenderungen von Zufall
 * unterscheiden lassen. Enthaelt bewusst Abgemeldete und Eintraege ohne
 * Datum, weil beides im Betrieb vorkommt.
 */
export function demoMitglieder(jetzt: number = Math.floor(Date.now() / 1000)): Mitglied[] {
  let s = 20260901 >>> 0;
  const zufall = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };

  const out: Mitglied[] = [];
  const spanne = 45 * 86400;
  for (let i = 0; i < 138; i++) {
    // Juengere Anmeldungen haeufiger: Der Verteiler faengt gerade an zu wachsen.
    const alter = Math.floor(spanne * Math.pow(zufall(), 1.6));
    out.push({
      email: `gast${String(i).padStart(3, "0")}@beispiel.de`,
      subscribed: zufall() > 0.06,
      locale: zufall() > 0.22 ? "de" : "en",
      bestaetigtAm: jetzt - alter,
    });
  }
  // Zwei von Hand eingetragene, ohne Datum.
  out.push({ email: "team@beispiel.de", subscribed: true });
  out.push({ email: "presse@beispiel.de", subscribed: true, locale: "de" });
  return out;
}
