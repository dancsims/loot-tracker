import { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { SortButton } from "./ui/SortButton";
import { ItemModal } from "./modals/ItemModal";
import type { CampaignState, Item, SortState, SrdItem } from "../types";
// import { BorderColor } from "@mui/icons-material";

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

  const selectMenuProps = {
    PaperProps: {
      sx: {
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
        "& .MuiMenuItem-root": {
          fontSize: 12,
          color: "var(--text-secondary)",
          "&:hover": {
            backgroundColor: "var(--bg-secondary)",
          },
          "&.Mui-selected": {
            backgroundColor: "var(--bg-secondary)",
            color: "var(--text-secondary)",
            "&:hover": {
              backgroundColor: "var(--bg-secondary)",
            },
          },
        },
      },
    },
  };

  const selectSx = {
    fontSize: 12,
    color: "var(--text-secondary)",
    "& .MuiSelect-select": {
      color: "var(--text-secondary)",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--border)",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--border-md)",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--accent)",
    },
  };

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
      if (sort.col === "qty") {
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
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={1.5}
      >
        <Typography fontWeight={500} fontSize={14}>
          Loot tracker
        </Typography>
        <Button variant="primary" onClick={() => setModal("add")}>
          + Add item
        </Button>
      </Stack>

      {/* Filters */}
      <Grid container spacing={1} mb={1.5}>
        <Grid item xs={12} sm={4} md={3}>
          <TextField
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            fullWidth
            inputProps={{
              style: { fontSize: 12, color: "var(--text-primary)" },
            }}
            sx={{
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
            }}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: 12, color: "var(--text-secondary)" }}>
              All carriers
            </InputLabel>
            <Select
              value={filterCarrier}
              label="All carriers"
              onChange={(e) => setCarrier(e.target.value)}
              MenuProps={selectMenuProps}
              sx={selectSx}
            >
              <MenuItem value="" sx={{ color: "var(--text-secondary)" }}>
                <em>All carriers</em>
              </MenuItem>
              {state.characters.map((c) => (
                <MenuItem
                  key={c}
                  value={c}
                  sx={{ fontSize: 12, color: "var(--text-secondary)" }}
                >
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: 12, color: "var(--text-secondary)" }}>
              All locations
            </InputLabel>
            <Select
              value={filterLocation}
              label="All locations"
              onChange={(e) => setLoc(e.target.value)}
              MenuProps={selectMenuProps}
              sx={selectSx}
            >
              <MenuItem value="" sx={{ color: "var(--text-secondary)" }}>
                <em>All locations</em>
              </MenuItem>
              {state.locations.map((l) => (
                <MenuItem
                  key={l}
                  value={l}
                  sx={{ fontSize: 12, color: "var(--text-secondary)" }}
                >
                  {l}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel sx={{ fontSize: 12, color: "var(--text-secondary)" }}>
              All items
            </InputLabel>
            <Select
              value={filterNotable}
              label="All items"
              onChange={(e) => setNotable(e.target.value)}
              MenuProps={selectMenuProps}
              sx={selectSx}
            >
              <MenuItem value="" sx={{ color: "var(--text-secondary)" }}>
                <em>All items</em>
              </MenuItem>
              <MenuItem
                value="notable"
                sx={{ fontSize: 12, color: "var(--text-secondary)" }}
              >
                Notable only
              </MenuItem>
              <MenuItem
                value="normal"
                sx={{ fontSize: 12, color: "var(--text-secondary)" }}
              >
                Normal only
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                  width: "36%",
                  minWidth: 200,
                }}
              >
                <SortButton col="name" sort={sort} onSort={toggleSort}>
                  Name
                </SortButton>
              </TableCell>
              <TableCell
                sx={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                  width: "18%",
                }}
              >
                <SortButton col="holder" sort={sort} onSort={toggleSort}>
                  Held By/At
                </SortButton>
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                  width: "8%",
                }}
              >
                <SortButton col="qty" sort={sort} onSort={toggleSort}>
                  Qty
                </SortButton>
              </TableCell>
              <TableCell
                sx={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                }}
              >
                Tags
              </TableCell>
              <TableCell sx={{ width: "13%" }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                  sx={{ color: "var(--text-secondary)", py: 3.5 }}
                >
                  No items found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Stack
                      direction="row"
                      spacing={0.5}
                      flexWrap="wrap"
                      alignItems="center"
                      mb={0.25}
                    >
                      {item.notable && <Badge variant="notable">notable</Badge>}
                      {item.srd && <Badge variant="srd">SRD</Badge>}
                      <Typography
                        fontWeight={500}
                        fontSize={13}
                        color="var(--text-primary)"
                      >
                        {item.name}
                      </Typography>
                    </Stack>
                    {item.description && (
                      <Typography fontSize={11} color="var(--text-secondary)">
                        {item.description.slice(0, 120)}
                        {item.description.length > 120 ? "…" : ""}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.carrier ? (
                      <Badge variant="character">{item.carrier}</Badge>
                    ) : item.location ? (
                      <Badge variant="location">{item.location}</Badge>
                    ) : (
                      <Typography color="text.secondary">—</Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <TextField
                      type="number"
                      size="small"
                      value={item.qty}
                      inputProps={{
                        min: 1,
                        style: {
                          textAlign: "center",
                          width: 44,
                          fontSize: 12,
                          padding: "3px 4px",
                        },
                      }}
                      onChange={(e) =>
                        onQtyChange(item.id, parseInt(e.target.value) || 1)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                      {item.tags.map((t) => (
                        <Badge key={t} variant="neutral">
                          {t}
                        </Badge>
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={0.5}
                      justifyContent="flex-end"
                    >
                      <Button size="sm" onClick={() => setModal(item)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => {
                          if (confirm("Delete this item?")) onDelete(item.id);
                        }}
                      >
                        Del
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Box>

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
    </Box>
  );
}
