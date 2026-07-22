import { useState } from "react";
import { Link } from "react-router-dom";

export default function PhishingSimulation() {

  const [step, setStep] = useState<"email" | "login" | "result">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (step === "result") {
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
            Phishing Simulation Complete
          </h1>

          <p
            style={{
              textAlign: "center",
              color: "#555",
              marginBottom: 30
            }}
          >
            This was a fake phishing website created for cybersecurity awareness.
          </p>

          <div
            style={{
              background: "#fff7ed",
              border: "1px solid #fdba74",
              padding: 20,
              borderRadius: 8,
              marginBottom: 30
            }}
          >

            <strong>Simulation Result</strong>

            <br /><br />

            Email Entered:

            <br />

            <strong>{email || "Not entered"}</strong>

            <br /><br />

            Password:

            <strong>
              {" "}
              {password ? "••••••••" : "Not entered"}
            </strong>

            <br /><br />

            <span style={{ color: "green" }}>
              ✓ No credentials were stored. This was only an educational simulation.
            </span>

          </div>

          <div className="grid g2">

            <div className="card">

              <h3>🚩 Warning Signs</h3>

              <ul>
                <li>Urgent email</li>
                <li>Suspicious sender</li>
                <li>Requested login credentials</li>
                <li>Threatened account suspension</li>
                <li>Unknown verification link</li>
              </ul>

            </div>

            <div className="card">

              <h3>🛡 Prevention</h3>

              <ul>
                <li>Verify sender email</li>
                <li>Check website URL</li>
                <li>Enable MFA</li>
                <li>Never log in from email links</li>
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

            <strong>Security Result:</strong>

            <br />

            Aegis MedTech successfully detected and blocked this simulated phishing attack before credentials could be stolen.

          </div>

          <div style={{ textAlign: "center", marginTop: 35 }}>

            <Link to="/" className="btn btn-primary">
              Continue to Website
            </Link>

          </div>

        </div>

      </div>
    );
  }

  if (step === "login") {

    return (

      <div className="container" style={{ maxWidth: 500, padding: "60px 20px" }}>

        <div className="card">

          <h2 style={{ textAlign: "center" }}>
            Aegis MedTech Secure Portal
          </h2>

          <p
            style={{
              textAlign: "center",
              color: "#666",
              marginBottom: 30
            }}
          >
            Please verify your account credentials.
          </p>

          <label>Email Address</label>

          <input
            className="input"
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            placeholder="employee@aegismedtech.com"
          />

          <br /><br />

          <label>Password</label>

          <input
            className="input"
            type="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            placeholder="Password"
          />

          <br /><br />

          <button
            className="btn btn-primary"
            style={{ width:"100%" }}
            onClick={()=>setStep("result")}
          >
            Sign In
          </button>

        </div>

      </div>

    );

  }

  // PART B CONTINUES BELOW
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

          <p>
            <strong>From:</strong> IT Support &lt;support@aegis-security-alert.com&gt;
          </p>

          <p>
            <strong>To:</strong> employee@aegismedtech.com
          </p>

          <p>
            <strong>Subject:</strong> Urgent: Verify Your Account
          </p>

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

          <div
            style={{
              background: "#fef3c7",
              border: "1px solid #f59e0b",
              padding: 15,
              borderRadius: 8,
              margin: "25px 0"
            }}
          >
            <strong>Security Notice</strong>
            <br />
            Click the button below to verify your corporate account.
          </div>

          <div style={{ textAlign: "center", margin: "35px 0" }}>

            <button
              className="btn btn-primary"
              onClick={() => setStep("login")}
            >
              Verify Account
            </button>

          </div>

          <p style={{ color: "#888", fontSize: ".9rem" }}>
            IT Security Department
            <br />
            Aegis MedTech Systems
          </p>

        </div>

      </div>

    </div>
  );
}