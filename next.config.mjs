import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * Archivierte Routen zeigen auf die Startseite.
 *
 * /awards ist dazugekommen: Die Seite nennt fruehere Preistraeger beim Namen,
 * und solange das Re-Signing laeuft, ist von aussen nicht unterscheidbar, ob
 * eine genannte Bar ausgezeichnet wurde oder dieses Jahr teilnimmt. Nach dem
 * Bar-Reveal kann sie zurueck.
 *
 * Bewusst temporaer (307), nicht permanent: Die Inhalte sind archiviert, nicht
 * abgeschafft. Das Sommerfestival 2027 kommt zurueck, und ein 308 wuerde in
 * Browsern und Suchmaschinen haengen bleiben.
 *
 * Deutsch laeuft ohne Locale-Praefix, Englisch mit /en (next-intl "as-needed"),
 * deshalb beide Formen.
 */
const SUMMER_ROUTES = ["/festival", "/shop", "/awards"];

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: ["cdn.shopify.com"],
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    const rules = [];
    for (const route of SUMMER_ROUTES) {
      rules.push(
        { source: route, destination: "/", permanent: false },
        { source: `${route}/:path*`, destination: "/", permanent: false },
        { source: `/en${route}`, destination: "/en", permanent: false },
        { source: `/en${route}/:path*`, destination: "/en", permanent: false },
      );
    }
    return rules;
  },
};

export default withNextIntl(nextConfig);
