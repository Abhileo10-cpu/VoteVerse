import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function CollegeThankYou() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div
        className="page"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="card"
          style={{
            width: "100%",
            maxWidth: "600px",
            padding: "50px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "70px",
            }}
          >
            ✅
          </div>

          <h1
            style={{
              color: "#0B3D91",
              marginTop: "20px",
            }}
          >
            Vote Successfully Recorded!
          </h1>

          <p
            style={{
              color: "#666",
              marginTop: "15px",
              fontSize: "17px",
            }}
          >
            Thank you for participating in your
            college election.
          </p>

          <div
            style={{
              margin: "30px 0",
              padding: "20px",
              background: "#EEF3F8",
              borderRadius: "12px",
            }}
          >
            🎓 Your voice has been recorded.
          </div>

          <button
            onClick={() =>
              navigate("/college-voting")
            }
            style={{
              background: "#0B3D91",
              color: "white",
              border: "none",
              padding: "14px 30px",
              borderRadius: "10px",
              fontSize: "16px",
            }}
          >
            Back to College Portal
          </button>
        </div>
      </div>
    </>
  );
}

export default CollegeThankYou;