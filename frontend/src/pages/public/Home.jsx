import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Car, Clock, ShieldCheck, MapPin, Navigation, User } from 'lucide-react'
import MapPlaceholder from '../../components/common/MapPlaceholder'
import ServiceTypeBar from '../../components/ride/ServiceTypeBar'
import RideCarModal from '../../components/ride/RideCarModal'
import { AVAILABLE_CARS, VEHICLE_TYPE_LABELS } from '../../constants/cars'
import carPlaceholder from '../../assets/car-placeholder.jpg'

export default function Home() {
  const [service, setService] = useState(null)
  const [rideCarModalOpen, setRideCarModalOpen] = useState(false)
  const [selectedCar, setSelectedCar] = useState(null)

  return (
    <div className="relative">
      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 lg:pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-live-tint px-3 py-1 text-xs font-medium text-live-ink ring-1 ring-inset ring-line">
                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-live animate-pulse"></span>
                Smarter rides, simpler booking
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.02] text-wrap balance">
              RideX — where every journey feels effortless
            </h1>
            <p className="text-base sm:text-lg text-muted-strong max-w-xl">
              Fast pickups, transparent pricing, and a seamless experience. Book your next ride in seconds.
            </p>
            <ServiceTypeBar
              onSelect={(svc) => {
                setService(svc)
                if (svc && svc.id === 'ride') {
                  setRideCarModalOpen(true)
                }
              }}
              className="max-w-xl"
            />

            {selectedCar && (
              <div className="flex max-w-xl items-center gap-3 rounded-2xl border border-line bg-surface p-3">
                <img
                  src={selectedCar.image || carPlaceholder}
                  alt={`${selectedCar.brand} ${selectedCar.model}`}
                  className="h-14 w-20 shrink-0 rounded-xl border border-line object-cover"
                  onError={(e) => {
                    e.currentTarget.src = carPlaceholder
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">
                    {selectedCar.brand} {selectedCar.model}
                  </p>
                  {selectedCar.driverName && (
                    <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-strong">
                      <User className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span className="truncate">{selectedCar.driverName}</span>
                    </p>
                  )}
                  <p className="mt-0.5 text-xs text-muted">
                    {VEHICLE_TYPE_LABELS[selectedCar.vehicleType] || selectedCar.vehicleType} •{' '}
                    {selectedCar.color} • {selectedCar.seats} seats
                  </p>
                  {selectedCar.distance && (
                    <p className="mt-0.5 text-xs text-muted">Distance: {selectedCar.distance}</p>
                  )}
                  <span className="mt-1.5 inline-flex items-center rounded-md border-2 border-ink/80 bg-surface px-2.5 py-1 font-mono text-xs font-semibold tracking-[0.18em] text-ink">
                    {selectedCar.vehicleNumber}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setRideCarModalOpen(true)}
                  className="shrink-0 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
                >
                  Change
                </button>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/register" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-on-ink hover:bg-ink/90 transition-colors shadow-button">
                {service ? service.cta : 'Get started'} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/login" className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-medium text-ink-soft hover:bg-surface-soft transition-colors">
                Sign in
              </Link>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
              <div className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-soft">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-lg font-medium">2-5 min</p>
                  <p className="text-sm text-muted">Average pickup</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-soft">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-lg font-medium">Trusted</p>
                  <p className="text-sm text-muted">Verified drivers</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-soft">
                  <Car className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-lg font-medium">Reliable</p>
                  <p className="text-sm text-muted">Live tracking</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-line bg-[radial-gradient(ellipse_at_top,rgb(var(--color-map-water)/0.25),transparent_70%),linear-gradient(180deg,rgb(var(--color-map-block))_0%,rgb(var(--color-paper))_100%)] shadow-hero">
              <div className="absolute inset-0">
                <MapPlaceholder className="h-full w-full" />
              </div>

              <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
                <div className="flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 text-xs shadow-button border border-line">
                  <span className="h-1.5 w-1.5 rounded-full bg-live"></span>
                  <span className="text-muted-strong">Live nearby</span>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6">
                <div className="mx-auto max-w-sm rounded-2xl bg-surface p-4 shadow-float border border-line">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-soft">
                        <Navigation className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Ride in progress</p>
                        <p className="text-xs text-muted">ETA 4 min</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-live-tint px-2 py-0.5 text-xs font-medium text-live-ink">On the way</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">2.4 km • Downtown to Uptown</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight">How RideX works</h2>
            <p className="mt-3 text-base text-muted-strong">Three simple steps from booking to arrival</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-line bg-surface-soft p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface border border-line">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-medium">Set your route</h3>
              <p className="mt-2 text-sm text-muted-strong">Enter pickup and drop-off in seconds and see transparent pricing upfront.</p>
            </div>
            <div className="rounded-2xl border border-line bg-surface-soft p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface border border-line">
                <Car className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-medium">Match instantly</h3>
              <p className="mt-2 text-sm text-muted-strong">Get matched with nearby verified drivers ready to go.</p>
            </div>
            <div className="rounded-2xl border border-line bg-surface-soft p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface border border-line">
                <Navigation className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-medium">Track & arrive</h3>
              <p className="mt-2 text-sm text-muted-strong">Follow your ride in real-time and arrive at your destination stress-free.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="order-2 lg:order-1">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl border border-line bg-[linear-gradient(180deg,rgb(var(--color-surface-soft))_0%,rgb(var(--color-paper))_100%)] shadow-hero">
              <div className="h-full w-full p-6 sm:p-10 flex items-center justify-center">
                <div className="w-full max-w-sm rounded-2xl bg-surface border border-line p-6 shadow-button">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-surface-soft"></div>
                    <div>
                      <p className="text-sm font-medium">Alex Johnson</p>
                      <p className="text-xs text-muted">Verified driver</p>
                    </div>
                    <span className="ml-auto inline-flex items-center rounded-full bg-live-tint px-2 py-0.5 text-xs font-medium text-live-ink">Online</span>
                  </div>
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted">Fare estimate</p>
                        <p className="text-2xl font-medium">$24.50</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted">Distance</p>
                        <p className="text-lg font-medium">8.4 km</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-surface-soft p-3 text-sm">
                      <MapPin className="h-4 w-4 text-muted" />
                      <span className="truncate">Pickup: 123 Main St</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-surface-soft p-3 text-sm">
                      <Navigation className="h-4 w-4 text-muted" />
                      <span className="truncate">Drop: Central Plaza</span>
                    </div>
                    <Link to="/register" className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-on-ink hover:bg-ink/90 transition-colors">
                      Book RideX <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 flex flex-col gap-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight">Built for speed, designed for trust</h2>
            <p className="text-base text-muted-strong max-w-xl">
              Every detail — from live tracking to transparent fares — is crafted to make rides feel effortless for both passengers and drivers.
            </p>
            <div className="grid gap-4">
              <div className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-4">
                <ShieldCheck className="h-5 w-5 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Verified identities</p>
                  <p className="text-sm text-muted">Safety-first onboarding for drivers and riders</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-4">
                <Clock className="h-5 w-5 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Real-time updates</p>
                  <p className="text-sm text-muted">Live ETAs and ride status at every step</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-4">
                <Car className="h-5 w-5 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Seamless flows</p>
                  <p className="text-sm text-muted">Intuitive booking that just works</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 rounded-3xl bg-ink px-6 sm:px-10 py-10 text-on-ink">
            <div className="text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl font-medium tracking-tight">Ready to ride with RideX?</h3>
              <p className="mt-2 text-sm sm:text-base text-on-ink/80">Join as a passenger today and experience rides reimagined.</p>
            </div>
            <Link to="/register" className="inline-flex items-center gap-2 rounded-full bg-on-ink px-6 py-3 text-sm font-medium text-ink hover:bg-on-ink/90 transition-colors shadow-button">
              Create account <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <RideCarModal
        isOpen={rideCarModalOpen}
        onClose={() => setRideCarModalOpen(false)}
        cars={AVAILABLE_CARS}
        selectedCarId={selectedCar?.id}
        onSelect={(car) => {
          setSelectedCar(car)
          setRideCarModalOpen(false)
        }}
      />
    </div>
  )
}