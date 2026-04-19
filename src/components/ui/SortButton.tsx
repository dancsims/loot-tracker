import type { SortState } from '../../types'

interface SortButtonProps {
  col: string
  sort: SortState
  onSort: (col: string) => void
  children: React.ReactNode
}

export function SortButton({ col, sort, onSort, children }: SortButtonProps) {
  const active = sort.col === col ? sort.dir : ''
  return (
    <button className={`sort-btn ${active}`} onClick={() => onSort(col)}>
      {children}
    </button>
  )
}
