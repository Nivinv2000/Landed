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
        const bookingsSnapshot = await getDocs(collection(db, "Bookings"));
        const feedbackSnapshot = await getDocs(collection(db, "Feedback"));
        const completionSnapshot = await getDocs(collection(db, "Completions"));

        setMentors(mentorSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setCohorts(cohortSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setBookings(bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
          <h2>Pending Mentor Schedules</h2>
          {mentors.filter(m => m.status === "pending").length === 0 ? (
            <p>No pending mentor schedules.</p>
          ) : (
            mentors.filter(m => m.status === "pending").map(mentor => (
              <div className="card" key={mentor.id}>
                <p><strong>Mentor:</strong> {mentor.name}</p>
                <p><strong>Role:</strong> {mentor.role}</p>
                <p><strong>Price:</strong> £{mentor.price}</p>
                <div className="action-buttons">
                  <button className="view-button"onClick={() => navigate(`/mentor/${mentor.id}`)}>View</button>
                  <button
                  className="accept-btn"
                  onClick={async () => {
                    const mentorRef = doc(db, "mentors_section", mentor.id);
                    await updateDoc(mentorRef, { status: "accepted" });
                    // Update local state without refetch
                    setMentors((prev) =>
                      prev.map((m) =>
                        m.id === mentor.id ? { ...m, status: "accepted" } : m
                      )
                    );
                  }}
                >
                  Accept
                </button>   
                  <button className="reject-btn">Reject</button>
                </div>
              </div>
            ))
          )}

          <h2>Pending Cohorts</h2>
          {cohorts.filter(c => c.status === "pending").length === 0 ? (
            <p>No pending cohorts.</p>
          ) : (
            cohorts.filter(c => c.status === "pending").map(cohort => (
              <div className="card" key={cohort.id}>
                <p><strong>Title:</strong> {cohort.cohortTitle}</p>
                <p><strong>Mentor:</strong> {cohort.mentorName}</p>
                <p><strong>Audience:</strong> {cohort.audience}</p>
                <div className="action-buttons">
                  <button onClick={() => navigate(`/cohort/${cohort.id}`)}>View</button>
                  <button className="accept-btn">Accept</button>
                  <button className="reject-btn">Reject</button>
                </div>
              </div>
            ))
          )}
        </>
      )}


      {activeTab === "mentors" && (
  <div className="dashboard-section">
    <h2>Submitted Mentor Profiles</h2>

    {submittedMentors.length === 0 ? (
      <p>No mentor submissions found.</p>
    ) : (
      submittedMentors.map((mentor) => (
        <div key={mentor.id} className="card" style={{ marginBottom: "20px" }}>
          <p><strong>Name:</strong> {mentor.fullName}</p>
          <p><strong>Job Title:</strong> {mentor.jobTitle}</p>
          <p><strong>Company:</strong> {mentor.company}</p>
          <p><strong>University & Degree:</strong> {mentor.universityDegree}</p>
          <p><strong>Fields of Help:</strong> {mentor.fieldsHelpWith?.join(", ")}</p>
          <p><strong>Session Price:</strong> £{mentor.sessionPrice}</p>
          <p><strong>Status:</strong> {mentor.Status}</p>
          {mentor.profileImageURL && (
            <img src={mentor.profileImageURL} alt="Profile" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", marginBottom: "10px" }} />
          )}
          <div className="action-buttons">
            <button
              className="accept-btn"
              onClick={async () => {
                const docRef = doc(db, "mentor_profile", mentor.id);
                await updateDoc(docRef, { Status: "accepted" });
                setSubmittedMentors(prev =>
                  prev.map(m => m.id === mentor.id ? { ...m, Status: "accepted" } : m)
                );
              }}
            >
              Accept
            </button>
            <button
              className="reject-btn"
              onClick={async () => {
                const docRef = doc(db, "mentor_profile", mentor.id);
                await updateDoc(docRef, { Status: "rejected" });
                setSubmittedMentors(prev =>
                  prev.map(m => m.id === mentor.id ? { ...m, Status: "rejected" } : m)
                );
              }}
            >
              Reject
            </button>
          </div>
        </div>
      ))
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
            bookings.map((booking) => (
              <div className="card" key={booking.id}>
                <p><strong>Mentor:</strong> {booking.mentorName}</p>
                <p><strong>User:</strong> {booking.userName}</p>
                <p><strong>Session:</strong> {booking.sessionTitle} - {booking.time}</p>
              </div>
            ))
          )}
        </div>
      )}

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
