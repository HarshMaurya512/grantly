export type ApplicationStatus = 'Saved' | 'Documents Pending' | 'Applied' | 'Submitted'
export type EligibilityStatus = 'Eligible' | 'Maybe' | 'Not eligible'
export interface Scholarship {
  id: string
  name: string
  provider: string
  portal: string
  amount: number
  amountText: string
  deadline: string
  level: string
  category: string
  incomeLimit: number
  minPercentage: number
  states: string[]
  course: string
  description: string
  benefits: string[]
  documents: string[]
  steps: string[]
}
export interface Profile {
  level: string
  course: string
  income: string
  state: string
  category: string
  percentage: string
}
export interface Application {
  id: string
  status: ApplicationStatus
  updated: string
}
export interface EligibilityResult {
  scholarship: Scholarship
  score: number
  status: EligibilityStatus
  reasons: string[]
}
export type View = 'home' | 'discover' | 'eligibility' | 'assistant' | 'dashboard' | 'calculator' | 'tracker' | 'documents' | 'compare'

export interface UploadedFile {
  name: string
  size: number
  date: string
}

// 14 real Indian scholarships. Amounts and portals are the public figures
// listed for the 2026-27 cycle. Deadlines are the cycle dates used in the
// demo data set. Always verify a deadline on the official portal before
// applying, because portals update dates during the cycle.
export const SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'nsp-postmatric',
    name: 'NSP Post-Matric Scholarship',
    provider: 'National Scholarship Portal, Govt. of India',
    portal: 'scholarships.gov.in',
    amount: 12000,
    amountText: 'Up to Rs. 12,000 per year',
    deadline: '2026-12-31',
    level: 'UG',
    category: 'Need-based',
    incomeLimit: 2.5,
    minPercentage: 50,
    states: ['All India'],
    course: 'All courses',
    description: 'Post-matric scholarship for students from minority and disadvantaged backgrounds studying in Class 11 to PhD.',
    benefits: ['Tuition fee support', 'Maintenance allowance', 'Course fee as per norms'],
    documents: ['Aadhaar card', 'Income certificate', 'Previous year marksheet', 'Bonafide certificate', 'Bank passbook'],
    steps: ['Register on NSP', 'Fill the post-matric form', 'Upload documents', 'Submit to institute for verification'],
  },
  {
    id: 'nsp-merit-cum-means',
    name: 'NSP Merit-cum-Means Scholarship',
    provider: 'National Scholarship Portal, Govt. of India',
    portal: 'scholarships.gov.in',
    amount: 20000,
    amountText: 'Rs. 20,000 per year',
    deadline: '2026-12-15',
    level: 'UG',
    category: 'Merit',
    incomeLimit: 2.5,
    minPercentage: 50,
    states: ['All India'],
    course: 'Professional and technical courses',
    description: 'Merit-cum-means support for professional and technical courses for minority community students.',
    benefits: ['Rs. 20,000 per year', 'Course fee reimbursement'],
    documents: ['Aadhaar card', 'Income certificate', 'Class 12 marksheet', 'Admission proof', 'Fee receipt'],
    steps: ['Register on NSP', 'Select Merit-cum-Means', 'Upload documents', 'Institute verification'],
  },
  {
    id: 'central-sector',
    name: 'Central Sector Scheme of Scholarships',
    provider: 'Department of Higher Education, Govt. of India',
    portal: 'scholarships.gov.in',
    amount: 12000,
    amountText: 'Rs. 10,000 to Rs. 20,000 per year',
    deadline: '2026-12-31',
    level: 'UG',
    category: 'Merit',
    incomeLimit: 8,
    minPercentage: 80,
    states: ['All India'],
    course: 'Regular UG and PG courses',
    description: 'Scholarship for meritorious students who scored above 80th percentile in Class 12.',
    benefits: ['Rs. 10,000 per year for UG', 'Rs. 20,000 per year for PG'],
    documents: ['Class 12 marksheet', 'Income certificate', 'Aadhaar card', 'Bank details'],
    steps: ['Apply on NSP', 'Fill Central Sector form', 'Upload marksheet and income proof', 'Submit'],
  },
  {
    id: 'aicte-pragati',
    name: 'AICTE Pragati Scholarship for Girls',
    provider: 'AICTE',
    portal: 'aicte-pragati-saksham-gov.in',
    amount: 50000,
    amountText: 'Rs. 50,000 per year',
    deadline: '2026-12-31',
    level: 'Diploma',
    category: 'Girls',
    incomeLimit: 8,
    minPercentage: 60,
    states: ['All India'],
    course: 'Diploma and degree technical courses',
    description: 'Scholarship for girl students admitted to the first year of a diploma or degree technical course.',
    benefits: ['Rs. 50,000 per year', 'Tuition fee up to Rs. 30,000'],
    documents: ['Aadhaar card', 'Income certificate', 'Admission letter', 'Class 10 marksheet'],
    steps: ['Apply on AICTE portal', 'Upload admission and income proof', 'Institute verification'],
  },
  {
    id: 'aicte-saksham',
    name: 'AICTE Saksham Scholarship',
    provider: 'AICTE',
    portal: 'aicte-pragati-saksham-gov.in',
    amount: 50000,
    amountText: 'Rs. 50,000 per year',
    deadline: '2026-12-31',
    level: 'Diploma',
    category: 'Need-based',
    incomeLimit: 8,
    minPercentage: 60,
    states: ['All India'],
    course: 'Diploma and degree technical courses',
    description: 'Scholarship for specially-abled students in AICTE approved technical institutions.',
    benefits: ['Rs. 50,000 per year', 'Tuition fee support'],
    documents: ['Disability certificate', 'Income certificate', 'Admission letter', 'Aadhaar card'],
    steps: ['Apply on AICTE portal', 'Upload disability and income proof', 'Institute verification'],
  },
  {
    id: 'pm-scholarship',
    name: 'PM Scholarship Scheme',
    provider: 'Kendriya Sainik Board',
    portal: 'ksb.gov.in',
    amount: 30000,
    amountText: 'Rs. 2,500 per month',
    deadline: '2026-11-30',
    level: 'UG',
    category: 'Need-based',
    incomeLimit: 6,
    minPercentage: 60,
    states: ['All India'],
    course: 'Professional courses',
    description: 'Scholarship for wards of ex-servicemen and widows studying professional courses.',
    benefits: ['Rs. 2,500 per month for boys', 'Rs. 3,000 per month for girls'],
    documents: ['Ex-serviceman certificate', 'Class 12 marksheet', 'Admission proof', 'Bank passbook'],
    steps: ['Apply on KSB portal', 'Upload service and admission proof', 'Verification by Sainik Board'],
  },
  {
    id: 'up-postmatric',
    name: 'UP Scholarship Postmatric',
    provider: 'Social Welfare Dept, Govt. of Uttar Pradesh',
    portal: 'scholarship.up.gov.in',
    amount: 15000,
    amountText: 'Up to Rs. 15,000 per year',
    deadline: '2026-12-10',
    level: 'UG',
    category: 'Need-based',
    incomeLimit: 2,
    minPercentage: 50,
    states: ['Uttar Pradesh'],
    course: 'Postmatric courses',
    description: 'Uttar Pradesh post-matric scholarship for students domiciled in UP.',
    benefits: ['Fee reimbursement', 'Maintenance allowance'],
    documents: ['Aadhaar card', 'Income certificate', 'Domicile certificate', 'Caste certificate if applicable', 'Fee receipt'],
    steps: ['Complete OTR on UP portal', 'Fill fresh application', 'Upload documents', 'Submit hard copy to college'],
  },
  {
    id: 'inspire',
    name: 'INSPIRE Scholarship',
    provider: 'Dept. of Science and Technology, Govt. of India',
    portal: 'online-inspire.gov.in',
    amount: 80000,
    amountText: 'Rs. 80,000 per year',
    deadline: '2027-01-31',
    level: 'UG',
    category: 'Merit',
    incomeLimit: 15,
    minPercentage: 85,
    states: ['All India'],
    course: 'BSc and MSc in natural sciences',
    description: 'Scholarship for top students pursuing natural science courses at BSc and MSc level.',
    benefits: ['Rs. 60,000 scholarship', 'Rs. 20,000 mentorship grant'],
    documents: ['Class 12 marksheet', 'Admission proof', 'Aadhaar card', 'Bank details'],
    steps: ['Apply on INSPIRE portal', 'Upload marksheet', 'Institute endorsement'],
  },
  {
    id: 'tata-endowment',
    name: 'J N Tata Endowment Loan Scholarship',
    provider: 'J N Tata Endowment',
    portal: 'jntataendowment.org',
    amount: 1000000,
    amountText: 'Up to Rs. 10 lakh as loan scholarship',
    deadline: '2027-03-07',
    level: 'PG',
    category: 'Merit',
    incomeLimit: 15,
    minPercentage: 60,
    states: ['All India'],
    course: 'PG and PhD abroad',
    description: 'Loan scholarship for Indian students going abroad for higher studies.',
    benefits: ['Loan scholarship up to Rs. 10 lakh', 'Travel grant'],
    documents: ['Admission letter from foreign university', 'Academic transcripts', 'Income proof'],
    steps: ['Apply online', 'Appear for interview if shortlisted', 'Submit admission proof'],
  },
  {
    id: 'sitaram-jindal',
    name: 'Sitaram Jindal Foundation Scholarship',
    provider: 'Sitaram Jindal Foundation',
    portal: 'sitaramjindalfoundation.org',
    amount: 25000,
    amountText: 'Rs. 500 to Rs. 2,500 per month',
    deadline: '2027-02-28',
    level: 'School',
    category: 'Need-based',
    incomeLimit: 2.5,
    minPercentage: 60,
    states: ['All India'],
    course: 'Class 11 to PG',
    description: 'Scholarship for students from low-income families from Class 11 to postgraduate level.',
    benefits: ['Monthly scholarship', 'Support till course completion'],
    documents: ['Income certificate', 'Marksheet', 'Aadhaar card', 'Bonafide certificate'],
    steps: ['Download form from foundation site', 'Fill and attach documents', 'Post to foundation office'],
  },
  {
    id: 'ongc',
    name: 'ONGC Scholarship',
    provider: 'ONGC Foundation',
    portal: 'ongcscholar.org',
    amount: 48000,
    amountText: 'Rs. 48,000 per year',
    deadline: '2027-01-15',
    level: 'UG',
    category: 'Merit',
    incomeLimit: 2,
    minPercentage: 60,
    states: ['All India'],
    course: 'Engineering, MBBS, MBA, Geology and Geophysics',
    description: 'Merit scholarship for SC, ST, OBC and General students in selected professional courses.',
    benefits: ['Rs. 48,000 per year', 'Renewable on good academic performance'],
    documents: ['Caste certificate if applicable', 'Income certificate', 'Marksheet', 'Admission proof'],
    steps: ['Apply on ONGC portal', 'Upload documents', 'Merit list publication'],
  },
  {
    id: 'hdfc-parivartan',
    name: 'HDFC Parivartan ECSS Scholarship',
    provider: 'HDFC Bank Parivartan',
    portal: 'hdfcbank.com',
    amount: 75000,
    amountText: 'Up to Rs. 75,000 per year',
    deadline: '2026-12-20',
    level: 'UG',
    category: 'Need-based',
    incomeLimit: 2.5,
    minPercentage: 55,
    states: ['All India'],
    course: 'School, UG and PG',
    description: 'Need-based scholarship for students facing a financial crisis in the family.',
    benefits: ['Fee support up to Rs. 75,000', 'Renewable'],
    documents: ['Income certificate', 'Crisis proof if any', 'Marksheet', 'Fee receipt'],
    steps: ['Apply on Buddy4Study or HDFC portal', 'Upload documents', 'Telephonic interview if shortlisted'],
  },
  {
    id: 'reliance-ug',
    name: 'Reliance Foundation Undergraduate Scholarship',
    provider: 'Reliance Foundation',
    portal: 'reliancefoundation.org',
    amount: 200000,
    amountText: 'Up to Rs. 2 lakh over the course',
    deadline: '2026-12-14',
    level: 'UG',
    category: 'Merit',
    incomeLimit: 15,
    minPercentage: 60,
    states: ['All India'],
    course: 'First year UG in any stream',
    description: 'Merit scholarship for first-year undergraduate students, with mentorship and alumni support.',
    benefits: ['Up to Rs. 2 lakh', 'Mentorship and skill development'],
    documents: ['Class 12 marksheet', 'Admission proof', 'Income certificate', 'Aadhaar card'],
    steps: ['Apply online', 'Aptitude test', 'Interview if shortlisted'],
  },
  {
    id: 'loreal-women-science',
    name: "L'Oreal India For Young Women in Science Scholarship",
    provider: "L'Oreal India",
    portal: 'loreal.com',
    amount: 250000,
    amountText: 'Up to Rs. 2.5 lakh',
    deadline: '2027-01-31',
    level: 'UG',
    category: 'Girls',
    incomeLimit: 6,
    minPercentage: 85,
    states: ['All India'],
    course: 'Science graduation',
    description: 'Scholarship for young women who passed Class 12 in science and are pursuing graduation in science.',
    benefits: ['Up to Rs. 2.5 lakh', 'Support for science graduation'],
    documents: ['Class 12 marksheet', 'Admission proof', 'Income certificate', 'Aadhaar card'],
    steps: ['Apply on Buddy4Study', 'Upload documents', 'Interview if shortlisted'],
  },
]

export const DOCUMENT_CHECKLIST: string[] = [
  'Aadhaar card',
  'Aadhaar-linked mobile number',
  'Income certificate',
  'Caste certificate (if applicable)',
  'Domicile certificate',
  'Class 10 marksheet',
  'Class 12 marksheet',
  'College admission proof / bonafide certificate',
  'Fee receipt',
  'Bank passbook with Aadhaar seeding',
  'Passport size photo',
  'One Time Registration (OTR) number',
]

export function daysLeft(deadline: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const end = new Date(deadline + 'T00:00:00')
  return Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export function formatDate(dateString: string): string {
  return new Date(dateString + 'T00:00:00').toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
