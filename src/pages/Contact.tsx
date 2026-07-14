import { useState, type FormEvent } from 'react'
import { Mail, ShieldCheck, Check } from '../components/icons'
import { supabase } from '../lib/supabase'
import { validateName, validateEmail, validateSubject, validateMessage, validateOrganization, sanitizeText, rateLimit } from '../lib/validation'

interface F { name: string; email: string; organization: string; subject: string; message: string }
const init: F = { name: '', email: '', organization: '', subject: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState<F>(init)
  const [errors, setErrors] = useState<Partial<F>>({})
  const [submitErr, setSubmitErr] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [busy, setBusy] = useState(false)

  const update = (k: keyof F, v: string) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: undefined }))
    setSubmitErr(null)
  }

  const validate = () => {
    const e: Partial<F> = {}
    const nr = validateName(form.name); if (!nr.valid) e.name = nr.error
    const er = validateEmail(form.email); if (!er.valid) e.email = er.error
    const or = validateOrganization(form.organization); if (!or.valid) e.organization = or.error
    const sr = validateSubject(form.subject); if (!sr.valid) e.subject = sr.error
    const mr = validateMessage(form.message); if (!mr.valid) e.message = mr.error
    setErrors(e)
    return Object.keys(e).length === 0
  }

      const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitErr(null)
    if (!validate()) return
    if (!rateLimit('contact', 3, 10 * 60 * 1000)) {
      setSubmitErr('Too many submissions. Please wait a few minutes.')
      return
    }
    setBusy(true)
    try {
      const payload = {
        name: sanitizeText(form.name),
        email: sanitizeText(form.email),
        organization: form.organization ? sanitizeText(form.organization) : null,
        subject: sanitizeText(form.subject),
        message: sanitizeText(form.message),
      }
      const { error } = await supabase.from('contact_submissions').insert(payload)
      if (error) throw error
      await supabase.from('audit_log').insert({ action: 'contact.submit', detail: `New submission from ${payload.email}` })
      setSuccess(true)
      setForm(init)
    } catch (err) {
      setSubmitErr(err instanceof Error ? err.message : 'Submission failed. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fade">
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <span className="hero-eyebrow"><Mail width={13} height={13} /> Secure Contact</span>
          <h1>Contact Aegis MedTech Systems</h1>
          <p className="lead">Reach out about our security research, partnerships, or this academic project. All submissions are validated, sanitized, and stored with row-level access controls.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container">
          <div className="grid g2" style={{ alignItems: 'start' }}>
            <div>
              <div className="card mb-24">
                <div className="card-icon" style={{ background: '#dcfce7', color: 'var(--g600)' }}><ShieldCheck /></div>
                <h3>How we protect your submission</h3>
                <ul style={{ listStyle: 'none', padding: 0, marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    'Input validated client- and server-side (CHECK constraints)',
                    'All fields sanitized to strip control characters',
                    'Queries parameterized — no SQL injection surface',
                    'Output escaped on render — no stored XSS surface',
                    'Rate-limited to deter abuse (3 per 10 minutes)',
                    'Row-level security restricts access to authorized staff only',
                  ].map(p => (
                    <li key={p} style={{ display: 'flex', gap: 9, alignItems: 'flex-start', fontSize: '.88rem', color: 'var(--n700)' }}>
                      <span style={{ color: 'var(--g600)', flexShrink: 0, marginTop: 2 }}><Check width={15} height={15} /></span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="callout"><p><strong>Response time:</strong> We aim to respond within 2 business days. For urgent security disclosures, indicate this in the subject line.</p></div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: 18 }}>Send a message</h3>
              {success && <div className="form-success"><strong>Thank you.</strong> Your message has been received securely.</div>}
              {submitErr && <div className="form-error">{submitErr}</div>}

              <form className="form" onSubmit={handleSubmit} noValidate>
                <div className="field">
                  <label htmlFor="name">Full name *</label>
                  <input id="name" type="text" className={`input${errors.name ? ' err' : ''}`} value={form.name} onChange={e => update('name', e.target.value)} maxLength={120} autoComplete="name" required />
                  {errors.name && <div className="ferr">{errors.name}</div>}
                </div>
                <div className="field">
                  <label htmlFor="email">Email address *</label>
                  <input id="email" type="email" className={`input${errors.email ? ' err' : ''}`} value={form.email} onChange={e => update('email', e.target.value)} maxLength={254} autoComplete="email" required />
                  {errors.email && <div className="ferr">{errors.email}</div>}
                </div>
                <div className="field">
                  <label htmlFor="org">Organization <span className="muted">(optional)</span></label>
                  <input id="org" type="text" className={`input${errors.organization ? ' err' : ''}`} value={form.organization} onChange={e => update('organization', e.target.value)} maxLength={120} autoComplete="organization" />
                  {errors.organization && <div className="ferr">{errors.organization}</div>}
                </div>
                <div className="field">
                  <label htmlFor="subject">Subject *</label>
                  <input id="subject" type="text" className={`input${errors.subject ? ' err' : ''}`} value={form.subject} onChange={e => update('subject', e.target.value)} maxLength={200} required />
                  {errors.subject && <div className="ferr">{errors.subject}</div>}
                </div>
                <div className="field">
                  <label htmlFor="message">Message *</label>
                  <textarea id="message" className={`textarea${errors.message ? ' err' : ''}`} value={form.message} onChange={e => update('message', e.target.value)} maxLength={4000} required />
                  <div className="hint">{form.message.length} / 4000</div>
                  {errors.message && <div className="ferr">{errors.message}</div>}
                </div>
                <button type="submit" className="btn btn-primary" disabled={busy}>
                  {busy ? <><span className="spinner" /> Sending…</> : <><Mail width={15} height={15} /> Send securely</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
