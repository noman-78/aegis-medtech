import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Incident from './pages/Incident'
import Risk from './pages/Risk'
import Solutions from './pages/Solutions'
import Contact from './pages/Contact'
import UserLogin from './pages/UserLogin'
import UserProfile from './pages/UserProfile'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import PhishingSimulation from "./pages/PhishingSimulation";
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/incident" element={<Incident />} />
        <Route path="/risk" element={<Risk />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/contact" element={<Contact />} />
      <Route path="/phishing-simulation" element={<PhishingSimulation />} /> 
        <Route path="/login" element={<UserLogin />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/*" element={<Dashboard />} />
  
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
