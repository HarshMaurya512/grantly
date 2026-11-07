import { useState } from 'react'
import type { Scholarship } from '../data/scholarships'
import { SCHOLARSHIPS } from '../data/scholarships'
import { aidGap, formatRupees, sumSelectedAid } from '../lib/aidCalculator'

interface CalculatorViewProps {
  saved: string[]
  onSelect: (scholarship: Scholarship) => void
}

export default function CalculatorView({ saved, onSelect }: CalculatorViewProps) {
  const [selected, setSelected] = useState<string[]>(() => [...saved])
  const [cost, setCost] = useState('')

  const totalAid = sumSelectedAid(SCHOLARSHIPS, selected)
  const costNumber = Number(cost)
  const hasCost = cost.trim() !== '' && Number.isFinite(costNumber) && costNumber >= 0
  const gap = hasCost ? aidGap(costNumber, totalAid) : null

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const selectedList = SCHOLARSHIPS.filter((s) => selected.includes(s.id))

  return (
    <main id="main-content">
      <h1>Aid calculator</h1>
      <p className="intro">
        Tick the scholarships you plan to use and enter your annual college cost to see how much of it they cover.
        Your saved scholarships are ticked already.
      </p>
      <div className="form">
        <label htmlFor="annual-cost">
          Annual college cost (Rs.)
          <input
            id="annual-cost"
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="Example: 100000"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
        </label>
      </div>
      <section aria-label="Result">
        <div className="stats">
          <div className="stat">
            <span className="stat-num">{formatRupees(totalAid)}</span>
            <span>Total selected aid per year</span>
          </div>
          <div className="stat">
            <span className="stat-num">{hasCost ? formatRupees(costNumber) : 'Not entered'}</span>
            <span>Annual college cost</span>
          </div>
          <div className="stat">
            <span className="stat-num">{gap === null ? 'Enter a cost' : gap > 0 ? `${formatRupees(gap)} short` : gap === 0 ? 'Fully covered' : `${formatRupees(-gap)} surplus`}</span>
            <span>{gap !== null && gap < 0 ? 'Aid is more than the cost' : 'Gap to cover'}</span>
          </div>
        </div>
        <p className="meta">
          Amounts are as listed for each scholarship, per year unless the scholarship text says otherwise.
          This total is an estimate, not a guarantee. Verify each amount on the official portal before applying.
        </p>
      </section>
      <h2>Choose scholarships</h2>
      <ul className="checklist">
        {SCHOLARSHIPS.map((s) => (
          <li key={s.id}>
            <label>
              <input type="checkbox" checked={selected.includes(s.id)} onChange={() => toggle(s.id)} />
              <span>
                <strong>{s.name}</strong> - {s.amountText} - deadline {s.deadline}
              </span>
            </label>
          </li>
        ))}
      </ul>
      {selectedList.length > 0 && (
        <section aria-label="Selected scholarships">
          <h2>Selected ({selectedList.length})</h2>
          <div className="grid">
            {selectedList.map((s) => (
              <article className="card" key={s.id}>
                <h3>{s.name}</h3>
                <p className="amount">{s.amountText}</p>
                <div className="actions">
                  <button className="btn primary" type="button" onClick={() => onSelect(s)}>
                    View details
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
