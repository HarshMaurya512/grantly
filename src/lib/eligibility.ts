import type { EligibilityResult, EligibilityStatus, Profile, Scholarship } from '../data/scholarships'

export function scoreEligibility(profile: Profile, scholarship: Scholarship): EligibilityResult {
  const reasons: string[] = []
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
  const status: EligibilityStatus = score >= 75 ? 'Eligible' : score >= 50 ? 'Maybe' : 'Not eligible'
  return { scholarship, score, status, reasons }
}
