import { useNavigate } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { useVisaAlerts } from '@/hooks/useVisaAlerts'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { SkeletonRow } from '@/components/ui/Skeleton'
import { getVisaStatus } from '@/lib/utils'

export function VisaAlertList() {
  const navigate = useNavigate()
  const { summary, isLoading } = useVisaAlerts()

  const alerts = [...summary.expired, ...summary.urgent, ...summary.warning]

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <ShieldAlert size={18} className="text-rose-500" />
        <h2 className="text-sm font-semibold text-slate-900">Visa Alerts</h2>
        {alerts.length > 0 && (
          <span className="ml-auto text-xs text-slate-400">{alerts.length} alert{alerts.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {isLoading && (
        <div className="divide-y divide-slate-100">
          {[...Array(3)].map((_, i) => <SkeletonRow key={i} />)}
        </div>
      )}

      {!isLoading && alerts.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-sm text-slate-400">No visa alerts — all good!</p>
        </div>
      )}

      {!isLoading && alerts.length > 0 && (
        <div className="divide-y divide-slate-100">
          {alerts.map(({ visa, student, daysLeft }) => {
            const status = getVisaStatus(visa.expiryDate)
            const label = daysLeft < 0
              ? 'Expired'
              : daysLeft === 0
              ? 'Today'
              : daysLeft + 'd left'

            return (
              <button
                key={visa.id}
                className="w-full flex items-center gap-3 py-3 text-left hover:bg-slate-50 -mx-1 px-1 rounded-lg transition-colors"
                onClick={() => navigate('/students/' + student.id)}
              >
                <Avatar name={student.name} id={student.id} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {student.preferredName ?? student.name}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {visa.visaType ?? 'Visa'}
                  </p>
                </div>
                <Badge variant={status.variant}>{label}</Badge>
              </button>
            )
          })}
        </div>
      )}
    </Card>
  )
}
