import { Routes, Route } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import Home from '../pages/public/Home'
import About from '../pages/public/About'
import Contact from '../pages/public/Contact'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}