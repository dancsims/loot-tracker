import { Badge } from './ui/Badge'
import { getTotals, toGrandTotal } from '../utils/currency'
import type { CampaignState } from '../types'

interface Props {
  state: CampaignState
}

export function Dashboard({ state }: Props) {
  const totals  = getTotals(state.transactions, state.currencies)
  const grandGP = toGrandTotal(totals, state.currencies)
  const notable = state.items.filter(i => i.notable)
  const recent  = [...state.transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)

  return (
    <>
      {/* Currency metrics */}
      <div className="metrics">
        {state.currencies.map(c => {
          const v = totals[c.id] ?? 0
          return (
            <div className="metric" key={c.id}>
              <div className="metric-label">{c.name}</div>
              <div className={`metric-value ${v < 0 ? 'neg' : ''}`}>
                {v.toLocaleString()}{' '}
                <span style={{ fontSize: 12, fontWeight: 400 }}>{c.symbol}</span>
              </div>
            </div>
          )
        })}
        <div className="metric" style={{ border: '0.5px solid rgba(83,74,183,0.25)' }}>
          <div className="metric-label">Total (gp equiv)</div>
          <div className={`metric-value ${grandGP < 0 ? 'neg' : ''}`}>
            {grandGP.toFixed(2)}{' '}
            <span style={{ fontSize: 12, fontWeight: 400 }}>gp</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Notable loot */}
        <div>
          <div className="section-header">
            <h2>Notable loot</h2>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              {notable.length} item{notable.length !== 1 ? 's' : ''}
            </span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Held by / stored at</th>
              </tr>
            </thead>
            <tbody>
              {notable.length === 0
                ? <tr><td colSpan={2} className="empty">No notable items yet</td></tr>
                : notable.map(i => (
                  <tr key={i.id}>
                    <td>
                      <span style={{ fontWeight: 500 }}>{i.name}</span>
                      {i.qty > 1 && <> <Badge variant="neutral">×{i.qty}</Badge></>}
                    </td>
                    <td>
                      {i.carrier
                        ? <Badge variant="character">{i.carrier}</Badge>
                        : i.location
                          ? <Badge variant="location">{i.location}</Badge>
                          : <span style={{ color: 'var(--text-secondary)' }}>—</span>}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Recent transactions */}
        <div>
          <div className="section-header"><h2>Recent transactions</h2></div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0
                ? <tr><td colSpan={3} className="empty">No transactions yet</td></tr>
                : recent.map(tx => {
                  const parts = Object.entries(tx.amounts).map(([cid, a]) => (
                    <span key={cid} className={a! < 0 ? 'neg' : 'pos'}>
                      {a! > 0 ? '+' : ''}{a} {cid}
                    </span>
                  ))
                  return (
                    <tr key={tx.id}>
                      <td style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap', width: 90 }}>{tx.date}</td>
                      <td>{tx.description}</td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        {parts.reduce<React.ReactNode[]>((acc, el, i) => i === 0 ? [el] : [...acc, ' ', el], [])}
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
