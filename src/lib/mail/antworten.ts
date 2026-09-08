/**
 * Antwortentwuerfe fuer den Support, fertig zum Einfuegen.
 *
 * Kein Sprachmodell, sondern Vorlagen je Fall: Die haeufigen Fragen sind
 * immer dieselben, und die Antwort haengt weniger vom Wortlaut der Mail ab
 * als davon, was Stripe ueber den Absender weiss. Wer nichts bezahlt hat,
 * bekommt eine andere Antwort auf "Wo ist meine Bestaetigung" als wer
 * bezahlt hat. Der Entwurf wird gelesen und angepasst, bevor er rausgeht,
 * er muss also stimmen, aber nicht jede Nuance treffen.
 *
 * Preise, Daten und Adressen kommen aus src/config/pricing.ts. Hier steht
 * keine Zahl fest, damit der Wechsel auf den regulaeren Preis die Entwuerfe
 * automatisch mitzieht.
 *
 * Sprachregeln fuer alle Vorlagen: Du-Form, keine Gedankenstriche, kein
 * Preis unter der oeffentlichen Untergrenze, keine Barnamen, keine
 * Reservierungszusagen, zu den Weihnachtsmaerkten nur "in Laufweite der
 * Maerkte, nach Marktschluss".
 */

import {
  CHECKOUT,
  CONTACT_EMAIL,
  CORPORATE_SIZES,
  CREW_PAID,
  CREW_SIZE,
  DOUBLE_SEASON_PRICE,
  EARLY_UNTIL_LABEL,
  EARLY_UNTIL_LABEL_EN,
  EVENT,
  TIERS,
  currentTier,
} from "@/config/pricing";
import type { Locale } from "@/i18n/bilingual";

import type { KaufKontext } from "./kontext";
import type { Kategorie } from "./triage";
import type { SupportMail } from "./types";

/* Dieselbe Adresse wie metadataBase in src/app/[locale]/layout.tsx. Fest
   statt aus der Umgebung, damit der Entwurf im Test und auf dem Server
   gleich aussieht. */
const SEITE = "https://cocktail-x.com";

const UNTERSCHRIFT = { de: "Liebe Grüße\nDein COCKTAIL X Team", en: "Cheers,\nYour COCKTAIL X Team" };

export type Einordnung = KaufKontext["einordnung"];

export type Variante =
  | "ticket-bezahlt"
  | "ticket-keinKauf"
  | "zahlung-fehlgeschlagen"
  | "zahlung-erstattet"
  | "zahlung-bezahlt"
  | "presse"
  | "partner"
  | "gruppe"
  | "sonstiges";

export const VARIANTEN: Variante[] = [
  "ticket-bezahlt",
  "ticket-keinKauf",
  "zahlung-fehlgeschlagen",
  "zahlung-erstattet",
  "zahlung-bezahlt",
  "presse",
  "partner",
  "gruppe",
  "sonstiges",
];

export interface AntwortEingabe {
  mail: Pick<SupportMail, "subject" | "preview" | "from">;
  kategorie: Kategorie;
  kontext?: Pick<KaufKontext, "einordnung">;
  /** Ohne Angabe wird die Sprache aus Betreff und Vorschau geraten. */
  locale?: Locale;
  /** Millisekunden seit 1970, fuer den Preis von heute. Nur Tests setzen das. */
  jetzt?: number;
}

export interface Antwort {
  betreff: string;
  text: string;
  locale: Locale;
  variante: Variante;
}

/* ── Sprache ─────────────────────────────────────────────────────────── */

/* Fuellwoerter, die in der jeweils anderen Sprache nicht vorkommen. Bewusst
   fehlen "was", "will", "an", "in", "die", die beide Sprachen kennen. */
