interface BadgeProps {
  variant?: 'urgent' | 'warning' | 'safe' | 'unknown' | 'neutral' | 'purple'
  children: React.ReactNode
  className?: string
}

const variantClasses = {
  urgent:  'bg-rose-100 text-rose-700 border border-rose-200',
  warning: 'bg-amber-100 text-amber-700 border border-amber-200',
  safe:    'bg-emerald-100 text-emerald-700 border border-emerald-200',
  unknown: 'bg-slate-100 text-slate-500 border border-slate-200',
  neutral: 'bg-slate-100 text-slate-600 border border-slate-200',
  purple:  'bg-violet-100 text-violet-700 border border-violet-200',
}

export function Badge({ variant = 'neutral', children, className = '' }: BadgeProps) {
  return (
    <span
      className={
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ' +
        variantClasses[variant] +
        ' ' +
        className
      }
    >
      {children}
    </span>
  )
}
