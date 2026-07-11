import { useEffect, useState } from 'react'
import { NavLink, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { Shield, LayoutDash, FileText, Inbox, Scroll, Users, LogOut } from '../components/icons'
import ContentManager from './dashboard/ContentManager'
import InboxPage from './dashboard/Inbox'
import AuditLog from './dashboard/AuditLog'
import UserManagement from './dashboard/UserManagement'

export default function Dashboard() {
  const { session, profile, loading, signOut, role } = useAuth()
  const navigate = useNavigate()
  const [counts, setCounts] = useState<{ content: number; submissions: number; newSubs: number } | null>(null)

  useEffect(() => {
    if (session?.user && profile) {
      supabase.from('audit_log').insert({
        actor_id: session.user.id,
        action: 'admin.view',
        detail: `${profile.email} viewed dashboard`,
      })
    }
  }, [session?.user?.id, profile?.id])

  useEffect(() => {
    if (!session) return
    ;(async () => {
      const [r1, r2, r3] = await Promise.all([
        supabase.from('content_pages').select('*', { count: 'exact', head: true }),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('status', 'new'),
      ])
      setCounts({ content: r1.count ?? 0, submissions: r2.count ?? 0, newSubs: r3.count ?? 0 })
    })()
  }, [session])

  if (loading) return <div className="loading"><div className="spinner" /></div>
  if (!session) return <Navigate to="/admin/login" replace />

  const navItems = [
    { to: '/admin', label: 'Overview', icon: LayoutDash, end: true, show: true },
    { to: '/admin/content', label: 'Content', icon: FileText, end: false, show: true },
    { to: '/admin/inbox', label: 'Inbox', icon: Inbox, end: false, show: role === 'admin' || role === 'editor' },
    { to: '/admin/audit', label: 'Audit Log', icon: Scroll, end: false, show: role === 'admin' },
    { to: '/admin/users', label: 'Users', icon: Users, end: false, show: role === 'admin' },
  ]

  return (
    <div className="dash">
      <aside className="dash-side">
        <Link to="/" className="side-brand">
          <span className="brand-mark"><Shield width={16} height={16} /></span>
          Aegis
        </Link>
        <div className="side-label">Admin Dashboard</div>
        <nav>
          {navItems.filter(n => n.show).map(n => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => isActive ? 'active' : ''}>
              <n.icon width={16} height={16} /> {n.label}
            </NavLink>
          ))}
        </nav>
        <div style={{ marginTop: 'auto', padding: '16px 0 0' }}>
          <div style={{ padding: '0 12px', marginBottom: 8 }}>
            <div style={{ fontSize: '.82rem', color: 'var(--n300)' }}>{profile?.email}</div>
            <span className={`badge badge-${profile?.role}`} style={{ marginTop: 4 }}>{profile?.role}</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={async () => { await signOut(); navigate('/admin/login', { replace: true }) }}
            style={{ color: 'var(--n400)', width: '100%', justifyContent: 'flex-start', padding: '8px 12px' }}>
            <LogOut width={15} height={15} /> Sign out
          </button>
        </div>
      </aside>

      <main className="dash-main">
        <Routes>
          <Route index element={<Overview counts={counts} />} />
          <Route path="content" element={<ContentManager />} />
          <Route path="inbox" element={<InboxPage />} />
          <Route path="audit" element={<AuditLog />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  )
}

function Overview({ counts }: { counts: { content: number; submissions: number; newSubs: number } | null }) {
  const { profile, role } = useAuth()
  return (
    <div className="fade">
      <h1>Welcome back, {profile?.email?.split('@')[0]}</h1>
      <p className="sub">Signed in as <span className={`badge badge-${role}`}>{role}</span>. Sessions expire automatically after inactivity.</p>

      <div className="grid g3 mt-24">
        {[
          { label: 'Content pages', value: counts?.content ?? '—', icon: FileText, to: '/admin/content' },
          { label: 'Total submissions', value: counts?.submissions ?? '—', icon: Inbox, to: '/admin/inbox' },
          { label: 'New messages', value: counts?.newSubs ?? '—', icon: Inbox, to: '/admin/inbox' },
        ].map(c => (
          <Link to={c.to} key={c.label} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card-icon"><c.icon /></div>
            <div className="stat"><span className="stat-num">{c.value}</span><span className="stat-label">{c.label}</span></div>
          </Link>
        ))}
      </div>

      <div className="card mt-24">
        <h3 style={{ marginBottom: 14 }}>Security posture</h3>
        <div className="grid g2">
          <div><p className="muted mb-8" style={{ fontSize: '.85rem' }}>Active session</p><div className="row"><span className="badge badge-low">Authenticated</span><span className="mono muted" style={{ fontSize: '.78rem' }}>Auto-refresh enabled</span></div></div>
          <div><p className="muted mb-8" style={{ fontSize: '.85rem' }}>Access control</p><div className="row"><span className={`badge badge-${role}`}>RBAC: {role}</span><span className="muted" style={{ fontSize: '.78rem' }}>enforced via RLS</span></div></div>
        </div>
      </div>

      <div className="callout mt-24">
        <p><strong>Security note:</strong> All actions are governed by row-level security policies enforced in the database. Even if the UI shows a control, the server rejects any operation your role is not permitted to perform.</p>
      </div>
    </div>
  )
}
