// src/pages/LandingPage.js
import React, { useEffect, useState, useRef } from "react";
import "./LandingPage.css";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";



import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // update path if needed
import Heading from "../components/heading"; // 
import Footer from "../components/footer";

export default function LandingPage() {
    const navigate = useNavigate();
    const [mentors, setMentors] = useState([]);
    const [isPaused, setIsPaused] = useState(false);
    const sliderRef = useRef(null);
    const [slideIndex, setSlideIndex] = useState(0);
    const slideCount = mentors.length;
    const slideWidth = 504; // mentor-card width + gap (480+24)

    // Pause/resume animation by toggling a class
    useEffect(() => {
      if (sliderRef.current) {
        if (isPaused) {
          sliderRef.current.style.animationPlayState = "paused";
        } else {
          sliderRef.current.style.animationPlayState = "running";
        }
      }
    }, [isPaused]);

    // Manual slide (left/right)
    const handleArrow = (dir) => {
      setIsPaused(true);
      setSlideIndex((prev) => {
        if (dir === "left") {
          return prev === 0 ? slideCount - 1 : prev - 1;
        } else {
          return prev === slideCount - 1 ? 0 : prev + 1;
        }
      });
    };

    // Snap to manual slide
    useEffect(() => {
      if (sliderRef.current) {
        sliderRef.current.style.transition = "transform 0.5s cubic-bezier(.4,0,.2,1)";
        sliderRef.current.style.transform = `translateX(-${slideIndex * slideWidth}px)`;
      }
    }, [slideIndex]);

    // Reset transform when unpausing
    useEffect(() => {
      if (!isPaused && sliderRef.current) {
        sliderRef.current.style.transition = "";
        sliderRef.current.style.transform = "";
      }
    }, [isPaused]);

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

  // FAQ animation state
  const [openFaq, setOpenFaq] = useState(null);
  const faqs = [
    {
      question: "What even is GetLanded?",
      answer:
        "GetLanded is a platform where students and professionals can connect with mentors who’ve studied or worked abroad. We help you get honest, real-world advice from those who’ve been in your shoes."
    },
    {
      question: "Who are these mentors?",
      answer:
        "Our mentors are graduates and working professionals from top universities and companies across the world. They've successfully navigated study/work transitions and are here to help you do the same."
    },
    {
      question: "How do I book a mentor?",
      answer:
        "Just click on 'Book Now' under any mentor’s profile. You’ll be guided to choose a time slot and complete the booking via our secure platform."
    },
    {
      question: "What's your refund policy?",
      answer:
        "If you're not satisfied with the session or face any issues, we offer full refunds within 24 hours of the session. Just contact our support team."
    },
    {
      question: "How long are the sessions?",
      answer:
        "Each session lasts around 45–60 minutes. You can use this time to ask about study plans, job tips, visa processes, or anything you need help with."
    }
  ];

  return (
    <div>
    {/* <header>
      <div className="text-blue">Landed</div>
      <nav className="nav-links">
        <a href="#">Home</a>
        <a href="/mentors">Mentors</a>
        <a href="#">Cohorts</a>
        <a href="#">Community</a>
        <a href="#">About</a>
        <a href="#">FAQ</a>
        <button className="btn" style={{ marginLeft: "20px" }}>Find a Mentor</button>
        <button className="btn" style={{ marginLeft: "20px" }}>Admin Login</button>

      </nav>
    </header> */}

    <Heading/>


      <section className="hero">
        <h1 >Talk to someone who's done it.</h1>
        <p>Study abroad. Land a job. Get guidance from students and grads who've been there.</p>
         <div className="button-container">
      <button className="primary-btn">Find a Mentor</button>
      <button className="outline-btn">How It Works</button>
    </div>
      </section>

      <section className="section">
        <h2 className="section-title">Your Next Step Starts Here</h2>
        <img
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
          alt="Mentor group"
          style={{ width: "90%", maxWidth: "900px", marginTop: "20px", borderRadius: "12px" }}
        />
      </section>

      <section className="section mentor-section">
        <h2 className="section-title">Meet Our Mentors</h2>
        <p className="mentor-subtitle">Learn from the best who’ve already made it.</p>

        <div className="mentor-slider-wrapper"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="mentor-slider" ref={sliderRef}>
            {[...mentors, ...mentors].map((mentor, i) => (
              <div key={mentor.id ? mentor.id + '-' + i : i} className="mentor-card">
                <img src={mentor.imageUrl} alt={mentor.name} />
                <h3>{mentor.name}</h3>
                <p className="mentor-role">{mentor.role}</p>
                <p className="mentor-univ">{mentor.university}</p>
                <span className="mentor-price">£{mentor.price} / session</span>
                <button className="btn full-width" onClick={() => navigate("/mentors")}>
                  Book Now
                </button>
              </div>
            ))}
          </div>
          {/* Arrow buttons */}
          {/* <button className="carousel-arrow left" onClick={() => handleArrow("left")}>&lt;</button>
          <button className="carousel-arrow right" onClick={() => handleArrow("right")}>&gt;</button> */}
          {/* Pause/Play button */}
          <br/>
          <br/>
          <br/>
          <button className="carousel-pause" onClick={() => setIsPaused((p) => !p)}>
            {isPaused ? "▶" : "⏸"}
          </button>
        </div>
      </section>




      <section className="faq-wrapper">
  <div className="faq-container">
    <h2>FAQs</h2>
    <p className="faq-subtitle">
      No scripts. Just real talk. Here’s what most people ask us:
    </p>

    {faqs.map((item, i) => (
      <div
        key={i}
        className={`faq-card animated-faq ${openFaq === i ? "open" : ""}`}
        onClick={() => setOpenFaq(openFaq === i ? null : i)}
        style={{ cursor: "pointer" }}
      >
        <summary className="faq-question">{item.question}</summary>
        <div
          className="faq-answer-wrapper"
          style={{
            maxHeight: openFaq === i ? "200px" : "0px",
            opacity: openFaq === i ? 1 : 0,
            transition: "max-height 0.5s cubic-bezier(.4,0,.2,1), opacity 0.4s"
          }}
        >
          <p className="faq-answer">{item.answer}</p>
        </div>
      </div>
    ))}

    <div className="faq-button">
      <button className="btn"    onClick={() => navigate("/mentors")}>Find Your Mentor Today</button>
    </div>
  </div>
</section>



  <Footer/>

    </div>
  );
}
