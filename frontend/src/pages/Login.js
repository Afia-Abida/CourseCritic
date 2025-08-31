import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); 
  const [errorMessage, setErrorMessage] = useState(""); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("role", data.user?.role || "student");

        setSuccessMessage("Login successful! Redirecting...");
        setErrorMessage("");

       
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setErrorMessage(data.message || "Login failed");
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("Server error. Please try again.");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
      <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px", width: "320px", background: "#fff" }}>
        <h2 style={{ textAlign: "center" }}>Login</h2>

        
        {errorMessage && (
          <p style={{ color: "red", textAlign: "center", marginBottom: "10px" }}>{errorMessage}</p>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: "10px", fontSize: "16px", boxSizing: "border-box", width: "100%" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: "10px", fontSize: "16px", boxSizing: "border-box", width: "100%" }}
          />
          <button
            type="submit"
            style={{
              padding: "10px",
              fontSize: "16px",
              backgroundColor: "#8b5cf6",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              borderRadius: "4px",
              boxSizing: "border-box",
              width: "100%"
            }}
          >
            Login
          </button>
        </form>

       
        {successMessage && (
          <p
            style={{
              color: "green",
              textAlign: "center",
              marginTop: "15px",
              fontWeight: "bold",
            }}
          >
            {successMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
