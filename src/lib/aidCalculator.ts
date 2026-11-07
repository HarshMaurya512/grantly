import type { Scholarship } from '../data/scholarships'

/**
 * Aid calculator helpers. All amounts come from the 14 scholarships in
 * this app, using the listed amount in rupees. Amounts are per year
 * unless a scholarship's own text says otherwise. The result is an
 * estimate, never a guarantee.
 */
export function sumSelectedAid(scholarships: Scholarship[], selectedIds: string[]): number {
  const selected = new Set(selectedIds)
  return scholarships.filter((s) => selected.has(s.id)).reduce((total, s) => total + s.amount, 0)
}

/** Annual cost minus total aid. A negative result means the aid covers the cost, with a surplus. */
export function aidGap(annualCost: number, totalAid: number): number {
  return annualCost - totalAid
}

export function formatRupees(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-IN')}`
}
