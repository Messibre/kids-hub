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
// import UserInfo from "./Components/UserInfo";

function NavBar({ isLoggedIn, onLogout, userEmail }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };
  return (
    <nav className="app-nav">
      <Link to="/" className="app-nav-link">
        <button className="app-nav-btn">Home</button>
      </Link>
      {/* {isLoggedIn && ( */}
      <Link to="/painting" className="app-nav-link">
        <button className="app-nav-btn">Painting</button>
      </Link>
      {/* )} */}
      {/* {isLoggedIn && ( */}
      <Link to="/quiz" className="app-nav-link">
        <button className="app-nav-btn">Quiz</button>
      </Link>
      {/* )} */}
      {/* {isLoggedIn && ( */}
      <Link to="/story" className="app-nav-link">
        <button className="app-nav-btn">Story</button>
      </Link>
      {/* )} */}
      {/* {isLoggedIn && ( */}
      <Link to="/piano" className="app-nav-link">
        <button className="app-nav-btn">
          <GiGrandPiano /> Piano
        </button>
      </Link>
      {/* )} */}
      {!isLoggedIn && (
        <Link to="/login" className="app-nav-link">
          <button className="app-nav-btn">Login</button>
        </Link>
      )}
      {!isLoggedIn && (
        <Link to="/register" className="app-nav-link">
          <button className="app-nav-btn">Register</button>
        </Link>
      )}
      {isLoggedIn && <span className="app-nav-user">Welcome, {userEmail}</span>}
      {isLoggedIn && (
        <button className="app-nav-btn app-nav-btn-danger" onClick={handleLogout}>
          Logout
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
    </BrowserRouter>
  );
}
