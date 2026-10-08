import { Bike, Boxes, Car, FileText, KeyRound, Package, PackageOpen, Pill, Route, ShieldCheck, ShoppingBag, Truck, UtensilsCrossed, Zap } from 'lucide-react'
import carImage from '../assets/service-car.svg'
import parcelImage from '../assets/service-parcel.svg'
import bikeImage from '../assets/service-bike.svg'

export const SERVICE_TYPES = [
  { id: 'ride', label: 'Ride', icon: Car, image: carImage, cta: 'Book a ride' },
  { id: 'parcel', label: 'Parcel', icon: Package, image: parcelImage, cta: 'Send a parcel' },
  { id: 'bike', label: 'Bike', icon: Bike, image: bikeImage, emoji: '🏍️', cta: 'Book a bike' },
]

export const RIDE_TYPES = [
  { id: 'sedan', label: 'Sedan', description: 'Comfortable rides for up to 4', icon: Car, image: carImage, vehicleType: 'sedan', cta: 'Book a sedan' },
  { id: 'suv', label: 'SUV', description: 'Spacious rides for up to 6', icon: Car, image: carImage, vehicleType: 'suv', cta: 'Book an SUV' },
  { id: 'hatchback', label: 'Hatchback', description: 'Affordable everyday rides', icon: Car, image: carImage, vehicleType: 'hatchback', cta: 'Book a hatchback' },
  { id: 'auto', label: 'Auto Rickshaw', description: 'Quick and budget short hops', icon: Car, image: carImage, vehicleType: 'auto', cta: 'Book an auto' },
  { id: 'premium', label: 'Premium', description: 'Luxury cars with top drivers', icon: Car, image: carImage, vehicleType: 'sedan', cta: 'Book a premium car' },
  { id: 'electric', label: 'Electric', description: 'Zero-emission comfortable cars', icon: Car, image: carImage, vehicleType: 'sedan', cta: 'Book an EV' },
]

export const PARCEL_TYPES = [
  { id: 'documents', label: 'Documents', description: 'Papers, envelopes and files', icon: FileText, cta: 'Send documents' },
  { id: 'small', label: 'Small Parcel', description: 'Light items up to 5 kg', icon: Package, cta: 'Send a small parcel' },
  { id: 'medium', label: 'Medium Parcel', description: 'Boxes up to 15 kg', icon: PackageOpen, cta: 'Send a medium parcel' },
  { id: 'heavy', label: 'Heavy Parcel', description: 'Bulk items up to 30 kg', icon: Boxes, cta: 'Send a heavy parcel' },
  { id: 'food', label: 'Food Delivery', description: 'Hot and fresh meals', icon: UtensilsCrossed, cta: 'Send food' },
  { id: 'medicine', label: 'Medicines', description: 'Pharmacy and medical items', icon: Pill, cta: 'Send medicines' },
  { id: 'grocery', label: 'Groceries', description: 'Daily essentials and produce', icon: ShoppingBag, cta: 'Send groceries' },
  { id: 'large', label: 'Large Moves', description: 'Furniture and big items', icon: Truck, cta: 'Move large items' },
]

export const BIKE_TYPES = [
  { id: 'bike-taxi', label: 'Bike Taxi', description: 'Quick single-rider trips', icon: Bike, cta: 'Book a bike taxi' },
  { id: 'bike-rental', label: 'Bike Rental', description: 'Hourly and daily rentals', icon: KeyRound, cta: 'Rent a bike' },
  { id: 'bike-parcel', label: 'Bike Parcel', description: 'Fast small deliveries', icon: Package, cta: 'Send a bike parcel' },
  { id: 'bike-ev', label: 'EV Bikes', description: 'Zero-emission bikes', icon: Zap, cta: 'Book an EV bike' },
  { id: 'bike-outstation', label: 'Outstation Bike', description: 'Intercity bike journeys', icon: Route, cta: 'Book an outstation bike' },
  { id: 'bike-safety', label: 'Safety', description: 'Helmets, SOS and verified riders', icon: ShieldCheck, cta: 'Learn about safety' },
]
