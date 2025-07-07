import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SuccessPage = () => {
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
      <h1 style={styles.heading}>🎉 Payment Successful!</h1>
      <p style={styles.message}>Thank you for your payment.</p>
      <p style={styles.redirect}>
        You will be redirected to the home page in <strong>{countdown}</strong> second{countdown !== 1 ? 's' : ''}...
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
    backgroundColor: "#f0f8ff",
    textAlign: "center",
    padding: "20px",
  },
  heading: {
    fontSize: "2.5rem",
    color: "#4CAF50",
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

export default SuccessPage;
