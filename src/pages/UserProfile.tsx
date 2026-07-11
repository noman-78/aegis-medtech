import { useState, type FormEvent, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { User, ShieldCheck, LogOut, Check } from '../components/icons'
import { useUserAuth } from '../lib/userAuth'
import { supabase } from '../lib/supabase'
import { sanitizeText, validateName } from '../lib/validation'

export default function UserProfile() {
  const { session, userProfile, loading, signOut, refreshProfile } = useUserAuth()
  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [nameErr, setNameErr] = useState<string | null>(null)
  const [bioErr, setBioErr] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.full_name ?? '')
      setBio(userProfile.bio ?? '')
    }
  }, [userProfile])

  if (loading) return <div className="loading"><div className="spinner" /></div>
  if (!session) return <Navigate to="/login" replace />

  const startEdit = () => { setSaved(false); setEditing(true) }

  const cancelEdit = () => {
    setEditing(false)
    setFullName(userProfile?.full_name ?? '')
    setBio(userProfile?.bio ?? '')
    setNameErr(null); setBioErr(null)
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setNameErr(null); setBioErr(null)
    const nr = validateName(fullName); if (!nr.valid) { setNameErr(nr.error!); return }
    if (bio.length > 500) { setBioErr('Bio must be 500 characters or fewer.'); return }

    setSaving(true)
    try {
      const { error } = await supabase.from('user_profiles').update({
        full_name: sanitizeText(fullName),
        bio: bio ? sanitizeText(bio) : null,
        updated_at: new Date().toISOString(),
      }).eq('id', session.user.id)
      if (error) throw error
      await refreshProfile()
      setEditing(false)
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  const initials = (userProfile?.full_name ?? userProfile?.email ?? 'U')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="fade" style={{ minHeight: 'calc(100vh - 64px)', background: 'var(--n100)', padding: '48px 24px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div className="card mb-24" style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--p600), var(--a600))',
            display: 'grid', placeItems: 'center', color: '#fff',
            fontWeight: 800, fontSize: '1.4rem', letterSpacing: '.02em',
          }}>{initials}</div>
          <div style={{ flex: 1 }}>
            <h2 style={{ marginBottom: 4 }}>{userProfile?.full_name ?? 'Welcome!'}</h2>
            <p className="muted" style={{ fontSize: '.88rem', margin: 0 }}>{userProfile?.email}</p>
            <p className="muted" style={{ fontSize: '.78rem', margin: '4px 0 0' }}>
              Member since {new Date(userProfile?.created_at ?? '').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {!editing && (
              <button className="btn btn-secondary btn-sm" onClick={startEdit}>
                Edit profile
              </button>
            )}
            <button className="btn btn-ghost btn-sm" onClick={signOut} style={{ color: 'var(--r600)' }}>
              <LogOut width={14} height={14} /> Sign out
            </button>
          </div>
        </div>

        {saved && (
          <div className="form-success mb-16">
            <div className="row"><Check width={15} height={15} /> Profile updated successfully.</div>
          </div>
        )}

        {editing ? (
          <div className="card mb-24">
            <h3 style={{ marginBottom: 18 }}>Edit Profile</h3>
            <form onSubmit={handleSave} noValidate>
              <div className="field">
                <label htmlFor="pFullName">Full name</label>
                <input
                  id="pFullName" type="text"
                  className={`input${nameErr ? ' err' : ''}`}
                  value={fullName}
                  onChange={e => { setFullName(e.target.value); setNameErr(null) }}
                  maxLength={120} autoComplete="name"
                />
                {nameErr && <div className="ferr">{nameErr}</div>}
              </div>
              <div className="field">
                <label htmlFor="pBio">Bio <span className="muted">(optional)</span></label>
                <textarea
                  id="pBio"
                  className={`textarea${bioErr ? ' err' : ''}`}
                  value={bio}
                  onChange={e => { setBio(e.target.value); setBioErr(null) }}
                  maxLength={500} style={{ minHeight: 100 }}
                  placeholder="Tell us a bit about yourself..."
                />
                <div className="hint">{bio.length} / 500</div>
                {bioErr && <div className="ferr">{bioErr}</div>}
              </div>
              <div className="row">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <><span className="spinner" /> Saving…</> : 'Save changes'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={cancelEdit}>Cancel</button>
              </div>
            </form>
          </div>
        ) : (
          <div className="card mb-24">
            <div className="row mb-16">
              <div className="card-icon" style={{ marginBottom: 0 }}><User /></div>
              <h3 style={{ margin: 0 }}>Your Profile</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <span className="muted" style={{ fontSize: '.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em' }}>Full name</span>
                <p style={{ margin: '4px 0 0', fontWeight: 500 }}>{userProfile?.full_name ?? <span className="muted">Not set</span>}</p>
              </div>
              <div>
                <span className="muted" style={{ fontSize: '.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em' }}>Email</span>
                <p style={{ margin: '4px 0 0' }}>{userProfile?.email}</p>
              </div>
              {userProfile?.bio && (
                <div>
                  <span className="muted" style={{ fontSize: '.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em' }}>Bio</span>
                  <p style={{ margin: '4px 0 0' }}>{userProfile.bio}</p>
                </div>
              )}
              <div>
                <span className="muted" style={{ fontSize: '.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em' }}>Last updated</span>
                <p style={{ margin: '4px 0 0', fontSize: '.88rem', color: 'var(--n500)' }}>{new Date(userProfile?.updated_at ?? '').toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        <div className="card" style={{ border: '1px solid var(--n200)' }}>
          <div className="row mb-12">
            <div className="card-icon" style={{ marginBottom: 0, background: '#dcfce7', color: 'var(--g600)' }}><ShieldCheck /></div>
            <h3 style={{ margin: 0 }}>Account security</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              'Password stored as bcrypt hash (cost 12) — never in plain text',
              'Session secured with JWT — auto-refreshed, expires on sign-out',
              'Profile data protected by Row Level Security — only you can read or edit it',
              'All traffic encrypted via HTTPS / TLS 1.3',
            ].map(item => (
              <div key={item} style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--g600)', flexShrink: 0, marginTop: 3 }}><Check width={14} height={14} /></span>
                <span style={{ fontSize: '.88rem', color: 'var(--n700)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
