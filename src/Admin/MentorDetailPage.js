import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import "./MentorDetailPage.css";

export default function MentorDetailPage() {
  const { id } = useParams();
  const [mentor, setMentor] = useState(null);

  useEffect(() => {
    const fetchMentor = async () => {
      const docSnap = await getDoc(doc(db, "mentors_section", id));
      if (docSnap.exists()) {
        setMentor(docSnap.data());
      }
    };
    fetchMentor();
  }, [id]);

  if (!mentor) return <p>Loading...</p>;

  return (
    <div className="form-box">
      <h2>{mentor.name}</h2>
      <img
        src={mentor.imageUrl}
        alt={`${mentor.name}'s profile`}
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          objectFit: "cover",
          marginBottom: "20px",
        }}
      />
      <p><strong>Role:</strong> {mentor.role}</p>
      <p><strong>Experience:</strong> {mentor.experience} years</p>
      <p><strong>Languages:</strong> {mentor.languages}</p>
      <p><strong>University:</strong> {mentor.university}</p>
      <p><strong>Education:</strong> {mentor.education}</p>
      <p><strong>Session Price:</strong> £{mentor.price}</p>
      <p><strong>LinkedIn:</strong> <a href={mentor.linkedin} target="_blank" rel="noopener noreferrer">{mentor.linkedin}</a></p>
      <p><strong>About:</strong> {mentor.about}</p>
      <p><strong>Why I Mentor:</strong> {mentor.whyMentor}</p>
      <p><strong>Can Help With:</strong> {mentor.helpWith}</p>

      <h3 style={{ marginTop: "20px" }}>1-on-1 Session Slots</h3>
      {mentor.sessionSlots && mentor.sessionSlots.length > 0 ? (
        mentor.sessionSlots.map((slot, index) => (
          <div key={index} className="session-slot">
            <p><strong>Title:</strong> {slot.title}</p>
            <p><strong>Duration:</strong> {slot.duration}</p>
            <p><strong>Price:</strong> £{slot.price}</p>
            <p><strong>Description:</strong> {slot.description}</p>
          </div>
        ))
      ) : (
        <p>No session slots available.</p>
      )}
    </div>
  );
}
