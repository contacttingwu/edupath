import { supabase } from '@/lib/supabase'
import { mapConsultation } from './mappers'
import type { Consultation } from '@/types'
import type { ConsultationInsert, ConsultationUpdate } from '@/types/database'

export async function getConsultationsByStudentId(studentId: string): Promise<Consultation[]> {
  const { data, error } = await supabase
    .from('consultations')
    .select('*')
    .eq('student_id', studentId)
    .order('consult_date', { ascending: false })

  if (error) throw error
  return data.map(mapConsultation)
}

/** All consultations across all students — for the Consultations page */
export async function getAllConsultations(): Promise<Consultation[]> {
  const { data, error } = await supabase
    .from('consultations')
    .select('*')
    .order('consult_date', { ascending: false })

  if (error) throw error
  return data.map(mapConsultation)
}

/** Most recent consultations across all students — for dashboard widget */
export async function getRecentConsultations(limit = 5): Promise<Consultation[]> {
  const { data, error } = await supabase
    .from('consultations')
    .select('*')
    .order('consult_date', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data.map(mapConsultation)
}

export async function createConsultation(input: ConsultationInsert): Promise<Consultation> {
  const { data, error } = await supabase
    .from('consultations')
    .insert(input)
    .select()
    .single()

  if (error) throw error
  return mapConsultation(data)
}

export async function updateConsultation(
  id: string,
  input: ConsultationUpdate
): Promise<Consultation> {
  const { data, error } = await supabase
    .from('consultations')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return mapConsultation(data)
}

export async function deleteConsultation(id: string): Promise<void> {
  const { error } = await supabase.from('consultations').delete().eq('id', id)
  if (error) throw error
}
