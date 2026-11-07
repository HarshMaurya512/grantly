import type { Scholarship } from '../data/scholarships'
import { daysLeft, formatDate } from '../data/scholarships'

interface CompareViewProps {
  scholarships: Scholarship[]
  onRemove: (id: string) => void
  onClear: () => void
  onSelect: (scholarship: Scholarship) => void
}

export default function CompareView({ scholarships, onRemove, onClear, onSelect }: CompareViewProps) {
  return (
    <main id="main-content">
      <h1>Compare scholarships</h1>
      <p className="intro">Compare up to 3 scholarships side by side. Add scholarships from Discover with the Compare button on a card.</p>
      {scholarships.length < 2 ? (
        <div className="empty-state">
          <h2>Select at least 2 scholarships to compare</h2>
          <p>You have {scholarships.length} selected. Go to Discover and use Compare on up to 3 scholarship cards.</p>
        </div>
      ) : (
        <>
          <div className="actions compare-actions">
            <button className="btn" type="button" onClick={onClear}>Clear comparison</button>
          </div>
          <div className="table-wrap">
            <table className="compare-table">
              <caption className="compare-caption">Side by side comparison of selected scholarships</caption>
              <thead>
                <tr>
                  <th scope="col">Scholarship</th>
                  {scholarships.map((s) => (
                    <th scope="col" key={s.id}>{s.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Amount</th>
                  {scholarships.map((s) => (
                    <td key={s.id}>{s.amountText}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Deadline</th>
                  {scholarships.map((s) => (
                    <td key={s.id}>{formatDate(s.deadline)} ({daysLeft(s.deadline)} days left)</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Level</th>
                  {scholarships.map((s) => (
                    <td key={s.id}>{s.level}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Category</th>
                  {scholarships.map((s) => (
                    <td key={s.id}>{s.category}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Income limit</th>
                  {scholarships.map((s) => (
                    <td key={s.id}>Rs. {s.incomeLimit} lakh</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Minimum percentage</th>
                  {scholarships.map((s) => (
                    <td key={s.id}>{s.minPercentage}%</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Provider</th>
                  {scholarships.map((s) => (
                    <td key={s.id}>{s.provider}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Open in</th>
                  {scholarships.map((s) => (
                    <td key={s.id}>{s.states.join(', ')}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Actions</th>
                  {scholarships.map((s) => (
                    <td key={s.id}>
                      <div className="actions">
                        <button className="btn primary" type="button" onClick={() => onSelect(s)}>View details</button>
                        <button className="btn" type="button" onClick={() => onRemove(s.id)}>Remove</button>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  )
}
