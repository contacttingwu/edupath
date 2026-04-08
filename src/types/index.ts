export type { StudentStatus, VisaOutcome, VisaAppealDecision, AppealStatus, STUDENT_STATUSES } from './database'
export type { Database } from './database'

// ─── STUDENT ─────────────────────────────────────────────────────────────────

export interface Student {
  id: string
  name: string
  preferredName: string | null
  dob: string | null
  nationality: string | null
  email: string | null
  phone: string | null
  addrOverseas: string | null
  addrHome: string | null
  googleDriveLink: string | null
  locationType: 'Onshore' | 'Offshore' | null
  emergencyContact: EmergencyContact
  emergencyContact2: EmergencyContact
  educationHistory: string | null
  workExperience: string | null
  status: import('./database').StudentStatus
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface EmergencyContact {
  name: string | null
  relationship: string | null
  phone: string | null
  email: string | null
  address: string | null
}

// ─── VISA ────────────────────────────────────────────────────────────────────

export interface Visa {
  id: string
  studentId: string
  visaType: string | null
  visaNumber: string | null
  issueDate: string | null
  expiryDate: string | null
  isCurrent: boolean
  outcome: import('./database').VisaOutcome
  appealDecision: import('./database').VisaAppealDecision | null
  appealStatus: string | null
  createdAt: string
}

// ─── APPLICATION ─────────────────────────────────────────────────────────────

export interface Application {
  id: string
  studentId: string
  school: string | null
  program: string | null
  intakeDate: string | null
  status: string | null
  isChosen: boolean
  createdAt: string
}

// ─── CONSULTATION ────────────────────────────────────────────────────────────

export interface Consultation {
  id: string
  studentId: string
  consultDate: string
  notes: string
  tags: string[]
  createdAt: string
}

// ─── ENRICHED TYPES ───────────────────────────────────────────────────────────

export interface StudentWithVisa extends Student {
  currentVisa: Visa | null
}

export interface StudentWithLastConsult extends Student {
  lastConsultDate: string | null
}
