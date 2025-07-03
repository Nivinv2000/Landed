import "./Faq.css"; // You’ll create this file
import Heading from "../components/heading"; // 
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";

const Faq = () => {
        const navigate = useNavigate();

         
    
  return (
    <div>
        <Heading/>
      <section className="faq-wrapper">
        <div className="faq-container">
            <h2>FAQs</h2>
            <p className="faq-subtitle">
            No scripts. Just real talk. Here’s what most people ask us:
            </p>

            {[
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
            ].map((item, i) => (
            <details key={i} className="faq-card">
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
            </details>
            ))}

            <div className="faq-button">
            <button className="btn"    onClick={() => navigate("/mentors")}>Find Your Mentor Today</button>
            </div>
        </div>
        </section>

    <Footer/>
    </div>
  );
};

export default Faq;
