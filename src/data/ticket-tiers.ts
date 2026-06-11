// ── 2027 Early-Bird campaign ─────────────────────────────────────────────────
// Cocktail X 2026 is over. The site now sells the 2027 Early-Bird ticket.
// Honest scarcity: a fixed contingent of Early-Bird tickets at €19 (no fake countdowns).

export const PASSPORT_PRICES = {
  earlyBird: 19, // 2027 Early-Bird price
  regular: 34, // later regular price (anchor)
  late: 34,
} as const;

// Anchor / savings shown next to the Early-Bird price
export const EARLY_BIRD_PRICE = PASSPORT_PRICES.earlyBird;
export const ANCHOR_PRICE = PASSPORT_PRICES.regular;
export const EARLY_BIRD_SAVINGS_PCT = Math.round(
  (1 - EARLY_BIRD_PRICE / ANCHOR_PRICE) * 100
); // 44

export const TICKET_TIERS = {
  ...PASSPORT_PRICES,
  cheapest: PASSPORT_PRICES.earlyBird,
} as const;

// ── Scarcity: fixed contingent (honest, no live fake counter) ────────────────
// "Nur die ersten 500 Tickets zu 19 €"
export const EARLY_BIRD_CONTINGENT = 500;

// Backwards-compatible export: returns the fixed Early-Bird contingent
// (kept stable instead of a fake live countdown).
export function getTicketsLeft(): number {
  return EARLY_BIRD_CONTINGENT;
}
