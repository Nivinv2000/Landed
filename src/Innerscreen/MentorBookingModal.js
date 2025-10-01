// import React, { useState } from "react";
// import Calendar from "react-calendar";
// import 'react-calendar/dist/Calendar.css';
// import "./MentorBookingModal.css";
// import { loadStripe } from "@stripe/stripe-js";
// import { useNavigate } from "react-router-dom";
// import { db } from "../firebase";
// import { collection, addDoc } from "firebase/firestore";

// const stripePromise = loadStripe("pk_test_51RDqWsEj3rV8qCmFy6aIpDsI2APRYZPWc6rXQjEyx7z3KVHCAl1eWgSNEifMdGTA4iWc8GFzx5f6G0ao7joUZjlx00OwTHzY0S");

// export default function MentorBookingModal({ mentor, slot, onClose }) {
//   const [step, setStep] = useState(1);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [selectedTime, setSelectedTime] = useState("");
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [topic, setTopic] = useState("");
//   const [accepted, setAccepted] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const availableDates = mentor.availableSlots?.map(slot => slot.date) || [];
//   const formattedSelectedDate = selectedDate.toLocaleDateString("en-CA");;

//   const selectedSlotObj = mentor.availableSlots?.find(
//     (slot) => slot.date === formattedSelectedDate
//   );

//   const timeSlots = selectedSlotObj?.times?.filter(Boolean) || [];

//   const handleStripePayment = async () => {
//     setLoading(true);

//     const bookingData = {
//   name,
//   email,
//   phone,
//   topic,
//   acceptedTerms: accepted,
//   date: selectedDate.toISOString().split("T")[0], // Format: YYYY-MM-DD
//   time: selectedTime,
//   createdAt: new Date().toISOString(),
//   mentorId:  mentor.id || "", // Adjust according to your data structure
//   mentor: {
//     name: mentor.fullName,
//     email: mentor.email,
//     imageUrl: mentor.profileImageURL,
//     role: mentor.jobTitle,
//     price: Number(slot?.price || slot.price),
//     sessionTitle: slot?.title || "",
//     sessionDescription: slot?.description || "",
//     duration: slot?.duration || "",
//   },
// };


//     try {
//       // await addDoc(collection(db, "bookings"), bookingData)
//           localStorage.setItem("bookingData", JSON.stringify(bookingData));
// ;

//       const stripe = await stripePromise;
//       const response = await fetch("https://landed-backend-772878553632.europe-west1.run.app/create-checkout-session", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(bookingData),
//       });

//       const session = await response.json();

//       const result = await stripe.redirectToCheckout({ sessionId: session.id });
//       if (!session.id) {
//   console.error("Session creation failed:", session.error);
//   return;
// }

//       if (result.error) alert(result.error.message);
//     } catch (error) {
//       console.error("Error during booking/payment:", error);
//       alert("Something went wrong. Please try again.",error);
//     } finally {
//       setLoading(false);
//     }
//   };
// const formatDate = (date) => {
//   return date.toLocaleDateString("en-CA"); // YYYY-MM-DD format (local timezone)
// };

//   return (
//     <div className="mentor-modal-overlay">
//       <div className="mentor-modal">
//         <button className="close-button" onClick={onClose}>×</button>

//         {step === 1 && (
//           <div className="slot-layout">
//             <div className="slot-left">
//               <img src={mentor.profileImageURL} alt={mentor.fullName} />
//               <h3>{mentor.fullName}</h3>
//               <p>{mentor.jobTitle}</p>
//               <h4>£{mentor.sessionPrice} / session</h4>
//             </div>

//             <div className="slot-right">
//               <h4>Selected Session</h4>
//               <div className="session-card selected">
//                 <h4>{slot.title}</h4>
//                 <p>{slot.description}</p>
//                 <div className="session-details">
//                   <span>🕒 {slot.duration}</span>
//                   <span>💰 £{slot.price}</span>
//                 </div>
//               </div>

