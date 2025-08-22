import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const SubmitReview = ({ onReviewSubmitted, hideCourseSelect }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [ratingDifficulty, setRatingDifficulty] = useState("");
  const [ratingWorkload, setRatingWorkload] = useState("");
  const [ratingUsefulness, setRatingUsefulness] = useState("");
  const [comment, setComment] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // NEW (optional faculty)
  const [faculties, setFaculties] = useState([]);
  const [faculty, setFaculty] = useState("");
  const [facultyRating, setFacultyRating] = useState("");

  const token = localStorage.getItem("token");
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const courseIdFromParam = params.get("courseId");
    if (courseIdFromParam) setSelectedCourse(courseIdFromParam);
  }, [location]);

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

  // Fetch faculties by course (only when a course is already chosen via URL)
  useEffect(() => {
    const loadFaculties = async () => {
      if (!selectedCourse) return;
      try {
        const res = await fetch(`/api/faculty/by-course/${selectedCourse}`);
        const data = await res.json();
        if (res.ok) setFaculties(data);
      } catch {
        // ignore silently
      }
    };
    loadFaculties();
  }, [selectedCourse]);

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
          faculty: faculty || null, // optional
          facultyRating: facultyRating ? Number(facultyRating) : null, // optional
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
        setFaculty("");
        setFacultyRating("");

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
    <div style={{ maxWidth: "400px", margin: "30px auto", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <h2>Submit Review</h2>

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

        {/* Optional faculty rating (shown if faculties exist for this course) */}
        {faculties.length > 0 && (
          <>
            <label style={{ display: "block", marginBottom: 5 }}>Faculty (optional)</label>
            <select
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
              style={{ width: "100%", padding: 8, marginBottom: 15 }}
            >
              <option value="">Choose a faculty</option>
              {faculties.map((f) => (
                <option key={f._id} value={f._id}>{f.name}</option>
              ))}
            </select>

            <label style={{ display: "block", marginBottom: 5 }}>Faculty Rating (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              value={facultyRating}
              onChange={(e) => setFacultyRating(e.target.value)}
              style={{ width: "100%", padding: 8, marginBottom: 15 }}
            />
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
            backgroundColor: "#007bff",
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
