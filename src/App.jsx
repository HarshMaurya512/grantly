import { useEffect, useMemo, useState } from 'react'
import { SCHOLARSHIPS, DOCUMENT_CHECKLIST, daysLeft, formatDate } from './data/scholarships.js'
import { ALL_STATES_AND_UTS, INCOME_OPTIONS } from './data/states.js'

const STATUS_OPTIONS = ['Saved', 'Documents Pending', 'Applied', 'Submitted']
const STATUS_PROGRESS = { Saved: 10, 'Documents Pending': 40, Applied: 70, Submitted: 100 }

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function scoreEligibility(profile, scholarship) {
  const reasons = []
  let score = 0
  if (!profile.level || profile.level === 'All levels' || scholarship.level === profile.level) {
    score += 25
    reasons.push('Education level matches.')
  } else {
    reasons.push('Education level does not match this scholarship.')
  }
  if (!profile.income) {
    score += 25
    reasons.push('Add your income to check the income limit.')
  } else if (Number(profile.income) <= scholarship.incomeLimit) {
    score += 25
    reasons.push(`Your income is within the limit of Rs. ${scholarship.incomeLimit} lakh.`)
  } else {
    reasons.push(`Income limit is Rs. ${scholarship.incomeLimit} lakh, which is below your income.`)
  }
  if (!profile.state || profile.state === 'All states' || scholarship.states.includes('All India') || scholarship.states.includes(profile.state)) {
    score += 25
    reasons.push('This scholarship is open in your state.')
  } else {
    reasons.push(`This scholarship is only for ${scholarship.states.join(', ')}.`)
  }
  if (!profile.percentage) {
    score += 25
    reasons.push('Add your percentage to check the marks requirement.')
  } else if (Number(profile.percentage) >= scholarship.minPercentage) {
    score += 25
    reasons.push(`Your percentage meets the minimum of ${scholarship.minPercentage}%.`)
  } else {
    reasons.push(`Minimum percentage is ${scholarship.minPercentage}%.`)
  }
  const status = score >= 75 ? 'Eligible' : score >= 50 ? 'Maybe' : 'Not eligible'
  return { score, status, reasons }
}

