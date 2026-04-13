import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MessageSquare, Plus, Pencil } from 'lucide-react'
import { getConsultationsByStudentId } from '@/lib/api/consultations'
import { AddConsultationModal } from './AddConsultationModal'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { SkeletonRow } from '@/components/ui/Skeleton'
import { formatDate } from '@/lib/utils'
import type { Consultation } from '@/types'

interface ConsultationLogProps {
  studentId: string
}

export function ConsultationLog({ studentId }: ConsultationLogProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingConsultation, setEditingConsultation] = useState<Consultation | null>(null)

  const { data: consultations, isLoading } = useQuery({
    queryKey: ['consultations', studentId],
    queryFn: () => getConsultationsByStudentId(studentId),
  })

  function openNew() {
    setEditingConsultation(null)
    setModalOpen(true)
  }

  function openEdit(c: Consultation) {
    setEditingConsultation(c)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingConsultation(null)
  }

  return (
    <>
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare size={16} className="text-violet-500" />
          <h3 className="text-sm font-semibold text-slate-900">Consultation Log</h3>
          {consultations && consultations.length > 0 && (
            <span className="text-xs text-slate-400">
              {consultations.length} session{consultations.length !== 1 ? 's' : ''}
            </span>
          )}
          <button
            onClick={openNew}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 text-violet-700 text-xs font-medium hover:bg-violet-100 transition-colors"
          >
            <Plus size={13} /> Log New
          </button>
        </div>

        {isLoading && (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <SkeletonRow key={i} />)}
          </div>
        )}

        {!isLoading && (!consultations || consultations.length === 0) && (
          <div className="py-8 text-center">
            <p className="text-sm text-slate-400">No consultations logged yet.</p>
          </div>
        )}

        {!isLoading && consultations && consultations.length > 0 && (
          <div className="space-y-4">
            {consultations.map((c) => (
              <div key={c.id} className="relative pl-4 border-l-2 border-slate-200 group">
                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-violet-400" />
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-slate-700">
                    {formatDate(c.consultDate)}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {c.tags.map((tag) => (
                      <Badge key={tag} variant="purple">{tag}</Badge>
                    ))}
                  </div>
                  <button
                    onClick={() => openEdit(c)}
                    className="ml-auto p-1 rounded-md text-slate-300 hover:text-violet-600 hover:bg-violet-50 transition-colors opacity-0 group-hover:opacity-100"
                    title="Edit consultation"
                  >
                    <Pencil size={13} />
                  </button>
                </div>
                <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                  {c.notes}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {modalOpen && (
        <AddConsultationModal
          studentId={studentId}
          consultation={editingConsultation ?? undefined}
          onClose={closeModal}
        />
      )}
    </>
  )
}
