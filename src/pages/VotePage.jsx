import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function VotePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { constituency: constituencyParam } = useParams();
  const queryConstituency = new URLSearchParams(location.search).get("constituency") || "";

  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Supports both old navigation state and new URL parameter
  const constituency =
    location.state?.constituency ||
    queryConstituency ||
    constituencyParam ||
    "";

  useEffect(() => {
    if (!constituency) {
      alert("Please select a constituency first.");
      navigate("/constituency");
      return;
    }

    loadCandidates();
  }, [constituency]);

  const loadCandidates = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `http://localhost:5000/api/candidates/${encodeURIComponent(
          constituency
        )}`
      );

      setCandidates(response.data);
    } catch (error) {
      console.error("Candidate loading error:", error);
      alert("Unable to load candidates.");
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
      "Are you sure you want to cast your vote?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setSubmitting(true);

      // ONLY ONE REQUEST
      const response = await axios.post(
        "http://localhost:5000/api/vote",
        {
          candidateId: selectedCandidate,
        }
      );

      if (response.data.success) {
        alert("Vote cast successfully! 🎉");

        navigate("/thank-you");
      } else {
        alert(
          response.data.message ||
            "Vote could not be recorded."
        );
      }
    } catch (error) {
      console.error("Vote error:", error);

      alert(
        error.response?.data?.message ||
          "Vote failed. Please try again."
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
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "35px",
          }}
        >
          <div style={{ fontSize: "55px" }}>
            🗳️
          </div>

          <h1
            style={{
              color: "#0B3D91",
              marginTop: "10px",
            }}
          >
            Cast Your Vote
          </h1>

          <p
            style={{
              color: "#666",
              marginTop: "10px",
              fontSize: "17px",
            }}
          >
            Constituency:{" "}
            <strong>{constituency}</strong>
          </p>

          <p
            style={{
              color: "#777",
              marginTop: "8px",
            }}
          >
            Select one candidate carefully.
          </p>
        </div>

        {/* LOADING */}

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "50px",
            }}
          >
            Loading candidates...
          </div>
        ) : candidates.length === 0 ? (
          <div
            className="card"
            style={{
              textAlign: "center",
              padding: "40px",
            }}
          >
            <h2>No candidates found</h2>

            <p>
              There are currently no candidates
              available for this constituency.
            </p>

            <button
              onClick={() =>
                navigate("/constituency")
              }
              style={{
                marginTop: "20px",
                padding: "12px 25px",
                background: "#0B3D91",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              ← Select Another Constituency
            </button>
          </div>
        ) : (
          <>
            {/* CANDIDATES */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "20px",
              }}
            >
              {candidates.map((candidate) => {
                const isSelected =
                  selectedCandidate === candidate._id;

                return (
                  <div
                    key={candidate._id}
                    onClick={() =>
                      setSelectedCandidate(
                        candidate._id
                      )
                    }
                    style={{
                      background: "white",
                      padding: "25px",
                      borderRadius: "18px",
                      cursor: "pointer",

                      border: isSelected
                        ? "3px solid #22C55E"
                        : "2px solid #E5E7EB",

                      boxShadow: isSelected
                        ? "0 10px 30px rgba(34,197,94,0.25)"
                        : "0 6px 20px rgba(0,0,0,0.08)",

                      transition: "0.25s",

                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "60px",
                        marginBottom: "10px",
                      }}
                    >
                      {candidate.symbol || "🗳️"}
                    </div>

                    <h2
                      style={{
                        color: "#0B3D91",
                      }}
                    >
                      {candidate.name}
                    </h2>

                    <p
                      style={{
                        color: "#666",
                        marginTop: "8px",
                      }}
                    >
                      {candidate.party ||
                        "Independent"}
                    </p>

                    <div
                      style={{
                        marginTop: "18px",
                        color: isSelected
                          ? "#16A34A"
                          : "#888",
                        fontWeight: "bold",
                      }}
                    >
                      {isSelected
                        ? "✓ Selected"
                        : "Click to Select"}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CONFIRM VOTE BUTTON */}

            <button
              onClick={castVote}
              disabled={
                !selectedCandidate ||
                submitting
              }
              style={{
                display: "block",
                width: "100%",
                maxWidth: "500px",
                margin: "35px auto 0",

                padding: "18px",

                border: "none",

                borderRadius: "12px",

                background:
                  !selectedCandidate || submitting
                    ? "#9CA3AF"
                    : "linear-gradient(135deg, #0B3D91, #2563EB)",

                color: "white",

                fontSize: "18px",

                fontWeight: "bold",

                cursor:
                  !selectedCandidate || submitting
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

export default VotePage;