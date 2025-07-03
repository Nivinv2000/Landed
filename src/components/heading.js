import { useState, useEffect } from "react";

import "./heading.css";
import { useNavigate  } from "react-router-dom"; // at the top
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signOut
} from "firebase/auth";

export default function Heading() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

const navigate = useNavigate(); // inside component

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  
  const handleClick = () => {
    // Redirect to the home page
    navigate('/');
  };


  const handleAuth = async () => {
    try {
      if (isLoginMode) {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        console.log("Logged in:", userCredential.user);
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        await updateProfile(userCredential.user, {
          displayName: formData.name
        });
        console.log("Signed up:", userCredential.user);
      }

      setIsLoggedIn(true);
      setFormData({ name: "", email: "", password: "" });
      setShowLoginModal(false);
    } catch (error) {
      alert(error.message);
      console.error("Auth Error:", error);
    }
  };

  return (
    <header>
      <div className="header-top">
        <div className="text-blue" onClick={handleClick}   style={{ cursor: 'pointer' }}>Landed</div>
        <div className="hamburger" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>

      <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
        <a href="/">Home</a>
        <a href="/mentors">Mentors</a>
        <a href="/cohorts">Cohorts</a>
        <a href="/contat">About</a>
        <a href="/Faq">FAQ</a>


        {isLoggedIn && (
          <Link to="/BeOurMentor" className="btn nav-btn">
            Be Our Mentor
          </Link>
        )}

       

        {!isLoggedIn ? (
          <button className="btn login-toggle" onClick={() => setShowLoginModal(true)}>
            Sign Up / Login
          </button>
        ) : (
              <div
                className="profile-icon"
                title="Profile"
                onClick={() => navigate("/profile")}
              >
                👤
              </div>
        )}
      </nav>

      {showLoginModal && (
        <div className="login-modal-overlay">
          <div className="login-modal">
            <button className="close-btn" onClick={() => setShowLoginModal(false)}>×</button>

            <div className="login-content">
              <div className="login-left">
                <h2>{isLoginMode ? "Welcome Back to" : "Join"} <br />Skillshare</h2>
                <div className="green-line"></div>
                <p>{isLoginMode ? "Sign in to continue to your account." : "Create an account to get started."}</p>
              </div>

              <div className="login-right">
                      <Link
                to="/AdminLogin"
                className="btn nav-btn"
                style={{ marginBottom: "20px", width: "100%", textAlign: "center",textdecuration: "none" }}
              >
                Admin Login
              </Link>

                <div className="divider">
                  <hr />
                  <span>or</span>
                  <hr />
                </div>

                {!isLoginMode && (
                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="login-input"
                  />
                )}

                <input
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="login-input"
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="login-input"
                />

                {isLoginMode && (
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    Keep me signed in until I sign out
                  </label>
                )}

                <button className="sign-in-btn" onClick={handleAuth}>
                  {isLoginMode ? "Sign In" : "Sign Up"}
                </button>

                <p className="signup-text">
                  {isLoginMode ? "Not a member yet?" : "Already have an account?"}
                  <span
                    className="signup-link"
                    onClick={() => setIsLoginMode(!isLoginMode)}
                  >
                    {isLoginMode ? " Sign Up." : " Log In."}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
