import { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableFooter,
  TableRow,
  TableCell,
  useMediaQuery,
  useTheme,
  Paper,
} from "@mui/material";
import { Button } from "./ui/Button";
import { SortButton } from "./ui/SortButton";
import { TransactionModal } from "./modals/TransactionModal";
import {
  getTotals,
  toGrandTotal,
  getTransactionsWithBalances,
  formatSigned,
} from "../utils/currency";
import type { CampaignState, Transaction, SortState } from "../types";

interface Props {
  state: CampaignState;
  onAdd: (tx: Transaction) => void;
  onUpdate: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}

const pos = { color: "#3b6d11" };
const neg = { color: "#a32d2d" };

export function Ledger({ state, onAdd, onUpdate, onDelete }: Props) {
  const [sort, setSort] = useState<SortState>({ col: "date", dir: "desc" });
  const [modal, setModal] = useState<"add" | Transaction | null>(null);

  const totals = getTotals(state.transactions, state.currencies);
  const grandGP = toGrandTotal(totals, state.currencies);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const withBal = getTransactionsWithBalances(
    state.transactions,
    state.currencies,
  );
  const sorted = [...withBal].sort((a, b) => {
    const av = sort.col === "description" ? a.description : a.date;
    const bv = sort.col === "description" ? b.description : b.date;
    const cmp = av < bv ? -1 : av > bv ? 1 : 0;
    return cmp * (sort.dir === "asc" ? 1 : -1);
  });
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  // Reset to page 0 whenever sort changes
  useEffect(() => setPage(0), [sort]);

  const paginated = sorted.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  const pageCount = Math.ceil(sorted.length / rowsPerPage);
  const emptyRows = rowsPerPage - paginated.length;

  const paginationControls = pageCount > 1 && (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={1}
      mt={1.5}
    >
      <Button
        size="sm"
        onClick={() => setPage((p) => p - 1)}
        disabled={page === 0}
      >
        ‹ Prev
      </Button>
      <Typography fontSize={12} color="var(--text-secondary)">
        {page + 1} / {pageCount}
      </Typography>
      <Button
        size="sm"
        onClick={() => setPage((p) => p + 1)}
        disabled={page === pageCount - 1}
      >
        Next ›
      </Button>
    </Stack>
  );

  function toggleSort(col: string) {
    setSort((prev) =>
      prev.col === col
        ? { col, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { col, dir: "asc" },
    );
  }

  function handleSave(tx: Transaction) {
    if (modal === "add") onAdd(tx);
    else onUpdate(tx);
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
        <Typography fontWeight={500} fontSize={14} color="var(--text-primary)">
          Transaction ledger
        </Typography>
        <Button variant="primary" onClick={() => setModal("add")}>
          + Add transaction
        </Button>
      </Stack>
      {isMobile && (
        <Paper
          variant="outlined"
          sx={{
            p: 1.5,
            borderRadius: 2,
            backgroundColor: "var(--bg-secondary)",
            mb: 1.5,
          }}
        >
          <Typography fontSize={11} color="var(--text-secondary)" mb={0.5}>
            Totals
          </Typography>
          <Stack direction="row" spacing={1.5} flexWrap="wrap">
            {state.currencies.map((c) => (
              <Typography
                key={c.id}
                fontSize={13}
                sx={(totals[c.id] ?? 0) < 0 ? neg : pos}
              >
                {totals[c.id] ?? 0}
                {c.symbol}
              </Typography>
            ))}
          </Stack>
          <Typography fontSize={11} color="var(--text-secondary)" mt={0.5}>
            {grandGP.toFixed(2)} gp equiv
          </Typography>
        </Paper>
      )}
      {isMobile ? (
        <Stack spacing={1}>
          {sorted.length === 0 ? (
            <Typography
              color="var(--text-secondary)"
              textAlign="center"
              py={3.5}
            >
              No transactions yet
            </Typography>
          ) : (
            sorted.map((tx) => (
              <Paper
                key={tx.id}
                variant="outlined"
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: "var(--bg-secondary)",
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Box flex={1}>
                    <Typography
                      fontSize={13}
                      fontWeight={500}
                      color="var(--text-primary)"
                    >
                      {tx.description}
                    </Typography>
                    {tx.note && (
                      <Typography fontSize={11} color="var(--text-secondary)">
                        {tx.note}
                      </Typography>
                    )}
                    <Typography
                      fontSize={11}
                      color="var(--text-secondary)"
                      mt={0.25}
                    >
                      {tx.date}
                    </Typography>
                    <Stack direction="row" spacing={1} mt={0.5} flexWrap="wrap">
                      {state.currencies.map((c) => {
                        const a = tx.amounts[c.id];
                        return a !== undefined ? (
                          <Typography
                            key={c.id}
                            fontSize={12}
                            sx={a < 0 ? neg : pos}
                          >
                            {formatSigned(a)}
                            {c.symbol}
                          </Typography>
                        ) : null;
                      })}
                    </Stack>
                    <Typography
                      fontSize={11}
                      color="var(--text-secondary)"
                      mt={0.25}
                    >
                      {state.currencies
                        .filter((c) => (tx.running[c.id] ?? 0) !== 0)
                        .map((c) => `${tx.running[c.id]}${c.symbol}`)
                        .join(" ")}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={0.5} ml={1}>
                    <Button size="sm" onClick={() => setModal(tx)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        if (confirm("Delete this transaction?"))
                          onDelete(tx.id);
                      }}
                    >
                      Del
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            ))
          )}
        </Stack>
      ) : (
        <>
          <Box sx={{ overflowX: "auto" }}>
            <Table size="small" sx={{ minWidth: 600 }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: "var(--text-secondary)",
                    }}
                  >
                    <SortButton col="date" sort={sort} onSort={toggleSort}>
                      Date
                    </SortButton>
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 11,
                      fontWeight: 500,
                      color: "var(--text-secondary)",
                    }}
                  >
                    <SortButton
                      col="description"
                      sort={sort}
                      onSort={toggleSort}
                    >
                      Description
                    </SortButton>
                  </TableCell>
                  {state.currencies.map((c) => (
                    <TableCell
                      key={c.id}
                      align="right"
                      sx={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: "var(--text-secondary)",
                        width: 60,
                      }}
                    >
                      <SortButton col={c.id} sort={sort} onSort={toggleSort}>
                        {c.symbol}
                      </SortButton>
                    </TableCell>
                  ))}
                  <TableCell
                    sx={{ fontSize: 11, color: "var(--text-secondary)" }}
                  >
                    Balance
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {sorted.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={state.currencies.length + 4}
                      align="center"
                      sx={{ color: "var(--text-secondary)", py: 3.5 }}
                    >
                      No transactions yet
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((tx) => (
                    <TableRow key={tx.id} sx={{ height: 49 }}>
                      <TableCell
                        sx={{
                          color: "var(--text-secondary)",
                          whiteSpace: "nowrap",
                          width: 90,
                          fontSize: 13,
                          verticalAlign: "top",
                        }}
                      >
                        {tx.date}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: 13,
                          color: "var(--text-primary)",
                          verticalAlign: "top",
                        }}
                      >
                        {tx.description}
                        {tx.note && (
                          <Typography
                            fontSize={11}
                            color="var(--text-secondary)"
                          >
                            {tx.note}
                          </Typography>
                        )}
                      </TableCell>
                      {state.currencies.map((c) => {
                        const a = tx.amounts[c.id];
                        return (
                          <TableCell
                            key={c.id}
                            align="right"
                            sx={{ verticalAlign: "top" }}
                          >
                            {a !== undefined ? (
                              <Typography
                                component="span"
                                fontSize={13}
                                sx={a < 0 ? neg : pos}
                              >
                                {formatSigned(a)}
                              </Typography>
                            ) : (
                              <Typography
                                component="span"
                                color="var(--text-secondary)"
                              >
                                —
                              </Typography>
                            )}
                          </TableCell>
                        );
                      })}
                      <TableCell
                        sx={{
                          fontSize: 11,
                          color: "var(--text-secondary)",
                          whiteSpace: "nowrap",
                          verticalAlign: "top",
                        }}
                      >
                        {state.currencies
                          .filter((c) => (tx.running[c.id] ?? 0) !== 0)
                          .map((c) => `${tx.running[c.id]}${c.symbol}`)
                          .join(" ")}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          whiteSpace: "nowrap",
                          width: 90,
                          verticalAlign: "top",
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={0.5}
                          justifyContent="flex-end"
                        >
                          <Button size="sm" onClick={() => setModal(tx)}>
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => {
                              if (confirm("Delete this transaction?"))
                                onDelete(tx.id);
                            }}
                          >
                            Del
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
                {emptyRows > 0 &&
                  pageCount > 1 &&
                  Array.from({ length: emptyRows }).map((_, i) => (
                    <TableRow key={`empty-${i}`} sx={{ height: 49 }}>
                      <TableCell colSpan={state.currencies.length + 4} />
                    </TableRow>
                  ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell
                    colSpan={2}
                    sx={{
                      fontWeight: 500,
                      bgcolor: "action.hover",
                      borderTop: "0.5px solid rgba(0,0,0,0.22)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Totals
                  </TableCell>
                  {state.currencies.map((c) => (
                    <TableCell
                      key={c.id}
                      align="right"
                      sx={{
                        bgcolor: "action.hover",
                        borderTop: "0.5px solid rgba(0,0,0,0.22)",
                      }}
                    >
                      <Typography
                        component="span"
                        fontSize={13}
                        sx={(totals[c.id] ?? 0) < 0 ? neg : pos}
                      >
                        {(totals[c.id] ?? 0).toFixed(2)}
                      </Typography>
                    </TableCell>
                  ))}
                  <TableCell
                    sx={{
                      fontSize: 11,
                      color: "var(--text-secondary)",
                      bgcolor: "action.hover",
                      borderTop: "0.5px solid rgba(0,0,0,0.22)",
                    }}
                  >
                    {grandGP.toFixed(2)} gp equiv
                  </TableCell>
                  <TableCell
                    sx={{
                      bgcolor: "action.hover",
                      borderTop: "0.5px solid rgba(0,0,0,0.22)",
                    }}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </Box>
          {paginationControls}
        </>
      )}

      {modal !== null && (
        <TransactionModal
          transaction={modal === "add" ? undefined : modal}
          currencies={state.currencies}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </Box>
  );
}
