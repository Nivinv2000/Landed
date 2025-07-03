import "./footer.css";
import { FaLinkedin, FaInstagram, FaYoutube } from 'react-icons/fa';


export default function Footer() {
  return (
       <footer className="footer">
      <div className="footer-content">
        {/* Brand & Description */}
        <div className="footer-brand">
          <h3>GetLanded</h3>
          <p>Mentorship for students abroad, by students who've done it.</p>
        </div>

        {/* Social Links */}
        <div className="footer-social">
          <h4>CONNECT</h4>
          <div className="social-icons">
            <a href="#" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" aria-label="YouTube">
              <FaYoutube />
            </a>
        </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="footer-subscribe">
          <h4>STAY UPDATED</h4>
          <div className="subscribe-form">
            <input type="email" placeholder="you@example.com" />
            <button className="btn">Subscribe</button>
          </div>
        </div>
      </div>

      <hr />
      <p className="footer-copy">© 2025 GetLanded. All rights reserved.</p>
    </footer>
  );
}
