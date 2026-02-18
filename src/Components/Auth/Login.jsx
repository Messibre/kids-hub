import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setToken } from "../utils/jwt";
import { apiUrl } from "../api";
import { useLanguage } from "../i18n/LanguageContext";
import "./AuthForm.css";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch(apiUrl("/api/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const isJson = (response.headers.get("content-type") || "").includes(
        "application/json",
      );
      const data = isJson ? await response.json() : {};
      if (response.ok) {
        if (!data?.token) {
          setError("Server response was invalid. Please check API deployment.");
          return;
        }
        setToken(data.token);
        localStorage.setItem("userEmail", data.email);
        if (typeof onLogin === "function") onLogin(data.email);
        navigate("/");
      } else {
        setError(data?.message || t("auth.loginFailed"));
      }
    } catch (networkError) {
      setError(t("auth.network"));
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>{t("auth.loginTitle")}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="email"
        placeholder={t("auth.email")}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder={t("auth.password")}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">{t("auth.loginTitle")}</button>
      <button
        type="button"
        className="ghost-btn"
        onClick={() => navigate("/")}
      >
        {t("auth.skip")}
      </button>
    </form>
  );
}
