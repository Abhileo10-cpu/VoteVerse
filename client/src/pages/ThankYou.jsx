import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function ThankYou() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <main className="success-wrapper">

        <div className="success-card">

          <div className="success-icon">
            ✓
          </div>

          <h1>
            Vote Cast Successfully!
          </h1>

          <p>
            Thank you for participating in the democratic process.
          </p>

          <div className="vote-details">

            <div className="vote-detail">
              <strong>CONSTITUENCY</strong>
              <span>West Bengal</span>
            </div>

            <div className="vote-detail">
              <strong>STATE</strong>
              <span>West Bengal</span>
            </div>

            <div className="vote-detail">
              <strong>DATE & TIME</strong>
              <span>
                {new Date().toLocaleString()}
              </span>
            </div>

            <div className="vote-detail">
              <strong>VOTE ID</strong>
              <span>
                #WB{Math.floor(100000 + Math.random() * 900000)}
              </span>
            </div>

          </div>

          <button
            className="primary-btn"
            style={{ marginTop: "30px" }}
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard →
          </button>

        </div>

      </main>
    </>
  );
}

export default ThankYou;