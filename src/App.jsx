import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// ===============================
// AUTH
// ===============================
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";

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

// ===============================
// ADMIN PROTECTION
// ===============================
function ProtectedAdminRoute() {
  const token = localStorage.getItem(
    "voteverseAdminToken"
  );

  if (!token) {
    return <Navigate to="/admin-login" replace />;
  }

  return <AdminDashboard />;
}

function App() {
  return (
    <Router>
      <Routes>

        {/* ===============================
            AUTH
        =============================== */}
        <Route
          path="/"
          element={<Login />}
        />

        {/* ===============================
            MAIN DASHBOARD
        =============================== */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

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

        <Route
          path="/vote"
          element={<VotePage />}
        />

        <Route
          path="/vote/:constituency"
          element={<VotePage />}
        />

        <Route
          path="/thank-you"
          element={<ThankYou />}
        />

        <Route
          path="/results"
          element={<Results />}
        />

        {/* ===============================
            ADMIN LOGIN
        =============================== */}

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        {/* ===============================
            PROTECTED ADMIN DASHBOARD
        =============================== */}

        <Route
          path="/admin"
          element={<ProtectedAdminRoute />}
        />

        {/* ===============================
            COLLEGE VOTING
        =============================== */}

        <Route
          path="/college-voting"
          element={<CollegeVoting />}
        />

        <Route
          path="/college-vote/:position"
          element={<CollegeVotePage />}
        />

        <Route
          path="/college-thank-you"
          element={<CollegeThankYou />}
        />

        <Route
          path="/college-results"
          element={<CollegeResults />}
        />

        {/* ===============================
            FALLBACK
        =============================== */}

        <Route
          path="*"
          element={<Login />}
        />

      </Routes>
    </Router>
  );
}

export default App;