import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'
import { getRecentConsultations } from '@/lib/api/consultations'
import { getAllStudents } from '@/lib/api/students'
import { Avatar } from '@/components/ui/Avatar'
import { Card } from '@/components/ui/Card'
import { SkeletonRow } from '@/components/ui/Skeleton'
import { formatDate, truncate } from '@/lib/utils'

export function RecentConsultations() {
  const navigate = useNavigate()

  const consultQuery = useQuery({
    queryKey: ['consultations', 'recent'],
    queryFn: () => getRecentConsultations(5),
    refetchInterval: 1000 * 60 * 5,
  })

  const studentsQuery = useQuery({
    queryKey: ['students'],
    queryFn: getAllStudents,
  })

  const isLoading = consultQuery.isLoading || studentsQuery.isLoading

  const studentMap = new Map(
    (studentsQuery.data ?? []).map((s) => [s.id, s])
  )

  const consultations = consultQuery.data ?? []

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare size={18} className="text-violet-500" />
        <h2 className="text-sm font-semibold text-slate-900">Recent Consultations</h2>
      </div>

      {isLoading && (
        <div className="divide-y divide-slate-100">
          {[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}
        </div>
      )}

      {!isLoading && consultations.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-sm text-slate-400">No consultations logged yet.</p>
        </div>
      )}

      {!isLoading && consultations.length > 0 && (
        <div className="divide-y divide-slate-100">
          {consultations.map((consult) => {
            const student = studentMap.get(consult.studentId)
            if (!student) return null
            return (
              <button
                key={consult.id}
                className="w-full flex items-start gap-3 py-3 text-left hover:bg-slate-50 -mx-1 px-1 rounded-lg transition-colors"
                onClick={() => navigate('/students/' + student.id)}
              >
                <Avatar name={student.name} id={student.id} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {student.preferredName ?? student.name}
                    </p>
                    <span className="text-xs text-slate-400 shrink-0">
                      {formatDate(consult.consultDate)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {truncate(consult.notes, 80)}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </Card>
  )
}
