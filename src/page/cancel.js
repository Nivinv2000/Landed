import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CancelPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5); // starting from 5 seconds

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
      <h1 style={styles.heading}>❌ Payment Canceled</h1>
      <p style={styles.message}>You canceled the payment process.</p>
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
    backgroundColor: "#fff5f5",
    textAlign: "center",
    padding: "20px",
  },
  heading: {
    fontSize: "2.5rem",
    color: "#f44336",
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

export default CancelPage
