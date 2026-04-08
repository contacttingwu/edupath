import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProgressTrack } from './ProgressTrack'
import { STUDENT_STATUSES } from '@/types/database'

describe('ProgressTrack', () => {
  it('renders all 10 pipeline stages', () => {
    render(<ProgressTrack currentStatus="Consulting" />)
    for (const status of STUDENT_STATUSES) {
      expect(screen.getByText(status)).toBeInTheDocument()
    }
  })

  it('highlights the current stage label as violet', () => {
    render(<ProgressTrack currentStatus="Applied" />)
    const label = screen.getByText('Applied')
    expect(label.className).toContain('text-violet-700')
    expect(label.className).toContain('font-semibold')
  })

  it('marks Visa Refused current stage as rose', () => {
    render(<ProgressTrack currentStatus="Visa Refused" />)
    const label = screen.getByText('Visa Refused')
    expect(label.className).toContain('text-rose-600')
    expect(label.className).toContain('font-semibold')
  })

  it('applies muted color to stages after the current one', () => {
    render(<ProgressTrack currentStatus="Consulting" />)
    // "Documents Preparing" is after "Consulting" → should be slate-400 (not yet reached)
    const label = screen.getByText('Documents Preparing')
    expect(label.className).toContain('text-slate-400')
  })

  it('applies muted color to stages before the current one', () => {
    render(<ProgressTrack currentStatus="Enrolled" />)
    // "Applied" is before "Enrolled" → should be slate-500 (completed)
    const label = screen.getByText('Applied')
    expect(label.className).toContain('text-slate-500')
  })
})
