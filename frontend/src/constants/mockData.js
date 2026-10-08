export const USERS = [
  { id: 'u-1', name: 'Akash Das', email: 'akash@example.com', phone: '+91 98301 11223', role: 'passenger', status: 'active', createdAt: '2026-01-12', rides: 34, rating: 4.8 },
  { id: 'u-2', name: 'Priya Sen', email: 'priya@example.com', phone: '+91 98745 55412', role: 'passenger', status: 'active', createdAt: '2026-02-03', rides: 12, rating: 4.9 },
  { id: 'u-3', name: 'Rahul Dey', email: 'rahul@example.com', phone: '+91 90073 88121', role: 'driver', status: 'active', createdAt: '2025-11-20', rides: 412, rating: 4.8 },
  { id: 'u-4', name: 'Aslam Faruki', email: 'aslam@example.com', phone: '+91 98312 45001', role: 'driver', status: 'active', createdAt: '2025-12-08', rides: 288, rating: 4.7 },
  { id: 'u-5', name: 'Sneha Sardar', email: 'sneha@example.com', phone: '+91 99031 22874', role: 'passenger', status: 'active', createdAt: '2026-03-17', rides: 7, rating: 5 },
  { id: 'u-6', name: 'Imran Sheikh', email: 'imran@example.com', phone: '+91 91630 77119', role: 'driver', status: 'suspended', createdAt: '2026-01-29', rides: 96, rating: 4.2 },
  { id: 'u-7', name: 'Nikita Roy', email: 'nikita@example.com', phone: '+91 98000 34112', role: 'passenger', status: 'active', createdAt: '2026-04-02', rides: 3, rating: 4.6 },
  { id: 'u-8', name: 'Arjun Mehta', email: 'arjun@example.com', phone: '+91 97481 90045', role: 'passenger', status: 'inactive', createdAt: '2026-05-21', rides: 18, rating: 4.4 },
  { id: 'u-9', name: 'Kabir Nair', email: 'kabir@example.com', phone: '+91 90512 66730', role: 'driver', status: 'active', createdAt: '2026-02-14', rides: 151, rating: 4.9 },
  { id: 'u-10', name: 'Tania Ghosh', email: 'tania@example.com', phone: '+91 96741 20098', role: 'passenger', status: 'active', createdAt: '2026-06-09', rides: 1, rating: 5 },
]

export const DRIVERS = [
  { id: 'd-1', name: 'Rahul Dey', phone: '+91 90073 88121', email: 'rahul@example.com', vehicle: { type: 'sedan', brand: 'Toyota', model: 'Etios', color: 'White', number: 'KA-01-AB-1234' }, verification: 'verified', status: 'active', rating: 4.8, trips: 412, joined: '2025-11-20', earnings: 184200 },
  { id: 'd-2', name: 'Aslam Faruki', phone: '+91 98312 45001', email: 'aslam@example.com', vehicle: { type: 'suv', brand: 'Hyundai', model: 'Creta', color: 'Grey', number: 'KA-05-MN-7788' }, verification: 'verified', status: 'active', rating: 4.7, trips: 288, joined: '2025-12-08', earnings: 141800 },
  { id: 'd-3', name: 'Kabir Nair', phone: '+91 90512 66730', email: 'kabir@example.com', vehicle: { type: 'hatchback', brand: 'Maruti', model: 'Swift', color: 'Red', number: 'KA-03-QR-4512' }, verification: 'pending', status: 'active', rating: 4.9, trips: 151, joined: '2026-02-14', earnings: 76400 },
  { id: 'd-4', name: 'Imran Sheikh', phone: '+91 91630 77119', email: 'imran@example.com', vehicle: { type: 'auto', brand: 'Bajaj', model: 'Auto Rickshaw', color: 'Yellow', number: 'KA-02-ZX-9031' }, verification: 'verified', status: 'suspended', rating: 4.2, trips: 96, joined: '2026-01-29', earnings: 38900 },
  { id: 'd-5', name: 'Meera Iyer', phone: '+91 91234 55678', email: 'meera@example.com', vehicle: { type: 'sedan', brand: 'Honda', model: 'Amaze', color: 'Silver', number: 'KA-04-LM-2211' }, verification: 'pending', status: 'active', rating: 4.6, trips: 64, joined: '2026-05-30', earnings: 29100 },
  { id: 'd-6', name: 'Sourav Pal', phone: '+91 93300 11456', email: 'sourav@example.com', vehicle: { type: 'bike', brand: 'Honda', model: 'Activa', color: 'Blue', number: 'KA-09-CD-7781' }, verification: 'verified', status: 'active', rating: 4.5, trips: 210, joined: '2026-01-05', earnings: 52300 },
]

