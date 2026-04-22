import { useState } from "react";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { SortButton } from "./ui/SortButton";
import { ItemModal } from "./modals/ItemModal";
import type { CampaignState, Item, SortState, SrdItem } from "../types";

interface Props {
  state: CampaignState;
  srdItems: SrdItem[];
  srdReady: boolean;
  fetchItemDetail: (index: string) => Promise<SrdItem | null>;
  onAdd: (item: Item) => void;
  onUpdate: (item: Item) => void;
  onDelete: (id: string) => void;
  onQtyChange: (id: string, qty: number) => void;
}

export function LootTracker({
  state,
  srdItems,
  srdReady,
  fetchItemDetail,
  onAdd,
  onUpdate,
  onDelete,
  onQtyChange,
}: Props) {
  const [sort, setSort] = useState<SortState>({ col: "name", dir: "asc" });
  const [search, setSearch] = useState("");
  const [filterCarrier, setCarrier] = useState("");
  const [filterLocation, setLoc] = useState("");
  const [filterNotable, setNotable] = useState("");
  const [modal, setModal] = useState<"add" | Item | null>(null);

  function toggleSort(col: string) {
    setSort((prev) =>
      prev.col === col
        ? { col, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { col, dir: "asc" },
    );
  }

  const filtered = state.items
    .filter((i) => {
      const q = search.toLowerCase();
      if (
        q &&
        !i.name.toLowerCase().includes(q) &&
        !i.description.toLowerCase().includes(q)
      )
        return false;
      if (filterCarrier && i.carrier !== filterCarrier) return false;
      if (filterLocation && i.location !== filterLocation) return false;
      if (filterNotable === "notable" && !i.notable) return false;
      if (filterNotable === "normal" && i.notable) return false;
      return true;
    })
    .sort((a, b) => {
      let av: string | number, bv: string | number;
      if (sort.col === "name") {
        av = a.name.toLowerCase();
        bv = b.name.toLowerCase();
      } else if (sort.col === "qty") {
        av = a.qty;
        bv = b.qty;
      } else if (sort.col === "holder") {
        av = (a.carrier ?? a.location ?? "").toLowerCase();
        bv = (b.carrier ?? b.location ?? "").toLowerCase();
      } else {
        av = a.name.toLowerCase();
        bv = b.name.toLowerCase();
      }
      if (av < bv) return sort.dir === "asc" ? -1 : 1;
      if (av > bv) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });

  function handleSave(item: Item) {
    if (modal === "add") onAdd(item);
    else onUpdate(item);
    setModal(null);
  }

  return (
    <div style={{ minWidth: 700, maxWidth: 900, margin: "0 auto" }}>
      <div className="section-header">
        <h2>Loot tracker</h2>
        <Button variant="primary" onClick={() => setModal("add")}>
          + Add item
        </Button>
      </div>

      <div className="filter-row" style={{ gap: 8 }}>
        <input
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 120, maxWidth: 220 }}
        />
        <select
          value={filterCarrier}
          onChange={(e) => setCarrier(e.target.value)}
          style={{ minWidth: 120 }}
        >
          <option value="">All carriers</option>
          {state.characters.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select
          value={filterLocation}
          onChange={(e) => setLoc(e.target.value)}
          style={{ minWidth: 120 }}
        >
          <option value="">All locations</option>
          {state.locations.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
        <select
          value={filterNotable}
          onChange={(e) => setNotable(e.target.value)}
          style={{ minWidth: 120 }}
        >
          <option value="">All items</option>
          <option value="notable">Notable only</option>
          <option value="normal">Normal only</option>
        </select>
      </div>

      <table style={{ width: "100%", minWidth: 600 }}>
        <thead>
          <tr>
            <th style={{ width: "36%" }}>
              <SortButton col="name" sort={sort} onSort={toggleSort}>
                Name
              </SortButton>
            </th>
            <th style={{ width: "18%" }}>
              <SortButton col="holder" sort={sort} onSort={toggleSort}>
                Held by / stored at
              </SortButton>
            </th>
            <th style={{ width: "8%", textAlign: "center" }}>
              <SortButton col="qty" sort={sort} onSort={toggleSort}>
                Qty
              </SortButton>
            </th>
            <th>Tags</th>
            <th style={{ width: "13%" }} />
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={5} className="empty">
                No items found
              </td>
            </tr>
          ) : (
            filtered.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.notable && (
                    <>
                      <Badge variant="notable">notable</Badge>{" "}
                    </>
                  )}
                  {item.srd && (
                    <>
                      <Badge variant="srd">SRD</Badge>{" "}
                    </>
                  )}
                  <span style={{ fontWeight: 500 }}>{item.name}</span>
                  {item.description && (
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--text-secondary)",
                        marginTop: 1,
                      }}
                    >
                      {item.description.slice(0, 120)}
                      {item.description.length > 120 ? "…" : ""}
                    </div>
                  )}
                </td>
                <td>
                  {item.carrier ? (
                    <Badge variant="character">{item.carrier}</Badge>
                  ) : item.location ? (
                    <Badge variant="location">{item.location}</Badge>
                  ) : (
                    <span style={{ color: "var(--text-secondary)" }}>—</span>
                  )}
                </td>
                <td style={{ textAlign: "center" }}>
                  <input
                    className="qty-input"
                    type="number"
                    min={1}
                    value={item.qty}
                    style={{ width: 56 }}
                    onChange={(e) =>
                      onQtyChange(item.id, parseInt(e.target.value) || 1)
                    }
                  />
                </td>
                <td>
                  {item.tags.map((t) => (
                    <>
                      <Badge key={t} variant="neutral">
                        {t}
                      </Badge>{" "}
                    </>
                  ))}
                </td>
                <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                  <Button size="sm" onClick={() => setModal(item)}>
                    Edit
                  </Button>{" "}
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      if (confirm("Delete this item?")) onDelete(item.id);
                    }}
                  >
                    Del
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {modal !== null && (
        <ItemModal
          item={modal === "add" ? undefined : modal}
          characters={state.characters}
          locations={state.locations}
          srdItems={srdItems}
          srdReady={srdReady}
          fetchItemDetail={fetchItemDetail}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
