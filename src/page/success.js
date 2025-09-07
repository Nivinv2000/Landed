import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { db } from "../firebase"; // Make sure this path is correct
import { collection, addDoc } from "firebase/firestore";

const SuccessPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [countdown, setCountdown] = useState(5);
  const [status, setStatus] = useState("Saving your booking...");
  const [error, setError] = useState("");

  // 🔑 Prevent double execution
  const hasSaved = useRef(false);

  useEffect(() => {
    const sessionId = params.get("session_id");
    const bookingData = JSON.parse(localStorage.getItem("bookingData"));

    console.log("sessionId:", sessionId);
    console.log("bookingData:", bookingData);

    if (!sessionId || !bookingData) {
      setStatus("Missing session ID or booking data.");
      setError("Could not complete the booking process.");
      return;
    }

    const saveBooking = async () => {
      if (hasSaved.current) return; // stop duplicate save
      hasSaved.current = true;

      try {
        await addDoc(collection(db, "bookings"), {
          ...bookingData,
          sessionId,
          paymentStatus: "paid",
          createdAt: new Date().toISOString(),
        });

        const emailPayload = {
          userEmail: bookingData.email, // user email (not mentor)
          mentorEmail: bookingData.mentor?.email || "", // nested mentor email
          name: bookingData.name,
          sessionId,
          date: bookingData.date,
          time: bookingData.time,
        };

        console.log("Sending email with payload:", emailPayload);

        const res = await fetch(
          "https://landed-backend-772878553632.europe-west1.run.app/api/send-booking-email",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(emailPayload),
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          console.error("Email API failed:", errorData);
          throw new Error("Email sending failed.");
        }

        localStorage.removeItem("bookingData");
        setStatus("🎉 Booking confirmed and saved!");
      } catch (err) {
        console.error("Error saving booking:", err);
        setStatus("An error occurred while saving your booking.");
        setError("Please contact support.");
      }
    };

    saveBooking();
  }, [params]);

  useEffect(() => {
    if (error) return;

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
  }, [navigate, error]);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>
        {error ? "⚠️ Something went wrong" : "🎉 Payment Successful!"}
      </h1>
      <p style={styles.message}>{status}</p>
      {!error && (
        <p style={styles.redirect}>
          Redirecting to the home page in <strong>{countdown}</strong>{" "}
          second{countdown !== 1 ? "s" : ""}...
        </p>
      )}
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
