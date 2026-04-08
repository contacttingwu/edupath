import { supabase } from '@/lib/supabase'
import { mapApplication } from './mappers'
import type { Application } from '@/types'
import type { ApplicationInsert, ApplicationUpdate } from '@/types/database'

export async function getApplicationsByStudentId(studentId: string): Promise<Application[]> {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data.map(mapApplication)
}

export async function createApplication(input: ApplicationInsert): Promise<Application> {
  const { data, error } = await supabase
    .from('applications')
    .insert(input)
    .select()
    .single()

  if (error) throw error
  return mapApplication(data)
}

export async function updateApplication(
  id: string,
  input: ApplicationUpdate
): Promise<Application> {
  const { data, error } = await supabase
    .from('applications')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return mapApplication(data)
}

export async function deleteApplication(id: string): Promise<void> {
  const { error } = await supabase.from('applications').delete().eq('id', id)
  if (error) throw error
}

/** Count of pending applications (not yet enrolled/approved) */
export async function getPendingApplicationsCount(): Promise<number> {
  const { count, error } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })
    .in('status', ['Considering', 'Documents Submitted', 'Application Submitted'])

  if (error) throw error
  return count ?? 0
}
