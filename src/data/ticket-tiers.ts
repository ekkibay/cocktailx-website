const FESTIVAL_DATE = new Date("2026-05-13T19:00:00+02:00");

export const PASSPORT_PRICES = {
  earlyBird: 20,
  regular: 34,
  late: 34,
} as const;

function getCheapestAvailable(): number {
  const now = new Date();

  const ebEnd = new Date(FESTIVAL_DATE);
  ebEnd.setDate(ebEnd.getDate() - 42);
  if (now < ebEnd) return PASSPORT_PRICES.earlyBird;

  const regEnd = new Date(FESTIVAL_DATE);
  regEnd.setDate(regEnd.getDate() - 13);
  if (now < regEnd) return PASSPORT_PRICES.regular;

  return PASSPORT_PRICES.late;
}

export const TICKET_TIERS = {
  ...PASSPORT_PRICES,
  cheapest: getCheapestAvailable(),
} as const;

// ── Scarcity counter ─────────────────────────────────────────────────────────
// Linear decay: 500 tickets on May 1 → 0 by May 13 festival start
const SCARCITY_START = new Date("2026-05-01T00:00:00+02:00");
const SCARCITY_START_COUNT = 1000;
const SCARCITY_TOTAL_MS = FESTIVAL_DATE.getTime() - SCARCITY_START.getTime();

export function getTicketsLeft(): number {
  const elapsed = Date.now() - SCARCITY_START.getTime();
  if (elapsed <= 0) return SCARCITY_START_COUNT;
  const remaining = Math.round(SCARCITY_START_COUNT * (1 - elapsed / SCARCITY_TOTAL_MS));
  return Math.max(1, remaining);
}
