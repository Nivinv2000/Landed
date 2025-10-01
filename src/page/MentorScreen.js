import React, { useEffect, useState } from "react";
import "./MentorScreen.css";
import Heading from "../components/heading";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { FaUserGraduate, FaGlobe, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import MentorBookingModal from "../Innerscreen/MentorBookingModal";

export default function MentorScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMentor, setSelectedMentor] = useState(null); // mentor profile
  const [mentorSessions, setMentorSessions] = useState(null); // data from mentors_section
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [mentors, setMentors] = useState([]);

  const [experienceFilter, setExperienceFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [expertiseFilter, setExpertiseFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const navigate = useNavigate();

  // ✅ Fetch mentors from mentor_profile
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "mentor_profile"));
        const mentorList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMentors(mentorList);
      } catch (error) {
        console.error("Error fetching mentors:", error);
      }
    };

    fetchMentors();
  }, []);

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch = mentor.fullName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesExperience =
      experienceFilter === "" || mentor.experience >= parseInt(experienceFilter);
    const matchesLanguage =
      languageFilter === "" ||
      mentor.languages?.toLowerCase().includes(languageFilter.toLowerCase());
    const matchesExpertise =
      expertiseFilter === "" ||
      mentor.jobTitle?.toLowerCase().includes(expertiseFilter.toLowerCase());
    const matchesLocation =
      locationFilter === "" ||
      mentor.location?.toLowerCase().includes(locationFilter.toLowerCase());

    return (
      matchesSearch &&
      matchesExperience &&
      matchesLanguage &&
      matchesExpertise &&
      matchesLocation
    );
  });

  // ✅ When clicking "Book Now", fetch sessions for that mentor from mentors_section
  const handleBookNow = async (mentorProfile) => {
    setSelectedMentor(mentorProfile);
    setSelectedSlot(null);
    setMentorSessions(null);

    try {
      const q = query(
        collection(db, "mentors_section"),
        where("mentorId", "==", mentorProfile.id)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        // Take the first mentors_section doc for this mentor
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

  const handleSlotBooking = (slot) => {
    setSelectedSlot(slot);
  };

  const handleCloseModal = () => {
    setSelectedMentor(null);
    setSelectedSlot(null);
    setMentorSessions(null);
  };

  return (
    <div className="mentor-screen">
      <Heading />

      <section className="mentor-section">
        <motion.div
          className="mentor-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mentor-titles">Find Your Mentor</h2>
          <p className="mentor-subtitles">
            Connect with experienced professionals who have successfully navigated
            international education and careers. Filter by expertise to find the
            perfect match for your needs.
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
              placeholder="Filter by Languages(eg,. English)"
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="mentor-filter-input"
            />

            <input
              type="text"
              placeholder="Filter by Expertise(eg,. AI) "
              value={expertiseFilter}
              onChange={(e) => setExpertiseFilter(e.target.value)}
              className="mentor-filter-input"
            />

            <input
              type="text"
              placeholder="Filter by Location(eg,. London, Liverpool)"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="mentor-filter-input"
            />
          </div>
        </motion.div>

        <div className="mentor-grid">
          {filteredMentors.map((mentor, index) => (
            <motion.div
              key={mentor.id || index}
              className="mentor-card"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <img src={mentor.profileImageURL} alt={mentor.fullName} />
              <h3>{mentor.fullName}</h3>
              <p className="mentor-role">
                <FaUserGraduate /> {mentor.jobTitle}
              </p>
              <p className="mentor-univ">
                <FaGlobe /> {mentor.universityDegree}
              </p>
              {mentor.location && (
                <p className="mentor-location">
                  <FaMapMarkerAlt /> {mentor.location}
                </p>
              )}
              <div className="mentor-buttons">
                <button
                  onClick={() => navigate("/mentor_profile", { state: { mentor } })}
                  className="btn outline"
                >
                  View Profile
                </button>
                <button className="btn solid" onClick={() => handleBookNow(mentor)}>
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>

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
                  <p className="mentor-role">
                    <FaUserGraduate /> {selectedMentor.jobTitle}
                  </p>
                  <p className="mentor-univ">
                    <FaGlobe /> {selectedMentor.universityDegree}
                  </p>
                  {selectedMentor.location && (
                    <p className="mentor-location">
                      <FaMapMarkerAlt /> {selectedMentor.location}
                    </p>
                  )}
                </div>
              </div>

              <div className="mentor-session-info">
                <h3>1-on-1 Sessions</h3>
                {mentorSessions?.notAvailable ? (
                  <p>This mentor hasn’t set up sessions yet.</p>
                ) : mentorSessions?.sessionSlots?.length > 0 ? (
                  <div className="session-grid">
                    {mentorSessions.sessionSlots.map((slot, index) => (
                      <div key={index} className="session-card">
                        <h4>
                          {slot.title} - {slot.duration}
                        </h4>
                        <p>{slot.description}</p>
                        <div className="session-details">
                          <span>🕒 {slot.duration}</span>
                          <span>💰 £{slot.price}</span>
                        </div>
                        <button
                          className="session-book"
                          onClick={() => handleSlotBooking(slot)}
                        >
                          Book Now
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Loading sessions...</p>
                )}
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
      </section>

      <Footer />
    </div>
  );
}
