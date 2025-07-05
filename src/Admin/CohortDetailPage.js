import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import "./CohortDetailPage.css"; // Optional CSS

export default function CohortDetailPage() {
  const { id } = useParams();
  const [cohort, setCohort] = useState(null);

  useEffect(() => {
    const fetchCohort = async () => {
      const docSnap = await getDoc(doc(db, "Cohorts", id));
      if (docSnap.exists()) {
        setCohort(docSnap.data());
      }
    };
    fetchCohort();
  }, [id]);

  if (!cohort) return <p>Loading...</p>;

  return (
    <div className="form-box">
      <h2>{cohort.cohortTitle}</h2>
      <img
        src={cohort.imageUrl}
        alt="Cohort Visual"
        style={{
          width: "100%",
          maxHeight: "280px",
          objectFit: "cover",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      />
      <p><strong>Subtitle:</strong> {cohort.subtitle}</p>
      <p><strong>Mentor:</strong> {cohort.mentorName}</p>
      <p><strong>Start Date:</strong> {cohort.startDate}</p>
      <p><strong>End Date:</strong> {cohort.endDate}</p>
      <p><strong>Target Audience:</strong> {cohort.audience}</p>
      <p><strong>Mentees Count:</strong> {cohort.menteesCount}</p>
      <p><strong>Time Commitment:</strong> {cohort.commitment}</p>
      <p><strong>Welcome Message:</strong> {cohort.welcomeMsg}</p>
      <p><strong>Core Skills:</strong> {cohort.coreSkills}</p>
      <p><strong>Interview Prep:</strong> {cohort.interviewPrep}</p>
      <p><strong>Skills You’ll Gain:</strong> {cohort.skillsGain}</p>

      <h3>Schedule</h3>
      {cohort.schedule?.map((s, i) => (
        <div key={i} className="session-slot">
          <p><strong>Topic:</strong> {s.topic}</p>
          <p><strong>Date:</strong> {s.date}</p>
          <p><strong>Details:</strong> {s.details}</p>
        </div>
      ))}

      <h3>Tasks</h3>
      {cohort.tasks?.map((t, i) => (
        <div key={i} className="session-slot">
          <p><strong>Title:</strong> {t.title}</p>
          <p><strong>Description:</strong> {t.description}</p>
          <p><strong>Due:</strong> {t.due}</p>
        </div>
      ))}

      <h3>Resources</h3>
      {cohort.resources?.map((r, i) => (
        <div key={i} className="session-slot">
          <p><strong>{r.title}</strong> — <a href={r.url} target="_blank" rel="noopener noreferrer">{r.url}</a></p>
        </div>
      ))}

      <h3>Progress Updates</h3>
      <p>{cohort.progress}</p>
    </div>
  );
}
