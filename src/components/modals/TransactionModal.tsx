import { useState } from "react";
import { Grid, TextField, Box, Typography } from "@mui/material";
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

const inputSx = {
  "& .MuiInputBase-input": { fontSize: 13, color: "var(--text-primary)" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "var(--border)" },
    "&:hover fieldset": { borderColor: "var(--border-md)" },
    "&.Mui-focused fieldset": { borderColor: "var(--accent)" },
  },
};

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
        <TextField
          fullWidth
          size="small"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          sx={inputSx}
          inputProps={{ style: { fontSize: 13 } }}
        />
      </Field>

      <Field label="Description">
        <TextField
          fullWidth
          size="small"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="e.g. Sold goblin loot"
          sx={inputSx}
          inputProps={{ style: { fontSize: 13 } }}
        />
      </Field>

      <Field label="Amounts (negative = expense)">
        <Box sx={{ display: "grid", gap: 0.625 }}>
          {currencies.map((c) => (
            <Grid container key={c.id} alignItems="center" spacing={1}>
              <Grid item xs>
                <Typography fontSize={13} color="var(--text-secondary)">
                  {c.name} ({c.symbol})
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  placeholder="0"
                  value={amounts[c.id] ?? ""}
                  onChange={(e) =>
                    setAmounts((prev) => ({ ...prev, [c.id]: e.target.value }))
                  }
                  inputProps={{ step: "any", style: { fontSize: 13 } }}
                  sx={inputSx}
                />
              </Grid>
            </Grid>
          ))}
        </Box>
      </Field>

      <Field label="Note (optional)">
        <TextField
          fullWidth
          multiline
          minRows={2}
          size="small"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          sx={inputSx}
          inputProps={{ style: { fontSize: 13 } }}
        />
      </Field>
    </Modal>
  );
}
