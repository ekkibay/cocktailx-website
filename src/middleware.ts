import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  /*
   * /intern ist ausgenommen.
   *
   * Das Dashboard ist ein Werkzeug fuer uns, kein Auftritt fuer Gaeste. Es
   * braucht keine Sprachfuehrung, und mit ihr waere /intern eine Weiterleitung
   * auf /de/intern, also eine Adresse mehr fuer dieselbe Seite.
   */
  matcher: ["/((?!api|intern|_next|_vercel|.*\\..*).*)"],
};
