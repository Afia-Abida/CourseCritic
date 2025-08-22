import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ import useNavigate

const CourseSearch = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate(); // ✅ initialize navigate

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/courses");
        const data = await res.json();
        setCourses(data);
      } catch (error) {
        console.error("Failed to load courses");
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCourses([]);
      setShowSuggestions(false);
      setShowResults(false);
      return;
    }
    const filtered = courses.filter((course) =>
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
    setShowSuggestions(true);
    setShowResults(false);
  }, [searchTerm, courses]);

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      setShowResults(false);
      setFilteredCourses([]);
      setShowSuggestions(false);
    } else {
      const filtered = courses.filter((course) =>
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCourses(filtered);
      setShowResults(true);
      setShowSuggestions(false);
    }
  };

  // ✅ Navigate to CoursePage with courseId param
  const handleCourseClick = (course) => {
    navigate(`/course/${course._id}`);
  };

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto", fontFamily: "Arial, sans-serif", textAlign: "center" }}>
      <h2>Course Search 🔍</h2>
      <input
        type="text"
        placeholder="Search by code, name or department"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          boxSizing: "border-box",
        }}
      />

      {showSuggestions && filteredCourses.length > 0 && (
        <ul
          style={{
            listStyleType: "none",
            padding: 0,
            margin: "5px 0 15px 0",
            border: "1px solid #ccc",
            borderRadius: "4px",
            maxHeight: "150px",
            overflowY: "auto",
            textAlign: "left",
            cursor: "pointer",
          }}
        >
          {filteredCourses.map((course) => (
            <li
              key={course._id}
              onClick={() => handleCourseClick(course)}
              style={{ 
                padding: "8px", 
                borderBottom: "1px solid #eee", 
                color: "black",        // ✅ black color
                textDecoration: "underline" // ✅ underline
              }}
            >
              <strong>{course.code}</strong> - {course.name} ({course.department})
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={handleSearch}
        style={{
          backgroundColor: "#007BFF",
          color: "white",
          padding: "10px 25px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Search
      </button>

      {showResults && (
        <div style={{ marginTop: "30px", textAlign: "left" }}>
          {filteredCourses.length === 0 ? (
            <p>No courses found for "{searchTerm}"</p>
          ) : (
            <ul style={{ padding: 0, listStyle: "none" }}>
              {filteredCourses.map((course) => (
                <li
                  key={course._id}
                  onClick={() => handleCourseClick(course)} // ✅ navigate to course page
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #ccc",
                    fontSize: "16px",
                    color: "black",         // ✅ black color
                    textDecoration: "underline" // ✅ underline
                  }}
                >
                  <strong>{course.code}</strong> - {course.name} ({course.department})
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseSearch;

