import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import "./ProfileDetails.css";

export default function ProfileDetails() {
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  const mentorId = localStorage.getItem("mentorId");

useEffect(() => {
  const fetchMentorProfile = async () => {
    if (!mentorId) return;
    try {
      const docRef = doc(db, "mentor_profile", mentorId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();

        // 🚫 Skip rendering if status is 'finished'
        if (data.Status === "finished") {
          setMentor(null);  // this ensures it doesn't render
          return;
        }

        setMentor(data);
        setFormData({
          ...data,
          availableSlots: data.availableSlots || [{ date: "", times: [""] }],
        });
      }
    } catch (err) {
      console.error("Failed to fetch mentor profile:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchMentorProfile();
}, [mentorId]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (index, value) => {
    const updated = [...formData.availableSlots];
    updated[index].date = value;
    setFormData({ ...formData, availableSlots: updated });
  };

  const handleTimeChange = (dateIndex, timeIndex, value) => {
    const updated = [...formData.availableSlots];
    updated[dateIndex].times[timeIndex] = value;
    setFormData({ ...formData, availableSlots: updated });
  };

  const addTimeSlot = (index) => {
    const updated = [...formData.availableSlots];
    updated[index].times.push("");
    setFormData({ ...formData, availableSlots: updated });
  };

  const removeTimeSlot = (dateIndex, timeIndex) => {
    const updated = [...formData.availableSlots];
    updated[dateIndex].times.splice(timeIndex, 1);
    setFormData({ ...formData, availableSlots: updated });
  };

  const addDateSlot = () => {
    setFormData({
      ...formData,
      availableSlots: [...formData.availableSlots, { date: "", times: [""] }],
    });
  };

  const removeDateSlot = (index) => {
    const updated = [...formData.availableSlots];
    updated.splice(index, 1);
    setFormData({ ...formData, availableSlots: updated });
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, "mentor_profile", mentorId);
      await updateDoc(docRef, formData);
      setMentor(formData);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (!mentor) return <p>No profile found.</p>;

  return (
    <div className="profile-details-container">
      <h2>My Profile</h2>
      <div className="profile-card">
        {mentor.profileImageURL && (
          <img
            src={mentor.profileImageURL}
            alt="Mentor"
            className="profile-image"
          />
        )}
        <div className="profile-info">
          {editMode ? (
            <>
              <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" />
              <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
              <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
              <input name="jobTitle" value={formData.jobTitle} onChange={handleChange} placeholder="Job Title" />
              <input name="company" value={formData.company} onChange={handleChange} placeholder="Company" />
              <input name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="LinkedIn URL" />
              <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio" />
              <textarea name="mentorReason" value={formData.mentorReason} onChange={handleChange} placeholder="Why I'm a Mentor" />

              <h4>Available Slots</h4>
              {formData.availableSlots.map((slot, index) => (
                <div key={index} className="slot-group">
                  <input
                    type="date"
                    value={slot.date}
                    onChange={(e) => handleDateChange(index, e.target.value)}
                  />

                  {slot.times.map((time, timeIdx) => (
                    <div key={timeIdx} className="time-row">
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => handleTimeChange(index, timeIdx, e.target.value)}
                      />
                      <button
                        onClick={() => removeTimeSlot(index, timeIdx)}
                        className="btn remove-btn"
                      >
                        ❌
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => addTimeSlot(index)}
                    className="btn add-btn"
                  >
                    ➕ Add Time
                  </button>

                  <button
                    onClick={() => removeDateSlot(index)}
                    className="btn remove-btn"
                  >
                    🗑️ Remove Date
                  </button>
                  <hr />
                </div>
              ))}

              <button onClick={addDateSlot} className="btn add-btn">
                ➕ Add Date
              </button>

              <div className="button-group">
                <button className="btn save-btn" onClick={handleSave}>Save</button>
                <button className="btn cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <p><strong>Full Name:</strong> {mentor.fullName}</p>
              <p><strong>Username:</strong> {mentor.username}</p>
              <p><strong>Email:</strong> {mentor.email}</p>
              <p><strong>Job Title:</strong> {mentor.jobTitle}</p>
              <p><strong>Company:</strong> {mentor.company}</p>
              <p><strong>Status:</strong> {mentor.Status === "accepted" ? "Accepted ✅" : mentor.Status}</p>
              <p><strong>LinkedIn:</strong> <a href={mentor.linkedin} target="_blank" rel="noreferrer">{mentor.linkedin}</a></p>
              <p><strong>Bio:</strong> {mentor.bio}</p>
              <p><strong>Why I'm a Mentor:</strong> {mentor.mentorReason}</p>

              {mentor.fieldsHelpWith && (
                <div>
                  <strong>Fields I Can Help With:</strong>
                  <ul>
                    {mentor.fieldsHelpWith.map((field, idx) => (
                      <li key={idx}>{field}</li>
                    ))}
                  </ul>
                </div>
              )}

            {mentor.availableSlots && mentor.availableSlots.length > 0 ? (
  <div>
    <strong>Available Slots:</strong>
    <ul>
      {mentor.availableSlots.map((slot, idx) => (
        <li key={idx}>
          <strong>{slot.date}:</strong> {slot.times.join(", ")}
        </li>
      ))}
    </ul>
  </div>
) : (
  <p style={{ color: "red", fontStyle: "italic" }}>
    Time and date are not added. Please click <strong>Edit</strong> and create.
  </p>
)}

              <button className="btn edit-btn" onClick={() => setEditMode(true)}>✏️ Edit Profile</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
