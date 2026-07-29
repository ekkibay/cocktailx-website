import { NextRequest, NextResponse } from "next/server";
import {
  calculatePackageQuote,
  packageQuoteNeedsReview,
  parseSelection,
} from "@/lib/pricing/packageQuote";

export async function POST(req: NextRequest) {
  try {
    const selection = parseSelection(await req.json());
    const quote = calculatePackageQuote(selection);

    // Margenwarnung bleibt im Log, sie ist ein Vertriebssignal und keine Kundeninfo.
    if (packageQuoteNeedsReview(selection)) {
      console.warn("[paket-angebot] thin margin for", JSON.stringify(selection));
    }

    return NextResponse.json({ selection, quote });
  } catch (err) {
    console.error("Package quote failed:", err);
    return NextResponse.json({ error: "Calculation failed" }, { status: 500 });
  }
}