const ENGLISCH = new Set([
  "the", "and", "is", "are", "you", "your", "my", "i", "we", "our", "to", "of", "for", "it", "this",
  "that", "with", "have", "has", "do", "does", "can", "could", "would", "please", "hi", "hello",
  "thanks", "thank", "not", "but", "me", "be", "at", "from", "got", "get", "when", "how", "what",
  "where", "if", "any", "a", "were", "just", "still", "yet", "about", "or", "did", "was", "there",
]);
const DEUTSCH = new Set([
  "der", "die", "das", "und", "ist", "sind", "ich", "wir", "ihr", "du", "mein", "meine", "meinen",
  "unser", "unsere", "euer", "eure", "nicht", "ein", "eine", "einen", "zu", "für", "mit", "auf",
  "aber", "oder", "wann", "wie", "wo", "ob", "habe", "haben", "hat", "kann", "können", "könnt",
  "bitte", "hallo", "danke", "grüße", "viele", "noch", "schon", "auch", "bei", "von", "im", "am",
  "dass", "wenn", "ja", "nein", "gerne", "würde", "würden", "es", "sich", "sie", "doch", "dann",
  "nochmal", "vorhin", "uns", "euch", "mir", "mich", "gibt", "muss", "dürfen", "wurde",
]);

/**
 * Englisch, wenn mehr englische als deutsche Fuellwoerter vorkommen. Bei
 * Gleichstand Deutsch, weil das Postfach deutsch ist und ein deutscher
 * Entwurf an einen englischen Gast weniger schadet als umgekehrt.
 */
