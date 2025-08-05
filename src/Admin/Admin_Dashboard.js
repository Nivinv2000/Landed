import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs ,doc, updateDoc  } from "firebase/firestore";
import { db } from "../firebase";
import "./AdminDashboard.css";


export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mentors, setMentors] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [completions, setCompletions] = useState([]);
  const navigate = useNavigate();
    const [mentorspro, setMentorspro] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [submittedMentors, setSubmittedMentors] = useState([]);



    useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsSnapshot = await getDocs(collection(db, "bookings"));
        const bookingsList = bookingsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(bookingsList);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const snapshot = await getDocs(collection(db, "mentors")); // Collection: mentors
        const mentorList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMentorspro(mentorList);
      } catch (err) {
        console.error("Error fetching mentors:", err);
      }
    };

    fetchMentors();
  }, []);
  useEffect(() => {
  const fetchSubmittedMentors = async () => {
    try {
      const snapshot = await getDocs(collection(db, "mentor_profile"));
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSubmittedMentors(list);
    } catch (err) {
      console.error("Error fetching submitted mentor profiles:", err);
    }
  };

  fetchSubmittedMentors();
}, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const mentorSnapshot = await getDocs(collection(db, "mentors_section"));
        const cohortSnapshot = await getDocs(collection(db, "Cohorts"));
        const feedbackSnapshot = await getDocs(collection(db, "Feedback"));
        const completionSnapshot = await getDocs(collection(db, "Completions"));

        setMentors(mentorSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setCohorts(cohortSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setFeedbacks(feedbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setCompletions(completionSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching admin data:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="admin-dashboard">
      {/* Navigation */}
      <nav className="admin-nav">
        {["dashboard", "bookings", "completion", "feedback","mentors"].map(tab => (
          <button
            key={tab}
            className={`nav-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      {/* Pending Mentors */}
{activeTab === "dashboard" && (
  <>
    <h2>Admin Dashboard</h2>
    <div className="dashboard-cards-container">
      <div className="dashboard-card">
        <h3>Total Mentors</h3>
        <p>{mentors.length}</p>
      </div>

      <div className="dashboard-card">
        <h3>Total Accepted Mentors</h3>
        <p>{mentors.filter(m => m.status === "accepted").length}</p>
      </div>

      <div className="dashboard-card">
        <h3>Total Pending Mentors</h3>
        <p>{mentors.filter(m => m.status === "pending").length}</p>
      </div>

      <div className="dashboard-card">
        <h3>Total Bookings</h3>
        <p>{bookings.length}</p>
      </div>

      <div className="dashboard-card">
        <h3>Paid Bookings</h3>
        <p>{bookings.filter(b => b.paymentStatus === "paid").length}</p>
      </div>

      <div className="dashboard-card">
        <h3>Unpaid Bookings</h3>
        <p>{bookings.filter(b => b.paymentStatus !== "paid").length}</p>
      </div>

      <div className="dashboard-card">
        <h3>Total Cohorts</h3>
        <p>{cohorts.length}</p>
      </div>

      <div className="dashboard-card">
        <h3>Pending Cohorts</h3>
        <p>{cohorts.filter(c => c.status === "pending").length}</p>
      </div>
    </div>
  </>
)}



{activeTab === "mentors" && (
  <div className="dashboard-section">
    <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>Submitted Mentor Profiles</h2>

    {submittedMentors.length === 0 ? (
      <p>No mentor submissions found.</p>
    ) : (
      <div className="mentor-grid" style={{ display: "grid", gap: "24px" }}>
        {submittedMentors.map((mentor, index) => (
          <div
            key={mentor.id}
            className="mentor-card"
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              backgroundColor: "#fff",
              transition: "transform 0.2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
              {mentor.profileImageURL && (
                <img
                  src={mentor.profileImageURL}
                  alt="Profile"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginRight: "16px",
                    border: "2px solid #ddd",
                  }}
                />
              )}
              <div>
                <p style={{ margin: 0, fontWeight: "bold", fontSize: "18px" }}>{mentor.fullName}</p>
                <p style={{ margin: 0,  }}>{mentor.email}</p>
                <p style={{ margin: 0, color: "#777" }}>{mentor.jobTitle} at {mentor.company}</p>
              </div>
            </div>

            <p><strong>University & Degree:</strong> {mentor.universityDegree}</p>
            <p><strong>Fields of Help:</strong> {mentor.fieldsHelpWith?.join(", ")}</p>
            <p><strong>Session Price:</strong> £{mentor.sessionPrice}</p>
            <p><strong>Status:</strong> <span style={{ color: mentor.Status === "accepted" ? "green" : mentor.Status === "rejected" ? "red" : "#444" }}>{mentor.Status}</span></p>

            <div className="input-fields" style={{ marginTop: "16px" }}>
              <input
                type="text"
                placeholder="Username"
                value={mentor.username || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setSubmittedMentors(prev =>
                    prev.map((m, i) => i === index ? { ...m, username: value } : m)
                  );
                }}
                style={{
                  marginBottom: "8px",
                  padding: "8px",
                  width: "100%",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
              <input
                type="password"
                placeholder="Password"
                value={mentor.password || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setSubmittedMentors(prev =>
                    prev.map((m, i) => i === index ? { ...m, password: value } : m)
                  );
                }}
                style={{
                  padding: "8px",
                  width: "100%",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            <div className="action-buttons" style={{ marginTop: "16px", display: "flex", gap: "10px" }}>
              <button
                className="accept-btn"
                style={{
                  backgroundColor: "#4CAF50",
                  color: "white",
                  padding: "10px 16px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
                onClick={async () => {
                  if (!mentor.username || !mentor.password) {
                    alert("Please enter username and password before accepting.");
                    return;
                  }

                  const docRef = doc(db, "mentor_profile", mentor.id);
                  await updateDoc(docRef, {
                    Status: "accepted",
                    username: mentor.username.trim(),
                    password: mentor.password.trim()
                  });

                  setSubmittedMentors(prev =>
                    prev.map(m => m.id === mentor.id
                      ? { ...m, Status: "accepted" }
                      : m)
                  );
                  try {
    await fetch("https://landed-backend-772878553632.europe-west1.run.app/api/send-mentor-accepted-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: mentor.email,
        fullName: mentor.fullName,
        username: mentor.username.trim(),
        password: mentor.password.trim()
      })
    });
    alert("Mentor accepted and email sent!");
  } catch (error) {
    console.error("Failed to send email:", error);
    alert("Mentor accepted, but email failed to send.");
  }

                }}
              >
                Accept
              </button>

              <button
                className="reject-btn"
                style={{
                  backgroundColor: "#f44336",
                  color: "white",
                  padding: "10px 16px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
                onClick={async () => {
                  const docRef = doc(db, "mentor_profile", mentor.id);
                  await updateDoc(docRef, { Status: "rejected" });

                  setSubmittedMentors(prev =>
                    prev.map(m => m.id === mentor.id
                      ? { ...m, Status: "rejected" }
                      : m)
                  );
                }}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}


      {/* Bookings */}
      {activeTab === "bookings" && (
        <div className="dashboard-section">
          <h2>All Bookings</h2>
          {bookings.length === 0 ? (
            <p>No bookings found.</p>
          ) : (
            bookings.map((booking, idx) => (
          <div className="booking-card" key={idx}>
            <div className="profile-section">
              <img src={booking.mentor?.imageUrl} alt="Mentor" className="mentor-image" />
              <div>
                <p><strong>Mentor Name:</strong> {booking.mentor?.name || "N/A"}</p>
                <p><strong>Role:</strong> {booking.mentor?.role}</p>
              </div>
            </div>

            <div className="details">
              <p><strong>Session Title:</strong> {booking.sessionTitle}</p>
              <p><strong>Session Description:</strong> {booking.sessionDescription}</p>
              <p><strong>Topic:</strong> {booking.topic}</p>
              <p><strong>Duration:</strong> {booking.duration}</p>
              <p><strong>Price:</strong> ₹{booking.price}</p>
              <p><strong>Status:</strong> {booking.status}</p>
              <p><strong>Payment:</strong> {booking.paymentStatus}</p>
              <p><strong>Session Time:</strong> {booking.time}</p>
              <p><strong>Session Date:</strong> {booking.date}</p>
              <p><strong>Booked At:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
            </div>

            <div className="user-info">
              <p><strong>Booked By:</strong> {booking.email}</p>
              <p><strong>Phone:</strong> {booking.phone}</p>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

      {/* Completed Sessions */}
      {activeTab === "completion" && (
 <div style={{ padding: "20px" }}>
      <h2>Mentor Details</h2>

      <input
        type="text"
        placeholder="Search mentor by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: "10px", marginBottom: "20px", width: "300px" }}
      />

      {mentorspro
        .filter((m) =>
          m.name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((mentorspro) => (
          <div key={mentorspro.id} className="card" style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "20px" }}>
            <p><strong>Name:</strong> {mentorspro.name}</p>
            <p><strong>Email:</strong> {mentorspro.email}</p>
            <p><strong>Phone:</strong> {mentorspro.phone}</p>
            <p><strong>Location:</strong> {mentorspro.location}</p>
            <p><strong>Specialization:</strong> {mentorspro.specialization}</p>
            <p><strong>Experience:</strong> {mentorspro.experience} years</p>
            <p><strong>Qualification:</strong> {mentorspro.qualification}</p>
            <p><strong>Current Company:</strong> {mentorspro.currentCompany}</p>
            <p><strong>Availability:</strong> {mentorspro.availability} hrs/week</p>
            <p><strong>LinkedIn:</strong> <a href={mentorspro.linkedin} target="_blank" rel="noreferrer">Profile</a></p>
            <p><strong>Bio:</strong> {mentorspro.bio}</p>
            <p><strong>UID:</strong> {mentorspro.uid}</p>
            <p><strong>Created At:</strong> {mentorspro.createdAt?.toDate().toLocaleString()}</p>
          </div>
        ))}
    </div>
      )}

      {/* Feedback */}
      {activeTab === "feedback" && (
        <div className="dashboard-section">
          <h2>User Feedback</h2>
          {feedbacks.length === 0 ? (
            <p>No feedback submitted.</p>
          ) : (
            feedbacks.map((fb) => (
              <div className="card feedback-card" key={fb.id}>
                <p><strong>User:</strong> {fb.userName}</p>
                <p><strong>Mentor:</strong> {fb.mentorName}</p>
                <p><strong>Message:</strong> {fb.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