export default function App() {
  const [view, setView] = useState('discover')
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('All levels')
  const [category, setCategory] = useState('All categories')
  const [income, setIncome] = useState('')
  const [state, setState] = useState('All states')
  const [sort, setSort] = useState('deadline')
  const [selected, setSelected] = useState(null)
  const [saved, setSaved] = useState(() => load('grantly-saved', []))
  const [applications, setApplications] = useState(() => load('grantly-applications', []))
  const [docs, setDocs] = useState(() => load('grantly-docs', {}))
  const [profile, setProfile] = useState({
    level: 'UG',
    course: '',
    income: '',
    state: 'Uttar Pradesh',
    category: 'General',
    percentage: '',
  })

  useEffect(() => save('grantly-saved', saved), [saved])
  useEffect(() => save('grantly-applications', applications), [applications])
  useEffect(() => save('grantly-docs', docs), [docs])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    let list = SCHOLARSHIPS.filter((s) => {
      if (query && !(s.name + ' ' + s.provider + ' ' + s.course).toLowerCase().includes(query)) return false
      if (level !== 'All levels' && s.level !== level) return false
      if (category !== 'All categories' && s.category !== category) return false
      if (income && s.incomeLimit < Number(income)) return false
      if (state !== 'All states' && state !== 'All India' && !s.states.includes('All India') && !s.states.includes(state)) return false
      return true
    })
    if (sort === 'amount') list = [...list].sort((a, b) => b.amount - a.amount)
    else list = [...list].sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    return list
  }, [search, level, category, income, state, sort])

  const eligibilityResults = useMemo(
    () => SCHOLARSHIPS.map((s) => ({ scholarship: s, ...scoreEligibility(profile, s) })).sort((a, b) => b.score - a.score),
    [profile],
  )

  const nearest = useMemo(() => {
    const upcoming = applications
      .map((a) => SCHOLARSHIPS.find((s) => s.id === a.id))
      .filter(Boolean)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    return upcoming[0] || null
  }, [applications])

  function toggleSave(id) {
    setSaved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function addToTracker(id) {
    if (!applications.find((a) => a.id === id)) {
      setApplications((prev) => [...prev, { id, status: 'Saved', updated: new Date().toISOString().slice(0, 10) }])
    }
    if (!saved.includes(id)) setSaved((prev) => [...prev, id])
    setView('tracker')
  }

  function setStatus(id, status) {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status, updated: new Date().toISOString().slice(0, 10) } : a)))
  }

  function removeApplication(id) {
    setApplications((prev) => prev.filter((a) => a.id !== id))
  }

  const levels = ['All levels', ...new Set(SCHOLARSHIPS.map((s) => s.level))]
  const categories = ['All categories', ...new Set(SCHOLARSHIPS.map((s) => s.category))]

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <div className="logo">GRANTLY</div>
          <p className="tagline">Find scholarships, check eligibility, track applications.</p>
        </div>
        <nav className="nav" aria-label="Main navigation">
          <button className={view === 'discover' ? 'nav-btn active' : 'nav-btn'} onClick={() => setView('discover')}>Discover</button>
          <button className={view === 'eligibility' ? 'nav-btn active' : 'nav-btn'} onClick={() => setView('eligibility')}>Eligibility Check</button>
          <button className={view === 'tracker' ? 'nav-btn active' : 'nav-btn'} onClick={() => setView('tracker')}>My Applications</button>
          <button className={view === 'documents' ? 'nav-btn active' : 'nav-btn'} onClick={() => setView('documents')}>Documents</button>
        </nav>
      </header>

      <section className="stats" aria-label="Your progress">
        <div className="stat"><span className="stat-num">{saved.length}</span><span>Saved scholarships</span></div>
        <div className="stat"><span className="stat-num">{applications.filter((a) => a.status !== 'Submitted').length}</span><span>Applications in progress</span></div>
        <div className="stat"><span className="stat-num">{nearest ? `${daysLeft(nearest.deadline)} days` : 'None'}</span><span>{nearest ? `Nearest deadline: ${nearest.name}` : 'Nearest deadline'}</span></div>
        <div className="stat"><span className="stat-num">{SCHOLARSHIPS.length}</span><span>Scholarships listed</span></div>
      </section>

      {view === 'discover' && (
        <main>
          <h1>Discover scholarships</h1>
          <p className="intro">Search by name, provider or course. Use the income filter to see scholarships whose income limit is at or above the value you select.</p>
          <div className="filters">
            <label>Search scholarships<input type="search" autoComplete="off" autoCorrect="off" inputMode="search" placeholder="Search by name, provider, course..." value={search} onChange={(e) => setSearch(e.target.value)} /></label>
            <label>Level<select value={level} onChange={(e) => setLevel(e.target.value)}>{levels.map((l) => <option key={l}>{l}</option>)}</select></label>
            <label>Category<select value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((c) => <option key={c}>{c}</option>)}</select></label>
            <label>Family income up to<select value={income} onChange={(e) => setIncome(e.target.value)}>{INCOME_OPTIONS.map((o) => <option key={o.label} value={o.value}>{o.label}</option>)}</select></label>
            <label>State<select value={state} onChange={(e) => setState(e.target.value)}><option>All states</option><option>All India</option>{ALL_STATES_AND_UTS.map((s) => <option key={s}>{s}</option>)}</select></label>
            <label>Sort<select value={sort} onChange={(e) => setSort(e.target.value)}><option value="deadline">Deadline: soonest first</option><option value="amount">Amount: highest first</option></select></label>
          </div>
          <p className="count">Showing {filtered.length} of {SCHOLARSHIPS.length} scholarships</p>
          <div className="grid">
            {filtered.map((s) => (
              <article className="card" key={s.id}>
                <p className="provider">{s.provider}</p>
                <h2>{s.name}</h2>
                <p className="amount">{s.amountText}</p>
                <p>{s.description}</p>
                <p className="meta">Level: {s.level} | {s.category} | Open in: {s.states.join(', ')}</p>
                <p className="meta">Income limit: Rs. {s.incomeLimit} lakh | Minimum: {s.minPercentage}%</p>
                <p className="deadline">{daysLeft(s.deadline)} days left, deadline {formatDate(s.deadline)}</p>
                <div className="actions">
                  <button className="btn primary" onClick={() => setSelected(s)}>View details</button>
                  <button className="btn" onClick={() => toggleSave(s.id)}>{saved.includes(s.id) ? 'Saved' : 'Save'}</button>
                  <button className="btn" onClick={() => addToTracker(s.id)}>Track</button>
                </div>
              </article>
            ))}
          </div>
          {filtered.length === 0 && <p>No scholarships match these filters. Clear the search or choose a wider income or state.</p>}
        </main>
      )}

      {view === 'eligibility' && (
        <main>
          <h1>Eligibility Check</h1>
          <p className="intro">Fill your profile once. GRANTLY scores all {SCHOLARSHIPS.length} scholarships and tells you why each result matches or does not match.</p>
          <form className="form" autoComplete="off" onSubmit={(e) => e.preventDefault()}>
            <label>Education level<select value={profile.level} onChange={(e) => setProfile({ ...profile, level: e.target.value })}><option>School</option><option>Diploma</option><option>UG</option><option>PG</option></select></label>
            <label>Course<input type="text" autoComplete="off" placeholder="For example, B.Tech" value={profile.course} onChange={(e) => setProfile({ ...profile, course: e.target.value })} /></label>
            <label>Annual family income in lakh<input type="number" min="0" step="0.5" autoComplete="off" placeholder="For example, 2" value={profile.income} onChange={(e) => setProfile({ ...profile, income: e.target.value })} /></label>
            <label>State<select value={profile.state} onChange={(e) => setProfile({ ...profile, state: e.target.value })}>{ALL_STATES_AND_UTS.map((s) => <option key={s}>{s}</option>)}</select></label>
            <label>Category<select value={profile.category} onChange={(e) => setProfile({ ...profile, category: e.target.value })}><option>General</option><option>OBC</option><option>SC</option><option>ST</option><option>Minority</option></select></label>
            <label>Percentage in last exam<input type="number" min="0" max="100" autoComplete="off" placeholder="For example, 78" value={profile.percentage} onChange={(e) => setProfile({ ...profile, percentage: e.target.value })} /></label>
          </form>
          <div className="grid">
            {eligibilityResults.map(({ scholarship, score, status, reasons }) => (
              <article className="card" key={scholarship.id}>
                <p className={`badge ${status === 'Eligible' ? 'good' : status === 'Maybe' ? 'warn' : 'bad'}`}>{status} - {score}% match</p>
                <h2>{scholarship.name}</h2>
                <p className="amount">{scholarship.amountText}</p>
                <ul>{reasons.map((r) => <li key={r}>{r}</li>)}</ul>
                <div className="actions">
                  <button className="btn primary" onClick={() => setSelected(scholarship)}>View details</button>
                  <button className="btn" onClick={() => addToTracker(scholarship.id)}>Track</button>
                </div>
              </article>
            ))}
          </div>
        </main>
      )}

      {view === 'tracker' && (
        <main>
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
                  <label>Status<select value={a.status} onChange={(e) => setStatus(a.id, e.target.value)}>{STATUS_OPTIONS.map((o) => <option key={o}>{o}</option>)}</select></label>
                  <div className="progress"><div style={{ width: `${STATUS_PROGRESS[a.status]}%` }} /></div>
                  <p className="meta">Progress: {STATUS_PROGRESS[a.status]}% | Updated: {a.updated}</p>
                  <div className="actions">
                    <button className="btn primary" onClick={() => setSelected(s)}>View details</button>
                    <button className="btn" onClick={() => removeApplication(a.id)}>Remove</button>
                  </div>
                </article>
              )
            })}
          </div>
        </main>
      )}

      {view === 'documents' && (
        <main>
          <h1>Documents checklist</h1>
          <p className="intro">Tick what you have ready. This list is saved in this browser.</p>
          <ul className="checklist">
            {DOCUMENT_CHECKLIST.map((d) => (
              <li key={d}><label><input type="checkbox" checked={Boolean(docs[d])} onChange={(e) => setDocs({ ...docs, [d]: e.target.checked })} /> {d}</label></li>
            ))}
          </ul>
          <p>{Object.values(docs).filter(Boolean).length} of {DOCUMENT_CHECKLIST.length} documents ready.</p>
        </main>
      )}

      {selected && (
        <div className="modal" role="dialog" aria-modal="true" aria-label={selected.name}>
          <div className="modal-box">
            <button className="btn close" onClick={() => setSelected(null)}>Close</button>
            <p className="provider">{selected.provider}</p>
            <h2>{selected.name}</h2>
            <p className="amount">{selected.amountText}</p>
            <p>{selected.description}</p>
            <p className="meta">Official portal: {selected.portal}</p>
            <p className="deadline">{daysLeft(selected.deadline)} days left, deadline {formatDate(selected.deadline)}</p>
            <h3>Benefits</h3><ul>{selected.benefits.map((b) => <li key={b}>{b}</li>)}</ul>
            <h3>Documents required</h3><ul>{selected.documents.map((d) => <li key={d}>{d}</li>)}</ul>
            <h3>How to apply</h3><ol>{selected.steps.map((s) => <li key={s}>{s}</li>)}</ol>
            <div className="actions">
              <button className="btn primary" onClick={() => { addToTracker(selected.id); setSelected(null) }}>Track this scholarship</button>
              <button className="btn" onClick={() => toggleSave(selected.id)}>{saved.includes(selected.id) ? 'Saved' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}

      <footer>
        <p>GRANTLY is a student project for THE OUTPOST, Frontend Arena. Scholarship data is for the 2026-27 cycle. Verify amounts and deadlines on the official portal before applying.</p>
      </footer>
    </div>
  )
}
