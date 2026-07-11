import { useEffect, useState } from 'react'
import { useAuth } from '../../lib/auth'
import { supabase, type ContactSubmission } from '../../lib/supabase'

export default function InboxPage() {
  const { profile } = useAuth()
  const canView = profile?.role === 'admin' || profile?.role === 'editor'
  const [items, setItems] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [selected, setSelected] = useState<ContactSubmission | null>(null)

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false })
    if (error) setErr(error.message)
    else setItems(data as ContactSubmission[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const setStatus = async (item: ContactSubmission, status: ContactSubmission['status']) => {
    const { error } = await supabase.from('contact_submissions').update({ status }).eq('id', item.id)
    if (error) { setErr(error.message); return }
    await load()
    if (selected?.id === item.id) setSelected(s => s ? { ...s, status } : s)
  }

  const remove = async (item: ContactSubmission) => {
    if (!confirm('Delete this submission permanently?')) return
    const { error } = await supabase.from('contact_submissions').delete().eq('id', item.id)
    if (error) { setErr(error.message); return }
    if (selected?.id === item.id) setSelected(null)
    await load()
  }

  if (loading) return <div className="loading"><div className="spinner" /></div>

  return (
    <div className="fade">
      <h1>Contact Submissions</h1>
      <p className="sub">Messages submitted via the public contact form.</p>
      {err && <div className="form-error mb-16">{err}</div>}
      {!canView ? (
        <div className="callout warn mt-16"><p>Your role ({profile?.role}) does not permit viewing contact submissions.</p></div>
      ) : items.length === 0 ? (
        <div className="card mt-16"><p className="muted">No submissions yet.</p></div>
      ) : (
        <div className="grid g2" style={{ alignItems: 'start' }}>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Status</th><th>Name</th><th>Subject</th><th>Date</th></tr></thead>
              <tbody>
                {items.map(i => (
                  <tr key={i.id} onClick={() => { setSelected(i); if (i.status === 'new') setStatus(i, 'read') }}
                    style={{ cursor: 'pointer', background: selected?.id === i.id ? 'var(--p100)' : undefined }}>
                    <td><span className={`badge badge-${i.status}`}>{i.status}</span></td>
                    <td style={{ fontWeight: 600, fontSize: '.88rem' }}>{i.name}</td>
                    <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '.85rem' }}>{i.subject}</td>
                    <td className="muted" style={{ fontSize: '.78rem' }}>{new Date(i.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            {selected ? (
              <div className="card">
                <div className="row-between mb-12">
                  <span className={`badge badge-${selected.status}`}>{selected.status}</span>
                  <span className="muted" style={{ fontSize: '.78rem' }}>{new Date(selected.created_at).toLocaleString()}</span>
                </div>
                <h3 style={{ marginBottom: 4 }}>{selected.subject}</h3>
                <p className="muted" style={{ fontSize: '.85rem', marginBottom: 12 }}>
                  {selected.name} &lt;{selected.email}&gt;{selected.organization ? ` · ${selected.organization}` : ''}
                </p>
                <div style={{ background: 'var(--n50)', padding: 14, borderRadius: 'var(--r)', whiteSpace: 'pre-wrap', fontSize: '.9rem', color: 'var(--n700)' }}>
                  {selected.message}
                </div>
                <div className="row mt-16 wrap">
                  <button className="btn btn-secondary btn-sm" onClick={() => setStatus(selected, 'new')}>New</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => setStatus(selected, 'read')}>Read</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => setStatus(selected, 'archived')}>Archive</button>
                  <button className="btn btn-ghost btn-sm" style={{ color: 'var(--r600)' }} onClick={() => remove(selected)}>Delete</button>
                </div>
              </div>
            ) : (
              <div className="card"><p className="muted">Select a submission to view details.</p></div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
