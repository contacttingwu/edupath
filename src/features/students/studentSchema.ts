import { z } from 'zod'
import type { StudentStatus } from '@/types/database'

const STATUS_TUPLE = [
  'Consulting',
  'Documents Preparing',
  'Applied',
  'Awaiting Decision',
  'Offer Received',
  'Enrolled',
  'Visa Lodged',
  'Visa Approved',
  'Departed',
] as const satisfies [StudentStatus, ...StudentStatus[]]

const statusEnum = z.enum(STATUS_TUPLE)

export const studentSchema = z.object({
  // Personal
  name: z.string().min(1, 'Full name is required'),
  preferredName: z.string().optional(),
  dob: z.string().optional(),
  nationality: z.string().optional(),

  // Contact
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  addrOverseas: z.string().optional(),
  addrHome: z.string().optional(),

  // Emergency contact
  ecName: z.string().optional(),
  ecRelationship: z.string().optional(),
  ecPhone: z.string().optional(),
  ecEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  ecAddr: z.string().optional(),

  // Background
  educationHistory: z.string().optional(),
  workExperience: z.string().optional(),

  // Pipeline
  status: statusEnum,
  notes: z.string().optional(),

  // Visa (optional — creates a visa record if filled)
  visaType: z.string().optional(),
  visaNumber: z.string().optional(),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),

  // Application
  school: z.string().optional(),
  program: z.string().optional(),
  intakeDate: z.string().optional(),
  applicationStatus: z.string().optional(),
})

export type StudentFormValues = z.infer<typeof studentSchema>
