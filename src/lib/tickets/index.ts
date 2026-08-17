/**
 * Oeffentliche Oberflaeche des Ticketmoduls.
 *
 * Nur serverseitig importieren. Die Datei zieht node:crypto und node:fs
 * herein, ein Import aus einer Client-Komponente bricht deshalb schon beim
 * Bauen. Das ist die zweite Verteidigungslinie: Die erste ist, dass hier
 * ueberhaupt keine Preise stehen.
 */

export * from "./types.ts";
export * from "./pricing.ts";
export * from "./redeem.ts";
export * from "./students.ts";
export { loadPriceWindows, parseWindows, resetWindowCache } from "./config.ts";
export {
  createInMemoryStore,
  hashCode,
  hashEmail,
  hashesEqual,
  normalizeCode,
  type CodeRecord,
  type StudentVerification,
  type TicketStore,
} from "./store.ts";
