import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { X } from 'lucide-react'
import { format } from 'date-fns'
import { createConsultation } from '@/lib/api/consultations'
import { getAllStudents } from '@/lib/api/students'
import { FormField, Input, Textarea, Select } from '@/components/ui/FormField'

const schema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  consultDate: z.string().min(1, 'Date is required'),
  notes: z.string().min(1, 'Notes are required'),
  tagsRaw: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface AddConsultationModalProps {
  studentId?: string   // pre-select a student
  onClose: () => void
  onSuccess?: () => void
}

export function AddConsultationModal({ studentId, onClose, onSuccess }: AddConsultationModalProps) {
  const queryClient = useQueryClient()
  const backdropRef = useRef<HTMLDivElement>(null)

  const studentsQuery = useQuery({
    queryKey: ['students'],
    queryFn: getAllStudents,
    enabled: !studentId,
  })

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: {
      studentId: studentId ?? '',
      consultDate: format(new Date(), 'yyyy-MM-dd'),
      notes: '',
      tagsRaw: '',
    },
  })

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const tags = values.tagsRaw
        ? values.tagsRaw.split(',').map((t) => t.trim()).filter(Boolean)
        : []
      return createConsultation({
        student_id: values.studentId,
        consult_date: values.consultDate,
        notes: values.notes,
        tags,
      })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['consultations'] })
      void queryClient.invalidateQueries({ queryKey: ['students'] })
      toast.success('Consultation logged')
      onSuccess?.()
      onClose()
    },
    onError: () => toast.error('Failed to log consultation'),
  })

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === backdropRef.current) onClose() }}
    >
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-900">Log Consultation</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit((v) => mutation.mutate(v))}
          className="p-6 space-y-4"
        >
          {/* Student selector — only shown when no studentId pre-selected */}
          {!studentId && (
            <FormField label="Student" required error={errors.studentId?.message}>
              <Select {...register('studentId')} error={!!errors.studentId}>
                <option value="">— Select student —</option>
                {(studentsQuery.data ?? []).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}{s.preferredName ? ' (' + s.preferredName + ')' : ''}
                  </option>
                ))}
              </Select>
            </FormField>
          )}

          <FormField label="Date" required error={errors.consultDate?.message}>
            <Input {...register('consultDate')} type="date" error={!!errors.consultDate} />
          </FormField>

          <FormField label="Notes" required error={errors.notes?.message}>
            <Textarea
              {...register('notes')}
              error={!!errors.notes}
              rows={5}
              placeholder="Discuss visa requirements, documents needed, timeline…"
            />
          </FormField>

          <FormField label="Tags" error={errors.tagsRaw?.message}>
            <Input
              {...register('tagsRaw')}
              placeholder="e.g. Visa, Documents, Follow-up (comma separated)"
            />
          </FormField>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-4 py-2 rounded-lg text-sm bg-violet-600 text-white font-medium hover:bg-violet-700 disabled:opacity-50 transition-colors"
            >
              {mutation.isPending ? 'Saving…' : 'Log Consultation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
