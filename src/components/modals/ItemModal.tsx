import { useState, useRef, useEffect } from "react";
import { Modal, Field } from "../ui/Modal";
import { Button } from "../ui/Button";
import { uid } from "../../utils/data";
import type { Item, SrdItem } from "../../types";

interface Props {
  item?: Item;
  characters: string[];
  locations: string[];
  srdItems: SrdItem[];
  srdReady: boolean;
  fetchItemDetail: (index: string) => Promise<SrdItem | null>;
  onSave: (item: Item) => void;
  onClose: () => void;
}

export function ItemModal({
  item,
  characters,
  locations,
  srdItems,
  srdReady,
  fetchItemDetail,
  onSave,
  onClose,
}: Props) {
  const [name, setName] = useState(item?.name ?? "");
  const [description, setDesc] = useState(item?.description ?? "");
  const [qty, setQty] = useState(item?.qty ?? 1);
  const [carrier, setCarrier] = useState(item?.carrier ?? "");
  const [location, setLocation] = useState(item?.location ?? "");
  const [tags, setTags] = useState(item?.tags.join(", ") ?? "");
  const [notable, setNotable] = useState(item?.notable ?? false);
  const [isSrd, setIsSrd] = useState(item?.srd ?? false);
  const [matches, setMatches] = useState<SrdItem[]>([]);
  const [showDrop, setShowDrop] = useState(false);
  const [fetching, setFetching] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  function onNameChange(val: string) {
    setName(val);
    setIsSrd(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (!srdReady || val.length < 2) {
      setShowDrop(false);
      return;
    }
    timeoutRef.current = setTimeout(() => {
      const found = srdItems
        .filter((s) => s.name.toLowerCase().includes(val.toLowerCase()))
        .slice(0, 8);
      setMatches(found);
      setShowDrop(found.length > 0);
    }, 150);
  }

  async function selectSrd(s: SrdItem) {
    setShowDrop(false);
    setName(s.name);
    setFetching(true);
    const detail = await fetchItemDetail(s.index);
    setFetching(false);
    if (detail) {
      setDesc(detail.description);
      setTags(detail.tags.join(", "));
    }
    setIsSrd(true);
  }

  function handleSave() {
    if (!name.trim()) {
      alert("Please enter an item name");
      return;
    }
    onSave({
      id: item?.id ?? uid(),
      name: name.trim(),
      description: description.trim(),
      qty: Math.max(1, qty),
      carrier: carrier || null,
      location: carrier ? null : location || null,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      notable,
      srd: isSrd,
    });
  }

  return (
    <Modal
      title={item ? "Edit item" : "Add item"}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} disabled={fetching}>
            {fetching ? "Loading…" : "Save"}
          </Button>
        </>
      }
    >
      <Field
        label="Name"
        hint={
          srdReady ? (
            <span style={{ color: "var(--accent)", fontSize: 10 }}>
              {fetching ? "Fetching SRD data…" : "(SRD autocomplete active)"}
            </span>
          ) : undefined
        }
      >
        <div className="srd-autocomplete">
          <input
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Item name"
            autoComplete="off"
            disabled={fetching}
          />
          {showDrop && (
            <div className="srd-dropdown">
              {matches.map((m) => (
                <div
                  key={m.index}
                  className="srd-option"
                  onMouseDown={() => selectSrd(m)}
                >
                  {m.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </Field>

      <Field label="Description">
        <textarea
          value={description}
          onChange={(e) => setDesc(e.target.value)}
          style={{ width: "100%" }}
          disabled={fetching}
        />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Quantity">
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(parseInt(e.target.value) || 1)}
          />
        </Field>
        <Field label="Carried by">
          <select value={carrier} onChange={(e) => setCarrier(e.target.value)}>
            <option value="">— none —</option>
            {characters.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Stored at">
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={!!carrier}
          >
            <option value="">— none —</option>
            {locations.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </Field>
        <Field label="Tags (comma separated)">
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="magic, wondrous"
          />
        </Field>
      </div>

      <div
        className="field"
        style={{ display: "flex", alignItems: "center", gap: 8 }}
      >
        <input
          type="checkbox"
          id="item-notable"
          checked={notable}
          onChange={(e) => setNotable(e.target.checked)}
          style={{ flexShrink: 0 }}
        />
        <label
          htmlFor="item-notable"
          style={{
            fontSize: 13,
            color: "var(--text-primary)",
            textTransform: "none",
            letterSpacing: 0,
          }}
        >
          Mark as notable item
        </label>
      </div>
    </Modal>
  );
}
