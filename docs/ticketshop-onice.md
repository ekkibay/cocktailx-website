# Ticketshop COCKTAIL X ON ICE, Preis- und Codestruktur

Übergabe an das Shop-Team. Stand: 9. August 2026.
Rechnungs- und Vertragsentität: bayundco GmbH.

Der Shop läuft auf `cocktailx.app` als eigenes Next.js auf Railway, also auf
einer anderen Codebasis als diese Marketingseite. Deshalb liegt hier die
Logik als übernehmbares Modul und nicht als fertiger Shop. Was zu tun ist,
steht in Abschnitt 8.

---

## 1. Öffentliche Preise

Genau drei Produkte sind öffentlich sichtbar. Mehr nicht.

| Produkt | bis 15.10.2026 23:59 | ab 16.10.2026 00:00 |
|---|---|---|
| ON ICE PASS | **39 €** (Streichpreis 49 €) | **49 €** |
| CREW PASS, vier für drei | **117 €** (3 × 39) | **147 €** (3 × 49) |
| DOUBLE SEASON | **79 €** | **79 €** |

Alle Beträge inklusive Mehrwertsteuer.

**49 € ist der öffentliche Referenzpreis.** Er wird öffentlich nie
unterboten. **39 € ist die öffentliche Untergrenze.** Kein kleinerer Betrag
erscheint im sichtbaren Shop, auch nicht in Meta-Tags, Sitemaps oder
strukturierten Daten.

Der Crew Pass hängt am jeweils gültigen Einzelpreis und zieht die Umstellung
automatisch mit. Double Season hat bewusst kein Rabattfenster und bekommt
deshalb auch keinen Streichpreis: Ein Vergleichswert wäre frei erfunden.

Ab dem 16.10. verschwindet die Early-Bird-Darstellung vollständig. Kein
Streichpreis, kein Label, kein Countdown. Übrig bleibt eine Zahl.

## 2. Umstellung am 15./16. Oktober

Der Stichtag ist als Berliner Wanduhrzeit definiert und in einen absoluten
Zeitstempel umgerechnet. Im Oktober liegt Berlin zwei Stunden vor UTC, der
Umschaltzeitpunkt ist also **15.10.2026 22:00 UTC**.

Die Umstellung passiert serverseitig zur Laufzeit. Es gibt keinen Schalter
und kein Deployment dafür: `tierAt(now, prices)` vergleicht gegen den
Zeitstempel, sonst nichts.

Drei Dinge, die das kaputt machen können:

- **Zwischenspeicher.** Eine Seite oder Preisantwort, die über den Stichtag
  hinweg gecached wird, zeigt danach den falschen Preis. Preisantworten
  brauchen `Cache-Control: no-store`, Seiten mit Preis dürfen nicht statisch
  ausgeliefert werden.
- **Zeitzone des Servers.** Spielt keine Rolle, solange die Rechnung aus
  `src/lib/time/berlin.ts` verwendet wird. Wer `new Date("2026-10-16")`
  schreibt, bekommt UTC und ist zwei Stunden daneben.
- **Zeit aus dem Browser.** Der Client darf den Tarif anzeigen, aber nie
  bestimmen. Maßgeblich ist der Server.

## 3. Versteckte Preisfenster

Alle Fenster liegen auf demselben Codepreis und sind ausschließlich über ein
Codefeld erreichbar. Der Betrag steht bewusst nicht in diesem Dokument, siehe
unten. Das Feld sitzt dezent im Checkout ("Du hast einen Code?"), es
gibt keinen Menüpunkt und keine eigene Seite dafür.

| Kanal | Zweck | Besonderheit |
|---|---|---|
| `crm` | Newsletter und CRM | Kontingent frei wählbar |
| `student` | Studierende | Verifikation per Hochschulmail, Kontingent 400, danach Warteliste |
| `drop` | zeitlich begrenzte Aktionen | Start und Ende pro Charge |
| `bar` | pro teilnehmender Bar | eigenes Kontingent, Bar-ID im Kanal-Tag |

**Der Codepreis steht nirgends im Quelltext und auch nicht hier.** Dieses
Repository ist öffentlich, ein Dokument darin ist so gut lesbar wie eine
Webseite. Der Betrag kommt aus einer Konfiguration,
die nur der Server liest: entweder aus `TICKET_WINDOWS` als JSON oder aus
`src/data/ticket-windows.internal.json`, die nicht eingecheckt wird. Vorlage:
`src/data/ticket-windows.example.json`.

Fehlt die Konfiguration, gibt es keine Fenster. Der Shop verkauft dann zum
öffentlichen Preis weiter und lehnt Codes ab. Das ist der richtige
Ausfallmodus: Kein Kauf bricht ab, nur der Rabatt fehlt.

## 4. Das Modul

`src/lib/tickets/`, rahmenfrei. Keine Next-, React- oder Projektimporte, nur
relative Pfade und Node-Bordmittel. Direkt kopierbar.

