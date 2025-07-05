import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import "./ProfilePage.css";
import Heading from "../components/heading";
import Footer from "../components/footer";
import { signOut } from "firebase/auth";


export default function ProfilePage() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [mentorDetails, setMentorDetails] = useState({
    phone: "",
    location: "",
    specialization: "",
    experience: "",
    qualification: "",
    currentCompany: "",
    availability: "",
    linkedin: "",
    bio: ""
  });

  const [activeTab, setActiveTab] = useState("profile");
  const [mentorSchedules, setMentorSchedules] = useState([]);
  const [editingSession, setEditingSession] = useState(null);
  const [editSessionData, setEditSessionData] = useState({});

  const handleLogout = async () => {
  try {
    await signOut(auth);
    navigate("/"); // Redirect to home after logout
  } catch (error) {
    console.error("Logout error:", error);
  }
};


  useEffect(() => {
    const fetchMentorDetails = async () => {
      if (!user) return;

      try {
        const docRef = doc(db, "mentors", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setMentorDetails(docSnap.data());

        const q = query(collection(db, "mentors_section"), where("createdBy", "==", user.uid));
        const snap = await getDocs(q);
        const scheduleData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMentorSchedules(scheduleData);
      } catch (error) {
        console.error("Error fetching mentor data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentorDetails();
  }, [user]);

  const handleInputChange = (e) => {
    setMentorDetails({ ...mentorDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      const docRef = doc(db, "mentors", user.uid);
      await setDoc(docRef, {
        uid: user.uid,
        email: user.email,
        name: user.displayName || "",
        ...mentorDetails,
        updatedAt: new Date()
      });
      alert("Mentor profile saved successfully!");
    } catch (error) {
      console.error("Error updating mentor data:", error);
      alert("Error updating profile.");
    }
  };

  // Handle edit button click
  const handleEditSession = (session) => {
    setEditingSession(session.id);
    setEditSessionData({ ...session });
  };

  // Handle changes in the edit form
  const handleEditSessionChange = (e) => {
    setEditSessionData({ ...editSessionData, [e.target.name]: e.target.value });
  };

  // Save edited session
  const handleEditSessionSubmit = async (e) => {
    e.preventDefault();
    if (!user || !editingSession) return;
    try {
      const docRef = doc(db, "mentors_section", editingSession);
      await setDoc(docRef, { ...editSessionData }, { merge: true });
      // Refresh schedule list
      const q = query(collection(db, "mentors_section"), where("createdBy", "==", user.uid));
      const snap = await getDocs(q);
      const scheduleData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMentorSchedules(scheduleData);
      setEditingSession(null);
      alert("Session updated successfully!");
    } catch (error) {
      console.error("Error updating session:", error);
      alert("Error updating session.");
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingSession(null);
    setEditSessionData({});
  };

  if (!user) {
    return (
      <div className="profile-container">
        <h2>You are not logged in.</h2>
        <button className="btn" onClick={() => navigate("/")}>← Back to Home</button>
      </div>
    );
  }

  if (isLoading) {
    return <div className="profile-container"><h2>Loading profile...</h2></div>;
  }

  return (
    <div>
      <Heading />
      <div className="profile-wrapper">
        {/* Tabs */}
        <div className="tab-header">
          <button className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>Profile</button>
          <button className={activeTab === "schedule" ? "active" : ""} onClick={() => setActiveTab("schedule")}>Mentor Schedule</button>
        </div>

        {/* Tab Content */}
        {activeTab === "profile" && (
          <>
            <div className="profile-header">
              <h1>Mentor Profile</h1>
            </div>

            <div className="profile-info">
              <p><strong>Name:</strong> {user.displayName || "N/A"}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>

            <form className="mentor-form" onSubmit={handleSubmit}>
              <h2>{mentorDetails.phone ? "Edit Your Information" : "Add Mentor Information"}</h2>

              <input type="text" name="phone" placeholder="Phone Number" value={mentorDetails.phone} onChange={handleInputChange} required />
              <input type="text" name="location" placeholder="Location (City, State)" value={mentorDetails.location} onChange={handleInputChange} required />
              <input type="text" name="specialization" placeholder="Specialization (e.g. AI, Web Dev)" value={mentorDetails.specialization} onChange={handleInputChange} required />
              <input type="text" name="experience" placeholder="Years of Experience" value={mentorDetails.experience} onChange={handleInputChange} required />
              <input type="text" name="qualification" placeholder="Highest Qualification" value={mentorDetails.qualification} onChange={handleInputChange} required />
              <input type="text" name="currentCompany" placeholder="Current Company" value={mentorDetails.currentCompany} onChange={handleInputChange} required />
              <input type="number" name="availability" placeholder="Availability (Hours/week)" value={mentorDetails.availability} onChange={handleInputChange} required />
              <input type="url" name="linkedin" placeholder="LinkedIn Profile URL" value={mentorDetails.linkedin} onChange={handleInputChange} required />
              <textarea name="bio" placeholder="Brief Bio" rows="4" value={mentorDetails.bio} onChange={handleInputChange} required></textarea>

              <button type="submit" className="submit-btn">
                {mentorDetails.phone ? "Update Profile" : "Submit Details"}
              </button>
            </form>
          </>
        )}

        {activeTab === "schedule" && (
          <div className="schedule-tab">
            <h2>Scheduled Sessions</h2>
            {mentorSchedules.length === 0 ? (
              <p>No sessions scheduled yet.</p>
            ) : (
<ul className="schedule-list">
  {mentorSchedules.map((session) => (
    <li key={session.id}>
      <div className="mentor-profile">
        {/* If editing this session, show edit form */}
        {editingSession === session.id ? (
          <form className="edit-session-form" onSubmit={handleEditSessionSubmit} style={{marginBottom: '20px'}}>
            <h3>Edit Session</h3>
            <input type="text" name="name" placeholder="Name" value={editSessionData.name || ''} onChange={handleEditSessionChange} required />
            <input type="text" name="role" placeholder="Role" value={editSessionData.role || ''} onChange={handleEditSessionChange} required />
            <input type="text" name="university" placeholder="University" value={editSessionData.university || ''} onChange={handleEditSessionChange} required />
            <input type="text" name="education" placeholder="Education" value={editSessionData.education || ''} onChange={handleEditSessionChange} required />
            <input type="text" name="experience" placeholder="Experience" value={editSessionData.experience || ''} onChange={handleEditSessionChange} required />
            <input type="text" name="languages" placeholder="Languages" value={editSessionData.languages || ''} onChange={handleEditSessionChange} required />
            <input type="number" name="price" placeholder="Session Price" value={editSessionData.price || ''} onChange={handleEditSessionChange} required />
            <input type="url" name="linkedin" placeholder="LinkedIn" value={editSessionData.linkedin || ''} onChange={handleEditSessionChange} required />
            <textarea name="about" placeholder="About" value={editSessionData.about || ''} onChange={handleEditSessionChange} required />
            <textarea name="whyMentor" placeholder="Why I Mentor" value={editSessionData.whyMentor || ''} onChange={handleEditSessionChange} required />
            <textarea name="helpWith" placeholder="Help With" value={editSessionData.helpWith || ''} onChange={handleEditSessionChange} required />
            {/* You can add more fields as needed */}
            <button type="submit" className="submit-btn">Save</button>
            <button type="button" className="cancel-btn" onClick={handleCancelEdit} style={{marginLeft: '10px'}}>Cancel</button>
          </form>
        ) : (
          <>
            <img
              src={session.imageUrl}
              alt={session.name}
              className="mentor-photo"
              style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover" }}
            />
            <h2>{session.name}</h2>
            <p><strong>Role:</strong> {session.role}</p>
            <p><strong>University:</strong> {session.university}</p>
            <p><strong>Education:</strong> {session.education}</p>
            <p><strong>Experience:</strong> {session.experience} years</p>
            <p><strong>Languages:</strong> {session.languages}</p>
            <p><strong>Session Price:</strong> £{session.price}</p>
            <p><strong>LinkedIn:</strong> <a href={session.linkedin} target="_blank" rel="noreferrer">{session.linkedin}</a></p>
            <p><strong>About:</strong> {session.about}</p>
            <p><strong>Why I Mentor:</strong> {session.whyMentor}</p>
            <p><strong>Help With:</strong> {session.helpWith}</p>
            <p><strong>Created At:</strong> {session.createdAt ? new Date(session.createdAt).toLocaleString() : "N/A"}</p>
            <p><strong>Created By:</strong> {session.createdBy}</p>
            <button className="edit-btn" style={{marginTop: '10px'}} onClick={() => handleEditSession(session)}>Edit</button>
            <h3 style={{ marginTop: "20px" }}>Session Slots</h3>
            {session.sessionSlots?.length > 0 ? (
              session.sessionSlots.map((slot, i) => (
                <div key={i} className="session-slot" style={{ padding: "10px", border: "1px solid #ccc", marginBottom: "10px" }}>
                  <p><strong>Title:</strong> {slot.title}</p>
                  <p><strong>Description:</strong> {slot.description}</p>
                  <p><strong>Duration:</strong> {slot.duration}</p>
                  <p><strong>Price:</strong> £{slot.price}</p>
                  {slot.status && <p><strong>Status:</strong> {slot.status}</p>}
                </div>
              ))
            ) : (
              <p>No session slots available.</p>
            )}
          </>
        )}
      </div>
    </li>
  ))}
</ul>
            )}
          </div>
        )}
      </div>
      <div style={{ textAlign: "center", marginTop: "40px" }}>
  <button className="btn logout-btn" onClick={handleLogout} style={{ backgroundColor: "#e74c3c", color: "#fff", padding: "10px 20px", borderRadius: "5px" }}>
    Logout
  </button>
</div>

      <Footer />
    </div>
  );
}
