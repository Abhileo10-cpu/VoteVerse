import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ===============================
// AUTH
// ===============================
import Login from "./pages/Login";

// ===============================
// MAIN DASHBOARD
// ===============================
import Dashboard from "./pages/Dashboard";

// ===============================
// GOVERNMENT VOTING
// ===============================
import StateSelection from "./pages/StateSelection";
import Constituency from "./pages/Constituency";
import VotePage from "./pages/VotePage";
import ThankYou from "./pages/ThankYou";
import Results from "./pages/Results";
import AdminDashboard from "./pages/AdminDashboard";

// ===============================
// COLLEGE VOTING
// ===============================
import CollegeVoting from "./pages/CollegeVoting";
import CollegeVotePage from "./pages/CollegeVotePage";
import CollegeThankYou from "./pages/CollegeThankYou";
import CollegeResults from "./pages/CollegeResults";

function App() {
  return (
    <Router>
      <Routes>

        {/* ===============================
            AUTH
        =============================== */}
        <Route path="/" element={<Login />} />

        {/* ===============================
            MAIN DASHBOARD
        =============================== */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* ===============================
            GOVERNMENT VOTING
        =============================== */}

        <Route
          path="/state"
          element={<StateSelection />}
        />

        <Route
          path="/constituency"
          element={<Constituency />}
        />

        {/* OLD GOVERNMENT VOTE ROUTE */}
        <Route
          path="/vote"
          element={<VotePage />}
        />

        {/* GOVERNMENT VOTE BY CONSTITUENCY */}
        <Route
          path="/vote/:constituency"
          element={<VotePage />}
        />

        <Route
          path="/thank-you"
          element={<ThankYou />}
        />

        {/* GOVERNMENT LIVE RESULTS */}
        <Route
          path="/results"
          element={<Results />}
        />

        {/* GOVERNMENT ADMIN */}
        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        {/* ===============================
            COLLEGE VOTING
        =============================== */}

        {/* COLLEGE ELECTION POSITIONS */}
        <Route
          path="/college-voting"
          element={<CollegeVoting />}
        />

        {/* COLLEGE CANDIDATE VOTING */}
        <Route
          path="/college-vote/:position"
          element={<CollegeVotePage />}
        />

        {/* COLLEGE THANK YOU / VOTE SLIP */}
        <Route
          path="/college-thank-you"
          element={<CollegeThankYou />}
        />

        {/* COLLEGE LIVE RESULTS 🆕 */}
        <Route
          path="/college-results"
          element={<CollegeResults />}
        />

        {/* ===============================
            FALLBACK
        =============================== */}
        <Route path="*" element={<Login />} />

      </Routes>
    </Router>
  );
}

export default App;