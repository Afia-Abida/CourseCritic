// frontend/src/Components/UserFacultyReviewList.jsx
import React, { useEffect, useState } from "react";
import StarRating from "./StarRating";
import Pagination from "./Pagination";

const UserFacultyReviewList = ({ userId, token }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ rating: "", comment: "", anonymous: false });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReviewId, setDeleteReviewId] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchFacultyReviews = async () => {
      console.log("Fetching faculty reviews for userId:", userId);
      console.log("Token:", token ? "Present" : "Missing");
      
      try {
        const res = await fetch(`/api/faculty-reviews/user/${userId}/reviews`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("Faculty reviews response status:", res.status);
        const data = await res.json();
        console.log("Faculty reviews data:", data);
        
        if (res.ok) {
          // Sort by most recent first
          const sortedReviews = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setReviews(sortedReviews);
        } else {
          console.error("Failed to fetch faculty reviews:", res.status);
        }
      } catch (err) {
        console.error("Error fetching faculty reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId && token) {
      fetchFacultyReviews();
    } else {
      console.log("Missing userId or token for faculty reviews:", { userId, hasToken: !!token });
      setLoading(false);
    }
  }, [userId, token]);

  const handleUpdateReview = async (reviewId) => {
    try {
      if (!editForm.rating) {
        setUpdateMessage("Please provide a rating (1-5)");
        setShowUpdateModal(true);
        return;
      }
      
      const res = await fetch(`/api/faculty-reviews/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      
      if (!res.ok) throw new Error("Failed to update faculty review");
      const updated = await res.json();
      setReviews((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));
      setEditingId(null);
    } catch (err) {
      setUpdateMessage("Update failed. Please try again.");
      setShowUpdateModal(true);
    }
  };

  const handleDeleteReview = async () => {
    try {
      const res = await fetch(`/api/faculty-reviews/${deleteReviewId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete faculty review");
      setReviews((prev) => prev.filter((r) => r._id !== deleteReviewId));
      setShowDeleteModal(false);
      setDeleteReviewId(null);
    } catch (err) {
      setUpdateMessage("Delete failed. Please try again.");
      setShowUpdateModal(true);
      setShowDeleteModal(false);
    }
  };

  const handleNumberInputChange = (value) => {
    if (value === "" || (Number(value) >= 1 && Number(value) <= 5)) {
      setEditForm({ ...editForm, rating: value === "" ? "" : Number(value) });
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(reviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReviews = reviews.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setEditingId(null); // Close any open edit forms when changing pages
  };

  if (loading) return <p>Loading faculty reviews...</p>;

  return (
    <div>
      {reviews.length === 0 ? (
        <p>No faculty reviews submitted yet.</p>
      ) : (
        currentReviews.map((review) => (
          <div
            key={review._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "12px",
              backgroundColor: "#fff",
            }}
          >
            <h4 style={{ margin: "0 0 6px 0" }}>
              Faculty: {review.faculty?.name || "Unknown Faculty"}
            </h4>
            
            {editingId === review._id ? (
              <div>
                <label style={{ display: "block", marginBottom: 6 }}>
                  Rating
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={editForm.rating}
                    onChange={(e) => handleNumberInputChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && e.target.value.length === 1) {
                        e.preventDefault();
                        setEditForm({ ...editForm, rating: "" });
                      }
                    }}
                    style={{ width: "100%", marginTop: "4px" }}
                    placeholder="1-5"
                  />
                </label>
                <textarea
                  rows="3"
                  value={editForm.comment}
                  onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                  style={{ width: "100%", marginTop: 6 }}
                  placeholder="Your review comment..."
                />
                <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                  <input
                    type="checkbox"
                    checked={editForm.anonymous}
                    onChange={(e) => setEditForm({ ...editForm, anonymous: e.target.checked })}
                  />
                  Post as anonymous
                </label>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button
                    onClick={() => handleUpdateReview(review._id)}
                    style={{ background: "#28a745", color: "#fff", padding: "6px 12px", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: 12 }}
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => setEditingId(null)}
                    style={{ background: "#6c757d", color: "#fff", padding: "6px 12px", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: 12 }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ marginTop: "8px" }}>
                  <p style={{ margin: "4px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>Rating:</span> <StarRating rating={review.rating ?? 0} size={14} />
                  </p>
                  <p style={{ margin: "8px 0 4px 0" }}>Comment: {review.comment}</p>
                  <p style={{ margin: "4px 0", fontSize: "12px", color: "#6b7280" }}>
                    Submitted: {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                  <p style={{ margin: "4px 0", fontSize: "12px", color: "#6b7280" }}>Upvotes: {review.upvotes ?? review.upvotedBy?.length ?? 0}</p>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button
                    onClick={() => {
                      setEditingId(review._id);
                      setEditForm({ 
                        rating: review.rating ?? 1, 
                        comment: review.comment ?? "", 
                        anonymous: !!review.anonymous 
                      });
                    }}
                    style={{ background: "#28a745", color: "#fff", padding: "6px 12px", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: 12 }}
                  >
                    Edit
                  </button>
                  <button
                    style={{ background: "#dc2626", color: "#fff", padding: "6px 12px", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: 12 }}
                    onClick={() => {
                      setDeleteReviewId(review._id);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      )}
      
      {/* Pagination */}
      {reviews.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={reviews.length}
        />
      )}
      
      {/* Delete Faculty Review Modal */}
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
                Are you sure you want to delete this faculty review? This action cannot be undone.
              </p>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              justifyContent: 'flex-end',
              marginTop: '20px'
            }}>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteReviewId(null);
                }}
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
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Update Failed Modal */}
      {showUpdateModal && (
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
              setShowUpdateModal(false);
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
                Update Failed
              </h3>
              <p style={{ 
                margin: 0, 
                fontSize: '14px', 
                color: '#6b7280',
                lineHeight: '1.4'
              }}>
                {updateMessage}
              </p>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              justifyContent: 'flex-end',
              marginTop: '20px'
            }}>
              <button
                onClick={() => setShowUpdateModal(false)}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
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

export default UserFacultyReviewList;
