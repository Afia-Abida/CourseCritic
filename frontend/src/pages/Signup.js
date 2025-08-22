import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        // Auto-login after successful signup
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        
        setSuccessMessage("Signup successful! Redirecting...");
        setErrorMessage("");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setErrorMessage(data.message || "Signup failed");
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setErrorMessage("Something went wrong");
      setSuccessMessage("");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
      <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px", width: "320px" }}>
        <h2 style={{ textAlign: "center" }}>Signup</h2>

        <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ padding: "10px", fontSize: "16px", boxSizing: "border-box", width: "100%" }}
          />
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
            style={{ padding: "10px", fontSize: "16px", backgroundColor: "#007bff", color: "#fff", border: "none", cursor: "pointer", borderRadius: "4px", boxSizing: "border-box", width: "100%" }}
          >
            Signup
          </button>
        </form>

        {/* Message at the bottom of the form */}
        {successMessage && (
          <div style={{ color: "green", textAlign: "center", marginTop: "12px" }}>
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div style={{ color: "red", textAlign: "center", marginTop: "12px" }}>
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;

