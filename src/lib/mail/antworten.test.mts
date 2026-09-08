/**
 * Tests fuer die Antwortentwuerfe.
 *
 * Die Entwuerfe gehen nach kurzem Gegenlesen an Gaeste raus. Was hier
 * geprueft wird, sind deshalb die Regeln, die keiner beim Gegenlesen
 * zuverlaessig sieht: kein Gedankenstrich, kein Sie, kein Preis unter der
 * oeffentlichen Untergrenze, Preis und Frist aus der Konfiguration statt aus
 * dem Gedaechtnis.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  CHECKOUT,
  CONTACT_EMAIL,
  EARLY_UNTIL_LABEL,
  EARLY_UNTIL_LABEL_EN,
  EVENT,
  FULL_PRICE_STARTS_AT,
  TIERS,
} from "@/config/pricing";
import type { Locale } from "@/i18n/bilingual";

import { demoSales } from "../stripe/demo.ts";
import {
  antwortVorschlag,
  erkenneSprache,
  varianteFuer,
  VARIANTEN,
  type Einordnung,
  type Variante,
} from "./antworten.ts";
import { demoMails } from "./demo.ts";
import { kaufKontext } from "./kontext.ts";
import { triage, type Kategorie } from "./triage.ts";

const VOR_UMSTELLUNG = FULL_PRICE_STARTS_AT - 86_400_000;
const NACH_UMSTELLUNG = FULL_PRICE_STARTS_AT + 86_400_000;

/* Welche Kombination aus Kategorie und Kaufkontext welche Vorlage zieht. */
const KOMBI: Record<Variante, { kategorie: Kategorie; einordnung: Einordnung }> = {
  "ticket-bezahlt": { kategorie: "ticket", einordnung: "bezahlt" },
  "ticket-keinKauf": { kategorie: "ticket", einordnung: "kein Kauf" },
  "zahlung-fehlgeschlagen": { kategorie: "zahlung", einordnung: "fehlgeschlagen" },
  "zahlung-erstattet": { kategorie: "zahlung", einordnung: "erstattet" },
  "zahlung-bezahlt": { kategorie: "zahlung", einordnung: "bezahlt" },
  presse: { kategorie: "presse", einordnung: "kein Kauf" },
  partner: { kategorie: "partner", einordnung: "kein Kauf" },
  gruppe: { kategorie: "gruppe", einordnung: "kein Kauf" },
  sonstiges: { kategorie: "sonstiges", einordnung: "kein Kauf" },
};

const ABSENDER = { name: "Mia Winter", email: "mia@beispiel.de" };

function entwurf(
  variante: Variante,
  locale: Locale,
  over: { preview?: string; subject?: string; name?: string; einordnung?: Einordnung; jetzt?: number } = {},
) {
  const k = KOMBI[variante];
  return antwortVorschlag({
    mail: {
      subject: over.subject ?? "Frage",
      preview: over.preview ?? "",
      from: { name: "name" in over ? over.name : ABSENDER.name, email: ABSENDER.email },
    },
    kategorie: k.kategorie,
    kontext: { einordnung: over.einordnung ?? k.einordnung },
    locale,
    jetzt: over.jetzt ?? VOR_UMSTELLUNG,
  });
}

const STRICH = /[–—]/;
const SIE = /(^|[^A-Za-zÄÖÜäöüß])Sie(?![a-zäöüß])/;
const PREIS = /(\d+(?:[.,]\d+)?)\s?(?:€|EUR(?![a-z])|Euro(?![a-z]))/gi;

function pruefeRegeln(text: string, wo: string) {
  assert.ok(!STRICH.test(text), `${wo}: Gedankenstrich`);
  assert.ok(!SIE.test(text), `${wo}: Sie-Form`);
  assert.ok(!text.includes("Sie "), `${wo}: "Sie "`);
  for (const m of Array.from(text.matchAll(PREIS))) {
    const wert = Number(m[1].replace(",", "."));
    assert.ok(wert >= TIERS.early.price, `${wo}: Preis "${m[0]}" unter der Untergrenze`);
  }
}