| Datei | Inhalt |
|---|---|
| `types.ts` | Der Vertrag. Produkte, Kanäle, Fenster, Ergebnisse, Fehlergründe |
| `pricing.ts` | Preisfindung. Die einzige Stelle, die entscheidet, was etwas kostet |
| `redeem.ts` | Ansehen, belegen, festschreiben, freigeben |
| `students.ts` | Domainprüfung, Bestätigungslink, Kontingent, Warteliste |
| `store.ts` | Speicherschnittstelle plus Referenzumsetzung im Speicher |
| `config.ts` | Laden und Prüfen der Fenster |
| `examples/routes.example.ts` | Vorlagen für die Endpunkte, nicht ausgeliefert |
| `tickets.test.mts` | 47 Tests, `npm run test:tickets` |

Zusätzlich `src/lib/time/berlin.ts` für die Zeitrechnung.

### Preishoheit

Der Client schickt nie einen Betrag, höchstens einen Code. Alles andere wäre
ein Preisschild, das der Kunde selbst beschriften darf. Die Zahlung wird
immer mit dem Ergebnis von `reserve()` angelegt, nie mit einem Wert aus der
Anfrage.

### Der dreiteilige Ablauf

```
quote()    Preis ansehen, nichts verbrauchen.   Für das Eingabefeld.
reserve()  Code und Kontingentplatz belegen.    Direkt vor der Zahlung.
commit()   Kauf festschreiben.                  Im Zahlungs-Webhook.
release()  Belegung zurücknehmen.               Wenn die Zahlung scheitert.
```

Wer `quote()` und Zahlung ohne `reserve()` verbindet, verkauft denselben Code
mehrfach. Zwischen Anzeige und Zahlung liegen bei Karte und 3D Secure schnell
zwei Minuten.

`commit()` gehört hinter die Zahlungsbestätigung, also in den Webhook, nicht
in die Antwort des Checkout-Aufrufs.

## 5. Speicher

Das Modul kennt keine Datenbank, es beschreibt nur, was es braucht. Umsetzung
gegen `TicketStore` in `store.ts`.

**Zwei Operationen müssen atomar sein.** Wer sie als lesen, prüfen, schreiben
umsetzt, verkauft bei einem Drop denselben Code zweimal, sobald zwei Klicks
gleichzeitig ankommen.

```sql
-- Code verbrauchen. Trifft das null Zeilen, war er schon weg.
UPDATE ticket_codes
   SET redeemed_at = now(), purchase_id = $2
 WHERE code_hash = $1 AND redeemed_at IS NULL;

-- Kontingentplatz belegen.
UPDATE price_windows
   SET redeemed_count = redeemed_count + 1
 WHERE id = $1 AND (quota IS NULL OR redeemed_count < quota);
```

Nicht vorher zählen und dann schreiben. Den betroffenen Zeilen vertrauen.

### Codes und Adressen

Beides liegt ausschließlich als HMAC-SHA256 vor, Schlüssel in
`TICKET_CODE_SECRET`, mindestens 32 Zeichen. Ein Leck der Datenbank soll
keinen einzigen gültigen Code hergeben. Blankes SHA reicht nicht: Codes sind
kurz und folgen einem Muster, der ganze Raum ließe sich durchrechnen.

Das Modul wirft beim Start, wenn der Schlüssel fehlt. Das ist Absicht. Ein
zufälliger Ersatzwert wäre schlimmer: Nach jedem Neustart passte kein
einziger Hash mehr, und niemand könnte einen Code einlösen.

**Beim Rotieren des Schlüssels werden alle Hashes ungültig.** Wer rotiert,
muss die Codes neu einspielen.

## 6. Studentenverifikation

```
Adresse eingeben  →  Domain prüfen  →  Mail mit Link
     →  Link klicken  →  Code oder Warteliste
```

Whitelist: `lmu.de`, `tum.de`, `hm.edu`, erweiterbar über
`STUDENT_EMAIL_DOMAINS` als kommaseparierte Liste, ohne Deployment.

Subdomains zählen mit, `campus.lmu.de` gehört zu `lmu.de`. Ohne das fällt die
halbe TUM heraus, dort verteilen die Fakultäten eigene Subdomains. Der Punkt
davor ist wichtig, sonst käme auch `nichtlmu.de` durch.

Kontingent 400, ein Code pro verifizierter Adresse. Danach Warteliste mit
Position.

Der Bestätigungslink gilt 24 Stunden, der Token ist 32 Byte aus
`randomBytes` und wird nur als Hash gespeichert. Wer die Datenbank liest,
kann damit keinen Link bauen.

**Was das leistet und was nicht.** Der Zweck ist nicht, Studierende sicher zu
erkennen, sondern den Rabatt an eine Hürde zu binden, die sich nicht
massenhaft automatisieren lässt. Wer sich eine fremde Hochschuladresse
besorgt, bekommt den Rabatt. Das ist vertretbar. Die Alternative wäre ein
Ausweisupload, und der kostet mehr Vertrauen als der Rabatt wert ist.

