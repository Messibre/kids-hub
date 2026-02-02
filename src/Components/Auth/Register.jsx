import React, { useState } from "react";
import { setToken } from "../utils/jwt";
import "./AuthForm.css";
export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5050/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      setToken(data.token);
      localStorage.setItem("userEmail", email);
      if (typeof onLogin === "function") onLogin(email);
      setSuccess("Registration successful! Redirecting...");
      setTimeout(() => (window.location.href = "/"), 1500);
    } else {
      setError(data.message || "Registration failed");
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Register</button>
      <button
        type="button"
        onClick={() => (window.location.href = "/")}
        style={{ marginTop: "10px", backgroundColor: "#ccc" }}
      >
        Skip for now
      </button>
    </form>
  );
}
