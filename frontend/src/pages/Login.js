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
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);

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
      <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px", width: "320px" }}>
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
            style={{ padding: "10px", fontSize: "16px" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: "10px", fontSize: "16px" }}
          />
          <button
            type="submit"
            style={{
              padding: "10px",
              fontSize: "16px",
              backgroundColor: "",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              borderRadius: "4px",
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
