# Supportbereich, Zugang zum Postfach

`/intern/support` zeigt den Posteingang des Support-Postfachs und schreibt an
jede Mail, was wir über den Absender wissen: gekauft, Zahlung gescheitert,
erstattet oder kein Kauf. Die Verknüpfung läuft über die Adresse des
Absenders gegen die Zahlungen in Stripe.

Ohne Zugang zeigt die Seite Demodaten mit deutlichem Hinweis. Der echte
Posteingang braucht eine einmalige Einrichtung in Microsoft, etwa 15 Minuten.

## Einrichtung

Anmelden auf [portal.azure.com](https://portal.azure.com) mit einem
Administratorkonto der Organisation.

1. **App-Registrierung anlegen.** Suchfeld: *App registrations*, dann *New
   registration*. Name `cocktailx-intern`, Kontotyp *Accounts in this
   organizational directory only*, Redirect URI leer lassen. *Register*.
2. **Zwei IDs kopieren.** Auf der Übersichtsseite der neuen App stehen
   *Application (client) ID* und *Directory (tenant) ID*. Beide kopieren.
3. **Geheimen Schlüssel anlegen.** Links *Certificates & secrets*, *New
   client secret*, Laufzeit wählen (nach Ablauf einfach einen neuen anlegen
   und in `.env.local` tauschen). Den **Value** sofort kopieren, er wird
   später nie wieder angezeigt.
4. **Leserecht auf Postfächer geben.** Links *API permissions*, *Add a
   permission*, *Microsoft Graph*, *Application permissions*, `Mail.Read`
   anhaken, *Add permissions*. Danach oben **Grant admin consent** klicken,
   sonst gilt das Recht nicht.
5. **Werte eintragen.** In `.env.local` (nie in eine Datei, die ins
   Repository geht):

   ```
   MS_GRAPH_TENANT_ID=die Directory-ID aus Schritt 2
   MS_GRAPH_CLIENT_ID=die Application-ID aus Schritt 2
   MS_GRAPH_CLIENT_SECRET=der Value aus Schritt 3
   SUPPORT_MAILBOX=info@cocktail-x.com
   ```

6. **Prüfen.** Dev-Server neu starten, `/intern/support` öffnen. Der
   Demodaten-Hinweis muss weg sein und die echten Betreffzeilen dastehen.
   Steht dort stattdessen *Microsoft hat abgelehnt*, steht die Fehlermeldung
   gleich daneben; meistens fehlt dann der Admin Consent aus Schritt 4.

## Eine Einschränkung, die sich lohnt

`Mail.Read` als Anwendungsberechtigung darf **jedes** Postfach der
Organisation lesen, nicht nur das Support-Postfach. Der Code fragt nur
`SUPPORT_MAILBOX` ab, aber die Berechtigung selbst ist breiter. Wer das
sauber ziehen will, schränkt die App in Exchange Online auf das eine Postfach
ein:

```powershell
New-ApplicationAccessPolicy -AppId <Application-ID> `
  -PolicyScopeGroupId info@cocktail-x.com `
  -AccessRight RestrictAccess `
  -Description "cocktailx-intern liest nur das Support-Postfach"
```

Nicht zwingend für den Start, aber der Unterschied zwischen "die App kann
unser Postfach lesen" und "die App kann alle Postfächer lesen".

## Was die Seite bewusst nicht tut

Sie antwortet nicht und verändert nichts, auch den Gelesen-Status nicht.
Beantwortet wird in Outlook, der Link an jeder Mail führt direkt hin. Ein
eigener Antworteditor wäre ein zweites Mailprogramm, das keiner pflegt, und
bräuchte Schreibrechte, die wir sonst nicht brauchen.
