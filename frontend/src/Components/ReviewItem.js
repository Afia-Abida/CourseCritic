import React, { useState } from "react";

function ReviewItem({ review, token, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(review.text);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`/api/reviews/${review._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async () => {
    try {
      const res = await fetch(`/api/reviews/${review._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text: editText }),
      });
      if (res.ok) {
        setIsEditing(false);
        onUpdate();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpvote = async () => {
    if (!token) {
      alert("Please log in to upvote reviews");
      return;
    }
    
    try {
      const res = await fetch(`/api/reviews/upvote/${review._id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        onUpdate();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to upvote");
      }
    } catch (err) {
      console.error("Error upvoting:", err);
      alert("Failed to upvote");
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px", position: "relative" }}>
      <p><strong>{review.anonymous ? "Anonymous" : review.user.name}</strong></p>

      {isEditing ? (
        <>
          <textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows={3} style={{ width: "100%" }} />
          <button onClick={handleEdit}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <p>{review.text}</p>
      )}

      <p>Difficulty: {"★".repeat(review.difficulty)}</p>
      <p>Workload: {"★".repeat(review.workload)}</p>
      <p>Usefulness: {"★".repeat(review.usefulness)}</p>
      <p>Upvotes: {review.upvotes || 0} <button onClick={handleUpvote}>Upvote</button></p>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
        {review.user._id === localStorage.getItem("userId") && (
          <>
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
          </>
        )}
        
        <button
          onClick={() => alert("Report functionality coming soon")}
          style={{
            backgroundColor: "#f72109ff",
            color: "white",
            border: "none",
            padding: "5px 10px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          Report
        </button>
      </div>
    </div>
  );
}

export default ReviewItem;