describe("Antworten: jede Vorlage in beiden Sprachen", () => {
  const sprachen: Locale[] = ["de", "en"];

  for (const variante of VARIANTEN) {
    for (const locale of sprachen) {
      it(`${variante} (${locale}) haelt die Sprachregeln`, () => {
        const a = entwurf(variante, locale);
        assert.equal(a.variante, variante);
        assert.equal(a.locale, locale);
        assert.ok(a.text.length > 100, "zu kurz");
        pruefeRegeln(a.text, `${variante}/${locale}`);
        pruefeRegeln(a.betreff, `${variante}/${locale} Betreff`);
        assert.ok(a.text.includes("COCKTAIL X Team"), "Unterschrift fehlt");
        assert.ok(a.text.startsWith(locale === "en" ? "Hi Mia," : "Hallo Mia,"), a.text.slice(0, 20));
        assert.equal(a.betreff, "Re: Frage");
      });
    }
  }

  it("die Kombinationstabelle deckt varianteFuer", () => {
    for (const variante of VARIANTEN) {
      const k = KOMBI[variante];
      assert.equal(varianteFuer(k.kategorie, k.einordnung), variante);
    }
  });

  it("unterschreibt auf Deutsch mit Dein COCKTAIL X Team", () => {
    assert.ok(entwurf("sonstiges", "de").text.endsWith("Dein COCKTAIL X Team"));
  });
});

describe("Antworten: Variantenwahl", () => {
  it("Ticketfrage mit gescheiterter Zahlung bekommt die Zahlungsantwort", () => {
    assert.equal(varianteFuer("ticket", "fehlgeschlagen"), "zahlung-fehlgeschlagen");
  });
  it("Ticketfrage nach Erstattung bekommt den Kaufweg", () => {
    assert.equal(varianteFuer("ticket", "erstattet"), "ticket-keinKauf");
  });
  it("Ticketfrage bei Teilerstattung gilt als bezahlt", () => {
    assert.equal(varianteFuer("ticket", "teilweise erstattet"), "ticket-bezahlt");
  });
  it("Zahlungsfrage bei Teilerstattung bekommt die Erstattungsantwort", () => {
    assert.equal(varianteFuer("zahlung", "teilweise erstattet"), "zahlung-erstattet");
  });
  it("Zahlungsfrage ohne Kauf wird nachgefragt", () => {
    assert.equal(varianteFuer("zahlung", "kein Kauf"), "zahlung-bezahlt");
  });
  it("Presse, Partner, Gruppe, Sonstiges haengen nicht am Kauf", () => {
    assert.equal(varianteFuer("presse", "bezahlt"), "presse");
    assert.equal(varianteFuer("partner", "fehlgeschlagen"), "partner");
    assert.equal(varianteFuer("gruppe", "erstattet"), "gruppe");
    assert.equal(varianteFuer("sonstiges"), "sonstiges");
  });
});

