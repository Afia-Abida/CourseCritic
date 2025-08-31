import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StarRating from "../Components/StarRating";
import Pagination from "../Components/Pagination";

const AdminReportedFacultyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [deleteReviewId, setDeleteReviewId] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
      return;
    }

    const fetchReportedReviews = async () => {
      try {
        const response = await fetch("/api/admin/reported-faculty-reviews", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        } else {
          setModalMessage("Failed to load reported reviews");
          setShowModal(true);
        }
      } catch (error) {
        console.error("Error fetching reported reviews:", error);
        setModalMessage("Error loading reported reviews");
        setShowModal(true);
      } finally {
        setLoading(false);
      }
    };

    fetchReportedReviews();
  }, [token, role, navigate]);

  const handleDeleteReview = async () => {
    try {
      const response = await fetch(`/api/admin/faculty-reviews/${deleteReviewId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setReviews(prev => prev.filter(review => review._id !== deleteReviewId));
        setModalMessage("Faculty review deleted successfully");
        setShowModal(true);
      } else {
        setModalMessage("Failed to delete review");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      setModalMessage("Error deleting review");
      setShowModal(true);
    } finally {
      setDeleteReviewId(null);
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
        <p>Loading reported reviews...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: "900px", 
      margin: "30px auto", 
      fontFamily: "Arial, sans-serif",
      padding: "20px"
    }}>
      <h2 style={{ marginBottom: "20px" }}>Reported Faculty Reviews</h2>
      
      {reviews.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>No reported faculty reviews found.</p>
      ) : (
        (() => {
          // Calculate pagination
          const totalPages = Math.ceil(reviews.length / itemsPerPage);
          const startIndex = (currentPage - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const currentReviews = reviews.slice(startIndex, endIndex);
          
          return (
            <>
              <div>
                {currentReviews.map((review) => (
            <div
              key={review._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "15px",
                backgroundColor: "#fff",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: "0 0 5px 0" }}>
                    Faculty: {review.faculty?.name || "Unknown Faculty"}
                  </h4>
                  <p style={{ margin: "0 0 5px 0", color: "#666", fontSize: "14px" }}>
                    Reviewer: {review.anonymous ? "Anonymous" : review.user?.name || "Unknown User"}
                  </p>
                  <p style={{ margin: "0", fontSize: "12px", color: "#999" }}>
                    Submitted: {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div style={{ marginLeft: "15px" }}>
                  <p style={{ margin: "0", fontSize: "12px", color: "#dc2626", fontWeight: "bold" }}>
                    Reports: {review.reports?.length || 0}
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: "10px" }}>
                <div style={{ margin: "6px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: 14, fontWeight: "500" }}>Rating:</span> 
                  <StarRating rating={review.rating ?? 0} size={14} />
                </div>
                
                {review.comment && (
                  <div style={{ marginTop: "8px" }}>
                    <strong>Comment:</strong>
                    <p style={{ margin: "4px 0", padding: "8px", backgroundColor: "#f9f9f9", borderRadius: "4px", fontSize: "14px" }}>
                      {review.comment}
                    </p>
                  </div>
                )}
              </div>

              <div style={{ textAlign: "center", marginTop: "10px" }}>
                <button
                  onClick={() => setDeleteReviewId(review._id)}
                  style={{
                    backgroundColor: "#ea0f0fff",
                    color: "white",
                    padding: "4px 8px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "13px",
                    width: "80px",
                    height: "30px"
                  }}
                >
                  Delete
                </button>
              </div>
                </div>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={reviews.length}
                />
              )}
            </>
          );
        })()
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
      {!!deleteReviewId && (
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
              setDeleteReviewId(null);
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
                Delete Faculty Review
              </h3>
              <p style={{ 
                margin: 0, 
                fontSize: '14px', 
                color: '#6b7280',
                lineHeight: '1.4'
              }}>
                Are you sure you want to delete this reported faculty review? This action cannot be undone.
              </p>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              justifyContent: 'flex-end',
              marginTop: '20px'
            }}>
              <button
                onClick={() => setDeleteReviewId(null)}
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
                onClick={handleDeleteReview}
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
                Delete Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {showModal && !deleteReviewId && (
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
                  backgroundColor: '#865bebff',
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

export default AdminReportedFacultyReviews;
