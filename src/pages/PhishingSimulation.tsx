import { useState } from "react";
import { Link } from "react-router-dom";

export default function PhishingSimulation() {
  const [detected, setDetected] = useState(false);

  if (detected) {
    return (
      <div className="container" style={{ padding: "60px 20px", maxWidth: 900 }}>

        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 40,
            boxShadow: "0 10px 30px rgba(0,0,0,.08)"
          }}
        >

          <div
            style={{
              width: 90,
              height: 90,
              borderRadius: "50%",
              background: "#fee2e2",
              display: "grid",
              placeItems: "center",
              fontSize: 42,
              margin: "0 auto 25px"
            }}
          >
            ⚠️
          </div>

          <h1 style={{ textAlign: "center", color: "#dc2626" }}>
            Phishing Attack Detected
          </h1>

          <p
            style={{
              textAlign: "center",
              color: "#555",
              marginBottom: 35
            }}
          >
            Congratulations! You have completed the cybersecurity awareness simulation.
          </p>

          <div className="grid g2">

            <div className="card">
              <h3>🚩 Warning Signs</h3>

              <ul>
                <li>Urgent message</li>
                <li>Suspicious sender</li>
                <li>Requests credentials</li>
                <li>Creates panic</li>
                <li>Unknown verification link</li>
              </ul>
            </div>

            <div className="card">
              <h3>🛡 Prevention</h3>

              <ul>
                <li>Check sender email</li>
                <li>Verify website URL</li>
                <li>Enable MFA</li>
                <li>Never enter passwords from email links</li>
                <li>Report suspicious emails</li>
              </ul>
            </div>

          </div>

          <div
            style={{
              marginTop: 30,
              background: "#ecfdf5",
              padding: 20,
              borderRadius: 8
            }}
          >
            <strong>Security Result:</strong><br />

            Aegis MedTech Security Gateway successfully prevented this phishing attempt before credentials were stolen.
          </div>

          <div style={{ textAlign: "center", marginTop: 35 }}>

            <Link
              to="/"
              className="btn btn-primary"
            >
              Continue to Website
            </Link>

          </div>

        </div>

      </div>
    );
  }

  return (
    <div
      style={{
        background: "#f3f4f6",
        minHeight: "100vh",
        padding: 40
      }}
    >

      <div
        style={{
          maxWidth: 850,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 10px 35px rgba(0,0,0,.12)",
          overflow: "hidden"
        }}
      >

        <div
          style={{
            background: "#2563eb",
            color: "#fff",
            padding: 18,
            fontWeight: 700,
            fontSize: 18
          }}
        >
          Outlook Mail
        </div>

        <div style={{ padding: 30 }}>

          <p><strong>From:</strong> IT Support &lt;support@aegis-security-alert.com&gt;</p>

          <p><strong>To:</strong> employee@aegismedtech.com</p>

          <p><strong>Subject:</strong> Urgent: Verify Your Account</p>

          <hr style={{ margin: "20px 0" }} />

          <p>Dear Employee,</p>

          <p>
            Our security monitoring system detected unusual login activity on your
            corporate account.
          </p>

          <p>
            To prevent account suspension, please verify your account within
            <strong> 30 minutes</strong>.
          </p>

          <p>
            Failure to verify may result in temporary loss of email access.
          </p>

          <div style={{ textAlign: "center", margin: "35px 0" }}>

            <button
              className="btn btn-primary"
              onClick={() => setDetected(true)}
            >
              Verify Account
            </button>

          </div>

          <p style={{ color: "#888", fontSize: ".9rem" }}>
            IT Security Department<br />
            Aegis MedTech Systems
          </p>

        </div>

      </div>

    </div>
  );
}