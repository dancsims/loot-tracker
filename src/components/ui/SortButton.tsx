import { TableSortLabel } from "@mui/material";
import type { SortState } from "../../types";

interface SortButtonProps {
  col: string;
  sort: SortState;
  onSort: (col: string) => void;
  children: React.ReactNode;
}

export function SortButton({ col, sort, onSort, children }: SortButtonProps) {
  const active = sort.col === col;
  return (
    <TableSortLabel
      active={active}
      direction={active ? sort.dir : "asc"}
      onClick={() => onSort(col)}
      sx={{ fontSize: 11, color: "text.secondary", "& .MuiTableSortLabel-icon": { fontSize: 14 } }}
    >
      {children}
    </TableSortLabel>
  );
}
