import { useState } from 'react'
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom'
import { Shield, Menu, LogOut, Lock, User } from './icons'
import { useAuth } from '../lib/auth'
import { useUserAuth } from '../lib/userAuth'

const navLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/incident', label: 'Incident' },
  { to: '/risk', label: 'Risk Assessment' },
  { to: '/solutions', label: 'Solutions' },
  { to: '/contact', label: 'Contact' },
]

export default function Layout() {
  const [open, setOpen] = useState(false)
  const { session: adminSession, signOut: adminSignOut } = useAuth()
  const { session: userSession, userProfile, signOut: userSignOut } = useUserAuth()
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login'

  if (isAdmin) return <Outlet />

  const close = () => setOpen(false)

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand" onClick={close}>
            <span className="brand-mark"><Shield width={17} height={17} /></span>
            Aegis MedTech
          </Link>
          <button className="nav-toggle" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(v => !v)}>
            <Menu width={22} height={22} />
          </button>
          <nav className={`nav${open ? ' open' : ''}`}>
            {navLinks.map(l => (
              <NavLink key={l.to} to={l.to} end={l.end} onClick={close}
                className={({ isActive }) => isActive ? 'active' : ''}>
                {l.label}
              </NavLink>
            ))}

            <div className="nav-divider" />

            {adminSession ? (
              <>
                <NavLink to="/admin" onClick={close} className="btn btn-ghost btn-sm">
                  <Lock width={14} height={14} /> Admin Dashboard
                </NavLink>
                <button className="btn btn-ghost btn-sm" onClick={() => { adminSignOut(); close() }}
                  style={{ color: 'var(--n600)' }}>
                  <LogOut width={14} height={14} /> Admin out
                </button>
              </>
            ) : userSession ? (
              <>
                <NavLink to="/profile" onClick={close}
                  className={({ isActive }) => `btn btn-ghost btn-sm${isActive ? ' active' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--p600)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '.7rem', fontWeight: 700, flexShrink: 0 }}>
                    {(userProfile?.full_name ?? userProfile?.email ?? 'U')[0].toUpperCase()}
                  </span>
                  {userProfile?.full_name?.split(' ')[0] ?? 'Profile'}
                </NavLink>
                <button className="btn btn-ghost btn-sm" onClick={() => { userSignOut(); close() }}
                  style={{ color: 'var(--n600)' }}>
                  <LogOut width={14} height={14} /> Sign out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" onClick={close}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <User width={14} height={14} /> User Login
                </NavLink>
                <NavLink to="/admin/login" onClick={close}
                  className="btn btn-primary btn-sm" style={{ marginLeft: 4 }}>
                  <Lock width={14} height={14} /> Admin Login
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </header>

      <main><Outlet /></main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="brand" style={{ color: '#fff', marginBottom: 12 }}>
                <span className="brand-mark"><Shield width={17} height={17} /></span>
                Aegis MedTech Systems
              </div>
              <p style={{ color: 'var(--n400)', maxWidth: 340, fontSize: '.88rem' }}>
                Secure healthcare technology infrastructure. An academic cybersecurity project
                demonstrating defense-in-depth security architecture.
              </p>
            </div>
            <div>
              <h4>Company</h4>
              <div className="footer-links">
                <Link to="/about">About Us</Link>
                <Link to="/incident">Security Incident</Link>
                <Link to="/risk">Risk Assessment</Link>
              </div>
            </div>
            <div>
              <h4>Account</h4>
              <div className="footer-links">
                <Link to="/login">User Login</Link>
                <Link to="/solutions">Security Solutions</Link>
                <Link to="/contact">Contact</Link>
                <Link to="/admin/login">Admin Login</Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Aegis MedTech Systems — Academic Cybersecurity Project</span>
            <span className="mono">Fictional entity · Educational use only</span>
          </div>
        </div>
      </footer>
    </>
  )
}
