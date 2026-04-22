import { describe, it, expect } from "vitest";
import {
  getTotals,
  toGrandTotal,
  getTransactionsWithBalances,
  formatSigned,
} from "../../src/utils/currency";
import type { Currency, Transaction } from "../../src/types";

const CURRENCIES: Currency[] = [
  { id: "gp", name: "Gold", symbol: "gp", rate: 1 },
  { id: "sp", name: "Silver", symbol: "sp", rate: 0.1 },
  { id: "cp", name: "Copper", symbol: "cp", rate: 0.01 },
];

const TRANSACTIONS: Transaction[] = [
  {
    id: "t1",
    date: "2026-01-01",
    description: "Starting funds",
    amounts: { gp: 50 },
    note: "",
  },
  {
    id: "t2",
    date: "2026-01-05",
    description: "Sold loot",
    amounts: { gp: 10, sp: 5 },
    note: "",
  },
  {
    id: "t3",
    date: "2026-01-10",
    description: "Paid for inn",
    amounts: { gp: -8, sp: -2 },
    note: "",
  },
];

describe("getTotals", () => {
  it("sums amounts per currency", () => {
    const totals = getTotals(TRANSACTIONS, CURRENCIES);
    expect(totals.gp).toBe(52); // 50 + 10 - 8
    expect(totals.sp).toBe(3); // 5 - 2
    expect(totals.cp).toBe(0); // untouched
  });

  it("returns zero for all currencies when no transactions", () => {
    const totals = getTotals([], CURRENCIES);
    expect(totals.gp).toBe(0);
    expect(totals.sp).toBe(0);
    expect(totals.cp).toBe(0);
  });

  it("ignores currency ids not in the currencies list", () => {
    const txWithUnknown: Transaction[] = [
      {
        id: "u1",
        date: "2026-01-01",
        description: "Unknown",
        amounts: { xx: 999 },
        note: "",
      },
    ];
    const totals = getTotals(txWithUnknown, CURRENCIES);
    expect(totals.gp).toBe(0);
    expect((totals as Record<string, number>).xx).toBeUndefined();
  });
});

describe("toGrandTotal", () => {
  it("converts totals to GP equivalent", () => {
    const totals = { gp: 52, sp: 3, cp: 0 };
    const grand = toGrandTotal(totals, CURRENCIES);
    expect(grand).toBeCloseTo(52.3); // 52*1 + 3*0.1
  });

  it("returns 0 for empty totals", () => {
    const grand = toGrandTotal({ gp: 0, sp: 0, cp: 0 }, CURRENCIES);
    expect(grand).toBe(0);
  });

  it("handles negative totals", () => {
    const totals = { gp: -5, sp: 0, cp: 0 };
    const grand = toGrandTotal(totals, CURRENCIES);
    expect(grand).toBe(-5);
  });
});

describe("getTransactionsWithBalances", () => {
  it("returns transactions sorted by date", () => {
    const shuffled: Transaction[] = [
      TRANSACTIONS[2],
      TRANSACTIONS[0],
      TRANSACTIONS[1],
    ];
    const result = getTransactionsWithBalances(shuffled, CURRENCIES);
    expect(result[0].id).toBe("t1");
    expect(result[1].id).toBe("t2");
    expect(result[2].id).toBe("t3");
  });

  it("attaches correct running balances", () => {
    const result = getTransactionsWithBalances(TRANSACTIONS, CURRENCIES);
    expect(result[0].running.gp).toBe(50); // after t1
    expect(result[1].running.gp).toBe(60); // after t2: 50+10
    expect(result[2].running.gp).toBe(52); // after t3: 60-8
    expect(result[2].running.sp).toBe(3); // 5-2
  });

  it("returns empty array for no transactions", () => {
    const result = getTransactionsWithBalances([], CURRENCIES);
    expect(result).toHaveLength(0);
  });
});

describe("formatSigned", () => {
  it("prefixes positive numbers with +", () => {
    expect(formatSigned(12)).toBe("+12");
  });

  it("keeps negative sign on negative numbers", () => {
    expect(formatSigned(-5)).toBe("-5");
  });

  it('returns "0" for zero', () => {
    expect(formatSigned(0)).toBe("0");
  });
});
