import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const SubmitReview = ({ courseId, onReviewSubmitted, hideCourseSelect }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [ratingDifficulty, setRatingDifficulty] = useState("");
  const [ratingWorkload, setRatingWorkload] = useState("");
  const [ratingUsefulness, setRatingUsefulness] = useState("");
  const [comment, setComment] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  const token = localStorage.getItem("token");
  const location = useLocation();

  useEffect(() => {

    if (courseId) {
      setSelectedCourse(courseId);
    } else {
      const params = new URLSearchParams(location.search);
      const courseIdFromParam = params.get("courseId");
      if (courseIdFromParam) setSelectedCourse(courseIdFromParam);
    }
  }, [location, courseId]);

  useEffect(() => {
    if (hideCourseSelect) return;

    const fetchCourses = async () => {
      try {
        const response = await fetch("/api/courses");
        const data = await response.json();
        if (response.ok) setCourses(data);
        else setErrorMessage("Failed to load courses.");
      } catch {
        setErrorMessage("Failed to load courses.");
      }
    };
    fetchCourses();
  }, [hideCourseSelect]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCourse || !ratingDifficulty || !ratingWorkload || !ratingUsefulness) {
      setErrorMessage("Please fill all required fields.");
      setSuccessMessage("");
      return;
    }

    try {
      const response = await fetch("/api/reviews", {
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
          anonymous,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Review submitted successfully!");
        setErrorMessage("");

        setRatingDifficulty("");
        setRatingWorkload("");
        setRatingUsefulness("");
        setComment("");
        setAnonymous(false);

        if (onReviewSubmitted) onReviewSubmitted();
      } else {
        setErrorMessage(data.message || "Failed to submit review.");
        setSuccessMessage("");
      }
    } catch {
      setErrorMessage("Server error. Please try again.");
      setSuccessMessage("");
    }
  };

  return (
    <div style={{ maxWidth: "480px", margin: "40px auto", textAlign: "center", fontFamily: "Arial, sans-serif", background: "#fff", padding: 24, borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
      <h2>Submit Course Review</h2>

      {errorMessage && <div style={{ color: "red", marginBottom: "10px" }}>{errorMessage}</div>}

      <form onSubmit={handleSubmit}>
        {!hideCourseSelect && (
          <>
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
          </>
        )}


        <label style={{ display: "block", marginBottom: "5px" }}>Difficulty Rating (1-5)*</label>
        <input
          type="number"
          min="1"
          max="5"
          value={ratingDifficulty}
          onChange={(e) => setRatingDifficulty(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "15px" }}
          required
        />

        <label style={{ display: "block", marginBottom: "5px" }}>Workload Rating (1-5)*</label>
        <input
          type="number"
          min="1"
          max="5"
          value={ratingWorkload}
          onChange={(e) => setRatingWorkload(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "15px" }}
          required
        />

        <label style={{ display: "block", marginBottom: "5px" }}>Usefulness Rating (1-5)*</label>
        <input
          type="number"
          min="1"
          max="5"
          value={ratingUsefulness}
          onChange={(e) => setRatingUsefulness(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "15px" }}
          required
        />

        <label style={{ display: "block", marginBottom: "5px" }}>Comment (optional)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          style={{ width: "100%", padding: "8px", marginBottom: "15px" }}
        />

        <label style={{ display: "block", marginBottom: "15px" }}>
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
          />{" "}
          Submit anonymously
        </label>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#8b5cf6",
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
        <div style={{ color: "#3a971d", marginTop: "15px", fontWeight: "bold" }}>
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default SubmitReview;
