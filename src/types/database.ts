// Auto-generated from supabase/migrations/001_initial_schema.sql + 003_form_enhancements.sql
// Regenerate with: npx supabase gen types typescript --project-id <your-project-id>

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      students: {
        Row: {
          id: string
          name: string
          preferred_name: string | null
          dob: string | null
          nationality: string | null
          email: string | null
          phone: string | null
          addr_overseas: string | null
          addr_home: string | null
          google_drive_link: string | null
          // Emergency contact 1
          ec_name: string | null
          ec_relationship: string | null
          ec_phone: string | null
          ec_email: string | null
          ec_addr: string | null
          // Emergency contact 2
          ec2_name: string | null
          ec2_relationship: string | null
          ec2_phone: string | null
          ec2_email: string | null
          ec2_addr: string | null
          education_history: string | null
          work_experience: string | null
          status: StudentStatus
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          preferred_name?: string | null
          dob?: string | null
          nationality?: string | null
          email?: string | null
          phone?: string | null
          addr_overseas?: string | null
          addr_home?: string | null
          google_drive_link?: string | null
          ec_name?: string | null
          ec_relationship?: string | null
          ec_phone?: string | null
          ec_email?: string | null
          ec_addr?: string | null
          ec2_name?: string | null
          ec2_relationship?: string | null
          ec2_phone?: string | null
          ec2_email?: string | null
          ec2_addr?: string | null
          education_history?: string | null
          work_experience?: string | null
          status?: StudentStatus
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          preferred_name?: string | null
          dob?: string | null
          nationality?: string | null
          email?: string | null
          phone?: string | null
          addr_overseas?: string | null
          addr_home?: string | null
          google_drive_link?: string | null
          ec_name?: string | null
          ec_relationship?: string | null
          ec_phone?: string | null
          ec_email?: string | null
          ec_addr?: string | null
          ec2_name?: string | null
          ec2_relationship?: string | null
          ec2_phone?: string | null
          ec2_email?: string | null
          ec2_addr?: string | null
          education_history?: string | null
          work_experience?: string | null
          status?: StudentStatus
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      visas: {
        Row: {
          id: string
          student_id: string
          visa_type: string | null
          visa_number: string | null
          issue_date: string | null
          expiry_date: string | null
          is_current: boolean
          outcome: VisaOutcome
          appeal_decision: VisaAppealDecision | null
          appeal_status: string | null
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          visa_type?: string | null
          visa_number?: string | null
          issue_date?: string | null
          expiry_date?: string | null
          is_current?: boolean
          outcome?: VisaOutcome
          appeal_decision?: VisaAppealDecision | null
          appeal_status?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          visa_type?: string | null
          visa_number?: string | null
          issue_date?: string | null
          expiry_date?: string | null
          is_current?: boolean
          outcome?: VisaOutcome
          appeal_decision?: VisaAppealDecision | null
          appeal_status?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'visas_student_id_fkey'
            columns: ['student_id']
            isOneToOne: false
            referencedRelation: 'students'
            referencedColumns: ['id']
          }
        ]
      }
      applications: {
        Row: {
          id: string
          student_id: string
          school: string | null
          program: string | null
          intake_date: string | null
          status: string | null
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          school?: string | null
          program?: string | null
          intake_date?: string | null
          status?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          school?: string | null
          program?: string | null
          intake_date?: string | null
          status?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'applications_student_id_fkey'
            columns: ['student_id']
            isOneToOne: false
            referencedRelation: 'students'
            referencedColumns: ['id']
          }
        ]
      }
      consultations: {
        Row: {
          id: string
          student_id: string
          consult_date: string
          notes: string
          tags: string[]
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          consult_date: string
          notes: string
          tags?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          consult_date?: string
          notes?: string
          tags?: string[]
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'consultations_student_id_fkey'
            columns: ['student_id']
            isOneToOne: false
            referencedRelation: 'students'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type StudentStatus =
  | 'Consulting'
  | 'Documents Preparing'
  | 'Applied'
  | 'Awaiting Decision'
  | 'Offer Received'
  | 'Enrolled'
  | 'Visa Lodged'
  | 'Visa Approved'
  | 'Visa Refused'
  | 'Departed'

export type VisaOutcome = 'pending' | 'granted' | 'refused'
export type VisaAppealDecision = 'appeal' | 'left'

export const APPEAL_STATUSES = [
  'Preparing',
  'Submitted',
  'Under Review',
  'Outcome Received',
  'Withdrawn',
] as const
export type AppealStatus = (typeof APPEAL_STATUSES)[number]

export const STUDENT_STATUSES: StudentStatus[] = [
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
]

// Convenience row types
export type StudentRow = Database['public']['Tables']['students']['Row']
export type StudentInsert = Database['public']['Tables']['students']['Insert']
export type StudentUpdate = Database['public']['Tables']['students']['Update']

export type VisaRow = Database['public']['Tables']['visas']['Row']
export type VisaInsert = Database['public']['Tables']['visas']['Insert']
export type VisaUpdate = Database['public']['Tables']['visas']['Update']

export type ApplicationRow = Database['public']['Tables']['applications']['Row']
export type ApplicationInsert = Database['public']['Tables']['applications']['Insert']
export type ApplicationUpdate = Database['public']['Tables']['applications']['Update']

export type ConsultationRow = Database['public']['Tables']['consultations']['Row']
export type ConsultationInsert = Database['public']['Tables']['consultations']['Insert']
export type ConsultationUpdate = Database['public']['Tables']['consultations']['Update']
