import { initials } from '../../utils/format'

export default function Avatar({ name = '', size = 'md', className = '' }) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-20 w-20 text-xl',
  }
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-surface-soft font-medium text-ink ring-1 ring-inset ring-line ${sizes[size]} ${className}`}
      aria-hidden="true"
    >
      {initials(name) || '?'}
    </span>
  )
}
