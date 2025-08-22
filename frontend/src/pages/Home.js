import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";

const Home = () => {
  const token = localStorage.getItem("token");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      if (token) {
        try {
          const res = await fetch("/api/auth/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const userData = await res.json();
            setUserName(userData.name);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserName();
  }, [token]);

  return (
    <div className="home-page">
      <h1>{token ? "CourseCritic 🎓" : "Welcome to CourseCritic 🎓"}</h1>
      {userName && <h2 style={{ marginTop: "10px", color: "#000080" }}>Welcome, {userName}!</h2>}
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
              <button>Submit Course Review</button>
            </Link>
            <Link to="/submit-faculty-review">
              <button>Submit Faculty Review</button>
            </Link>
            {/* ADD THIS LINK */}
            <Link to="/dashboard">
              <button>Your Submitted Reviews</button>
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

