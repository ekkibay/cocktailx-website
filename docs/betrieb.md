# Betrieb: CI, Gesundheitscheck, interner Bereich

## Was die CI prueft

Jeder Push auf `main` und jeder Pull Request laeuft durch
`.github/workflows/ci.yml` auf GitHub Actions, vier Schritte nacheinander:

1. `npx tsc --noEmit`, die Typen.
2. `npm run lint`, ESLint nach `.eslintrc.json`.
3. `npm test`, der eingebaute Testrunner von Node ueber alle `*.test.mts`.
4. `npm run build`, der Produktionsbuild ohne Geheimnisse. Er muss ohne jede
   Env-Variable durchlaufen, weil alle Clients erst beim Aufruf gebaut werden.

Ein neuer Push auf denselben Branch bricht den laufenden Durchlauf ab. Deployt
wird dort nichts, das macht Vercel selbst aus `main`. Node-Version: `.nvmrc`.

Lokal dasselbe mit `npm run check`: Lint, Typen und Tests hintereinander wie in
der CI, nur ohne den Build, weil der `.next` neu schreibt und einem laufenden
`npm run dev` in die Quere kommt.

## Gesundheitscheck

`GET /api/health` antwortet immer frisch (`Cache-Control: no-store`) mit

    {"ok":true,"version":"8784478","time":"2026-09-08T10:00:00.000Z"}

`version` ist der kurze Commit-Hash aus dem Vercel-Build, lokal `dev`. Sonst
nichts, keine Konfiguration und keine Geheimnisse. Uptime-Monitor (Better Stack,
UptimeRobot, Checkly): HTTP-Check auf `https://cocktail-x.com/api/health`, Status
200 erwartet, optional `"ok":true` im Body, Intervall 1 bis 5 Minuten, Alarm erst
ab zwei Fehlschlaegen hintereinander.

## Interner Bereich

`/intern` ist in der Produktion aus und liefert 404, solange `DASHBOARD_ENABLED`
nicht auf `true` steht. Steht er auf `true`, verlangt der Bereich eine Anmeldung
mit dem gemeinsamen Teampasswort `INTERN_PASSWORD`; die Sitzung ist ein signiertes
Cookie (`INTERN_SECRET`, zwoelf Stunden gueltig, Anmeldeseite `/intern-login`).
Ohne gueltige Sitzung antworten Seiten und Exporte mit 404, damit der Bereich
von aussen nicht erkennbar ist. Wird `INTERN_SECRET` gewechselt, sind alle
abgemeldet. In der Entwicklung ist der Bereich ohne Anmeldung offen.
