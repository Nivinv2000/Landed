import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import "./Dashboard.css";

export default function Dashboard() {
  const mentorId = localStorage.getItem("mentorId");
  const mentorName = localStorage.getItem("mentorName");

  const [upcomingSessions, setUpcomingSessions] = useState(0);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [studentsCount, setStudentsCount] = useState(0);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const bookingsRef = collection(db, "bookings");
        const q = query(bookingsRef, where("mentorId", "==", mentorId));
        const snapshot = await getDocs(q);

        let upcoming = 0;
        let completed = 0;
        const uniqueStudents = new Set();
        const recent = [];

        const now = new Date();

        snapshot.forEach((doc) => {
          const data = doc.data();
          const bookingDate = new Date(data.date + "T" + (data.time || "00:00"));

          // Count completed & upcoming
          if (data.status === "finished") {
            completed += 1;
          } else if (bookingDate >= now) {
            upcoming += 1;
          }

          // Count unique students
          if (data.email) {
            uniqueStudents.add(data.email);
          }

          // Collect for recent bookings
          recent.push({ id: doc.id, ...data });
        });

        // Sort recent bookings by createdAt descending
        const sortedRecent = recent
          .filter(b => b.createdAt)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setUpcomingSessions(upcoming);
        setCompletedSessions(completed);
        setStudentsCount(uniqueStudents.size);
        setRecentBookings(sortedRecent);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };

    if (mentorId) {
      fetchDashboardStats();
    }
  }, [mentorId]);

  return (
    <div className="dashboard-wrapper">
      <h1>Welcome, {mentorName || "Mentor"} 👋</h1>
      <p className="dashboard-subtitle">Here's an overview of your activity</p>

      <div className="dashboard-cards">
        <div className="card">
          <h2>📅 Upcoming Sessions</h2>
          <p>{upcomingSessions} Scheduled</p>
        </div>
        <div className="card">
          <h2>🎓 Students Booked</h2>
          <p>{studentsCount} Students</p>
        </div>
        <div className="card">
          <h2>✅ Completed Sessions</h2>
          <p>{completedSessions} Sessions</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h3>📌 Recent Bookings</h3>
        {recentBookings.length > 0 ? (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.name}</td>
                  <td>{booking.email}</td>
                  <td>{booking.date}</td>
                  <td>{booking.time}</td>
                  <td>{booking.status || "pending"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No recent bookings.</p>
        )}
      </div>

      {/* <div className="dashboard-section">
        <h3>⚡ Quick Actions</h3>
        <ul className="quick-actions">
          <li><a href="/profile">📝 Edit Profile</a></li>
          <li><a href="/check-bookings">📖 View Bookings</a></li>
          <li><a href="/availability">📆 Set Availability</a></li>
        </ul>
      </div> */}
    </div>
  );
}