//               <h4>Select a Date & Time</h4>

//               <Calendar
//                 onChange={setSelectedDate}
//                 value={selectedDate}
//                 tileDisabled={({ date }) => {
//                   const formatted = date.toLocaleDateString("en-CA");
//                   return !availableDates.includes(formatted);
//                 }}
//                 tileClassName={({ date, view }) => {
//                   if (view !== "month") return null;

//                   const formatted = date.toLocaleDateString("en-CA");
//                   const selectedFormatted = selectedDate?.toLocaleDateString("en-CA");

//                   if (formatted === selectedFormatted && availableDates.includes(formatted)) {
//                     return "highlight-selected";
//                   }

//                   return null;
//                 }}
//               />
              

//               {timeSlots.length > 0 ? (
//                <div className="time-options">
//                 {timeSlots.map((time, index) => (
//                   <button
//                     key={index}
//                     className={`time-slot ${selectedTime === time ? "selected" : ""}`}
//                     onClick={() => setSelectedTime(time)}
//                   >
//                     {time}
//                   </button>
//                 ))}
//               </div>

//               ) : (
//                 <p className="no-slots">No time slots available for this date.</p>
//               )}

//               {selectedTime && (
//                 <button onClick={() => setStep(2)} className="proceed-button">
//                   Next
//                 </button>
//               )}
//             </div>
//           </div>
//         )}

//         {step === 2 && (
//           <div className="booking-form">
//             <h3>Enter your details</h3>
//             <input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
//             <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
//             <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
//             <textarea placeholder="What would you like the call to be about?" value={topic} onChange={(e) => setTopic(e.target.value)} />
//             <label className="terms" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
//             <input
//               type="checkbox"
//               checked={accepted}
//               onChange={(e) => setAccepted(e.target.checked)}
//             />
//             <span>
//               I agree to the terms and conditions (
//               <span
//                 onClick={() => alert("Your popup terms and conditions content goes here.")}
//                 style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
//               >
//                 Read
//               </span>
//               )
//             </span>
//           </label>

//             <button
//               className="continue-button"
//               disabled={!accepted || !name || !email || !phone || loading}
//               onClick={handleStripePayment}
//             >
//               {loading ? "Processing..." : "Continue to Pay"}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./MentorBookingModal.css";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";

const stripePromise = loadStripe(
  "pk_test_51RDqWsEj3rV8qCmFy6aIpDsI2APRYZPWc6rXQjEyx7z3KVHCAl1eWgSNEifMdGTA4iWc8GFzx5f6G0ao7joUZjlx00OwTHzY0S"
);

