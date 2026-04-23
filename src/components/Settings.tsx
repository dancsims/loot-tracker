import { useState } from "react";
import { Box, Stack, Typography, TextField, Paper } from "@mui/material";
import { Button } from "./ui/Button";
import { uid } from "../utils/data";
import type { CampaignState, Currency } from "../types";

interface Props {
  state: CampaignState;
  onUpdate: (patch: Partial<CampaignState>) => void;
  onReset: () => void;
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="overline"
      color="var(--text-secondary)"
      fontSize={11}
      letterSpacing="0.04em"
      display="block"
      mb={1}
    >
      {children}
    </Typography>
  );
}

function ListItem({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 1.25,
        py: 0.75,
        mb: 0.625,
        borderRadius: 2,
        backgroundColor: "var(--bg-tertiary)",
      }}
    >
      <Typography fontSize={13} color="var(--text-primary)">
        {label}
      </Typography>
      <Button size="sm" variant="danger" onClick={onRemove}>
        Remove
      </Button>
    </Paper>
  );
}

export function Settings({ state, onUpdate, onReset }: Props) {
  const [newCurrName, setNewCurrName] = useState("");
  const [newCurrSym, setNewCurrSym] = useState("");
  const [newCurrRate, setNewCurrRate] = useState("");
  const [newChar, setNewChar] = useState("");
  const [newLoc, setNewLoc] = useState("");

  function addCurrency() {
    const rate = parseFloat(newCurrRate);
    if (!newCurrName.trim() || !newCurrSym.trim() || isNaN(rate)) {
      alert("Fill in all currency fields");
      return;
    }
    const c: Currency = {
      id: uid(),
      name: newCurrName.trim(),
      symbol: newCurrSym.trim(),
      rate,
    };
    onUpdate({ currencies: [...state.currencies, c] });
    setNewCurrName("");
    setNewCurrSym("");
    setNewCurrRate("");
  }

  function addChar() {
    const v = newChar.trim();
    if (!v) return;
    onUpdate({ characters: [...state.characters, v] });
    setNewChar("");
  }

  function addLoc() {
    const v = newLoc.trim();
    if (!v) return;
    onUpdate({ locations: [...state.locations, v] });
    setNewLoc("");
  }

  const inputProps = {
    style: { fontSize: 13, color: "var(--text-secondary)" },
  };
  const sxSmall = {
    "& .MuiInputBase-input": { py: "7px", fontSize: 13 },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "var(--border)",
      },
      "&:hover fieldset": {
        borderColor: "var(--border-md)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "var(--accent)",
      },
    },
    "& label, & .MuiInputLabel-root": {
      color: "var(--text-secondary)",
    },
  };

  return (
    <Box>
      {/* Campaign */}
      <Box mb={3}>
        <SectionHeader>Campaign</SectionHeader>
        <TextField
          label="Campaign name"
          value={state.campaign}
          onChange={(e) => onUpdate({ campaign: e.target.value })}
          size="small"
          sx={{
            minWidth: 220,
            maxWidth: 320,
            ...sxSmall,
          }}
          inputProps={inputProps}
        />
      </Box>

      {/* Currencies */}
      <Box mb={3}>
        <SectionHeader>Currencies</SectionHeader>
        {state.currencies.map((c) => (
          <ListItem
            key={c.id}
            label={`${c.name} (${c.symbol}) — 1 ${c.symbol} = ${c.rate} gp`}
            onRemove={() =>
              onUpdate({
                currencies: state.currencies.filter((x) => x.id !== c.id),
              })
            }
          />
        ))}
        <Stack direction="row" spacing={0.75} mt={0.75} flexWrap="wrap">
          <TextField
            placeholder="Name"
            value={newCurrName}
            onChange={(e) => setNewCurrName(e.target.value)}
            size="small"
            sx={{ width: 130, ...sxSmall }}
            inputProps={inputProps}
          />
          <TextField
            placeholder="Symbol"
            value={newCurrSym}
            onChange={(e) => setNewCurrSym(e.target.value)}
            size="small"
            sx={{ width: 80, ...sxSmall }}
            inputProps={inputProps}
          />
          <TextField
            placeholder="GP rate"
            value={newCurrRate}
            onChange={(e) => setNewCurrRate(e.target.value)}
            size="small"
            type="number"
            inputProps={{ ...inputProps, step: "0.01" }}
            sx={{ width: 90, ...sxSmall }}
          />
          <Button onClick={addCurrency}>Add</Button>
        </Stack>
      </Box>

      {/* Characters */}
      <Box mb={3}>
        <SectionHeader>Characters</SectionHeader>
        {state.characters.map((c, i) => (
          <ListItem
            key={i}
            label={c}
            onRemove={() => {
              const next = [...state.characters];
              next.splice(i, 1);
              onUpdate({ characters: next });
            }}
          />
        ))}
        <Stack direction="row" spacing={0.75} mt={0.75}>
          <TextField
            placeholder="Character name"
            value={newChar}
            onChange={(e) => setNewChar(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addChar();
            }}
            size="small"
            sx={{ minWidth: 160, ...sxSmall }}
            inputProps={inputProps}
          />
          <Button onClick={addChar}>Add</Button>
        </Stack>
      </Box>

      {/* Locations */}
      <Box mb={3}>
        <SectionHeader>Locations</SectionHeader>
        {state.locations.map((l, i) => (
          <ListItem
            key={i}
            label={l}
            onRemove={() => {
              const next = [...state.locations];
              next.splice(i, 1);
              onUpdate({ locations: next });
            }}
          />
        ))}
        <Stack direction="row" spacing={0.75} mt={0.75}>
          <TextField
            placeholder="Location name"
            value={newLoc}
            onChange={(e) => setNewLoc(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addLoc();
            }}
            size="small"
            sx={{ minWidth: 160, ...sxSmall }}
            inputProps={inputProps}
          />
          <Button onClick={addLoc}>Add</Button>
        </Stack>
      </Box>

      {/* Data */}
      <Box mb={3}>
        <SectionHeader>Data</SectionHeader>
        <Button
          variant="danger"
          onClick={() => {
            if (confirm("Reset ALL data to defaults?")) onReset();
          }}
        >
          Reset to defaults
        </Button>
      </Box>
    </Box>
  );
}
