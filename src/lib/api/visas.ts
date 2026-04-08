import { supabase } from '@/lib/supabase'
import { mapVisa } from './mappers'
import type { Visa } from '@/types'
import type { VisaInsert } from '@/types/database'

export async function getVisasByStudentId(studentId: string): Promise<Visa[]> {
  const { data, error } = await supabase
    .from('visas')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data.map(mapVisa)
}

export async function getCurrentVisa(studentId: string): Promise<Visa | null> {
  const { data, error } = await supabase
    .from('visas')
    .select('*')
    .eq('student_id', studentId)
    .eq('is_current', true)
    .maybeSingle()

  if (error) throw error
  return data ? mapVisa(data) : null
}

export async function createVisa(input: VisaInsert): Promise<Visa> {
  const { data, error } = await supabase
    .from('visas')
    .insert(input)
    .select()
    .single()

  if (error) throw error
  return mapVisa(data)
}

/** Sets the given visa as current; clears is_current on all others for the student */
export async function setCurrentVisa(visaId: string, studentId: string): Promise<void> {
  // Clear all current visas for this student first
  const { error: clearError } = await supabase
    .from('visas')
    .update({ is_current: false })
    .eq('student_id', studentId)

  if (clearError) throw clearError

  const { error } = await supabase
    .from('visas')
    .update({ is_current: true })
    .eq('id', visaId)

  if (error) throw error
}

/** All current visas with days until expiry — used by visa tracker and sidebar badge */
export async function getAllCurrentVisas(): Promise<Visa[]> {
  const { data, error } = await supabase
    .from('visas')
    .select('*')
    .eq('is_current', true)
    .not('expiry_date', 'is', null)
    .order('expiry_date')

  if (error) throw error
  return data.map(mapVisa)
}

/** Visas expiring within the given number of days */
export async function getExpiringVisas(withinDays: number): Promise<Visa[]> {
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)

  const cutoff = new Date(today)
  cutoff.setDate(cutoff.getDate() + withinDays)

  const { data, error } = await supabase
    .from('visas')
    .select('*')
    .eq('is_current', true)
    .lte('expiry_date', cutoff.toISOString().slice(0, 10))
    .order('expiry_date')

  if (error) throw error
  return data.map(mapVisa)
}
