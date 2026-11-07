import type { View } from '../data/scholarships'

export const VIEWS: View[] = ['home', 'discover', 'eligibility', 'assistant', 'dashboard', 'calculator', 'tracker', 'documents', 'compare']

function isView(value: string): value is View {
  return (VIEWS as string[]).includes(value)
}

/** Read the current view from location.hash. Unknown or missing hashes fall back to home. */
export function parseViewFromHash(hash: string): View {
  const cleaned = hash.replace(/^#\/?/, '').split('?')[0].split('/')[0].trim()
  return isView(cleaned) ? cleaned : 'home'
}

export function viewToHash(view: View): string {
  return `#${view}`
}