export const RIDES = [
  { id: 'RX-1042', passenger: 'Akash Das', driver: null, pickup: 'GMIT College', destination: 'Baruipur Station', status: 'requested', fare: 150, distance: 7.4, duration: '18 min', vehicleType: 'car', paymentMethod: 'UPI', date: '2026-10-09T09:20:00' },
  { id: 'RX-1041', passenger: 'Priya Sen', driver: 'Rahul Dey', pickup: 'Salt Lake Sector V', destination: 'Sector V Metro', status: 'completed', fare: 220, distance: 9.1, duration: '24 min', vehicleType: 'car', paymentMethod: 'Card', date: '2026-10-08T18:05:00' },
  { id: 'RX-1040', passenger: 'Akash Das', driver: 'Aslam Faruki', pickup: 'GMIT College', destination: 'New Town', status: 'completed', fare: 320, distance: 14.6, duration: '36 min', vehicleType: 'car', paymentMethod: 'UPI', date: '2026-10-07T14:40:00' },
  { id: 'RX-1039', passenger: 'Sneha Sardar', driver: 'Kabir Nair', pickup: 'Rashbehari Avenue', destination: 'Quest Mall', status: 'cancelled', fare: 0, distance: 4.2, duration: '—', vehicleType: 'auto', paymentMethod: 'Cash', date: '2026-10-07T11:12:00' },
  { id: 'RX-1038', passenger: 'Nikita Roy', driver: 'Sourav Pal', pickup: 'Gariahat Market', destination: 'Dakshineswar', status: 'completed', fare: 265, distance: 11.8, duration: '32 min', vehicleType: 'bike', paymentMethod: 'UPI', date: '2026-10-06T19:30:00' },
  { id: 'RX-1037', passenger: 'Akash Das', driver: 'Rahul Dey', pickup: 'Baruipur Station', destination: 'GMIT College', status: 'completed', fare: 155, distance: 7.6, duration: '19 min', vehicleType: 'car', paymentMethod: 'Cash', date: '2026-10-05T08:15:00' },
  { id: 'RX-1036', passenger: 'Arjun Mehta', driver: 'Meera Iyer', pickup: 'Howrah Station', destination: 'Park Street', status: 'completed', fare: 190, distance: 8.3, duration: '26 min', vehicleType: 'car', paymentMethod: 'Card', date: '2026-10-04T16:45:00' },
  { id: 'RX-1035', passenger: 'Tania Ghosh', driver: null, pickup: 'ESPLANADE', destination: 'Alipore Zoo', status: 'cancelled', fare: 0, distance: 5.1, duration: '—', vehicleType: 'auto', paymentMethod: 'UPI', date: '2026-10-04T12:02:00' },
  { id: 'RX-1034', passenger: 'Priya Sen', driver: 'Kabir Nair', pickup: 'New Town', destination: 'Salt Lake Sector V', status: 'completed', fare: 240, distance: 10.2, duration: '27 min', vehicleType: 'car', paymentMethod: 'UPI', date: '2026-10-03T09:55:00' },
  { id: 'RX-1033', passenger: 'Akash Das', driver: 'Sourav Pal', pickup: 'GMIT College', destination: 'Jadavpur University', status: 'completed', fare: 120, distance: 5.4, duration: '15 min', vehicleType: 'bike', paymentMethod: 'Cash', date: '2026-10-02T17:20:00' },
  { id: 'RX-1032', passenger: 'Sneha Sardar', driver: 'Aslam Faruki', pickup: 'Salt Lake City Centre', destination: 'Bidhannagar', status: 'completed', fare: 175, distance: 6.9, duration: '20 min', vehicleType: 'auto', paymentMethod: 'UPI', date: '2026-10-01T10:40:00' },
  { id: 'RX-1031', passenger: 'Nikita Roy', driver: 'Rahul Dey', pickup: 'Rashbehari Avenue', destination: 'Howrah Station', status: 'completed', fare: 310, distance: 13.4, duration: '38 min', vehicleType: 'car', paymentMethod: 'Card', date: '2026-09-30T20:10:00' },
  { id: 'RX-1030', passenger: 'Arjun Mehta', driver: null, pickup: 'Behala Chowrasta', destination: 'Tollygunge', status: 'cancelled', fare: 0, distance: 6.2, duration: '—', vehicleType: 'car', paymentMethod: 'Cash', date: '2026-09-29T13:25:00' },
  { id: 'RX-1029', passenger: 'Akash Das', driver: 'Meera Iyer', pickup: 'GMIT College', destination: 'Science City', status: 'completed', fare: 285, distance: 12.1, duration: '33 min', vehicleType: 'car', paymentMethod: 'UPI', date: '2026-09-28T15:05:00' },
]