export default function MentorBookingModal({ mentor, slot, onClose }) {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation state
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const navigate = useNavigate();

  /** ✅ Phone handler */
  const handlePhoneChange = (value) => {
    setPhone(value);
    validatePhone(value);
  };

  /** ✅ Validate 10-digit phone (last 10 digits only) */
  const validatePhone = (value) => {
    const digitsOnly = value.replace(/\D/g, "");
    const lastTen = digitsOnly.slice(-10);

    if (!value) {
      setPhoneError("Phone number is required.");
      return false;
    } else if (lastTen.length !== 10) {
      setPhoneError("Enter a valid 10-digit phone number.");
      return false;
    } else {
      setPhoneError("");
      return true;
    }
  };

  /** ✅ Email validation */
  const validateEmail = (value) => {
    if (!value) {
      setEmailError("Email is required.");
      return false;
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) {
      setEmailError("Enter a valid email address.");
      return false;
    }
    setEmailError("");
    return true;
  };

  /** ✅ Available slots */
  const availableDates = mentor.availableSlots?.map((slot) => slot.date) || [];
  const formattedSelectedDate = selectedDate.toLocaleDateString("en-CA");

  const selectedSlotObj = mentor.availableSlots?.find(
    (slot) => slot.date === formattedSelectedDate
  );

  const timeSlots = selectedSlotObj?.times?.filter(Boolean) || [];

  /** ✅ Handle Payment */
  const handleStripePayment = async () => {
    const isPhoneValid = validatePhone(phone);
    const isEmailValid = validateEmail(email);

    if (!isPhoneValid || !isEmailValid) {
      return;
    }

    setLoading(true);

    const bookingData = {
      name,
      email,
      phone,
      topic,
      acceptedTerms: accepted,
      date: selectedDate.toISOString().split("T")[0],
      time: selectedTime,
      createdAt: new Date().toISOString(),
      mentorId: mentor.id || "",
      mentor: {
        name: mentor.fullName,
        email: mentor.email,
        imageUrl: mentor.profileImageURL,
        role: mentor.jobTitle,
        price: Number(slot?.price || slot.price),
        sessionTitle: slot?.title || "",
        sessionDescription: slot?.description || "",
        duration: slot?.duration || "",
      },
    };

    try {
      localStorage.setItem("bookingData", JSON.stringify(bookingData));

      const stripe = await stripePromise;
      const response = await fetch(
        "https://landed-backend-772878553632.europe-west1.run.app/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData),
        }
      );

      const session = await response.json();

      if (!session.id) {
        console.error("Session creation failed:", session.error);
        alert("Payment session could not be created. Try again.");
        return;
      }

      const result = await stripe.redirectToCheckout({ sessionId: session.id });

      if (result.error) {
        alert(result.error.message);
      }
    } catch (error) {
      console.error("Error during booking/payment:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mentor-modal-overlay">
      <div className="mentor-modal">
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        {/* Step 1: Select Date & Time */}
        {step === 1 && (
          <div className="slot-layout">
            <div className="slot-left">
              <img src={mentor.profileImageURL} alt={mentor.fullName} />
              <h3>{mentor.fullName}</h3>
              <p>{mentor.jobTitle}</p>
              <h4>£{mentor.sessionPrice} / session</h4>
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

              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileDisabled={({ date }) => {
                  const formatted = date.toLocaleDateString("en-CA");
                  const today = new Date();
                  today.setHours(0, 0, 0, 0); // ignore time

                  // Disable if date is not in availableDates or date is in the past
                  return (
                    !availableDates.includes(formatted) ||
                    date < today
                  );
                }}
                tileClassName={({ date, view }) => {
                  if (view !== "month") return null;

                  const formatted = date.toLocaleDateString("en-CA");
                  const selectedFormatted = selectedDate?.toLocaleDateString("en-CA");

                  if (formatted === selectedFormatted && availableDates.includes(formatted)) {
                    return "highlight-selected";
                  }

                  return null;
                }}
              />


              {timeSlots.length > 0 ? (
                <div className="time-options">
                  {timeSlots.map((time, index) => (
                    <button
                      key={index}
                      className={`time-slot ${
                        selectedTime === time ? "selected" : ""
                      }`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="no-slots">No time slots available for this date.</p>
              )}

              {selectedTime && (
                <button onClick={() => setStep(2)} className="proceed-button">
                  Next
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 2: User Details */}
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
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
            />
            {emailError && <p className="error-message">{emailError}</p>}

            <PhoneInput
              country={"gb"} // ✅ Default UK
              value={phone}
              onChange={handlePhoneChange}
              inputStyle={{ width: "100%" }}
            />
            {phoneError && <p className="error-message">{phoneError}</p>}

            <textarea
              placeholder="What would you like the call to be about?"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />

            <label
              className="terms"
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
              />
              <span>
                I agree to the terms and conditions (
                <span
                  onClick={() =>
                    alert("Your popup terms and conditions content goes here.")
                  }
                  style={{
                    color: "blue",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                >
                  Read
                </span>
                )
              </span>
            </label>

            <button
              className="continue-button"
              disabled={
                !accepted ||
                !name ||
                !email ||
                !phone ||
                emailError ||
                phoneError ||
                loading
              }
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
