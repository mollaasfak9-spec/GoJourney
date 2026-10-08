import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import PassengerLayout from '../layouts/PassengerLayout'
import DriverLayout from '../layouts/DriverLayout'
import AdminLayout from '../layouts/AdminLayout'
import { AuthProvider } from '../context/AuthContext'
import { roleHome, useAuth } from '../context/auth'
import { ToastProvider } from '../context/ToastContext'

import Home from '../pages/public/Home'
import About from '../pages/public/About'
import Contact from '../pages/public/Contact'
import NotFound from '../pages/public/NotFound'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'

import PassengerDashboard from '../pages/passenger/Dashboard'
import BookRide from '../pages/passenger/BookRide'
import PassengerRideHistory from '../pages/passenger/RideHistory'
import RideTracking from '../pages/passenger/RideTracking'
import PassengerProfile from '../pages/passenger/Profile'

import DriverDashboard from '../pages/driver/Dashboard'
import RideRequests from '../pages/driver/RideRequests'
import ActiveRide from '../pages/driver/ActiveRide'
import Earnings from '../pages/driver/Earnings'
import DriverRideHistory from '../pages/driver/RideHistory'
import Vehicle from '../pages/driver/Vehicle'
import DriverProfile from '../pages/driver/Profile'

import AdminDashboard from '../pages/admin/Dashboard'
import Users from '../pages/admin/Users'
import UserDetails from '../pages/admin/UserDetails'
import Drivers from '../pages/admin/Drivers'
import DriverDetails from '../pages/admin/DriverDetails'
import Rides from '../pages/admin/Rides'
import RideDetails from '../pages/admin/RideDetails'
import Payments from '../pages/admin/Payments'

function Protected({ roles }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  if (roles && !roles.includes(user.role)) return <Navigate to={roleHome(user.role)} replace />
  return <Outlet />
}

export default function AppRoutes() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<Protected roles={['passenger']} />}>
            <Route element={<PassengerLayout />}>
              <Route path="/passenger" element={<PassengerDashboard />} />
              <Route path="/passenger/book" element={<BookRide />} />
              <Route path="/passenger/rides" element={<PassengerRideHistory />} />
              <Route path="/passenger/rides/:rideId" element={<RideTracking />} />
              <Route path="/passenger/profile" element={<PassengerProfile />} />
            </Route>
          </Route>

          <Route element={<Protected roles={['driver']} />}>
            <Route element={<DriverLayout />}>
              <Route path="/driver" element={<DriverDashboard />} />
              <Route path="/driver/rides" element={<RideRequests />} />
              <Route path="/driver/rides/history" element={<DriverRideHistory />} />
              <Route path="/driver/rides/:rideId" element={<ActiveRide />} />
              <Route path="/driver/earnings" element={<Earnings />} />
              <Route path="/driver/vehicle" element={<Vehicle />} />
              <Route path="/driver/profile" element={<DriverProfile />} />
            </Route>
          </Route>

          <Route element={<Protected roles={['admin']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/users/:id" element={<UserDetails />} />
              <Route path="/admin/drivers" element={<Drivers />} />
              <Route path="/admin/drivers/:id" element={<DriverDetails />} />
              <Route path="/admin/rides" element={<Rides />} />
              <Route path="/admin/rides/:id" element={<RideDetails />} />
              <Route path="/admin/payments" element={<Payments />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  )
}