export function erkenneSprache(mail: Pick<SupportMail, "subject" | "preview">): Locale {
  const woerter = `${mail.subject} ${mail.preview}`.toLowerCase().split(/[^a-zäöüß']+/);
  let en = 0;
  let de = 0;
  for (const w of woerter) {
    if (ENGLISCH.has(w)) en += 1;
    else if (DEUTSCH.has(w)) de += 1;
  }
  return en > de ? "en" : "de";
}

/* ── Variante ────────────────────────────────────────────────────────── */

/**
 * Welche Vorlage passt zu Kategorie und Kaufkontext?
 *
 * Eine Ticketfrage von jemandem mit gescheiterter Zahlung bekommt die
 * Zahlungsantwort: Die Frage "Wo ist mein Pass" hat dann die Antwort "Deine
 * Zahlung ging nicht durch", alles andere waere am Thema vorbei.
 */
export function varianteFuer(kategorie: Kategorie, einordnung: Einordnung = "kein Kauf"): Variante {
  switch (kategorie) {
    case "zahlung":
      if (einordnung === "fehlgeschlagen") return "zahlung-fehlgeschlagen";
      if (einordnung === "erstattet" || einordnung === "teilweise erstattet") return "zahlung-erstattet";
      return "zahlung-bezahlt";
    case "ticket":
      if (einordnung === "fehlgeschlagen") return "zahlung-fehlgeschlagen";
      if (einordnung === "bezahlt" || einordnung === "teilweise erstattet") return "ticket-bezahlt";
      return "ticket-keinKauf";
    default:
      return kategorie;
  }
}

/* ── Bausteine ───────────────────────────────────────────────────────── */

/* Absendernamen, hinter denen keine Person steht. "Hallo Redaktion," klingt
   nach Formular, "Hallo," nicht. */
const ORGANISATION =
  /(^|[^a-zäöüß])(redaktion|team|gmbh|ug|ag|kg|agentur|magazin|verlag|presse|office|marketing|info|kontakt|support|studio|media|newsletter|noreply|no-reply)(?![a-zäöüß])/;

function anrede(name: string | undefined, locale: Locale): string {
  const gruss = locale === "en" ? "Hi" : "Hallo";
  const roh = (name ?? "").trim();
  if (!roh || ORGANISATION.test(roh.toLowerCase())) return `${gruss},`;

  // Outlook liefert Namen auch als "Winter, Mia". Dann steht der Vorname
  // hinter dem Komma.
  const vorne = roh.includes(",") ? roh.split(",")[1].trim() : roh;
  const vorname = vorne.split(/\s+/)[0].replace(/^["']|["']$/g, "");
  const brauchbar = vorname.length >= 2 && !/[\d@.]/.test(vorname);
  return brauchbar ? `${gruss} ${vorname},` : `${gruss},`;
}

function betreffFuer(subject: string, locale: Locale): string {
  const s = subject.trim();
  if (!s || s === "(ohne Betreff)") {
    return locale === "en" ? `Your message to ${EVENT.name}` : `Deine Nachricht an ${EVENT.name}`;
  }
  return /^(re|aw|wg|fw|fwd):/i.test(s) ? s : `Re: ${s}`;
}

interface Daten {
  locale: Locale;
  keinKauf: boolean;
  jetzt: number;
}

/** "Bis zum 15. Oktober 2026 kostet er 39 € (Early Bird), danach 49 €." */
function preissatz(d: Daten): string {
  const early = TIERS.early.price;
  const full = TIERS.full.price;
  if (currentTier(d.jetzt) === "early") {
    return d.locale === "en"
      ? `Until ${EARLY_UNTIL_LABEL_EN} it costs ${early} € (${TIERS.early.labelEn}), after that ${full} €.`
      : `Bis zum ${EARLY_UNTIL_LABEL} kostet er ${early} € (${TIERS.early.label}), danach ${full} €.`;
  }
  return d.locale === "en" ? `It costs ${full} €.` : `Er kostet ${full} €.`;
}

function eckdaten(locale: Locale): string {
  return locale === "en"
    ? `${EVENT.dateLabelEn}, ${EVENT.cityEn}, ${EVENT.nights} nights, ${EVENT.barsLabel} bars`
    : `${EVENT.dateLabel}, ${EVENT.city}, ${EVENT.nights} Nächte, ${EVENT.barsLabel} Bars`;
}

/* Zu den Maerkten gibt es genau eine Formulierung. Der Satz kommt nur dazu,
   wenn der Absender die Maerkte anspricht, sonst irritiert er. */
const MAERKTE = {
  de: "Zu den Weihnachtsmärkten: Unsere Bars liegen in Laufweite der Märkte, nach Marktschluss geht der Abend bei uns weiter.",
  en: "About the Christmas markets: our bars are within walking distance of the markets, open once the markets close.",
};

/* ── Vorlagen ────────────────────────────────────────────────────────── */

type Vorlage = (d: Daten) => string[];

const VORLAGEN: Record<Variante, Record<Locale, Vorlage>> = {
  "ticket-bezahlt": {
    de: () => [
      `danke für deine Nachricht. Dein Pass für ${EVENT.name} ist bei uns bezahlt hinterlegt, alles gut.`,
      "Die Bestätigung ging an diese Adresse raus. Falls du sie nicht findest, schau bitte einmal in den Spam-Ordner. Sonst schicken wir sie dir gern noch einmal, sag einfach kurz Bescheid.",
      `Die App ist dein Pass und läuft im Browser, du musst nichts installieren. Nach dem Login liegt dein Pass dort, in der Bar scannst du den QR-Code. Der Pass gilt an allen ${EVENT.nights} Nächten vom ${EVENT.dateLabel} in ${EVENT.city}. Reservieren musst du nichts, und eine Route legst du auch nicht vorab fest: Die App schlägt dir Trails vor, wechseln kannst du jederzeit.`,
    ],
    en: () => [
      `thanks for your message. Your pass for ${EVENT.name} is paid and stored with us, all good.`,
      "The confirmation went to this address. If you cannot find it, please check your spam folder. Otherwise we are happy to send it again, just let us know.",
      `The app is your pass and runs in the browser, there is nothing to install. After signing in your pass is waiting there, and at the bar you scan the QR code. The pass is valid on all ${EVENT.nights} nights from ${EVENT.dateLabelEn} in ${EVENT.cityEn}. You do not need to book anything, and you do not pick a route in advance either: the app suggests trails, and you can switch whenever you like.`,
    ],
  },

  "ticket-keinKauf": {
    de: (d) => [
      "danke für deine Nachricht und schön, dass du dabei sein willst.",
      `Unter dieser Mailadresse finden wir noch keinen Kauf. Den Pass für ${EVENT.name} bekommst du hier: ${CHECKOUT.single}. ${preissatz(d)} Der Pass gilt an allen ${EVENT.nights} Nächten vom ${EVENT.dateLabel} in ${EVENT.city}, in jeder teilnehmenden Bar schaltest du einen Signature Drink frei.`,
      `Außerdem gibt es den Crew Pass mit ${CREW_SIZE} Pässen zum Preis von ${CREW_PAID} und Double Season mit ON ICE plus Sommerfestival 2027 für ${DOUBLE_SEASON_PRICE} €. Jeder Pass gilt für eine Person.`,
      "Nach dem Kauf kommt die Bestätigung per Mail, und die App ist dein Pass, ganz ohne Installation. Falls du über eine andere Adresse gekauft hast, schreib uns kurz, dann suchen wir den Kauf.",
    ],
    en: (d) => [
      "thanks for your message, great that you want to join.",
      `We cannot find a purchase under this email address yet. You can get your pass for ${EVENT.name} here: ${CHECKOUT.single}. ${preissatz(d)} The pass is valid on all ${EVENT.nights} nights from ${EVENT.dateLabelEn} in ${EVENT.cityEn}, and in every participating bar you unlock one signature drink.`,
      `There is also the Crew Pass with ${CREW_SIZE} passes for the price of ${CREW_PAID}, and Double Season with ON ICE plus the summer festival 2027 for ${DOUBLE_SEASON_PRICE} €. Every pass is valid for one person.`,
      "After the purchase the confirmation arrives by email, and the app is your pass, nothing to install. If you bought with a different address, drop us a line and we will find the purchase.",
    ],
  },

  "zahlung-fehlgeschlagen": {
    de: (d) => [
      "danke für deine Nachricht, und keine Sorge: Deine Zahlung ist bei uns nicht durchgegangen, es wurde nichts abgebucht. Deshalb gab es auch keine Bestätigung.",
      `Du kannst den Kauf einfach noch einmal starten, doppelt zahlst du dabei nicht: ${CHECKOUT.single}. Falls es wieder hakt, hilft oft eine andere Zahlungsart oder ein anderer Browser. ${preissatz(d)}`,
      "Sobald der Kauf durch ist, kommt die Bestätigung per Mail und dein Pass liegt in der App.",
    ],
    en: (d) => [
      "thanks for your message, and no worries: your payment did not go through on our side, nothing was charged. That is also why there was no confirmation.",
      `You can simply start the purchase again, you will not be charged twice: ${CHECKOUT.single}. If it fails again, a different payment method or another browser usually helps. ${preissatz(d)}`,
      "As soon as the purchase is complete, the confirmation arrives by email and your pass is waiting in the app.",
    ],
  },

  "zahlung-erstattet": {
    de: () => [
      "danke für deine Nachricht. Deine Erstattung ist bei uns ausgelöst und unterwegs.",
      "Bis das Geld auf deiner Karte oder deinem Konto sichtbar ist, dauert es je nach Bank 5 bis 10 Bankarbeitstage. Der Betrag erscheint meist als Rückbuchung der ursprünglichen Zahlung, nicht als neue Gutschrift.",
      "Falls nach 10 Bankarbeitstagen noch nichts angekommen ist, melde dich bitte kurz, dann fragen wir bei der Bank nach.",
    ],
    en: () => [
      "thanks for your message. Your refund has been issued on our side and is on its way.",
      "Depending on your bank it takes 5 to 10 banking days until the money shows up on your card or account. It usually appears as a reversal of the original payment rather than as a new credit.",
      "If nothing has arrived after 10 banking days, please let us know and we will check with the bank.",
    ],
  },

  "zahlung-bezahlt": {
    de: (d) => [
      "danke für deine Nachricht, wir schauen uns das an.",
      `Damit wir die Zahlung sicher zuordnen können, brauchen wir von dir kurz: das Datum der Zahlung, den Betrag und die letzten vier Ziffern der Karte oder die verwendete Zahlungsart.${
        d.keinKauf ? " Unter dieser Mailadresse finden wir aktuell keinen Kauf, vielleicht lief er über eine andere Adresse?" : ""
      }`,
      "Sobald wir das haben, melden wir uns mit einer Antwort. Sollte etwas doppelt gelaufen sein, erstatten wir das selbstverständlich.",
    ],
    en: (d) => [
      "thanks for your message, we are looking into it.",
      `So we can match the payment for sure, please send us: the date of the payment, the amount, and the last four digits of the card or the payment method you used.${
        d.keinKauf ? " Under this email address we currently find no purchase, maybe it went through a different address?" : ""
      }`,
      "As soon as we have that, we will get back to you. Should anything have been charged twice, we will of course refund it.",
    ],
  },

  presse: {
    de: () => [
      `danke für dein Interesse an ${EVENT.name}, das freut uns sehr.`,
      `Presseanfragen, Akkreditierungen und Bildmaterial laufen über ${CONTACT_EMAIL}, du bist hier also richtig. Aktuelle Informationen und Material zum Download findest du im Pressebereich unter ${SEITE}/de/presse. ${EVENT.name}: ${eckdaten("de")}.`,
      "Wir melden uns in den nächsten Tagen mit den Details zu deiner Anfrage.",
    ],
    en: () => [
      `thanks for your interest in ${EVENT.name}, we are delighted.`,
      `Press requests, accreditations and image material all go through ${CONTACT_EMAIL}, so you are in the right place. Current information and downloads are in our press area at ${SEITE}/en/presse. ${EVENT.name}: ${eckdaten("en")}.`,
      "We will get back to you with the details on your request in the next few days.",
    ],
  },

  partner: {
    de: () => [
      `danke für deine Nachricht und das Interesse an ${EVENT.name}.`,
      "Wir freuen uns über jede Bar und jeden Partner, der ON ICE mitgestalten will. Damit wir dich richtig einordnen können, schick uns gern kurz: wer ihr seid, wo ihr seid und was du dir vorstellst. Wir melden uns dann persönlich bei dir.",
      `Das Line-up veröffentlichen wir schrittweise ab dem ${EVENT.barsRevealLabel}. Namen nennen wir erst, wenn die Vereinbarungen unterschrieben sind.`,
    ],
    en: () => [
      `thanks for your message and your interest in ${EVENT.name}.`,
      "We are happy about every bar and every partner who wants to shape ON ICE with us. So we can place your request properly, please send us a few lines: who you are, where you are, and what you have in mind. We will then get back to you personally.",
      `We publish the line-up step by step from ${EVENT.barsRevealLabelEn}. We do not name anyone before the agreements are signed.`,
    ],
  },

  gruppe: {
    de: () => [
      "danke für deine Nachricht, ON ICE mit dem Team ist eine gute Idee.",
      `Dafür gibt es Team Nights: ${CORPORATE_SIZES.join(", ")} Pässe, eine Sammelrechnung auf die Firma zum jeweils regulären Preis von ${TIERS.full.price} € pro Pass, und eine persönliche Ansprechpartnerin. Alles dazu steht unter ${SEITE}/de/corporate.`,
      `Schick uns einfach die gewünschte Anzahl an Pässen und die Rechnungsadresse an ${CONTACT_EMAIL}, dann bekommst du von uns ein Angebot.`,
    ],
    en: () => [
      "thanks for your message, ON ICE with the team is a great idea.",
      `That is what Team Nights are for: ${CORPORATE_SIZES.join(", ")} passes, a single invoice to the company at the regular price of ${TIERS.full.price} € per pass, and a named contact person. Everything about it is at ${SEITE}/en/corporate.`,
      `Just send us the number of passes you need and the billing address to ${CONTACT_EMAIL}, and we will send you an offer.`,
    ],
  },

  sonstiges: {
    de: () => [
      "danke für deine Nachricht.",
      "Wir haben sie bekommen und melden uns so schnell wie möglich persönlich bei dir. Falls es um deinen Pass oder eine Zahlung geht, helfen uns die Mailadresse, mit der du gekauft hast, und das Datum des Kaufs.",
      `${EVENT.name}: ${eckdaten("de")}. Antworten auf die häufigsten Fragen findest du unter ${SEITE}/de.`,
    ],
    en: () => [
      "thanks for your message.",
      "We have received it and will get back to you personally as soon as possible. If it is about your pass or a payment, the email address you used for the purchase and the date of the purchase help us a lot.",
      `${EVENT.name}: ${eckdaten("en")}. Answers to the most common questions are at ${SEITE}/en.`,
    ],
  },
};

/* ── Zusammenbau ─────────────────────────────────────────────────────── */

export function antwortVorschlag(eingabe: AntwortEingabe): Antwort {
  const locale = eingabe.locale ?? erkenneSprache(eingabe.mail);
  const einordnung = eingabe.kontext?.einordnung ?? "kein Kauf";
  const variante = varianteFuer(eingabe.kategorie, einordnung);
  const daten: Daten = { locale, keinKauf: einordnung === "kein Kauf", jetzt: eingabe.jetzt ?? Date.now() };

  const absaetze = VORLAGEN[variante][locale](daten);

  if (/markt|market/.test(`${eingabe.mail.subject} ${eingabe.mail.preview}`.toLowerCase())) {
    absaetze.push(MAERKTE[locale]);
  }

  const text = [anrede(eingabe.mail.from.name, locale), ...absaetze, UNTERSCHRIFT[locale]].join("\n\n");

  return { betreff: betreffFuer(eingabe.mail.subject, locale), text, locale, variante };
}
