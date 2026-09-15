import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import Navbar from "../components/Navbar";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function CollegeResults() {
  const COLLEGE_NAME = "VoteVerse College";

  const [candidates, setCandidates] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);

  // =========================
  // FETCH LIVE RESULTS
  // =========================

  const fetchResults = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/college/results/${encodeURIComponent(
          COLLEGE_NAME
        )}`
      );

      const data = await response.json();

      setCandidates(data.candidates || []);
      setTotalVotes(data.totalVotes || 0);
    } catch (error) {
      console.error("College results error:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // AUTO REFRESH
  // =========================

  useEffect(() => {
    fetchResults();

    const interval = setInterval(() => {
      fetchResults();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // =========================
  // RESET COLLEGE ELECTION
  // =========================

  const resetCollegeElection = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset the College Election?\n\nAll college votes will be permanently deleted and vote counts will become 0."
    );

    if (!confirmed) return;

    try {
      setResetting(true);

      const response = await fetch(
        `http://localhost:5000/api/college/reset-votes/${encodeURIComponent(
          COLLEGE_NAME
        )}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Reset failed");
      }

      alert("College Election has been reset successfully!");

      // Immediately refresh results
      fetchResults();
    } catch (error) {
      console.error("College reset error:", error);
      alert("Failed to reset college election.");
    } finally {
      setResetting(false);
    }
  };

  // =========================
  // SORT CANDIDATES
  // =========================

  const sortedCandidates = [...candidates].sort(
    (a, b) => b.votes - a.votes
  );

  const leadingCandidate =
    sortedCandidates.length > 0
      ? sortedCandidates[0]
      : null;

  // =========================
  // PIE CHART
  // =========================

  const chartData = {
    labels: sortedCandidates.map(
      (candidate) => candidate.name
    ),

    datasets: [
      {
        data: sortedCandidates.map(
          (candidate) => candidate.votes
        ),

        backgroundColor: [
          "#2563EB",
          "#16A34A",
          "#DC2626",
          "#7C3AED",
          "#EA580C",
          "#0891B2",
          "#DB2777",
          "#65A30D",
          "#CA8A04",
          "#475569",
          "#9333EA",
          "#0F766E",
        ],

        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,

    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <>
        <Navbar />

        <div
          style={{
            minHeight: "100vh",
            padding: "50px",
            textAlign: "center",
          }}
        >
          <h2>Loading College Results...</h2>
        </div>
      </>
    );
  }

  // =========================
  // PAGE
  // =========================

  return (
    <>
      <Navbar />

      <div
        className="page"
        style={{
          minHeight: "100vh",
          padding: "40px 20px",
        }}
      >
        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}

        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto 30px auto",
            padding: "45px 30px",
            borderRadius: "22px",
            textAlign: "center",
            color: "white",
            background:
              "linear-gradient(135deg, #4C1D95, #7C3AED, #A855F7)",
            boxShadow:
              "0 15px 35px rgba(124,58,237,0.25)",
          }}
        >
          <div
            style={{
              fontSize: "55px",
            }}
          >
            🎓
          </div>

          <h1
            style={{
              margin: "10px 0",
            }}
          >
            College Election Results
          </h1>

          <p
            style={{
              margin: 0,
              opacity: 0.9,
            }}
          >
            {COLLEGE_NAME}
          </p>

          <p
            style={{
              marginTop: "10px",
              opacity: 0.9,
            }}
          >
            Live counting updates automatically every 3 seconds
          </p>
        </div>

        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {/* ========================= */}
          {/* LIVE + RESET */}
          {/* ========================= */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              gap: "15px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#16A34A",
                fontWeight: "600",
              }}
            >
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#16A34A",
                  display: "inline-block",
                }}
              />

              LIVE COUNTING
            </div>

            <button
              onClick={resetCollegeElection}
              disabled={resetting}
              style={{
                padding: "12px 22px",
                border: "none",
                borderRadius: "10px",
                background: "#DC2626",
                color: "white",
                fontWeight: "700",
                cursor: resetting
                  ? "not-allowed"
                  : "pointer",
                opacity: resetting ? 0.6 : 1,
              }}
            >
              {resetting
                ? "Resetting..."
                : "🔄 Reset College Election"}
            </button>
          </div>

          {/* ========================= */}
          {/* STATS */}
          {/* ========================= */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "20px",
              marginBottom: "30px",
            }}
          >
            {/* TOTAL VOTES */}

            <div
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "16px",
                boxShadow:
                  "0 8px 25px rgba(0,0,0,0.08)",
              }}
            >
              <p
                style={{
                  color: "#777",
                  margin: 0,
                }}
              >
                Total Votes
              </p>

              <h2
                style={{
                  color: "#7C3AED",
                  fontSize: "35px",
                  margin: "10px 0 0",
                }}
              >
                {totalVotes}
              </h2>
            </div>

            {/* CANDIDATES */}

            <div
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "16px",
                boxShadow:
                  "0 8px 25px rgba(0,0,0,0.08)",
              }}
            >
              <p
                style={{
                  color: "#777",
                  margin: 0,
                }}
              >
                Candidates
              </p>

              <h2
                style={{
                  color: "#2563EB",
                  fontSize: "35px",
                  margin: "10px 0 0",
                }}
              >
                {candidates.length}
              </h2>
            </div>

            {/* LEADER */}

            <div
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "16px",
                boxShadow:
                  "0 8px 25px rgba(0,0,0,0.08)",
              }}
            >
              <p
                style={{
                  color: "#777",
                  margin: 0,
                }}
              >
                Currently Leading
              </p>

              <h2
                style={{
                  color: "#16A34A",
                  margin: "10px 0 0",
                }}
              >
                {leadingCandidate
                  ? leadingCandidate.name
                  : "No Votes Yet"}
              </h2>
            </div>
          </div>

          {/* ========================= */}
          {/* CHART + LEADER */}
          {/* ========================= */}

          {candidates.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(350px, 1fr))",
                gap: "25px",
                marginBottom: "30px",
              }}
            >
              {/* PIE CHART */}

              <div
                style={{
                  background: "white",
                  padding: "25px",
                  borderRadius: "20px",
                  boxShadow:
                    "0 8px 25px rgba(0,0,0,0.08)",
                }}
              >
                <h2
                  style={{
                    textAlign: "center",
                    color: "#4C1D95",
                    marginBottom: "25px",
                  }}
                >
                  Vote Distribution
                </h2>

                <div
                  style={{
                    maxWidth: "420px",
                    margin: "0 auto",
                  }}
                >
                  <Pie
                    data={chartData}
                    options={chartOptions}
                  />
                </div>
              </div>

              {/* LEADER CARD */}

              <div
                style={{
                  background:
                    "linear-gradient(135deg, #F5F3FF, #FFFFFF)",
                  padding: "35px",
                  borderRadius: "20px",
                  boxShadow:
                    "0 8px 25px rgba(0,0,0,0.08)",
                  textAlign: "center",
                  border: "2px solid #DDD6FE",
                }}
              >
                <div
                  style={{
                    fontSize: "65px",
                  }}
                >
                  🏆
                </div>

                <h2
                  style={{
                    color: "#7C3AED",
                  }}
                >
                  Leading Candidate
                </h2>

                {leadingCandidate ? (
                  <>
                    <h1
                      style={{
                        color: "#111827",
                      }}
                    >
                      {leadingCandidate.name}
                    </h1>

                    <p
                      style={{
                        color: "#666",
                        fontSize: "18px",
                      }}
                    >
                      Position:{" "}
                      {leadingCandidate.position}
                    </p>

                    <h2
                      style={{
                        color: "#16A34A",
                        fontSize: "35px",
                      }}
                    >
                      {leadingCandidate.votes} Votes
                    </h2>
                  </>
                ) : (
                  <p>
                    Waiting for the first vote...
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ========================= */}
          {/* LIVE CANDIDATE COUNTING */}
          {/* ========================= */}

          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "20px",
              boxShadow:
                "0 8px 25px rgba(0,0,0,0.08)",
            }}
          >
            <h2
              style={{
                color: "#4C1D95",
                marginBottom: "25px",
              }}
            >
              🗳️ Live Candidate Counting
            </h2>

            {sortedCandidates.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "#777",
                }}
              >
                No college votes have been cast yet.
              </div>
            ) : (
              sortedCandidates.map(
                (candidate, index) => {
                  const percentage =
                    totalVotes > 0
                      ? (
                          (candidate.votes /
                            totalVotes) *
                          100
                        ).toFixed(1)
                      : 0;

                  return (
                    <div
                      key={candidate._id}
                      style={{
                        padding: "20px",
                        marginBottom: "15px",
                        borderRadius: "14px",
                        border:
                          index === 0
                            ? "2px solid #7C3AED"
                            : "1px solid #E5E7EB",
                        background:
                          index === 0
                            ? "#FAF5FF"
                            : "#FFFFFF",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems: "center",
                          gap: "15px",
                        }}
                      >
                        <div>
                          <h3
                            style={{
                              margin: 0,
                              color: "#1F2937",
                            }}
                          >
                            #{index + 1}{" "}
                            {candidate.name}

                            {index === 0 &&
                              " 🏆"}
                          </h3>

                          <p
                            style={{
                              margin:
                                "6px 0 0",
                              color: "#777",
                            }}
                          >
                            {candidate.position}
                          </p>
                        </div>

                        <div
                          style={{
                            textAlign: "right",
                          }}
                        >
                          <strong
                            style={{
                              fontSize: "22px",
                              color: "#7C3AED",
                            }}
                          >
                            {candidate.votes}
                          </strong>

                          <div
                            style={{
                              color: "#777",
                              fontSize: "14px",
                            }}
                          >
                            {percentage}%
                          </div>
                        </div>
                      </div>

                      {/* PROGRESS BAR */}

                      <div
                        style={{
                          height: "8px",
                          background: "#E5E7EB",
                          borderRadius: "20px",
                          marginTop: "15px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${percentage}%`,
                            background:
                              index === 0
                                ? "linear-gradient(90deg, #7C3AED, #A855F7)"
                                : "#2563EB",
                            borderRadius: "20px",
                            transition:
                              "width 0.5s ease",
                          }}
                        />
                      </div>
                    </div>
                  );
                }
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default CollegeResults;