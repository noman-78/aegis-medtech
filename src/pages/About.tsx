import { ShieldCheck, Users, Server } from '../components/icons'

const timeline = [
  { year: '2019', text: 'Aegis MedTech Systems founded as a model for secure clinical data exchange in academic research.' },
  { year: '2021', text: 'First defense-in-depth architecture deployed across simulated hospital infrastructure.' },
  { year: '2023', text: 'Adopted zero-trust network principles and continuous security monitoring with SIEM.' },
  { year: '2025', text: 'Responded to a phishing-ransomware incident; hardened controls and published transparency report.' },
]

const values = [
  { icon: ShieldCheck, title: 'Security first', text: 'Every design decision is weighed against its impact on patient-data safety.' },
  { icon: Users, title: 'Clinician-centered', text: 'Security must enable care, not obstruct it. Usability is itself a security control.' },
  { icon: Server, title: 'Resilience by design', text: 'Systems are built to fail safely and recover quickly from any incident.' },
]

export default function About() {
  return (
    <div className="fade">
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <span className="hero-eyebrow"><Users width={13} height={13} /> Organization Background</span>
          <h1>About Aegis MedTech Systems</h1>
          <p className="lead">A fictional healthcare technology firm built for an academic cybersecurity study, demonstrating how clinical infrastructure should be secured against evolving threats.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container">
          <div className="prose mb-32">
            <h2>Who we are</h2>
            <p>Aegis MedTech Systems was established in 2019 as a research-driven initiative to model how a healthcare technology company should secure its digital infrastructure. As a fictional organization built for an academic cybersecurity project, Aegis demonstrates the policies, controls, and incident-response practices that real healthcare organizations must adopt to defend patient data.</p>
            <p>Our work focuses on the intersection of clinical care and security engineering. Healthcare systems face a uniquely hostile threat landscape: high-value data, legacy medical devices, and the constant pressure of uptime. Aegis models a defense-in-depth posture that addresses each of these realities.</p>
          </div>

          <div className="section-head"><h2>Our values</h2></div>
          <div className="grid g3">
            {values.map(v => (
              <div className="card" key={v.title}>
                <div className="card-icon"><v.icon /></div>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-light">
        <div className="container">
          <div className="section-head"><h2>Our journey</h2><p>Key milestones in Aegis's security maturity.</p></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {timeline.map((t, i) => (
              <div key={t.year} style={{ display: 'flex', gap: 16, paddingBottom: i < timeline.length - 1 ? 20 : 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--p600)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: '.78rem', flexShrink: 0 }}>{t.year}</div>
                  {i < timeline.length - 1 && <div style={{ width: 2, flex: 1, background: 'var(--n300)', marginTop: 6 }} />}
                </div>
                <div className="card" style={{ flex: 1, marginBottom: 0, padding: 16 }}><p style={{ margin: 0 }}>{t.text}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="callout"><p><strong>Academic notice:</strong> Aegis MedTech Systems is a fictional entity created solely for an academic cybersecurity project. All incidents, risks, and solutions are illustrative and for educational purposes only.</p></div>
        </div>
      </section>
    </div>
  )
}
