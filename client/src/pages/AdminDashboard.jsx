import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalVoters: 0,
    totalVotes: 0,
    turnout: 0,
    leader: null,
  });

  useEffect(() => {
    loadStats();

    const interval = setInterval(
      loadStats,
      5000
    );

    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/stats"
      );

      setStats(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const resetVotes = async () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset the entire election? All votes will be deleted."
    );

    if (!confirmReset) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/reset-votes"
      );

      alert(res.data.message);

      loadStats();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Reset failed!"
      );
    }
  };

  return (
    <>
      <Navbar />

      <main className="page">

        <div className="container">

          <div className="admin-hero">

            <div>
              <span>● LIVE SYSTEM</span>

              <h1>
                Election Command Center
              </h1>

              <p>
                West Bengal Live Monitoring Dashboard
              </p>
            </div>

            <div className="admin-time">
              Last Updated
              <strong>
                {new Date().toLocaleTimeString()}
              </strong>
            </div>

          </div>

          <div className="admin-grid">

            <div className="admin-stat blue">
              <span>Registered Voters</span>
              <strong>{stats.totalVoters}</strong>
            </div>

            <div className="admin-stat green">
              <span>Votes Cast</span>
              <strong>{stats.totalVotes}</strong>
            </div>

            <div className="admin-stat orange">
              <span>Turnout</span>
              <strong>{stats.turnout}%</strong>
            </div>

            <div className="admin-stat purple">
              <span>Leading Candidate</span>
              <strong>
                {stats.leader?.name || "-"}
              </strong>
            </div>

          </div>

          <div className="admin-section">

            <div className="section-title">
              <h2>Live Election Status</h2>

              <span className="live-indicator">
                <span></span>
                LIVE
              </span>
            </div>

            <div className="admin-status">

              <div>
                <small>Election Status</small>
                <strong className="status-running">
                  ● Running
                </strong>
              </div>

              <div>
                <small>Current Leader</small>
                <strong>
                  {stats.leader?.name || "-"}
                </strong>
              </div>

              <div>
                <small>Party</small>
                <strong>
                  {stats.leader?.party || "-"}
                </strong>
              </div>

              <div>
                <small>Leader Votes</small>
                <strong>
                  {stats.leader?.votes || 0}
                </strong>
              </div>

            </div>

          </div>

          <div className="admin-section">

            <div className="section-title">
              <h2>Recent Activity</h2>
            </div>

            <div className="activity-list">

              <div>
                <span>🗳️</span>
                <p>
                  Voting system active
                  <small>Live monitoring enabled</small>
                </p>
              </div>

              <div>
                <span>📊</span>
                <p>
                  Vote count updating
                  <small>Automatic refresh every 5 seconds</small>
                </p>
              </div>

              <div>
                <span>🔒</span>
                <p>
                  Database connected
                  <small>MongoDB online</small>
                </p>
              </div>

            </div>

          </div>

          <div className="danger-zone">

            <div>
              <h3>Election Management</h3>

              <p>
                Resetting the election permanently removes
                all current vote records.
              </p>
            </div>

            <button
              className="reset-button"
              onClick={resetVotes}
            >
              🗑 Reset Election
            </button>

          </div>

        </div>

      </main>
    </>
  );
}

export default AdminDashboard;