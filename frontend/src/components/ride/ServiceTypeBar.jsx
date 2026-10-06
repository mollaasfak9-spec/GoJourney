import { useState } from 'react'
import { SERVICE_TYPES } from '../../constants/services'

export default function ServiceTypeBar({ onSelect, initialId = 'ride', className = '' }) {
  const [selectedId, setSelectedId] = useState(initialId)

  function handleSelect(service) {
    setSelectedId(service.id)
    onSelect?.(service)
  }

  return (
    <div className={className}>
      <div
        role="radiogroup"
        aria-label="Choose a service"
        className="flex gap-1 overflow-x-auto rounded-full bg-surface-soft p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {SERVICE_TYPES.map((service) => {
          const Icon = service.icon
          const isSelected = service.id === selectedId

          return (
            <button
              key={service.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => handleSelect(service)}
              className={`flex min-h-[44px] shrink-0 snap-start items-center gap-2 rounded-full px-4 text-sm transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-surface-soft ${
                isSelected
                  ? 'bg-surface font-medium text-ink shadow-flat'
                  : 'text-muted hover:bg-surface/60 hover:text-ink-soft'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span className="whitespace-nowrap">{service.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}