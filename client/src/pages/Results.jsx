import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Results() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    loadResults();

    const interval = setInterval(
      loadResults,
      5000
    );

    return () => clearInterval(interval);
  }, []);

  const loadResults = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/results"
      );

      setResults(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const sortedResults = [...results].sort(
    (a, b) => (b.votes || 0) - (a.votes || 0)
  );

  const totalVotes = sortedResults.reduce(
    (sum, candidate) =>
      sum + (candidate.votes || 0),
    0
  );

  const leader = sortedResults[0];

  return (
    <>
      <Navbar />

      <main className="page">

        <div className="container">

          <div className="results-top">

            <div>
              <span className="badge badge-blue">
                LIVE COUNTING
              </span>

              <h1 className="page-title">
                Election Results
              </h1>

              <p className="page-subtitle">
                Results are updated automatically.
              </p>
            </div>

            <div className="live-indicator">
              <span></span>
              LIVE
            </div>

          </div>

          <div className="result-stats">

            <div className="result-stat">
              <small>Total Votes</small>
              <strong>{totalVotes}</strong>
            </div>

            <div className="result-stat">
              <small>Candidates</small>
              <strong>{sortedResults.length}</strong>
            </div>

            <div className="result-stat">
              <small>Leading</small>
              <strong>
                {leader?.name || "-"}
              </strong>
            </div>

          </div>

          <div className="results-list">

            {sortedResults.map(
              (candidate, index) => {

                const percentage =
                  totalVotes === 0
                    ? 0
                    : (
                        ((candidate.votes || 0) /
                          totalVotes) *
                        100
                      ).toFixed(1);

                return (

                  <div
                    className={`result-card ${
                      index === 0
                        ? "result-leader"
                        : ""
                    }`}
                    key={candidate._id || index}
                  >

                    <div className="result-rank">
                      {index + 1}
                    </div>

                    <div className="result-info">

                      <strong>
                        {candidate.name}
                      </strong>

                      <small>
                        {candidate.party ||
                          "Independent"}
                      </small>

                      <div className="result-bar">
                        <div
                          style={{
                            width: `${percentage}%`,
                          }}
                        ></div>
                      </div>

                    </div>

                    <div className="result-votes">
                      <strong>
                        {candidate.votes || 0}
                      </strong>

                      <small>
                        {percentage}%
                      </small>
                    </div>

                  </div>

                );
              }
            )}

          </div>

        </div>

      </main>
    </>
  );
}

export default Results;