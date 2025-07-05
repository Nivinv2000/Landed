import React from "react";
import "./ContactPage.css"; // You’ll create this file
import Heading from "../components/heading"; // 
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";


const ContactUs = () => {
      const navigate = useNavigate();
  
  return (
    <div>
        <Heading/>
     <div className="about-container">
      <h2 className="about-title">About Landed</h2>
      <p className="about-subtitle">
        We’re on a mission to make international education and career transitions easier through mentorship.
      </p>

      <div className="mission-section">
        <div className="mission-text">
          <h3>Our Mission</h3>
          <p>
            At Landed, we believe that everyone deserves access to personalized guidance when navigating
            the complex journey of international education and careers.
          </p>
          <p>
            We’re building a community where expertise is shared directly between those who have successfully
            charted these waters and those who are just setting sail.
          </p>
          <p>
            Our platform connects international students and professionals with mentors who have been in their shoes,
            providing advice, strategies, and support that can make all the difference.
          </p>
        </div>

        <div className="mentorship-box">
          <h3>Why Mentorship Matters</h3>
          <ul>
            <li><span>✔</span> Real-world expertise from people who’ve successfully navigated similar paths</li>
            <li><span>✔</span> Personalized guidance tailored to your specific situation and goals</li>
            <li><span>✔</span> Insider knowledge you won’t find in official resources</li>
            <li><span>✔</span> Confidence building through preparation and planning</li>
            <li><span>✔</span> Support network during challenging transitions</li>
          </ul>
        </div>
      </div>

      <div className="community-box">
        <h3>Our Community</h3>
        <div className="community-stats">
          <div>
            <h2>50+</h2>
            <p>Vetted Mentors</p>
          </div>
          <div>
            <h2>20+</h2>
            <p>Countries Represented</p>
          </div>
          <div>
            <h2>200+</h2>
            <p>Successful Sessions</p>
          </div>
        </div>
        <p className="community-subtext">
          Join our growing community of mentors and mentees who are transforming international education and career transitions.
        </p>
      </div>

      <div className="cta-buttons">
        <h3>Ready to Get Started?</h3>
        <div>
          <button className="btn-primary" onClick={() => navigate("/mentors")}>Find a Mentor</button>
          <button className="btn-outline" onClick={() => navigate("/mentors")}>Become a Mentor</button>
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default ContactUs;
