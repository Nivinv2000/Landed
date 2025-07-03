import React, {useEffect, useState } from "react";
import "./MentorScreen.css";
import Heading from "../components/heading";
import Footer from "../components/footer";
import { FaFilter } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import MentorBookingModal from "../Innerscreen/MentorBookingModal";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // update path if needed





export default function MentorScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
      const navigate = useNavigate();
      const [mentors, setMentors] = useState([]);
  
      useEffect(() => {
        const fetchMentors = async () => {
          try {
            const querySnapshot = await getDocs(collection(db, "mentors_section"));
            const mentorList = querySnapshot.docs
              .map(doc => ({ id: doc.id, ...doc.data() }))
              .filter(mentor => mentor.status === "accepted"); // Filter only accepted mentors
            setMentors(mentorList);
          } catch (error) {
            console.error("Error fetching mentors:", error);
          }
        };

        fetchMentors();
      }, []);



  

  const handleBookClick = (mentor) => {
    setSelectedMentor(mentor);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMentor(null);
  };


  const filteredMentors = mentors.filter((mentor) =>
  mentor.name?.toLowerCase().includes(searchQuery.toLowerCase())
);



  return (
    <div className="mentor-screen">
      <Heading />
      
      <section className="mentor-section">
        <div className="mentor-container">
      <h2 className="mentor-titles">Find Your Mentor</h2>
      <p className="mentor-subtitles">
        Connect with experienced professionals who have successfully navigated international education and careers. 
        Filter by expertise to find the perfect match for your needs.
      </p>

          <input
          type="text"
          className="mentor-search"
          placeholder="Search mentors by name or keyword"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />


              <div className="mentor-filters">
                <span className="filter-label">Search by expertise</span>
              </div>
            </div>

        <div className="mentor-grid">
          {filteredMentors.map((mentor, index) => (
            <div key={mentor.id || index} className="mentor-card">
              <img src={mentor.imageUrl} alt={mentor.name} />
              <h3>{mentor.name}</h3>
              <p className="mentor-role">{mentor.role}</p>
              <p className="mentor-univ">{mentor.university}</p>
              <span className="mentor-price">£{mentor.price} / session</span>
              <div className="mentor-buttons">
                <button onClick={() => navigate("/mentor_profile", { state: { mentor } })} className="btn outline">
                  View Profile
                </button>
                <button className="btn solid" onClick={() => handleBookClick(mentor)}>
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {showModal && selectedMentor && (
      <div className="mentor-modal-overlay" onClick={closeModal}>
        <div className="mentor-modal" onClick={(e) => e.stopPropagation()}>
          <button className="close-button" onClick={closeModal}>×</button>

          {/* Header */}
          <div className="mentor-modal-header">
            <img src={selectedMentor.imageUrl} alt={selectedMentor.name} />
            <div>
              <h2>{selectedMentor.name}</h2>
              <p className="mentor-role">{selectedMentor.role}</p>
              <p className="mentor-univ">{selectedMentor.university}</p>
            </div>
          </div>

          {/* Session Slots */}
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
                      onClick={() => setShowBookingForm(true)}
                    >
                      Book Now
                    </button>
                  </div>
                ))
              ) : (
                <p>No sessions available yet.</p>
              )}
            </div>

            {/* Booking Form Modal */}
            {showBookingForm && (
              <MentorBookingModal
                mentor={selectedMentor}
                onClose={() => setShowBookingForm(false)}
              />
            )}
          </div>
        </div>
      </div>

      )}

      </section>

      <Footer />
    </div>
  );
}
