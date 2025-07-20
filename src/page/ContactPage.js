import React from "react";
import "./ContactPage.css";
import Heading from "../components/heading";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserFriends, FaGlobe, FaHandshake } from "react-icons/fa";

const ContactUs = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Heading />

      <motion.div
        className="about-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="about-title"> About Landed</h2>
        <p className="about-subtitle">
          We’re on a mission to make international education and career transitions easier through mentorship. 🚀
        </p>

        <div className="mission-section">
          <motion.div
            className="mission-text"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h3> Our Mission</h3>
            <p>
              At Landed, we believe everyone deserves access to personalized guidance for their international journey.
            </p>
            <p>
              We’re building a community where experience is shared between those who’ve made it and those just starting.
            </p>
            <p>
              Our platform connects students and professionals with mentors for advice, strategy, and support. 🤝
            </p>
          </motion.div>

          <motion.div
            className="mentorship-box"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h3>💡 Why Mentorship Matters</h3>
            <ul>
              <li><span>✔</span> Real-world expertise from those who've walked the path</li>
              <li><span>✔</span> Personalized support for your goals</li>
              <li><span>✔</span> Insider knowledge you won’t find elsewhere </li>
              <li><span>✔</span> Confidence through preparation </li>
              <li><span>✔</span> A support system when you need it most </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          className="community-box"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3>👥 Our Community</h3>
          <div className="community-stats">
            <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
              <h2>50+</h2>
              <p><FaUserFriends /> Vetted Mentors</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
              <h2>20+</h2>
              <p><FaGlobe /> Countries Represented</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
              <h2>200+</h2>
              <p><FaHandshake /> Successful Sessions</p>
            </motion.div>
          </div>
          <p className="community-subtext">
             Join our global network transforming international education and career transitions.
          </p>
        </motion.div>

        <motion.div
          className="cta-buttons"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h3> Ready to Get Started?</h3>
          <div>
            <button className="btn-primary" onClick={() => navigate("/mentors")}>
               Find a Mentor
            </button>
            <button className="btn-outline" onClick={() => navigate("/mentors")}>
               Become a Mentor
            </button>
          </div>
        </motion.div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default ContactUs;
