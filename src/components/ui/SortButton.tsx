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
      hideSortIcon={!active}
      sx={{
        fontSize: 11,
        color: "var(--text-secondary) !important",
        "& .MuiTableSortLabel-icon": {
          fontSize: 14,
          color: "var(--text-secondary) !important",
          opacity: 1,
        },
        "&.Mui-active": {
          color: "var(--text-secondary) !important",
        },
        "&.Mui-active .MuiTableSortLabel-icon": {
          color: "var(--text-secondary) !important",
        },
      }}
    >
      {children}
    </TableSortLabel>
  );
}
