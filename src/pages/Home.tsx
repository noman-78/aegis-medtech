import { Link } from 'react-router-dom'
import { ShieldCheck, Lock, Server, Activity, Database, Fingerprint } from '../components/icons'

const pillars = [
  { icon: Lock, title: 'Confidentiality', text: 'End-to-end encryption protects health information at rest and in transit using AES-256 and TLS 1.3.' },
  { icon: Activity, title: 'Integrity', text: 'Tamper-evident logging and integrity monitoring detect unauthorized changes to clinical data.' },
  { icon: Server, title: 'Availability', text: 'Redundant infrastructure and tested backups keep critical systems operational 99.98% of the time.' },
]

const stats = [
  { num: '99.98%', label: 'System uptime SLA' },
  { num: 'AES-256', label: 'Encryption standard' },
  { num: '24/7', label: 'SOC monitoring' },
  { num: '$0', label: 'Ransom paid in 2025 incident' },
]

export default function Home() {
  return (
    <div className="fade">
      <section className="hero">
        <div className="container">
          <span className="hero-eyebrow"><ShieldCheck width={13} height={13} /> Defense-in-Depth Healthcare Security</span>
          <h1>Securing healthcare technology where lives depend on data integrity</h1>
          <p className="lead">
            Aegis MedTech Systems engineers resilient digital infrastructure for healthcare organizations.
            We protect patient data and clinical operations through layered, verifiable security architecture.
          </p>
          <div className="hero-actions">
            <Link to="/solutions" className="btn btn-primary">Explore Security Solutions</Link>
            <Link to="/about" className="btn btn-secondary">About Aegis</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Our security mission</h2>
            <p>Healthcare is the most targeted sector for cyberattacks. Aegis ensures that clinicians can trust their systems — and patients never pay the price for a breach.</p>
          </div>
          <div className="grid g3">
            {pillars.map(p => (
              <div className="card" key={p.title}>
                <div className="card-icon"><p.icon /></div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-light">
        <div className="container">
          <div className="grid g4">
            {stats.map(s => (
              <div className="stat" key={s.label}>
                <span className="stat-num">{s.num}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>What we protect</h2>
            <p>Security controls designed around the realities of modern healthcare delivery.</p>
          </div>
          <div className="grid g2">
            <div className="card">
              <div className="card-icon"><Database /></div>
              <h3>Electronic Health Records</h3>
              <p>Encrypted storage, strict access controls, and full audit trails for every record access — supporting HIPAA-aligned compliance requirements.</p>
            </div>
            <div className="card">
              <div className="card-icon"><Fingerprint /></div>
              <h3>Clinical Workforce Access</h3>
              <p>Multi-factor authentication and role-based access ensure the right people reach the right data — and nothing more.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-dark">
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
          <div style={{ maxWidth: 540 }}>
            <h2 style={{ color: '#fff' }}>Transparency through incident reporting</h2>
            <p style={{ color: 'var(--n300)' }}>We document real security incidents and our response — because understanding how an attack unfolds is the first step to preventing the next one.</p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/incident" className="btn btn-primary">Read the incident report</Link>
            <Link to="/risk" className="btn btn-secondary" style={{ background: 'transparent', color: 'var(--p300)', borderColor: 'var(--n700)' }}>View risk assessment</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
