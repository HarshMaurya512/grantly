import { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import type { Application, ApplicationStatus, Profile, Scholarship, UploadedFile, View } from './data/scholarships'
import { SCHOLARSHIPS } from './data/scholarships'
import { scoreEligibility } from './lib/eligibility'
import { filterScholarships } from './lib/filterScholarships'
import { toggleCompare } from './lib/compare'
import { addUpload, removeUpload } from './lib/uploads'
import { parseViewFromHash, viewToHash } from './lib/routing'
import { getScholarshipById, getUpcomingDeadlines } from './services/scholarshipService'
import { STORAGE_KEYS } from './constants'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useDarkMode } from './hooks/useDarkMode'
import { useDebounce } from './hooks/useDebounce'
import { sanitizeSearch } from './lib/sanitize'
import Header from './components/Header'
import StatsBar from './components/StatsBar'
import ErrorBoundary from './components/ErrorBoundary'
import Toast from './components/Toast'

const HomeView = lazy(() => import('./components/HomeView'))
const DiscoverView = lazy(() => import('./components/DiscoverView'))
const EligibilityView = lazy(() => import('./components/EligibilityView'))
const AssistantView = lazy(() => import('./components/AssistantView'))
const DashboardView = lazy(() => import('./components/DashboardView'))
const CalculatorView = lazy(() => import('./components/CalculatorView'))
const TrackerView = lazy(() => import('./components/TrackerView'))
const DocumentsView = lazy(() => import('./components/DocumentsView'))
const ScholarshipDetail = lazy(() => import('./components/ScholarshipDetail'))
const CompareView = lazy(() => import('./components/CompareView'))

