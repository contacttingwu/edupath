import { supabase } from '@/lib/supabase'
import { mapAusEdu } from './mappers'
import type { AusEdu } from '@/types'
import type { AusEduInsert, AusEduUpdate } from '@/types/database'

export async function getAusEduByStudentId(studentId: string): Promise<AusEdu[]> {
  const { data, error } = await supabase
    .from('australian_education')
    .select('*')
    .eq('student_id', studentId)
    .order('start_date', { ascending: false })

  if (error) throw error
  return data.map(mapAusEdu)
}

export async function createAusEdu(input: AusEduInsert): Promise<AusEdu> {
  const { data, error } = await supabase
    .from('australian_education')
    .insert(input)
    .select()
    .single()

  if (error) throw error
  return mapAusEdu(data)
}

export async function updateAusEdu(id: string, input: AusEduUpdate): Promise<AusEdu> {
  const { data, error } = await supabase
    .from('australian_education')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return mapAusEdu(data)
}

export async function deleteAusEdu(id: string): Promise<void> {
  const { error } = await supabase.from('australian_education').delete().eq('id', id)
  if (error) throw error
}
