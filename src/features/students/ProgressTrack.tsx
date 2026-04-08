import { Check } from 'lucide-react'
import { STUDENT_STATUSES } from '@/types/database'
import type { StudentStatus } from '@/types/database'

interface ProgressTrackProps {
  currentStatus: StudentStatus
}

export function ProgressTrack({ currentStatus }: ProgressTrackProps) {
  const currentIndex = STUDENT_STATUSES.indexOf(currentStatus)

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
        Pipeline Progress
      </h3>
      <div className="flex items-start gap-0">
        {STUDENT_STATUSES.map((status, index) => {
          const isCompleted = index < currentIndex
          const isCurrent = index === currentIndex
          const isLast = index === STUDENT_STATUSES.length - 1
          const isRefused = status === 'Visa Refused'

          const dotColor = isRefused && isCurrent
            ? 'bg-rose-500 border-rose-500'
            : isCompleted
            ? 'bg-violet-600 border-violet-600'
            : isCurrent
            ? 'bg-violet-600 border-violet-600'
            : 'bg-white border-slate-300'

          const lineColor = isCompleted ? 'bg-violet-600' : 'bg-slate-200'

          const labelColor = isCurrent
            ? (isRefused ? 'text-rose-600 font-semibold' : 'text-violet-700 font-semibold')
            : isCompleted
            ? 'text-slate-500'
            : 'text-slate-400'

          return (
            <div key={status} className="flex flex-col items-center flex-1 min-w-0">
              {/* Dot + connector line */}
              <div className="flex items-center w-full">
                {/* Left line */}
                <div className={
                  'flex-1 h-0.5 ' + (index === 0 ? 'invisible' : lineColor)
                } />
                {/* Dot */}
                <div className={
                  'w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ' + dotColor
                }>
                  {isCompleted && <Check size={12} className="text-white" strokeWidth={3} />}
                  {isCurrent && !isCompleted && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                {/* Right line */}
                <div className={
                  'flex-1 h-0.5 ' + (isLast ? 'invisible' : (isCompleted ? lineColor : 'bg-slate-200'))
                } />
              </div>

              {/* Label */}
              <span className={
                'mt-2 text-center leading-tight px-0.5 ' +
                'text-[10px] ' + labelColor
              }>
                {status}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
