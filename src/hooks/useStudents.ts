import { useQuery } from '@tanstack/react-query'
import { useMemo, useEffect, useState } from 'react'
import { getAllStudents } from '@/lib/api/students'
import { getAllCurrentVisas } from '@/lib/api/visas'
import { getRecentConsultations } from '@/lib/api/consultations'
import type { Student, Visa, StudentWithVisa } from '@/types'
import type { StudentStatus } from '@/types/database'

export interface StudentRow extends StudentWithVisa {
  lastConsultDate: string | null
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

function matchesSearch(student: Student, visa: Visa | null, query: string): boolean {
  const q = query.toLowerCase()
  return (
    student.name.toLowerCase().includes(q) ||
    (student.preferredName?.toLowerCase().includes(q) ?? false) ||
    (student.email?.toLowerCase().includes(q) ?? false) ||
    (student.nationality?.toLowerCase().includes(q) ?? false) ||
    (visa?.visaType?.toLowerCase().includes(q) ?? false)
  )
}

interface UseStudentsOptions {
  search?: string
  status?: StudentStatus | null
}

export function useStudents({ search = '', status = null }: UseStudentsOptions = {}) {
  const debouncedSearch = useDebounce(search.trim(), 300)

  const studentsQuery = useQuery({
    queryKey: ['students'],
    queryFn: getAllStudents,
  })

  const visasQuery = useQuery({
    queryKey: ['visas', 'current'],
    queryFn: getAllCurrentVisas,
  })

  // Last consult date per student from recent 50 consultations
  const consultQuery = useQuery({
    queryKey: ['consultations', 'recent'],
    queryFn: () => getRecentConsultations(50),
  })

  const rows = useMemo<StudentRow[]>(() => {
    if (!studentsQuery.data) return []

    const visaMap = new Map<string, Visa>(
      (visasQuery.data ?? []).map((v) => [v.studentId, v])
    )

    // Build last consult date per student
    const lastConsultMap = new Map<string, string>()
    for (const c of consultQuery.data ?? []) {
      if (!lastConsultMap.has(c.studentId)) {
        lastConsultMap.set(c.studentId, c.consultDate)
      }
    }

    let students = studentsQuery.data

    if (status) {
      students = students.filter((s) => s.status === status)
    }

    if (debouncedSearch) {
      students = students.filter((s) =>
        matchesSearch(s, visaMap.get(s.id) ?? null, debouncedSearch)
      )
    }

    return students.map((s) => ({
      ...s,
      currentVisa: visaMap.get(s.id) ?? null,
      lastConsultDate: lastConsultMap.get(s.id) ?? null,
    }))
  }, [studentsQuery.data, visasQuery.data, consultQuery.data, status, debouncedSearch])

  return {
    rows,
    isLoading: studentsQuery.isLoading || visasQuery.isLoading,
    error: studentsQuery.error ?? visasQuery.error,
    total: studentsQuery.data?.length ?? 0,
  }
}
