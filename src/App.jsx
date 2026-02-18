import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";
import HomePage from "./Components/HomePage";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
// import ProtectedRoute from "./Components/Auth/ProtectedRoute";
import PaintingApp from "./Components/PaintingApp";
import QuizApp from "./Components/QuizApp";
import StoryTeller from "./Components/StoryTeller";
import PianoInstrument from "./Components/PianoInstrument";
import { GiGrandPiano } from "react-icons/gi";
import { getToken, removeToken } from "./Components/utils/jwt";
import React from "react";
import { LanguageProvider, useLanguage } from "./Components/i18n/LanguageContext";
// import UserInfo from "./Components/UserInfo";

function NavBar({ isLoggedIn, onLogout, userEmail }) {
  const navigate = useNavigate();
  const { t, toggleLanguage } = useLanguage();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };
  return (
    <nav className="app-nav">
      <Link to="/" className="app-nav-link">
        <button className="app-nav-btn">{t("nav.home")}</button>
      </Link>
      {/* {isLoggedIn && ( */}
      <Link to="/painting" className="app-nav-link">
        <button className="app-nav-btn">{t("nav.painting")}</button>
      </Link>
      {/* )} */}
      {/* {isLoggedIn && ( */}
      <Link to="/quiz" className="app-nav-link">
        <button className="app-nav-btn">{t("nav.quiz")}</button>
      </Link>
      {/* )} */}
      {/* {isLoggedIn && ( */}
      <Link to="/story" className="app-nav-link">
        <button className="app-nav-btn">{t("nav.story")}</button>
      </Link>
      {/* )} */}
      {/* {isLoggedIn && ( */}
      <Link to="/piano" className="app-nav-link">
        <button className="app-nav-btn">
          <GiGrandPiano /> {t("nav.piano")}
        </button>
      </Link>
      <button className="app-nav-btn app-nav-btn-lang" onClick={toggleLanguage}>
        {t("nav.langToggle")}
      </button>
      {/* )} */}
      {!isLoggedIn && (
        <Link to="/login" className="app-nav-link">
          <button className="app-nav-btn">{t("nav.login")}</button>
        </Link>
      )}
      {!isLoggedIn && (
        <Link to="/register" className="app-nav-link">
          <button className="app-nav-btn">{t("nav.register")}</button>
        </Link>
      )}
      {isLoggedIn && (
        <span className="app-nav-user">
          {t("nav.welcome")}, {userEmail}
        </span>
      )}
      {isLoggedIn && (
        <button className="app-nav-btn app-nav-btn-danger" onClick={handleLogout}>
          {t("nav.logout")}
        </button>
      )}
    </nav>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());
  const [userEmail, setUserEmail] = useState(
    localStorage.getItem("userEmail") || "",
  );

  // Listen for login/logout and update state
  const handleLogin = (email) => {
    setUserEmail(email);
    localStorage.setItem("userEmail", email);
    setIsLoggedIn(true);
  };
  const handleLogout = () => {
    removeToken();
    localStorage.removeItem("userEmail");
    setUserEmail("");
    setIsLoggedIn(false);
  };
  return (
    <BrowserRouter>
      <LanguageProvider>
        {/* <UserInfo /> */}
        <NavBar
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          userEmail={userEmail}
        />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="login" element={<Login onLogin={handleLogin} />} />
            <Route path="register" element={<Register onLogin={handleLogin} />} />

        {/* <Route
          path="/painting"
          element={
            <ProtectedRoute>
              <PaintingApp />
            </ProtectedRoute>
          }
        /> */}
            <Route path="/painting" element={<PaintingApp />} />
        {/* <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <QuizApp />
            </ProtectedRoute>
          }
        /> */}
            <Route path="/quiz" element={<QuizApp />} />
        {/* <Route
          path="/story"
          element={
            <ProtectedRoute>
              <StoryTeller />
            </ProtectedRoute>
          }
        /> */}
            <Route path="/story" element={<StoryTeller />} />
        {/* <Route
          path="/piano"
          element={
            <ProtectedRoute>
              <PianoInstrument />
            </ProtectedRoute>
          }
        /> */}
            <Route path="/piano" element={<PianoInstrument />} />
          </Routes>
        </main>
      </LanguageProvider>
    </BrowserRouter>
  );
}
