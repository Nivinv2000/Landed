import React, { useEffect, useState } from "react";
import './MentorProfile.css';
import Footer from '../components/footer';
import Heading from '../components/heading';
import { useLocation } from "react-router-dom";
import MentorBookingModal from "../Innerscreen/MentorBookingModal";
import { FaUserGraduate, FaGlobe, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

const MentorProfile = () => {
  const { state } = useLocation();
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [mentorSessions, setMentorSessions] = useState(null);

  const mentor = state?.mentor;

  const handleBookNow = async (mentorProfile) => {
    setSelectedMentor(mentorProfile);
    setSelectedSlot(null);
    setMentorSessions(null);

    try {
      const q = query(
        collection(db, "mentors_section"),
        where("mentorId", "==", mentorProfile.id) // 🔹 match by mentorId
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        // ✅ Use the first mentors_section doc
        const sessionDoc = snapshot.docs[0].data();
        setMentorSessions(sessionDoc);
      } else {
        setMentorSessions({ notAvailable: true });
      }
    } catch (error) {
      console.error("Error fetching mentor sessions:", error);
      setMentorSessions({ notAvailable: true });
    }
  };

  const handleSlotBooking = (mentor, slot) => {
    setSelectedSlot(slot);
  };

  const handleCloseModal = () => {
    setSelectedMentor(null);
    setSelectedSlot(null);
    setMentorSessions(null);
  };

  if (!mentor) {
    return <p style={{ padding: "2rem", textAlign: "center" }}>No mentor data provided.</p>;
  }

  return (
    <div>
      <Heading />
      <div className="mentor-page">
        <nav className="breadcrumb">
          <span>Home</span> &gt; <span>Mentors</span> &gt; <strong>{mentor.name}</strong>
        </nav>

        <div className="mentor-content">
          {/* Left Panel */}
          <div className="mentor-sidebar">
            <img src={mentor.profileImageURL} alt={mentor.name} className="mentor-img" />
            <h2>{mentor.name}</h2>
            <p className="mentor-title">{mentor.role}</p>
            <span className="mentor-exp">{mentor.experience}+ Years</span>

            <div className="session-card">
              <h4>One-on-one Mentorship</h4>
              <p>
                {mentor.sessionSlots?.[0]?.description ||
                  "30-minute personal session to discuss careers, education, or goals"}
              </p>
              <h3>£{mentor.sessionPrice}</h3>
              <a href={`https://${mentor.linkedin.replace(/^https?:\/\//, '')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button type="button" className="btn-outline full">
                  LinkedIn Profile
                </button>
              </a>


              {/* 🔹 Book button with mentor check */}
              <button
                type="button"
                className="btn-primary full"
                onClick={() => handleBookNow(mentor)}
              >
                📅 Book a Session
              </button>
            </div>

            <div className="mentor-snapshot">
              <h4>Mentor Snapshot</h4>
              <ul>
                <li>🧠 {mentor.experience} years experience</li>
                <li>🎓 {mentor.education}</li>
                <li>🌐 {mentor.languages}</li>
              </ul>
            </div>
          </div>

          {/* 🔹 Booking Modal */}
          {selectedMentor && (
            <div className="mentor-modal-overlay" onClick={handleCloseModal}>
              <motion.div
                className="mentor-modal"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <button className="close-button" onClick={handleCloseModal}>
                  ×
                </button>

                <div className="mentor-modal-header">
                  <img src={selectedMentor.profileImageURL} alt={selectedMentor.fullName} />
                  <div>
                    <h2>{selectedMentor.fullName}</h2>
                    <p className="mentor-role"><FaUserGraduate /> {selectedMentor.jobTitle}</p>
                    <p className="mentor-univ"><FaGlobe /> {selectedMentor.universityDegree}</p>
                    {selectedMentor.location && (
                      <p className="mentor-location"><FaMapMarkerAlt /> {selectedMentor.location}</p>
                    )}
                  </div>
                </div>

                <div className="mentor-session-info">
                  <h3>1-on-1 Sessions</h3>

                  {mentorSessions === null && <p>Loading sessions...</p>}

                  {mentorSessions?.notAvailable && (
                    <p>❌ This mentor’s sessions are not available yet.</p>
                  )}

                  {mentorSessions?.sessionSlots?.length > 0 && (
                    <div className="session-grid">
                      {mentorSessions.sessionSlots.map((slot, index) => (
                        <div key={index} className="session-card">
                          <h4>{slot.title} - {slot.duration}</h4>
                          <p>{slot.description}</p>
                          <div className="session-details">
                            <span>🕒 {slot.duration}</span>
                            <span>💰 £{slot.price}</span>
                          </div>
                          <button
                            className="session-book"
                            onClick={() => handleSlotBooking(selectedMentor, slot)}
                          >
                            Book Now
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}

          {/* Final Booking Modal */}
          {selectedMentor && selectedSlot && (
            <MentorBookingModal
              mentor={selectedMentor}
              slot={selectedSlot}
              onClose={handleCloseModal}
            />
          )}

          {/* Right Panel */}
          <div className="mentor-main">
            <div className="mentor-section">
              <h3>📘 About the Mentor</h3>
              <p>{mentor.about}</p>
              <p><strong>Education:</strong> {mentor.education}</p>
            </div>

            <div className="mentor-section">
              <h3>💡 Why I Mentor</h3>
              <p>{mentor.bio}</p>
            </div>

            <div className="mentor-section">
              <h3>🛠️ What I Can Help With</h3>
              <p>{mentor.fieldsHelpWith}</p>
            </div>

            <div className="mentor-section testimonial-section">
              <h3>⭐ Student Testimonials</h3>
              <blockquote>
                “The session was incredibly helpful. I got practical advice that I could implement right away.”<br />
                <strong>Alex Johnson</strong> – <small>2 months ago</small>
              </blockquote>
              <blockquote>
                “I was stuck with my project and after just one session, I had a clear path forward. Highly recommend!”<br />
                <strong>Sara Williams</strong> – <small>1 month ago</small>
              </blockquote>
            </div>

            <div className="cta-bottom">
              <div className="cta-box">
                <h3>Ready to connect with {mentor.name}?</h3>
                <p>Secure your spot now and get personalized guidance.</p>
                <button
                  onClick={() => handleBookNow(mentor)}
                  className="btn-primary"
                >
                  Book a Session
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MentorProfile;
