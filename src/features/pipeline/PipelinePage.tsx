import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { usePageTitle } from '@/hooks/usePageTitle'
import { getAllStudents, updateStudent } from '@/lib/api/students'
import { getAllCurrentVisas } from '@/lib/api/visas'
import { getRecentConsultations } from '@/lib/api/consultations'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatDate, getVisaStatus } from '@/lib/utils'
import { STUDENT_STATUSES } from '@/types/database'
import type { StudentStatus } from '@/types/database'
import type { Student, Visa } from '@/types'

// ─── Column colour theme ─────────────────────────────────────────────────────

const COLUMN_THEME: Record<StudentStatus, { header: string; dot: string }> = {
  'Consulting':          { header: 'bg-slate-100 text-slate-600',    dot: 'bg-slate-400'    },
  'Documents Preparing': { header: 'bg-amber-50 text-amber-700',     dot: 'bg-amber-400'    },
  'Applied':             { header: 'bg-blue-50 text-blue-700',       dot: 'bg-blue-400'     },
  'Awaiting Decision':   { header: 'bg-indigo-50 text-indigo-700',   dot: 'bg-indigo-400'   },
  'Offer Received':      { header: 'bg-violet-50 text-violet-700',   dot: 'bg-violet-500'   },
  'Enrolled':            { header: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500'  },
  'Visa Lodged':         { header: 'bg-cyan-50 text-cyan-700',       dot: 'bg-cyan-500'     },
  'Visa Approved':       { header: 'bg-green-50 text-green-700',     dot: 'bg-green-500'    },
  'Visa Refused':        { header: 'bg-rose-50 text-rose-700',       dot: 'bg-rose-500'     },
  'Departed':            { header: 'bg-slate-50 text-slate-500',     dot: 'bg-slate-300'    },
}

// ─── Student card ────────────────────────────────────────────────────────────

interface StudentCardProps {
  student: Student
  visa: Visa | null
  lastConsultDate: string | null
  statuses: StudentStatus[]
  onMove: (studentId: string, newStatus: StudentStatus) => void
}

function StudentCard({ student, visa, lastConsultDate, statuses, onMove }: StudentCardProps) {
  const navigate = useNavigate()
  const visaStatus = visa?.expiryDate ? getVisaStatus(visa.expiryDate) : null
  const currentIndex = statuses.indexOf(student.status)

  return (
    <div
      className="bg-white rounded-lg border border-slate-200 p-3 cursor-pointer hover:border-violet-300 hover:shadow-sm transition-all group"
      onClick={() => navigate('/students/' + student.id)}
    >
      {/* Name row */}
      <div className="flex items-center gap-2 mb-2">
        <Avatar name={student.name} id={student.id} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-900 truncate leading-tight">
            {student.preferredName ?? student.name}
          </p>
          {student.nationality && (
            <p className="text-xs text-slate-400 truncate">{student.nationality}</p>
          )}
        </div>
      </div>

      {/* Visa expiry badge */}
      {visaStatus && visaStatus.variant !== 'safe' && (
        <div className="mb-2">
          <Badge variant={visaStatus.variant}>
            Visa: {visaStatus.label}
          </Badge>
        </div>
      )}

      {/* Last consult */}
      {lastConsultDate && (
        <p className="text-xs text-slate-400 mb-2">
          Last consult: {formatDate(lastConsultDate)}
        </p>
      )}

      {/* Move buttons — shown on hover */}
      <div
        className="hidden group-hover:flex items-center gap-1 pt-2 border-t border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-xs text-slate-400 mr-1">Move to:</span>
        {currentIndex > 0 && (
          <button
            className="text-xs px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            onClick={() => onMove(student.id, statuses[currentIndex - 1])}
            title={statuses[currentIndex - 1]}
          >
            ← {statuses[currentIndex - 1].split(' ')[0]}
          </button>
        )}
        {currentIndex < statuses.length - 1 && (
          <button
            className="text-xs px-1.5 py-0.5 rounded bg-violet-50 hover:bg-violet-100 text-violet-700 transition-colors"
            onClick={() => onMove(student.id, statuses[currentIndex + 1])}
            title={statuses[currentIndex + 1]}
          >
            {statuses[currentIndex + 1].split(' ')[0]} →
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Pipeline column ─────────────────────────────────────────────────────────

interface PipelineColumnProps {
  status: StudentStatus
  students: Student[]
  visaMap: Map<string, Visa>
  lastConsultMap: Map<string, string>
  onMove: (studentId: string, newStatus: StudentStatus) => void
}

function PipelineColumn({ status, students, visaMap, lastConsultMap, onMove }: PipelineColumnProps) {
  const theme = COLUMN_THEME[status]

  return (
    <div className="shrink-0 w-52 flex flex-col rounded-xl border border-slate-200 overflow-hidden bg-slate-50 max-h-[calc(100vh-12rem)]">
      {/* Header */}
      <div className={'px-3 py-2.5 flex items-center gap-2 shrink-0 ' + theme.header}>
        <div className={'w-2 h-2 rounded-full shrink-0 ' + theme.dot} />
        <span className="text-xs font-semibold truncate flex-1">{status}</span>
        <span className="text-xs font-bold ml-auto shrink-0">{students.length}</span>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {students.length === 0 && (
          <div className="flex items-center justify-center h-16">
            <p className="text-xs text-slate-300">Empty</p>
          </div>
        )}
        {students.map((s) => (
          <StudentCard
            key={s.id}
            student={s}
            visa={visaMap.get(s.id) ?? null}
            lastConsultDate={lastConsultMap.get(s.id) ?? null}
            statuses={STUDENT_STATUSES}
            onMove={onMove}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function PipelinePage() {
  usePageTitle('Pipeline')
  const queryClient = useQueryClient()

  const studentsQuery = useQuery({
    queryKey: ['students'],
    queryFn: getAllStudents,
    refetchInterval: 1000 * 60 * 5,
  })

  const visasQuery = useQuery({
    queryKey: ['visas', 'current'],
    queryFn: getAllCurrentVisas,
  })

  const consultQuery = useQuery({
    queryKey: ['consultations', 'recent'],
    queryFn: () => getRecentConsultations(100),
  })

  const moveMutation = useMutation({
    mutationFn: ({ studentId, status }: { studentId: string; status: StudentStatus }) =>
      updateStudent(studentId, { status }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['students'] })
      toast.success('Status updated')
    },
    onError: () => toast.error('Failed to update status'),
  })

  const isLoading = studentsQuery.isLoading

  // Build lookup maps
  const visaMap = new Map<string, Visa>(
    (visasQuery.data ?? []).map((v) => [v.studentId, v])
  )

  const lastConsultMap = new Map<string, string>()
  for (const c of consultQuery.data ?? []) {
    if (!lastConsultMap.has(c.studentId)) {
      lastConsultMap.set(c.studentId, c.consultDate)
    }
  }

  // Group students by status
  const byStatus = STUDENT_STATUSES.reduce<Record<StudentStatus, Student[]>>(
    (acc, s) => { acc[s] = []; return acc },
    {} as Record<StudentStatus, Student[]>
  )
  for (const student of studentsQuery.data ?? []) {
    byStatus[student.status].push(student)
  }

  const handleMove = (studentId: string, newStatus: StudentStatus) => {
    moveMutation.mutate({ studentId, status: newStatus })
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Summary bar */}
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <p className="text-sm text-slate-500">
          <span className="font-semibold text-slate-900">{studentsQuery.data?.length ?? 0}</span> students across{' '}
          <span className="font-semibold text-slate-900">
            {STUDENT_STATUSES.filter((s) => byStatus[s]?.length > 0).length}
          </span>{' '}
          stages
        </p>
        <p className="text-xs text-slate-400">Hover a card to move it to an adjacent stage.</p>
      </div>

      {/* Columns */}
      {isLoading ? (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="shrink-0 w-52">
              <Skeleton className="h-96 rounded-xl" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-4 flex-1">
          {STUDENT_STATUSES.map((status) => (
            <PipelineColumn
              key={status}
              status={status}
              students={byStatus[status]}
              visaMap={visaMap}
              lastConsultMap={lastConsultMap}
              onMove={handleMove}
            />
          ))}
        </div>
      )}
    </div>
  )
}