export default function App() {
  const [view, setView] = useState<View>(() => parseViewFromHash(window.location.hash))
  const [theme, toggleTheme] = useDarkMode()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [level, setLevel] = useState('All levels')
  const [category, setCategory] = useState('All categories')
  const [income, setIncome] = useState('')
  const [state, setState] = useState('All states')
  const [sort, setSort] = useState('deadline')
  const [selected, setSelected] = useState<Scholarship | null>(null)
  const [saved, setSaved] = useLocalStorage<string[]>(STORAGE_KEYS.saved, [])
  const [applications, setApplications] = useLocalStorage<Application[]>(STORAGE_KEYS.applications, [])
  const [docs, setDocs] = useLocalStorage<Record<string, boolean>>(STORAGE_KEYS.docs, {})
  const [compareIds, setCompareIds] = useLocalStorage<string[]>(STORAGE_KEYS.compare, [])
  const [uploads, setUploads] = useLocalStorage<UploadedFile[]>(STORAGE_KEYS.uploads, [])
  const [toast, setToast] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile>({
    level: 'UG',
    course: '',
    income: '',
    state: 'Uttar Pradesh',
    category: 'General',
    percentage: '',
  })

  useEffect(() => {
    function onHashChange() {
      setView(parseViewFromHash(window.location.hash))
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 3000)
    return () => window.clearTimeout(timer)
  }, [toast])

  function changeView(next: View) {
    setView(next)
    if (window.location.hash !== viewToHash(next)) {
      window.location.hash = viewToHash(next)
    }
  }

  const filtered = useMemo(
    () => filterScholarships(SCHOLARSHIPS, { search: debouncedSearch, level, category, income, state, sort }),
    [debouncedSearch, level, category, income, state, sort],
  )

  const eligibilityResults = useMemo(
    () => SCHOLARSHIPS.map((s) => scoreEligibility(profile, s)).sort((a, b) => b.score - a.score),
    [profile],
  )

  const nearest = useMemo(() => {
    const upcoming = applications
      .map((a) => getScholarshipById(a.id))
      .filter((s): s is Scholarship => Boolean(s))
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    return upcoming[0] ?? null
  }, [applications])

  const compareList = useMemo(
    () => compareIds.map((id) => getScholarshipById(id)).filter((s): s is Scholarship => Boolean(s)),
    [compareIds],
  )

  const featured = useMemo(() => getUpcomingDeadlines(3), [])
  const nearestOverall = useMemo(() => getUpcomingDeadlines(1)[0] ?? null, [])
  const providerCount = useMemo(() => new Set(SCHOLARSHIPS.map((s) => s.provider)).size, [])
  const docsReady = useMemo(() => Object.values(docs).filter(Boolean).length, [docs])
  const topMatches = useMemo(() => {
    const eligible = eligibilityResults.filter((r) => r.status === 'Eligible')
    return (eligible.length > 0 ? eligible : eligibilityResults).slice(0, 3)
  }, [eligibilityResults])

  function toggleSave(id: string) {
    const name = getScholarshipById(id)?.name ?? 'Scholarship'
    const wasSaved = saved.includes(id)
    setSaved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
    setToast(wasSaved ? `Removed ${name} from saved` : `Saved ${name}`)
  }

  function addToTracker(id: string) {
    if (!applications.find((a) => a.id === id)) {
      setApplications((prev) => [...prev, { id, status: 'Saved', updated: new Date().toISOString().slice(0, 10) }])
    }
    if (!saved.includes(id)) setSaved((prev) => [...prev, id])
    setToast('Added to My Applications')
    changeView('tracker')
  }

  function setStatus(id: string, status: ApplicationStatus) {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status, updated: new Date().toISOString().slice(0, 10) } : a)))
  }

  function removeApplication(id: string) {
    setApplications((prev) => prev.filter((a) => a.id !== id))
    setToast('Application removed')
  }

  function handleToggleCompare(id: string) {
    const name = getScholarshipById(id)?.name ?? 'Scholarship'
    const wasSelected = compareIds.includes(id)
    setCompareIds((prev) => toggleCompare(prev, id))
    setToast(wasSelected ? `Removed ${name} from comparison` : `Added ${name} to comparison`)
  }

  function handleRemoveCompare(id: string) {
    setCompareIds((prev) => prev.filter((x) => x !== id))
    setToast('Removed from comparison')
  }

  function handleAddUpload(file: UploadedFile) {
    setUploads((prev) => addUpload(prev, file))
    setToast(`Recorded ${file.name}`)
  }

  function handleRemoveUpload(name: string, size: number) {
    setUploads((prev) => removeUpload(prev, name, size))
    setToast('File record removed')
  }

  const levels = ['All levels', ...new Set(SCHOLARSHIPS.map((s) => s.level))]
  const categories = ['All categories', ...new Set(SCHOLARSHIPS.map((s) => s.category))]

  return (
    <div className="page">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Header view={view} onViewChange={changeView} theme={theme} onToggleTheme={toggleTheme} />
      <StatsBar savedCount={saved.length} inProgressCount={applications.filter((a) => a.status !== 'Submitted').length} nearest={nearest} total={SCHOLARSHIPS.length} />
      <Toast message={toast} />
      {compareIds.length > 0 && view !== 'compare' && (
        <div className="compare-bar" role="status">
          <span>{compareIds.length} of 3 selected for comparison</span>
          <button className="btn primary" type="button" disabled={compareIds.length < 2} onClick={() => changeView('compare')}>View comparison</button>
          <button className="btn" type="button" onClick={() => setCompareIds([])}>Clear</button>
        </div>
      )}
      <ErrorBoundary>
        <Suspense
          fallback={
            <div className="skeleton-wrap" aria-busy="true" aria-label="Loading view">
              <div className="skeleton-card" />
              <div className="skeleton-card" />
            </div>
          }
        >
          {view === 'home' && (
            <HomeView
              total={SCHOLARSHIPS.length}
              providerCount={providerCount}
              nearest={nearestOverall}
              savedCount={saved.length}
              featured={featured}
              onGo={changeView}
              onSelect={setSelected}
            />
          )}
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
              onToggleCompare={handleToggleCompare}
            />
          )}
          {view === 'eligibility' && (
            <EligibilityView profile={profile} onProfileChange={setProfile} results={eligibilityResults} onSelect={setSelected} onTrack={addToTracker} />
          )}
          {view === 'assistant' && (
            <AssistantView profile={profile} results={eligibilityResults} onSelect={setSelected} />
          )}
          {view === 'dashboard' && (
            <DashboardView
              savedCount={saved.length}
              applications={applications}
              docsReady={docsReady}
              nearest={nearestOverall}
              topMatches={topMatches}
              compareCount={compareIds.length}
              onGo={changeView}
              onSelect={setSelected}
            />
          )}
          {view === 'calculator' && <CalculatorView saved={saved} onSelect={setSelected} />}
          {view === 'tracker' && (
            <TrackerView applications={applications} onStatusChange={setStatus} onRemove={removeApplication} onSelect={setSelected} />
          )}
          {view === 'documents' && (
            <DocumentsView
              docs={docs}
              onToggle={(name, checked) => setDocs({ ...docs, [name]: checked })}
              uploads={uploads}
              onAddUpload={handleAddUpload}
              onRemoveUpload={handleRemoveUpload}
            />
          )}
          {view === 'compare' && (
            <CompareView
              scholarships={compareList}
              onRemove={handleRemoveCompare}
              onClear={() => setCompareIds([])}
              onSelect={setSelected}
            />
          )}
          {selected && (
            <ScholarshipDetail scholarship={selected} saved={saved.includes(selected.id)} onClose={() => setSelected(null)} onTrack={addToTracker} onToggleSave={toggleSave} />
          )}
        </Suspense>
      </ErrorBoundary>
      <footer>
        <p>GRANTLY is a student project for THE OUTPOST, Frontend Arena. Scholarship data is for the 2026-27 cycle. Verify amounts and deadlines on the official portal before applying.</p>
        <p className="copyright">© 2026 GRANTLY. All rights reserved. Built by Harsh Maurya for THE OUTPOST, Frontend Arena.</p>
      </footer>
    </div>
  )
}
