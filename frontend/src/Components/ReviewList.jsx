import React, { useState, useEffect } from "react";

const ReviewList = ({ courseId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(""); // inline status/errors
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
        // Update the reviews state to reflect the report status
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

  return (
    <div>
      {message && <p style={{ color: "red" }}>{message}</p>}
      {reviews.map((review) => {
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
              padding: "10px",
              marginBottom: "10px",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            <strong>{reviewerName}</strong>
            {review.faculty?.name && (
              <div style={{ fontSize: 12, color: "#555" }}>
                Faculty: {review.faculty.name}
                {review.facultyRating ? ` — ★${review.facultyRating}` : ""}
              </div>
            )}
            {review.comment || review.text ? <p>{review.comment ?? review.text}</p> : null}

            <p>Difficulty: {"★".repeat(difficulty)}</p>
            <p>Workload: {"★".repeat(workload)}</p>
            <p>Usefulness: {"★".repeat(usefulness)}</p>

            <p>Upvotes: {review.upvotes ?? 0}</p>

            <div style={{ 
              display: "flex", 
              justifyContent: "center", 
              gap: "10px",
              marginTop: "10px"
            }}>
                             <button 
                 onClick={() => toggleUpvote(review._id)}
                 style={{
                   backgroundColor: hasUpvoted ? "#28a745" : "#007bff",
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
    </div>
  );
};

export default ReviewList;




