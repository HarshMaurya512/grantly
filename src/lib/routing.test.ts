import { describe, expect, it } from 'vitest'
import { parseViewFromHash, viewToHash } from './routing'

describe('parseViewFromHash', () => {
  it('returns home for an empty hash', () => {
    expect(parseViewFromHash('')).toBe('home')
  })

  it('returns home for a bare hash', () => {
    expect(parseViewFromHash('#')).toBe('home')
  })

  it('parses each valid view', () => {
    expect(parseViewFromHash('#home')).toBe('home')
    expect(parseViewFromHash('#discover')).toBe('discover')
    expect(parseViewFromHash('#eligibility')).toBe('eligibility')
    expect(parseViewFromHash('#assistant')).toBe('assistant')
    expect(parseViewFromHash('#dashboard')).toBe('dashboard')
    expect(parseViewFromHash('#calculator')).toBe('calculator')
    expect(parseViewFromHash('#tracker')).toBe('tracker')
    expect(parseViewFromHash('#documents')).toBe('documents')
    expect(parseViewFromHash('#compare')).toBe('compare')
  })

  it('accepts a leading slash in the hash', () => {
    expect(parseViewFromHash('#/tracker')).toBe('tracker')
  })

  it('falls back to home for an unknown view', () => {
    expect(parseViewFromHash('#settings')).toBe('home')
    expect(parseViewFromHash('#unknown')).toBe('home')
  })

  it('ignores a query string after the view', () => {
    expect(parseViewFromHash('#compare?x=1')).toBe('compare')
  })
})

describe('viewToHash', () => {
  it('writes a hash for each view', () => {
    expect(viewToHash('home')).toBe('#home')
    expect(viewToHash('discover')).toBe('#discover')
    expect(viewToHash('calculator')).toBe('#calculator')
    expect(viewToHash('compare')).toBe('#compare')
  })

  it('round-trips through parseViewFromHash', () => {
    expect(parseViewFromHash(viewToHash('eligibility'))).toBe('eligibility')
    expect(parseViewFromHash(viewToHash('documents'))).toBe('documents')
  })
})
