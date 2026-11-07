import type { Application, ApplicationStatus, EligibilityResult, Scholarship, View } from '../data/scholarships'
import { DOCUMENT_CHECKLIST, SCHOLARSHIPS, daysLeft, formatDate } from '../data/scholarships'
import { STATUS_OPTIONS } from '../lib/applicationStatus'
import { applicationsToCsv, deadlinesToIcs, downloadTextFile } from '../lib/exportData'

interface DashboardViewProps {
  savedCount: number
  applications: Application[]
  docsReady: number
  nearest: Scholarship | null
  topMatches: EligibilityResult[]
  compareCount: number
  onGo: (view: View) => void
  onSelect: (scholarship: Scholarship) => void
}

export default function DashboardView({ savedCount, applications, docsReady, nearest, topMatches, compareCount, onGo, onSelect }: DashboardViewProps) {
  const byStatus = (status: ApplicationStatus) => applications.filter((a) => a.status === status).length
  return (
    <main id="main-content">
      <h1>Dashboard</h1>
      <p className="intro">Your scholarships, applications and documents in one place. Every number here comes from your own saved data.</p>
      <section className="stats" aria-label="Your overview">
        <div className="stat"><span className="stat-num">{savedCount}</span><span>Saved scholarships</span></div>
        <div className="stat"><span className="stat-num">{applications.length}</span><span>Applications tracked</span></div>
        <div className="stat"><span className="stat-num">{docsReady} of {DOCUMENT_CHECKLIST.length}</span><span>Documents ready</span></div>
        <div className="stat"><span className="stat-num">{nearest ? `${daysLeft(nearest.deadline)} days` : 'None'}</span><span>{nearest ? `Nearest deadline: ${nearest.name}` : 'Nearest deadline'}</span></div>
      </section>
      <h2>Applications by status</h2>
      <div className="stats">
        {STATUS_OPTIONS.map((status) => (
          <div className="stat" key={status}><span className="stat-num">{byStatus(status)}</span><span>{status}</span></div>
        ))}
      </div>
      <div className="actions">
        <button className="btn primary" type="button" onClick={() => onGo('tracker')}>Open My Applications</button>
        <button className="btn" type="button" onClick={() => onGo('documents')}>Open Documents</button>
        {compareCount >= 2 && (
          <button className="btn" type="button" onClick={() => onGo('compare')}>Compare {compareCount} scholarships</button>
        )}
        <button
          className="btn"
          type="button"
          disabled={applications.length === 0}
          onClick={() => downloadTextFile('grantly-applications.csv', applicationsToCsv(applications, SCHOLARSHIPS), 'text/csv')}
        >
          Download applications (CSV)
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
      <h2>Your top matches</h2>
      {topMatches.length === 0 ? (
        <p>No matches yet. Fill your profile in Eligibility Check to see your top matches here.</p>
      ) : (
        <div className="grid">
          {topMatches.map(({ scholarship, score, status }) => (
            <article className="card" key={scholarship.id}>
              <p className={`badge ${status === 'Eligible' ? 'good' : status === 'Maybe' ? 'warn' : 'bad'}`}>{status} - {score}% match</p>
              <h3>{scholarship.name}</h3>
              <p className="amount">{scholarship.amountText}</p>
              <p className="deadline">{daysLeft(scholarship.deadline)} days left, deadline {formatDate(scholarship.deadline)}</p>
              <div className="actions">
                <button className="btn primary" type="button" onClick={() => onSelect(scholarship)}>View details</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
