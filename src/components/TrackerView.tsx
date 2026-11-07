import { useState } from 'react'
import type { Application, ApplicationStatus, Scholarship } from '../data/scholarships'
import { SCHOLARSHIPS, daysLeft, formatDate } from '../data/scholarships'
import { STATUS_OPTIONS, STATUS_PROGRESS } from '../lib/applicationStatus'
import { applicationsToCsv, deadlinesToIcs, downloadTextFile } from '../lib/exportData'

interface TrackerViewProps {
  applications: Application[]
  onStatusChange: (id: string, status: ApplicationStatus) => void
  onRemove: (id: string) => void
  onSelect: (scholarship: Scholarship) => void
}

type TrackerMode = 'list' | 'board'

export default function TrackerView({ applications, onStatusChange, onRemove, onSelect }: TrackerViewProps) {
  const [mode, setMode] = useState<TrackerMode>('list')

  function applicationCard(a: Application) {
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
  }

  return (
    <main id="main-content">
      <h1>My Applications</h1>
      <p className="intro">Your tracker is saved in this browser, so it stays here when you reload the page.</p>
      <div className="actions board-toggle" role="group" aria-label="Tracker view">
        <button className="btn" type="button" aria-pressed={mode === 'list'} disabled={mode === 'list'} onClick={() => setMode('list')}>List view</button>
        <button className="btn" type="button" aria-pressed={mode === 'board'} disabled={mode === 'board'} onClick={() => setMode('board')}>Board view</button>
      </div>
      <div className="actions" aria-label="Export applications">
        <button
          className="btn"
          type="button"
          disabled={applications.length === 0}
          onClick={() => downloadTextFile('grantly-applications.csv', applicationsToCsv(applications, SCHOLARSHIPS), 'text/csv')}
        >
          Download CSV
        </button>
        <button
          className="btn"
          type="button"
          disabled={applications.length === 0}
          onClick={() => downloadTextFile('grantly-deadlines.ics', deadlinesToIcs(applications, SCHOLARSHIPS), 'text/calendar')}
        >
          Download deadlines (.ics)
        </button>
      </div>
      <p className="meta">The files are made in your browser from your tracked applications. Nothing is sent to a server.</p>
      {applications.length === 0 && <p>No applications yet. Go to Discover, open a scholarship and choose Track.</p>}
      {mode === 'list' ? (
        <div className="grid">
          {applications.map((a) => applicationCard(a))}
        </div>
      ) : (
        <div className="kanban">
          {STATUS_OPTIONS.map((status) => {
            const column = applications.filter((a) => a.status === status)
            return (
              <section className="kanban-col" key={status} aria-label={`${status} column`}>
                <h2>{status} ({column.length})</h2>
                {column.length === 0 && <p className="meta">No applications here yet.</p>}
                {column.map((a) => applicationCard(a))}
              </section>
            )
          })}
        </div>
      )}
    </main>
  )
}
