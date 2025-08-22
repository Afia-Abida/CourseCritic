import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove user authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");

    // Redirect to Home page
    navigate("/");
  }, [navigate]);

  return <p style={{ textAlign: "center", marginTop: "50px", fontSize: "18px" }}>Logging out...</p>;
};

export default Logout;
