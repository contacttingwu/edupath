import { useUIStore } from '@/store/ui'
import { useStudents } from '@/hooks/useStudents'
import { getAllStudents } from '@/lib/api/students'
import { useQuery } from '@tanstack/react-query'
import { StatusFilterBar } from './StatusFilterBar'
import { StudentTable } from './StudentTable'
import { STUDENT_STATUSES } from '@/types/database'
import type { StudentStatus } from '@/types/database'

export function StudentListPage() {
  const searchQuery = useUIStore((s) => s.searchQuery)
  const statusFilter = useUIStore((s) => s.statusFilter)
  const setStatusFilter = useUIStore((s) => s.setStatusFilter)

  const { rows, isLoading } = useStudents({
    search: searchQuery,
    status: statusFilter as StudentStatus | null,
  })

  // All students (unfiltered) for counts in filter bar
  const allStudentsQuery = useQuery({
    queryKey: ['students'],
    queryFn: getAllStudents,
  })

  const counts = STUDENT_STATUSES.reduce<Partial<Record<StudentStatus, number>>>(
    (acc, status) => {
      acc[status] = allStudentsQuery.data?.filter((s) => s.status === status).length ?? 0
      return acc
    },
    {}
  )

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <StatusFilterBar
        active={statusFilter as StudentStatus | null}
        counts={counts}
        total={allStudentsQuery.data?.length ?? 0}
        onChange={(s) => setStatusFilter(s)}
      />

      <div className="text-xs text-slate-400 px-1">
        {!isLoading && (
          rows.length === (allStudentsQuery.data?.length ?? 0)
            ? rows.length + ' students'
            : rows.length + ' of ' + (allStudentsQuery.data?.length ?? 0) + ' students'
        )}
      </div>

      <StudentTable rows={rows} isLoading={isLoading} />
    </div>
  )
}
