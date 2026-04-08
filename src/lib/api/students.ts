import { supabase } from '@/lib/supabase'
import { mapStudent, mapVisa } from './mappers'
import type { Student, StudentWithVisa } from '@/types'
import type { StudentInsert, StudentStatus, StudentUpdate } from '@/types/database'

export async function getAllStudents(): Promise<Student[]> {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('name')

  if (error) throw error
  return data.map(mapStudent)
}

export async function getStudentsWithCurrentVisa(): Promise<StudentWithVisa[]> {
  const { data, error } = await supabase
    .from('students')
    .select('*, visas!inner(*)')
    .eq('visas.is_current', true)
    .order('name')

  if (error) {
    // If no visa rows exist yet, fall back to students without visa
    const { data: students, error: err2 } = await supabase
      .from('students')
      .select('*')
      .order('name')
    if (err2) throw err2
    return students.map((s) => ({ ...mapStudent(s), currentVisa: null }))
  }

  return data.map((row) => {
    const rowAny = row as Record<string, unknown>
    const visaRows = Array.isArray(rowAny['visas']) ? (rowAny['visas'] as unknown[]) : []
    const { visas: _visas, ...studentRow } = rowAny
    void _visas
    return {
      ...mapStudent(studentRow as Parameters<typeof mapStudent>[0]),
      currentVisa: visaRows.length > 0 ? mapVisa(visaRows[0] as Parameters<typeof mapVisa>[0]) : null,
    }
  })
}

export async function getStudentById(id: string): Promise<Student> {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return mapStudent(data)
}

export async function createStudent(input: StudentInsert): Promise<Student> {
  const { data, error } = await supabase
    .from('students')
    .insert(input)
    .select()
    .single()

  if (error) throw error
  return mapStudent(data)
}

export async function updateStudent(id: string, input: StudentUpdate): Promise<Student> {
  const { data, error } = await supabase
    .from('students')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return mapStudent(data)
}

export async function deleteStudent(id: string): Promise<void> {
  const { error } = await supabase.from('students').delete().eq('id', id)
  if (error) throw error
}

/** Search students by name, email, nationality */
export async function searchStudents(query: string): Promise<Student[]> {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .or(
      'name.ilike.' + '%' + query + '%' + ',' +
      'preferred_name.ilike.' + '%' + query + '%' + ',' +
      'email.ilike.' + '%' + query + '%' + ',' +
      'nationality.ilike.' + '%' + query + '%'
    )
    .order('name')

  if (error) throw error
  return data.map(mapStudent)
}

/** Filter students by pipeline status */
export async function getStudentsByStatus(status: StudentStatus): Promise<Student[]> {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('status', status)
    .order('name')

  if (error) throw error
  return data.map(mapStudent)
}
