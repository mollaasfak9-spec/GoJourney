import { Car, ShieldCheck, Clock } from 'lucide-react'

export default function About() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="max-w-2xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight">About RideX</h1>
        <p className="mt-4 text-base text-muted-strong">
          RideX is a modern ride-hailing platform built to make urban mobility faster, safer, and simpler for everyone. We're focused on clean design, transparent pricing, and reliable service.
        </p>
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-line bg-surface p-6">
          <Car className="h-6 w-6" />
          <h3 className="mt-3 text-lg font-medium">Reliable rides</h3>
          <p className="mt-2 text-sm text-muted-strong">Quick matching with verified drivers in your area.</p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-6">
          <ShieldCheck className="h-6 w-6" />
          <h3 className="mt-3 text-lg font-medium">Safety first</h3>
          <p className="mt-2 text-sm text-muted-strong">Trust through verification and real-time tracking.</p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-6">
          <Clock className="h-6 w-6" />
          <h3 className="mt-3 text-lg font-medium">Time conscious</h3>
          <p className="mt-2 text-sm text-muted-strong">Accurate ETAs so you stay on schedule.</p>
        </div>
      </div>
    </div>
  )
}