## 7. Was bei jedem Kauf mitgeschrieben wird

Vorgabe erfüllt durch `PurchaseRecord`:

| Feld | Inhalt |
|---|---|
| `id` | Kennung, gleich der Reservierung |
| `product` | `single`, `crew` oder `doubleSeason` |
| `amountEur` | tatsächlich gezahlter Betrag |
| `tier` | `early` oder `regular` |
| `channel` | `public`, `crm`, `student`, `drop` oder `bar` |
| `windowId` | welches Fenster, falls Code |
| `channelRef` | freies Feld, bei Bar-Codes die Bar-ID |
| `codeHash` | Hash des Codes, nie der Code |
| `at` | Zeitstempel |

Der Kanal geht **nicht** an den Client. Er gehört in den Kaufdatensatz, nicht
in eine API-Antwort.

## 8. Was im Shop noch zu tun ist

Der Zustand von `cocktailx.app` heute, geprüft am 9. August 2026:

1. **Der Shop verkauft das falsche Produkt.** `GET /api/tickets/price` liefert
   die Sommerpreise, die Startseite nennt "Mai 2027". Wer heute auf Pass sichern klickt, kauft das
   Sommerfestival, nicht ON ICE '26.
2. **Dieser Endpunkt ist ein Regelverstoß.** Er gibt unauthentifiziert einen
   Betrag heraus, der nach der neuen Struktur ein Codepreis ist und öffentlich
   nicht erscheinen darf.
3. **Es gibt kein Codefeld im Kauf.** Der Ablauf ist Menge, Mail,
   Datenschutz, zur Kasse. Das vorhandene Codefeld sitzt im Gäste-Signup
   nach dem Kauf und dient der Kontoerstellung.
4. **Double Season existiert dort nicht.** Der Crew Pass fällt zufällig mit
   dem eingebauten Automatik-Deal `group4for3` zusammen.

Aufgabenliste:

- [ ] Produkte auf ON ICE '26 umstellen, drei Karten wie in Abschnitt 1
- [ ] Preis-API auf 39/49 umstellen und `no-store` setzen
- [ ] Modul übernehmen, `TicketStore` gegen die Datenbank implementieren
- [ ] Codefeld im Checkout, dezent, ohne eigenen Menüpunkt
- [ ] Studentenstrecke: zwei Endpunkte plus Mailversand
- [ ] `TICKET_CODE_SECRET` setzen, Fensterkonfiguration hinterlegen
- [ ] Codes erzeugen und als Hash einspielen
- [ ] Bremse gegen das Durchprobieren von Codes
- [ ] Kaufabschluss mobil unter zwei Minuten, maximal drei Schritte bis Payment
- [ ] Impressum, AGB, Widerruf verlinkt, Preise inkl. MwSt. ausgewiesen

## 9. Offene Punkte

1. **Double Season, Kontingent.** Der Brief nennt keins. Bisher galten 300
   Stück, das steht weiter so auf der Website. Bitte bestätigen oder streichen.
2. **Crew Pass, Zuweisung.** "Vier personalisierbare Pässe, Zuweisung per
   Mail nach Kauf" ist als Text zugesagt, die Mechanik dahinter ist nicht
   spezifiziert. Wer weist zu, wie oft ist eine Änderung möglich?
3. **Warteliste.** Was passiert mit ihr? Nachrücken bei Stornos, oder nur
   eine Mail, wenn ein neues Kontingent kommt?
4. **Codeformat.** Länge und Zeichenvorrat sind offen. Empfehlung: acht
   Zeichen ohne 0/O und 1/I, damit Abtippen funktioniert.
5. **Alte Preise im Git-Verlauf.** `SUMMER_2027_FROM = 24` ist aus dem
   Arbeitsstand entfernt, steht aber weiter in der Historie eines öffentlichen
   Repositories. Das räumt nur ein Umschreiben der Historie oder das
   Privatstellen des Repositories weg. Letzteres war ohnehin geplant.
6. **`npm run deploy`** in `package.json` macht
   `git push nbm main --force` auf ein Remote namens `nbm`, das lokal nicht
   existiert. Das Skript läuft heute ins Leere, ist aber eine Falle: Wer das
   Remote anlegt, überschreibt fremde Historie ohne Rückfrage.

## 10. Prüfen

```bash
npm run test:tickets     # 47 Tests, ohne zusätzliche Abhängigkeit
npx tsc --noEmit
npx next lint
```

Die Tests decken die Umstellung auf die Minute und in Berliner Zeit ab,
Einmaligkeit von Codes, Kontingente, Zeitfenster von Drops, die Mitschrift
des Kanals, die Rückgabe eines Codes nach Abbruch, und bei den Domains auch
die Falle, dass `lmu.de.example.com` nicht durchgehen darf.
