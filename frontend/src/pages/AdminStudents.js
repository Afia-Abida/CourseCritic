import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [deleteUserId, setDeleteUserId] = useState(null);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
      return;
    }

    const fetchStudents = async () => {
      try {
        const response = await fetch("/api/admin/students", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.ok) {
          const data = await response.json();
          setStudents(data);
        } else {
          setModalMessage("Failed to load students");
          setShowModal(true);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
        setModalMessage("Error loading students");
        setShowModal(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [token, role, navigate]);

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`/api/admin/users/${deleteUserId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setStudents(prev => prev.filter(student => student._id !== deleteUserId));
        setModalMessage("Student account deleted successfully");
        setShowModal(true);
      } else {
        setModalMessage("Failed to delete student account");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      setModalMessage("Error deleting account");
      setShowModal(true);
    } finally {
      setDeleteUserId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "60vh" 
      }}>
        <p>Loading students...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: "800px", 
      margin: "30px auto", 
      fontFamily: "Arial, sans-serif",
      padding: "20px"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#450684ff" }}>Student Management</h2>
      
      {students.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>No students found.</p>
      ) : (
        <div>
          {students.map((student) => (
            <div
              key={student._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "15px",
                backgroundColor: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "15px", width: "100%" }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: "0 0 5px 0", fontSize: "20px", fontWeight: "bold" }}>{student.name}</h4>
                  <p style={{ margin: "0", color: "#666", fontSize: "18px" }}>
                    {student.email}
                  </p>
                </div>
                
                <button
                  onClick={() => setDeleteUserId(student._id)}
                  style={{
                    backgroundColor: "#eb1c1cff",
                    color: "white",
                    padding: "2px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "13px",
                    width: "100px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  Delete Account
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            backgroundColor: "#6b7280",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          Back to Dashboard
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {!!deleteUserId && (
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
              setDeleteUserId(null);
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
                Delete Student Account
              </h3>
              <p style={{ 
                margin: 0, 
                fontSize: '14px', 
                color: '#6b7280',
                lineHeight: '1.4'
              }}>
                Are you sure you want to delete this student account? This action cannot be undone and will remove all their reviews.
              </p>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              justifyContent: 'flex-end',
              marginTop: '20px'
            }}>
              <button
                onClick={() => setDeleteUserId(null)}
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

      {/* Info Modal */}
      {showModal && !deleteUserId && (
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
              setShowModal(false);
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
                Information
              </h3>
              <p style={{ 
                margin: 0, 
                fontSize: '14px', 
                color: '#6b7280',
                lineHeight: '1.4'
              }}>
                {modalMessage}
              </p>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              justifyContent: 'flex-end',
              marginTop: '20px'
            }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: '#8b5cf6',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#912afeff'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#a458f5ff'}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStudents;
