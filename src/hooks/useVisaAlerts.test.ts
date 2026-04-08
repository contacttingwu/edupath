import { describe, it, expect, afterEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useVisaAlerts } from './useVisaAlerts'
import type { Visa, Student } from '@/types'

// ─── Mock API modules ─────────────────────────────────────────────────────────

vi.mock('@/lib/api/visas', () => ({
  getAllCurrentVisas: vi.fn(),
}))

vi.mock('@/lib/api/students', () => ({
  getAllStudents: vi.fn(),
}))

// Mock daysUntil so tests are date-independent
vi.mock('@/lib/utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/utils')>()
  return { ...actual, daysUntil: vi.fn() }
})

import { getAllCurrentVisas } from '@/lib/api/visas'
import { getAllStudents } from '@/lib/api/students'
import { daysUntil } from '@/lib/utils'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeStudent(id: string): Student {
  return {
    id,
    name: 'Test Student',
    preferredName: null,
    dob: null,
    nationality: null,
    email: null,
    phone: null,
    addrOverseas: null,
    addrHome: null,
    googleDriveLink: null,
    emergencyContact: { name: null, relationship: null, phone: null, email: null, address: null },
    emergencyContact2: { name: null, relationship: null, phone: null, email: null, address: null },
    educationHistory: null,
    workExperience: null,
    status: 'Consulting',
    notes: null,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  }
}

function makeVisa(studentId: string, expiryDate: string | null): Visa {
  return {
    id: 'v-' + studentId,
    studentId,
    visaType: 'Student',
    visaNumber: null,
    issueDate: '2024-01-01',
    expiryDate,
    isCurrent: true,
    outcome: 'pending',
    appealDecision: null,
    appealStatus: null,
    createdAt: '2024-01-01',
  }
}

function wrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: qc }, children)
}

afterEach(() => {
  vi.clearAllMocks()
})

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('useVisaAlerts', () => {
  it('groups expired visas (daysLeft < 0) correctly', async () => {
    vi.mocked(daysUntil).mockReturnValue(-38)
    vi.mocked(getAllCurrentVisas).mockResolvedValue([makeVisa('s1', '2026-03-01')])
    vi.mocked(getAllStudents).mockResolvedValue([makeStudent('s1')])

    const { result } = renderHook(() => useVisaAlerts(), { wrapper: wrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.summary.expired).toHaveLength(1)
    expect(result.current.summary.expired[0].student.id).toBe('s1')
    expect(result.current.summary.expired[0].daysLeft).toBe(-38)
  })

  it('groups urgent visas (0–7 days) correctly', async () => {
    vi.mocked(daysUntil).mockReturnValue(5)
    vi.mocked(getAllCurrentVisas).mockResolvedValue([makeVisa('s2', '2026-04-13')])
    vi.mocked(getAllStudents).mockResolvedValue([makeStudent('s2')])

    const { result } = renderHook(() => useVisaAlerts(), { wrapper: wrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.summary.urgent).toHaveLength(1)
    expect(result.current.summary.urgent[0].daysLeft).toBe(5)
  })

  it('groups warning visas (8–30 days) correctly', async () => {
    vi.mocked(daysUntil).mockReturnValue(20)
    vi.mocked(getAllCurrentVisas).mockResolvedValue([makeVisa('s3', '2026-04-28')])
    vi.mocked(getAllStudents).mockResolvedValue([makeStudent('s3')])

    const { result } = renderHook(() => useVisaAlerts(), { wrapper: wrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.summary.warning).toHaveLength(1)
    expect(result.current.summary.warning[0].daysLeft).toBe(20)
  })

  it('groups safe visas (>30 days) correctly', async () => {
    vi.mocked(daysUntil).mockReturnValue(54)
    vi.mocked(getAllCurrentVisas).mockResolvedValue([makeVisa('s4', '2026-06-01')])
    vi.mocked(getAllStudents).mockResolvedValue([makeStudent('s4')])

    const { result } = renderHook(() => useVisaAlerts(), { wrapper: wrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.summary.safe).toHaveLength(1)
    expect(result.current.summary.safe[0].daysLeft).toBe(54)
  })

  it('alertCount includes only expired + urgent + warning, not safe', async () => {
    // Return different daysLeft per call: expired, urgent, warning, safe
    vi.mocked(daysUntil)
      .mockReturnValueOnce(-38)
      .mockReturnValueOnce(4)
      .mockReturnValueOnce(20)
      .mockReturnValueOnce(54)

    vi.mocked(getAllCurrentVisas).mockResolvedValue([
      makeVisa('s1', '2026-03-01'),
      makeVisa('s2', '2026-04-12'),
      makeVisa('s3', '2026-04-28'),
      makeVisa('s4', '2026-06-01'),
    ])
    vi.mocked(getAllStudents).mockResolvedValue([
      makeStudent('s1'), makeStudent('s2'), makeStudent('s3'), makeStudent('s4'),
    ])

    const { result } = renderHook(() => useVisaAlerts(), { wrapper: wrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.summary.alertCount).toBe(3)
    expect(result.current.summary.all).toHaveLength(4)
  })

  it('skips visas without an expiryDate', async () => {
    vi.mocked(getAllCurrentVisas).mockResolvedValue([makeVisa('s1', null)])
    vi.mocked(getAllStudents).mockResolvedValue([makeStudent('s1')])

    const { result } = renderHook(() => useVisaAlerts(), { wrapper: wrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.summary.all).toHaveLength(0)
  })

  it('skips visas where studentId has no matching student', async () => {
    vi.mocked(daysUntil).mockReturnValue(4)
    vi.mocked(getAllCurrentVisas).mockResolvedValue([makeVisa('unknown', '2026-04-12')])
    vi.mocked(getAllStudents).mockResolvedValue([]) // no matching student

    const { result } = renderHook(() => useVisaAlerts(), { wrapper: wrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.summary.all).toHaveLength(0)
  })

  it('sorts all entries by daysLeft ascending', async () => {
    vi.mocked(daysUntil)
      .mockReturnValueOnce(54)   // s1 — safe, furthest
      .mockReturnValueOnce(-38)  // s2 — expired, earliest
      .mockReturnValueOnce(4)    // s3 — urgent

    vi.mocked(getAllCurrentVisas).mockResolvedValue([
      makeVisa('s1', '2026-06-01'),
      makeVisa('s2', '2026-03-01'),
      makeVisa('s3', '2026-04-12'),
    ])
    vi.mocked(getAllStudents).mockResolvedValue([
      makeStudent('s1'), makeStudent('s2'), makeStudent('s3'),
    ])

    const { result } = renderHook(() => useVisaAlerts(), { wrapper: wrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    const days = result.current.summary.all.map((e) => e.daysLeft)
    expect(days).toEqual([-38, 4, 54])
  })
})