export const PAYMENTS = [
  { id: 'TX-88231', rideId: 'RX-1041', passenger: 'Priya Sen', amount: 220, method: 'Card', status: 'captured', date: '2026-10-08T18:29:00' },
  { id: 'TX-88230', rideId: 'RX-1040', passenger: 'Akash Das', amount: 320, method: 'UPI', status: 'captured', date: '2026-10-07T15:16:00' },
  { id: 'TX-88229', rideId: 'RX-1038', passenger: 'Nikita Roy', amount: 265, method: 'UPI', status: 'captured', date: '2026-10-06T20:02:00' },
  { id: 'TX-88228', rideId: 'RX-1037', passenger: 'Akash Das', amount: 155, method: 'Cash', status: 'pending', date: '2026-10-05T08:34:00' },
  { id: 'TX-88227', rideId: 'RX-1036', passenger: 'Arjun Mehta', amount: 190, method: 'Card', status: 'captured', date: '2026-10-04T17:11:00' },
  { id: 'TX-88226', rideId: 'RX-1034', passenger: 'Priya Sen', amount: 240, method: 'UPI', status: 'refunded', date: '2026-10-03T10:22:00' },
  { id: 'TX-88225', rideId: 'RX-1033', passenger: 'Akash Das', amount: 120, method: 'Cash', status: 'captured', date: '2026-10-02T17:35:00' },
  { id: 'TX-88224', rideId: 'RX-1032', passenger: 'Sneha Sardar', amount: 175, method: 'UPI', status: 'captured', date: '2026-10-01T11:00:00' },
  { id: 'TX-88223', rideId: 'RX-1031', passenger: 'Nikita Roy', amount: 310, method: 'Card', status: 'failed', date: '2026-09-30T20:48:00' },
  { id: 'TX-88222', rideId: 'RX-1029', passenger: 'Akash Das', amount: 285, method: 'UPI', status: 'captured', date: '2026-09-28T15:41:00' },
]

export const DRIVER_REQUESTS = [
  { id: 'RX-1043', passenger: 'Priya Sen', pickup: 'GMIT College', destination: 'Baruipur Station', distance: 7.4, fare: 150, eta: '18 min' },
  { id: 'RX-1044', passenger: 'Nikita Roy', pickup: 'Salt Lake Sector V', destination: 'Baguiati', distance: 5.2, fare: 118, eta: '14 min' },
  { id: 'RX-1045', passenger: 'Arjun Mehta', pickup: 'Rashbehari Avenue', destination: 'Gariahat', distance: 3.1, fare: 86, eta: '9 min' },
]

