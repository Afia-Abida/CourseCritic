import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
import SubmitReview from "./SubmitReview";
import ReviewList from "../Components/ReviewList";

function CoursePage() {
  const { courseId } = useParams();
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("reviews"); // ✅ tab state

  const handleReviewSubmitted = () => setRefreshFlag(!refreshFlag);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch("/api/courses");
        const data = await res.json();
        if (res.ok) {
          const selectedCourse = data.find((c) => c._id === courseId);
          setCourse(selectedCourse || null);
        }
      } catch (err) {
        console.error("Failed to fetch course:", err);
      }
    };
    if (courseId) fetchCourse();
  }, [courseId]);

  if (!course) return null;

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto", fontFamily: "Arial, sans-serif", textAlign: "center" }}>
      {/* ✅ Centered course title */}
      <h1 style={{ marginBottom: "20px" }}>
        {course.code} - {course.name}
      </h1>

      {/* ✅ Tabs */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <button 
          onClick={() => setActiveTab("reviews")} 
          style={{ 
            padding: "10px 20px", 
            marginRight: "10px", 
            background: activeTab === "reviews" ? "#007bff" : "#f0f0f0", 
            color: activeTab === "reviews" ? "#fff" : "#000", 
            border: "none", 
            borderRadius: "5px", 
            cursor: "pointer" 
          }}
        >
          Reviews
        </button>
        <button 
          onClick={() => setActiveTab("submit")} 
          style={{ 
            padding: "10px 20px", 
            background: activeTab === "submit" ? "#007bff" : "#f0f0f0", 
            color: activeTab === "submit" ? "#fff" : "#000", 
            border: "none", 
            borderRadius: "5px", 
            cursor: "pointer" 
          }}
        >
          Submit Your Review
        </button>
      </div>

      {/* ✅ Conditional rendering */}
      {activeTab === "reviews" ? (
        <ReviewList key={refreshFlag} courseId={courseId} />
      ) : (
        <SubmitReview courseId={courseId} onReviewSubmitted={handleReviewSubmitted} hideCourseSelect={true} />
      )}
    </div>
  );
}

export default CoursePage;



