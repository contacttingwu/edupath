import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Pencil, ExternalLink, Phone, Mail, MapPin,
  GraduationCap, Briefcase, BookOpen, User,
} from 'lucide-react'
import { getStudentById } from '@/lib/api/students'
import { getVisasByStudentId } from '@/lib/api/visas'
import { getApplicationsByStudentId } from '@/lib/api/applications'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { ProgressTrack } from './ProgressTrack'
import { VisaInfoCard } from './VisaInfoCard'
import { ConsultationLog } from './ConsultationLog'
import { formatDate } from '@/lib/utils'
import type { EmergencyContact } from '@/types'
import type { Application } from '@/types'

// ─── Small info row ──────────────────────────────────────────────────────────

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 text-slate-400 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm text-slate-800 break-words">{value}</p>
      </div>
    </div>
  )
}

// ─── Contact card ────────────────────────────────────────────────────────────

function ContactCard({ title, student }: {
  title: string
  student: {
    email: string | null
    phone: string | null
    addrOverseas: string | null
    addrHome: string | null
  }
}) {
  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">{title}</h3>
      <div className="space-y-3">
        <InfoRow icon={<Mail size={14} />} label="Email" value={
          student.email
            ? <a href={'mailto:' + student.email} className="text-violet-600 hover:underline">{student.email}</a>
            : null
        } />
        <InfoRow icon={<Phone size={14} />} label="Phone" value={student.phone} />
        <InfoRow icon={<MapPin size={14} />} label="Overseas Address" value={student.addrOverseas} />
        <InfoRow icon={<MapPin size={14} />} label="Home Address" value={student.addrHome} />
      </div>
    </Card>
  )
}

// ─── Emergency contact card ──────────────────────────────────────────────────

function EmergencyContactCard({ title, contact }: { title: string; contact: EmergencyContact }) {
  const hasAny = contact.name || contact.phone || contact.email
  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">{title}</h3>
      {!hasAny && <p className="text-sm text-slate-400">Not provided.</p>}
      <div className="space-y-3">
        <InfoRow icon={<User size={14} />} label="Name" value={
          contact.name
            ? contact.name + (contact.relationship ? ' (' + contact.relationship + ')' : '')
            : null
        } />
        <InfoRow icon={<Phone size={14} />} label="Phone" value={contact.phone} />
        <InfoRow icon={<Mail size={14} />} label="Email" value={contact.email} />
        <InfoRow icon={<MapPin size={14} />} label="Address" value={contact.address} />
      </div>
    </Card>
  )
}

// ─── Applications card ───────────────────────────────────────────────────────

