import { useState, useRef, useEffect } from "react";
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormControlLabel,
  Checkbox,
  Paper,
  Typography,
  Box,
} from "@mui/material";
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
  onSave: (item: Item) => void;
  onClose: () => void;
}

const inputSx = { "& .MuiInputBase-input": { fontSize: 13 } };

export function ItemModal({
  item,
  characters,
  locations,
  srdItems,
  srdReady,
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

  function selectSrd(s: SrdItem) {
    setName(s.name);
    setDesc(s.description);
    setTags(s.tags.join(", "));
    setIsSrd(true);
    setShowDrop(false);
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
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </>
      }
    >
      <Field
        label="Name"
        hint={
          srdReady ? (
            <Typography
              component="span"
              sx={{ color: "primary.main", fontSize: 10 }}
            >
              (SRD autocomplete active)
            </Typography>
          ) : undefined
        }
      >
        <Box sx={{ position: "relative" }}>
          <TextField
            fullWidth
            size="small"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Item name"
            autoComplete="off"
            sx={inputSx}
            inputProps={{ style: { fontSize: 13 } }}
          />
          {showDrop && (
            <Paper
              elevation={3}
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                zIndex: 50,
                maxHeight: 180,
                overflowY: "auto",
                mt: 0.25,
                borderRadius: 1,
              }}
            >
              {matches.map((m) => (
                <Box
                  key={m.index}
                  onMouseDown={() => selectSrd(m)}
                  sx={{
                    px: 1.25,
                    py: 0.875,
                    fontSize: 13,
                    cursor: "pointer",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  {m.name}
                </Box>
              ))}
            </Paper>
          )}
        </Box>
      </Field>

      <Field label="Description">
        <TextField
          fullWidth
          multiline
          minRows={2}
          size="small"
          value={description}
          onChange={(e) => setDesc(e.target.value)}
          sx={inputSx}
          inputProps={{ style: { fontSize: 13 } }}
        />
      </Field>

      <Grid container spacing={1.25}>
        <Grid item xs={6}>
          <Field label="Quantity">
            <TextField
              fullWidth
              size="small"
              type="number"
              value={qty}
              onChange={(e) => setQty(parseInt(e.target.value) || 1)}
              inputProps={{ min: 1, style: { fontSize: 13 } }}
              sx={inputSx}
            />
          </Field>
        </Grid>
        <Grid item xs={6}>
          <Field label="Carried by">
            <FormControl fullWidth size="small">
              <Select
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                displayEmpty
                sx={{ fontSize: 13 }}
              >
                <MenuItem value="">
                  <em>— none —</em>
                </MenuItem>
                {characters.map((c) => (
                  <MenuItem key={c} value={c} sx={{ fontSize: 13 }}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Field>
        </Grid>
      </Grid>

      <Grid container spacing={1.25}>
        <Grid item xs={6}>
          <Field label="Stored at">
            <FormControl fullWidth size="small" disabled={!!carrier}>
              <Select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                displayEmpty
                sx={{ fontSize: 13 }}
              >
                <MenuItem value="">
                  <em>— none —</em>
                </MenuItem>
                {locations.map((l) => (
                  <MenuItem key={l} value={l} sx={{ fontSize: 13 }}>
                    {l}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Field>
        </Grid>
        <Grid item xs={6}>
          <Field label="Tags (comma separated)">
            <TextField
              fullWidth
              size="small"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="magic, wondrous"
              sx={inputSx}
              inputProps={{ style: { fontSize: 13 } }}
            />
          </Field>
        </Grid>
      </Grid>

      <FormControlLabel
        control={
          <Checkbox
            checked={notable}
            onChange={(e) => setNotable(e.target.checked)}
            size="small"
          />
        }
        label={<Typography fontSize={13}>Mark as notable item</Typography>}
      />
    </Modal>
  );
}
