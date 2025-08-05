import React, { useEffect, useState } from "react";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import "./AddSchedulePage.css";

const AddSchedule = () => {
  const mentorId = localStorage.getItem("mentorId");

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    experience: "",
    location: "",
    languages: "",
    university: "",
    education: "",
    linkedin: "",
    about: "",
    whyMentor: "",
    helpWith: "",
    price: "",
    availableSlots : [],
  });

  const [imageFile, setImageFile] = useState(null);
  const [sessionSlots, setSessionSlots] = useState([
    { title: "", duration: "", description: "", price: "" },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [existingSessions, setExistingSessions] = useState([]);

  const handleSlotChange = (index, field, value) => {
    const updatedSlots = [...sessionSlots];
    updatedSlots[index][field] = value;
    setSessionSlots(updatedSlots);
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const mentorData = {
        ...formData,
        sessionSlots,
        createdAt: Timestamp.now(),
        // status: "pending",
        mentorId,
      };

      await addDoc(collection(db, "mentors_section"), mentorData);
      alert("Schedule submitted successfully!");
      setShowModal(false);
    } catch (err) {
      console.error("Error submitting schedule:", err);
      alert("Error occurred. Try again.");
    }
  };

  const fetchMentorProfile = async () => {
    try {
      const docRef = doc(db, "mentor_profile", mentorId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setFormData((prev) => ({
          ...prev,
          imageUrl: data.profileImageURL || "",
          name: data.fullName || "",
          role: data.jobTitle || "",
          university: data.universityDegree || "",
          linkedin: data.linkedin || "",
          about: data.bio || "",
          availableSlots: data.availableSlots || [],
          whyMentor: data.mentorReason || "",
          helpWith: data.fieldsHelpWith?.join(", ") || "",
        }));
      }
    } catch (err) {
      console.error("Error fetching mentor profile:", err);
    }
  };

  const fetchExistingSessions = async () => {
    try {
      const q = query(collection(db, "mentors_section"), where("mentorId", "==", mentorId));
      const querySnapshot = await getDocs(q);
      const sessions = [];
      querySnapshot.forEach((doc) => sessions.push(doc.data()));
      setExistingSessions(sessions);
    } catch (err) {
      console.error("Error fetching sessions:", err);
    }
  };

  useEffect(() => {
    if (mentorId) {
      fetchMentorProfile();
      fetchExistingSessions();
    }
  }, [mentorId]);

return (
  <div className="schedule-page">
    <div className="header">
      <h2>Mentor Availability</h2>
      <button className="add-section-btn" onClick={() => setShowModal(true)}>
        + Add Session Group
      </button>
    </div>

    <h3 className="subheading">Existing Sessions</h3>
    <div className="existing-sessions">
      {existingSessions.length === 0 ? (
        <p className="no-sessions">No sessions found.</p>
      ) : (
        existingSessions.map((session, idx) => (
          <div key={idx} className="session-block">
            <h4 className="session-title">Session Group {idx + 1}</h4>
            {session.sessionSlots?.map((slot, slotIdx) => (
              <div key={slotIdx} className="session-card">
                <h5>{slot.title}</h5>
                <p><strong>Duration:</strong> {slot.duration}</p>
                <p><strong>Description:</strong> {slot.description}</p>
                <p><strong>Price:</strong> ₹{slot.price}</p>
              </div>
            ))}
          </div>
        ))
      )}
    </div>

    {showModal && (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-modal" onClick={() => setShowModal(false)}>×</button>
          <h3>Add New Session Group</h3>

          <form onSubmit={handleSubmit} className="schedule-form">
            <div className="form-group">
              <input
                type="text"
                placeholder="Education"
                value={formData.education}
                onChange={(e) => handleFormChange("education", e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Experience"
                value={formData.experience}
                onChange={(e) => handleFormChange("experience", e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Languages"
                value={formData.languages}
                onChange={(e) => handleFormChange("languages", e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => handleFormChange("location", e.target.value)}
                required
              />
            </div>

            <h4>Session Slots</h4>
            {sessionSlots.map((slot, index) => (
              <div key={index} className="slot-group">
                <input
                  type="text"
                  placeholder="Session Title"
                  value={slot.title}
                  onChange={(e) => handleSlotChange(index, "title", e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Duration (e.g., 30 mins)"
                  value={slot.duration}
                  onChange={(e) => handleSlotChange(index, "duration", e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={slot.description}
                  onChange={(e) => handleSlotChange(index, "description", e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Price (₹)"
                  value={slot.price}
                  onChange={(e) => handleSlotChange(index, "price", e.target.value)}
                  required
                />
              </div>
            ))}

            <button
              type="button"
              className="btn add-slot-btn"
              onClick={() =>
                setSessionSlots([...sessionSlots, { title: "", duration: "", description: "", price: "" }])
              }
            >
              + Add Extra Slot
            </button>

            <button type="submit" className="submit-btn">
              Submit Schedule
            </button>
          </form>
        </div>
      </div>
    )}
  </div>
);
}

export default AddSchedule;