export const EARNINGS = {
  today: 850,
  week: 5200,
  month: 18500,
  completedRides: 42,
  bars: [
    { label: 'Mon', value: 640 },
    { label: 'Tue', value: 820 },
    { label: 'Wed', value: 510 },
    { label: 'Thu', value: 940 },
    { label: 'Fri', value: 1120 },
    { label: 'Sat', value: 760 },
    { label: 'Sun', value: 410 },
  ],
  recent: [
    { id: 'RX-1041', date: '2026-10-08', route: 'Salt Lake Sector V → Sector V Metro', fare: 220, earning: 187 },
    { id: 'RX-1037', date: '2026-10-05', route: 'Baruipur Station → GMIT College', fare: 155, earning: 132 },
    { id: 'RX-1033', date: '2026-10-02', route: 'GMIT College → Jadavpur University', fare: 120, earning: 102 },
    { id: 'RX-1031', date: '2026-09-30', route: 'Rashbehari Avenue → Howrah Station', fare: 310, earning: 264 },
    { id: 'RX-1024', date: '2026-09-27', route: 'New Town → Salt Lake City Centre', fare: 190, earning: 162 },
  ],
}

export const ADMIN_STATS = {
  users: { value: 1240, delta: '+3.2%' },
  drivers: { value: 320, delta: '+1.4%' },
  rides: { value: 8450, delta: '+6.8%' },
  revenue: { value: 540000, delta: '-0.9%' },
  activity: [
    { label: 'Mon', value: 180 },
    { label: 'Tue', value: 240 },
    { label: 'Wed', value: 210 },
    { label: 'Thu', value: 320 },
    { label: 'Fri', value: 410 },
    { label: 'Sat', value: 460 },
    { label: 'Sun', value: 300 },
  ],
}

export const PASSENGER_PROFILE = {
  name: 'Akash Das',
  email: 'akash@example.com',
  phone: '+91 98301 11223',
  memberSince: 'Jan 2026',
  totalRides: 34,
  rating: 4.8,
}

export const DRIVER_PROFILE = {
  name: 'Rahul Dey',
  email: 'rahul@example.com',
  phone: '+91 90073 88121',
  memberSince: 'Nov 2025',
  totalRides: 412,
  rating: 4.8,
  vehicle: { type: 'sedan', brand: 'Toyota', model: 'Etios', color: 'White', number: 'KA-01-AB-1234' },
}

export const SAVED_PLACES = [
  { label: 'Home', address: '12B Lake Gardens, Kolkata', lat: 22.5074, lng: 88.3531 },
  { label: 'Work', address: 'GMIT College, Baruipur', lat: 22.389, lng: 88.439 },
]

export const RIDE_FLOW = ['requested', 'accepted', 'driver_arriving', 'driver_arrived', 'started', 'completed']

export const RIDE_STATUS_LABEL = {
  requested: 'Requested',
  accepted: 'Accepted',
  driver_arriving: 'Driver arriving',
  driver_arrived: 'Driver arrived',
  started: 'Ride started',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export function getRideById(id) {
  const ride = RIDES.find((item) => item.id === id)
  if (ride) return ride
  const request = DRIVER_REQUESTS.find((item) => item.id === id)
  if (!request) return null
  return {
    ...request,
    driver: 'Rahul Dey',
    status: 'accepted',
    vehicleType: 'car',
    paymentMethod: 'UPI',
    duration: request.eta,
    date: '2026-10-09T09:40:00',
  }
}

export function getDriverById(id) {
  return DRIVERS.find((driver) => driver.id === id) || null
}

export function getUserById(id) {
  return USERS.find((user) => user.id === id) || null
}
