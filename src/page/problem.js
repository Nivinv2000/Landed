import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProblemPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>⚠️ Something Went Wrong</h1>
      <p style={styles.message}>There was an issue processing your payment.</p>
      <p style={styles.redirect}>
        Redirecting to home page in <strong>{countdown}</strong> second{countdown !== 1 ? 's' : ''}...
      </p>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff8e1",
    textAlign: "center",
    padding: "20px",
  },
  heading: {
    fontSize: "2.5rem",
    color: "#ff9800",
    marginBottom: "1rem",
  },
  message: {
    fontSize: "1.2rem",
    color: "#333",
  },
  redirect: {
    marginTop: "1rem",
    fontSize: "1rem",
    color: "#777",
  },
};

export default ProblemPage;
