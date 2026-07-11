import { useState, type FormEvent, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Shield, Key, Check } from '../components/icons'
import { useAuth } from '../lib/auth'
import { validateEmail, validatePassword, sanitizeText } from '../lib/validation'

function passwordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0
  if (pw.length >= 12) score++
  if (pw.length >= 16) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[a-z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 1) return { score: 1, label: 'Weak', color: 'var(--r500)' }
  if (score <= 3) return { score: 2, label: 'Fair', color: 'var(--y500)' }
  if (score <= 4) return { score: 3, label: 'Good', color: 'var(--p500)' }
  return { score: 4, label: 'Strong', color: 'var(--g500)' }
}

export default function Login() {
  const { session, profile, signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [formErr, setFormErr] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (session && profile) navigate('/admin', { replace: true })
  }, [session, profile, navigate])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormErr(null)
    setInfo(null)
    const next: { email?: string; password?: string } = {}
    const er = validateEmail(email); if (!er.valid) next.email = er.error
    const pr = validatePassword(password); if (!pr.valid) next.password = pr.error
    setErrors(next)
    if (Object.keys(next).length) return
    setBusy(true)
    try {
      if (mode === 'login') {
        const { error } = await signIn(sanitizeText(email), password)
        if (error) setFormErr('Invalid email or password.')
      } else {
        const { error } = await signUp(sanitizeText(email), password)
        if (error) setFormErr(error)
        else {
          setInfo('Account created successfully. Your password was hashed with bcrypt before storage. An administrator must promote your account before you can access the dashboard.')
          setMode('login')
        }
      }
    } finally {
      setBusy(false)
    }
  }

  const strength = passwordStrength(password)

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="row mb-16">
          <span className="brand-mark"><Shield width={17} height={17} /></span>
          <h1>{mode === 'login' ? 'Admin Sign In' : 'Create Account'}</h1>
        </div>
        <p className="auth-sub">
          {mode === 'login'
            ? 'Secure access to the Aegis content management dashboard.'
            : 'New accounts receive the "viewer" role. An admin must promote you.'}
        </p>

        {formErr && <div className="form-error">{formErr}</div>}
        {info && <div className="form-success">{info}</div>}

        {mode === 'register' && (
          <div className="form-info mb-16">
            <div className="row mb-8"><Key width={14} height={14} /> <strong>Password security</strong></div>
            <p style={{ fontSize: '.82rem', margin: 0 }}>
              Your password is never stored in plain text. It is hashed using <strong>bcrypt</strong>
              (cost factor 12) before being saved to the database. Only the hash is stored —
              your original password cannot be recovered, even by administrators.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="email">Email address</label>
            <input
              id="email" type="email" className={`input${errors.email ? ' err' : ''}`}
              value={email}
              onChange={e => { setEmail(e.target.value); setErrors(x => ({ ...x, email: undefined })); setFormErr(null) }}
              autoComplete="email" required
            />
            {errors.email && <div className="ferr">{errors.email}</div>}
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password" type={showPw ? 'text' : 'password'}
                className={`input${errors.password ? ' err' : ''}`}
                value={password}
                onChange={e => { setPassword(e.target.value); setErrors(x => ({ ...x, password: undefined })); setFormErr(null) }}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required
                style={{ paddingRight: 44 }}
              />
              <button type="button" onClick={() => setShowPw(v => !v)}
                style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--n500)', padding: 4, fontSize: '.78rem' }}>
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>

            {mode === 'register' && password && (
              <div style={{ marginTop: 8 }}>
                <div className="pw-strength">
                  <div className="pw-strength-bar"
                    style={{ width: `${(strength.score / 4) * 100}%`, backgroundColor: strength.color }} />
                </div>
                <div className="row" style={{ justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontSize: '.78rem', color: strength.color, fontWeight: 600 }}>{strength.label}</span>
                  <span className="muted" style={{ fontSize: '.72rem' }}>bcrypt hash on submit</span>
                </div>
              </div>
            )}

            {errors.password
              ? <div className="ferr">{errors.password}</div>
              : mode === 'register'
                ? <div className="hint">Min 12 chars with upper, lower, digit, and symbol. Hashed with bcrypt before storage.</div>
                : <div className="hint">Min 12 chars with upper, lower, digit, and symbol.</div>
            }
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={busy}>
            {busy
              ? <><span className="spinner" /> Please wait…</>
              : <><Lock width={15} height={15} /> {mode === 'login' ? 'Sign in securely' : 'Create account'}</>}
          </button>
        </form>

        <div style={{ marginTop: 18, textAlign: 'center', fontSize: '.88rem' }}>
          {mode === 'login'
            ? <><span className="muted">No account?</span> <button className="btn btn-ghost btn-sm" onClick={() => { setMode('register'); setFormErr(null); setInfo(null) }}>Register</button></>
            : <><span className="muted">Have an account?</span> <button className="btn btn-ghost btn-sm" onClick={() => { setMode('login'); setFormErr(null); setInfo(null) }}>Sign in</button></>}
        </div>

        {mode === 'register' && (
          <div className="card mt-24" style={{ padding: 16, background: 'var(--n50)' }}>
            <div className="row mb-8"><Check width={14} height={14} style={{ color: 'var(--g600)' }} /> <strong style={{ fontSize: '.85rem' }}>What happens when you register?</strong></div>
            <ol style={{ paddingLeft: 20, fontSize: '.82rem', color: 'var(--n600)', lineHeight: 1.6 }}>
              <li>Your email and password are sent over <strong>HTTPS</strong> to Supabase Auth.</li>
              <li>The server hashes your password using <strong>bcrypt</strong> (cost factor 12).</li>
              <li>Only the <strong>bcrypt hash</strong> is stored in the database — never the plain password.</li>
              <li>A <strong>profile</strong> row is created with the default <strong>viewer</strong> role.</li>
              <li>An admin must promote you to <strong>editor</strong> or <strong>admin</strong> to access the dashboard.</li>
            </ol>
          </div>
        )}

        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <Link to="/" className="muted" style={{ fontSize: '.82rem' }}>← Back to website</Link>
        </div>
      </div>
    </div>
  )
}
