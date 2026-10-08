import { useEffect, useId, useRef, useState } from 'react'
import {
  Building2,
  GraduationCap,
  Landmark,
  MapPin,
  Plane,
  ShoppingBag,
  Star,
  Store,
  Stethoscope,
  TrainFront,
  Utensils,
} from 'lucide-react'
import { PLACE_CATEGORY_LABEL, searchPlaces } from '../../constants/places'

const inputClass =
  'h-[52px] w-full rounded-[14px] bg-surface-soft pl-11 pr-4 text-sm text-ink placeholder:text-muted outline-none transition focus:bg-surface focus:ring-2 focus:ring-ink'

const CATEGORY_ICONS = {
  saved: Star,
  transit: TrainFront,
  airport: Plane,
  mall: ShoppingBag,
  education: GraduationCap,
  hospital: Stethoscope,
  landmark: Landmark,
  market: Store,
  food: Utensils,
  office: Building2,
  neighborhood: MapPin,
}

function buildItems(query, places, saved) {
  const trimmed = query.trim().toLowerCase()

  const savedItems = saved
    .filter((place) => !trimmed || `${place.label} ${place.address}`.toLowerCase().includes(trimmed))
    .map((place) => ({
      key: `saved-${place.label}`,
      group: 'Saved places',
      title: place.label,
      subtitle: place.address,
      category: 'saved',
      place: {
        id: `saved-${place.label.toLowerCase()}`,
        name: place.label,
        address: place.address,
        area: place.address,
        category: 'saved',
        lat: place.lat,
        lng: place.lng,
        keywords: [],
      },
    }))

  const placeItems = searchPlaces(trimmed, places).map((place) => ({
    key: place.id,
    group: trimmed ? 'Places' : 'Popular places',
    title: place.name,
    subtitle: place.address,
    category: place.category,
    place,
  }))

  return [...savedItems, ...placeItems]
}

export default function PlaceInput({
  id,
  value,
  onChange,
  onSelect,
  placeholder,
  icon: Icon,
  iconClassName = 'text-ink',
  places = [],
  saved = [],
}) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const boxRef = useRef(null)
  const listId = useId()

  const items = buildItems(value, places, saved)
  const query = value.trim()
  const showList = open && (items.length > 0 || query.length > 0)

  useEffect(() => {
    if (!open) return undefined
    function handlePointer(event) {
      if (boxRef.current && !boxRef.current.contains(event.target)) setOpen(false)
    }
    function handleKey(event) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  function choose(item) {
    onChange?.(item.title)
    onSelect?.(item.place)
    setOpen(false)
    setActive(-1)
  }

  function handleKeyDown(event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      setActive((index) => Math.min(index + 1, items.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((index) => Math.max(index - 1, 0))
    } else if (event.key === 'Enter' && open && active >= 0 && items[active]) {
      event.preventDefault()
      choose(items[active])
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={boxRef} className="relative">
      <Icon
        className={`pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${iconClassName}`}
        aria-hidden="true"
      />
      <input
        id={id}
        value={value}
        onChange={(event) => {
          onChange?.(event.target.value)
          setOpen(true)
          setActive(-1)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 && items[active] ? `${listId}-${active}` : undefined}
        className={inputClass}
      />
      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 max-h-64 overflow-auto rounded-2xl border border-line bg-surface p-1.5 shadow-float"
        >
          {items.map((item, index) => {
            const showGroup = index === 0 || items[index - 1].group !== item.group
            const CategoryIcon = CATEGORY_ICONS[item.category] ?? MapPin
            return (
              <li key={item.key} id={`${listId}-${index}`} role="option" aria-selected={index === active}>
                {showGroup && (
                  <p className="px-3 pb-1 pt-2.5 text-[11px] font-medium uppercase tracking-wider text-muted" role="presentation">
                    {item.group}
                  </p>
                )}
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => choose(item)}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                    index === active ? 'bg-surface-soft text-ink' : 'text-ink-soft hover:bg-surface-soft'
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      index === active ? 'bg-surface text-ink' : 'bg-surface-soft text-muted'
                    }`}
                    aria-hidden="true"
                  >
                    <CategoryIcon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-ink">{item.title}</span>
                    <span className="block truncate text-[13px] text-muted">{item.subtitle}</span>
                  </span>
                  <span className="shrink-0 rounded-full bg-surface-soft px-2 py-0.5 text-[11px] text-muted">
                    {PLACE_CATEGORY_LABEL[item.category] ?? item.category}
                  </span>
                </button>
              </li>
            )
          })}
          {items.length === 0 && (
            <li role="presentation" className="px-3 py-3 text-sm text-muted">
              No places match &ldquo;{query}&rdquo;
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
