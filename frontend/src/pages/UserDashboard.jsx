// frontend/src/pages/UserDashboard.jsx
import React, { useState } from "react";
import UserReviewList from "../Components/UserReviewList";
import UserFacultyReviewList from "../Components/UserFacultyReviewList";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("course");

  // get userId and token from localStorage
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  
  // Debug logging
  console.log("UserDashboard - userId:", userId);
  console.log("UserDashboard - token:", token ? "Present" : "Missing");

  return (
    <div style={{ maxWidth: "700px", margin: "30px auto", fontFamily: "Arial, sans-serif" }}>
      <h2>Your Submitted Reviews</h2>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          style={{
            flex: 1,
            padding: "8px 16px",
            backgroundColor: activeTab === "course" ? "#007bff" : "#eee",
            color: activeTab === "course" ? "white" : "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={() => setActiveTab("course")}
        >
          Course Reviews
        </button>
        <button
          style={{
            flex: 1,
            padding: "8px 16px",
            backgroundColor: activeTab === "faculty" ? "#007bff" : "#eee",
            color: activeTab === "faculty" ? "white" : "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={() => setActiveTab("faculty")}
        >
          Faculty Reviews
        </button>
      </div>

      {!userId || !token ? (
        <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
          <p>Authentication required. Please log in again.</p>
        </div>
      ) : (
        <>
          {activeTab === "course" && <UserReviewList userId={userId} token={token} />}
          {activeTab === "faculty" && <UserFacultyReviewList userId={userId} token={token} />}
        </>
      )}
    </div>
  );
};

export default UserDashboard;
