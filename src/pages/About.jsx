import Navbar from "../components/Navbar";

function About() {
  const openInstagram = () => {
    window.open(
      "https://www.instagram.com/me_abhis_lifestyle/",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <>
      <Navbar />

      <div className="page">
        <div
          className="card"
          style={{
            maxWidth: "800px",
            margin: "40px auto",
            padding: "50px 30px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "60px" }}>👨‍💻</div>

          <h1 style={{ color: "#0B3D91", marginTop: "15px" }}>
            About VoteVerse
          </h1>

          <p
            style={{
              maxWidth: "600px",
              margin: "20px auto",
              color: "#666",
              lineHeight: "1.7",
            }}
          >
            VoteVerse is a digital voting platform designed to make elections
            simple, organized, and accessible.
          </p>

          <h2 style={{ marginTop: "35px", color: "#0B3D91" }}>
            Developed by
          </h2>

          <h3 style={{ marginTop: "10px", fontSize: "24px" }}>
            Abhinandan Saha
          </h3>

          <p style={{ color: "#666" }}>
            B.Tech CSE Student • Software Developer
          </p>

          <p
            style={{
              margin: "20px auto",
              maxWidth: "550px",
              color: "#555",
              lineHeight: "1.6",
            }}
          >
            Built with passion for technology, development, and creating
            meaningful digital experiences.
          </p>

          <div style={{ marginTop: "35px" }}>
            <h2 style={{ color: "#0B3D91" }}>📸 Follow Me</h2>

            <p style={{ color: "#666", marginTop: "10px" }}>
              Follow me on Instagram for my projects, tech journey and
              lifestyle.
            </p>

            <button
              onClick={openInstagram}
              style={{
                marginTop: "20px",
                background: "#0B3D91",
                color: "white",
                border: "none",
                padding: "13px 28px",
                borderRadius: "8px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              📸 Follow @me_abhis_lifestyle
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;