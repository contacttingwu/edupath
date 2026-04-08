import { useState } from 'react'
import { ChevronDown, ChevronUp, CreditCard } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { formatDate, getVisaStatus } from '@/lib/utils'
import type { Visa } from '@/types'

function OutcomeBadge({ outcome }: { outcome: Visa['outcome'] }) {
  if (outcome === 'granted') return <Badge variant="safe">Granted</Badge>
  if (outcome === 'refused') return <Badge variant="urgent">Refused</Badge>
  return <Badge variant="neutral">Pending</Badge>
}

function VisaRow({ visa, isCurrent }: { visa: Visa; isCurrent?: boolean }) {
  const expiryStatus = getVisaStatus(visa.expiryDate)

  return (
    <div className={
      'p-3 rounded-lg border ' +
      (isCurrent ? 'border-violet-200 bg-violet-50/40' : 'border-slate-100 bg-slate-50')
    }>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p className="text-sm font-medium text-slate-800">
            {visa.visaType ?? 'Visa'}
          </p>
          {visa.visaNumber && (
            <p className="text-xs text-slate-400 mt-0.5">{visa.visaNumber}</p>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {isCurrent && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700 font-medium">
              Current
            </span>
          )}
          <OutcomeBadge outcome={visa.outcome} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
        <div>
          <span className="text-slate-400">Issued</span>
          <p className="font-medium text-slate-700">{formatDate(visa.issueDate)}</p>
        </div>
        <div>
          <span className="text-slate-400">Expires</span>
          {visa.expiryDate ? (
            <Badge variant={expiryStatus.variant} className="mt-0.5 block w-fit">
              {formatDate(visa.expiryDate)}
            </Badge>
          ) : (
            <p className="font-medium text-slate-700">—</p>
          )}
        </div>
      </div>

      {/* Refusal details */}
      {visa.outcome === 'refused' && (
        <div className="mt-2 pt-2 border-t border-rose-100 space-y-1">
          {visa.appealDecision && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Decision:</span>
              <Badge variant={visa.appealDecision === 'appeal' ? 'warning' : 'neutral'}>
                {visa.appealDecision === 'appeal' ? 'Lodging Appeal' : 'Student Left'}
              </Badge>
            </div>
          )}
          {visa.appealStatus && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Appeal status:</span>
              <span className="font-medium text-slate-700">{visa.appealStatus}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface VisaInfoCardProps {
  visas: Visa[]
}

export function VisaInfoCard({ visas }: VisaInfoCardProps) {
  const [historyOpen, setHistoryOpen] = useState(false)
  const currentVisa = visas.find((v) => v.isCurrent)
  const history = visas.filter((v) => !v.isCurrent)

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard size={16} className="text-violet-500" />
        <h3 className="text-sm font-semibold text-slate-900">Visa</h3>
        {visas.length > 0 && (
          <span className="ml-auto text-xs text-slate-400">{visas.length} record{visas.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {visas.length === 0 && (
        <p className="text-sm text-slate-400">No visa records.</p>
      )}

      {currentVisa && <VisaRow visa={currentVisa} isCurrent />}

      {history.length > 0 && (
        <div className="mt-3">
          <button
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 transition-colors"
            onClick={() => setHistoryOpen((v) => !v)}
          >
            {historyOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            {historyOpen ? 'Hide' : 'Show'} history ({history.length})
          </button>
          {historyOpen && (
            <div className="mt-3 space-y-2">
              {history.map((v) => <VisaRow key={v.id} visa={v} />)}
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
