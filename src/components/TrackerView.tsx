import type { Application, ApplicationStatus, Scholarship } from '../data/scholarships'
import { SCHOLARSHIPS, daysLeft, formatDate } from '../data/scholarships'
import { STATUS_OPTIONS, STATUS_PROGRESS } from '../lib/applicationStatus'

interface TrackerViewProps {
  applications: Application[]
  onStatusChange: (id: string, status: ApplicationStatus) => void
  onRemove: (id: string) => void
  onSelect: (scholarship: Scholarship) => void
}

export default function TrackerView({ applications, onStatusChange, onRemove, onSelect }: TrackerViewProps) {
  return (
    <main id="main-content">
      <h1>My Applications</h1>
      <p className="intro">Your tracker is saved in this browser, so it stays here when you reload the page.</p>
      {applications.length === 0 && <p>No applications yet. Go to Discover, open a scholarship and choose Track.</p>}
      <div className="grid">
        {applications.map((a) => {
          const s = SCHOLARSHIPS.find((x) => x.id === a.id)
          if (!s) return null
          return (
            <article className="card" key={a.id}>
              <h2>{s.name}</h2>
              <p className="amount">{s.amountText}</p>
              <p className="deadline">{daysLeft(s.deadline)} days left, deadline {formatDate(s.deadline)}</p>
              <label htmlFor={`status-${a.id}`}>Status<select id={`status-${a.id}`} value={a.status} onChange={(e) => onStatusChange(a.id, e.target.value as ApplicationStatus)}>{STATUS_OPTIONS.map((o) => <option key={o}>{o}</option>)}</select></label>
              <div className="progress"><div style={{ width: `${STATUS_PROGRESS[a.status]}%` }} /></div>
              <p className="meta">Progress: {STATUS_PROGRESS[a.status]}% | Updated: {a.updated}</p>
              <div className="actions">
                <button className="btn primary" type="button" onClick={() => onSelect(s)}>View details</button>
                <button className="btn" type="button" onClick={() => onRemove(a.id)}>Remove</button>
              </div>
            </article>
          )
        })}
      </div>
    </main>
  )
}
