import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";

const Home = () => {
  const token = localStorage.getItem("token");
  const [userName, setUserName] = useState("");
  const role = localStorage.getItem("role") || "student";
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
    <div className="home-page" style={{ position: "relative" }}>
      <h1 style={{ color: "#5b0aa6ff" }}>{token ? "CourseCritic 🎓" : "Welcome to CourseCritic 🎓"}</h1>
      {userName && <h2 style={{ marginTop: "10px", color: "#733ac7ff" }}>Welcome, {userName}!</h2>}
      <p>Your portal for course and faculty feedback</p>
      {token && (
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 16 }}>
          <button className="link-text" onClick={() => (window.location.href = "/logout")}>Logout</button>
          <Link to="/edit-profile" className="link-text edit-profile-link" style={{ whiteSpace: "nowrap" }}>
            <span>Edit</span>&nbsp;<span>Profile</span>
          </Link>
          <button className="link-text link-danger" onClick={() => setShowDeleteConfirm(true)}>Delete Account</button>
        </div>
      )}
      <hr style={{ border: 0, borderTop: "2px solid #4c1d95", margin: "16px 0 24px" }} />
      <div style={{ marginTop: "20px", display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
        {!token ? (
          <>
            <Link to="/login"><button>Login</button></Link>
            <Link to="/signup"><button>Signup</button></Link>
          </>
        ) : role === "faculty" ? (
          <>
            <Link to="/courses"><button>Search Courses</button></Link>
            <Link to="/faculties"><button>Search Faculties</button></Link>
          </>
        ) : role === "admin" ? (
          <>
            <Link to="/admin/students"><button>Students</button></Link>
            <Link to="/admin/faculties"><button>Faculties</button></Link>
            <Link to="/admin/reported-course-reviews"><button>Reported Course Reviews</button></Link>
            <Link to="/admin/reported-faculty-reviews"><button>Reported Faculty Reviews</button></Link>
          </>
        ) : (
          <>
            <Link to="/courses"><button>Search Courses</button></Link>
            <Link to="/faculties"><button>Search Faculties</button></Link>
            <Link to="/submit-review"><button>Submit Course Review</button></Link>
            <Link to="/submit-faculty-review"><button>Submit Faculty Review</button></Link>
            <Link to="/dashboard"><button>Your Submitted Reviews</button></Link>
          </>
        )}
      </div>

      {showDeleteConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", padding: 16, borderRadius: 8, width: 360 }}>
            <h3 style={{ marginTop: 0 }}>Delete Account</h3>
            <p>Are you sure you want to delete your account permanently? This cannot be undone.</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button className="link-text" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button
                style={{ background: "#dc2626", color: "#fff", border: "none", padding: "8px 10px", borderRadius: 6, cursor: "pointer" }}
                onClick={async () => {
                  try {
                    const res = await fetch(`/api/users/me`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
                    if (!res.ok) throw new Error("Failed");
                    localStorage.clear();
                    window.location.href = "/";
                  } catch (e) {
                    alert("Failed to delete account");
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

