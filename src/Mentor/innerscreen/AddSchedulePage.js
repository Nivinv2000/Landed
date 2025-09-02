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
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
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
    availableSlots: [],
  });

  const [sessionSlots, setSessionSlots] = useState([
    { title: "", duration: "", description: "", price: "" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [existingSessions, setExistingSessions] = useState([]);
  const [editingSession, setEditingSession] = useState(null);

  // ✅ Handle slot changes
  const handleSlotChange = (index, field, value) => {
    const updatedSlots = [...sessionSlots];
    updatedSlots[index][field] = value;
    setSessionSlots(updatedSlots);
  };

  // ✅ Handle form changes
  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let slots = formData.availableSlots;

      if (!slots || slots.length === 0) {
        const docRef = doc(db, "mentor_profile", mentorId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          slots = data.availableSlots || [];
        }
      }

      if (!slots || slots.length === 0) {
        alert(
          "Please add your availability slots in your profile before creating or updating sessions."
        );
        return;
      }

      const mentorData = {
        ...formData,
        availableSlots: slots,
        sessionSlots,
        createdAt: Timestamp.now(),
        mentorId,
      };

      if (editingSession) {
        await updateDoc(doc(db, "mentors_section", editingSession), mentorData);
        alert("Session updated successfully!");
      } else {
        await addDoc(collection(db, "mentors_section"), mentorData);
        alert("Schedule submitted successfully!");
      }

      setShowModal(false);
      setEditingSession(null);
      fetchExistingSessions();
    } catch (err) {
      console.error("Error submitting schedule:", err);
      alert("Error occurred. Try again.");
    }
  };

  // ✅ Fetch mentor profile
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
          price: data.sessionPrice || "",
          experience: data.experience || "",
          location: data.location || "",
          languages: data.languages || "",
          education: data.education || "",
        }));
      }
    } catch (err) {
      console.error("Error fetching mentor profile:", err);
    }
  };

  // ✅ Fetch existing sessions
  const fetchExistingSessions = async () => {
    try {
      const q = query(
        collection(db, "mentors_section"),
        where("mentorId", "==", mentorId)
      );
      const querySnapshot = await getDocs(q);
      const sessions = [];
      querySnapshot.forEach((docSnap) =>
        sessions.push({ id: docSnap.id, ...docSnap.data() })
      );
      setExistingSessions(sessions);
    } catch (err) {
      console.error("Error fetching sessions:", err);
    }
  };

  // ✅ Edit handler
  const handleEdit = (session) => {
    setEditingSession(session.id);
    setFormData(session);
    setSessionSlots(session.sessionSlots || []);
    setShowModal(true);
  };

  // ✅ Delete handler
  const handleDelete = async (sessionId) => {
    if (window.confirm("Are you sure you want to delete this session group?")) {
      try {
        await deleteDoc(doc(db, "mentors_section", sessionId));
        setExistingSessions((prev) => prev.filter((s) => s.id !== sessionId));
      } catch (err) {
        console.error("Error deleting session:", err);
      }
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

        {/* Hide Add button if at least one session exists */}
        {existingSessions.length === 0 && (
          <button
            className="add-section-btn"
            onClick={() => setShowModal(true)}
            disabled={
              !formData.availableSlots || formData.availableSlots.length === 0
            }
          >
            + Add Session Group
          </button>
        )}
      </div>

      {/* Show warning if no slots */}
      {(!formData.availableSlots || formData.availableSlots.length === 0) && (
        <p className="warning-text">
          Please add your availability slots in your profile before adding
          sessions.
        </p>
      )}

      <h3 className="subheading">Existing Sessions</h3>
      <div className="existing-sessions">
        {existingSessions.length === 0 ? (
          <p className="no-sessions">No sessions found.</p>
        ) : (
          existingSessions.map((session, idx) => (
            <div key={session.id} className="session-block">
              <h4 className="session-title">Session Group {idx + 1}</h4>
              {session.sessionSlots?.map((slot, slotIdx) => (
                <div key={slotIdx} className="session-card">
                  <h5>{slot.title}</h5>
                  <p>
                    <strong>Duration:</strong> {slot.duration}
                  </p>
                  <p>
                    <strong>Description:</strong> {slot.description}
                  </p>
                  <p>
                    <strong>Price:</strong> £{slot.price}
                  </p>
                </div>
              ))}

              <div className="session-actions">
                <button onClick={() => handleEdit(session)}>✏️ Edit</button>
                <button onClick={() => handleDelete(session.id)}>🗑️ Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-modal"
              onClick={() => {
                setShowModal(false);
                setEditingSession(null);
              }}
            >
              ×
            </button>
            <h3>
              {editingSession ? "Edit Session Group" : "Add New Session Group"}
            </h3>

            <form onSubmit={handleSubmit} className="schedule-form">
              <h4>Session Slots</h4>
              {sessionSlots.map((slot, index) => (
                <div key={index} className="slot-group">
                  <input
                    type="text"
                    placeholder="Session Title"
                    value={slot.title}
                    onChange={(e) =>
                      handleSlotChange(index, "title", e.target.value)
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g., 30 mins)"
                    value={slot.duration}
                    onChange={(e) =>
                      handleSlotChange(index, "duration", e.target.value)
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={slot.description}
                    onChange={(e) =>
                      handleSlotChange(index, "description", e.target.value)
                    }
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price (£)"
                    value={slot.price}
                    onChange={(e) =>
                      handleSlotChange(index, "price", e.target.value)
                    }
                    required
                  />
                </div>
              ))}

              <button
                type="button"
                className="btn add-slot-btn"
                onClick={() =>
                  setSessionSlots([
                    ...sessionSlots,
                    { title: "", duration: "", description: "", price: "" },
                  ])
                }
              >
                + Add Extra Slot
              </button>

              <button type="submit" className="submit-btn">
                {editingSession ? "Update Session" : "Submit Schedule"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddSchedule;
