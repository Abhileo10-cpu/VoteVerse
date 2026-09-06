import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Dashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Government Voting",
      icon: " 🇮🇳 ",
      description:
        "Participate in constituency and state election voting.",
      button: "Enter Government Portal",
      action: () => navigate("/state"),
      color: "#0B3D91",
    },
    {
      title: "College Voting",
      icon: " 🎓 ",
      description:
        "Participate in campus elections and choose your representatives.",
      button: "Enter College Portal",
      action: () => navigate("/college-voting"),
      color: "#6D28D9",
    },
  ];

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
        {/* =============================== */}
        {/* HERO SECTION */}
        {/* =============================== */}

        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto 35px auto",
            padding: "50px 30px",
            borderRadius: "24px",
            textAlign: "center",
            color: "white",
            background:
              "linear-gradient(135deg, #071A52 0%, #0B3D91 50%, #1D4ED8 100%)",
            boxShadow: "0 15px 40px rgba(11, 61, 145, 0.25)",
          }}
        >
          <div
            style={{
              fontSize: "60px",
              marginBottom: "10px",
            }}
          >
            🏛️
          </div>

          <h1
            style={{
              margin: "0",
              fontSize: "clamp(32px, 5vw, 50px)",
            }}
          >
            Welcome to VoteVerse
          </h1>

          <p
            style={{
              fontSize: "18px",
              marginTop: "15px",
              opacity: 0.9,
              maxWidth: "700px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            One digital platform for government election simulation
            and college elections.
          </p>
        </div>

        {/* =============================== */}
        {/* PORTAL SELECTION */}
        {/* =============================== */}

        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "30px",
            }}
          >
            <h2
              style={{
                color: "#0B3D91",
                marginBottom: "10px",
              }}
            >
              Choose Your Voting Portal
            </h2>

            <p
              style={{
                color: "#666",
                fontSize: "16px",
              }}
            >
              Select the type of election you want to access.
            </p>
          </div>

          {/* =============================== */}
          {/* MAIN PORTAL CARDS */}
          {/* =============================== */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "25px",
              marginBottom: "35px",
            }}
          >
            {cards.map((card) => (
              <div
                key={card.title}
                onClick={card.action}
                style={{
                  background: "white",
                  padding: "40px 30px",
                  borderRadius: "22px",
                  cursor: "pointer",
                  textAlign: "center",
                  border: "1px solid #E5E7EB",
                  boxShadow:
                    "0 10px 30px rgba(0,0,0,0.08)",
                  transition:
                    "transform 0.25s ease, box-shadow 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-8px)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 40px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 30px rgba(0,0,0,0.08)";
                }}
              >
                <div
                  style={{
                    fontSize: "70px",
                    marginBottom: "15px",
                  }}
                >
                  {card.icon}
                </div>

                <h2
                  style={{
                    color: card.color,
                    marginBottom: "15px",
                  }}
                >
                  {card.title}
                </h2>

                <p
                  style={{
                    color: "#666",
                    lineHeight: "1.7",
                    minHeight: "55px",
                  }}
                >
                  {card.description}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    card.action();
                  }}
                  style={{
                    width: "100%",
                    marginTop: "20px",
                    background: card.color,
                    color: "white",
                    border: "none",
                    padding: "14px 20px",
                    borderRadius: "10px",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  {card.button}
                </button>
              </div>
            ))}
          </div>

          {/* =============================== */}
          {/* QUICK ACCESS */}
          {/* =============================== */}

          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "20px",
              boxShadow:
                "0 8px 25px rgba(0,0,0,0.07)",
              border: "1px solid #E5E7EB",
            }}
          >
            <h2
              style={{
                color: "#0B3D91",
                textAlign: "center",
                marginBottom: "25px",
              }}
            >
              Quick Access
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "15px",
              }}
            >
              {/* Government Results */}

              <button
                onClick={() => navigate("/results")}
                style={{
                  padding: "20px",
                  borderRadius: "12px",
                  border: "1px solid #D1D5DB",
                  background: "#F8FAFC",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                🗽
                <br />
                Government Results
              </button>

              {/* College Live Results - NEW */}

              <button
                onClick={() => navigate("/college-results")}
                style={{
                  padding: "20px",
                  borderRadius: "12px",
                  border: "1px solid #C4B5FD",
                  background: "#F5F3FF",
                  color: "#5B21B6",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                𓂃✍︎
                <br />
                College Live Results
                <br />
                <span
                  style={{
                    display: "inline-block",
                    marginTop: "8px",
                    fontSize: "11px",
                    color: "#16A34A",
                    fontWeight: "700",
                  }}
                >
                   LIVE COUNTING
                </span>
              </button>

              {/* Government Admin */}

              <button
                onClick={() => navigate("/admin")}
                style={{
                  padding: "20px",
                  borderRadius: "12px",
                  border: "1px solid #D1D5DB",
                  background: "#F8FAFC",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                🛠
                <br />
                Admin Dashboard
              </button>

              {/* College Voting */}

              <button
                onClick={() => navigate("/college-voting")}
                style={{
                  padding: "20px",
                  borderRadius: "12px",
                  border: "1px solid #D1D5DB",
                  background: "#F8FAFC",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                🎓
                <br />
                College Elections
              </button>

              {/* Government Voting */}

              <button
                onClick={() => navigate("/state")}
                style={{
                  padding: "20px",
                  borderRadius: "12px",
                  border: "1px solid #D1D5DB",
                  background: "#F8FAFC",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                🏛️
                <br />
                Government Voting
              </button>
            </div>
          </div>

          {/* =============================== */}
          {/* =============================== */}
          {/* ABOUT DEVELOPER */}
          {/* =============================== */}

          <div
            style={{
              background: "white",
              padding: "35px 30px",
              borderRadius: "20px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.07)",
              border: "1px solid #E5E7EB",
              textAlign: "center",
              marginTop: "30px",
            }}
          >
            <div style={{ fontSize: "45px", marginBottom: "10px" }}>
              👨‍💻
            </div>

            <h2 style={{ color: "#0B3D91", marginBottom: "10px" }}>
              About the Developer
            </h2>

            <h3 style={{ margin: "8px 0", fontSize: "22px" }}>
              Abhinandan Saha
            </h3>

            <p style={{ color: "#666", marginBottom: "12px" }}>
              B.Tech CSE Student • Software Developer
            </p>

            <p
              style={{
                color: "#777",
                maxWidth: "650px",
                margin: "0 auto",
                lineHeight: "1.6",
              }}
            >
              VoteVerse is a digital voting platform developed with a passion
              for technology, software development, and meaningful digital
              experiences.
            </p>

            <button
              onClick={() =>
                window.open(
                  "https://www.instagram.com/me_abhis_lifestyle/",
                  "_blank"
                )
              }
              style={{
                marginTop: "22px",
                background: "#0B3D91",
                color: "white",
                border: "none",
                padding: "13px 25px",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              📸 Follow Me on Instagram
            </button>
          </div>

          {/* FOOTER INFO */}
          {/* =============================== */}

          <div
            style={{
              textAlign: "center",
              marginTop: "35px",
              color: "#777",
            }}
          >
            <p>
            🤝 Secure Voting ☕︎ Transparent Process 📝
              Live Results
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
