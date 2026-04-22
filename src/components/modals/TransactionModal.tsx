import { useState } from "react";
import { Modal, Field } from "../ui/Modal";
import { Button } from "../ui/Button";
import { uid, isoDate } from "../../utils/data";
import type { Transaction, Currency } from "../../types";

interface Props {
  transaction?: Transaction;
  currencies: Currency[];
  onSave: (tx: Transaction) => void;
  onClose: () => void;
}

export function TransactionModal({
  transaction,
  currencies,
  onSave,
  onClose,
}: Props) {
  const [date, setDate] = useState(transaction?.date ?? isoDate());
  const [desc, setDesc] = useState(transaction?.description ?? "");
  const [note, setNote] = useState(transaction?.note ?? "");
  const [amounts, setAmounts] = useState<Partial<Record<string, string>>>(
    () => {
      const init: Partial<Record<string, string>> = {};
      currencies.forEach((c) => {
        const v = transaction?.amounts[c.id];
        init[c.id] = v !== undefined ? String(v) : "";
      });
      return init;
    },
  );

  function handleSave() {
    if (!desc.trim()) {
      alert("Please enter a description");
      return;
    }
    const parsed: Partial<Record<string, number>> = {};
    currencies.forEach((c) => {
      const v = parseFloat(amounts[c.id] ?? "");
      if (!isNaN(v) && v !== 0) parsed[c.id] = v;
    });
    onSave({
      id: transaction?.id ?? uid(),
      date,
      description: desc.trim(),
      amounts: parsed,
      note,
    });
  }

  return (
    <Modal
      title={transaction ? "Edit transaction" : "Add transaction"}
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </>
      }
    >
      <Field label="Date">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </Field>
      <Field label="Description">
        <input
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="e.g. Sold goblin loot"
        />
      </Field>
      <Field label="Amounts (negative = expense)">
        <div className="amount-grid">
          {currencies.map((c) => (
            <div key={c.id} className="amount-entry">
              <span>
                {c.name} ({c.symbol})
              </span>
              <input
                type="number"
                step="any"
                placeholder="0"
                value={amounts[c.id] ?? ""}
                onChange={(e) =>
                  setAmounts((prev) => ({ ...prev, [c.id]: e.target.value }))
                }
              />
            </div>
          ))}
        </div>
      </Field>
      <Field label="Note (optional)">
        <textarea value={note} onChange={(e) => setNote(e.target.value)} />
      </Field>
    </Modal>
  );
}
