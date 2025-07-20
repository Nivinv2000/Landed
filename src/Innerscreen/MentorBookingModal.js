import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import "./MentorBookingModal.css";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe("pk_live_51RDqWsEj3rV8qCmFHo87Xew52Vy973KhygZcHNnHkv5kz1GSIJsgLBclUFLQtmVNO74nOr5SBJN7T3PtYaXVa6ZA00M005LvuA");

export default function MentorBookingModal({ mentor, slot, onClose }) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const timeSlots = ["14:30", "15:30", "16:30", "17:30", "18:30"];

  const handleStripePayment = async () => {
    setLoading(true); // Start loading indicator

    try {
      const stripe = await stripePromise;

      const response = await fetch("https://strip-api-2a30.onrender.com/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          topic,
          date: selectedDate,
          time: selectedTime,
          mentor: {
            name: mentor.name,
            email: mentor.email, // ✅ include mentor email
            price: Number(slot?.price || mentor.price),
            sessionTitle: slot?.title || "",
          },
        }),
      });

      const session = await response.json();

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        alert(result.error.message);
      }
    } catch (error) {
      console.error("Error during payment:", error);
      // Handle error state if needed
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  return (
    <div className="mentor-modal-overlay">
      <div className="mentor-modal">
        <button className="close-button" onClick={onClose}>×</button>

        {step === 1 && (
          <div className="slot-layout">
            <div className="slot-left">
              <img src={mentor.imageUrl} alt={mentor.name} />
              <h3>{mentor.name}</h3>
              <p>{mentor.role}</p>
              <h4>£{mentor.price} / session</h4>
            </div>

            <div className="slot-right">
              <h4>Selected Session</h4>
              <div className="session-card selected">
                <h4>{slot.title}</h4>
                <p>{slot.description}</p>
                <div className="session-details">
                  <span>🕒 {slot.duration}</span>
                  <span>💰 £{slot.price}</span>
                </div>
              </div>

              <h4>Select a Date & Time</h4>
              <Calendar onChange={setSelectedDate} value={selectedDate} />
              <div className="time-options">
                {timeSlots.map((time, index) => (
                  <button
                    key={index}
                    className={`time-slot ${selectedTime === time ? "selected" : ""}`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>

              {selectedTime && (
                <button onClick={() => setStep(2)} className="proceed-button">
                  Next
                </button>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="booking-form">
            <h3>Enter your details</h3>
            <input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <textarea
              placeholder="What would you like the call to be about?"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <label className="terms">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
              />
              I agree to the terms and conditions
            </label>
            <button
              className="continue-button"
              disabled={!accepted || !name || !email || !phone || loading} // Disable button when loading
              onClick={handleStripePayment}
            >
              {loading ? "Processing..." : "Continue to Pay"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
