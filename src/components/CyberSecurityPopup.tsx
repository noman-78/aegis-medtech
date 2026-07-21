import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CyberSecurityPopup() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-box">

        <div className="popup-icon">
          🔒
        </div>

        <h2>Cybersecurity Awareness Demo</h2>

        <p>
          Welcome to <strong>Aegis MedTech Systems</strong>.
        </p>

        <p>
          This website contains a phishing awareness simulation created for
          educational purposes.
        </p>

        <div className="popup-warning">
          ⚠ No real passwords will ever be collected.
        </div>

        <div className="popup-buttons">

          <button
            className="btn btn-primary"
            onClick={() => navigate("/phishing-simulation")}
          >
            Start Simulation
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => setOpen(false)}
          >
            Skip & Continue
          </button>

        </div>

      </div>
    </div>
  );
}