import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const [voterId, setVoterId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!voterId || !password) {
      setError("Admin ID and password are required.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/admin/login",
        {
          voterId,
          password,
        }
      );

      if (res.data.success && res.data.token) {
        localStorage.setItem(
          "voteverseAdminToken",
          res.data.token
        );

        localStorage.setItem(
          "voteverseAdmin",
          JSON.stringify(res.data.admin)
        );

        navigate("/admin");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Admin login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <div className="container">

        <div className="login-container">

          <div className="login-card">

            <h1>Admin Login</h1>

            <p>Election Command Center</p>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>

              <div className="form-group">
                <label>Admin ID</label>

                <input
                  type="text"
                  value={voterId}
                  onChange={(e) =>
                    setVoterId(e.target.value)
                  }
                  placeholder="Enter Admin ID"
                  autoComplete="username"
                />
              </div>

              <div className="form-group">
                <label>Password</label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter Password"
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Authenticating..."
                  : "Login"}
              </button>

            </form>

          </div>

        </div>

      </div>
    </main>
  );
}

export default AdminLogin;