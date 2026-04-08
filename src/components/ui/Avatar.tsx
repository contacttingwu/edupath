import { getInitials, getAvatarColor } from '@/lib/utils'

interface AvatarProps {
  name: string
  id: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-12 h-12 text-base',
}

export function Avatar({ name, id, size = 'md' }: AvatarProps) {
  return (
    <div
      className={
        'rounded-full flex items-center justify-center font-semibold text-white shrink-0 ' +
        sizeClasses[size] +
        ' ' +
        getAvatarColor(id)
      }
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  )
}
