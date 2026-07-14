import { useState, type FormEvent, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Lock, Shield, User, Key } from '../components/icons'
import { useUserAuth } from '../lib/userAuth'
import { validateEmail, validatePassword, validateName, sanitizeText } from '../lib/validation'

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

export default function UserLogin() {
  const { session, signIn, signUp } = useUserAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const defaultMode = params.get('mode') === 'register' ? 'register' : 'login'

  const [mode, setMode] = useState<'login' | 'register'>(defaultMode)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; password?: string }>({})
  const [formErr, setFormErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (session) navigate('/profile', { replace: true })
  }, [session]) // eslint-disable-line react-hooks/exhaustive-deps

  const clearErrors = () => { setErrors({}); setFormErr(null) }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormErr(null)
    const next: typeof errors = {}
    if (mode === 'register') {
      const nr = validateName(fullName); if (!nr.valid) next.fullName = nr.error
    }
    const er = validateEmail(email); if (!er.valid) next.email = er.error
    const pr = validatePassword(password); if (!pr.valid) next.password = pr.error
    setErrors(next)
    if (Object.keys(next).length) return

    setBusy(true)
    try {
      if (mode === 'login') {
        const { error } = await signIn(sanitizeText(email), password)
        if (error) { setFormErr('Invalid email or password.'); return }
        navigate('/profile', { replace: true })
      } else {
        const { error } = await signUp(sanitizeText(email), password, sanitizeText(fullName))
        if (error) { setFormErr(error); return }
        navigate('/profile', { replace: true })
      }
    } finally {
      setBusy(false)
    }
  }

  const strength = passwordStrength(password)

  return (
    <div className="auth-wrap fade">
      <div className="auth-card" style={{ maxWidth: 460 }}>
        <div className="row mb-8">
          <span className="brand-mark"><Shield width={17} height={17} /></span>
          <h1>{mode === 'login' ? 'Sign In' : 'Create Account'}</h1>
        </div>
        <p className="auth-sub">
          {mode === 'login'
            ? 'Welcome back to Aegis MedTech. Sign in to your account.'
            : 'Join Aegis MedTech. Your password is encrypted with bcrypt before storage.'}
        </p>

        {formErr && <div className="form-error">{formErr}</div>}
        <form onSubmit={handleSubmit} noValidate>
          {mode === 'register' && (
            <div className="field">
              <label htmlFor="fullName">Full name</label>
              <input
                id="fullName" type="text"
                className={`input${errors.fullName ? ' err' : ''}`}
                value={fullName}
                onChange={e => { setFullName(e.target.value); clearErrors() }}
                autoComplete="name" maxLength={120} placeholder="Your name"
              />
              {errors.fullName && <div className="ferr">{errors.fullName}</div>}
            </div>
          )}

          <div className="field">
            <label htmlFor="uemail">Email address</label>
            <input
              id="uemail" type="email"
              className={`input${errors.email ? ' err' : ''}`}
              value={email}
              onChange={e => { setEmail(e.target.value); clearErrors() }}
              autoComplete="email" placeholder="you@example.com" required
            />
            {errors.email && <div className="ferr">{errors.email}</div>}
          </div>

          <div className="field">
            <label htmlFor="upw">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="upw" type={showPw ? 'text' : 'password'}
                className={`input${errors.password ? ' err' : ''}`}
                value={password}
                onChange={e => { setPassword(e.target.value); clearErrors() }}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                placeholder={mode === 'login' ? '••••••••••••' : 'Min 12 characters'} required
                style={{ paddingRight: 52 }}
              />
              <button type="button" onClick={() => setShowPw(v => !v)}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--n500)', fontSize: '.75rem', fontWeight: 600, cursor: 'pointer' }}>
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>

            {mode === 'register' && password && (
              <div style={{ marginTop: 8 }}>
                <div className="pw-strength">
                  <div className="pw-strength-bar" style={{ width: `${(strength.score / 4) * 100}%`, backgroundColor: strength.color }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontSize: '.78rem', color: strength.color, fontWeight: 600 }}>{strength.label}</span>
                  <span style={{ fontSize: '.72rem', color: 'var(--n400)' }}>bcrypt hash on submit</span>
                </div>
              </div>
            )}
            {errors.password
              ? <div className="ferr">{errors.password}</div>
              : <div className="hint">Min 12 chars — upper, lower, digit, symbol.</div>}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 4 }} disabled={busy}>
            {busy
              ? <><span className="spinner" /> Please wait…</>
              : <><Lock width={15} height={15} /> {mode === 'login' ? 'Sign in' : 'Create account'}</>}
          </button>
        </form>

        <div style={{ marginTop: 16, textAlign: 'center', fontSize: '.88rem' }}>
          {mode === 'login' ? (
            <span className="muted">No account?{' '}
              <button className="btn btn-ghost btn-sm" onClick={() => { setMode('register'); clearErrors() }}>Register free</button>
            </span>
          ) : (
            <span className="muted">Already have an account?{' '}
              <button className="btn btn-ghost btn-sm" onClick={() => { setMode('login'); clearErrors() }}>Sign in</button>
            </span>
          )}
        </div>

        {mode === 'register' && (
          <div className="card mt-20" style={{ padding: 16, background: 'var(--n50)', border: '1px solid var(--n200)' }}>
            <div className="row mb-10" style={{ gap: 8 }}>
              <Key width={14} height={14} style={{ color: 'var(--p600)' }} />
              <strong style={{ fontSize: '.85rem', color: 'var(--n800)' }}>How your password is secured</strong>
            </div>
            <ol style={{ paddingLeft: 18, fontSize: '.82rem', color: 'var(--n600)', lineHeight: 1.7, margin: 0 }}>
              <li>Password sent over <strong>HTTPS</strong> (TLS 1.3) — encrypted in transit</li>
              <li>Server hashes it using <strong>bcrypt</strong> (cost factor 12)</li>
              <li>Only the <strong>60-char hash</strong> is stored — plain password is discarded</li>
              <li>Even Aegis staff cannot recover your original password</li>
            </ol>
          </div>
        )}

        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <Link to="/" className="muted" style={{ fontSize: '.82rem' }}>← Back to website</Link>
           
        </div>
      </div>
    </div>
  )
}
