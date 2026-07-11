import { useEffect, useState } from 'react'
import { useAuth } from '../../lib/auth'
import { supabase, type Profile, type Role } from '../../lib/supabase'

export default function UserManagement() {
  const { profile } = useAuth()
  const isAdmin = profile?.role === 'admin'
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    setUsers((data ?? []) as Profile[])
    setLoading(false)
  }

  useEffect(() => {
    if (isAdmin) { load() } else { setLoading(false) }
  }, [isAdmin])

  const setRole = async (u: Profile, role: Role) => {
    setOk(null); setErr(null)
    const { error } = await supabase.from('profiles').update({ role }).eq('id', u.id)
    if (error) { setErr(error.message); return }
    setOk(`${u.email} is now ${role}.`)
    await load()
  }

  if (loading) return <div className="loading"><div className="spinner" /></div>

  return (
    <div className="fade">
      <h1>User Management</h1>
      <p className="sub">Assign RBAC roles to registered accounts. Roles are enforced server-side via RLS.</p>
      {err && <div className="form-error mb-16">{err}</div>}
      {ok && <div className="form-success mb-16">{ok}</div>}
      {!isAdmin ? (
        <div className="callout warn mt-16"><p>User management is restricted to administrators. Your role: {profile?.role}.</p></div>
      ) : (
        <>
          <div className="table-wrap mt-16">
            <table>
              <thead><tr><th>Email</th><th>Role</th><th>Created</th><th>Change role</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 600, fontSize: '.9rem' }}>
                      {u.email}{u.id === profile?.id && <span className="muted" style={{ fontWeight: 400 }}> (you)</span>}
                    </td>
                    <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                    <td className="muted" style={{ fontSize: '.78rem' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="row wrap">
                        {(['admin', 'editor', 'viewer'] as Role[]).map(r => (
                          <button key={r} className="btn btn-sm"
                            disabled={u.role === r || u.id === profile?.id}
                            style={u.role === r ? { background: 'var(--p600)', color: '#fff', border: 'none' } : { background: 'var(--n100)', color: 'var(--n700)', border: 'none' }}
                            onClick={() => setRole(u, r)}>
                            {r}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && <tr><td colSpan={4} className="muted text-center">No registered users yet.</td></tr>}
              </tbody>
            </table>
          </div>
          <p className="muted mt-16" style={{ fontSize: '.85rem' }}>
            You cannot change your own role. <strong>admin</strong>: full access. <strong>editor</strong>: content &amp; inbox. <strong>viewer</strong>: read-only content.
          </p>
        </>
      )}
    </div>
  )
}
