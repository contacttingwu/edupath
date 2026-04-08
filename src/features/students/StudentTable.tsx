import { useNavigate } from 'react-router-dom'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { SkeletonRow } from '@/components/ui/Skeleton'
import { formatDate, getVisaStatus } from '@/lib/utils'
import { deleteStudent } from '@/lib/api/students'
import type { StudentRow } from '@/hooks/useStudents'
import type { StudentStatus } from '@/types/database'

const STATUS_VARIANT: Record<StudentStatus, 'purple' | 'neutral' | 'safe' | 'warning'> = {
  'Consulting':          'neutral',
  'Documents Preparing': 'warning',
  'Applied':             'neutral',
  'Awaiting Decision':   'warning',
  'Offer Received':      'purple',
  'Enrolled':            'safe',
  'Visa Lodged':         'neutral',
  'Visa Approved':       'safe',
  'Departed':            'neutral',
}

function ActionMenu({ studentId, onDelete }: { studentId: string; onDelete: () => void }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v) }}
        className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
        aria-label="Actions"
      >
        <MoreHorizontal size={16} />
      </button>

      {open && (
        <div className="absolute right-0 top-8 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1">
          <button
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            onClick={(e) => {
              e.stopPropagation()
              setOpen(false)
              navigate('/students/' + studentId + '/edit')
            }}
          >
            <Pencil size={14} />
            Edit
          </button>
          <button
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
            onClick={(e) => {
              e.stopPropagation()
              setOpen(false)
              onDelete()
            }}
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

interface StudentTableProps {
  rows: StudentRow[]
  isLoading: boolean
}

export function StudentTable({ rows, isLoading }: StudentTableProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['students'] })
      toast.success('Student deleted')
      setConfirmId(null)
    },
    onError: () => toast.error('Failed to delete student'),
  })

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 px-4">
        {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
        <p className="text-slate-400 text-sm">No students found.</p>
        <p className="text-slate-300 text-xs mt-1">Try adjusting your search or filter.</p>
      </div>
    )
  }

  return (
    <>
      {/* Confirm delete dialog */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl p-6 w-80">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Delete student?</h3>
            <p className="text-sm text-slate-500 mb-5">
              This will permanently remove the student and all their records.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                className="px-4 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors"
                onClick={() => setConfirmId(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg text-sm bg-rose-600 text-white hover:bg-rose-700 transition-colors"
                onClick={() => deleteMutation.mutate(confirmId)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left text-xs font-medium text-slate-500 px-4 py-3 w-48">Student</th>
                <th className="text-left text-xs font-medium text-slate-500 px-4 py-3">Nationality</th>
                <th className="text-left text-xs font-medium text-slate-500 px-4 py-3">Contact</th>
                <th className="text-left text-xs font-medium text-slate-500 px-4 py-3">Visa Type</th>
                <th className="text-left text-xs font-medium text-slate-500 px-4 py-3">Visa Expiry</th>
                <th className="text-left text-xs font-medium text-slate-500 px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-slate-500 px-4 py-3">Last Consult</th>
                <th className="px-4 py-3 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => {
                const visaStatus = getVisaStatus(row.currentVisa?.expiryDate)
                const expiryVariant =
                  row.currentVisa?.expiryDate ? visaStatus.variant : 'unknown'

                return (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => navigate('/students/' + row.id)}
                  >
                    {/* Name */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={row.name} id={row.id} size="sm" />
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 truncate">
                            {row.preferredName ?? row.name}
                          </p>
                          {row.preferredName && (
                            <p className="text-xs text-slate-400 truncate">{row.name}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Nationality */}
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      {row.nationality ?? '—'}
                    </td>

                    {/* Contact */}
                    <td className="px-4 py-3">
                      <p className="text-slate-600 truncate max-w-[160px]">
                        {row.email ?? row.phone ?? '—'}
                      </p>
                    </td>

                    {/* Visa Type */}
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      {row.currentVisa?.visaType ?? '—'}
                    </td>

                    {/* Visa Expiry */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {row.currentVisa?.expiryDate ? (
                        <Badge variant={expiryVariant}>
                          {formatDate(row.currentVisa.expiryDate)}
                        </Badge>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge variant={STATUS_VARIANT[row.status]}>
                        {row.status}
                      </Badge>
                    </td>

                    {/* Last Consult */}
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {row.lastConsultDate ? formatDate(row.lastConsultDate) : '—'}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <ActionMenu
                        studentId={row.id}
                        onDelete={() => setConfirmId(row.id)}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
