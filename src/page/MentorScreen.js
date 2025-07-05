import React, { useEffect, useState } from "react";
import "./MentorScreen.css";
import Heading from "../components/heading";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import MentorBookingModal from "../Innerscreen/MentorBookingModal";

export default function MentorScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [mentors, setMentors] = useState([]);
  const [experienceFilter, setExperienceFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [expertiseFilter, setExpertiseFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "mentors_section"));
        const mentorList = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(mentor => mentor.status === "accepted");
        setMentors(mentorList);
      } catch (error) {
        console.error("Error fetching mentors:", error);
      }
    };

    fetchMentors();
  }, []);

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch = mentor.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesExperience = experienceFilter === "" || mentor.experience >= parseInt(experienceFilter);
    const matchesLanguage = languageFilter === "" || mentor.languages?.toLowerCase().includes(languageFilter.toLowerCase());
    const matchesExpertise = expertiseFilter === "" || mentor.helpWith?.toLowerCase().includes(expertiseFilter.toLowerCase());
    const matchesLocation = locationFilter === "" || mentor.location?.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesSearch && matchesExperience && matchesLanguage && matchesExpertise && matchesLocation;
  });

  const handleSlotBooking = (mentor, slot) => {
    setSelectedMentor(mentor);
    setSelectedSlot(slot);
  };

  const handleCloseModal = () => {
    setSelectedMentor(null);
    setSelectedSlot(null);
  };

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
            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="mentor-filter-dropdown"
            >
              <option value="">All Experience</option>
              <option value="1">1+ Years</option>
              <option value="3">3+ Years</option>
              <option value="5">5+ Years</option>
              <option value="7">7+ Years</option>
            </select>

            <input
              type="text"
              placeholder="Filter by Language (e.g. English)"
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="mentor-filter-input"
            />

            <input
              type="text"
              placeholder="Filter by Expertise (e.g. ML, interview)"
              value={expertiseFilter}
              onChange={(e) => setExpertiseFilter(e.target.value)}
              className="mentor-filter-input"
            />

            <input
              type="text"
              placeholder="Filter by Location (e.g. Bangalore)"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="mentor-filter-input"
            />
          </div>
        </div>

        <div className="mentor-grid">
          {filteredMentors.map((mentor, index) => (
            <div key={mentor.id || index} className="mentor-card">
              <img src={mentor.imageUrl} alt={mentor.name} />
              <h3>{mentor.name}</h3>
              <p className="mentor-role">{mentor.role}</p>
              <p className="mentor-univ">{mentor.university}</p>
              {mentor.location && <p className="mentor-location">📍 {mentor.location}</p>}
              <span className="mentor-price">£{mentor.price} / session</span>
              <div className="mentor-buttons">
                <button onClick={() => navigate("/mentor_profile", { state: { mentor } })} className="btn outline">
                  View Profile
                </button>
                <button className="btn solid" onClick={() => setSelectedMentor(mentor)}>
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedMentor && !selectedSlot && (
          <div className="mentor-modal-overlay" onClick={handleCloseModal}>
            <div className="mentor-modal" onClick={(e) => e.stopPropagation()}>
              <button className="close-button" onClick={handleCloseModal}>×</button>

              <div className="mentor-modal-header">
                <img src={selectedMentor.imageUrl} alt={selectedMentor.name} />
                <div>
                  <h2>{selectedMentor.name}</h2>
                  <p className="mentor-role">{selectedMentor.role}</p>
                  <p className="mentor-univ">{selectedMentor.university}</p>
                  {selectedMentor.location && <p className="mentor-location">📍 {selectedMentor.location}</p>}
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
            </div>
          </div>
        )}

        {selectedMentor && selectedSlot && (
          <MentorBookingModal
            mentor={selectedMentor}
            slot={selectedSlot}
            onClose={handleCloseModal}
          />
        )}
      </section>

      <Footer />
    </div>
  );
}
