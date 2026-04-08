export type { StudentStatus, STUDENT_STATUSES } from './database'
export type { Database } from './database'

// ─── STUDENT ─────────────────────────────────────────────────────────────────

export interface Student {
  id: string
  name: string
  preferredName: string | null
  dob: string | null           // ISO date YYYY-MM-DD
  nationality: string | null
  email: string | null
  phone: string | null
  addrOverseas: string | null
  addrHome: string | null
  emergencyContact: EmergencyContact
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
  issueDate: string | null     // ISO date YYYY-MM-DD
  expiryDate: string | null    // ISO date YYYY-MM-DD
  isCurrent: boolean
  createdAt: string
}

// ─── APPLICATION ─────────────────────────────────────────────────────────────

export interface Application {
  id: string
  studentId: string
  school: string | null
  program: string | null
  intakeDate: string | null    // ISO date YYYY-MM-DD
  status: string | null
  createdAt: string
}

// ─── CONSULTATION ────────────────────────────────────────────────────────────

export interface Consultation {
  id: string
  studentId: string
  consultDate: string          // ISO date YYYY-MM-DD
  notes: string
  tags: string[]
  createdAt: string
}

// ─── ENRICHED TYPES (joined queries) ─────────────────────────────────────────

/** Student with their current visa attached */
export interface StudentWithVisa extends Student {
  currentVisa: Visa | null
}

/** Student with latest consultation date */
export interface StudentWithLastConsult extends Student {
  lastConsultDate: string | null
}
