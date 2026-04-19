export interface Currency {
  id: string
  name: string
  symbol: string
  /** Value in GP. e.g. cp = 0.01, sp = 0.1, gp = 1, pp = 10 */
  rate: number
}

export interface Transaction {
  id: string
  date: string // ISO date string YYYY-MM-DD
  description: string
  /** Map of currency id → amount (negative = expense) */
  amounts: Partial<Record<string, number>>
  note: string
}

/** A transaction with a running balance snapshot attached (computed, not stored) */
export interface TransactionWithBalance extends Transaction {
  running: Record<string, number>
}

export interface Item {
  id: string
  name: string
  description: string
  /** Character carrying the item, or null */
  carrier: string | null
  /** Location where item is stored (only used when carrier is null) */
  location: string | null
  notable: boolean
  qty: number
  tags: string[]
  /** True if populated from the D&D 5e SRD API */
  srd: boolean
}

export interface CampaignState {
  campaign: string
  currencies: Currency[]
  transactions: Transaction[]
  items: Item[]
  locations: string[]
  characters: string[]
}

/** A magic item entry returned from dnd5eapi.co */
export interface SrdItem {
  index: string
  name: string
  description: string
  tags: string[]
}

export type SortDir = 'asc' | 'desc'

export interface SortState {
  col: string
  dir: SortDir
}

export type TabId = 'dashboard' | 'transactions' | 'items' | 'settings'
