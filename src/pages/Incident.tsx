import { AlertTriangle, Mail, Lock, Activity, ShieldCheck } from '../components/icons'

const timeline = [
  { time: '2025-03-14 09:12', event: 'Initial access', detail: 'A clinician received a spoofed helpdesk email requesting password revalidation via a lookalike portal.' },
  { time: '2025-03-14 09:18', event: 'Credential capture', detail: 'The clinician entered credentials into the fraudulent portal, forwarding them to the attacker.' },
  { time: '2025-03-14 11:40', event: 'Lateral movement', detail: 'Attacker used stolen credentials to access a shared file server and enumerate PHI repositories.' },
  { time: '2025-03-14 14:05', event: 'Ransomware deployed', detail: 'Ransomware payload pushed via compromised admin shares, encrypting clinical documents on 23 endpoints.' },
  { time: '2025-03-14 14:22', event: 'Detection', detail: 'EDR alerts fired on mass file modification; SOC isolated affected segments within 9 minutes.' },
  { time: '2025-03-14 15:00', event: 'Containment', detail: 'Affected VLANs quarantined, compromised accounts disabled, backups verified offline.' },
  { time: '2025-03-15 08:30', event: 'Eradication & Recovery', detail: 'Systems rebuilt from verified backups; all privileged credentials rotated; MFA enforcement deployed.' },
  { time: '2025-03-18', event: 'Post-incident review', detail: 'Root-cause analysis completed; phishing-resistant MFA and email filtering hardening approved.' },
]

const impact = [
  { label: 'PHI records potentially exposed', value: '~12,400 records', sev: 'high' },
  { label: 'Endpoints encrypted', value: '23 workstations', sev: 'medium' },
  { label: 'Clinical downtime', value: '6 hrs 18 min', sev: 'high' },
  { label: 'Ransom paid', value: '$0 — restored from backup', sev: 'low' },
]

const rootCauses = [
  'No phishing-resistant MFA — password-only auth allowed credential reuse after phishing.',
  'Email filtering did not flag the lookalike domain (differed by one character).',
  'Shared file server had overly broad read permissions, enabling PHI enumeration.',
  'User awareness training had not been refreshed in 11 months.',
]

const lessons = [
  'Enforce phishing-resistant MFA (FIDO2 hardware keys) for all clinical and admin accounts.',
  'Tighten email gateway: quarantine lookalike domains; banner all external senders.',
  'Apply least-privilege file permissions; segment PHI repositories.',
  'Run quarterly phishing simulations with a one-click "Report Phishing" button.',
]

export default function Incident() {
  return (
    <div className="fade">
      <section className="hero" style={{ paddingBottom: 40, background: 'linear-gradient(180deg,#fef2f2 0%,var(--bg) 100%)' }}>
        <div className="container">
          <span className="hero-eyebrow" style={{ background: '#fee2e2', color: '#991b1b' }}><AlertTriangle width={13} height={13} /> Incident Report · 2025-03-14</span>
          <h1>Phishing &amp; Ransomware Incident Report</h1>
          <p className="lead">On 14 March 2025 Aegis MedTech Systems experienced a coordinated phishing and ransomware attack. This report documents the timeline, impact, root causes, and corrective actions taken — published in the interest of transparency and industry learning.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container">
          <div className="prose mb-32">
            <h2>1. Executive Summary</h2>
            <p>An attacker gained initial access through a targeted phishing email that captured a clinician's credentials via a lookalike authentication portal. The credentials were used for lateral movement across a shared file server, after which a ransomware payload encrypted 23 endpoints. Detection via EDR alerts occurred within minutes. No ransom was paid; systems were restored from verified offline backups. Approximately 12,400 PHI records were potentially exposed and reviewed for regulatory notification.</p>
          </div>

          <h2 className="mb-16">2. Incident Timeline</h2>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Timestamp (UTC)</th><th>Event</th><th>Detail</th></tr></thead>
              <tbody>
                {timeline.map(t => (
                  <tr key={t.time}>
                    <td className="mono" style={{ whiteSpace: 'nowrap', fontSize: '.82rem' }}>{t.time}</td>
                    <td style={{ fontWeight: 600 }}>{t.event}</td>
                    <td style={{ fontSize: '.88rem' }}>{t.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section bg-light">
        <div className="container">
          <div className="section-head"><h2>3. Impact Assessment</h2><p>Quantified impact across data, systems, and operations.</p></div>
          <div className="grid g4">
            {impact.map(i => (
              <div className="card" key={i.label} style={{ borderTop: `3px solid ${i.sev === 'high' ? 'var(--r500)' : i.sev === 'medium' ? 'var(--y500)' : 'var(--g500)'}` }}>
                <span className={`badge badge-${i.sev}`} style={{ marginBottom: 10 }}>{i.sev}</span>
                <div className="stat">
                  <span className="stat-num" style={{ fontSize: '1.3rem' }}>{i.value}</span>
                  <span className="stat-label">{i.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid g2">
            <div className="card">
              <div className="row mb-16">
                <div className="card-icon" style={{ background: '#fee2e2', color: 'var(--r600)', marginBottom: 0 }}><AlertTriangle /></div>
                <h3 style={{ margin: 0 }}>4. Root Causes</h3>
              </div>
              <ul style={{ paddingLeft: 20 }}>
                {rootCauses.map(c => <li key={c} style={{ marginBottom: 10, color: 'var(--n700)', fontSize: '.92rem' }}>{c}</li>)}
              </ul>
            </div>
            <div className="card">
              <div className="row mb-16">
                <div className="card-icon" style={{ background: '#dcfce7', color: 'var(--g600)', marginBottom: 0 }}><ShieldCheck /></div>
                <h3 style={{ margin: 0 }}>5. Corrective Actions</h3>
              </div>
              <ul style={{ paddingLeft: 20 }}>
                {lessons.map(l => <li key={l} style={{ marginBottom: 10, color: 'var(--n700)', fontSize: '.92rem' }}>{l}</li>)}
              </ul>
            </div>
          </div>

          <div className="mt-32">
            <h3 className="mb-16">6. Attack Chain</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              {[
                { icon: Mail, label: 'Phishing email' },
                { icon: Lock, label: 'Credential capture' },
                { icon: Activity, label: 'Lateral movement' },
                { icon: AlertTriangle, label: 'Ransomware deploy' },
                { icon: ShieldCheck, label: 'Detect & contain' },
              ].map((s, i) => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="card" style={{ padding: '12px 16px', marginBottom: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <s.icon width={16} height={16} /><span style={{ fontWeight: 600, fontSize: '.88rem' }}>{s.label}</span>
                  </div>
                  {i < 4 && <span style={{ color: 'var(--n400)', fontWeight: 700, fontSize: '1.2rem' }}>→</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="callout warn mt-32">
            <p><strong>Regulatory note:</strong> Potential PHI exposure was reviewed against HIPAA Breach Notification requirements. Affected individuals and oversight authorities were notified within the statutory timeframe. This report is an academic reconstruction for educational purposes.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
