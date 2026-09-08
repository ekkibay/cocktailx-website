import { NextResponse } from "next/server";

/**
 * Ziel fuer den Uptime-Monitor.
 *
 * Antwortet mit 200, solange die App laeuft, und sagt dazu, welcher Stand
 * das ist: `version` ist der kurze Commit-Hash, den Vercel beim Build setzt,
 * lokal steht dort "dev". Mehr gibt die Route nicht heraus. Keine
 * Konfiguration, keine Schalter, keine Geheimnisse, denn sie ist oeffentlich
 * und wird von aussen im Minutentakt abgefragt.
 *
 * Route Handler mit GET sind in Next 14 sonst statisch und wuerden beim Build
 * eingefroren. Ein Monitor, der eine gespeicherte Antwort bekommt, misst
 * nichts, deshalb force-dynamic und no-store.
 */
export const dynamic = "force-dynamic";

export function GET() {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA;
  return NextResponse.json(
    {
      ok: true,
      version: sha ? sha.slice(0, 7) : "dev",
      time: new Date().toISOString(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
