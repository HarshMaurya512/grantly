import { describe, expect, it } from 'vitest'
import { resolveTheme } from './useDarkMode'

describe('resolveTheme', () => {
  it('uses a stored dark choice even when the system prefers light', () => {
    expect(resolveTheme('dark', false)).toBe('dark')
  })

  it('uses a stored light choice even when the system prefers dark', () => {
    expect(resolveTheme('light', true)).toBe('light')
  })

  it('follows the system preference when nothing is stored', () => {
    expect(resolveTheme(null, true)).toBe('dark')
    expect(resolveTheme(null, false)).toBe('light')
  })

  it('falls back to the system preference for an unknown stored value', () => {
    expect(resolveTheme('blue', true)).toBe('dark')
    expect(resolveTheme('blue', false)).toBe('light')
    expect(resolveTheme('', false)).toBe('light')
  })
})
