import type { Currency, Transaction, TransactionWithBalance } from "../types";

/**
 * Sums all transaction amounts per currency id.
 * Returns a map of currency id → total amount.
 */
export function getTotals(
  transactions: Transaction[],
  currencies: Currency[],
): Record<string, number> {
  const totals: Record<string, number> = {};
  currencies.forEach((c) => (totals[c.id] = 0));
  transactions.forEach((tx) => {
    Object.entries(tx.amounts).forEach(([cid, amt]) => {
      if (cid in totals && amt !== undefined) {
        totals[cid] += amt;
      }
    });
  });
  return totals;
}

/**
 * Converts a totals map to a single GP-equivalent value.
 */
export function toGrandTotal(
  totals: Record<string, number>,
  currencies: Currency[],
): number {
  return currencies.reduce((sum, c) => sum + (totals[c.id] ?? 0) * c.rate, 0);
}

/**
 * Returns transactions sorted chronologically, each annotated with a
 * running balance snapshot after that transaction is applied.
 */
export function getTransactionsWithBalances(
  transactions: Transaction[],
  currencies: Currency[],
): TransactionWithBalance[] {
  const sorted = [...transactions].sort(
    (a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id),
  );
  const running: Record<string, number> = {};
  currencies.forEach((c) => (running[c.id] = 0));

  return sorted.map((tx) => {
    Object.entries(tx.amounts).forEach(([cid, amt]) => {
      if (cid in running && amt !== undefined) {
        running[cid] += amt;
      }
    });
    return { ...tx, running: { ...running } };
  });
}

/**
 * Formats a number as a signed string: +12 / -5 / 0
 */
export function formatSigned(n: number): string {
  if (n > 0) return `+${n}`;
  return String(n);
}
