import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Resolver } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ChevronDown, ChevronUp, Plus, Trash2, Link, Star } from 'lucide-react'
import { studentSchema, type StudentFormValues } from './studentSchema'
import { FormField, Input, Textarea, Select } from '@/components/ui/FormField'
import { createStudent, getStudentById, updateStudent } from '@/lib/api/students'
import { getVisasByStudentId, createVisa, updateVisa, deleteVisa } from '@/lib/api/visas'
import { getApplicationsByStudentId, createApplication, updateApplication, deleteApplication } from '@/lib/api/applications'
import { STUDENT_STATUSES, APPEAL_STATUSES } from '@/types/database'
import type { StudentInsert, StudentUpdate } from '@/types/database'

// ─── Collapsible section ─────────────────────────────────────────────────────

function Section({
  title,
  children,
  defaultOpen = true,
  badge,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  badge?: number
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-900">{title}</span>
          {badge != null && badge > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700 text-xs font-medium">
              {badge}
            </span>
          )}
        </div>
        {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>
      {open && <div className="border-t border-slate-100">{children}</div>}
    </div>
  )
}

function SectionBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
      {children}
    </div>
  )
}

function FullWidth({ children }: { children: React.ReactNode }) {
  return <div className="sm:col-span-2">{children}</div>
}

// ─── Visa row ────────────────────────────────────────────────────────────────

