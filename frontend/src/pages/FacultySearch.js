import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const FacultySearch = () => {
  const [faculties, setFaculties] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtered, setFiltered] = useState([]);
  // const [showResults, setShowResults] = useState(false); // Removed unused variable
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/faculty");
        const data = await res.json();
        setFaculties(data);
      } catch (e) {
        console.error("Failed to load faculties");
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFiltered([]);
      setShowSuggestions(false);
      return;
    }
    const q = searchTerm.toLowerCase();
    const list = faculties.filter(
      (f) => f.name.toLowerCase().includes(q) || (f.initials || "").toLowerCase().includes(q)
    );
    setFiltered(list);
    setShowSuggestions(true);
  }, [searchTerm, faculties]);
  
  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      setFiltered([]);
      setShowSuggestions(false);
    } else {
      const q = searchTerm.toLowerCase();
      const list = faculties.filter(
        (f) => f.name.toLowerCase().includes(q) || (f.initials || "").toLowerCase().includes(q)
      );
      setFiltered(list);
      setShowSuggestions(false);
    }
  };

  // Results are displayed on FacultyPage after navigation

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto", fontFamily: "Arial, sans-serif", textAlign: "center" }}>
      <h2>Faculty Search 🔍</h2>
        <input
          type="text"
          placeholder="Search by name or initials"
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

        {showSuggestions && filtered.length > 0 && (
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
            {filtered.map((f) => (
              <li
                key={f._id}
                onClick={() => navigate(`/faculty/${f._id}`)}
                style={{ 
                  padding: "8px", 
                  borderBottom: "1px solid #eee", 
                  color: "black",
                  textDecoration: "underline"
                }}
              >
                <strong>{f.initials}</strong> — {f.name} {f.department && `(${f.department})`}
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={handleSearch}
          style={{
            backgroundColor: "#8b5cf6",
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
      </div>
  );
};

export default FacultySearch;


