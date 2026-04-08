import type { StudentRow, VisaRow, ApplicationRow, ConsultationRow } from '@/types/database'
import type { Student, Visa, Application, Consultation } from '@/types'

export function mapStudent(row: StudentRow): Student {
  return {
    id: row.id,
    name: row.name,
    preferredName: row.preferred_name,
    dob: row.dob,
    nationality: row.nationality,
    email: row.email,
    phone: row.phone,
    addrOverseas: row.addr_overseas,
    addrHome: row.addr_home,
    googleDriveLink: row.google_drive_link,
    locationType: row.location_type,
    emergencyContact: {
      name: row.ec_name,
      relationship: row.ec_relationship,
      phone: row.ec_phone,
      email: row.ec_email,
      address: row.ec_addr,
    },
    emergencyContact2: {
      name: row.ec2_name,
      relationship: row.ec2_relationship,
      phone: row.ec2_phone,
      email: row.ec2_email,
      address: row.ec2_addr,
    },
    educationHistory: row.education_history,
    workExperience: row.work_experience,
    status: row.status,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function mapVisa(row: VisaRow): Visa {
  return {
    id: row.id,
    studentId: row.student_id,
    visaType: row.visa_type,
    visaNumber: row.visa_number,
    issueDate: row.issue_date,
    expiryDate: row.expiry_date,
    isCurrent: row.is_current,
    outcome: row.outcome,
    appealDecision: row.appeal_decision,
    appealStatus: row.appeal_status,
    createdAt: row.created_at,
  }
}

export function mapApplication(row: ApplicationRow): Application {
  return {
    id: row.id,
    studentId: row.student_id,
    school: row.school,
    program: row.program,
    intakeDate: row.intake_date,
    status: row.status,
    isChosen: row.is_chosen,
    createdAt: row.created_at,
  }
}

export function mapConsultation(row: ConsultationRow): Consultation {
  return {
    id: row.id,
    studentId: row.student_id,
    consultDate: row.consult_date,
    notes: row.notes,
    tags: row.tags,
    createdAt: row.created_at,
  }
}
