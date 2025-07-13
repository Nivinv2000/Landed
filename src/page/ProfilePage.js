import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
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
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import "./ProfilePage.css";
import Heading from "../components/heading";
import Footer from "../components/footer";
import { signOut } from "firebase/auth";

export default function ProfilePage() {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

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
    university: "",
    fieldsHelp: [],
    whyMentor: "",
    sessionPrice: "",
    calLink: "",
    imageUrl: "",
  });

  const [activeTab, setActiveTab] = useState("profile");
  const [mentorSchedules, setMentorSchedules] = useState([]);

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
        if (docSnap.exists()) {
          const data = docSnap.data();
          setMentorDetails({
            ...mentorDetails,
            ...data,
            fieldsHelp: Array.isArray(data.fieldsHelp) ? data.fieldsHelp : [], // Ensure it's an array
          });

        }

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

    setIsUploading(true);

    try {
      let imageUrl = mentorDetails.imageUrl || "";

      if (profileImage) {
        const imageRef = ref(storage, `mentor_profiles/${user.uid}`);
        await uploadBytes(imageRef, profileImage);
        imageUrl = await getDownloadURL(imageRef);
      }

      const docRef = doc(db, "mentors", user.uid);
      await setDoc(docRef, {
        uid: user.uid,
        email: user.email,
        name: user.displayName || "",
        ...mentorDetails,
        imageUrl,
        updatedAt: new Date(),
      });

      setMentorDetails((prev) => ({ ...prev, imageUrl }));
      alert("Mentor profile saved successfully!");
    } catch (error) {
      console.error("Error updating mentor data:", error);
      alert("Error updating profile.");
    } finally {
      setIsUploading(false);
    }
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
              {mentorDetails.imageUrl && (
                <img
                  src={mentorDetails.imageUrl}
                  alt="Profile"
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginTop: "10px",
                  }}
                />
              )}
            </div>

            <form className="mentor-form" onSubmit={handleSubmit}>
              <h2>
                {mentorDetails.phone
                  ? "Edit Your Information"
                  : "Add Mentor Information"}
              </h2>

              <label>Upload Profile Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfileImage(e.target.files[0])}
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={mentorDetails.phone}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={mentorDetails.location}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="specialization"
                placeholder="Specialization"
                value={mentorDetails.specialization}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="experience"
                placeholder="Years of Experience"
                value={mentorDetails.experience}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="qualification"
                placeholder="Highest Qualification"
                value={mentorDetails.qualification}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="currentCompany"
                placeholder="Current Company"
                value={mentorDetails.currentCompany}
                onChange={handleInputChange}
                required
              />
              <input
                type="number"
                name="availability"
                placeholder="Availability (Hours/week)"
                value={mentorDetails.availability}
                onChange={handleInputChange}
                required
              />
              <input
                type="url"
                name="linkedin"
                placeholder="LinkedIn Profile URL"
                value={mentorDetails.linkedin}
                onChange={handleInputChange}
                required
              />
              <textarea
                name="bio"
                placeholder="Brief Bio"
                rows="4"
                value={mentorDetails.bio}
                onChange={handleInputChange}
                required
              ></textarea>

              <input
                type="text"
                name="university"
                placeholder="University & Degree"
                value={mentorDetails.university}
                onChange={handleInputChange}
                required
              />

              <label>Fields You Can Help With:</label>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {[
                  "University/course selection",
                  "Job/internship applications",
                  "CV/LinkedIn review",
                  "Visa or immigration process",
                  "Prep help",
                  "Industry insights",
                ].map((field) => (
                  <label key={field}>
                    <input
                      type="checkbox"
                      checked={mentorDetails.fieldsHelp.includes(field)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...mentorDetails.fieldsHelp, field]
                          : mentorDetails.fieldsHelp.filter((f) => f !== field);
                        setMentorDetails({
                          ...mentorDetails,
                          fieldsHelp: updated,
                        });
                      }}
                    />
                    {field}
                  </label>
                ))}
              </div>

              <textarea
                name="whyMentor"
                placeholder="Why do you mentor? (100–200 words)"
                value={mentorDetails.whyMentor}
                onChange={handleInputChange}
                rows="4"
                required
              ></textarea>

              <input
                type="url"
                name="calLink"
                placeholder="Your Cal.com Link"
                value={mentorDetails.calLink}
                onChange={handleInputChange}
                required
              />

              <input
                type="number"
                name="sessionPrice"
                placeholder="Session Price (in GBP)"
                value={mentorDetails.sessionPrice}
                onChange={handleInputChange}
                required
              />

              <button type="submit" className="submit-btn" disabled={isUploading}>
                {isUploading ? <div className="spinner"></div> : mentorDetails.phone ? "Update Profile" : "Submit Details"}
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
                {/* You can populate this with schedule info */}
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
