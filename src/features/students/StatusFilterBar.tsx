import { STUDENT_STATUSES } from '@/types/database'
import type { StudentStatus } from '@/types/database'

interface StatusFilterBarProps {
  active: StudentStatus | null
  counts: Partial<Record<StudentStatus, number>>
  total: number
  onChange: (status: StudentStatus | null) => void
}

export function StatusFilterBar({ active, counts, total, onChange }: StatusFilterBarProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={() => onChange(null)}
        className={
          'px-3 py-1.5 rounded-full text-xs font-medium transition-colors ' +
          (active === null
            ? 'bg-violet-600 text-white'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
        }
      >
        All
        <span className={
          'ml-1.5 ' + (active === null ? 'text-violet-200' : 'text-slate-400')
        }>
          {total}
        </span>
      </button>

      {STUDENT_STATUSES.map((status) => {
        const count = counts[status] ?? 0
        const isActive = active === status
        return (
          <button
            key={status}
            onClick={() => onChange(status)}
            className={
              'px-3 py-1.5 rounded-full text-xs font-medium transition-colors ' +
              (isActive
                ? 'bg-violet-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
            }
          >
            {status}
            <span className={
              'ml-1.5 ' + (isActive ? 'text-violet-200' : 'text-slate-400')
            }>
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
