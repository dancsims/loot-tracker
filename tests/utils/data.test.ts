import { describe, it, expect } from "vitest";
import { uid, parseImport, isoDate } from "../../src/utils/data";
import { DEFAULT_STATE } from "../../src/utils/defaults";

describe("uid", () => {
  it("generates a non-empty string", () => {
    expect(uid().length).toBeGreaterThan(0);
  });

  it("generates unique values", () => {
    const ids = new Set(Array.from({ length: 100 }, () => uid()));
    expect(ids.size).toBe(100);
  });
});

describe("isoDate", () => {
  it("returns a YYYY-MM-DD string", () => {
    expect(isoDate()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("formats a given date correctly", () => {
    expect(isoDate(new Date("2026-04-18T12:00:00Z"))).toBe("2026-04-18");
  });
});

describe("parseImport", () => {
  it("parses a valid campaign JSON string", () => {
    const raw = JSON.stringify(DEFAULT_STATE);
    const result = parseImport(raw);
    expect(result.campaign).toBe(DEFAULT_STATE.campaign);
    expect(result.currencies).toHaveLength(DEFAULT_STATE.currencies.length);
  });

  it("throws on invalid JSON", () => {
    expect(() => parseImport("not json")).toThrow();
  });

  it("throws if required keys are missing", () => {
    const invalid = JSON.stringify({ campaign: "Test" });
    expect(() => parseImport(invalid)).toThrow("Invalid loot tracker file");
  });
});
