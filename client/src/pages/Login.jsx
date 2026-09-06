import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Keep your existing backend authentication here if you already have it.
    // For the UI demo, continue to dashboard.
    navigate("/dashboard");
  };

  return (
    <div className="login-page">
      <div className="login-background">

        <div className="flag-glow"></div>

        {/* Government Header */}
        <div className="login-government">

          <div className="emblem-box">
            <div className="emblem-symbol">🦁</div>
          </div>

          <div>
            <div className="hindi-title">
              भारत निर्वाचन आयोग
            </div>

            <div className="english-title">
              Election Commission of India
            </div>

            <div className="tagline">
              FREE • FAIR • FEARLESS
            </div>
          </div>

        </div>

        {/* Main */}
        <div className="login-main">

          {/* Left */}
          <div className="login-intro">

            <div className="flag-ribbon">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <h1>
              Your Vote
              <br />
              <span>Shapes</span>
              <br />
              The Future
            </h1>

            <p>
              A secure and transparent digital
              voting experience.
            </p>

            <div className="democracy-card">
              <span>🇮🇳</span>
              <div>
                <strong>One Vote.</strong>
                <small>One Voice. One Future.</small>
              </div>
            </div>

          </div>

          {/* Login Card */}
          <div className="login-card">

            <div className="voteverse-mark">
              <div className="voteverse-circle">
                V
              </div>
            </div>

            <h2>
              Vote<span>V</span>erse
            </h2>

            <p className="login-subtitle">
              Government Voting Portal
            </p>

            <div className="tricolor-line"></div>

            <form onSubmit={handleLogin}>

              <label>User ID / Email</label>

              <input
                className="input"
                type="text"
                placeholder="Enter your ID or email"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />

              <label>Password</label>

              <input
                className="input"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="submit"
                className="primary-btn login-submit"
              >
                Login →
              </button>

            </form>

            <button className="forgot-btn">
              Forgot Password?
            </button>

            <div className="security-info">
              🔒 Secure &nbsp; • &nbsp; Encrypted &nbsp; • &nbsp; Private
            </div>

          </div>

        </div>

        <div className="login-footer">
          © 2026 VoteVerse • Digital Voting System
        </div>

      </div>
    </div>
  );
}

export default Login;