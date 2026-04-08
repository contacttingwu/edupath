import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Avatar } from './Avatar'

const ID = '11111111-0000-0000-0000-000000000001'

describe('Avatar', () => {
  it('renders initials for a two-part name', () => {
    render(<Avatar name="Chen Wei" id={ID} />)
    expect(screen.getByText('CW')).toBeInTheDocument()
  })

  it('renders single initial for a single name', () => {
    render(<Avatar name="Priya" id={ID} />)
    expect(screen.getByText('P')).toBeInTheDocument()
  })

  it('sets aria-label to the full name', () => {
    render(<Avatar name="Chen Wei" id={ID} />)
    expect(screen.getByLabelText('Chen Wei')).toBeInTheDocument()
  })

  it('applies sm size class', () => {
    const { container } = render(<Avatar name="Chen Wei" id={ID} size="sm" />)
    expect(container.firstChild).toHaveClass('w-7', 'h-7')
  })

  it('applies lg size class', () => {
    const { container } = render(<Avatar name="Chen Wei" id={ID} size="lg" />)
    expect(container.firstChild).toHaveClass('w-12', 'h-12')
  })

  it('applies a deterministic background color from the id', () => {
    const { container: a } = render(<Avatar name="A" id={ID} />)
    const { container: b } = render(<Avatar name="B" id={ID} />)
    // Same id → same color regardless of name
    const classA = (a.firstChild as HTMLElement).className
    const classB = (b.firstChild as HTMLElement).className
    expect(classA).toBe(classB)
  })
})
