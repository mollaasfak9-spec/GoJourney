import api from './api'

/**
 * Thin, typed-by-convention wrappers around every backend endpoint the UI uses.
 *
 * The axios instance in `./api` already strips nothing (it returns the full
 * backend envelope `{ success, message, data, pagination }`), so these helpers
 * return that envelope directly. Callers read `res.data` and, for lists,
 * `res.pagination`.
 */

export const authApi = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
}

export const usersApi = {
  me: () => api.get('/users/me'),
  updateMe: (payload) => api.patch('/users/me', payload),
  changePassword: (payload) => api.patch('/users/me/password', payload),
  deactivate: () => api.delete('/users/me'),
}

export const ridesApi = {
  fareEstimate: (payload) => api.post('/rides/fare-estimate', payload),
  create: (payload) => api.post('/rides', payload),
  history: (params) => api.get('/rides/history', { params }),
  active: () => api.get('/rides/active'),
  get: (rideId) => api.get(`/rides/${rideId}`),
  cancel: (rideId, payload) => api.patch(`/rides/${rideId}/cancel`, payload),
  rating: (rideId) => api.get(`/rides/${rideId}/rating`),
  rate: (rideId, payload) => api.post(`/rides/${rideId}/rating`, payload),
  accept: (rideId) => api.patch(`/rides/${rideId}/accept`),
  reject: (rideId, payload) => api.patch(`/rides/${rideId}/reject`, payload),
  arriving: (rideId) => api.patch(`/rides/${rideId}/arriving`),
  arrived: (rideId) => api.patch(`/rides/${rideId}/arrived`),
  start: (rideId) => api.patch(`/rides/${rideId}/start`),
  complete: (rideId) => api.patch(`/rides/${rideId}/complete`),
}

export const driversApi = {
  me: () => api.get('/drivers/me'),
  updateMe: (payload) => api.patch('/drivers/me', payload),
  updateStatus: (payload) => api.patch('/drivers/me/status', payload),
  updateLocation: (payload) => api.patch('/drivers/me/location', payload),
  rideRequests: (params) => api.get('/drivers/me/ride-requests', { params }),
  rides: (params) => api.get('/drivers/me/rides', { params }),
  earnings: () => api.get('/drivers/me/earnings'),
  vehicles: () => api.get('/drivers/me/vehicles'),
  addVehicle: (payload) => api.post('/drivers/me/vehicles', payload),
  updateVehicle: (vehicleId, payload) => api.patch(`/drivers/me/vehicles/${vehicleId}`, payload),
  removeVehicle: (vehicleId) => api.delete(`/drivers/me/vehicles/${vehicleId}`),
}

export const mapsApi = {
  geocode: (q, params = {}) => api.get('/maps/geocode', { params: { q, ...params } }),
  reverse: (lat, lng) => api.get('/maps/reverse', { params: { lat, lng } }),
  route: (payload) => api.post('/maps/route', payload),
}

export const paymentsApi = {
  history: (params) => api.get('/payments/history', { params }),
  byRide: (rideId) => api.get(`/payments/ride/${rideId}`),
  pay: (rideId, payload) => api.post(`/payments/${rideId}`, payload),
  get: (paymentId) => api.get(`/payments/${paymentId}`),
}

export const adminApi = {
  dashboard: () => api.get('/admin/dashboard'),
  users: (params) => api.get('/admin/users', { params }),
  user: (userId) => api.get(`/admin/users/${userId}`),
  updateUserStatus: (userId, payload) => api.patch(`/admin/users/${userId}/status`, payload),
  drivers: (params) => api.get('/admin/drivers', { params }),
  driver: (driverId) => api.get(`/admin/drivers/${driverId}`),
  verifyDriver: (driverId, payload) => api.patch(`/admin/drivers/${driverId}/verify`, payload),
  updateDriverStatus: (driverId, payload) => api.patch(`/admin/drivers/${driverId}/status`, payload),
  rides: (params) => api.get('/admin/rides', { params }),
  ride: (rideId) => api.get(`/admin/rides/${rideId}`),
  payments: (params) => api.get('/admin/payments', { params }),
}

/**
 * Normalizes different backend "list" response shapes into `{ items, pagination }`.
 */
export function unwrapList(res, pick = (data) => data) {
  const data = res?.data
  const items = Array.isArray(data) ? data : pick(data) || []
  return { items, pagination: res?.pagination || null }
}
