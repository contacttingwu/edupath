import { useQuery } from '@tanstack/react-query'
import { getAllCurrentVisas } from '@/lib/api/visas'
import { getAllStudents } from '@/lib/api/students'
import { daysUntil } from '@/lib/utils'
import type { Visa, Student } from '@/types'

export interface VisaAlertEntry {
  visa: Visa
  student: Student
  daysLeft: number
}

export interface VisaAlertSummary {
  expired: VisaAlertEntry[]    // daysLeft < 0
  urgent: VisaAlertEntry[]     // 0–7 days
  warning: VisaAlertEntry[]    // 8–30 days
  safe: VisaAlertEntry[]       // > 30 days
  alertCount: number           // expired + urgent + warning (≤ 30 days)
  all: VisaAlertEntry[]        // all entries sorted by expiry
}

export function useVisaAlerts() {
  const visasQuery = useQuery({
    queryKey: ['visas', 'current'],
    queryFn: getAllCurrentVisas,
    refetchInterval: 1000 * 60 * 5, // 5 min
  })

  const studentsQuery = useQuery({
    queryKey: ['students'],
    queryFn: getAllStudents,
  })

  const isLoading = visasQuery.isLoading || studentsQuery.isLoading
  const error = visasQuery.error ?? studentsQuery.error

  const summary: VisaAlertSummary = (() => {
    if (!visasQuery.data || !studentsQuery.data) {
      return { expired: [], urgent: [], warning: [], safe: [], alertCount: 0, all: [] }
    }

    const studentMap = new Map(studentsQuery.data.map((s) => [s.id, s]))
    const entries: VisaAlertEntry[] = []

    for (const visa of visasQuery.data) {
      if (!visa.expiryDate) continue
      const student = studentMap.get(visa.studentId)
      if (!student) continue
      entries.push({ visa, student, daysLeft: daysUntil(visa.expiryDate) })
    }

    entries.sort((a, b) => a.daysLeft - b.daysLeft)

    const expired = entries.filter((e) => e.daysLeft < 0)
    const urgent = entries.filter((e) => e.daysLeft >= 0 && e.daysLeft <= 7)
    const warning = entries.filter((e) => e.daysLeft > 7 && e.daysLeft <= 30)
    const safe = entries.filter((e) => e.daysLeft > 30)

    return {
      expired,
      urgent,
      warning,
      safe,
      alertCount: expired.length + urgent.length + warning.length,
      all: entries,
    }
  })()

  return { summary, isLoading, error }
}
