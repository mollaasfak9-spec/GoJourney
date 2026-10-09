import { useState } from 'react'
import { Check } from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import { DRIVER_PROFILE } from '../../constants/mockData'
import { getVehicleImage } from '../../constants/cars'
import { useToast } from '../../context/toast'

const inputClass =
  'h-[52px] w-full rounded-[14px] bg-surface-soft px-4 text-sm text-ink placeholder:text-muted outline-none transition focus:bg-surface focus:ring-2 focus:ring-ink'

const TYPES = [
  { id: 'sedan', label: 'Sedan' },
  { id: 'suv', label: 'SUV' },
  { id: 'hatchback', label: 'Hatchback' },
  { id: 'auto', label: 'Auto' },
  { id: 'bike', label: 'Bike' },
]

export default function Vehicle() {
  const { toast } = useToast()
  const [form, setForm] = useState({ ...DRIVER_PROFILE.vehicle })
  const [saving, setSaving] = useState(false)

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function save(event) {
    event.preventDefault()
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 700))
    setSaving(false)
    toast('Vehicle saved')
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader title="My vehicle" description="Keep your vehicle details up to date for passengers." />

      <form onSubmit={save} className="mt-6 space-y-5">
        <div className="overflow-hidden rounded-3xl border border-line bg-surface">
          <div className="relative h-48 bg-surface-soft sm:h-56">
            <img
              src={getVehicleImage(form.type)}
              alt={`${form.brand} ${form.model}`}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-surface to-transparent" aria-hidden="true" />
            <span className="absolute bottom-4 left-5 inline-flex items-center rounded-md border-2 border-ink/80 bg-surface px-2.5 py-1 font-mono text-xs font-semibold tracking-[0.18em] text-ink">
              {form.number}
            </span>
          </div>
          <div className="p-5 sm:p-6">
            <p className="text-[13px] text-muted">Vehicle type</p>
            <div role="radiogroup" aria-label="Vehicle type" className="mt-2 flex flex-wrap gap-2">
              {TYPES.map((type) => {
                const isSelected = form.type === type.id
                return (
                  <button
                    key={type.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => update('type', type.id)}
                    className={`relative min-h-[44px] rounded-full border px-4 text-sm transition-colors ${
                      isSelected ? 'border-ink bg-surface font-medium text-ink' : 'border-line bg-surface text-muted-strong hover:bg-surface-soft'
                    }`}
                  >
                    {type.label}
                    {isSelected && (
                      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-on-ink">
                        <Check className="h-3 w-3" aria-hidden="true" />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="brand" className="block text-[13px] text-muted">
              Brand
            </label>
            <input id="brand" value={form.brand} onChange={(event) => update('brand', event.target.value)} className={inputClass} required />
          </div>
          <div className="space-y-2">
            <label htmlFor="model" className="block text-[13px] text-muted">
              Model
            </label>
            <input id="model" value={form.model} onChange={(event) => update('model', event.target.value)} className={inputClass} required />
          </div>
          <div className="space-y-2">
            <label htmlFor="color" className="block text-[13px] text-muted">
              Colour
            </label>
            <input id="color" value={form.color} onChange={(event) => update('color', event.target.value)} className={inputClass} />
          </div>
          <div className="space-y-2">
            <label htmlFor="number" className="block text-[13px] text-muted">
              Registration number
            </label>
            <input
              id="number"
              value={form.number}
              onChange={(event) => update('number', event.target.value.toUpperCase())}
              className={`${inputClass} tracking-[0.04em]`}
              placeholder="KA-01-AB-1234"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-on-ink shadow-button transition hover:bg-ink/90 disabled:opacity-40"
        >
          {saving ? 'Saving...' : 'Save vehicle'}
        </button>
      </form>
    </div>
  )
}
