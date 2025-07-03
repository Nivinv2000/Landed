import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import "./MentorBookingModal.css";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe("pk_live_51RDqWsEj3rV8qCmFHo87Xew52Vy973KhygZcHNnHkv5kz1GSIJsgLBclUFLQtmVNO74nOr5SBJN7T3PtYaXVa6ZA00M005LvuA");

export default function MentorBookingModal({ mentor, onClose }) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState("");
  const [accepted, setAccepted] = useState(false);
  const navigate = useNavigate();

  const timeSlots = ["14:30", "15:30", "16:30", "17:30", "18:30"];
  const sessionSlots = mentor.sessionSlots || [];

  const handleStripePayment = async () => {
    const stripe = await stripePromise;

    const response = await fetch("http://localhost:5000/create-checkout-session", {
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
          price: Number(selectedSlot?.price || mentor.price),
          sessionTitle: selectedSlot?.title || "",
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
              <h4>Select a Session</h4>
              <div className="session-grid">
                {sessionSlots.map((slot, index) => (
                  <div
                    key={index}
                    className={`session-card ${selectedSlot === slot ? "selected" : ""}`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    <h4>{slot.title}</h4>
                    <p>{slot.description}</p>
                    <div className="session-details">
                      <span>🕒 {slot.duration}</span>
                      <span>💰 £{slot.price}</span>
                    </div>
                  </div>
                ))}
              </div>

              {selectedSlot && (
                <>
                  <h4>Select a Date & Time</h4>
                  <Calendar onChange={setSelectedDate} value={selectedDate} />
                  <div className="time-options">
                    {timeSlots.map((slot, index) => (
                      <button
                        key={index}
                        className={`time-slot ${selectedTime === slot ? "selected" : ""}`}
                        onClick={() => setSelectedTime(slot)}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {selectedTime && selectedSlot && (
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
              disabled={!accepted || !name || !email || !phone}
              onClick={handleStripePayment}
            >
              Continue to Pay
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
