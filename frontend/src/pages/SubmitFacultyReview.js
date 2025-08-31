// frontend/src/pages/SubmitFacultyReview.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const SubmitFacultyReview = ({ preselectedFacultyId, hideFacultySelect, embedded = false, onReviewSubmitted }) => {
  const [facultyList, setFacultyList] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(""); // Empty string for "Choose a faculty"
  const [rating, setRating] = useState(""); // blank initially
  const [comment, setComment] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role") || "student";

  const location = useLocation();
  useEffect(() => {
    if (preselectedFacultyId) {
      setSelectedFaculty(preselectedFacultyId);
      return;
    }
    const params = new URLSearchParams(location.search);
    const facultyId = params.get("facultyId");
    if (facultyId) setSelectedFaculty(facultyId);
  }, [location, preselectedFacultyId]);

  useEffect(() => {
    const fetchFaculty = async () => {
      if (!token) {
        setMessage("Please log in to submit a faculty review");
        return;
      }
      
      try {
        const res = await axios.get("/api/faculty", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFacultyList(res.data);
        // Don't auto-select any faculty - let user choose
      } catch (err) {
        console.error("Error fetching faculty list:", err);
        if (err.response?.status === 401) {
          setMessage("Authentication failed. Please log in again.");
        } else {
          setMessage("Failed to load faculty list");
        }
      }
    };
    fetchFaculty();
  }, [token]);

  const handleRatingChange = (value) => {
    if (value === "" || (Number(value) >= 1 && Number(value) <= 5)) {
      setRating(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (role !== "student") {
      setMessage("Only students can submit faculty reviews.");
      return;
    }
    setMessage("");
    
    // Validation
    if (!selectedFaculty) {
      setMessage("Please select a faculty");
      return;
    }
    
    if (!rating || rating < 1 || rating > 5) {
      setMessage("Please enter a valid rating between 1 and 5");
      return;
    }
    
    // Comment is now optional
    
    try {
      await axios.post(
        "/api/faculty-reviews",
        { faculty: selectedFaculty, rating: parseInt(rating), comment: comment.trim() || undefined, anonymous },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setMessage("Faculty review submitted successfully!");
      
      // Reset form (but keep faculty selected if preselected)
      if (!preselectedFacultyId) {
        setSelectedFaculty("");
      }
      setRating("");
      setComment("");
      setAnonymous(false);
      
      // Call the callback to refresh reviews in real-time
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
      
    } catch (err) {
      console.error("Error submitting review:", err);
      if (err.response?.data?.error) {
        setMessage(`Error: ${err.response.data.error}`);
      } else if (err.response?.status === 401) {
        setMessage("Authentication failed. Please log in again.");
      } else {
        setMessage("Error submitting review. Please try again.");
      }
    }
  };

  if (embedded) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Submit Faculty Review
          </h2>
          {message && (
            <p
              style={{
                color: message.includes("successfully") ? "green" : "red",
                textAlign: "center",
                marginBottom: "15px",
              }}
            >
              {message}
            </p>
          )}
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            {!hideFacultySelect && (
              <label style={{ display: "flex", flexDirection: "column" }}>
                Faculty:
                <select
                  value={selectedFaculty}
                  onChange={(e) => setSelectedFaculty(e.target.value)}
                  required
                  style={{
                    marginTop: "5px",
                    padding: "8px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                >
                  <option value="">Choose a faculty</option>
                  {facultyList.map((f) => (
                    <option key={f._id} value={f._id}>
                      {f.initials} - {f.name}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label style={{ display: "flex", flexDirection: "column" }}>
              Rating:
              <input
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => handleRatingChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && e.target.value.length === 1) {
                    e.preventDefault();
                    setRating("");
                  }
                }}
                placeholder="Enter rating (1-5)"
                style={{
                  marginTop: "5px",
                  padding: "8px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
                required
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column" }}>
              Comment (optional):
              <textarea
                placeholder="Write your review... (optional)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{
                  marginTop: "5px",
                  padding: "8px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  resize: "vertical",
                }}
              />
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="checkbox"
                checked={anonymous}
                onChange={() => setAnonymous(!anonymous)}
              />
              Submit anonymously
            </label>

            <button
              type="submit"
              style={{
                backgroundColor: "#8b5cf6",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                alignSelf: "center",
              }}
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "transparent",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Submit Faculty Review
        </h2>
        {message && (
          <p
            style={{
              color: message.includes("successfully") ? "green" : "red",
              textAlign: "center",
              marginBottom: "15px",
            }}
          >
            {message}
          </p>
        )}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          {!hideFacultySelect && (
            <label style={{ display: "flex", flexDirection: "column" }}>
              Faculty:
              <select
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                required
                style={{
                  marginTop: "5px",
                  padding: "8px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              >
                <option value="">Choose a faculty</option>
                {facultyList.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.initials} - {f.name}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label style={{ display: "flex", flexDirection: "column" }}>
            Rating:
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => handleRatingChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && e.target.value.length === 1) {
                  e.preventDefault();
                  setRating("");
                }
              }}
              placeholder="Enter rating (1-5)"
              style={{
                marginTop: "5px",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
              required
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column" }}>
            Comment (optional):
            <textarea
              placeholder="Write your review... (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{
                marginTop: "5px",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                resize: "vertical",
              }}
            />
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <input
              type="checkbox"
              checked={anonymous}
              onChange={() => setAnonymous(!anonymous)}
            />
            Submit anonymously
          </label>

          <button
            type="submit"
            style={{
              backgroundColor: "#8b5cf6",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              alignSelf: "center",
            }}
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitFacultyReview;
