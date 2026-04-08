import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Clock, CheckCircle, ShieldOff } from 'lucide-react'
import { useVisaAlerts } from '@/hooks/useVisaAlerts'
import { usePageTitle } from '@/hooks/usePageTitle'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatDate } from '@/lib/utils'
import type { VisaAlertEntry } from '@/hooks/useVisaAlerts'

// ─── Filter tabs ─────────────────────────────────────────────────────────────

type FilterTab = 'all' | 'expired' | 'urgent' | 'warning' | 'safe'

const TABS: { id: FilterTab; label: string; icon: React.ReactNode; activeClass: string }[] = [
  {
    id: 'all',
    label: 'All',
    icon: null,
    activeClass: 'bg-slate-900 text-white',
  },
  {
    id: 'expired',
    label: 'Expired',
    icon: <ShieldOff size={13} />,
    activeClass: 'bg-rose-600 text-white',
  },
  {
    id: 'urgent',
    label: 'Urgent (≤7 days)',
    icon: <AlertTriangle size={13} />,
    activeClass: 'bg-rose-500 text-white',
  },
  {
    id: 'warning',
    label: 'Warning (8–30 days)',
    icon: <Clock size={13} />,
    activeClass: 'bg-amber-500 text-white',
  },
  {
    id: 'safe',
    label: 'Safe (>30 days)',
    icon: <CheckCircle size={13} />,
    activeClass: 'bg-emerald-600 text-white',
  },
]

// ─── Summary stat card ────────────────────────────────────────────────────────

function StatCard({
  label,
  count,
  icon,
  colorClass,
  onClick,
  active,
}: {
  label: string
  count: number
  icon: React.ReactNode
  colorClass: string
  onClick: () => void
  active: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={
        'flex-1 min-w-[120px] flex flex-col gap-1 p-4 rounded-xl border transition-all text-left ' +
        (active
          ? colorClass + ' border-transparent shadow-md'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm')
      }
    >
      <div className={'flex items-center gap-2 ' + (active ? 'text-white/80' : 'text-slate-400')}>
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <span className={'text-2xl font-bold ' + (active ? 'text-white' : 'text-slate-900')}>
        {count}
      </span>
    </button>
  )
}

// ─── Visa row ─────────────────────────────────────────────────────────────────

function VisaRow({ entry }: { entry: VisaAlertEntry }) {
  const navigate = useNavigate()
  const { visa, student, daysLeft } = entry

  let expiryBadgeVariant: 'urgent' | 'warning' | 'safe' | 'neutral' = 'neutral'
  let expiryLabel = ''

  if (daysLeft < 0) {
    expiryBadgeVariant = 'urgent'
    expiryLabel = 'Expired ' + Math.abs(daysLeft) + 'd ago'
  } else if (daysLeft === 0) {
    expiryBadgeVariant = 'urgent'
    expiryLabel = 'Expires today'
  } else if (daysLeft <= 7) {
    expiryBadgeVariant = 'urgent'
    expiryLabel = 'Expires in ' + daysLeft + 'd'
  } else if (daysLeft <= 30) {
    expiryBadgeVariant = 'warning'
    expiryLabel = 'Expires in ' + daysLeft + 'd'
  } else {
    expiryBadgeVariant = 'safe'
    expiryLabel = 'Expires in ' + daysLeft + 'd'
  }

  return (
    <tr
      className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
      onClick={() => navigate('/students/' + student.id)}
    >
      <td className="py-3 px-4">
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
      </td>
      <td className="py-3 px-4">
        <p className="text-sm text-slate-700">{visa.visaType ?? '—'}</p>
        {visa.visaNumber && (
          <p className="text-xs text-slate-400">{visa.visaNumber}</p>
        )}
      </td>
      <td className="py-3 px-4">
        <span className="text-sm text-slate-600">{formatDate(visa.issueDate)}</span>
      </td>
      <td className="py-3 px-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-slate-600">{formatDate(visa.expiryDate)}</span>
          <Badge variant={expiryBadgeVariant}>{expiryLabel}</Badge>
        </div>
      </td>
      <td className="py-3 px-4">
        <Badge variant="neutral">{student.status}</Badge>
      </td>
    </tr>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function VisaTrackerPage() {
  usePageTitle('Visa Tracker')
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const { summary, isLoading } = useVisaAlerts()

  const entries =
    activeTab === 'all' ? summary.all
    : activeTab === 'expired' ? summary.expired
    : activeTab === 'urgent' ? summary.urgent
    : activeTab === 'warning' ? summary.warning
    : summary.safe

  const statCards = [
    {
      id: 'expired' as FilterTab,
      label: 'Expired',
      count: summary.expired.length,
      icon: <ShieldOff size={14} />,
      colorClass: 'bg-rose-600',
    },
    {
      id: 'urgent' as FilterTab,
      label: 'Urgent ≤7d',
      count: summary.urgent.length,
      icon: <AlertTriangle size={14} />,
      colorClass: 'bg-rose-500',
    },
    {
      id: 'warning' as FilterTab,
      label: 'Warning ≤30d',
      count: summary.warning.length,
      icon: <Clock size={14} />,
      colorClass: 'bg-amber-500',
    },
    {
      id: 'safe' as FilterTab,
      label: 'Safe',
      count: summary.safe.length,
      icon: <CheckCircle size={14} />,
      colorClass: 'bg-emerald-600',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="flex gap-3 flex-wrap">
        {isLoading
          ? [...Array(4)].map((_, i) => (
              <div key={i} className="flex-1 min-w-[120px]">
                <Skeleton className="h-20 rounded-xl" />
              </div>
            ))
          : statCards.map((s) => (
              <StatCard
                key={s.id}
                label={s.label}
                count={s.count}
                icon={s.icon}
                colorClass={s.colorClass}
                onClick={() => setActiveTab(s.id === activeTab ? 'all' : s.id)}
                active={activeTab === s.id}
              />
            ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ' +
                (isActive
                  ? tab.activeClass
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50')
              }
            >
              {tab.icon}
              {tab.label}
              {tab.id !== 'all' && !isLoading && (
                <span className={
                  'ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ' +
                  (isActive ? 'bg-white/20' : 'bg-slate-100 text-slate-500')
                }>
                  {tab.id === 'expired' ? summary.expired.length
                    : tab.id === 'urgent' ? summary.urgent.length
                    : tab.id === 'warning' ? summary.warning.length
                    : summary.safe.length}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-lg" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="py-16 text-center">
            <CheckCircle size={32} className="mx-auto mb-3 text-emerald-400" />
            <p className="text-sm text-slate-500">No visas in this category.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Student
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Visa Type
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Issued
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Expires
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <VisaRow key={entry.visa.id} entry={entry} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {!isLoading && (
        <p className="text-xs text-slate-400 text-right">
          Showing {entries.length} of {summary.all.length} visa records · sorted by expiry date
        </p>
      )}
    </div>
  )
}
