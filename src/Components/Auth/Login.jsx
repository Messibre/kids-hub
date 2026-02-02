import React, { useState } from "react";
import { setToken } from "../utils/jwt";
import "./AuthForm.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Replace with your backend API endpoint
    const response = await fetch("http://localhost:5050/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      setToken(data.token);
      localStorage.setItem("userEmail", data.email);
      if (typeof onLogin === "function") onLogin(data.email);
      window.location.href = "/"; // Redirect after login
    } else {
      setError(data.message || "Login failed");
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
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
      <button type="submit">Login</button>
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
