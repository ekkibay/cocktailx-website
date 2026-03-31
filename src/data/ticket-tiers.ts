const FESTIVAL_DATE = new Date("2026-05-13T19:00:00+02:00");

export const PASSPORT_PRICES = {
  earlyBird: 20,
  regular: 34,
  late: 49,
} as const;

function getCheapestAvailable(): number {
  const now = new Date();

  // Early Bird ends after March 31 (April 1 = sold out)
  const ebEnd = new Date(FESTIVAL_DATE);
  ebEnd.setDate(ebEnd.getDate() - 42);
  if (now < ebEnd) return PASSPORT_PRICES.earlyBird;

  // Regular ends April 30
  const regEnd = new Date(FESTIVAL_DATE);
  regEnd.setDate(regEnd.getDate() - 13);
  if (now < regEnd) return PASSPORT_PRICES.regular;

  return PASSPORT_PRICES.late;
}

export const TICKET_TIERS = {
  ...PASSPORT_PRICES,
  cheapest: getCheapestAvailable(),
} as const;
