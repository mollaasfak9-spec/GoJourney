import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown } from 'lucide-react'
import { BIKE_TYPES, PARCEL_TYPES, RIDE_TYPES, SERVICE_TYPES } from '../../constants/services'

const SERVICE_OPTIONS = {
  ride: RIDE_TYPES,
  parcel: PARCEL_TYPES,
  bike: BIKE_TYPES,
}

const MENU_GAP = 8
const MENU_WIDTH = 288
const VIEWPORT_PADDING = 12

export default function ServiceTypeBar({ onSelect, initialId = 'ride', className = '' }) {
  const [selectedId, setSelectedId] = useState(initialId)
  const [selectedOption, setSelectedOption] = useState(null)
  const [openId, setOpenId] = useState(null)
  const [menuPosition, setMenuPosition] = useState(null)
  const [failedImages, setFailedImages] = useState(() => new Set())
  const barRef = useRef(null)
  const menuRef = useRef(null)
  const triggerRefs = useRef({})

  const openService = openId ? SERVICE_TYPES.find((service) => service.id === openId) : null
  const openOptions = openId ? SERVICE_OPTIONS[openId] : null

  function anchorToTrigger(serviceId) {
    const trigger = triggerRefs.current[serviceId]
    if (!trigger) return
    const rect = trigger.getBoundingClientRect()
    const maxLeft = window.innerWidth - MENU_WIDTH - VIEWPORT_PADDING
    setMenuPosition({
      top: rect.bottom + MENU_GAP,
      left: Math.max(VIEWPORT_PADDING, Math.min(rect.left, maxLeft)),
      width: MENU_WIDTH,
    })
  }

  function handleTriggerClick(serviceId) {
    if (openId === serviceId) {
      setOpenId(null)
      return
    }
    anchorToTrigger(serviceId)
    setOpenId(serviceId)
  }

  // Keep the portaled menu anchored to its trigger on scroll and resize.
  useEffect(() => {
    if (!openId || !SERVICE_OPTIONS[openId]) return undefined

    function positionMenu() {
      anchorToTrigger(openId)
    }

    window.addEventListener('scroll', positionMenu, true)
    window.addEventListener('resize', positionMenu)
    return () => {
      window.removeEventListener('scroll', positionMenu, true)
      window.removeEventListener('resize', positionMenu)
    }
  }, [openId])

  // Close on outside click or Escape.
  useEffect(() => {
    if (!openId) return undefined

    function handlePointerDown(event) {
      const inBar = barRef.current?.contains(event.target)
      const inMenu = menuRef.current?.contains(event.target)
      if (!inBar && !inMenu) setOpenId(null)
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') setOpenId(null)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [openId])

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
            const isOpen = openId === service.id
            return (
              <div key={service.id} className="relative shrink-0">
                <button
                  ref={(node) => {
                    triggerRefs.current[service.id] = node
                  }}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-haspopup="menu"
                  aria-expanded={isOpen}
                  onClick={() => handleTriggerClick(service.id)}
                  className={`flex min-h-[44px] shrink-0 snap-start items-center gap-2 rounded-full px-4 text-sm transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-surface-soft ${
                    isSelected
                      ? 'bg-surface font-medium text-ink shadow-flat'
                      : 'text-muted hover:bg-surface/60 hover:text-ink-soft'
                  }`}
                >
                  {renderBadge(badge)}
                  <span className="whitespace-nowrap">{label}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>
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

      {openService &&
        openOptions &&
        menuPosition &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            aria-label={`${openService.label} options`}
            style={{
              position: 'fixed',
              top: menuPosition.top,
              left: menuPosition.left,
              width: menuPosition.width,
            }}
            className="z-[60] origin-top rounded-lg border border-line bg-surface p-1.5 shadow-float animate-[menu-in_140ms_ease-out] motion-reduce:animate-none"
          >
            {openOptions.map((option) => {
              const isOptionSelected = selectedOption?.id === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  role="menuitem"
                  onClick={() => handleOptionSelect(openId, option)}
                  className={`flex w-full items-start gap-3 rounded-md px-3 py-2 text-left text-ink-soft transition-colors hover:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-status-accepted))] ${
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
          </div>,
          document.body,
        )}
    </div>
  )
}
