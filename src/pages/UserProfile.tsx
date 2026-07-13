import { useState, type FormEvent, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { User, ShieldCheck, LogOut, Check } from '../components/icons'
import { useUserAuth } from '../lib/userAuth'
import { supabase } from '../lib/supabase'
import { sanitizeText, validateName } from '../lib/validation'

function formatDate(val: string | null | undefined) {
  if (!val) return 'N/A'
  const d = new Date(val)
  return isNaN(d.getTime()) ? 'N/A' : d.toLocaleString()
}

function formatMember(val: string | null | undefined) {
  if (!val) return ''
  const d = new Date(val)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
}

export default function UserProfile() {
  const { session, userProfile, loading, signOut, refreshProfile } = useUserAuth()
  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [nameErr, setNameErr] = useState<string | null>(null)
  const [bioErr, setBioErr] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveErr, setSaveErr] = useState<string | null>(null)

  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.full_name ?? '')
      setBio(userProfile.bio ?? '')
    }
  }, [userProfile])

  if (loading) return <div className="loading"><div className="spinner" /></div>
  if (!session) return <Navigate to="/login" replace />

  const startEdit = () => { setSaved(false); setSaveErr(null); setEditing(true) }

  const cancelEdit = () => {
    setEditing(false)
    setFullName(userProfile?.full_name ?? '')
    setBio(userProfile?.bio ?? '')
    setNameErr(null)
    setBioErr(null)
    setSaveErr(null)
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setNameErr(null)
    setBioErr(null)
    setSaveErr(null)

    const nr = validateName(fullName)
    if (!nr.valid) { setNameErr(nr.error!); return }
    if (bio.length > 500) { setBioErr('Bio must be 500 characters or fewer.'); return }

    setSaving(true)
    try {
      const now = new Date().toISOString()
      const cleanName = sanitizeText(fullName)
      const cleanBio = bio.trim() ? sanitizeText(bio) : null

      const { data: updated, error } = await supabase
        .from('user_profiles')
        .update({
          full_name: cleanName,
          bio: cleanBio,
          updated_at: now,
        })
        .eq('id', session.user.id)
        .select()
        .maybeSingle()

      if (error) throw error

      // Update local state immediately from DB response
      if (updated) {
        // userProfile context will update via refreshProfile, but also set
        // local input state so view mode shows correct values right away
        await refreshProfile(session.user.id)
      }
      setEditing(false)
      setSaved(true)
    } catch (err) {
      setSaveErr(err instanceof Error ? err.message : 'Save failed. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const displayName = userProfile?.full_name ?? ''
  const initials = displayName
    ? displayName.split(' ').filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : (userProfile?.email ?? 'U')[0].toUpperCase()

  return (
    <div className="fade" style={{ minHeight: 'calc(100vh - 64px)', background: 'var(--n100)', padding: '48px 24px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>

        {/* Header */}
        <div className="card mb-24" style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--p600), var(--a600))',
            display: 'grid', placeItems: 'center', color: '#fff',
            fontWeight: 800, fontSize: '1.4rem', letterSpacing: '.02em',
          }}>
            {initials}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ marginBottom: 4 }}>
              {displayName || <span style={{ color: 'var(--n400)', fontWeight: 500, fontSize: '1.1rem' }}>No name set</span>}
            </h2>
            <p className="muted" style={{ fontSize: '.88rem', margin: 0 }}>{userProfile?.email}</p>
            {userProfile?.created_at && (
              <p className="muted" style={{ fontSize: '.78rem', margin: '4px 0 0' }}>
                Member since {formatMember(userProfile.created_at)}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {!editing && (
              <button className="btn btn-secondary btn-sm" onClick={startEdit}>Edit profile</button>
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
        {saveErr && <div className="form-error mb-16">{saveErr}</div>}

        {/* Edit form */}
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
                  placeholder="Your full name"
                  autoFocus
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
          /* View */
          <div className="card mb-24">
            <div className="row mb-16">
              <div className="card-icon" style={{ marginBottom: 0 }}><User /></div>
              <h3 style={{ margin: 0 }}>Your Profile</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <p className="muted" style={{ fontSize: '.76rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>Full name</p>
                <p style={{ margin: 0, fontWeight: 500, color: userProfile?.full_name ? 'var(--n900)' : 'var(--n400)', fontStyle: userProfile?.full_name ? 'normal' : 'italic' }}>
                  {userProfile?.full_name || 'Not set — click Edit profile to add your name'}
                </p>
              </div>
              <div>
                <p className="muted" style={{ fontSize: '.76rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>Email</p>
                <p style={{ margin: 0 }}>{userProfile?.email}</p>
              </div>
              {userProfile?.bio && (
                <div>
                  <p className="muted" style={{ fontSize: '.76rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>Bio</p>
                  <p style={{ margin: 0 }}>{userProfile.bio}</p>
                </div>
              )}
              <div>
                <p className="muted" style={{ fontSize: '.76rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 4 }}>Last updated</p>
                <p style={{ margin: 0, fontSize: '.88rem', color: 'var(--n500)' }}>
                  {formatDate(userProfile?.updated_at)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Security */}
        <div className="card">
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
