import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Stack,
} from "@mui/material";
import { Badge } from "./ui/Badge";
import { getTotals, toGrandTotal } from "../utils/currency";
import type { CampaignState } from "../types";

interface Props {
  state: CampaignState;
}

const pos = { color: "#3b6d11" };
const neg = { color: "#a32d2d" };

export function Dashboard({ state }: Props) {
  const totals = getTotals(state.transactions, state.currencies);
  const grandGP = toGrandTotal(totals, state.currencies);
  const notable = state.items.filter((i) => i.notable);
  const recent = [...state.transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <Box>
      {/* Currency metrics */}
      <Grid container spacing={1} mb={2} alignItems="stretch">
        {state.currencies.map((c) => {
          const v = totals[c.id] ?? 0;
          return (
            <Grid item xs={6} sm={4} md={2} key={c.id}>
              <Paper
                variant="outlined"
                sx={{
                  p: 1.25,
                  borderRadius: 2,
                  backgroundColor: "var(--bg-tertiary)",
                }}
              >
                <Typography
                  variant="caption"
                  color="var(--text-secondary)"
                  display="block"
                  fontSize={10}
                >
                  {c.name} ({c.symbol})
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: 20,
                    fontWeight: 500,
                    color: "var(--text-primary)",
                    ...(v < 0 ? neg : {}),
                  }}
                >
                  {v.toLocaleString()}{" "}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
        <Grid item xs={6} sm={4} md={2}>
          <Paper
            variant="outlined"
            sx={{
              p: 1.25,
              borderRadius: 2,
              backgroundColor: "var(--bg-tertiary)",
            }}
          >
            <Typography
              variant="caption"
              color="var(--text-secondary)"
              display="block"
              fontSize={10}
            >
              Total (gpe)
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontSize: 20,
                fontWeight: 500,
                color: "var(--text-primary)",
                ...(grandGP < 0 ? neg : {}),
              }}
            >
              {grandGP.toFixed(2)}{" "}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {/* Notable loot */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{ backgroundColor: "var(--bg-primary)", p: 2, borderRadius: 2 }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography
              fontWeight={500}
              fontSize={14}
              color="var(--text-primary)"
            >
              Notable loot
            </Typography>
            <Typography variant="caption" color="var(--text-secondary)">
              {notable.length} item{notable.length !== 1 ? "s" : ""}
            </Typography>
          </Stack>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: "var(--text-secondary)",
                  }}
                >
                  Item
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: "var(--text-secondary)",
                  }}
                >
                  Held by / stored at
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notable.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    align="center"
                    sx={{ color: "var(--text-secondary)", py: 3.5 }}
                  >
                    No notable items yet
                  </TableCell>
                </TableRow>
              ) : (
                notable.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell>
                      <Typography
                        fontWeight={500}
                        fontSize={13}
                        color="var(--text-primary)"
                      >
                        {i.name}
                      </Typography>
                      {i.qty > 1 && (
                        <>
                          {" "}
                          <Badge variant="neutral">×{i.qty}</Badge>
                        </>
                      )}
                    </TableCell>
                    <TableCell>
                      {i.carrier ? (
                        <Badge variant="character">{i.carrier}</Badge>
                      ) : i.location ? (
                        <Badge variant="location">{i.location}</Badge>
                      ) : (
                        <Typography color="text.secondary">—</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Grid>

        {/* Recent transactions */}
        <Grid item xs={12} md={6}>
          <Typography
            fontWeight={500}
            fontSize={14}
            mb={1}
            color="var(--text-primary)"
          >
            Recent transactions
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: "var(--text-secondary)",
                  }}
                >
                  Date
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: "var(--text-secondary)",
                  }}
                >
                  Description
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: "var(--text-secondary)",
                  }}
                >
                  Amount
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recent.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    align="center"
                    sx={{ color: "var(--text-secondary)", py: 3.5 }}
                  >
                    No transactions yet
                  </TableCell>
                </TableRow>
              ) : (
                recent.map((tx) => {
                  const parts = Object.entries(tx.amounts).map(([cid, a]) => (
                    <Typography
                      key={cid}
                      component="span"
                      fontSize={13}
                      sx={a! < 0 ? neg : pos}
                    >
                      {a! > 0 ? "+" : ""}
                      {a} {cid}
                    </Typography>
                  ));
                  return (
                    <TableRow key={tx.id}>
                      <TableCell
                        sx={{
                          color: "var(--text-secondary)",
                          whiteSpace: "nowrap",
                          width: 90,
                          fontSize: 13,
                        }}
                      >
                        {tx.date}
                      </TableCell>
                      <TableCell
                        sx={{ fontSize: 13, color: "var(--text-primary)" }}
                      >
                        {tx.description}
                      </TableCell>
                      <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                        <Stack
                          direction="row"
                          spacing={0.5}
                          justifyContent="flex-end"
                        >
                          {parts}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </Box>
  );
}
