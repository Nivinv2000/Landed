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
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [isUploading, setIsUploading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [mentorDetails, setMentorDetails] = useState({
    fullName: "",
    jobTitle: "",
    company: "",
    university: "",
    linkedin: "",
    fieldsHelp: [],
    bio: "",
    whyMentor: "",
    // calLink: "",
    sessionPrice: "",
    imageUrl: ""
  });

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
            fieldsHelp: Array.isArray(data.fieldsHelp) ? data.fieldsHelp : []
          });
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

  const fieldsOptions = [
    "University/course selection",
    "Job/internship applications",
    "CV/LinkedIn review",
    "Visa or immigration process",
    "Interview prep",
    "Industry insights"
  ];

  return (
    <div>
      <Heading />
      <div className="profile-wrapper">
        <h1>Mentor Profile</h1>
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
        <form className="mentor-form" onSubmit={handleSubmit}>
          <label>Upload Profile Image:</label>
          <input type="file" accept="image/*" onChange={(e) => setProfileImage(e.target.files[0])} />

          <input type="text" name="fullName" placeholder="Full Name" value={mentorDetails.fullName} onChange={handleInputChange} required />
          <input type="text" name="jobTitle" placeholder="Job Title" value={mentorDetails.jobTitle} onChange={handleInputChange} required />
          <input type="text" name="company" placeholder="Company" value={mentorDetails.company} onChange={handleInputChange} required />
          <input type="text" name="university" placeholder="Your University & Degree" value={mentorDetails.university} onChange={handleInputChange} required />
          <input type="url" name="linkedin" placeholder="LinkedIn URL" value={mentorDetails.linkedin} onChange={handleInputChange} required />

          <label>Fields You Can Help With:</label>
          <div className="checkbox-group">
            {fieldsOptions.map((field) => (
              <label key={field}>
                <input
                  type="checkbox"
                  checked={mentorDetails.fieldsHelp.includes(field)}
                  onChange={(e) => {
                    const updated = e.target.checked
                      ? [...mentorDetails.fieldsHelp, field]
                      : mentorDetails.fieldsHelp.filter((f) => f !== field);
                    setMentorDetails({ ...mentorDetails, fieldsHelp: updated });
                  }}
                />
                {field}
              </label>
            ))}
          </div>

          <textarea name="bio" placeholder="Short Bio (100–200 words)" rows="4" value={mentorDetails.bio} onChange={handleInputChange} required></textarea>
          <textarea name="whyMentor" placeholder="Why do you mentor? (100–200 words)" rows="4" value={mentorDetails.whyMentor} onChange={handleInputChange} required></textarea>

          // <input type="url" name="calLink" placeholder="Cal.com Booking Link" value={mentorDetails.calLink} onChange={handleInputChange} required />
          <input type="number" name="sessionPrice" placeholder="Your Session Price (GBP)" value={mentorDetails.sessionPrice} onChange={handleInputChange} required />

          <button type="submit" className="submit-btn" disabled={isUploading}>
            {isUploading ? <div className="spinner"></div> : "Save Profile"}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
