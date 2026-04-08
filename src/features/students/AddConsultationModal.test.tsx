import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddConsultationModal } from './AddConsultationModal'
import { renderWithProviders } from '@/test/renderWithProviders'

vi.mock('@/lib/api/consultations', () => ({
  createConsultation: vi.fn().mockResolvedValue({
    id: 'c1', notes: 'test', tags: [], consultDate: '2026-04-08', studentId: 's1', createdAt: '',
  }),
}))

vi.mock('@/lib/api/students', () => ({
  getAllStudents: vi.fn().mockResolvedValue([]),
}))

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

const onClose = vi.fn()

beforeEach(() => {
  onClose.mockClear()
})

describe('AddConsultationModal', () => {
  it('renders the modal heading', () => {
    renderWithProviders(<AddConsultationModal studentId="s1" onClose={onClose} />)
    expect(screen.getByRole('heading', { name: /log consultation/i })).toBeInTheDocument()
  })

  it('closes when Escape key is pressed', () => {
    renderWithProviders(<AddConsultationModal studentId="s1" onClose={onClose} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when Cancel is clicked', async () => {
    renderWithProviders(<AddConsultationModal studentId="s1" onClose={onClose} />)
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onClose).toHaveBeenCalled()
  })

  it('shows a student selector (combobox) when no studentId prop', () => {
    renderWithProviders(<AddConsultationModal onClose={onClose} />)
    // The select element renders as a combobox role
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByText(/select student/i)).toBeInTheDocument()
  })

  it('hides the student selector when studentId is pre-selected', () => {
    renderWithProviders(<AddConsultationModal studentId="s1" onClose={onClose} />)
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
  })

  it('shows a Notes textarea', () => {
    renderWithProviders(<AddConsultationModal studentId="s1" onClose={onClose} />)
    expect(screen.getByPlaceholderText(/discuss visa requirements/i)).toBeInTheDocument()
  })

  it('shows a Tags input', () => {
    renderWithProviders(<AddConsultationModal studentId="s1" onClose={onClose} />)
    expect(screen.getByPlaceholderText(/comma separated/i)).toBeInTheDocument()
  })

  it('shows a validation error when Notes is empty on submit', async () => {
    renderWithProviders(<AddConsultationModal studentId="s1" onClose={onClose} />)
    await userEvent.click(screen.getByRole('button', { name: /log consultation/i }))
    await waitFor(() => {
      expect(screen.getByText(/notes are required/i)).toBeInTheDocument()
    })
  })

  it('pre-fills the date field with today', () => {
    renderWithProviders(<AddConsultationModal studentId="s1" onClose={onClose} />)
    const dateInput = screen.getByDisplayValue(/\d{4}-\d{2}-\d{2}/)
    expect(dateInput).toBeInTheDocument()
  })
})
