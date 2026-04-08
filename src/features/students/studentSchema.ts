import { z } from 'zod'
import type { StudentStatus, VisaOutcome, VisaAppealDecision } from '@/types/database'

const STATUS_TUPLE = [
  'Consulting',
  'Documents Preparing',
  'Applied',
  'Awaiting Decision',
  'Offer Received',
  'Enrolled',
  'Visa Lodged',
  'Visa Approved',
  'Visa Refused',
  'Departed',
] as const satisfies [StudentStatus, ...StudentStatus[]]

const VISA_OUTCOME_TUPLE = ['pending', 'granted', 'refused'] as const satisfies [VisaOutcome, ...VisaOutcome[]]
const APPEAL_DECISION_TUPLE = ['appeal', 'left'] as const satisfies [VisaAppealDecision, VisaAppealDecision]

export const visaEntrySchema = z.object({
  id: z.string().optional(),
  visaType: z.string().optional(),
  visaNumber: z.string().optional(),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
  isCurrent: z.boolean().optional(),
  outcome: z.enum(VISA_OUTCOME_TUPLE).optional(),
  appealDecision: z.enum(APPEAL_DECISION_TUPLE).optional(),
  appealStatus: z.string().optional(),
})

export const applicationEntrySchema = z.object({
  id: z.string().optional(),
  school: z.string().optional(),
  program: z.string().optional(),
  intakeDate: z.string().optional(),
  status: z.string().optional(),
})

export const studentSchema = z.object({
  // Personal
  name: z.string().min(1, 'Full name is required'),
  preferredName: z.string().optional(),
  dob: z.string().optional(),
  nationality: z.string().optional(),

  // Contact
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  addrOverseas: z.string().optional(),
  addrHome: z.string().optional(),
  googleDriveLink: z.string().url('Must be a valid URL').optional().or(z.literal('')),

  // Emergency contact 1
  ecName: z.string().optional(),
  ecRelationship: z.string().optional(),
  ecPhone: z.string().optional(),
  ecEmail: z.string().email('Invalid email').optional().or(z.literal('')),
  ecAddr: z.string().optional(),

  // Emergency contact 2
  ec2Name: z.string().optional(),
  ec2Relationship: z.string().optional(),
  ec2Phone: z.string().optional(),
  ec2Email: z.string().email('Invalid email').optional().or(z.literal('')),
  ec2Addr: z.string().optional(),

  // Background
  educationHistory: z.string().optional(),
  workExperience: z.string().optional(),

  // Pipeline
  status: z.enum(STATUS_TUPLE),
  notes: z.string().optional(),

  // Visa history (dynamic list)
  visas: z.array(visaEntrySchema).optional(),

  // Applications (up to 5 course options)
  applications: z.array(applicationEntrySchema).optional(),
})

export type StudentFormValues = z.infer<typeof studentSchema>
export type VisaEntryValues = z.infer<typeof visaEntrySchema>
export type ApplicationEntryValues = z.infer<typeof applicationEntrySchema>
