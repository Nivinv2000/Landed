// src/pages/LandingPage.js
import React, { useEffect, useState, useRef } from "react";
import "./LandingPage.css";
import { Link, useNavigate } from 'react-router-dom';

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

import Heading from "../components/heading";
import Footer from "../components/footer";
import Aurora from "../animation/Aurora";

import { FaPlay, FaPause, FaUserGraduate, FaQuestionCircle, FaArrowRight, FaBookOpen, FaUsers } from 'react-icons/fa';

export default function LandingPage() {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const slideCount = mentors.length;
  const slideWidth = 504;

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "mentor_profile"));
        const mentorList = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(mentor => mentor.Status === "accepted");
        setMentors(mentorList);
      } catch (error) {
        console.error("Error fetching mentors:", error);
      }
    };
    fetchMentors();
  }, []);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.animationPlayState = isPaused ? "paused" : "running";
    }
  }, [isPaused]);

  const handleArrow = (dir) => {
    setIsPaused(true);
    setSlideIndex((prev) => {
      if (dir === "left") return prev === 0 ? slideCount - 1 : prev - 1;
      return prev === slideCount - 1 ? 0 : prev + 1;
    });
  };

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transition = "transform 0.5s ease-in-out";
      sliderRef.current.style.transform = `translateX(-${slideIndex * slideWidth}px)`;
    }
  }, [slideIndex]);

  useEffect(() => {
    if (!isPaused && sliderRef.current) {
      sliderRef.current.style.transition = "";
      sliderRef.current.style.transform = "";
    }
  }, [isPaused]);

  const [openFaq, setOpenFaq] = useState(null);
  const faqs = [
    {
      question: " What even is GetLanded?",
      answer: "GetLanded is a platform where students and professionals can connect with mentors who’ve studied or worked abroad. We help you get honest, real-world advice from those who’ve been in your shoes."
    },
    {
      question: " Who are these mentors?",
      answer: "Our mentors are graduates and working professionals from top universities and companies across the world."
    },
    {
      question: " How do I book a mentor?",
      answer: "Just click on 'Book Now' under any mentor’s profile. You’ll be guided to choose a time slot and complete the booking via our secure platform."
    },
    {
      question: " What's your refund policy?",
      answer: "If you're not satisfied with the session, we offer full refunds within 24 hours of the session. Just contact support."
    },
    {
      question: "⏱ How long are the sessions?",
      answer: "Each session lasts around 45–60 minutes."
    }
  ];

  return (
    <div className="landing-page animated-container">
       
      <Heading />
{/* <Aurora
  colorStops={["#3A29FF", "#FF94B4", "#ADD8E6"]} // Light blue instead of red
  blend={0.5}
  amplitude={1.0}
  speed={0.5}
/> */}

      <section className="hero fade-in">
         
        <h1> Get Unstuck. Land Your Dream.</h1>
        <p>Study abroad. Land a job. Get guidance from students and grads who've been there.</p>
        <div className="button-container">
          <button className="primary-btn" onClick={() => navigate("/mentors")}>
            <FaUsers /> Find a Mentor
          </button>
          <button className="outline-btn" onClick={() => navigate("/mentors")}>
            <FaBookOpen /> How It Works
          </button>
        </div>
      </section>

      <section className="section zoom-in">
        <h2 className="section-title"> Your Next Step Starts Here</h2>
        <img
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
          alt="Mentor group"
          style={{ width: "90%", maxWidth: "900px", marginTop: "20px", borderRadius: "12px" }}
        />
      </section>

      <section className="section mentor-section fade-up">
        <h2 className="section-title"> Meet Our Mentors</h2>
        <p className="mentor-subtitle">Learn from the best who’ve already made it.</p>

        <div
          className="mentor-slider-wrapper"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="mentor-slider" ref={sliderRef}>
            {[...mentors, ...mentors].map((mentor, i) => (
              <div key={mentor.id ? mentor.id + '-' + i : i} className="mentor-card slide-in">
                <img src={mentor.profileImageURL} alt={mentor.fullName} />
                <h3>{mentor.fullName} </h3>
                <p className="mentor-role">{mentor.jobTitle}</p>
                <p className="mentor-univ">{mentor.universityDegree}</p>
                <span className="mentor-price">💷 £{mentor.sessionPrice} / session</span>
                <button className="btn full-width" onClick={() => navigate("/mentors")}>
                  <FaArrowRight /> Book Now
                </button>
              </div>
            ))}
          </div>

          {/* <div className="slider-controls">
            <button className="carousel-pause" onClick={() => setIsPaused((p) => !p)}>
              {isPaused ? <FaPlay /> : <FaPause />}
            </button>
          </div> */}
        </div>
      </section>

      <section className="faq-wrapper fade-in">
        <div className="faq-container">
          <h2> FAQs</h2>
          <p className="faq-subtitle">No scripts. Just real talk. Here’s what most people ask us:</p>

          {faqs.map((item, i) => (
            <div
              key={i}
              className={`faq-card animated-faq ${openFaq === i ? "open" : ""}`}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{ cursor: "pointer" }}
            >
              <summary className="faq-question"><FaQuestionCircle /> {item.question}</summary>
              <div
                className="faq-answer-wrapper"
                style={{
                  maxHeight: openFaq === i ? "200px" : "0px",
                  opacity: openFaq === i ? 1 : 0,
                  transition: "max-height 0.5s ease, opacity 0.4s"
                }}
              >
                <p className="faq-answer">{item.answer}</p>
              </div>
            </div>
          ))}

          <div className="faq-button">
            <button className="btn" onClick={() => navigate("/mentors")}>
               Find Your Mentor Today
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
