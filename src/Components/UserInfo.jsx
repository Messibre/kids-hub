import React, { useEffect, useState } from "react";

export default function UserInfo() {
  const [email, setEmail] = useState(() => localStorage.getItem("userEmail"));

  useEffect(() => {
    const handleStorage = () => setEmail(localStorage.getItem("userEmail"));
    window.addEventListener("storage", handleStorage);
    window.addEventListener("userEmailChange", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("userEmailChange", handleStorage);
    };
  }, []);

  if (!email) return null;
  return (
    <div style={{ textAlign: "right", margin: "1rem" }}>
      <span style={{ color: "#555" }}>
        Logged in as: <b>{email}</b>
      </span>
    </div>
  );
}
