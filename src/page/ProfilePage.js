import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  doc,
  setDoc,
  getDoc
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "firebase/storage";
import "./ProfilePage.css";
import Heading from "../components/heading";
import Footer from "../components/footer";
import { signOut } from "firebase/auth";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [mentorDetails, setMentorDetails] = useState({
    fullName: "",
    jobTitle: "",
    company: "",
    university: "",
    linkedin: "",
    fieldsHelp: [],
    bio: "",
    whyMentor: "",
    sessionPrice: "",
    imageUrl: ""
  });

  // Wait for user authentication
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        navigate("/"); // Redirect if not authenticated
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchMentorDetails = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, "mentors", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setMentorDetails((prev) => ({
            ...prev,
            ...data,
            fieldsHelp: Array.isArray(data.fieldsHelp) ? data.fieldsHelp : []
          }));
        }
      } catch (error) {
        console.error("Error fetching mentor data:", error);
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
        ...mentorDetails,
        imageUrl,
        updatedAt: new Date()
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

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        localStorage.clear();
        sessionStorage.clear();

        if (window.indexedDB) {
          indexedDB.databases().then((databases) => {
            databases.forEach((db) => {
              indexedDB.deleteDatabase(db.name);
            });
          });
        }
        navigate("/");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  const fieldsOptions = [
    "University/course selection",
    "Job/internship applications",
    "CV/LinkedIn review",
    "Visa or immigration process",
    "Interview prep",
    "Industry insights"
  ];

  // 🟡 Show loading while waiting for user
  if (!user) {
    return (
      <div className="profile-wrapper">
        <center><h2>Loading profile...</h2></center>
      </div>
    );
  }

  return (
    <div>
      <Heading />
      <div className="profile-wrapper">
        <center><h1>Profile</h1></center>

        <div className="tab-buttons">
          <button className={activeTab === "details" ? "active" : ""} onClick={() => setActiveTab("details")}>Details</button>
          <button className={activeTab === "booking" ? "active" : ""} onClick={() => setActiveTab("booking")}>Booking</button>
        </div>

        {activeTab === "details" && (
          <>
            <div className="profile-info">
              <p><strong>Name:</strong> {user.displayName || "N/A"}</p>
              <p><strong>Email:</strong> {user.email}</p>
              {mentorDetails.imageUrl && (
                <img
                  src={mentorDetails.imageUrl}
                  alt="Profile"
                  style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover" }}
                />
              )}
            </div>
          </>
        )}

        {activeTab === "booking" && (
          <div className="booking-section">
            <h3>Sample Booking Slots</h3>
            <ul>
              <li>📅 12th Aug - 10:00 AM to 11:00 AM</li>
              <li>📅 13th Aug - 2:00 PM to 3:00 PM</li>
              <li>📅 15th Aug - 5:00 PM to 6:00 PM</li>
            </ul>
            <p>Note: This is sample data. Integrate your calendar for real slots.</p>
          </div>
        )}

        {/* Logout button */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
