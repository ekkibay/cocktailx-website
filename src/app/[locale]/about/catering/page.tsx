import { redirect } from "next/navigation";

/**
 * Alte Adresse aus der Zeit, als Catering unter /about lag.
 *
 * Das Praefix wird nur fuer Englisch gesetzt. Vorher stand hier immer
 * /${locale}/catering, im Deutschen also /de/catering. Weil die Sprachfuehrung
 * auf "as-needed" steht, hat Next das anschliessend noch einmal auf /catering
 * umgeleitet: zwei Spruenge fuer einen Klick, und in jedem Protokoll eine
 * Weiterleitung mehr, als noetig waere.
 */
export default function CateringRedirect({ params }: { params: { locale: string } }) {
  redirect(params.locale === "en" ? "/en/catering" : "/catering");
}
