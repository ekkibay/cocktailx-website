import { NextRequest, NextResponse } from "next/server";
import { LIMITS } from "@/lib/pricing/assumptions";
import { calculateQuote, needsReview, publicQuote } from "@/lib/pricing/engine";
import type { BarConcept, EventConfig, EventKind, FoodOption } from "@/lib/pricing/types";

const KINDS: EventKind[] = ["corporate", "messe", "launch", "team", "networking"];
const CONCEPTS: BarConcept[] = ["classic", "signature", "nitro", "highball"];
const FOODS: FoodOption[] = ["none", "fingerfood", "flyingBuffet"];

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Coerces untrusted input into a valid config — the client never dictates prices, only choices. */
function parseConfig(body: unknown): EventConfig {
  const b = (body ?? {}) as Record<string, unknown>;
  const int = (v: unknown, fallback: number) => {
    const n = Math.round(Number(v));
    return Number.isFinite(n) ? n : fallback;
  };
  return {
    kind: KINDS.includes(b.kind as EventKind) ? (b.kind as EventKind) : "corporate",
    guests: clamp(int(b.guests, 100), LIMITS.minGuests, LIMITS.maxGuests),
    hours: clamp(int(b.hours, 4), LIMITS.minHours, LIMITS.maxHours),
    drinksPerGuest: clamp(int(b.drinksPerGuest, 3), LIMITS.minDrinksPerGuest, LIMITS.maxDrinksPerGuest),
    concept: CONCEPTS.includes(b.concept as BarConcept) ? (b.concept as BarConcept) : "classic",
    food: FOODS.includes(b.food as FoodOption) ? (b.food as FoodOption) : "none",
    softDrinks: b.softDrinks !== false,
  };
}

export async function POST(req: NextRequest) {
  try {
    const config = parseConfig(await req.json());
    const quote = calculateQuote(config);

    // Margin data stays on the server. `needsReview` is intentionally not returned —
    // it is a sales signal, not customer information.
    if (needsReview(quote)) {
      console.warn(
        `[quote] thin margin ${(quote.internal.marginPercent * 100).toFixed(1)}% for`,
        JSON.stringify(config),
      );
    }

    return NextResponse.json({ config, quote: publicQuote(quote) });
  } catch (err) {
    console.error("Quote calculation failed:", err);
    return NextResponse.json({ error: "Calculation failed" }, { status: 500 });
  }
}
