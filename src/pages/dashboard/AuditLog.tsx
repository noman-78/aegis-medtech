import { useEffect, useState } from 'react'
import { useAuth } from '../../lib/auth'
import { supabase, type AuditLogEntry } from '../../lib/supabase'

export default function AuditLog() {
  const { profile } = useAuth()
  const isAdmin = profile?.role === 'admin'
  const [entries, setEntries] = useState<AuditLogEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAdmin) { setLoading(false); return }
    ;(async () => {
      const { data } = await supabase.from('audit_log').select('*').order('created_at', { ascending: false }).limit(200)
      setEntries((data ?? []) as AuditLogEntry[])
      setLoading(false)
    })()
  }, [isAdmin])

  if (loading) return <div className="loading"><div className="spinner" /></div>

  return (
    <div className="fade">
      <h1>Audit Log</h1>
      <p className="sub">Security-relevant events: logins, content changes, and contact submissions.</p>
      {!isAdmin ? (
        <div className="callout warn mt-16"><p>Audit log is restricted to administrators. Your role: {profile?.role}.</p></div>
      ) : (
        <div className="table-wrap mt-16">
          <table>
            <thead><tr><th>Timestamp</th><th>Action</th><th>Detail</th><th>Actor</th></tr></thead>
            <tbody>
              {entries.map(e => (
                <tr key={e.id}>
                  <td className="mono" style={{ fontSize: '.78rem', whiteSpace: 'nowrap' }}>{new Date(e.created_at).toLocaleString()}</td>
                  <td><span className="mono" style={{ fontWeight: 600, fontSize: '.82rem' }}>{e.action}</span></td>
                  <td style={{ fontSize: '.85rem' }}>{e.detail ?? '—'}</td>
                  <td className="mono muted" style={{ fontSize: '.76rem' }}>{e.actor_id ? e.actor_id.slice(0, 8) + '…' : 'anon'}</td>
                </tr>
              ))}
              {entries.length === 0 && <tr><td colSpan={4} className="muted text-center">No audit events yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
