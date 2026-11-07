import type { ApplicationStatus } from '../data/scholarships'

export const STATUS_OPTIONS: ApplicationStatus[] = ['Saved', 'Documents Pending', 'Applied', 'Submitted']
export const STATUS_PROGRESS: Record<ApplicationStatus, number> = { Saved: 10, 'Documents Pending': 40, Applied: 70, Submitted: 100 }
