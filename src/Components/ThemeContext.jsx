import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const theme = {
    isDark: isDarkMode,
    bg: {
      primary: isDarkMode ? "#0F172E" : "#F0F9FF",
      secondary: isDarkMode ? "#1E293B" : "#F8FAFE",
      tertiary: isDarkMode ? "#334155" : "#F0F9FF",
    },
    text: {
      primary: isDarkMode ? "#FFFFFF" : "#1F2937",
      secondary: isDarkMode ? "#CBD5E1" : "#6B7280",
      inverse: isDarkMode ? "#1F2937" : "#FFFFFF",
    },
    border: {
      primary: isDarkMode ? "#475569" : "#E5E7EB",
      secondary: isDarkMode ? "#334155" : "#F3F4F6",
    },
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
