import { Link } from 'react-router-dom'
import { Shield } from '../components/icons'

export default function NotFound() {
  return (
    <div className="auth-wrap">
      <div className="auth-card text-center">
        <span className="brand-mark" style={{ margin: '0 auto 20px' }}><Shield width={22} height={22} /></span>
        <h1 style={{ fontSize: '2.5rem', marginBottom: 8 }}>404</h1>
        <p className="auth-sub">Page not found or you lack permission to view it.</p>
        <Link to="/" className="btn btn-primary">Return home</Link>
      </div>
    </div>
  )
}
