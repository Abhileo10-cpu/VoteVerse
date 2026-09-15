import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [otpStep, setOtpStep] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  /* =========================
     LOGIN → SEND OTP
  ========================= */

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          voterId: userId,
          password: password,
        }
      );

      if (res.data.success) {
        setOtpStep(true);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     VERIFY OTP → JWT
  ========================= */

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        {
          voterId: userId,
          otp: otp,
        }
      );

      if (res.data.success) {
        /* =========================
           STORE AUTHENTICATION
        ========================= */

        localStorage.setItem(
          "voteverseToken",
          res.data.token
        );

        localStorage.setItem(
          "voteverseVoter",
          JSON.stringify(res.data.voter)
        );

        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "OTP verification failed."
      );
    } finally {
      setLoading(false);
    }
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

            {!otpStep ? (

              /* =========================
                 LOGIN FORM
              ========================= */

              <form onSubmit={handleLogin}>

                <label>User ID / Email</label>

                <input
                  className="input"
                  type="text"
                  placeholder="Enter your ID or email"
                  value={userId}
                  onChange={(e) =>
                    setUserId(e.target.value)
                  }
                  required
                />

                <label>Password</label>

                <input
                  className="input"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

                {error && (
                  <p
                    style={{
                      color: "#d32f2f",
                      marginTop: "10px",
                      textAlign: "center",
                    }}
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="primary-btn login-submit"
                  disabled={loading}
                >
                  {loading
                    ? "Sending OTP..."
                    : "Login →"}
                </button>

              </form>

            ) : (

              /* =========================
                 OTP FORM
              ========================= */

              <form onSubmit={handleVerifyOTP}>

                <label>Verification OTP</label>

                <input
                  className="input"
                  type="text"
                  inputMode="numeric"
                  maxLength="6"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) =>
                    setOtp(
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6)
                    )
                  }
                  required
                />

                <p
                  style={{
                    fontSize: "13px",
                    color: "#666",
                    marginTop: "8px",
                    textAlign: "center",
                  }}
                >
                  OTP sent to your registered email.
                  <br />
                  Valid for 5 minutes.
                </p>

                {error && (
                  <p
                    style={{
                      color: "#d32f2f",
                      marginTop: "10px",
                      textAlign: "center",
                    }}
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  className="primary-btn login-submit"
                  disabled={
                    loading || otp.length !== 6
                  }
                >
                  {loading
                    ? "Verifying..."
                    : "Verify OTP →"}
                </button>

              </form>

            )}

            <button
              className="forgot-btn"
              type="button"
              onClick={() => {
                setError("");
                setOtp("");
                setOtpStep(false);
              }}
            >
              {otpStep
                ? "← Back to Login"
                : "Forgot Password?"}
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