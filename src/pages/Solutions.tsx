import { Server, Lock, Key, HardDrive, ShieldCheck, GraduationCap } from '../components/icons'

const solutions = [
  {
    icon: Server, title: 'Firewall & Network Segmentation',
    summary: 'Stateful inspection firewalls and microsegmentation control traffic between trust zones.',
    points: [
      'Next-gen firewalls with application-aware filtering and IDS/IPS',
      'Microsegmentation isolates clinical, admin, and guest networks',
      'Default-deny egress rules; only approved destinations are reachable',
      'All inter-VLAN traffic is logged and inspected for anomalies',
    ],
  },
  {
    icon: Lock, title: 'Encryption',
    summary: 'AES-256 at rest and TLS 1.3 in transit protect PHI across its full lifecycle.',
    points: [
      'AES-256-GCM for database, file, and backup encryption at rest',
      'TLS 1.3 enforced for all network transit; legacy protocols disabled',
      'Centralized key management with hardware security modules (HSMs)',
      'Key rotation policy with split-knowledge controls',
    ],
  },
  {
    icon: Key, title: 'Multi-Factor Authentication (MFA)',
    summary: 'Phishing-resistant MFA blocks credential reuse — the leading cause of healthcare breaches.',
    points: [
      'FIDO2/WebAuthn hardware keys for admin and clinical accounts',
      'TOTP fallback for lower-privilege accounts where hardware is impractical',
      'Adaptive MFA steps up on risky sign-ins (new device, off-hours)',
      'Session tokens are short-lived and bound to device posture',
    ],
  },
  {
    icon: HardDrive, title: 'Backups & Recovery',
    summary: 'Encrypted, tested, air-gapped backups enable full recovery without paying ransom.',
    points: [
      '3-2-1 strategy: 3 copies, 2 media types, 1 offline air-gapped copy',
      'All backups encrypted (AES-256); keys stored separately',
      'Quarterly restore tests verify backup integrity and RTO/RPO targets',
      'Immutable storage for recent backups to resist tampering',
    ],
  },
  {
    icon: ShieldCheck, title: 'Endpoint Protection',
    summary: 'EDR agents detect, contain, and remediate threats on every managed endpoint.',
    points: [
      'Behavioral EDR with automatic isolation of compromised endpoints',
      'Application allowlisting on clinical workstations',
      'MDM enrollment required for all managed and BYOD devices',
      'Patch management enforces 48-hour critical-patch SLA',
    ],
  },
  {
    icon: GraduationCap, title: 'Employee Awareness Training',
    summary: 'People are the first line of defense. Continuous training turns staff into sensors.',
    points: [
      'Onboarding training and annual refreshers for all staff',
      'Quarterly phishing simulations with targeted follow-up coaching',
      'One-click "Report Phishing" button in the mail client',
      'Role-based modules for clinicians, admins, and executives',
    ],
  },
]

export default function Solutions() {
  return (
    <div className="fade">
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <span className="hero-eyebrow"><ShieldCheck width={13} height={13} /> Defense in Depth</span>
          <h1>Security Solutions</h1>
          <p className="lead">The layered security controls deployed across Aegis infrastructure. No single control is sufficient — security is achieved through overlapping, independently effective layers that close each other's gaps.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container">
          <div className="grid g2">
            {solutions.map(s => (
              <div className="card" key={s.title}>
                <div className="row mb-16">
                  <div className="card-icon" style={{ marginBottom: 0 }}><s.icon /></div>
                  <h3 style={{ margin: 0 }}>{s.title}</h3>
                </div>
                <p style={{ marginBottom: 14 }}>{s.summary}</p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {s.points.map(p => (
                    <li key={p} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: '.9rem', color: 'var(--n700)' }}>
                      <span style={{ color: 'var(--p600)', flexShrink: 0, marginTop: 2 }}>▸</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-light">
        <div className="container">
          <div className="section-head"><h2>How the layers work together</h2><p>Each control addresses a different stage of an attack. Defeating one layer still leaves the next.</p></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Attack stage</th><th>Primary control</th><th>Supporting controls</th></tr></thead>
              <tbody>
                <tr><td style={{ fontWeight: 600 }}>Initial access (phishing)</td><td>Employee awareness training</td><td>Email filtering, MFA</td></tr>
                <tr><td style={{ fontWeight: 600 }}>Credential use</td><td>Multi-factor authentication</td><td>Adaptive access, SIEM alerts</td></tr>
                <tr><td style={{ fontWeight: 600 }}>Lateral movement</td><td>Firewall &amp; segmentation</td><td>Least-privilege permissions</td></tr>
                <tr><td style={{ fontWeight: 600 }}>Payload execution</td><td>Endpoint protection (EDR)</td><td>Application allowlisting</td></tr>
                <tr><td style={{ fontWeight: 600 }}>Data exfiltration</td><td>Encryption at rest &amp; in transit</td><td>Egress filtering, DLP</td></tr>
                <tr><td style={{ fontWeight: 600 }}>Recovery</td><td>Backups &amp; recovery</td><td>Immutable storage, restore tests</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
