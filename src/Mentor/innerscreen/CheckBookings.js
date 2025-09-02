import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";
import "./CheckBookings.css";

export default function CheckBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const mentorId = localStorage.getItem("mentorId");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsRef = collection(db, "bookings");
        const q = query(bookingsRef, where("mentorId", "==", mentorId));
        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter out finished bookings
        setBookings(data.filter((b) => b.status !== "finished"));
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [mentorId]);

  const handleFinish = async (id) => {
    try {
      const bookingRef = doc(db, "bookings", id);
      await updateDoc(bookingRef, {
        status: "finished",
      });

      // Remove from state
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  if (loading) return <p>Loading bookings...</p>;
  if (bookings.length === 0) return <p>No bookings found.</p>;

  return (
    <div className="check-bookings-container">
      <h2 className="section-title">My Bookings</h2>
      <div className="bookings-grid">
        {bookings.map((booking) => (
          <div className="booking-card" key={booking.id}>
            <div className="card-header">
              <div>
                <h3>{booking.name}</h3>
                <p
                  className={`payment-status ${
                    booking.paymentStatus === "paid" ? "paid" : "unpaid"
                  }`}
                >
                  {booking.paymentStatus === "paid" ? "✅ Paid" : "❌ Unpaid"}
                </p>
              </div>
            </div>
            <div className="card-body">
              <p>
                <strong>Email:</strong> {booking.email}
              </p>
              <p>
                <strong>Phone:</strong> {booking.phone}
              </p>
              <p>
                <strong>Topic:</strong> {booking.topic}
              </p>
              <p>
                <strong>Date:</strong> {booking.date}
              </p>
              <p>
                <strong>Time:</strong> {booking.time}
              </p>
              <p>
                <strong>Price:</strong>  £{booking.mentor?.price || 0}
              </p>
              <p>
                <strong>Status:</strong> {booking.status || "Pending"}
              </p>
              <p>
                <strong>Created:</strong>{" "}
                {new Date(booking.createdAt).toLocaleString()}
              </p>
              <button
                className="finish-btn"
                onClick={() => handleFinish(booking.id)}
              >
                ✅ Mark as Finished
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
