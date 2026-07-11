import { useEffect, useState } from 'react'
import { useAuth } from '../../lib/auth'
import { supabase, type ContentPage } from '../../lib/supabase'
import { validateSlug, sanitizeText } from '../../lib/validation'

export default function ContentManager() {
  const { profile } = useAuth()
  const canEdit = profile?.role === 'admin' || profile?.role === 'editor'
  const [pages, setPages] = useState<ContentPage[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [editing, setEditing] = useState<ContentPage | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [draft, setDraft] = useState({ slug: '', title: '', body: '' })
  const [ferrs, setFerrs] = useState<{ slug?: string; title?: string; body?: string }>({})
  const [saving, setSaving] = useState(false)
  const [ok, setOk] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('content_pages').select('*').order('slug')
    if (error) setErr(error.message)
    else setPages(data as ContentPage[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const startEdit = (p: ContentPage) => {
    setEditing(p); setDraft({ slug: p.slug, title: p.title, body: p.body })
    setFerrs({}); setOk(null); setShowForm(true)
  }

  const startNew = () => {
    setEditing(null); setDraft({ slug: '', title: '', body: '' })
    setFerrs({}); setOk(null); setShowForm(true)
  }

  const cancel = () => { setShowForm(false); setEditing(null); setDraft({ slug: '', title: '', body: '' }) }

  const save = async () => {
    setOk(null)
    const e: typeof ferrs = {}
    const sr = validateSlug(draft.slug); if (!sr.valid) e.slug = sr.error
    if (!draft.title.trim()) e.title = 'Title is required.'
    if (!draft.body.trim()) e.body = 'Body is required.'
    setFerrs(e)
    if (Object.keys(e).length) return
    setSaving(true)
    const payload = {
      slug: sanitizeText(draft.slug).toLowerCase(),
      title: sanitizeText(draft.title),
      body: sanitizeText(draft.body),
      updated_by: profile?.id,
      updated_at: new Date().toISOString(),
    }
    try {
      if (editing) {
        const { error } = await supabase.from('content_pages').update(payload).eq('id', editing.id)
        if (error) throw error
        setOk('Page updated.')
      } else {
        const { error } = await supabase.from('content_pages').insert(payload)
        if (error) throw error
        setOk('Page created.')
      }
      await load(); cancel()
    } catch (ex) { setErr(ex instanceof Error ? ex.message : 'Save failed.') }
    finally { setSaving(false) }
  }

  const remove = async (p: ContentPage) => {
    if (!confirm(`Delete "${p.slug}"? This cannot be undone.`)) return
    const { error } = await supabase.from('content_pages').delete().eq('id', p.id)
    if (error) { setErr(error.message); return }
    await load(); setOk(`Deleted "${p.slug}".`)
  }

  if (loading) return <div className="loading"><div className="spinner" /></div>

  return (
    <div className="fade">
      <div className="row-between mb-24">
        <div><h1>Content Management</h1><p className="sub">Edit the public-facing pages. All changes are logged.</p></div>
        {canEdit && !showForm && <button className="btn btn-primary" onClick={startNew}>+ New page</button>}
      </div>

      {err && <div className="form-error mb-16">{err} <button className="btn btn-ghost btn-sm" onClick={() => setErr(null)}>Dismiss</button></div>}
      {ok && <div className="form-success mb-16">{ok}</div>}

      {showForm && (
        <div className="card mb-24">
          <h3 style={{ marginBottom: 16 }}>{editing ? `Edit: ${editing.slug}` : 'New page'}</h3>
          <div className="field">
            <label>Slug</label>
            <input className={`input${ferrs.slug ? ' err' : ''}`} value={draft.slug} onChange={e => setDraft(d => ({ ...d, slug: e.target.value }))} disabled={!!editing} placeholder="e.g. privacy-policy" />
            {ferrs.slug ? <div className="ferr">{ferrs.slug}</div> : <div className="hint">Lowercase, hyphenated. Used in the URL.</div>}
          </div>
          <div className="field">
            <label>Title</label>
            <input className={`input${ferrs.title ? ' err' : ''}`} value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))} maxLength={200} />
            {ferrs.title && <div className="ferr">{ferrs.title}</div>}
          </div>
          <div className="field">
            <label>Body</label>
            <textarea className={`textarea${ferrs.body ? ' err' : ''}`} value={draft.body} onChange={e => setDraft(d => ({ ...d, body: e.target.value }))} maxLength={10000} style={{ minHeight: 200 }} />
            {ferrs.body && <div className="ferr">{ferrs.body}</div>}
          </div>
          <div className="row">
            <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? <><span className="spinner" /> Saving…</> : 'Save'}</button>
            <button className="btn btn-ghost" onClick={cancel}>Cancel</button>
          </div>
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead><tr><th>Slug</th><th>Title</th><th>Last updated</th><th>Actions</th></tr></thead>
          <tbody>
            {pages.map(p => (
              <tr key={p.id}>
                <td className="mono" style={{ fontWeight: 600 }}>{p.slug}</td>
                <td>{p.title}</td>
                <td className="muted" style={{ fontSize: '.82rem' }}>{new Date(p.updated_at).toLocaleString()}</td>
                <td>
                  <div className="row">
                    {canEdit && <button className="btn btn-secondary btn-sm" onClick={() => startEdit(p)}>Edit</button>}
                    {canEdit && <button className="btn btn-ghost btn-sm" style={{ color: 'var(--r600)' }} onClick={() => remove(p)}>Delete</button>}
                    {!canEdit && <span className="muted" style={{ fontSize: '.82rem' }}>View only</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!canEdit && <p className="muted mt-16" style={{ fontSize: '.88rem' }}>Your role ({profile?.role}) allows viewing content but not editing.</p>}
    </div>
  )
}
