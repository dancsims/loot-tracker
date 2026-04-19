import { useState } from 'react'
import { Button } from './ui/Button'
import { SortButton } from './ui/SortButton'
import { TransactionModal } from './modals/TransactionModal'
import { getTotals, toGrandTotal, getTransactionsWithBalances, formatSigned } from '../utils/currency'
import type { CampaignState, Transaction, SortState } from '../types'

interface Props {
  state: CampaignState
  onAdd:    (tx: Transaction)  => void
  onUpdate: (tx: Transaction)  => void
  onDelete: (id: string)       => void
}

export function Ledger({ state, onAdd, onUpdate, onDelete }: Props) {
  const [sort, setSort]       = useState<SortState>({ col: 'date', dir: 'desc' })
  const [modal, setModal]     = useState<'add' | Transaction | null>(null)

  const totals  = getTotals(state.transactions, state.currencies)
  const grandGP = toGrandTotal(totals, state.currencies)

  const withBal = getTransactionsWithBalances(state.transactions, state.currencies)
  const sorted  = [...withBal].sort((a, b) => {
    let av: string, bv: string
    if      (sort.col === 'date')        { av = a.date;        bv = b.date }
    else if (sort.col === 'description') { av = a.description; bv = b.description }
    else                                 { av = a.date;        bv = b.date }
    const cmp = av < bv ? -1 : av > bv ? 1 : 0
    return cmp * (sort.dir === 'asc' ? 1 : -1)
  })

  function toggleSort(col: string) {
    setSort(prev =>
      prev.col === col
        ? { col, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
        : { col, dir: 'asc' }
    )
  }

  function handleSave(tx: Transaction) {
    if (modal === 'add') onAdd(tx)
    else onUpdate(tx)
    setModal(null)
  }

  return (
    <>
      <div className="section-header">
        <h2>Transaction ledger</h2>
        <Button variant="primary" onClick={() => setModal('add')}>+ Add transaction</Button>
      </div>

      <div className="table-wrap">
        <table style={{ minWidth: 520 }}>
          <thead>
            <tr>
              <th><SortButton col="date" sort={sort} onSort={toggleSort}>Date</SortButton></th>
              <th><SortButton col="description" sort={sort} onSort={toggleSort}>Description</SortButton></th>
              {state.currencies.map(c => (
                <th key={c.id} style={{ textAlign: 'right', width: 60 }}>
                  <SortButton col={c.id} sort={sort} onSort={toggleSort}>{c.symbol}</SortButton>
                </th>
              ))}
              <th style={{ fontSize: 11 }}>Balance</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0
              ? <tr><td colSpan={state.currencies.length + 4} className="empty">No transactions yet</td></tr>
              : sorted.map(tx => (
                <tr key={tx.id}>
                  <td style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap', width: 90 }}>{tx.date}</td>
                  <td>
                    {tx.description}
                    {tx.note && <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{tx.note}</div>}
                  </td>
                  {state.currencies.map(c => {
                    const a = tx.amounts[c.id]
                    return (
                      <td key={c.id} style={{ textAlign: 'right' }}>
                        {a !== undefined
                          ? <span className={a < 0 ? 'neg' : 'pos'}>{formatSigned(a)}</span>
                          : <span style={{ color: 'var(--border-md)' }}>—</span>}
                      </td>
                    )
                  })}
                  <td style={{ fontSize: 11, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                    {state.currencies
                      .filter(c => (tx.running[c.id] ?? 0) !== 0)
                      .map(c => `${tx.running[c.id]}${c.symbol}`)
                      .join(' ')}
                  </td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap', width: 90 }}>
                    <Button size="sm" onClick={() => setModal(tx)}>Edit</Button>{' '}
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => { if (confirm('Delete this transaction?')) onDelete(tx.id) }}
                    >Del</Button>
                  </td>
                </tr>
              ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} style={{ fontWeight: 500 }}>Totals</td>
              {state.currencies.map(c => (
                <td key={c.id} style={{ textAlign: 'right' }}>
                  <span className={(totals[c.id] ?? 0) < 0 ? 'neg' : 'pos'}>
                    {(totals[c.id] ?? 0).toFixed(2)}
                  </span>
                </td>
              ))}
              <td style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{grandGP.toFixed(2)} gp equiv</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>

      {modal !== null && (
        <TransactionModal
          transaction={modal === 'add' ? undefined : modal}
          currencies={state.currencies}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </>
  )
}
