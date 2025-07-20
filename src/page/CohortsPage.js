import React, { useEffect, useState } from 'react';
import './CohortsPage.css';
import Heading from '../components/heading';
import Footer from '../components/footer';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaCalendarAlt, FaBullseye } from 'react-icons/fa';
import { Link } from 'react-router-dom';



export default function CohortsPage() {
  const [cohorts, setCohorts] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
      // const navigate = useNavigate();
  


 useEffect(() => {
    const fetchAcceptedCohorts = async () => {
      const snapshot = await getDocs(collection(db, "Cohorts"));
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(cohort => cohort.status?.toLowerCase() === "accept");
      setCohorts(data);
    };

    fetchAcceptedCohorts();
  }, []);

  const filteredCohorts = cohorts.filter((cohort) =>
    cohort.cohortTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cohort.mentorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Heading />
      <div className="cohorts-container">
        <div className="cohorts-containern">
          <h2 className="cohorts-title">Explore Live Cohorts</h2>
          <p className="cohorts-subtitle">
            Not every mentor teaches the same. Choose your guide and join a community of
            ambitious professionals working toward their dream careers.
          </p>

          <div className="cohorts-stats">
            <div className="stat">
              <FaUsers className="stat-icon" />
              <span><strong>150+</strong> Active Mentees</span>
            </div>
            <div className="stat">
              <FaCalendarAlt className="stat-icon" />
              <span><strong>8</strong> Cohorts Running</span>
            </div>
            <div className="stat">
              <FaBullseye className="stat-icon" />
              <span><strong>94%</strong> Success Rate</span>
            </div>
          </div>
        </div>

        <div className="active-cohort-wrapper">
      <div className="active-cohort-header">
        <div>
          <h1 className="active-cohort-title">Active Cohorts</h1>
          <p className="active-cohort-subtitle">Real industry pros. Real career playbooks.</p>
        </div>
      </div>

          {/* {filteredCohorts.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#555' }}>No matching cohorts found.</p>
                  ) : (
                    <div className="cohort-list">
                      {filteredCohorts.map((cohort) => (
            <div key={cohort.id} className="cohort-card">
              <div className="cohort-header">
                <span className="status-badge">Active</span>
                <span className="member-count">👥 {cohort.menteesCount || 0}/15</span>
              </div>

              <div className="mentor-info">
                <img src={cohort.imageUrl} alt={cohort.mentorName} className="mentor-avatar" />
                <div>
                  <p className="mentor-name">{cohort.mentorName}</p>
                  <p className="mentor-role">{cohort.mentorRole}</p>
                </div>
              </div>

              <h3 className="cohort-title">{cohort.cohortTitle}</h3>
              <p className="cohort-description">{cohort.description}</p>

              <p className="cohort-dates">📅 {cohort.startDate} - {cohort.endDate}</p>

              <div className="cohort-tags">
                {cohort.tags?.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>

              {/* <button className="view-button">View Cohort</button> */}
              {/* <button onClick={() => navigate("/CohortDetailsPage")} className="view-button">View Cohort</button>
            </div>
          ))} */}

          {/* </div>
        )} */} 


        <div style={{
          textAlign: "center",
          padding: "100px 20px",
          fontSize: "60px",
          fontWeight: "bold",
          color: "#4b5563"
        }}>
          🚀 Coming Soon
        </div>



    </div>
      </div>
      <Footer />
    </div>
  );
}