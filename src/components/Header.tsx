import { useState } from 'react'
import type { View } from '../data/scholarships'
import type { Theme } from '../hooks/useDarkMode'

interface HeaderProps {
  view: View
  onViewChange: (view: View) => void
  theme: Theme
  onToggleTheme: () => void
}

const NAV_ITEMS: { id: View; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'discover', label: 'Discover' },
  { id: 'eligibility', label: 'Eligibility Check' },
  { id: 'assistant', label: 'Assistant' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'calculator', label: 'Aid Calculator' },
  { id: 'tracker', label: 'My Applications' },
  { id: 'documents', label: 'Documents' },
  { id: 'compare', label: 'Compare' },
]

export default function Header({ view, onViewChange, theme, onToggleTheme }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  function goTo(item: View) {
    setMenuOpen(false)
    onViewChange(item)
  }

  return (
    <header className="topbar">
      <div>
        <div className="logo">GRANTLY</div>
        <p className="tagline">Find scholarships, check eligibility, track applications.</p>
      </div>
      <button
        className="btn menu-btn"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="main-nav"
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? 'Close menu' : 'Menu'}
      </button>
      <button className="btn theme-btn" type="button" aria-pressed={theme === 'dark'} onClick={onToggleTheme}>
        {theme === 'dark' ? 'Light' : 'Dark'}
      </button>
      <nav id="main-nav" className={menuOpen ? 'nav nav-open' : 'nav'} aria-label="Main navigation">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={view === item.id ? 'nav-btn active' : 'nav-btn'}
            aria-current={view === item.id ? 'page' : undefined}
            onClick={() => goTo(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  )
}
