import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("alert");
  
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.ok) {
          const userData = await response.json();
          setFormData({
            name: userData.name,
            email: userData.email,
            password: "",
            confirmPassword: ""
          });
        } else {
          setModalMessage("Failed to load profile data");
          setModalType("alert");
          setShowModal(true);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setModalMessage("Error loading profile data");
        setModalType("alert");
        setShowModal(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords if changing password
    if (formData.password && formData.password !== formData.confirmPassword) {
      setModalMessage("Passwords do not match");
      setModalType("alert");
      setShowModal(true);
      return;
    }

    try {
      const updateData = {
        name: formData.name,
        email: formData.email
      };
      
      // Only include password if it's provided
      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        setModalMessage("Profile updated successfully!");
        setModalType("alert");
        setShowModal(true);
        
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          password: "",
          confirmPassword: ""
        }));
      } else {
        const errorData = await response.json();
        setModalMessage(errorData.message || "Failed to update profile");
        setModalType("alert");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setModalMessage("Error updating profile");
      setModalType("alert");
      setShowModal(true);
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
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      minHeight: "80vh",
      padding: "20px"
    }}>
      <div style={{ 
        padding: "30px", 
        border: "1px solid #ddd", 
        borderRadius: "10px", 
        width: "400px", 
        background: "#fff",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "25px" }}>Edit Profile</h2>

        <form onSubmit={handleSubmit} style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: "15px" 
        }}>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
              Full Name:
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ 
                width: "100%",
                padding: "10px", 
                fontSize: "16px", 
                border: "1px solid #ccc",
                borderRadius: "5px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
              Email Address:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ 
                width: "100%",
                padding: "10px", 
                fontSize: "16px", 
                border: "1px solid #ccc",
                borderRadius: "5px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
              New Password (leave blank to keep current):
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{ 
                width: "100%",
                padding: "10px", 
                fontSize: "16px", 
                border: "1px solid #ccc",
                borderRadius: "5px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
              Confirm New Password:
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{ 
                width: "100%",
                padding: "10px", 
                fontSize: "16px", 
                border: "1px solid #ccc",
                borderRadius: "5px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button
              type="submit"
              style={{ 
                flex: 1,
                padding: "12px", 
                fontSize: "16px", 
                backgroundColor: "#8b5cf6", 
                color: "#fff", 
                border: "none", 
                cursor: "pointer", 
                borderRadius: "5px"
              }}
            >
              Update Profile
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              style={{ 
                flex: 1,
                padding: "12px", 
                fontSize: "16px", 
                backgroundColor: "#6b7280", 
                color: "#fff", 
                border: "none", 
                cursor: "pointer", 
                borderRadius: "5px"
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Status Modal */}
      {showModal && (
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
                color: modalMessage.includes("successfully") ? '#374151' : '#dc2626'
              }}>
                {modalMessage.includes("successfully") ? "Success" : "Error"}
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
                  backgroundColor: '#8659efff',
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

export default EditProfile;
