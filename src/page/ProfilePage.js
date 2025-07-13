import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
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
    bio: "",
    jobTitle: "",
    company: "",
    university: "",
    fieldsHelp: [],
    shortBio: "",
    whyMentor: "",
    calLink: "",
    sessionPrice: "",
    consent: false,
  });

  const [activeTab, setActiveTab] = useState("profile");
  const [mentorSchedules, setMentorSchedules] = useState([]);
  const [editingSession, setEditingSession] = useState(null);
  const [editSessionData, setEditSessionData] = useState({});

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
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

        const q = query(
          collection(db, "mentors_section"),
          where("createdBy", "==", user.uid)
        );
        const snap = await getDocs(q);
        const scheduleData = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
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
        updatedAt: new Date(),
      });
      alert("Mentor profile saved successfully!");
    } catch (error) {
      console.error("Error updating mentor data:", error);
      alert("Error updating profile.");
    }
  };

  const handleEditSession = (session) => {
    setEditingSession(session.id);
    setEditSessionData({ ...session });
  };

  const handleEditSessionChange = (e) => {
    setEditSessionData({
      ...editSessionData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditSessionSubmit = async (e) => {
    e.preventDefault();
    if (!user || !editingSession) return;
    try {
      const docRef = doc(db, "mentors_section", editingSession);
      await setDoc(docRef, { ...editSessionData }, { merge: true });

      const q = query(
        collection(db, "mentors_section"),
        where("createdBy", "==", user.uid)
      );
      const snap = await getDocs(q);
      const scheduleData = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMentorSchedules(scheduleData);
      setEditingSession(null);
      alert("Session updated successfully!");
    } catch (error) {
      console.error("Error updating session:", error);
      alert("Error updating session.");
    }
  };

  const handleCancelEdit = () => {
    setEditingSession(null);
    setEditSessionData({});
  };

  if (!user) {
    return (
      <div className="profile-container">
        <h2>You are not logged in.</h2>
        <button className="btn" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="profile-container">
        <h2>Loading profile...</h2>
      </div>
    );
  }

  return (
    <div>
      <Heading />
      <div className="profile-wrapper">
        <div className="tab-header">
          <button
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={activeTab === "schedule" ? "active" : ""}
            onClick={() => setActiveTab("schedule")}
          >
            Mentor Schedule
          </button>
        </div>

        {activeTab === "profile" && (
          <>
            <div className="profile-header">
              <h1>Mentor Profile</h1>
            </div>

            <div className="profile-info">
              <p>
                <strong>Name:</strong> {user.displayName || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
            </div>

            <form className="mentor-form" onSubmit={handleSubmit}>
              <h2>
                {mentorDetails.phone
                  ? "Edit Your Information"
                  : "Add Mentor Information"}
              </h2>

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={mentorDetails.phone}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={mentorDetails.location}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="specialization"
                placeholder="Specialization"
                value={mentorDetails.specialization}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="experience"
                placeholder="Experience"
                value={mentorDetails.experience}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="qualification"
                placeholder="Qualification"
                value={mentorDetails.qualification}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="currentCompany"
                placeholder="Current Company"
                value={mentorDetails.currentCompany}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="availability"
                placeholder="Availability"
                value={mentorDetails.availability}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="linkedin"
                placeholder="LinkedIn URL"
                value={mentorDetails.linkedin}
                onChange={handleInputChange}
              />
              <textarea
                name="bio"
                placeholder="Bio"
                value={mentorDetails.bio}
                onChange={handleInputChange}
              />

              <button type="submit" className="submit-btn">
                {mentorDetails.phone ? "Update Profile" : "Submit"}
              </button>
            </form>

            {/* ✅ Display Signup Form Data */}
            <div className="profile-extra">
              <h2>Signup Details</h2>
              <p>
                <strong>Job Title:</strong> {mentorDetails.jobTitle || "N/A"}
              </p>
              <p>
                <strong>Company:</strong> {mentorDetails.company || "N/A"}
              </p>
              <p>
                <strong>University:</strong> {mentorDetails.university || "N/A"}
              </p>
              <p>
                <strong>Fields You Can Help With:</strong>{" "}
                {mentorDetails.fieldsHelp?.join(", ") || "N/A"}
              </p>
              <p>
                <strong>Short Bio:</strong>{" "}
                {mentorDetails.shortBio || "N/A"}
              </p>
              <p>
                <strong>Why Mentor:</strong>{" "}
                {mentorDetails.whyMentor || "N/A"}
              </p>
              <p>
                <strong>Calendly Link:</strong>{" "}
                {mentorDetails.calLink ? (
                  <a
                    href={mentorDetails.calLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {mentorDetails.calLink}
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
              <p>
                <strong>Session Price:</strong> £
                {mentorDetails.sessionPrice || "N/A"}
              </p>
            </div>
          </>
        )}

        {/* Leave Schedule Tab as-is */}
        {activeTab === "schedule" && (
          <div className="schedule-tab">
            <h2>Scheduled Sessions</h2>
            {mentorSchedules.length === 0 ? (
              <p>No sessions yet.</p>
            ) : (
              <ul>
                {mentorSchedules.map((s) => (
                  <li key={s.id}>{s.name}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <button
          className="btn logout-btn"
          onClick={handleLogout}
          style={{
            backgroundColor: "#e74c3c",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "5px",
          }}
        >
          Logout
        </button>
      </div>

      <Footer />
    </div>
  );
}
