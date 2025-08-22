// frontend/src/Components/UserFacultyReviewList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const UserFacultyReviewList = ({ userId, token }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

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
          setReviews(data);
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

  if (loading) return <p>Loading faculty reviews...</p>;

  return (
    <div>
      {reviews.length === 0 ? (
        <p>No faculty reviews submitted yet.</p>
      ) : (
        reviews.map((review) => (
          <div
            key={review._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "6px",
              padding: "12px",
              marginBottom: "12px",
              backgroundColor: "#fafafa",
            }}
          >
            <h4 style={{ margin: "0 0 6px 0" }}>
              Faculty: {review.faculty?.name || "Unknown Faculty"}
            </h4>
            <p style={{ margin: "0 0 6px 0" }}>{review.comment}</p>
            <small style={{ color: "gray" }}>
              Rating: {review.rating} / 5
            </small>
          </div>
        ))
      )}
    </div>
  );
};

export default UserFacultyReviewList;
