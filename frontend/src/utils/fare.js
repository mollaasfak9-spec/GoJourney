const BASE_FARE = { car: 45, auto: 30, bike: 25 }
const PER_KM = { car: 18, auto: 12, bike: 9 }

export const BOOKING_VEHICLES = [
  { id: 'car', label: 'Car', eta: '4 min away', seats: '4 seats' },
  { id: 'auto', label: 'Auto', eta: '3 min away', seats: '3 seats' },
  { id: 'bike', label: 'Bike', eta: '2 min away', seats: '1 seat' },
]

function hash(text = '') {
  let h = 0
  for (let i = 0; i < text.length; i += 1) h = (h * 31 + text.charCodeAt(i)) % 100000
  return h
}

export function estimateDistanceKm(pickup = '', destination = '') {
  if (!pickup.trim() || !destination.trim()) return 0
  const spread = Math.abs(hash(pickup) - hash(destination)) % 9000
  return Math.round((2.4 + spread / 1000) * 10) / 10
}

export function fareFromDistance(distance, vehicleType = 'car') {
  if (!distance) return null
  const base = BASE_FARE[vehicleType] ?? BASE_FARE.car
  const rate = PER_KM[vehicleType] ?? PER_KM.car
  return Math.round(base + distance * rate)
}

export function estimateFare(pickup = '', destination = '', vehicleType = 'car') {
  const distance = estimateDistanceKm(pickup, destination)
  return fareFromDistance(distance, vehicleType)
}

const ROAD_FACTOR = 1.3

export function routeDistanceKm(from = {}, to = {}) {
  if (typeof from.lat !== 'number' || typeof to.lat !== 'number') return 0
  if (typeof from.lng !== 'number' || typeof to.lng !== 'number') return 0
  const toRad = (deg) => (deg * Math.PI) / 180
  const dLat = toRad(to.lat - from.lat)
  const dLng = toRad(to.lng - from.lng)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) ** 2
  const direct = 2 * 6371 * Math.asin(Math.sqrt(a))
  return Math.max(0.5, Math.round(direct * ROAD_FACTOR * 10) / 10)
}