function ApplicationsCard({ applications }: { applications: Application[] }) {
  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">
        Course Applications
        <span className="ml-2 text-slate-400 font-normal text-xs">{applications.length} option{applications.length !== 1 ? 's' : ''}</span>
      </h3>
      {applications.length === 0 && (
        <p className="text-sm text-slate-400">No applications recorded.</p>
      )}
      <div className="space-y-3">
        {applications.map((app, i) => (
          <div key={app.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <div className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center shrink-0">
              {i + 1}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-800 truncate">{app.school ?? '—'}</p>
              <p className="text-xs text-slate-500 truncate">{app.program ?? '—'}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                {app.intakeDate && (
                  <span className="text-xs text-slate-400">
                    Intake: {formatDate(app.intakeDate)}
                  </span>
                )}
                {app.status && <Badge variant="neutral">{app.status}</Badge>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ─── Text block card ─────────────────────────────────────────────────────────

function TextCard({ title, icon, content }: { title: string; icon: React.ReactNode; content: string | null }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-slate-400">{icon}</span>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      </div>
      {content
        ? <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{content}</p>
        : <p className="text-sm text-slate-400">Not provided.</p>
      }
    </Card>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────

const STATUS_BADGE_VARIANT = {
  'Visa Refused': 'urgent',
  'Offer Received': 'purple',
  'Visa Approved': 'safe',
  'Enrolled': 'safe',
  'Departed': 'neutral',
} as const

export function StudentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const studentQuery = useQuery({
    queryKey: ['students', id],
    queryFn: () => getStudentById(id!),
  })

  const visasQuery = useQuery({
    queryKey: ['visas', 'all', id],
    queryFn: () => getVisasByStudentId(id!),
    enabled: !!id,
  })

  const appsQuery = useQuery({
    queryKey: ['applications', id],
    queryFn: () => getApplicationsByStudentId(id!),
    enabled: !!id,
  })

  if (studentQuery.isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </div>
    )
  }

  if (!studentQuery.data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-400">Student not found.</p>
      </div>
    )
  }

  const student = studentQuery.data
  const visas = visasQuery.data ?? []
  const applications = appsQuery.data ?? []
  const statusVariant = (STATUS_BADGE_VARIANT as Record<string, string>)[student.status] ?? 'neutral'

  return (
    <div className="max-w-5xl mx-auto space-y-4">

      {/* ── Profile header ── */}
      <Card className="p-6">
        <div className="flex items-start gap-5">
          <Avatar name={student.name} id={student.id} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  {student.preferredName ?? student.name}
                </h1>
                {student.preferredName && (
                  <p className="text-sm text-slate-500">{student.name}</p>
                )}
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  {student.nationality && (
                    <span className="text-sm text-slate-500">{student.nationality}</span>
                  )}
                  <Badge variant={statusVariant as 'urgent' | 'safe' | 'neutral' | 'purple'}>
                    {student.status}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {student.googleDriveLink && (
                  <a
                    href={student.googleDriveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <ExternalLink size={14} />
                    Drive
                  </a>
                )}
                <button
                  onClick={() => navigate('/students/' + id + '/edit')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors"
                >
                  <Pencil size={14} />
                  Edit
                </button>
              </div>
            </div>

            {/* Key stats row */}
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-100 flex-wrap">
              {student.dob && (
                <div>
                  <p className="text-xs text-slate-400">Date of Birth</p>
                  <p className="text-sm font-medium text-slate-700">{formatDate(student.dob)}</p>
                </div>
              )}
              {student.email && (
                <div>
                  <p className="text-xs text-slate-400">Email</p>
                  <a href={'mailto:' + student.email} className="text-sm font-medium text-violet-600 hover:underline">
                    {student.email}
                  </a>
                </div>
              )}
              {student.phone && (
                <div>
                  <p className="text-xs text-slate-400">Phone</p>
                  <p className="text-sm font-medium text-slate-700">{student.phone}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-slate-400">Student since</p>
                <p className="text-sm font-medium text-slate-700">{formatDate(student.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* ── Progress track ── */}
      <ProgressTrack currentStatus={student.status} />

      {/* ── Contact + Emergency contacts ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ContactCard title="Contact Information" student={student} />
        <div className="space-y-4">
          <EmergencyContactCard title="Emergency Contact 1" contact={student.emergencyContact} />
          <EmergencyContactCard title="Emergency Contact 2" contact={student.emergencyContact2} />
        </div>
      </div>

      {/* ── Visa + Applications ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <VisaInfoCard visas={visas} />
        <ApplicationsCard applications={applications} />
      </div>

      {/* ── Education + Work ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextCard
          title="Education History"
          icon={<GraduationCap size={15} />}
          content={student.educationHistory}
        />
        <TextCard
          title="Work Experience"
          icon={<Briefcase size={15} />}
          content={student.workExperience}
        />
      </div>

      {/* ── Notes ── */}
      {student.notes && (
        <TextCard
          title="Notes"
          icon={<BookOpen size={15} />}
          content={student.notes}
        />
      )}

      {/* ── Consultation log ── */}
      <ConsultationLog studentId={student.id} />
    </div>
  )
}
