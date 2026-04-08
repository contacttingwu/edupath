// Auto-generated from supabase/migrations/001_initial_schema.sql
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
          ec_name: string | null
          ec_relationship: string | null
          ec_phone: string | null
          ec_email: string | null
          ec_addr: string | null
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
          ec_name?: string | null
          ec_relationship?: string | null
          ec_phone?: string | null
          ec_email?: string | null
          ec_addr?: string | null
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
          ec_name?: string | null
          ec_relationship?: string | null
          ec_phone?: string | null
          ec_email?: string | null
          ec_addr?: string | null
          education_history?: string | null
          work_experience?: string | null
          status?: StudentStatus
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
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
          created_at?: string
        }
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
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
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
  | 'Departed'

export const STUDENT_STATUSES: StudentStatus[] = [
  'Consulting',
  'Documents Preparing',
  'Applied',
  'Awaiting Decision',
  'Offer Received',
  'Enrolled',
  'Visa Lodged',
  'Visa Approved',
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
