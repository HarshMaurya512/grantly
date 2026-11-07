import { describe, expect, it } from 'vitest'
import { aidGap, formatRupees, sumSelectedAid } from './aidCalculator'
import { SCHOLARSHIPS } from '../data/scholarships'

describe('sumSelectedAid', () => {
  it('adds the listed amounts of the selected scholarships', () => {
    expect(sumSelectedAid(SCHOLARSHIPS, ['nsp-postmatric', 'pm-scholarship'])).toBe(12000 + 30000)
  })

  it('returns 0 when nothing is selected', () => {
    expect(sumSelectedAid(SCHOLARSHIPS, [])).toBe(0)
  })

  it('ignores unknown ids', () => {
    expect(sumSelectedAid(SCHOLARSHIPS, ['nsp-postmatric', 'not-a-scholarship'])).toBe(12000)
  })

  it('counts a scholarship only once even if listed twice', () => {
    expect(sumSelectedAid(SCHOLARSHIPS, ['inspire', 'inspire'])).toBe(80000)
  })
})

describe('aidGap', () => {
  it('returns the shortfall when cost is higher than aid', () => {
    expect(aidGap(100000, 42000)).toBe(58000)
  })

  it('returns 0 when aid exactly covers the cost', () => {
    expect(aidGap(50000, 50000)).toBe(0)
  })

  it('returns a negative number when aid is more than the cost', () => {
    expect(aidGap(40000, 80000)).toBe(-40000)
  })
})

describe('formatRupees', () => {
  it('formats with Indian digit grouping', () => {
    expect(formatRupees(100000)).toBe('Rs. 1,00,000')
    expect(formatRupees(0)).toBe('Rs. 0')
  })
})
