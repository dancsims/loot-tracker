import { useState, useEffect } from "react";
import type { SrdItem } from "../types";

type SrdStatus = "idle" | "loading" | "ready" | "error";

interface UseSRDResult {
  items: SrdItem[];
  status: SrdStatus;
  statusText: string;
  fetchItemDetail: (index: string) => Promise<SrdItem | null>;
}

const SRD_BASE = "https://www.dnd5eapi.co/api/2014";

export function useSRD(): UseSRDResult {
  const [items, setItems] = useState<SrdItem[]>([]);
  const [status, setStatus] = useState<SrdStatus>("idle");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setStatus("loading");
      try {
        const listRes = await fetch(`${SRD_BASE}/magic-items`);
        const listData = (await listRes.json()) as {
          results: { index: string; name: string }[];
        };
        const entries = listData.results ?? [];

        if (!cancelled) {
          // Store just the stub — no detail calls at all
          setItems(
            entries.map((e) => ({
              index: e.index,
              name: e.name,
              description: "",
              tags: ["magic"],
            })),
          );
          setStatus("ready");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function fetchItemDetail(index: string): Promise<SrdItem | null> {
    try {
      const r = await fetch(`${SRD_BASE}/magic-items/${index}`);
      const d = (await r.json()) as {
        name: string;
        desc?: string[];
        equipment_category?: { name: string };
        rarity?: { name: string };
      };
      const tags: string[] = [
        d.equipment_category?.name?.toLowerCase() ?? "magic",
        d.rarity?.name?.toLowerCase() ?? "",
      ].filter(Boolean);
      return {
        index,
        name: d.name,
        description: (d.desc ?? []).join(" "),
        tags,
      };
    } catch {
      return null;
    }
  }

  const statusText =
    status === "loading"
      ? "Loading SRD item list…"
      : status === "ready"
        ? `${items.length} SRD items available`
        : status === "error"
          ? "SRD unavailable (offline)"
          : "";

  return { items, status, statusText, fetchItemDetail };
}