describe("Antworten: Inhalt der Vorlagen", () => {
  it("Kaufweg nennt vor der Umstellung Early Bird, Frist und beide Preise", () => {
    const de = entwurf("ticket-keinKauf", "de").text;
    assert.ok(de.includes(EARLY_UNTIL_LABEL));
    assert.ok(de.includes(`${TIERS.early.price} €`));
    assert.ok(de.includes(`${TIERS.full.price} €`));
    assert.ok(de.includes(CHECKOUT.single));
    assert.ok(de.includes(EVENT.dateLabel));

    const en = entwurf("ticket-keinKauf", "en").text;
    assert.ok(en.includes(EARLY_UNTIL_LABEL_EN));
    assert.ok(en.includes(`${TIERS.early.price} €`));
    assert.ok(en.includes(EVENT.dateLabelEn));
  });

  it("Kaufweg nennt nach der Umstellung nur noch den regulaeren Preis", () => {
    for (const locale of ["de", "en"] as Locale[]) {
      const text = entwurf("ticket-keinKauf", locale, { jetzt: NACH_UMSTELLUNG }).text;
      assert.ok(!text.includes(EARLY_UNTIL_LABEL) && !text.includes(EARLY_UNTIL_LABEL_EN), locale);
      assert.ok(!text.includes(`${TIERS.early.price} €`), locale);
      assert.ok(text.includes(`${TIERS.full.price} €`), locale);
    }
  });

  it("gescheiterte Zahlung: nichts abgebucht, Kaufweg nochmal", () => {
    assert.ok(entwurf("zahlung-fehlgeschlagen", "de").text.includes("nichts abgebucht"));
    assert.ok(entwurf("zahlung-fehlgeschlagen", "en").text.includes("nothing was charged"));
    assert.ok(entwurf("zahlung-fehlgeschlagen", "de").text.includes(CHECKOUT.single));
  });

  it("Erstattung nennt 5 bis 10 Bankarbeitstage", () => {
    assert.ok(entwurf("zahlung-erstattet", "de").text.includes("5 bis 10 Bankarbeitstage"));
    assert.ok(entwurf("zahlung-erstattet", "en").text.includes("5 to 10 banking days"));
  });

  it("Zahlungsfrage fragt nach Datum und den letzten vier Ziffern", () => {
    const de = entwurf("zahlung-bezahlt", "de").text;
    assert.ok(de.includes("letzten vier Ziffern"));
    assert.ok(!de.includes("andere Adresse"));
    const en = entwurf("zahlung-bezahlt", "en").text;
    assert.ok(en.includes("last four digits"));
  });

  it("Zahlungsfrage ohne Kauf fragt nach einer anderen Adresse", () => {
    assert.ok(entwurf("zahlung-bezahlt", "de", { einordnung: "kein Kauf" }).text.includes("andere Adresse"));
    assert.ok(entwurf("zahlung-bezahlt", "en", { einordnung: "kein Kauf" }).text.includes("different address"));
  });

  it("bezahltes Ticket verweist auf Spam-Ordner und App", () => {
    const de = entwurf("ticket-bezahlt", "de").text;
    assert.ok(de.includes("Spam"));
    assert.ok(de.includes("App"));
    assert.ok(entwurf("ticket-bezahlt", "en").text.includes("spam"));
  });

  it("Presse verweist auf den Pressebereich und die Kontaktadresse", () => {
    const de = entwurf("presse", "de").text;
    assert.ok(de.includes("/de/presse"));
    assert.ok(de.includes(CONTACT_EMAIL));
    assert.ok(entwurf("presse", "en").text.includes("/en/presse"));
  });

  it("Gruppe verweist auf Team Nights und /corporate", () => {
    const de = entwurf("gruppe", "de").text;
    assert.ok(de.includes("Team Nights"));
    assert.ok(de.includes("/de/corporate"));
    assert.ok(de.includes(CONTACT_EMAIL));
    assert.ok(entwurf("gruppe", "en").text.includes("/en/corporate"));
  });

  it("Partner nennt das Reveal-Datum und keine Zusage", () => {
    assert.ok(entwurf("partner", "de").text.includes(EVENT.barsRevealLabel));
    assert.ok(entwurf("partner", "en").text.includes(EVENT.barsRevealLabelEn));
  });

  it("Sonstiges nennt Veranstaltung und Eckdaten", () => {
    const de = entwurf("sonstiges", "de").text;
    assert.ok(de.includes(EVENT.name));
    assert.ok(de.includes(EVENT.dateLabel));
  });
});

describe("Antworten: Weihnachtsmaerkte", () => {
  it("haengt bei Marktfragen die vorgegebene Formulierung an", () => {
    const de = entwurf("ticket-keinKauf", "de", { preview: "Liegt das in der Nähe vom Weihnachtsmarkt?" }).text;
    assert.ok(de.includes("in Laufweite der Märkte, nach Marktschluss"));
    const en = entwurf("ticket-keinKauf", "en", { preview: "Is this near the Christmas market?" }).text;
    assert.ok(en.includes("within walking distance of the markets"));
    pruefeRegeln(de, "Markt de");
    pruefeRegeln(en, "Markt en");
  });

  it("laesst den Satz sonst weg", () => {
    assert.ok(!entwurf("ticket-keinKauf", "de").text.includes("Marktschluss"));
  });
});

describe("Antworten: Sprache", () => {
  it("erkennt Englisch", () => {
    assert.equal(
      erkenneSprache({ subject: "Where is my ticket?", preview: "Hi, I bought a pass but have not received anything." }),
      "en",
    );
  });
  it("erkennt Deutsch", () => {
    assert.equal(
      erkenneSprache({ subject: "Wo ist mein Ticket?", preview: "Hallo, ich habe einen Pass gekauft und nichts bekommen." }),
      "de",
    );
  });
  it("faellt ohne Fuellwoerter und bei Gleichstand auf Deutsch zurueck", () => {
    assert.equal(erkenneSprache({ subject: "", preview: "" }), "de");
    assert.equal(erkenneSprache({ subject: "Ticket", preview: "Double Season" }), "de");
  });
  it("antwortVorschlag raet die Sprache, wenn keine angegeben ist", () => {
    const a = antwortVorschlag({
      mail: {
        subject: "Refund for my ticket",
        preview: "Hi, I would like to get my money back, is that possible?",
        from: { name: "Emma Collins", email: "emma@example.com" },
      },
      kategorie: "zahlung",
      kontext: { einordnung: "erstattet" },
    });
    assert.equal(a.locale, "en");
    assert.ok(a.text.startsWith("Hi Emma,"));
  });
});

