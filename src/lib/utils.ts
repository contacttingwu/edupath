import { differenceInCalendarDays, format, parseISO, startOfToday } from 'date-fns'

// ─── DATE UTILS ──────────────────────────────────────────────────────────────

/**
 * Returns number of calendar days until an ISO date string (YYYY-MM-DD).
 * Negative = already expired. Zero = expires today.
 * Both sides are treated as local-midnight to avoid timezone drift.
 */
export function daysUntil(dateStr: string): number {
  // Parse date components directly to avoid UTC-vs-local offset issues
  const [year, month, day] = dateStr.split('-').map(Number)
  const target = new Date(year, month - 1, day)
  return differenceInCalendarDays(target, startOfToday())
}

/**
 * Formats an ISO date string as "DD MMM YYYY" (e.g. "08 Apr 2026").
 * Returns "—" for null/undefined/invalid dates.
 */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  try {
    const parsed = parseISO(dateStr)
    if (isNaN(parsed.getTime())) return '—'
    return format(parsed, 'dd MMM yyyy')
  } catch {
    return '—'
  }
}

// ─── VISA STATUS ─────────────────────────────────────────────────────────────

export type VisaStatusVariant = 'urgent' | 'warning' | 'safe' | 'unknown'

export interface VisaStatusInfo {
  label: string
  variant: VisaStatusVariant
  daysLeft: number | null
}

/**
 * Returns a display label, badge variant, and days-left count for a visa expiry date.
 *
 * Thresholds:
 *   ≤ 0 days  → "Expired"   (urgent)
 *   1–7 days  → "X days"    (urgent)
 *   8–30 days → "X days"    (warning)
 *   > 30 days → "X days"    (safe)
 *   null      → "No expiry" (unknown)
 */
export function getVisaStatus(expiryDate: string | null | undefined): VisaStatusInfo {
  if (!expiryDate) {
    return { label: 'No expiry', variant: 'unknown', daysLeft: null }
  }

  const days = daysUntil(expiryDate)

  if (days < 0) {
    return { label: 'Expired', variant: 'urgent', daysLeft: days }
  }
  if (days === 0) {
    return { label: 'Expires today', variant: 'urgent', daysLeft: 0 }
  }
  if (days <= 7) {
    return { label: days + ' days', variant: 'urgent', daysLeft: days }
  }
  if (days <= 30) {
    return { label: days + ' days', variant: 'warning', daysLeft: days }
  }
  return { label: days + ' days', variant: 'safe', daysLeft: days }
}

// ─── AVATAR UTILS ────────────────────────────────────────────────────────────

/**
 * Returns up to 2 uppercase initials from a full name.
 * "Chen Wei" → "CW", "Priya" → "P"
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

const AVATAR_COLORS = [
  'bg-violet-500',
  'bg-blue-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-cyan-500',
  'bg-fuchsia-500',
  'bg-indigo-500',
] as const

/**
 * Returns a deterministic Tailwind bg color class based on the UUID.
 * Stable across renders — same id always gets same color.
 */
export function getAvatarColor(id: string): string {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

// ─── MISC ────────────────────────────────────────────────────────────────────

/** Truncates a string to maxLength, appending "…" if trimmed. */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + '…'
}
