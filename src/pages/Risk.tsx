import { AlertTriangle, ShieldCheck, Check } from '../components/icons'

const risks = [
  { id: 'R-01', vuln: 'Password-only authentication', desc: 'Clinical accounts had no MFA, enabling credential reuse from phishing attacks.', like: 'High', imp: 'High', sev: 'Critical', fix: 'Enforce phishing-resistant MFA (FIDO2) on all clinical and admin accounts.' },
  { id: 'R-02', vuln: 'Insufficient email filtering', desc: 'Lookalike domains were not quarantined; no external-sender banners.', like: 'High', imp: 'Medium', sev: 'High', fix: 'Deploy email gateway with domain impersonation detection and external banners.' },
  { id: 'R-03', vuln: 'Overly broad file permissions', desc: 'Shared file server allowed broad read access to PHI beyond job need.', like: 'Medium', imp: 'High', sev: 'High', fix: 'Apply least-privilege ACLs and segment PHI repositories from general shares.' },
  { id: 'R-04', vuln: 'Unsegmented network', desc: 'Compromised endpoint could reach multiple internal segments without inspection.', like: 'Medium', imp: 'High', sev: 'High', fix: 'Implement network microsegmentation and zero-trust access between VLANs.' },
  { id: 'R-05', vuln: 'Stale security awareness training', desc: 'Last phishing training was 11 months old; users did not report suspicious email.', like: 'High', imp: 'Medium', sev: 'High', fix: 'Run quarterly phishing simulations plus a one-click Report Phishing button.' },
  { id: 'R-06', vuln: 'Unencrypted backup copies', desc: 'Some backup copies lacked encryption-at-rest, risking exposure if exfiltrated.', like: 'Low', imp: 'High', sev: 'Medium', fix: 'Encrypt all backups (AES-256) and store an offline air-gapped copy.' },
  { id: 'R-07', vuln: 'Unmanaged personal devices', desc: 'BYOD endpoints lacked MDM enrollment and endpoint protection agents.', like: 'Medium', imp: 'Medium', sev: 'Medium', fix: 'Require MDM enrollment and EDR agent for any device accessing internal resources.' },
  { id: 'R-08', vuln: 'No centralized audit logging', desc: 'Logs were siloed per system, slowing detection and investigation timelines.', like: 'Medium', imp: 'Medium', sev: 'Medium', fix: 'Aggregate logs into a SIEM with alerting on anomalous access patterns.' },
]

const sevClass = (s: string) => s.toLowerCase()
const counts: Record<string, number> = { Critical: 0, High: 0, Medium: 0, Low: 0 }
risks.forEach(r => { counts[r.sev] = (counts[r.sev] ?? 0) + 1 })

const remediated = [
  'MFA enforcement rolled out to 100% of clinical and admin accounts',
  'Email gateway hardened with impersonation detection and external banners',
  'File permissions audited and reduced to least-privilege',
  'Network microsegmentation deployed between clinical and admin VLANs',
  'Quarterly phishing simulations live with one-click reporting',
  'All backups encrypted (AES-256) with offline air-gapped copy',
  'MDM enrollment required for all BYOD and managed endpoints',
  'Centralized SIEM logging with anomaly-based alerting deployed',
]

export default function Risk() {
  return (
    <div className="fade">
      <section className="hero" style={{ paddingBottom: 40, background: 'linear-gradient(180deg,#fffbeb 0%,var(--bg) 100%)' }}>
        <div className="container">
          <span className="hero-eyebrow" style={{ background: '#fef3c7', color: '#92400e' }}><AlertTriangle width={13} height={13} /> Risk Register</span>
          <h1>Risk Assessment</h1>
          <p className="lead">A structured assessment of identified vulnerabilities, their likelihood and impact, and the security improvements implemented to remediate them.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container">
          <div className="grid g4 mb-32">
            {(['Critical', 'High', 'Medium', 'Low'] as const).map(s => (
              <div className="card" key={s} style={{ borderTop: `3px solid ${s === 'Critical' ? 'var(--r500)' : s === 'High' ? 'var(--y600)' : s === 'Medium' ? 'var(--y500)' : 'var(--g500)'}` }}>
                <span className={`badge badge-${sevClass(s)}`} style={{ marginBottom: 8 }}>{s}</span>
                <div className="stat"><span className="stat-num">{counts[s]}</span><span className="stat-label">risks identified</span></div>
              </div>
            ))}
          </div>

          <div className="table-wrap">
            <table>
              <thead><tr><th>ID</th><th>Vulnerability</th><th>Likelihood</th><th>Impact</th><th>Severity</th><th>Improvement</th></tr></thead>
              <tbody>
                {risks.map(r => (
                  <tr key={r.id}>
                    <td className="mono" style={{ fontWeight: 600 }}>{r.id}</td>
                    <td>
                      <div style={{ fontWeight: 600, marginBottom: 3 }}>{r.vuln}</div>
                      <div style={{ fontSize: '.8rem', color: 'var(--n500)' }}>{r.desc}</div>
                    </td>
                    <td><span className={`badge badge-${r.like.toLowerCase()}`}>{r.like}</span></td>
                    <td><span className={`badge badge-${r.imp.toLowerCase()}`}>{r.imp}</span></td>
                    <td><span className={`badge badge-${sevClass(r.sev)}`}>{r.sev}</span></td>
                    <td style={{ fontSize: '.85rem' }}>{r.fix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section bg-light">
        <div className="container">
          <div className="section-head"><h2>Risk Scoring Matrix</h2><p>Severity derived from Likelihood × Impact.</p></div>
          <div className="table-wrap" style={{ maxWidth: 500 }}>
            <table>
              <thead><tr><th>Likelihood \ Impact</th><th>Low</th><th>Medium</th><th>High</th></tr></thead>
              <tbody>
                <tr><td style={{ fontWeight: 600 }}>High</td><td><span className="badge badge-medium">Medium</span></td><td><span className="badge badge-high">High</span></td><td><span className="badge badge-critical">Critical</span></td></tr>
                <tr><td style={{ fontWeight: 600 }}>Medium</td><td><span className="badge badge-low">Low</span></td><td><span className="badge badge-medium">Medium</span></td><td><span className="badge badge-high">High</span></td></tr>
                <tr><td style={{ fontWeight: 600 }}>Low</td><td><span className="badge badge-low">Low</span></td><td><span className="badge badge-low">Low</span></td><td><span className="badge badge-medium">Medium</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="card" style={{ borderTop: '3px solid var(--g500)' }}>
            <div className="row mb-16">
              <div className="card-icon" style={{ background: '#dcfce7', color: 'var(--g600)', marginBottom: 0 }}><ShieldCheck /></div>
              <h3 style={{ margin: 0 }}>Remediation Status — All risks actioned</h3>
            </div>
            <div className="grid g2">
              {remediated.map(item => (
                <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--g600)', flexShrink: 0, marginTop: 2 }}><Check width={16} height={16} /></span>
                  <span style={{ fontSize: '.9rem', color: 'var(--n700)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