describe("Antworten: Anrede und Betreff", () => {
  it("nimmt den Vornamen", () => {
    assert.ok(entwurf("sonstiges", "de", { name: "Mia Winter" }).text.startsWith("Hallo Mia,"));
  });
  it("versteht Nachname, Vorname aus Outlook", () => {
    assert.ok(entwurf("sonstiges", "de", { name: "Winter, Mia" }).text.startsWith("Hallo Mia,"));
  });
  it("laesst den Namen bei Organisationen weg", () => {
    assert.ok(entwurf("presse", "de", { name: "Redaktion Stadtmagazin" }).text.startsWith("Hallo,\n"));
    assert.ok(entwurf("partner", "en", { name: "Marketing Team" }).text.startsWith("Hi,\n"));
  });
  it("laesst den Namen weg, wenn keiner da ist oder er wie eine Adresse aussieht", () => {
    assert.ok(entwurf("sonstiges", "de", { name: undefined }).text.startsWith("Hallo,\n"));
    assert.ok(entwurf("sonstiges", "de", { name: "mia@beispiel.de" }).text.startsWith("Hallo,\n"));
  });
  it("ein Nachname mit ug drin ist keine UG", () => {
    assert.ok(entwurf("sonstiges", "de", { name: "Hans Klug" }).text.startsWith("Hallo Hans,"));
  });
  it("setzt Re: vor den Betreff und laesst vorhandene Praefixe stehen", () => {
    assert.equal(entwurf("sonstiges", "de", { subject: "Meine Frage" }).betreff, "Re: Meine Frage");
    assert.equal(entwurf("sonstiges", "de", { subject: "AW: Meine Frage" }).betreff, "AW: Meine Frage");
    assert.equal(entwurf("sonstiges", "en", { subject: "Re: My question" }).betreff, "Re: My question");
  });
  it("ersetzt einen fehlenden Betreff", () => {
    assert.equal(entwurf("sonstiges", "de", { subject: "(ohne Betreff)" }).betreff, `Deine Nachricht an ${EVENT.name}`);
    assert.equal(entwurf("sonstiges", "en", { subject: "" }).betreff, `Your message to ${EVENT.name}`);
  });
});

describe("Antworten: Demomails", () => {
  const jetzt = 1_790_000_000;
  const sales = demoSales(jetzt - 400 * 86400, jetzt);
  const mails = demoMails(jetzt);

  const fuer = (id: string) => {
    const m = mails.find((m) => m.id === id);
    assert.ok(m, `Demomail ${id} fehlt`);
    const kontext = kaufKontext(sales, m.from.email);
    const t = triage(m, kontext);
    return antwortVorschlag({ mail: m, kategorie: t.kategorie, kontext, jetzt: jetzt * 1000 });
  };

  const erwartet: Array<[string, Variante, Locale]> = [
    ["demo_mail_keine_bestaetigung", "zahlung-fehlgeschlagen", "de"],
    ["demo_mail_erstattung", "zahlung-erstattet", "de"],
    ["demo_mail_double_season", "ticket-keinKauf", "de"],
    ["demo_mail_route", "ticket-bezahlt", "de"],
    ["demo_mail_presse", "presse", "de"],
    ["demo_mail_bar_partner", "partner", "de"],
    ["demo_mail_en_ticket", "ticket-keinKauf", "en"],
  ];

  for (const [id, variante, locale] of erwartet) {
    it(`${id} bekommt ${variante} auf ${locale}`, () => {
      const a = fuer(id);
      assert.equal(a.variante, variante);
      assert.equal(a.locale, locale);
      pruefeRegeln(a.text, id);
      pruefeRegeln(a.betreff, `${id} Betreff`);
    });
  }
});
