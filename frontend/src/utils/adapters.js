/**
 * Adapters that translate backend documents into the view models the existing
 * UI components expect. Keeping the mapping here means pages and components stay
 * readable and there is a single place to update if a backend field changes.
 */

const nameOf = (value, fallback = null) => {
  if (!value) return fallback
  if (typeof value === 'string') return value
  return value.name || fallback
}

const idOf = (value) => {
  if (!value) return null
  if (typeof value === 'string') return value
  return value.id || value._id || null
}

export function vehicleLabel(vehicleType) {
  if (!vehicleType) return '—'
  return vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1)
}

export function formatTime(minutes) {
  if (minutes === null || minutes === undefined || Number.isNaN(Number(minutes))) return '—'
  return `${Number(minutes)} min`
}

/**
 * Backend `Ride` (optionally populated with passengerId / driverId) -> UI ride.
 */
export function rideView(ride) {
  if (!ride) return null

  const driverDoc = ride.driverId && typeof ride.driverId === 'object' ? ride.driverId : null
  const passengerDoc =
    ride.passengerId && typeof ride.passengerId === 'object' ? ride.passengerId : null

  return {
    id: ride.id || ride._id,
    status: ride.status,
    pickup: (ride.pickup && ride.pickup.address) || 'Pickup point',
    destination: (ride.destination && ride.destination.address) || 'Destination',
    pickupPoint: ride.pickup || null,
    destinationPoint: ride.destination || null,
    distance: ride.distance ?? 0,
    duration: formatTime(ride.estimatedDuration),
    estimatedDuration: ride.estimatedDuration ?? null,
    fare: ride.finalFare ?? ride.estimatedFare ?? 0,
    estimatedFare: ride.estimatedFare ?? 0,
    finalFare: ride.finalFare ?? null,
    vehicleType: ride.vehicleType,
    vehicleLabel: vehicleLabel(ride.vehicleType),
    paymentMethod: ride.paymentMethod || null,
    date: ride.createdAt,
    createdAt: ride.createdAt,
    passenger: passengerDoc ? nameOf(passengerDoc, 'Passenger') : 'Passenger',
    passengerPhone: passengerDoc ? passengerDoc.phone : null,
    driver: driverDoc ? nameOf(driverDoc.userId) || nameOf(driverDoc, 'Driver') : ride.driver || null,
    driverPhone: driverDoc && driverDoc.userId ? driverDoc.userId.phone : null,
    rating: ride.rating ?? null,
    raw: ride,
  }
}

/**
 * A ride from GET /drivers/me/ride-requests -> RequestCard props.
 */
export function requestView(ride) {
  return {
    id: ride.id || ride._id,
    passenger: nameOf(ride.passengerId, 'Passenger'),
    passengerPhone: ride.passengerId ? ride.passengerId.phone : null,
    pickup: (ride.pickup && ride.pickup.address) || 'Pickup point',
    destination: (ride.destination && ride.destination.address) || 'Destination',
    distance: ride.distance ?? ride.pickupDistance ?? 0,
    pickupDistance: ride.pickupDistance ?? null,
    fare: ride.estimatedFare ?? 0,
    eta: formatTime(ride.estimatedDuration),
    vehicleType: ride.vehicleType,
    vehicleLabel: vehicleLabel(ride.vehicleType),
    date: ride.createdAt,
    raw: ride,
  }
}

/**
 * Backend `User` -> admin/user view model.
 */
export function userView(user) {
  return {
    id: user.id || user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || '—',
    role: user.role,
    status: user.isActive === false ? 'suspended' : 'active',
    isActive: user.isActive !== false,
    createdAt: user.createdAt,
    profileImage: user.profileImage || null,
    raw: user,
  }
}

/**
 * Backend `Driver` (optionally with populated userId) -> admin driver view model.
 */
export function driverView(driver, vehicles = []) {
  const user = driver.userId && typeof driver.userId === 'object' ? driver.userId : {}
  const primaryVehicle = vehicles[0] || driver.vehicle || null

  return {
    id: driver.id || driver._id,
    userId: idOf(user),
    name: user.name || 'Driver',
    email: user.email || '',
    phone: user.phone || '—',
    licenseNumber: driver.licenseNumber || '—',
    verification: driver.verificationStatus,
    isOnline: Boolean(driver.isOnline),
    online: Boolean(driver.isOnline),
    status: user.isActive === false ? 'suspended' : driver.isOnline ? 'active' : 'inactive',
    rating: driver.rating || 0,
    ratingCount: driver.ratingCount || 0,
    trips: driver.totalRides || 0,
    joined: driver.createdAt,
    earnings: driver.totalEarnings || 0,
    currentLocation: driver.currentLocation || null,
    vehicle: primaryVehicle
      ? {
          id: primaryVehicle.id || primaryVehicle._id,
          type: primaryVehicle.type,
          brand: primaryVehicle.brand,
          model: primaryVehicle.model,
          color: primaryVehicle.color,
          year: primaryVehicle.year,
          number: primaryVehicle.registrationNumber,
          registrationNumber: primaryVehicle.registrationNumber,
          isActive: primaryVehicle.isActive !== false,
        }
      : null,
    vehicles: vehicles.map((vehicle) => ({
      id: vehicle.id || vehicle._id,
      type: vehicle.type,
      brand: vehicle.brand,
      model: vehicle.model,
      color: vehicle.color,
      year: vehicle.year,
      registrationNumber: vehicle.registrationNumber,
      number: vehicle.registrationNumber,
      isActive: vehicle.isActive !== false,
      raw: vehicle,
    })),
    raw: driver,
  }
}

/**
 * Backend `Vehicle` -> vehicle form/display model.
 */
export function vehicleView(vehicle) {
  return {
    id: vehicle.id || vehicle._id,
    type: vehicle.type,
    brand: vehicle.brand || '',
    model: vehicle.model || '',
    color: vehicle.color || '',
    year: vehicle.year || '',
    registrationNumber: vehicle.registrationNumber || '',
    number: vehicle.registrationNumber || '',
    isActive: vehicle.isActive !== false,
    raw: vehicle,
  }
}

const PAYMENT_STATUS_LABEL = {
  paid: 'Paid',
  pending: 'Pending',
  failed: 'Failed',
  refunded: 'Refunded',
}

/**
 * Backend `Payment` (optionally populated) -> admin payment view model.
 */
export function paymentView(payment) {
  const passenger =
    payment.passengerId && typeof payment.passengerId === 'object' ? payment.passengerId : null
  const ride = payment.rideId && typeof payment.rideId === 'object' ? payment.rideId : null

  return {
    id: payment.id || payment._id,
    rideId: idOf(payment.rideId),
    passenger: nameOf(passenger, 'Passenger'),
    passengerPhone: passenger ? passenger.phone : null,
    amount: payment.amount ?? 0,
    method: payment.method,
    methodLabel: payment.method ? payment.method.charAt(0).toUpperCase() + payment.method.slice(1) : '—',
    status: payment.status,
    statusLabel: PAYMENT_STATUS_LABEL[payment.status] || payment.status,
    transactionId: payment.transactionId || '—',
    rideStatus: ride ? ride.status : null,
    paidAt: payment.paidAt,
    date: payment.createdAt,
    createdAt: payment.createdAt,
    raw: payment,
  }
}

/**
 * Backend `Rating` -> display model.
 */
export function ratingView(rating) {
  if (!rating) return null
  return {
    id: rating.id || rating._id,
    rating: rating.rating,
    comment: rating.comment || '',
    date: rating.createdAt,
    raw: rating,
  }
}
