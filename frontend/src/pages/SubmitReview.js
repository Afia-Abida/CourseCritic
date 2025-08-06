import React, { useState, useEffect } from "react";

const SubmitReview = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [ratingDifficulty, setRatingDifficulty] = useState("");
  const [ratingWorkload, setRatingWorkload] = useState("");
  const [ratingUsefulness, setRatingUsefulness] = useState("");
  const [comment, setComment] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/courses");
        const data = await response.json();

        if (response.ok) {
          setCourses(data);
        } else {
          setErrorMessage("Failed to load courses.");
        }
      } catch (error) {
        setErrorMessage("Failed to load courses.");
      }
    };

    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCourse || !ratingDifficulty || !ratingWorkload || !ratingUsefulness) {
      setErrorMessage("Please fill all required fields.");
      setSuccessMessage("");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          course: selectedCourse,
          ratingDifficulty: Number(ratingDifficulty),
          ratingWorkload: Number(ratingWorkload),
          ratingUsefulness: Number(ratingUsefulness),
          comment,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Review submitted successfully!");
        setErrorMessage("");
        // Reset form fields
        setSelectedCourse("");
        setRatingDifficulty("");
        setRatingWorkload("");
        setRatingUsefulness("");
        setComment("");
      } else {
        setErrorMessage(data.message || "Failed to submit review.");
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage("Server error. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "30px auto",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2>Submit Review</h2>

      {errorMessage && (
        <div style={{ color: "red", marginBottom: "10px" }}>{errorMessage}</div>
      )}

      <form onSubmit={handleSubmit}>
        <label htmlFor="course" style={{ display: "block", marginBottom: "5px" }}>
          Select Course*
        </label>
        <select
          id="course"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "15px" }}
          required
        >
          <option value="">Choose a course ID</option>
          {courses.length > 0 ? (
            courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.code} - {course.name}
              </option>
            ))
          ) : (
            <option disabled>Loading courses...</option>
          )}
        </select>

        <label style={{ display: "block", marginBottom: "5px" }}>
          Difficulty Rating (1-5)*
        </label>
        <input
          type="number"
          min="1"
          max="5"
          value={ratingDifficulty}
          onChange={(e) => setRatingDifficulty(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "15px" }}
          required
        />

        <label style={{ display: "block", marginBottom: "5px" }}>
          Workload Rating (1-5)*
        </label>
        <input
          type="number"
          min="1"
          max="5"
          value={ratingWorkload}
          onChange={(e) => setRatingWorkload(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "15px" }}
          required
        />

        <label style={{ display: "block", marginBottom: "5px" }}>
          Usefulness Rating (1-5)*
        </label>
        <input
          type="number"
          min="1"
          max="5"
          value={ratingUsefulness}
          onChange={(e) => setRatingUsefulness(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "15px" }}
          required
        />

        <label style={{ display: "block", marginBottom: "5px" }}>
          Comment (optional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          style={{ width: "100%", padding: "8px", marginBottom: "20px" }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            borderRadius: "4px",
          }}
        >
          Submit Review
        </button>
      </form>

      {successMessage && (
        <div
          style={{
            color: "#3a971dff",
            marginTop: "15px",
            fontWeight: "bold",
          }}
        >
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default SubmitReview;
