import FormData from "form-data";
import Mailgun from "mailgun.js";

/**
 * SERVER ONLY. Mailgun-Client, der erst beim Aufruf gebaut wird.
 *
 * Auf Modulebene wirft mailgun.client() ohne Key sofort ("Parameter \"key\" is
 * required"). Da Next beim Build die Route-Module importiert, hat das nicht nur
 * eine leere 500 zur Laufzeit erzeugt, sondern den gesamten Produktionsbuild
 * abgebrochen, sobald MAILGUN_API_KEY fehlte. Deshalb hier lazy und mit
 * ausdrücklichem null-Fall.
 */
export function mailClient() {
  const key = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  if (!key || !domain) return null;
  return {
    mg: new Mailgun(FormData).client({ username: "api", key, url: "https://api.eu.mailgun.net" }),
    domain,
  };
}

/** Einheitliche Antwort, wenn der Versand nicht konfiguriert ist. */
export const MAIL_NOT_CONFIGURED = {
  error: "Mailversand ist nicht konfiguriert (MAILGUN_API_KEY / MAILGUN_DOMAIN fehlen).",
} as const;
