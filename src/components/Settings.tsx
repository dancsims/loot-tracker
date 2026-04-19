import { useState } from 'react'
import { Button } from './ui/Button'
import { uid } from '../utils/data'
import type { CampaignState, Currency } from '../types'

interface Props {
  state: CampaignState
  onUpdate: (patch: Partial<CampaignState>) => void
  onReset:  () => void
}

export function Settings({ state, onUpdate, onReset }: Props) {
  const [newCurrName, setNewCurrName] = useState('')
  const [newCurrSym,  setNewCurrSym]  = useState('')
  const [newCurrRate, setNewCurrRate] = useState('')
  const [newChar,     setNewChar]     = useState('')
  const [newLoc,      setNewLoc]      = useState('')

  function addCurrency() {
    const rate = parseFloat(newCurrRate)
    if (!newCurrName.trim() || !newCurrSym.trim() || isNaN(rate)) {
      alert('Fill in all currency fields'); return
    }
    const c: Currency = { id: uid(), name: newCurrName.trim(), symbol: newCurrSym.trim(), rate }
    onUpdate({ currencies: [...state.currencies, c] })
    setNewCurrName(''); setNewCurrSym(''); setNewCurrRate('')
  }

  function deleteCurrency(id: string) {
    onUpdate({ currencies: state.currencies.filter(c => c.id !== id) })
  }

  function addChar() {
    const v = newChar.trim(); if (!v) return
    onUpdate({ characters: [...state.characters, v] })
    setNewChar('')
  }

  function deleteChar(i: number) {
    const next = [...state.characters]; next.splice(i, 1)
    onUpdate({ characters: next })
  }

  function addLoc() {
    const v = newLoc.trim(); if (!v) return
    onUpdate({ locations: [...state.locations, v] })
    setNewLoc('')
  }

  function deleteLoc(i: number) {
    const next = [...state.locations]; next.splice(i, 1)
    onUpdate({ locations: next })
  }

  return (
    <div style={{ minWidth: 700, maxWidth: 900, margin: '0 auto' }}>
      {/* Campaign name */}
      <div className="settings-section">
        <h3>Campaign</h3>
        <div className="field">
          <label>Campaign name</label>
          <input
            value={state.campaign}
            style={{ minWidth: 220, maxWidth: 320 }}
            onChange={e => onUpdate({ campaign: e.target.value })}
          />
        </div>
      </div>

      {/* Currencies */}
      <div className="settings-section">
        <h3>Currencies</h3>
        {state.currencies.map(c => (
          <div className="list-item" key={c.id}>
            <span>
              <strong style={{ fontWeight: 500 }}>{c.name}</strong>
              {' '}({c.symbol}) — 1 {c.symbol} = {c.rate} gp
            </span>
            <Button size="sm" variant="danger" onClick={() => deleteCurrency(c.id)}>Remove</Button>
          </div>
        ))}
        <div className="add-inline">
          <input placeholder="Name"      value={newCurrName} onChange={e => setNewCurrName(e.target.value)} style={{ minWidth: 100, maxWidth: 140 }} />
          <input placeholder="Symbol"    value={newCurrSym}  onChange={e => setNewCurrSym(e.target.value)}  style={{ width: 72 }} />
          <input placeholder="GP rate"   value={newCurrRate} onChange={e => setNewCurrRate(e.target.value)} style={{ width: 82 }} type="number" step="0.01" />
          <Button onClick={addCurrency}>Add</Button>
        </div>
      </div>

      {/* Characters */}
      <div className="settings-section">
        <h3>Characters</h3>
        {state.characters.map((c, i) => (
          <div className="list-item" key={i}>
            <span>{c}</span>
            <Button size="sm" variant="danger" onClick={() => deleteChar(i)}>Remove</Button>
          </div>
        ))}
        <div className="add-inline">
          <input
            placeholder="Character name"
            value={newChar}
            style={{ minWidth: 140, maxWidth: 200 }}
            onChange={e => setNewChar(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addChar() }}
          />
          <Button onClick={addChar}>Add</Button>
        </div>
      </div>

      {/* Locations */}
      <div className="settings-section">
        <h3>Locations</h3>
        {state.locations.map((l, i) => (
          <div className="list-item" key={i}>
            <span>{l}</span>
            <Button size="sm" variant="danger" onClick={() => deleteLoc(i)}>Remove</Button>
          </div>
        ))}
        <div className="add-inline">
          <input
            placeholder="Location name"
            value={newLoc}
            style={{ minWidth: 140, maxWidth: 200 }}
            onChange={e => setNewLoc(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addLoc() }}
          />
          <Button onClick={addLoc}>Add</Button>
        </div>
      </div>

      {/* Data */}
      <div className="settings-section">
        <h3>Data</h3>
        <Button
          variant="danger"
          onClick={() => { if (confirm('Reset ALL data to defaults?')) onReset() }}
        >
          Reset to defaults
        </Button>
      </div>
    </div>
  )
}
