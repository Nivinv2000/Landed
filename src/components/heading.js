import { useState, useEffect } from "react";
import "./heading.css";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { auth,db  } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";

export default function Heading() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilePicture: null,
    linkedin: "",
    jobTitle: "",
    company: "",
    experience: "",
    university: "",
    fieldsHelp: [],
    shortBio: "",
    whyMentor: "",
    calLink: "",
    sessionPrice: "",
    consent: false,
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleClick = () => {
    navigate('/');
  };

const handleAuth = async () => {
  const {
    email,
    password,
    name,
    profilePicture,
    linkedin,
    jobTitle,
    company,
    experience,
    university,
    fieldsHelp,
    shortBio,
    whyMentor,
    calLink,
    sessionPrice,
    consent,
  } = formData;

  try {
    if (isLoginMode) {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (email === "admin@gmail.com" && password === "12345") {
        navigate("/admin-dashboard");
      } else {
        navigate("/profile");
      }
    } else {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });

      const userId = userCredential.user.uid;

      // Save mentor details to Firestore
      await setDoc(doc(db, "mentors", userId), {
        name,
        email,
        linkedin,
        jobTitle,
        company,
        experience,
        university,
        fieldsHelp,
        shortBio,
        whyMentor,
        calLink,
        sessionPrice,
        consent,
        createdAt: new Date().toISOString()
      });

      navigate("/profile");
    }

    setIsLoggedIn(true);
    setFormData({
      name: "",
      email: "",
      password: "",
      profilePicture: null,
      linkedin: "",
      jobTitle: "",
      company: "",
      experience: "",
      university: "",
      fieldsHelp: [],
      shortBio: "",
      whyMentor: "",
      calLink: "",
      sessionPrice: "",
      consent: false,
    });
    setShowLoginModal(false);
  } catch (error) {
    alert(error.message);
    console.error("Auth Error:", error);
  }
};


  return (
    <header>
      <div className="header-top">
        <div className="text-blue" onClick={handleClick} style={{ cursor: 'pointer' }}>Landed</div>
        <div className="hamburger" onClick={toggleMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>

      <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
        <Link to="/mentors" className={location.pathname === "/mentors" ? "active" : ""}>Mentors</Link>
        <Link to="/cohorts" className={location.pathname === "/cohorts" ? "active" : ""}>Cohorts</Link>
        <Link to="/contat" className={location.pathname === "/contat" ? "active" : ""}>About</Link>
        <Link to="/Faq" className={location.pathname === "/Faq" ? "active" : ""}>FAQ</Link>

        {isLoggedIn && (
          <Link to="/BeOurMentor" className="btn nav-btn" style={{ color: "white" }}>
            Be Our Mentor
          </Link>
        )}

        {!isLoggedIn ? (
          <button className="btn login-toggle" onClick={() => setShowLoginModal(true)}>
            Sign Up / Login
          </button>
        ) : (
          <div className="profile-icon" title="Profile" onClick={() => navigate("/profile")}>👤</div>
        )}
      </nav>

      {showLoginModal && (
        <div className="login-modal-overlay">
          <div className="login-modal">
            <button className="close-btn" onClick={() => setShowLoginModal(false)}>×</button>

            <div className="login-content">
              <div className="login-left">
                <h2>{isLoginMode ? "Welcome Back to" : "Join"} <br />Landed</h2>
                <div className="green-line"></div>
                <p>{isLoginMode ? "Sign in to continue to your account." : "Create an account to get started."}</p>
              </div>

              <div className="login-right">
               {!isLoginMode && (
                <div className="scrollable-form">
                  <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="login-input" />
                  <input type="file" onChange={(e) => setFormData({ ...formData, profilePicture: e.target.files[0] })} className="login-input" />
                  <input type="text" placeholder="LinkedIn URL" value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} className="login-input" />
                  <input type="text" placeholder="Job Title" value={formData.jobTitle} onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })} className="login-input" />
                  <input type="text" placeholder="Company" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="login-input" />
                  <input type="number" placeholder="Years of Experience" value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} className="login-input" />
                  <input type="text" placeholder="University & Degree" value={formData.university} onChange={(e) => setFormData({ ...formData, university: e.target.value })} className="login-input" />
                  
                  <label className="checkbox-label">Fields You Can Help With:</label>
                  {["University/course selection", "Job/Internship applications", "CV/LinkedIn review", "Visa or immigration process", "Prep help", "Industry insights"].map((field) => (
                    <label key={field} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.fieldsHelp.includes(field)}
                        onChange={(e) => {
                          const updatedFields = e.target.checked
                            ? [...formData.fieldsHelp, field]
                            : formData.fieldsHelp.filter((f) => f !== field);
                          setFormData({ ...formData, fieldsHelp: updatedFields });
                        }}
                      />
                      {field}
                    </label>
                  ))}

                  <textarea placeholder="Short Bio (100–200 words)" value={formData.shortBio} onChange={(e) => setFormData({ ...formData, shortBio: e.target.value })} className="login-input" />
                  <textarea placeholder="Why do you mentor? (100–200 words)" value={formData.whyMentor} onChange={(e) => setFormData({ ...formData, whyMentor: e.target.value })} className="login-input" />
                  <input type="text" placeholder="Your Cal.com Link" value={formData.calLink} onChange={(e) => setFormData({ ...formData, calLink: e.target.value })} className="login-input" />
                  <input type="number" placeholder="Session Price (in GBP)" value={formData.sessionPrice} onChange={(e) => setFormData({ ...formData, sessionPrice: e.target.value })} className="login-input" />

                  <label className="checkbox-label">
                    <input type="checkbox" checked={formData.consent} onChange={(e) => setFormData({ ...formData, consent: e.target.checked })} />
                    I confirm that the information provided is accurate and agree to be listed as a mentor.
                  </label>
                </div>
              )}


                <input type="email" placeholder="Email address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="login-input" />
                <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="login-input" />

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
                  <span className="signup-link" onClick={() => setIsLoginMode(!isLoginMode)}>
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
