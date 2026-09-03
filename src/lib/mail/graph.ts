/**
 * Holt den Posteingang des Support-Postfachs ueber Microsoft Graph.
 *
 * Nur lesend, nur serverseitig, nach demselben Muster wie der Stripe-Abruf:
 * Fehlen die Zugaenge, zeigt die Seite Demodaten und sagt das deutlich,
 * statt mit einem Fehler abzubrechen. Ein Werkzeug, das ohne Zugang gar
 * nichts zeigt, kann man auch nicht einrichten.
 *
 * Benoetigt vier Werte in .env.local, die Einrichtung steht in
 * docs/intern-support-mail.md:
 *
 *   MS_GRAPH_TENANT_ID      Verzeichnis-ID aus der App-Registrierung
 *   MS_GRAPH_CLIENT_ID      Anwendungs-ID aus der App-Registrierung
 *   MS_GRAPH_CLIENT_SECRET  der geheime Clientschluessel
 *   SUPPORT_MAILBOX         das Postfach, etwa info@cocktail-x.com
 */

import { demoMails } from "./demo";
import type { SupportMail } from "./types";

function konfig() {
  const tenant = process.env.MS_GRAPH_TENANT_ID?.trim();
  const client = process.env.MS_GRAPH_CLIENT_ID?.trim();
  const secret = process.env.MS_GRAPH_CLIENT_SECRET?.trim();
  const mailbox = process.env.SUPPORT_MAILBOX?.trim();
  if (!tenant || !client || !secret || !mailbox) return null;
  return { tenant, client, secret, mailbox };
}

export function hasGraph(): boolean {
  return konfig() !== null;
}

/** Das eingestellte Postfach, fuer die Anzeige im Kopf der Seite. */
export function supportMailbox(): string | null {
  return konfig()?.mailbox ?? null;
}

export class GraphError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "GraphError";
    this.status = status;
  }
}

/* Das Token gilt rund eine Stunde. Ohne diesen Speicher holt jeder Aufruf
   der Seite ein neues, und die Anmeldung ist der langsamste Teil. */
let tokenCache: { wert: string; bis: number } | null = null;

async function token(k: NonNullable<ReturnType<typeof konfig>>): Promise<string> {
  const jetzt = Date.now();
  if (tokenCache && tokenCache.bis > jetzt) return tokenCache.wert;

  const res = await fetch(`https://login.microsoftonline.com/${k.tenant}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: k.client,
      client_secret: k.secret,
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials",
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });

  const body = (await res.json()) as {
    access_token?: string;
    expires_in?: number;
    error_description?: string;
  };
  if (!res.ok || !body.access_token) {
    throw new GraphError(body.error_description ?? `Anmeldung antwortete mit ${res.status}`, res.status);
  }

  // Eine Minute frueher verfallen lassen als gemeldet, damit kein Abruf mit
  // einem Token losläuft, das unterwegs ablaeuft.
  tokenCache = { wert: body.access_token, bis: jetzt + ((body.expires_in ?? 3600) - 60) * 1000 };
  return body.access_token;
}

interface GraphMessage {
  id: string;
  subject?: string | null;
  bodyPreview?: string | null;
  receivedDateTime: string;
  isRead: boolean;
  webLink?: string | null;
  from?: { emailAddress?: { name?: string | null; address?: string | null } | null } | null;
}

function toMail(m: GraphMessage): SupportMail {
  return {
    id: m.id,
    from: {
      name: m.from?.emailAddress?.name ?? undefined,
      email: m.from?.emailAddress?.address ?? "",
    },
    subject: m.subject?.trim() || "(ohne Betreff)",
    preview: m.bodyPreview ?? "",
    receivedAt: Math.floor(Date.parse(m.receivedDateTime) / 1000),
    unread: !m.isRead,
    webLink: m.webLink ?? undefined,
  };
}

export interface MailResult {
  mails: SupportMail[];
  /** true, wenn die Mails erfunden sind, weil kein Zugang vorliegt. */
  demo: boolean;
  /** Gesetzt, wenn Microsoft erreichbar war, aber abgelehnt hat. */
  error?: string;
}

export async function loadMails(max = 25): Promise<MailResult> {
  const k = konfig();
  if (!k) return { mails: demoMails(), demo: true };

  try {
    const t = await token(k);
    const url =
      `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(k.mailbox)}` +
      `/mailFolders/inbox/messages` +
      `?$top=${max}` +
      `&$orderby=receivedDateTime desc` +
      `&$select=id,subject,bodyPreview,receivedDateTime,isRead,webLink,from`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${t}` },
      cache: "no-store",
      // Wie beim Stripe-Abruf: Lieber nach 15 Sekunden ein ehrlicher
      // Fehler als eine Seite, die haengt.
      signal: AbortSignal.timeout(15_000),
    });
    const body = (await res.json()) as { value?: GraphMessage[]; error?: { message?: string } };
    if (!res.ok) {
      throw new GraphError(body.error?.message ?? `Graph antwortete mit ${res.status}`, res.status);
    }

    return { mails: (body.value ?? []).map(toMail), demo: false };
  } catch (err) {
    const msg = err instanceof GraphError ? err.message : "Microsoft war nicht erreichbar";
    return { mails: demoMails(), demo: true, error: msg };
  }
}
