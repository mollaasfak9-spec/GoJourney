import axios from 'axios'
import { getToken, clearToken } from './token'

/**
 * Shared axios instance.
 *
 * - baseURL comes from VITE_API_URL (defaults to `/api`, proxied to the
 *   backend in dev via vite.config.js)
 * - withCredentials keeps the httpOnly `ridex_token` cookie flow working
 * - a Bearer token from localStorage is attached when present
 * - responses are unwrapped to the backend envelope `{ success, message, data, pagination }`
 * - errors are normalized to Error-like objects with `status`, `code` and `details`
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  timeout: 20000,
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

function toError(payload, status) {
  const error = new Error(payload?.message || 'Something went wrong. Please try again.')
  error.status = status
  error.code = payload?.error?.code
  error.details = payload?.error?.details
  return error
}

api.interceptors.response.use(
  (response) => {
    // Unwrap the standard backend envelope
    const body = response.data
    if (body && typeof body === 'object' && 'success' in body) {
      return { ...body, ...(body.pagination ? { pagination: body.pagination } : {}) }
    }
    return body
  },
  (error) => {
    const status = error.response?.status
    const payload = error.response?.data

    // A 401 while we sent a token means the session is gone – clear it and
    // let AuthContext react to the event.
    if (status === 401 && error.config?.headers?.Authorization) {
      clearToken()
      window.dispatchEvent(new CustomEvent('auth:expired'))
    }

    return Promise.reject(toError(payload, status))
  },
)

export default api