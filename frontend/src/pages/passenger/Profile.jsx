import { useState } from 'react'
import { Home, Pencil, Briefcase, Mail, Phone } from 'lucide-react'
import ProfileCard from '../../components/common/ProfileCard'
import Modal from '../../components/common/Modal'
import { useAuth } from '../../context/auth'
import { useToast } from '../../context/toast'
import { PASSENGER_PROFILE, SAVED_PLACES } from '../../constants/mockData'

const inputClass =
  'h-[52px] w-full rounded-[14px] bg-surface-soft px-4 text-sm text-ink placeholder:text-muted outline-none transition focus:bg-surface focus:ring-2 focus:ring-ink'

export default function PassengerProfile() {
  const { user, updateProfile } = useAuth()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || PASSENGER_PROFILE.name,
    email: user?.email || PASSENGER_PROFILE.email,
    phone: user?.phone || PASSENGER_PROFILE.phone,
  })

  const name = form.name
  const stats = [
    { label: 'Member since', value: PASSENGER_PROFILE.memberSince },
    { label: 'Total rides', value: PASSENGER_PROFILE.totalRides },
    { label: 'Rating', value: PASSENGER_PROFILE.rating },
  ]

  function save(event) {
    event.preventDefault()
    updateProfile({ name: form.name, email: form.email, phone: form.phone })
    setOpen(false)
    toast('Profile updated')
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-5 text-2xl font-medium tracking-tight text-ink">Profile</h1>

      <ProfileCard
        name={name}
        subtitle={form.email}
        chip={
          <span className="rounded-full bg-surface-soft px-2.5 py-0.5 text-[13px] capitalize text-muted-strong">
            Passenger
          </span>
        }
        stats={stats}
        actions={
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-on-ink shadow-button transition hover:bg-ink/90"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Edit profile
          </button>
        }
      >
        <div className="mt-5 rounded-2xl bg-surface-soft p-5">
          <h2 className="text-sm font-medium text-ink">Account information</h2>
          <dl className="mt-3 space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted" aria-hidden="true" />
              <dt className="sr-only">Email</dt>
              <dd className="text-ink-soft">{form.email}</dd>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted" aria-hidden="true" />
              <dt className="sr-only">Phone</dt>
              <dd className="text-ink-soft">{form.phone || 'Not added yet'}</dd>
            </div>
          </dl>
        </div>
      </ProfileCard>

      <div className="mt-5 rounded-2xl border border-line bg-surface p-5">
        <h2 className="text-sm font-medium text-ink">Saved places</h2>
        <ul className="mt-3 space-y-3">
          {SAVED_PLACES.map((place) => {
            const Icon = place.label === 'Home' ? Home : Briefcase
            return (
              <li key={place.label} className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-soft">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm text-ink">{place.label}</span>
                  <span className="block text-[13px] text-muted">{place.address}</span>
                </span>
              </li>
            )
          })}
        </ul>
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} className="max-w-md">
        <form onSubmit={save} className="flex flex-col gap-4">
          <div className="pr-8">
            <h3 className="text-lg font-medium text-ink">Edit profile</h3>
            <p className="mt-1 text-sm text-muted">Update how we reach you.</p>
          </div>
          <div className="space-y-3">
            <div className="space-y-2">
              <label htmlFor="edit-name" className="block text-[13px] text-muted">
                Full name
              </label>
              <input
                id="edit-name"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                className={inputClass}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-email" className="block text-[13px] text-muted">
                Email
              </label>
              <input
                id="edit-email"
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                className={inputClass}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-phone" className="block text-[13px] text-muted">
                Phone
              </label>
              <input
                id="edit-phone"
                value={form.phone}
                onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                className={inputClass}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-12 flex-1 rounded-full border border-line bg-surface text-sm font-medium text-ink-soft transition hover:bg-surface-soft"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-12 flex-1 rounded-full bg-ink text-sm font-medium text-on-ink transition hover:bg-ink/90"
            >
              Save changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
