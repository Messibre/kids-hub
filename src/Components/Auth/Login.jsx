import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../utils/jwt";
import { apiUrl } from "../api";
import "./AuthForm.css";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch(apiUrl("/api/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setToken(data.token);
        localStorage.setItem("userEmail", data.email);
        if (typeof onLogin === "function") onLogin(data.email);
        navigate("/");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (networkError) {
      setError("Unable to reach server. Please try again.");
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
        className="ghost-btn"
        onClick={() => navigate("/")}
      >
        Skip for now
      </button>
    </form>
  );
}
