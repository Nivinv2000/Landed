import React, { useEffect, useState } from "react";
import './MentorProfile.css';
import Footer from '../components/footer';
import Heading from '../components/heading';
import { useLocation, useNavigate } from "react-router-dom";
import MentorBookingModal from "../Innerscreen/MentorBookingModal";
import { FaUserGraduate, FaGlobe, FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa";
import { motion } from "framer-motion";

const MentorProfile = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const mentor = state?.mentor;

    const handleSlotBooking = (mentor, slot) => {
    setSelectedMentor(mentor);
    setSelectedSlot(slot);
  };

  const handleCloseModal = () => {
    setSelectedMentor(null);
    setSelectedSlot(null);
  };


  if (!mentor) {
    return <p style={{ padding: '2rem', textAlign: 'center' }}>No mentor data provided.</p>;
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
            <img src={mentor.imageUrl} alt={mentor.name} className="mentor-img" />
            <h2>{mentor.name}</h2>
            <p className="mentor-title">{mentor.role}</p>
            <span className="mentor-exp">{mentor.experience}+ Years</span>

            <div className="session-card">
              <h4>One-on-one Mentorship</h4>
              <p>{mentor.sessionSlots?.[0]?.description || "30-minute personal session to discuss careers, education, or goals"}</p>
              <h3>£{mentor.price}</h3>
              {/* <small>After payment, you'll be redirected to schedule your session</small> */}
              {/* <button type="button" className="btn-outline full">Ask a Question</button> */}
              <a href={mentor.linkedin} target="_blank" rel="noopener noreferrer">
                <button type="button" className="btn-outline full">LinkedIn Profile</button>
              </a>

              
              <button type="button" className="btn-primary full"   onClick={() => setSelectedMentor(mentor)}>
                📅 Book a Session
              </button>
            </div>

            <div className="mentor-snapshot">
              <h4>Mentor Snapshot</h4>
              <ul>
                <li>🧠 {mentor.experience} years experience</li>
                <li>🎓 {mentor.university}</li>
                <li>🌐 {mentor.languages}</li>
              </ul>
            </div>
          </div>


          {selectedMentor && !selectedSlot && (
          <div className="mentor-modal-overlay" onClick={handleCloseModal}>
            <motion.div
              className="mentor-modal"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <button className="close-button" onClick={handleCloseModal}>×</button>

              <div className="mentor-modal-header">
                <img src={selectedMentor.imageUrl} alt={selectedMentor.name} />
                <div>
                  <h2>{selectedMentor.name}</h2>
                  <p className="mentor-role"><FaUserGraduate /> {selectedMentor.role}</p>
                  <p className="mentor-univ"><FaGlobe /> {selectedMentor.university}</p>
                  {selectedMentor.location && <p className="mentor-location"><FaMapMarkerAlt /> {selectedMentor.location}</p>}
                </div>
              </div>

              <div className="mentor-session-info">
                <h3>1-on-1 Sessions</h3>
                <div className="session-grid">
                  {selectedMentor.sessionSlots?.length > 0 ? (
                    selectedMentor.sessionSlots.map((slot, index) => (
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
                    ))
                  ) : (
                    <p>No sessions available yet.</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}

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
              <p>{mentor.whyMentor}</p>
            </div>

            <div className="mentor-section">
              <h3>🛠️ What I Can Help With</h3>
              <p>{mentor.helpWith}</p>
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
              {/* <button className="btn-primary full" onClick={() => navigate("/mentors")}>📅 Book a Session</button> */}
              <div className="cta-box">
                <h3>Ready to connect with {mentor.name}?</h3>
                <p>Secure your spot now and get personalized guidance.</p>
                <button onClick={() => setSelectedMentor(mentor)} className="btn-primary">Book a Session</button>
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
