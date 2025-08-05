import React, { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import SidebarLayout from "./SidebarLayout";

export default function MentorLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const snapshot = await getDocs(collection(db, "mentor_profile"));
      let found = false;

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (
          data.username === username.trim() &&
          data.password === password.trim()
        ) {
          found = true;
          if (data.Status === "accepted") {
            localStorage.setItem("mentorId", doc.id);
            localStorage.setItem("mentorName", data.fullName);
            setLoggedIn(true); // ✅ Show SidebarLayout
          } else {
            setError("Your profile is not approved yet.");
          }
        }
      });

      if (!found) {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("Login failed: " + err.message);
    }
  };

  if (loggedIn) {
    return <SidebarLayout />;
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={styles.heading}>Mentor Portal Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>
          Sign In
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    background: "linear-gradient(135deg, #6c63ff, #42a5f5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Segoe UI', sans-serif",
  },
  form: {
    backgroundColor: "#ffffff",
    padding: "40px 30px",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    width: "360px",
    textAlign: "center",
  },
  heading: {
    marginBottom: "25px",
    fontSize: "24px",
    color: "#333",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: "12px 15px",
    margin: "12px 0",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "15px",
    transition: "0.3s",
  },
  button: {
    width: "100%",
    padding: "12px",
    marginTop: "20px",
    backgroundColor: "#6c63ff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  error: {
    color: "#e74c3c",
    fontSize: "14px",
    marginBottom: "10px",
  },
};
