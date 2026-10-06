import { Bike, Bus, CalendarCheck, Car, KeyRound, Package, Route } from 'lucide-react'

export const SERVICE_TYPES = [
  { id: 'ride', label: 'Ride', icon: Car, cta: 'Book a ride' },
  { id: 'reserve', label: 'Reserve', icon: CalendarCheck, cta: 'Reserve a ride' },
  { id: 'intercity', label: 'Intercity', icon: Route, cta: 'Plan an intercity ride' },
  { id: 'shuttle', label: 'Shuttle', icon: Bus, cta: 'Book a shuttle' },
  { id: 'parcel', label: 'Parcel', icon: Package, cta: 'Send a parcel' },
  { id: 'rentals', label: 'Rentals', icon: KeyRound, cta: 'Rent a vehicle' },
  { id: 'bike', label: 'Bike', icon: Bike, cta: 'Book a bike' },
]