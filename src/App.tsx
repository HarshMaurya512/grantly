import { Suspense, lazy, useMemo, useState } from 'react'
import type { Application, ApplicationStatus, Profile, Scholarship, View } from './data/scholarships'
import { SCHOLARSHIPS } from './data/scholarships'
import { scoreEligibility } from './lib/eligibility'
import { filterScholarships } from './lib/filterScholarships'
import { toggleCompare } from './lib/compare'
import { useLocalStorage } from './hooks/useLocalStorage'
import { sanitizeSearch } from './lib/sanitize'
import Header from './components/Header'
import StatsBar from './components/StatsBar'

const DiscoverView = lazy(() => import('./components/DiscoverView'))
const EligibilityView = lazy(() => import('./components/EligibilityView'))
const TrackerView = lazy(() => import('./components/TrackerView'))
const DocumentsView = lazy(() => import('./components/DocumentsView'))
const ScholarshipDetail = lazy(() => import('./components/ScholarshipDetail'))
const CompareView = lazy(() => import('./components/CompareView'))

export default function App() {
  const [view, setView] = useState<View>('discover')
  const [search, setSearch] = useState('')
  const [level, setLevel] = useState('All levels')
  const [category, setCategory] = useState('All categories')
  const [income, setIncome] = useState('')
  const [state, setState] = useState('All states')
  const [sort, setSort] = useState('deadline')
  const [selected, setSelected] = useState<Scholarship | null>(null)
  const [saved, setSaved] = useLocalStorage<string[]>('grantly-saved', [])
  const [applications, setApplications] = useLocalStorage<Application[]>('grantly-applications', [])
  const [docs, setDocs] = useLocalStorage<Record<string, boolean>>('grantly-docs', {})
  const [compareIds, setCompareIds] = useLocalStorage<string[]>('grantly-compare', [])
  const [profile, setProfile] = useState<Profile>({
    level: 'UG',
    course: '',
    income: '',
    state: 'Uttar Pradesh',
    category: 'General',
    percentage: '',
  })

  const filtered = useMemo(
    () => filterScholarships(SCHOLARSHIPS, { search, level, category, income, state, sort }),
    [search, level, category, income, state, sort],
  )

  const eligibilityResults = useMemo(
    () => SCHOLARSHIPS.map((s) => scoreEligibility(profile, s)).sort((a, b) => b.score - a.score),
    [profile],
  )

  const nearest = useMemo(() => {
    const upcoming = applications
      .map((a) => SCHOLARSHIPS.find((s) => s.id === a.id))
      .filter((s): s is Scholarship => Boolean(s))
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    return upcoming[0] ?? null
  }, [applications])

  const compareList = useMemo(
    () => compareIds.map((id) => SCHOLARSHIPS.find((s) => s.id === id)).filter((s): s is Scholarship => Boolean(s)),
    [compareIds],
  )

  function toggleSave(id: string) {
    setSaved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function addToTracker(id: string) {
    if (!applications.find((a) => a.id === id)) {
      setApplications((prev) => [...prev, { id, status: 'Saved', updated: new Date().toISOString().slice(0, 10) }])
    }
    if (!saved.includes(id)) setSaved((prev) => [...prev, id])
    setView('tracker')
  }

  function setStatus(id: string, status: ApplicationStatus) {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status, updated: new Date().toISOString().slice(0, 10) } : a)))
  }

  function removeApplication(id: string) {
    setApplications((prev) => prev.filter((a) => a.id !== id))
  }

  const levels = ['All levels', ...new Set(SCHOLARSHIPS.map((s) => s.level))]
  const categories = ['All categories', ...new Set(SCHOLARSHIPS.map((s) => s.category))]

  return (
    <div className="page">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Header view={view} onViewChange={setView} />
      <StatsBar savedCount={saved.length} inProgressCount={applications.filter((a) => a.status !== 'Submitted').length} nearest={nearest} total={SCHOLARSHIPS.length} />
      {compareIds.length > 0 && view !== 'compare' && (
        <div className="compare-bar" role="status">
          <span>{compareIds.length} of 3 selected for comparison</span>
          <button className="btn primary" type="button" disabled={compareIds.length < 2} onClick={() => setView('compare')}>View comparison</button>
          <button className="btn" type="button" onClick={() => setCompareIds([])}>Clear</button>
        </div>
      )}
      <Suspense fallback={<p className="loading">Loading view...</p>}>
        {view === 'discover' && (
          <DiscoverView
            search={search}
            onSearchChange={(value) => setSearch(sanitizeSearch(value))}
            level={level}
            onLevelChange={setLevel}
            category={category}
            onCategoryChange={setCategory}
            income={income}
            onIncomeChange={setIncome}
            state={state}
            onStateChange={setState}
            sort={sort}
            onSortChange={setSort}
            filtered={filtered}
            levels={levels}
            categories={categories}
            saved={saved}
            compareIds={compareIds}
            onSelect={setSelected}
            onToggleSave={toggleSave}
            onTrack={addToTracker}
            onToggleCompare={(id) => setCompareIds((prev) => toggleCompare(prev, id))}
          />
        )}
        {view === 'eligibility' && (
          <EligibilityView profile={profile} onProfileChange={setProfile} results={eligibilityResults} onSelect={setSelected} onTrack={addToTracker} />
        )}
        {view === 'tracker' && (
          <TrackerView applications={applications} onStatusChange={setStatus} onRemove={removeApplication} onSelect={setSelected} />
        )}
        {view === 'documents' && (
          <DocumentsView docs={docs} onToggle={(name, checked) => setDocs({ ...docs, [name]: checked })} />
        )}
        {view === 'compare' && (
          <CompareView
            scholarships={compareList}
            onRemove={(id) => setCompareIds((prev) => prev.filter((x) => x !== id))}
            onClear={() => setCompareIds([])}
            onSelect={setSelected}
          />
        )}
        {selected && (
          <ScholarshipDetail scholarship={selected} saved={saved.includes(selected.id)} onClose={() => setSelected(null)} onTrack={addToTracker} onToggleSave={toggleSave} />
        )}
      </Suspense>
      <footer>
        <p>GRANTLY is a student project for THE OUTPOST, Frontend Arena. Scholarship data is for the 2026-27 cycle. Verify amounts and deadlines on the official portal before applying.</p>
        <p className="copyright">© 2026 GRANTLY. All rights reserved. Built by Harsh Maurya for THE OUTPOST, Frontend Arena.</p>
      </footer>
    </div>
  )
}
