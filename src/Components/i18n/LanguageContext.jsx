import React, { createContext, useContext, useMemo, useState } from "react";
import { getNestedTranslation } from "./translations";

const LANG_STORAGE_KEY = "kidsHubLanguage";
const LanguageContext = createContext(null);

function getInitialLanguage() {
  const saved = localStorage.getItem(LANG_STORAGE_KEY);
  return saved === "am" ? "am" : "en";
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  const changeLanguage = (nextLanguage) => {
    const normalized = nextLanguage === "am" ? "am" : "en";
    setLanguage(normalized);
    localStorage.setItem(LANG_STORAGE_KEY, normalized);
  };

  const toggleLanguage = () => {
    changeLanguage(language === "en" ? "am" : "en");
  };

  const t = (key) => getNestedTranslation(language, key);

  const value = useMemo(
    () => ({
      language,
      setLanguage: changeLanguage,
      toggleLanguage,
      t,
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
