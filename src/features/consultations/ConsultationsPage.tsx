import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MessageSquare, Search } from 'lucide-react'
import { getAllConsultations } from '@/lib/api/consultations'
import { getAllStudents } from '@/lib/api/students'
import { AddConsultationModal } from '@/features/students/AddConsultationModal'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatDate } from '@/lib/utils'
import { useUIStore } from '@/store/ui'
import type { Consultation, Student } from '@/types'

// ─── Enriched row type ───────────────────────────────────────────────────────

interface ConsultRow {
  consultation: Consultation
  student: Student | undefined
}

// ─── Consultation row ────────────────────────────────────────────────────────

function ConsultationRow({ row }: { row: ConsultRow }) {
  const navigate = useNavigate()
  const { consultation: c, student } = row

  return (
    <tr
      className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
      onClick={() => student && navigate('/students/' + student.id)}
    >
      <td className="py-3 px-4">
        <span className="text-sm text-slate-700 font-medium">
          {formatDate(c.consultDate)}
        </span>
      </td>
      <td className="py-3 px-4">
        {student ? (
          <div className="flex items-center gap-3">
            <Avatar name={student.name} id={student.id} size="sm" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {student.preferredName ?? student.name}
              </p>
              {student.nationality && (
                <p className="text-xs text-slate-400 truncate">{student.nationality}</p>
              )}
            </div>
          </div>
        ) : (
          <span className="text-xs text-slate-400">Unknown student</span>
        )}
      </td>
      <td className="py-3 px-4 max-w-xs">
        <p className="text-sm text-slate-600 truncate">{c.notes}</p>
      </td>
      <td className="py-3 px-4">
        <div className="flex flex-wrap gap-1">
          {c.tags.length === 0 && <span className="text-xs text-slate-300">—</span>}
          {c.tags.map((tag) => (
            <Badge key={tag} variant="purple">{tag}</Badge>
          ))}
        </div>
      </td>
      <td className="py-3 px-4">
        {student && (
          <Badge variant="neutral">{student.status}</Badge>
        )}
      </td>
    </tr>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function ConsultationsPage() {
  const addConsultationOpen = useUIStore((s) => s.addConsultationOpen)
  const closeAddConsultation = useUIStore((s) => s.closeAddConsultation)
  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState<string | null>(null)

  const consultQuery = useQuery({
    queryKey: ['consultations', 'all'],
    queryFn: getAllConsultations,
    refetchInterval: 1000 * 60 * 5,
  })

  const studentsQuery = useQuery({
    queryKey: ['students'],
    queryFn: getAllStudents,
  })

  const studentMap = useMemo(
    () => new Map((studentsQuery.data ?? []).map((s) => [s.id, s])),
    [studentsQuery.data]
  )

  // Collect all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    for (const c of consultQuery.data ?? []) {
      c.tags.forEach((t) => tagSet.add(t))
    }
    return [...tagSet].sort()
  }, [consultQuery.data])

  // Filter rows
  const rows: ConsultRow[] = useMemo(() => {
    const consults = consultQuery.data ?? []
    const q = search.toLowerCase().trim()

    return consults
      .map((c) => ({ consultation: c, student: studentMap.get(c.studentId) }))
      .filter(({ consultation: c, student }) => {
        if (tagFilter && !c.tags.includes(tagFilter)) return false
        if (!q) return true
        const name = student ? (student.preferredName ?? student.name).toLowerCase() : ''
        return (
          name.includes(q) ||
          c.notes.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
        )
      })
  }, [consultQuery.data, studentMap, search, tagFilter])

  const isLoading = consultQuery.isLoading || studentsQuery.isLoading

  return (
    <>
      <div className="space-y-5">
        {/* Header row */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="relative flex-1 max-w-xs">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search by student, notes, or tag…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 bg-white"
              />
            </div>

            {/* Tag filter chips */}
            {allTags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
                    className={
                      'text-xs px-2.5 py-1 rounded-full font-medium transition-colors ' +
                      (tagFilter === tag
                        ? 'bg-violet-600 text-white'
                        : 'bg-violet-50 text-violet-700 hover:bg-violet-100')
                    }
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        {!isLoading && (
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-900">{rows.length}</span> session
            {rows.length !== 1 ? 's' : ''}
            {(search || tagFilter) && (
              <span className="text-slate-400"> (filtered from {consultQuery.data?.length ?? 0})</span>
            )}
          </p>
        )}

        {/* Table */}
        <Card className="overflow-hidden">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-lg" />
              ))}
            </div>
          ) : rows.length === 0 ? (
            <div className="py-16 text-center">
              <MessageSquare size={32} className="mx-auto mb-3 text-slate-300" />
              <p className="text-sm text-slate-500">No consultations found.</p>
              {(search || tagFilter) && (
                <button
                  onClick={() => { setSearch(''); setTagFilter(null) }}
                  className="mt-2 text-xs text-violet-600 hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide w-32">
                      Date
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Student
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Notes
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Tags
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Stage
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ consultation, student }) => (
                    <ConsultationRow
                      key={consultation.id}
                      row={{ consultation, student }}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {addConsultationOpen && (
        <AddConsultationModal
          onClose={closeAddConsultation}
        />
      )}
    </>
  )
}
