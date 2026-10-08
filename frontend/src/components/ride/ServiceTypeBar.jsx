import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { BIKE_TYPES, PARCEL_TYPES, RIDE_TYPES, SERVICE_TYPES } from '../../constants/services'

const SERVICE_OPTIONS = {
  ride: RIDE_TYPES,
  parcel: PARCEL_TYPES,
  bike: BIKE_TYPES,
}

export default function ServiceTypeBar({ onSelect, initialId = 'ride', className = '' }) {
  const [selectedId, setSelectedId] = useState(initialId)
  const [selectedOption, setSelectedOption] = useState(null)
  const [openId, setOpenId] = useState(null)
  const [failedImages, setFailedImages] = useState(() => new Set())
  const barRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (barRef.current && !barRef.current.contains(event.target)) setOpenId(null)
    }
    function handleEscape(event) {
      if (event.key === 'Escape') setOpenId(null)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  function handleSelect(service) {
    setSelectedId(service.id)
    setSelectedOption(null)
    setOpenId(null)
    onSelect?.(service)
  }

  function handleOptionSelect(serviceId, option) {
    setSelectedId(serviceId)
    setSelectedOption(option)
    setOpenId(null)
    onSelect?.({ ...option, serviceId })
  }

  function handleImageError(id) {
    setFailedImages((prev) => new Set(prev).add(id))
  }

  function renderBadge(item) {
    if (item.emoji) {
      return (
        <span className="shrink-0 text-base leading-none" aria-hidden="true">
          {item.emoji}
        </span>
      )
    }
    if (item.image && !failedImages.has(item.id)) {
      return (
        <img
          src={item.image}
          alt=""
          aria-hidden="true"
          className="h-6 w-6 shrink-0 object-contain"
          onError={() => handleImageError(item.id)}
        />
      )
    }
    const Icon = item.icon
    return <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
  }

  return (
    <div className={className}>
      <div
        ref={barRef}
        role="radiogroup"
        aria-label="Choose a service"
        className="flex gap-1 overflow-x-auto rounded-full bg-surface-soft p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {SERVICE_TYPES.map((service) => {
          const isSelected = service.id === selectedId
          const options = SERVICE_OPTIONS[service.id]

          if (options) {
            const label = isSelected && selectedOption ? selectedOption.label : service.label
            const badge = isSelected && selectedOption ? selectedOption : service
            return (
              <div key={service.id} className="relative shrink-0">
                <button
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-haspopup="true"
                  aria-expanded={openId === service.id}
                  onClick={() => setOpenId((prev) => (prev === service.id ? null : service.id))}
                  className={`flex min-h-[44px] shrink-0 snap-start items-center gap-2 rounded-full px-4 text-sm transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-surface-soft ${
                    isSelected
                      ? 'bg-surface font-medium text-ink shadow-flat'
                      : 'text-muted hover:bg-surface/60 hover:text-ink-soft'
                  }`}
                >
                  {renderBadge(badge)}
                  <span className="whitespace-nowrap">{label}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform duration-150 ${openId === service.id ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>

                {openId === service.id && (
                  <div className="absolute left-0 top-full z-20 pt-2">
                    <div className="w-72 rounded-2xl border border-line bg-surface p-2 shadow-float">
                      {options.map((option) => {
                        const isOptionSelected = selectedOption?.id === option.id
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => handleOptionSelect(service.id, option)}
                            className={`flex w-full items-start gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-surface-soft ${
                              isOptionSelected ? 'bg-surface-soft' : ''
                            }`}
                          >
                            {renderBadge(option)}
                            <span className="min-w-0">
                              <span className="block text-sm font-medium text-ink">{option.label}</span>
                              {option.description && (
                                <span className="block text-xs text-muted">{option.description}</span>
                              )}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          }

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
              {renderBadge(service)}
              <span className="whitespace-nowrap">{service.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
