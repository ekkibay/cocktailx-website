# Cocktail X Website

Marketingseite von Cocktail X (bayundco GmbH, München). Next.js 14, Tailwind,
zweisprachig DE/EN über `{de, en}`-Objekte und `pick()` aus `src/i18n/bilingual.ts`.
Deploy über Vercel bei jedem Push auf `main`. Zugang zu Vercel hat nur Patrick.

Stand: 12. Oktober 2026.

## Was die Seite gerade verkauft

**COCKTAIL X ON ICE '26**, 17. bis 28. November 2026, 12 Nächte, "40+" Bars.
Early Bird 39 € bis 15.10., danach 49 €. Der Shop selbst läuft auf
`cocktailx.app` (eigene Codebasis, Railway), diese Seite verlinkt nur dorthin.

Das Sommerfestival 2026 ist vorbei. Die Sommer-Seiten (`/festival`, `/shop`,
`/awards`) leiten auf die Startseite um und liegen auf dem Branch
`summer-26-archive`. Der nächste Sommer ist 2027, Termin offen.

## Wo was liegt

- `src/config/pricing.ts`: **einzige Preisquelle.** Preise, Fristen,
  Kontingente, Checkout-Ziele. Nie einen Preis oder ein Datum in eine
  Komponente tippen.
- `src/config/onice.ts`: Inhalte der Startseite: `BARS`, `FAQ`, `TRAILS`,
  `CHAPTERS`, `HOW_IT_WORKS`.
- `src/app/[locale]/page.tsx`: die Startseite (ON ICE).
- `src/app/intern/*`: interner Bereich (Verkauf, Kunden, Support, Newsletter),
  liest Stripe über `STRIPE_SECRET_KEY`. Ohne Schlüssel laufen Demodaten.
- `docs/ticketshop-onice.md`: Preis- und Codestruktur, Übergabe ans Shop-Team.
- `docs/betrieb.md`: Betrieb, Umgebungsvariablen, Health-Endpunkt.

## Regeln

- Öffentlich steht nie ein Preis unter 39 €. Der Referenzpreis 49 € wird
  öffentlich nie unterboten. Code-Preise bleiben serverseitig.
- Der Signature Drink kostet 6 € an der Bar und ist **nicht** im Pass
  enthalten. Kein Text darf ihn als inklusive ausweisen.
- Eine Bar wird erst genannt, wenn ihre Vereinbarung für ON ICE
  unterschrieben ist. Die Gesamtzahl bleibt öffentlich "40+".
- Keine erfundenen Zahlen: kein Zähler, der ohne echte Verkäufe sinkt, kein
  Streichpreis ohne echten Vergleichswert.
- Vor dem Commit `npm run check` (Lint, Typecheck, Tests).

## Bar-Reveal (laufend)

Vincent hat am 12.10. eine Liste von 37 Bars übergeben, die unterschrieben
haben. Die ersten 20 stehen in `BARS` und auf der Startseite, mit Bildern aus
dem Sommer-Material in `public/images/bars/` (quadratisch, schwarzweiß, Logo
im Bild). Neue Bars werden einfach an `BARS` angehängt, die Texte zählen mit.

Noch nicht veröffentlicht, Bildmaterial vorhanden: Ruby Rosi, Salon Irkutsk,
Juliet Rose Bar, die Krake, Mister B's, Terra, Boilerman Bar, PERLE Bar,
RELAX - Food, Drinks & You, Graf Rumford, Wallace Bar, Jaadin, Vega Bar.

Noch nicht veröffentlicht, **kein** Bildmaterial: Ibasho, F32, Campana,
Vice and Soul.

## Offene Punkte

- Schreibweise "Simsalbim Bar" (Liste) oder "Sim Salabim" (Logo)?
- "Komm zu zweit, geh zu fünft weiter" steht auf der Startseite doppelt
  (Kurz erklärt und Community-Banner). Vorschlag: nur im Banner behalten.
- Preiserhöhung von Datum auf Stückzahl umstellen: Vincent will "noch N
  Pässe zu 39 €" statt "bis 15.10.". Plan: echtes Kontingent in
  `pricing.ts`, Restzahl aus Stripe (`loadSales` + `filterOnIce`), Crew Pass
  zählt als 4, Datumsgrenze als zweite Bedingung, solange der Shop nach Datum
  umschaltet. Ohne Stripe-Schlüssel nur Preis, kein Zähler. Offen: Größe des
  Kontingents, ob `STRIPE_SECRET_KEY` bei Vercel in Production gesetzt ist
  (Patrick), und das Shop-Team muss dieselbe Regel übernehmen.
- Alte Reveal-Texte zu "1. September" sind entfernt. Es gibt kein festes
  Reveal-Datum mehr, die Formulierung ist "laufend".