function VisaRow({
  index,
  register,
  watch,
  onRemove,
  onSetCurrent,
  isCurrent,
  errors,
}: {
  index: number
  register: ReturnType<typeof useForm<StudentFormValues>>['register']
  watch: ReturnType<typeof useForm<StudentFormValues>>['watch']
  onRemove: () => void
  onSetCurrent: () => void
  isCurrent: boolean
  errors: ReturnType<typeof useForm<StudentFormValues>>['formState']['errors']
}) {
  const outcome = watch('visas.' + index + '.outcome' as 'visas.0.outcome')
  const appealDecision = watch('visas.' + index + '.appealDecision' as 'visas.0.appealDecision')
  const visaErrors = errors.visas?.[index]

  return (
    <div className={
      'border rounded-xl p-4 space-y-4 ' +
      (isCurrent ? 'border-violet-300 bg-violet-50/30' : 'border-slate-200')
    }>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Visa {index + 1}</span>
          {isCurrent && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 font-medium">
              Current
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isCurrent && (
            <button
              type="button"
              onClick={onSetCurrent}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-violet-600 transition-colors"
            >
              <Star size={12} /> Set as current
            </button>
          )}
          <button
            type="button"
            onClick={onRemove}
            className="p-1 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Core fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Visa Type" error={visaErrors?.visaType?.message}>
          <Input {...register('visas.' + index + '.visaType' as 'visas.0.visaType')} placeholder="e.g. Student Visa (Subclass 500)" />
        </FormField>
        <FormField label="Visa Number" error={visaErrors?.visaNumber?.message}>
          <Input {...register('visas.' + index + '.visaNumber' as 'visas.0.visaNumber')} placeholder="e.g. SV-2025-TW-12345" />
        </FormField>
        <FormField label="Issue Date">
          <Input {...register('visas.' + index + '.issueDate' as 'visas.0.issueDate')} type="date" />
        </FormField>
        <FormField label="Expiry Date">
          <Input {...register('visas.' + index + '.expiryDate' as 'visas.0.expiryDate')} type="date" />
        </FormField>
        <FormField label="Outcome">
          <Select {...register('visas.' + index + '.outcome' as 'visas.0.outcome')}>
            <option value="pending">Pending</option>
            <option value="granted">Granted</option>
            <option value="refused">Refused</option>
          </Select>
        </FormField>
      </div>

      {/* Refusal / Appeal fields — only shown when outcome is refused */}
      {outcome === 'refused' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
          <div className="sm:col-span-2">
            <p className="text-xs font-medium text-rose-600 mb-3">Visa Refusal Details</p>
          </div>
          <FormField label="Decision">
            <Select {...register('visas.' + index + '.appealDecision' as 'visas.0.appealDecision')}>
              <option value="">— Select —</option>
              <option value="appeal">Lodge Appeal</option>
              <option value="left">Student Left / Withdrew</option>
            </Select>
          </FormField>

          {appealDecision === 'appeal' && (
            <FormField label="Appeal Status">
              <Select {...register('visas.' + index + '.appealStatus' as 'visas.0.appealStatus')}>
                <option value="">— Select —</option>
                {APPEAL_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </FormField>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Application row ─────────────────────────────────────────────────────────

function ApplicationRow({
  index,
  register,
  onRemove,
  errors,
}: {
  index: number
  register: ReturnType<typeof useForm<StudentFormValues>>['register']
  onRemove: () => void
  errors: ReturnType<typeof useForm<StudentFormValues>>['formState']['errors']
}) {
  const appErrors = errors.applications?.[index]
  return (
    <div className="border border-slate-200 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-600">Option {index + 1}</span>
        <button
          type="button"
          onClick={onRemove}
          className="p-1 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="School / Institution" error={appErrors?.school?.message}>
          <Input
            {...register('applications.' + index + '.school' as 'applications.0.school')}
            placeholder="e.g. UNSW Sydney"
          />
        </FormField>
        <FormField label="Program / Course" error={appErrors?.program?.message}>
          <Input
            {...register('applications.' + index + '.program' as 'applications.0.program')}
            placeholder="e.g. Master of IT"
          />
        </FormField>
        <FormField label="Intake Date">
          <Input
            {...register('applications.' + index + '.intakeDate' as 'applications.0.intakeDate')}
            type="date"
          />
        </FormField>
        <FormField label="Application Status">
          <Input
            {...register('applications.' + index + '.status' as 'applications.0.status')}
            placeholder="e.g. Offer Received"
          />
        </FormField>
      </div>
    </div>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────

const EMPTY_VISA = { visaType: '', visaNumber: '', issueDate: '', expiryDate: '', isCurrent: false, outcome: 'pending' as const }
const EMPTY_APP = { school: '', program: '', intakeDate: '', status: '' }

function emptyApps(count: number) {
  return Array.from({ length: count }, () => ({ ...EMPTY_APP }))
}

export function StudentFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const studentQuery = useQuery({
    queryKey: ['students', id],
    queryFn: () => getStudentById(id!),
    enabled: isEdit,
  })
  const visasQuery = useQuery({
    queryKey: ['visas', 'all', id],
    queryFn: () => getVisasByStudentId(id!),
    enabled: isEdit,
  })
  const appsQuery = useQuery({
    queryKey: ['applications', id],
    queryFn: () => getApplicationsByStudentId(id!),
    enabled: isEdit,
  })

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
    formState: { errors, isDirty },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema) as Resolver<StudentFormValues>,
    defaultValues: {
      status: 'Consulting',
      visas: [],
      applications: emptyApps(5),
    },
  })

  const visaArray = useFieldArray({ control, name: 'visas' as 'visas' })
  const appArray = useFieldArray({ control, name: 'applications' as 'applications' })

  // Pre-fill form when editing
  useEffect(() => {
    const s = studentQuery.data
    if (!s) return
    const fetchedVisas = visasQuery.data ?? []
    const fetchedApps = appsQuery.data ?? []

    // Pad apps to at least 5 rows
    const paddedApps = [
      ...fetchedApps.map((a) => ({
        id: a.id,
        school: a.school ?? '',
        program: a.program ?? '',
        intakeDate: a.intakeDate ?? '',
        status: a.status ?? '',
      })),
      ...emptyApps(Math.max(0, 5 - fetchedApps.length)),
    ]

    reset({
      name: s.name,
      preferredName: s.preferredName ?? '',
      dob: s.dob ?? '',
      nationality: s.nationality ?? '',
      email: s.email ?? '',
      phone: s.phone ?? '',
      addrOverseas: s.addrOverseas ?? '',
      addrHome: s.addrHome ?? '',
      googleDriveLink: s.googleDriveLink ?? '',
      ecName: s.emergencyContact.name ?? '',
      ecRelationship: s.emergencyContact.relationship ?? '',
      ecPhone: s.emergencyContact.phone ?? '',
      ecEmail: s.emergencyContact.email ?? '',
      ecAddr: s.emergencyContact.address ?? '',
      ec2Name: s.emergencyContact2.name ?? '',
      ec2Relationship: s.emergencyContact2.relationship ?? '',
      ec2Phone: s.emergencyContact2.phone ?? '',
      ec2Email: s.emergencyContact2.email ?? '',
      ec2Addr: s.emergencyContact2.address ?? '',
      educationHistory: s.educationHistory ?? '',
      workExperience: s.workExperience ?? '',
      status: s.status,
      notes: s.notes ?? '',
      visas: fetchedVisas.map((v) => ({
        id: v.id,
        visaType: v.visaType ?? '',
        visaNumber: v.visaNumber ?? '',
        issueDate: v.issueDate ?? '',
        expiryDate: v.expiryDate ?? '',
        isCurrent: v.isCurrent,
        outcome: v.outcome,
        appealDecision: v.appealDecision ?? undefined,
        appealStatus: v.appealStatus ?? '',
      })),
      applications: paddedApps,
    })
  }, [studentQuery.data, visasQuery.data, appsQuery.data, reset])

  // ─── Save logic ─────────────────────────────────────────────────────────

  async function persistVisas(studentId: string, formVisas: NonNullable<StudentFormValues['visas']>) {
    const existing = visasQuery.data ?? []
    const existingIds = new Set(existing.map((v) => v.id))

    // Upsert each visa from the form
    for (const fv of formVisas) {
      const hasContent = fv.visaType || fv.expiryDate || fv.outcome !== 'pending'
      if (!hasContent) continue

      const payload = {
        student_id: studentId,
        visa_type: fv.visaType || null,
        visa_number: fv.visaNumber || null,
        issue_date: fv.issueDate || null,
        expiry_date: fv.expiryDate || null,
        is_current: fv.isCurrent,
        outcome: fv.outcome,
        appeal_decision: fv.appealDecision ?? null,
        appeal_status: fv.appealStatus || null,
      }

      if (fv.id && existingIds.has(fv.id)) {
        await updateVisa(fv.id, payload)
        existingIds.delete(fv.id)
      } else {
        await createVisa(payload)
      }
    }

    // Delete visas that were removed from the form
    for (const removedId of existingIds) {
      await deleteVisa(removedId)
    }
  }

  async function persistApplications(studentId: string, formApps: NonNullable<StudentFormValues['applications']>) {
    const existing = appsQuery.data ?? []
    const existingIds = new Set(existing.map((a) => a.id))

    for (const fa of formApps) {
      if (!fa.school) continue

      const payload = {
        student_id: studentId,
        school: fa.school || null,
        program: fa.program || null,
        intake_date: fa.intakeDate || null,
        status: fa.status || null,
      }

      if (fa.id && existingIds.has(fa.id)) {
        await updateApplication(fa.id, payload)
        existingIds.delete(fa.id)
      } else {
        await createApplication(payload)
      }
    }

    // Delete applications that were cleared
    for (const removedId of existingIds) {
      await deleteApplication(removedId)
    }
  }

  const saveMutation = useMutation({
    mutationFn: async (values: StudentFormValues) => {
      const studentPayload = {
        name: values.name,
        preferred_name: values.preferredName || null,
        dob: values.dob || null,
        nationality: values.nationality || null,
        email: values.email || null,
        phone: values.phone || null,
        addr_overseas: values.addrOverseas || null,
        addr_home: values.addrHome || null,
        google_drive_link: values.googleDriveLink || null,
        ec_name: values.ecName || null,
        ec_relationship: values.ecRelationship || null,
        ec_phone: values.ecPhone || null,
        ec_email: values.ecEmail || null,
        ec_addr: values.ecAddr || null,
        ec2_name: values.ec2Name || null,
        ec2_relationship: values.ec2Relationship || null,
        ec2_phone: values.ec2Phone || null,
        ec2_email: values.ec2Email || null,
        ec2_addr: values.ec2Addr || null,
        education_history: values.educationHistory || null,
        work_experience: values.workExperience || null,
        status: values.status,
        notes: values.notes || null,
      }

      let studentId: string
      if (isEdit) {
        await updateStudent(id!, studentPayload as StudentUpdate)
        studentId = id!
      } else {
        const created = await createStudent(studentPayload as StudentInsert)
        studentId = created.id
      }

      await persistVisas(studentId, values.visas ?? [])
      await persistApplications(studentId, values.applications ?? [])

      return studentId
    },
    onSuccess: (studentId) => {
      void queryClient.invalidateQueries({ queryKey: ['students'] })
      void queryClient.invalidateQueries({ queryKey: ['visas'] })
      void queryClient.invalidateQueries({ queryKey: ['applications'] })
      toast.success(isEdit ? 'Student updated' : 'Student created')
      navigate('/students/' + studentId)
    },
    onError: () => toast.error('Failed to save student'),
  })

  const isLoadingData = isEdit && (studentQuery.isLoading || visasQuery.isLoading)

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 rounded-full border-2 border-violet-600 border-t-transparent animate-spin" />
      </div>
    )
  }

  const visaValues = watch('visas')

  return (
    <form
      onSubmit={handleSubmit((v) => saveMutation.mutate(v as StudentFormValues))}
      className="max-w-3xl mx-auto space-y-4"
    >
      {/* ── Personal Information ── */}
      <Section title="Personal Information">
        <SectionBody>
          <FormField label="Full Name" required error={errors.name?.message}>
            <Input {...register('name')} error={!!errors.name} placeholder="e.g. Chen Wei" />
          </FormField>
          <FormField label="Preferred Name">
            <Input {...register('preferredName')} placeholder="e.g. Wei" />
          </FormField>
          <FormField label="Date of Birth">
            <Input {...register('dob')} type="date" />
          </FormField>
          <FormField label="Nationality">
            <Input {...register('nationality')} placeholder="e.g. Taiwanese" />
          </FormField>
          <FormField label="Email" error={errors.email?.message}>
            <Input {...register('email')} type="email" placeholder="student@email.com" />
          </FormField>
          <FormField label="Phone">
            <Input {...register('phone')} placeholder="+886 912 345 678" />
          </FormField>
          <FullWidth>
            <FormField label="Overseas Address">
              <Input {...register('addrOverseas')} placeholder="Current address overseas" />
            </FormField>
          </FullWidth>
          <FullWidth>
            <FormField label="Home Address">
              <Input {...register('addrHome')} placeholder="Home country address" />
            </FormField>
          </FullWidth>
          <FullWidth>
            <FormField label="Google Drive Folder" error={errors.googleDriveLink?.message}>
              <div className="relative">
                <Link size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  {...register('googleDriveLink')}
                  error={!!errors.googleDriveLink}
                  className="pl-8"
                  placeholder="https://drive.google.com/drive/folders/..."
                />
              </div>
            </FormField>
          </FullWidth>
        </SectionBody>
      </Section>

      {/* ── Emergency Contact 1 ── */}
      <Section title="Emergency Contact 1" defaultOpen={false}>
        <SectionBody>
          <FormField label="Full Name">
            <Input {...register('ecName')} placeholder="Contact name" />
          </FormField>
          <FormField label="Relationship">
            <Input {...register('ecRelationship')} placeholder="e.g. Mother" />
          </FormField>
          <FormField label="Phone">
            <Input {...register('ecPhone')} placeholder="+886 912 000 000" />
          </FormField>
          <FormField label="Email" error={errors.ecEmail?.message}>
            <Input {...register('ecEmail')} type="email" placeholder="contact@email.com" />
          </FormField>
          <FullWidth>
            <FormField label="Address">
              <Input {...register('ecAddr')} placeholder="Emergency contact address" />
            </FormField>
          </FullWidth>
        </SectionBody>
      </Section>

      {/* ── Emergency Contact 2 ── */}
      <Section title="Emergency Contact 2" defaultOpen={false}>
        <SectionBody>
          <FormField label="Full Name">
            <Input {...register('ec2Name')} placeholder="Contact name" />
          </FormField>
          <FormField label="Relationship">
            <Input {...register('ec2Relationship')} placeholder="e.g. Father" />
          </FormField>
          <FormField label="Phone">
            <Input {...register('ec2Phone')} placeholder="+886 912 000 000" />
          </FormField>
          <FormField label="Email" error={errors.ec2Email?.message}>
            <Input {...register('ec2Email')} type="email" placeholder="contact@email.com" />
          </FormField>
          <FullWidth>
            <FormField label="Address">
              <Input {...register('ec2Addr')} placeholder="Emergency contact address" />
            </FormField>
          </FullWidth>
        </SectionBody>
      </Section>

      {/* ── Visa History ── */}
      <Section title="Visa History" defaultOpen={false} badge={visaArray.fields.length}>
        <div className="px-6 py-5 space-y-4">
          {visaArray.fields.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-4">No visa records yet.</p>
          )}
          {visaArray.fields.map((field, index) => (
            <VisaRow
              key={field.id}
              index={index}
              register={register}
              watch={watch}
              isCurrent={visaValues?.[index]?.isCurrent ?? false}
              errors={errors}
              onRemove={() => visaArray.remove(index)}
              onSetCurrent={() => {
                visaValues?.forEach((_, i) => {
                  setValue('visas.' + i + '.isCurrent' as 'visas.0.isCurrent', i === index)
                })
              }}
            />
          ))}
          <button
            type="button"
            onClick={() => visaArray.append({ ...EMPTY_VISA, isCurrent: visaArray.fields.length === 0 })}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-slate-300 text-sm text-slate-500 hover:border-violet-400 hover:text-violet-600 transition-colors"
          >
            <Plus size={15} /> Add Visa Record
          </button>
        </div>
      </Section>

      {/* ── Education & Work ── */}
      <Section title="Education & Work Experience" defaultOpen={false}>
        <SectionBody>
          <FullWidth>
            <FormField label="Education History">
              <Textarea {...register('educationHistory')} rows={4} placeholder="University, degree, graduation year…" />
            </FormField>
          </FullWidth>
          <FullWidth>
            <FormField label="Work Experience">
              <Textarea {...register('workExperience')} rows={4} placeholder="Employer, role, dates…" />
            </FormField>
          </FullWidth>
        </SectionBody>
      </Section>

      {/* ── Application Details ── */}
      <Section title="Course Applications" defaultOpen={false} badge={appArray.fields.length}>
        <div className="px-6 py-5 space-y-4">
          <div className="sm:col-span-2 mb-2">
            <FormField label="Pipeline Status" required error={errors.status?.message}>
              <Select {...register('status')} error={!!errors.status}>
                {STUDENT_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </FormField>
          </div>

          {appArray.fields.map((field, index) => (
            <ApplicationRow
              key={field.id}
              index={index}
              register={register}
              errors={errors}
              onRemove={() => appArray.remove(index)}
            />
          ))}

          {appArray.fields.length < 10 && (
            <button
              type="button"
              onClick={() => appArray.append({ ...EMPTY_APP })}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-slate-300 text-sm text-slate-500 hover:border-violet-400 hover:text-violet-600 transition-colors"
            >
              <Plus size={15} /> Add Course Option
            </button>
          )}
        </div>
      </Section>

      {/* ── Notes ── */}
      <Section title="Notes" defaultOpen={false}>
        <SectionBody>
          <FullWidth>
            <FormField label="Notes">
              <Textarea {...register('notes')} rows={4} placeholder="Any additional notes…" />
            </FormField>
          </FullWidth>
        </SectionBody>
      </Section>

      {/* ── Actions ── */}
      <div className="flex items-center justify-end gap-3 pt-2 pb-8">
        <button
          type="button"
          className="px-5 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors"
          onClick={() => navigate(isEdit ? '/students/' + id : '/students')}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saveMutation.isPending || (!isDirty && isEdit)}
          className="px-5 py-2.5 rounded-lg text-sm bg-violet-600 text-white font-medium hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saveMutation.isPending
            ? (isEdit ? 'Saving…' : 'Creating…')
            : (isEdit ? 'Save Changes' : 'Create Student')}
        </button>
      </div>
    </form>
  )
}
