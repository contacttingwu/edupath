import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  daysUntil,
  formatDate,
  getVisaStatus,
  getInitials,
  getAvatarColor,
  truncate,
} from './utils'

// Pin "today" to a fixed date so tests are deterministic.
// Use local-midnight (not UTC string) so startOfToday() sees April 8 regardless of timezone.
const FIXED_TODAY = '2026-04-08'

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(2026, 3, 8, 0, 0, 0, 0)) // April 8 local midnight
})

afterEach(() => {
  vi.useRealTimers()
})

// ─── daysUntil ───────────────────────────────────────────────────────────────

describe('daysUntil', () => {
  it('returns 0 for today', () => {
    expect(daysUntil(FIXED_TODAY)).toBe(0)
  })

  it('returns positive days for a future date', () => {
    expect(daysUntil('2026-04-18')).toBe(10)
  })

  it('returns negative days for a past date', () => {
    expect(daysUntil('2026-03-28')).toBe(-11)
  })

  it('returns 1 for tomorrow', () => {
    expect(daysUntil('2026-04-09')).toBe(1)
  })

  it('returns -1 for yesterday', () => {
    expect(daysUntil('2026-04-07')).toBe(-1)
  })
})

// ─── formatDate ──────────────────────────────────────────────────────────────

describe('formatDate', () => {
  it('formats ISO date as DD MMM YYYY', () => {
    expect(formatDate('2026-04-08')).toBe('08 Apr 2026')
  })

  it('formats another date correctly', () => {
    expect(formatDate('2000-01-01')).toBe('01 Jan 2000')
  })

  it('returns "—" for null', () => {
    expect(formatDate(null)).toBe('—')
  })

  it('returns "—" for undefined', () => {
    expect(formatDate(undefined)).toBe('—')
  })

  it('returns "—" for empty string', () => {
    expect(formatDate('')).toBe('—')
  })
})

// ─── getVisaStatus ───────────────────────────────────────────────────────────

describe('getVisaStatus', () => {
  it('returns unknown for null expiry', () => {
    const result = getVisaStatus(null)
    expect(result.variant).toBe('unknown')
    expect(result.label).toBe('No expiry')
    expect(result.daysLeft).toBeNull()
  })

  it('returns urgent + "Expired" for a past date', () => {
    const result = getVisaStatus('2026-04-01')
    expect(result.variant).toBe('urgent')
    expect(result.label).toBe('Expired')
  })

  it('returns urgent + "Expires today" for today', () => {
    const result = getVisaStatus(FIXED_TODAY)
    expect(result.variant).toBe('urgent')
    expect(result.label).toBe('Expires today')
    expect(result.daysLeft).toBe(0)
  })

  it('returns urgent for 1–7 days remaining', () => {
    const result = getVisaStatus('2026-04-13') // 5 days away
    expect(result.variant).toBe('urgent')
    expect(result.label).toBe('5 days')
    expect(result.daysLeft).toBe(5)
  })

  it('returns urgent at exactly 7 days', () => {
    const result = getVisaStatus('2026-04-15')
    expect(result.variant).toBe('urgent')
    expect(result.daysLeft).toBe(7)
  })

  it('returns warning for 8–30 days remaining', () => {
    const result = getVisaStatus('2026-04-28') // 20 days away
    expect(result.variant).toBe('warning')
    expect(result.label).toBe('20 days')
    expect(result.daysLeft).toBe(20)
  })

  it('returns warning at exactly 30 days', () => {
    const result = getVisaStatus('2026-05-08')
    expect(result.variant).toBe('warning')
    expect(result.daysLeft).toBe(30)
  })

  it('returns safe for > 30 days remaining', () => {
    const result = getVisaStatus('2026-06-08') // 61 days away
    expect(result.variant).toBe('safe')
    expect(result.daysLeft).toBe(61)
  })
})

// ─── getInitials ─────────────────────────────────────────────────────────────

describe('getInitials', () => {
  it('returns two initials for a two-part name', () => {
    expect(getInitials('Chen Wei')).toBe('CW')
  })

  it('returns first and last initial for a three-part name', () => {
    expect(getInitials('Nguyen Thi Lan')).toBe('NL')
  })

  it('returns single initial for a single name', () => {
    expect(getInitials('Priya')).toBe('P')
  })

  it('uppercases initials', () => {
    expect(getInitials('maria santos')).toBe('MS')
  })

  it('handles extra whitespace', () => {
    expect(getInitials('  Kim  Jiyoung  ')).toBe('KJ')
  })
})

// ─── getAvatarColor ──────────────────────────────────────────────────────────

describe('getAvatarColor', () => {
  it('returns a Tailwind bg color string', () => {
    const color = getAvatarColor('11111111-0000-0000-0000-000000000001')
    expect(color).toMatch(/^bg-\w+-500$/)
  })

  it('returns the same color for the same id', () => {
    const id = '11111111-0000-0000-0000-000000000002'
    expect(getAvatarColor(id)).toBe(getAvatarColor(id))
  })

  it('returns different colors for different ids (at least some)', () => {
    const colors = [
      '11111111-0000-0000-0000-000000000001',
      '11111111-0000-0000-0000-000000000002',
      '11111111-0000-0000-0000-000000000003',
      '11111111-0000-0000-0000-000000000004',
    ].map(getAvatarColor)
    const unique = new Set(colors)
    expect(unique.size).toBeGreaterThan(1)
  })
})

// ─── truncate ────────────────────────────────────────────────────────────────

describe('truncate', () => {
  it('returns the string unchanged when within limit', () => {
    expect(truncate('hello', 10)).toBe('hello')
  })

  it('truncates and appends ellipsis when over limit', () => {
    expect(truncate('hello world', 5)).toBe('hello…')
  })

  it('returns string unchanged at exactly the limit', () => {
    expect(truncate('hello', 5)).toBe('hello')
  })
})
