import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function StateSelection() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  /*
    Keep your existing states array here if you already have one.

    Example:
    const states = [
      {
        name: "West Bengal",
        cm: "...",
        party: "...",
        emblem: "/emblems/west-bengal.png"
      }
    ];
  */

  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  const filteredStates = states.filter((state) =>
    state.toLowerCase().includes(search.toLowerCase())
  );

  const handleState = (state) => {
    if (state === "West Bengal") {
      navigate("/constituency");
    } else {
      alert(`${state} election portal will be connected next.`);
    }
  };

  return (
    <>
      <Navbar />

      <main className="page">

        <div className="container">

          <div className="breadcrumb">
            Home / Government Portal / Select State
          </div>

          <div className="state-header">

            <div>
              <h1 className="page-title">
                Select Your State
              </h1>

              <p className="page-subtitle">
                Choose your state to view available constituencies.
              </p>
            </div>

            <input
              className="state-search input"
              placeholder="🔍 Search state..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          <div className="state-grid">

            {filteredStates.map((state) => (

              <div
                className="state-card"
                key={state}
                onClick={() => handleState(state)}
              >

                <div className="state-emblem">
                  <span>🏛️</span>
                </div>

                <h3>{state}</h3>

                <small>
                  Government Portal
                </small>

              </div>

            ))}

          </div>

        </div>

      </main>
    </>
  );
}

export default StateSelection;