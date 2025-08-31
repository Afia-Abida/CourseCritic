import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SubmitFacultyReview from "./SubmitFacultyReview";
import StarRating from "../Components/StarRating";
import Pagination from "../Components/Pagination";

const FacultyPage = () => {
  const { facultyId } = useParams();
  const [faculty, setFaculty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("reviews");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const role = localStorage.getItem("role") || "student";
  const navigate = useNavigate();

  const loadReviews = async () => {
    try {
      const res = await fetch(`/api/faculty-reviews/faculty/${facultyId}`);
      const data = await res.json();
      // Sort by most recent first
      const sortedData = Array.isArray(data) 
        ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        : [];
      setReviews(sortedData);
    } catch {
      setReviews([]);
    }
  };

  const toggleUpvote = async (reviewId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to upvote reviews");
      return;
    }
    
    try {
      const res = await fetch(`/api/faculty-reviews/upvote/${reviewId}`, {
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
      }
    } catch (error) {
      console.error("Error toggling upvote:", error);
    }
  };

  const toggleReport = async (reviewId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to report reviews");
      return;
    }
    
    try {
      const res = await fetch(`/api/faculty-reviews/report/${reviewId}`, {
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
      }
    } catch (error) {
      console.error("Error updating report status:", error);
    }
  };

  useEffect(() => {
    const loadFaculty = async () => {
      try {
        const facRes = await fetch(`/api/faculty`);
        const facs = await facRes.json();
        const found = (facs || []).find((f) => f._id === facultyId) || null;
        setFaculty(found);
      } catch {}
    };
    
    if (facultyId) {
      loadFaculty();
      loadReviews();
    }
  }, [facultyId]);

  // Ensure the submit form is visible without manual scrolling
  useEffect(() => {
    if (activeTab === "submit") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [activeTab]);

  if (!faculty) return null;

  return (
    <div style={{ maxWidth: 800, margin: "20px auto", fontFamily: "Arial, sans-serif", textAlign: "center" }}>
      <h2 style={{ marginBottom: 20 }}>{faculty.name}</h2>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <button
          onClick={() => setActiveTab("reviews")}
          style={{ padding: "10px 20px", marginRight: 10, background: activeTab === "reviews" ? "#8b5cf6" : "#f0f0f0", color: activeTab === "reviews" ? "#fff" : "#000", border: "none", borderRadius: 5, cursor: "pointer" }}
        >
          Reviews
        </button>
        {role === "student" && (
          <button
            onClick={() => setActiveTab("submit")}
            style={{ padding: "10px 20px", background: activeTab === "submit" ? "#8b5cf6" : "#f0f0f0", color: activeTab === "submit" ? "#fff" : "#000", border: "none", borderRadius: 5, cursor: "pointer" }}
          >
            Submit Faculty Review
          </button>
        )}
      </div>

      {activeTab === "reviews" ? (
        <div>
          {reviews.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666", fontStyle: "italic" }}>No reviews yet for this faculty.</p>
          ) : (
            (() => {
              // Calculate pagination
              const totalPages = Math.ceil(reviews.length / itemsPerPage);
              const startIndex = (currentPage - 1) * itemsPerPage;
              const endIndex = startIndex + itemsPerPage;
              const currentReviews = reviews.slice(startIndex, endIndex);
              
              return (
                <>
                  {currentReviews.map((r) => {
                    const userId = localStorage.getItem("userId");
                    const hasUpvoted = (r.upvotedBy || []).some(id => id.toString() === (userId || "").toString());
                    const hasReported = (r.reports || []).some(id => id.toString() === (userId || "").toString());
                    
                    return (
                      <div key={r._id} style={{ 
                        border: "1px solid #ccc", 
                        borderRadius: 8, 
                        padding: 12, 
                        marginBottom: 12, 
                        background: "#fff",
                        display: "flex",
                        flexDirection: "column",
                        textAlign: "center"
                      }}>
                        <div style={{ fontSize: 15, color: "#000000ff", marginBottom: "8px", fontWeight: "500" }}>
                          {r.anonymous ? "Anonymous" : r.user?.name || "User"}
                        </div>
                        <div style={{ margin: "6px 0", display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
                          <span style={{ fontSize: 14, fontWeight: "500" }}>Rating:</span> 
                          <StarRating rating={r.rating ?? 0} size={14} />
                        </div>
                        {r.comment && (
                          <div style={{ marginTop: 8, marginBottom: 8, textAlign: "center", fontSize: "14px" }}>{r.comment}</div>
                        )}
                        <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: "6px" }}>
                          Submitted: {new Date(r.createdAt).toLocaleDateString()}
                        </div>
                        <p style={{ fontSize: "12px", color: "#6b7280", margin: "4px 0" }}>Upvotes: {r.upvotedBy?.length ?? 0}</p>
                        
                        <div style={{ 
                          display: "flex", 
                          justifyContent: "center", 
                          gap: "10px",
                          marginTop: "10px"
                        }}>
                          <button 
                            onClick={() => toggleUpvote(r._id)}
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
                            onClick={() => toggleReport(r._id)}
                            style={{
                              backgroundColor: hasReported ? "#6c757d" : "#ff0000",
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
                            {hasReported ? "Reported" : "Report"}
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
                </>
              );
            })()
          )}
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: "100%", maxWidth: 480 }}>
            <SubmitFacultyReview 
              embedded={true} 
              preselectedFacultyId={facultyId} 
              hideFacultySelect={true}
              onReviewSubmitted={loadReviews}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyPage;


