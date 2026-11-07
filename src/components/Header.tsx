import type { View } from '../data/scholarships'

interface HeaderProps {
  view: View
  onViewChange: (view: View) => void
}

const NAV_ITEMS: { id: View; label: string }[] = [
  { id: 'discover', label: 'Discover' },
  { id: 'eligibility', label: 'Eligibility Check' },
  { id: 'tracker', label: 'My Applications' },
  { id: 'documents', label: 'Documents' },
  { id: 'compare', label: 'Compare' },
]

export default function Header({ view, onViewChange }: HeaderProps) {
  return (
    <header className="topbar">
      <div>
        <div className="logo">GRANTLY</div>
        <p className="tagline">Find scholarships, check eligibility, track applications.</p>
      </div>
      <nav className="nav" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={view === item.id ? 'nav-btn active' : 'nav-btn'}
            aria-current={view === item.id ? 'page' : undefined}
            onClick={() => onViewChange(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  )
}
