import type { CampaignState } from "../types";

export function uid(): string {
  return "x" + Math.random().toString(36).slice(2, 9);
}

export function exportJson(state: CampaignState): void {
  const blob = new Blob([JSON.stringify(state, null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download =
    (state.campaign.replace(/\s+/g, "-").toLowerCase() || "loot") +
    "-tracker.json";
  a.click();
  URL.revokeObjectURL(a.href);
}

export function parseImport(raw: string): CampaignState {
  const d = JSON.parse(raw) as Partial<CampaignState>;
  if (!d.currencies || !d.transactions || !d.items) {
    throw new Error("Invalid loot tracker file");
  }
  return d as CampaignState;
}

export function isoDate(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}
