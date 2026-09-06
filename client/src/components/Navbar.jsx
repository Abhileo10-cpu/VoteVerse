import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <>
      <nav className="navbar">

        <div
          className="brand"
          onClick={() => navigate("/dashboard")}
          style={{ cursor: "pointer" }}
        >

          <div className="brand-logo">
            V
          </div>

          <div>
            <div className="brand-name">
              Vote<span>V</span>erse
            </div>

            <div className="brand-subtitle">
              Digital Voting System
            </div>
          </div>

        </div>

        <div className="nav-links">

          <Link to="/dashboard">
            Home
          </Link>

          <Link to="/dashboard">
            Dashboard
          </Link>

          <Link to="/results">
            Results
          </Link>

          <Link to="/admin">
            Admin
          </Link>

          <button
            className="profile-button"
            onClick={() => navigate("/")}
          >
            A &nbsp; Logout
          </button>

        </div>

      </nav>

      <div className="tricolor-line"></div>
    </>
  );
}

export default Navbar;