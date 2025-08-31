// frontend/src/pages/UserDashboard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserReviewList from "../Components/UserReviewList";
import UserFacultyReviewList from "../Components/UserFacultyReviewList";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("course");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  // get userId and token from localStorage
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role") || "student";
  
  // Debug logging
  console.log("UserDashboard - userId:", userId);
  console.log("UserDashboard - token:", token ? "Present" : "Missing");

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch('/api/users/me', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        // Clear localStorage and redirect
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        navigate('/');
      } else {
        console.error('Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    }
    setShowDeleteModal(false);
  };

  if (role === "student") {
    return (
      <div style={{ maxWidth: "700px", margin: "30px auto", fontFamily: "Arial, sans-serif", textAlign: "center" }}>
        <h2>Your Submitted Reviews</h2>
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button
            style={{
              flex: 1,
              padding: "8px 16px",
              backgroundColor: activeTab === "course" ? "#8b5cf6" : "#eee",
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
              backgroundColor: activeTab === "faculty" ? "#8b5cf6" : "#eee",
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
        
        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowDeleteModal(false);
              }
            }}
          >
            <div 
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '24px',
                minWidth: '300px',
                maxWidth: '500px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ 
                  margin: '0 0 8px 0', 
                  fontSize: '18px', 
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  Delete Account
                </h3>
                <p style={{ 
                  margin: 0, 
                  fontSize: '14px', 
                  color: '#6b7280',
                  lineHeight: '1.4'
                }}>
                  Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your reviews.
                </p>
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '8px', 
                justifyContent: 'flex-end',
                marginTop: '20px'
              }}>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  style={{
                    padding: '8px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#f9fafb'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  style={{
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#b91c1c'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#dc2626'}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "700px", margin: "30px auto", fontFamily: "Arial, sans-serif" }}>
      <h2>Faculty Dashboard</h2>
      <p>You can search courses and faculties, and view reviews.</p>
      <div style={{ display: "flex", gap: 10 }}>
        <a href="/courses"><button>Search Courses</button></a>
        <a href="/faculties"><button>Search Faculties</button></a>
      </div>
    </div>
  );
};

export default UserDashboard;
