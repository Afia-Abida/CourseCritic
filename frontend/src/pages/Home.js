import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

const Home = () => {
  const token = localStorage.getItem("token");

  return (
    <div className="home-page">
      <h1>Welcome to CourseCritic 🎓</h1>
      <p>Your portal for course and faculty feedback</p>
      <div style={{ marginTop: "20px", display: "flex", gap: "15px", justifyContent: "center" }}>
        {!token ? (
          <>
            <Link to="/login">
              <button>Login</button>
            </Link>
            <Link to="/signup">
              <button>Signup</button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/courses">
              <button>Search Courses</button>
            </Link>
            <Link to="/submit-review">
              <button>Submit Review</button>
            </Link>
            <Link to="/logout">
              <button>Logout</button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
