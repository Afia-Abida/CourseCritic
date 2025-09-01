import React, { useState, useEffect } from "react";
import StarRating from "./StarRating";
import Pagination from "./Pagination";

const ReviewList = ({ courseId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews/${courseId}`);
      const data = await res.json();
      if (res.ok) {
        setReviews(data);
      } else {
        setMessage("Failed to load reviews.");
      }
    } catch {
      setMessage("Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const toggleUpvote = async (reviewId) => {
    if (!token) {
      setMessage("Please log in to upvote reviews");
      return;
    }
    
    setMessage("");
    try {
      const res = await fetch(`/api/reviews/upvote/${reviewId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) =>
            r._id === reviewId
              ? { 
                  ...r, 
                  upvotes: data.upvotes, 
                  upvotedBy: data.upvotedBy 
                }
              : r
          )
        );
      } else {
        setMessage(data.message || "Failed to toggle upvote");
      }
    } catch (error) {
      console.error("Error toggling upvote:", error);
      setMessage("Failed to toggle upvote");
    }
  };

  const toggleReport = async (reviewId) => {
    if (!token) {
      setMessage("Please log in to report reviews");
      return;
    }
    
    setMessage("");
    try {
      const res = await fetch(`/api/reviews/report/${reviewId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {

        setReviews((prev) =>
          prev.map((r) =>
            r._id === reviewId
              ? { 
                  ...r, 
                  reports: data.reports || r.reports 
                }
              : r
          )
        );
        setMessage(data.message || "Report status updated successfully.");
      } else {
        setMessage(data.message || "Failed to update report status");
      }
    } catch (error) {
      console.error("Error updating report status:", error);
      setMessage("Failed to update report status");
    }
  };

  if (loading) return <p style={{ textAlign: "center", color: "#666", fontStyle: "italic" }}>Loading course reviews...</p>;
  if (!reviews.length) return <p style={{ textAlign: "center", color: "#666", fontStyle: "italic" }}>No reviews yet for this course.</p>;

  // Calculate pagination
  const totalPages = Math.ceil(reviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReviews = reviews.slice(startIndex, endIndex);

  return (
    <div>
      {message && <p style={{ color: "red" }}>{message}</p>}
      {currentReviews.map((review) => {
        const reviewerName = review.anonymous ? "Anonymous" : review.user?.name || "Unknown";

        // Fallback to 0 stars if legacy data is missing
        const difficulty = review.ratingDifficulty ?? review.difficulty ?? 0;
        const workload = review.ratingWorkload ?? review.workload ?? 0;
        const usefulness = review.ratingUsefulness ?? review.usefulness ?? 0;

        const hasUpvoted = (review.upvotedBy || []).some(
          (id) => id.toString() === (userId || "").toString()
        );

        return (
          <div
            key={review._id}
            style={{
              border: "1px solid #ccc",
              padding: "12px",
              marginBottom: "12px",
              background: "#fff",
              borderRadius: 8,
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            <div style={{ fontSize: 15, color: "#000000ff", marginBottom: "4px" }}>
              {reviewerName}
            </div>
            {review.faculty?.name && (
              <div style={{ fontSize: 12, color: "#555", marginBottom: "6px" }}>
                Faculty: {review.faculty.name}
                {review.facultyRating ? ` — ★${review.facultyRating}` : ""}
              </div>
            )}
            <div style={{ marginBottom: "8px" }}>
              <p style={{ margin: "4px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>Difficulty:</span> <StarRating rating={difficulty} size={14} />
              </p>
              <p style={{ margin: "4px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>Workload:</span> <StarRating rating={workload} size={14} />
              </p>
              <p style={{ margin: "4px 0", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>Usefulness:</span> <StarRating rating={usefulness} size={14} />
              </p>
            </div>
            {review.comment || review.text ? <p style={{ marginBottom: "8px" }}>{review.comment ?? review.text}</p> : null}
            <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: "6px" }}>
              Submitted: {new Date(review.createdAt).toLocaleDateString()}
            </div>
            <p style={{ fontSize: "12px", color: "#6b7280", margin: "4px 0" }}>Upvotes: {review.upvotes ?? 0}</p>

            <div style={{ 
              display: "flex", 
              justifyContent: "center", 
              gap: "10px",
              marginTop: "10px"
            }}>
               <button 
                onClick={() => toggleUpvote(review._id)}
                style={{
                  backgroundColor: hasUpvoted ? "#6c757d" : "#28a745",
                  color: "white",
                  border: "none",
                  padding: "6px 4px",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "10px",
                  transition: "background-color 0.2s",
                  minWidth: "50px"
                }}
               >
                 {hasUpvoted ? "Upvoted" : "Upvote"}
               </button>

               <button
                 onClick={() => toggleReport(review._id)}
                 style={{
                   backgroundColor: (review.reports || []).some(id => id.toString() === (userId || "").toString()) ? "#6c757d" : "#ff0000",
                   color: "white",
                   border: "none",
                   padding: "6px 4px",
                   borderRadius: "3px",
                   cursor: "pointer",
                   fontSize: "10px",
                   transition: "background-color 0.2s",
                   minWidth: "50px"
                 }}
               >
                 {(review.reports || []).some(id => id.toString() === (userId || "").toString()) ? "Reported" : "Report"}
               </button>
            </div>
          </div>
        );
      })}
      
      {/* Pagination Component */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={reviews.length}
        />
      )}
    </div>
  );
};

export default ReviewList;

