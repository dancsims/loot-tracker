import { useState, useEffect } from "react";
import type { SrdItem } from "../types";

type SrdStatus = "idle" | "loading" | "ready" | "error";

interface UseSRDResult {
  items: SrdItem[];
  status: SrdStatus;
  statusText: string;
}

const SRD_BASE = "https://www.dnd5eapi.co/api";

export function useSRD(): UseSRDResult {
  const [items, setItems] = useState<SrdItem[]>([]);
  const [status, setStatus] = useState<SrdStatus>("idle");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setStatus("loading");
      try {
        const listRes = await fetch(`${SRD_BASE}/magic-items?limit=500`);
        const listData = (await listRes.json()) as {
          results: { index: string; name: string }[];
        };
        const entries = listData.results ?? [];

        const details = await Promise.all(
          entries.slice(0, 300).map(async (entry) => {
            try {
              const r = await fetch(`${SRD_BASE}/magic-items/${entry.index}`);
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
                index: entry.index,
                name: d.name,
                description: (d.desc ?? []).join(" "),
                tags,
              } satisfies SrdItem;
            } catch {
              return {
                index: entry.index,
                name: entry.name,
                description: "",
                tags: ["magic"],
              } satisfies SrdItem;
            }
          }),
        );

        if (!cancelled) {
          setItems(details);
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

  const statusText =
    status === "loading"
      ? "Loading SRD…"
      : status === "ready"
        ? `${items.length} SRD items loaded`
        : status === "error"
          ? "SRD unavailable (offline)"
          : "";

  return { items, status, statusText };
}
