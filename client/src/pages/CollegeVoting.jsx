import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function CollegeVoting() {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadPositions();
  }, []);

  const loadPositions = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/college/positions"
      );

      setPositions(res.data);
    } catch (err) {
      console.log("Position loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (position) => {
    if (position.toLowerCase().includes("class")) return "🎓";
    if (position.toLowerCase().includes("cultural")) return "🎭";
    if (position.toLowerCase().includes("sports")) return "⚽";

    return "🗳️";
  };

  return (
    <>
      <Navbar />

      <div className="page">
        <div
          style={{
            background:
              "linear-gradient(135deg, #071A52, #0B3D91)",
            color: "white",
            padding: "40px",
            borderRadius: "20px",
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <div style={{ fontSize: "55px" }}>🎓</div>

          <h1>College Election Portal</h1>

          <p style={{ marginTop: "10px" }}>
            Choose a position and cast your vote.
          </p>
        </div>

        <h2 style={{ marginBottom: "20px" }}>
          Available Elections
        </h2>

        {loading ? (
          <p>Loading elections...</p>
        ) : positions.length === 0 ? (
          <div
            className="card"
            style={{
              padding: "30px",
              textAlign: "center",
            }}
          >
            <h3>No college elections available.</h3>

            <p>
              Add candidates from MongoDB first.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "20px",
            }}
          >
            {positions.map((position) => (
              <div
                key={position}
                onClick={() =>
                  navigate(
                    `/college-vote/${encodeURIComponent(position)}`
                  )
                }
                className="card"
                style={{
                  padding: "30px",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "0.3s",
                }}
              >
                <div style={{ fontSize: "50px" }}>
                  {getIcon(position)}
                </div>

                <h2
                  style={{
                    marginTop: "15px",
                    color: "#0B3D91",
                  }}
                >
                  {position}
                </h2>

                <p
                  style={{
                    color: "#666",
                    marginTop: "10px",
                  }}
                >
                  Select your preferred candidate.
                </p>

                <button
                  style={{
                    marginTop: "20px",
                    background: "#0B3D91",
                    color: "white",
                    border: "none",
                    padding: "12px 25px",
                    borderRadius: "8px",
                    fontSize: "15px",
                  }}
                >
                  View Candidates →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default CollegeVoting;