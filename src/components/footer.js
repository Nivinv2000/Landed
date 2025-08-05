import "./footer.css";
import { FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa';
import { useState } from "react";

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000); // reset after 3s
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Brand */}
        <div className="footer-brand">
          <h3>GetLanded</h3>
          <p>Mentorship for students abroad, by students who've done it.</p>
        </div>

        {/* Social */}
        <div className="footer-social">
          <h4>CONNECT</h4>
          <div className="social-icons">
            <a href="https://www.linkedin.com/company/getlandedio/posts/?feedView=all" aria-label="LinkedIn"><FaLinkedin /></a>
            <a href="https://www.instagram.com/getlanded.io" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://www.instagram.com/getlanded.io" aria-label="YouTube"><FaYoutube /></a>
          </div>
        </div>

        {/* Newsletter */}
        <div className="footer-subscribe">
          <h4>STAY UPDATED</h4>
          <p className="microcopy">Join 2,000+ students learning smarter — not harder.</p>
          <div className="subscribe-form">
            <input type="email" placeholder="you@example.com" />
            <button className="subscribe-btn" onClick={handleSubscribe}>
              {subscribed ? "🎉 You're in!" : "I’m In 🎯"}
            </button>
          </div>
          {subscribed && <div className="emoji-pop">🎉</div>}
        </div>
      </div>

      <hr />
      <p className="footer-copy">© 2025 GetLanded. All rights reserved.</p>
    </footer>
  );
}

