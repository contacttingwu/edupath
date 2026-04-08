import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Kanban } from 'lucide-react'
import { getAllStudents } from '@/lib/api/students'
import { Avatar } from '@/components/ui/Avatar'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { STUDENT_STATUSES } from '@/types/database'
import type { StudentStatus } from '@/types/database'
import type { Student } from '@/types'

const STATUS_COLORS: Record<StudentStatus, string> = {
  'Consulting':          'border-t-slate-400',
  'Documents Preparing': 'border-t-amber-400',
  'Applied':             'border-t-blue-400',
  'Awaiting Decision':   'border-t-indigo-400',
  'Offer Received':      'border-t-violet-400',
  'Enrolled':            'border-t-emerald-400',
  'Visa Lodged':         'border-t-cyan-400',
  'Visa Approved':       'border-t-green-500',
  'Visa Refused':        'border-t-rose-500',
  'Departed':            'border-t-slate-300',
}

function StudentPill({ student }: { student: Student }) {
  const navigate = useNavigate()
  return (
    <button
      className="w-full flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-left"
      onClick={(e) => {
        e.stopPropagation()
        navigate('/students/' + student.id)
      }}
    >
      <Avatar name={student.name} id={student.id} size="sm" />
      <span className="text-xs text-slate-700 truncate leading-tight">
        {student.preferredName ?? student.name.split(' ')[0]}
      </span>
    </button>
  )
}

function PipelineColumn({
  status,
  students,
}: {
  status: StudentStatus
  students: Student[]
}) {
  return (
    <div
      className={
        'shrink-0 w-40 bg-white rounded-xl border border-slate-200 border-t-4 ' +
        STATUS_COLORS[status]
      }
    >
      <div className="px-3 pt-3 pb-2 border-b border-slate-100">
        <p className="text-xs font-semibold text-slate-600 leading-tight truncate">{status}</p>
        <p className="text-lg font-bold text-slate-900">{students.length}</p>
      </div>
      <div className="p-2 space-y-0.5 max-h-48 overflow-y-auto">
        {students.length === 0 && (
          <p className="text-xs text-slate-300 text-center py-3">—</p>
        )}
        {students.map((s) => (
          <StudentPill key={s.id} student={s} />
        ))}
      </div>
    </div>
  )
}

export function PipelineMini() {
  const { data: students, isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: getAllStudents,
    refetchInterval: 1000 * 60 * 5,
  })

  const byStatus = STUDENT_STATUSES.reduce<Record<StudentStatus, Student[]>>(
    (acc, status) => {
      acc[status] = []
      return acc
    },
    {} as Record<StudentStatus, Student[]>
  )

  for (const student of students ?? []) {
    byStatus[student.status].push(student)
  }

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <Kanban size={18} className="text-violet-500" />
        <h2 className="text-sm font-semibold text-slate-900">Pipeline Overview</h2>
      </div>

      {isLoading && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="shrink-0 w-40">
              <Skeleton className="h-32 rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && (
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
          {STUDENT_STATUSES.map((status) => (
            <PipelineColumn
              key={status}
              status={status}
              students={byStatus[status]}
            />
          ))}
        </div>
      )}
    </Card>
  )
}
