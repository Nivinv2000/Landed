import React, { useState } from "react";
import "./Faq.css";
import Heading from "../components/heading";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";

const Faq = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      question: " What even is GetLanded?",
      answer:
        "GetLanded is a platform where students and professionals can connect with mentors who’ve studied or worked abroad. We help you get honest, real-world advice from those who’ve been in your shoes."
    },
    {
      question: " Who are these mentors?",
      answer:
        "Our mentors are graduates and working professionals from top universities and companies across the world. They've successfully navigated study/work transitions and are here to help you do the same."
    },
    {
      question: " How do I book a mentor?",
      answer:
        "Just click on 'Book Now' under any mentor’s profile. You’ll be guided to choose a time slot and complete the booking via our secure platform."
    },
    {
      question: " What's your refund policy?",
      answer:
        "If you're not satisfied with the session or face any issues, we offer full refunds within 24 hours of the session. Just contact our support team."
    },
    {
      question: " How long are the sessions?",
      answer:
        "Each session lasts around 45–60 minutes. You can use this time to ask about study plans, job tips, visa processes, or anything you need help with."
    }
  ];

  return (
    <div>
      <Heading />
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
            <button className="btn" onClick={() => navigate("/mentors")}>
               Find Your Mentor Today
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Faq;
