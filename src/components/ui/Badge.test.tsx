import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Visa Approved</Badge>)
    expect(screen.getByText('Visa Approved')).toBeInTheDocument()
  })

  it('defaults to neutral variant', () => {
    const { container } = render(<Badge>Neutral</Badge>)
    expect(container.firstChild).toHaveClass('text-slate-600')
  })

  it('applies urgent variant classes', () => {
    const { container } = render(<Badge variant="urgent">Expired</Badge>)
    expect(container.firstChild).toHaveClass('text-rose-700')
    expect(container.firstChild).toHaveClass('bg-rose-100')
  })

  it('applies warning variant classes', () => {
    const { container } = render(<Badge variant="warning">Soon</Badge>)
    expect(container.firstChild).toHaveClass('text-amber-700')
  })

  it('applies safe variant classes', () => {
    const { container } = render(<Badge variant="safe">Granted</Badge>)
    expect(container.firstChild).toHaveClass('text-emerald-700')
  })

  it('applies purple variant classes', () => {
    const { container } = render(<Badge variant="purple">Tag</Badge>)
    expect(container.firstChild).toHaveClass('text-violet-700')
  })

  it('applies extra className', () => {
    const { container } = render(<Badge className="mt-2">Extra</Badge>)
    expect(container.firstChild).toHaveClass('mt-2')
  })
})
