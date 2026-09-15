import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Dashboard() {
  const navigate = useNavigate();

  // Primary voting portal options
  const cards = [
    {
      title: "Government Voting",
      icon: "🇮🇳",
      description: "Participate in constituency and state election voting.",
      button: "Enter Government Portal →",
      action: () => navigate("/state"),
      color: "#0B3D91",
    },
    {
      title: "College Voting",
      icon: "🎓",
      description: "Participate in campus elections and choose your representatives.",
      button: "Enter College Portal →",
      action: () => navigate("/college-voting"),
      color: "#6D28D9",
    },
  ];

  // Quick access navigational links
  const quickAccessItems = [
    {
      label: "Government Results",
      icon: "📊",
      path: "/results",
      style: { background: "#F8FAFC", border: "1px solid #D1D5DB" },
    },
    {
      label: "College Live Results",
      icon: "🎓",
      path: "/college-results",
      badge: "● LIVE COUNTING",
      style: {
        background: "#F5F3FF",
        border: "1px solid #C4B5FD",
        color: "#5B21B6",
        fontWeight: "600",
      },
    },
    {
      label: "Admin Dashboard",
      icon: "🛡️",
      path: "/admin",
      style: { background: "#F8FAFC", border: "1px solid #D1D5DB" },
    },
    {
      label: "College Elections",
      icon: "🎓",
      path: "/college-voting",
      style: { background: "#F8FAFC", border: "1px solid #D1D5DB" },
    },
    {
      label: "Government Voting",
      icon: "🇮🇳",
      path: "/state",
      style: { background: "#F8FAFC", border: "1px solid #D1D5DB" },
    },
  ];

  return (
    <>
      <Navbar />

      <div className="page" style={styles.pageWrapper}>
        {/* HERO SECTION */}
        <div style={styles.heroSection}>
          <div style={{ fontSize: "60px", marginBottom: "10px" }}>🗳️</div>
          <h1 style={styles.heroHeading}>Welcome to VoteVerse</h1>
          <p style={styles.heroSubtext}>
            One digital platform for government election simulation and college elections.
          </p>
        </div>

        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* PORTAL SELECTION HEADER */}
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <h2 style={{ color: "#0B3D91", marginBottom: "10px" }}>
              Choose Your Voting Portal
            </h2>
            <p style={{ color: "#666", fontSize: "16px" }}>
              Select the type of election you want to access.
            </p>
          </div>

          {/* MAIN PORTAL CARDS */}
          <div style={styles.cardsGrid}>
            {cards.map((card) => (
              <div
                key={card.title}
                onClick={card.action}
                style={styles.portalCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.08)";
                }}
              >
                <div style={{ fontSize: "70px", marginBottom: "15px" }}>
                  {card.icon}
                </div>
                <h2 style={{ color: card.color, marginBottom: "15px" }}>
                  {card.title}
                </h2>
                <p style={styles.cardDescription}>{card.description}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    card.action();
                  }}
                  style={{ ...styles.cardButton, background: card.color }}
                >
                  {card.button}
                </button>
              </div>
            ))}
          </div>

          {/* QUICK ACCESS */}
          <div style={styles.sectionContainer}>
            <h2 style={{ color: "#0B3D91", textAlign: "center", marginBottom: "25px" }}>
              Quick Access
            </h2>
            <div style={styles.quickAccessGrid}>
              {quickAccessItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate(item.path)}
                  style={{ ...styles.quickAccessButton, ...item.style }}
                >
                  {item.icon}
                  <br />
                  {item.label}
                  {item.badge && (
                    <>
                      <br />
                      <span style={styles.liveBadge}>{item.badge}</span>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ABOUT DEVELOPER */}
          <div style={{ ...styles.sectionContainer, textAlign: "center", marginTop: "30px" }}>
            <div style={{ fontSize: "45px", marginBottom: "10px" }}>👨‍💻</div>
            <h2 style={{ color: "#0B3D91", marginBottom: "10px" }}>
              About the Developer
            </h2>
            <h3 style={{ margin: "8px 0", fontSize: "22px" }}>Abhinandan Saha</h3>
            <p style={{ color: "#666", marginBottom: "12px" }}>
              B.Tech CSE Student • Software Developer
            </p>
            <p style={styles.devDescription}>
              VoteVerse is a digital voting platform developed with a passion for
              technology, software development, and meaningful digital experiences.
            </p>
            <button
              onClick={() =>
                window.open(
                  "https://www.instagram.com/me_abhis_lifestyle/",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
              style={styles.instagramButton}
            >
              📸 Follow Me on Instagram
            </button>
          </div>

          {/* FOOTER INFO */}
          <div style={{ textAlign: "center", marginTop: "35px", color: "#777" }}>
            <p>🔒 Secure Voting • 🗳️ Transparent Process • 📊 Live Results</p>
          </div>
        </div>
      </div>
    </>
  );
}

// Extracted styles object to keep JSX clean
const styles = {
  pageWrapper: {
    minHeight: "100vh",
    padding: "40px 20px",
  },
  heroSection: {
    maxWidth: "1200px",
    margin: "0 auto 35px auto",
    padding: "50px 30px",
    borderRadius: "24px",
    textAlign: "center",
    color: "white",
    background: "linear-gradient(135deg, #071A52 0%, #0B3D91 50%, #1D4ED8 100%)",
    boxShadow: "0 15px 40px rgba(11, 61, 145, 0.25)",
  },
  heroHeading: {
    margin: "0",
    fontSize: "clamp(32px, 5vw, 50px)",
  },
  heroSubtext: {
    fontSize: "18px",
    marginTop: "15px",
    opacity: 0.9,
    maxWidth: "700px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "25px",
    marginBottom: "35px",
  },
  portalCard: {
    background: "white",
    padding: "40px 30px",
    borderRadius: "22px",
    cursor: "pointer",
    textAlign: "center",
    border: "1px solid #E5E7EB",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
  },
  cardDescription: {
    color: "#666",
    lineHeight: "1.7",
    minHeight: "55px",
  },
  cardButton: {
    width: "100%",
    marginTop: "20px",
    color: "white",
    border: "none",
    padding: "14px 20px",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
  sectionContainer: {
    background: "white",
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.07)",
    border: "1px solid #E5E7EB",
  },
  quickAccessGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "15px",
  },
  quickAccessButton: {
    padding: "20px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "16px",
  },
  liveBadge: {
    display: "inline-block",
    marginTop: "8px",
    fontSize: "11px",
    color: "#16A34A",
    fontWeight: "700",
  },
  devDescription: {
    color: "#777",
    maxWidth: "650px",
    margin: "0 auto",
    lineHeight: "1.6",
  },
  instagramButton: {
    marginTop: "22px",
    background: "#0B3D91",
    color: "white",
    border: "none",
    padding: "13px 25px",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default Dashboard;