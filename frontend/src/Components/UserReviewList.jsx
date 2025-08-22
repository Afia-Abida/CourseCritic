// frontend/src/Components/UserReviewList.jsx
import React, { useState, useEffect } from "react";

const UserReviewList = ({ userId, token }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUserReviews = async () => {
      console.log("Fetching reviews for userId:", userId);
      console.log("Token:", token ? "Present" : "Missing");
      
      setLoading(true);
      try {
        const res = await fetch(`/api/reviews/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Response status:", res.status);
        const data = await res.json();
        console.log("Response data:", data);
        
        if (res.ok) {
          setReviews(data);
          setMessage("");
        } else {
          setMessage(`Failed to load your reviews. Status: ${res.status}`);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setMessage("Failed to load your reviews.");
      }
      setLoading(false);
    };
    
    if (userId && token) {
      fetchUserReviews();
    } else {
      console.log("Missing userId or token:", { userId, hasToken: !!token });
      setLoading(false);
      setMessage("Missing user authentication.");
    }
  }, [userId, token]);

  if (loading) return <p>Loading course reviews...</p>;
  if (message) return <p style={{ color: "red" }}>{message}</p>;
  if (!reviews.length) return <p>No reviews submitted yet.</p>;

  return (
    <div>
      {reviews.map((review) => (
        <div
          key={review._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <strong>Course: {review.course?.name || review.course}</strong>
          <p>Difficulty: {review.ratingDifficulty ?? 0}</p>
          <p>Workload: {review.ratingWorkload ?? 0}</p>
          <p>Usefulness: {review.ratingUsefulness ?? 0}</p>
          <p>Comment: {review.comment}</p>
          <p>Upvotes: {review.upvotes ?? 0}</p>
        </div>
      ))}
    </div>
  );
};

export default UserReviewList;
