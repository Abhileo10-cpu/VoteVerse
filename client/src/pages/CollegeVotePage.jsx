import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function CollegeVotePage() {
  const { position } = useParams();

  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCandidates();
  }, [position]);

  const loadCandidates = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/college/candidates/${encodeURIComponent(
          position
        )}`
      );

      setCandidates(res.data);
    } catch (err) {
      console.log("Candidate loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  const castVote = async () => {
    if (!selectedCandidate) {
      alert("Please select a candidate first.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cast your vote? This cannot be changed."
    );

    if (!confirmed) return;

    // Temporary student/voter ID
    // Later connect this to real login
    let voterId = localStorage.getItem("collegeVoterId");

    if (!voterId) {
      voterId = "demo-" + Math.random().toString(36).substring(2, 10);

      localStorage.setItem(
        "collegeVoterId",
        voterId
      );
    }

    try {
      setSubmitting(true);

      const res = await axios.post(
        "http://localhost:5000/api/college/vote",
        {
          candidateId: selectedCandidate,
          voterId,
        }
      );

      alert(res.data.message);

      navigate("/college-thank-you");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Unable to record vote."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <div
        className="page"
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <div style={{ fontSize: "45px" }}>🎓</div>

          <h1>{position}</h1>

          <p
            style={{
              color: "#666",
              marginTop: "10px",
            }}
          >
            Select one candidate carefully.
          </p>
        </div>

        {loading ? (
          <p style={{ textAlign: "center" }}>
            Loading candidates...
          </p>
        ) : candidates.length === 0 ? (
          <div
            className="card"
            style={{
              padding: "30px",
              textAlign: "center",
            }}
          >
            No candidates found.
          </div>
        ) : (
          <>
            <div>
              {candidates.map((candidate) => {
                const selected =
                  selectedCandidate === candidate._id;

                return (
                  <div
                    key={candidate._id}
                    onClick={() =>
                      setSelectedCandidate(candidate._id)
                    }
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "22px",
                      marginBottom: "15px",
                      background: "white",
                      borderRadius: "16px",
                      cursor: "pointer",

                      border: selected
                        ? "3px solid #22C55E"
                        : "2px solid #ddd",

                      boxShadow: selected
                        ? "0 0 20px rgba(34,197,94,.25)"
                        : "0 5px 15px rgba(0,0,0,.08)",

                      transition: "0.25s",
                    }}
                  >
                    <div>
                      <h2
                        style={{
                          color: "#0B3D91",
                        }}
                      >
                        {candidate.name}
                      </h2>

                      <p
                        style={{
                          marginTop: "6px",
                        }}
                      >
                        {candidate.department}
                      </p>

                      <p
                        style={{
                          color: "#666",
                        }}
                      >
                        {candidate.semester}
                      </p>
                    </div>

                    <div
                      style={{
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "50px",
                        }}
                      >
                        {candidate.symbol || "🗳️"}
                      </div>

                      <input
                        type="radio"
                        checked={selected}
                        readOnly
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={castVote}
              disabled={submitting}
              style={{
                width: "100%",
                marginTop: "25px",

                background: submitting
                  ? "#999"
                  : "linear-gradient(135deg,#0B3D91,#2563EB)",

                color: "white",

                border: "none",

                padding: "18px",

                borderRadius: "12px",

                fontSize: "18px",

                fontWeight: "bold",

                cursor: submitting
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              {submitting
                ? "Recording Vote..."
                : "🗳️ Confirm Vote"}
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default CollegeVotePage;