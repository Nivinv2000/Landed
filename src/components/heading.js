import { useState, useEffect } from "react";
import "./heading.css";
import { useNavigate, useLocation, Link } from "react-router-dom";
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
    const { email, password, name } = formData;
    try {
      if (isLoginMode) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        // ✅ Admin check
        if (email === "admin@gmail.com" && password === "12345") {
          navigate("/admin-dashboard");
        } else {
          navigate("/profile"); // normal user
        }
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
          displayName: name
        });
        navigate("/profile");
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
          <Link
            to="/BeOurMentor"
            className="btn nav-btn"
            style={{ color: "white" }}
          >
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
                <h2>{isLoginMode ? "Welcome Back to" : "Join"} <br />Landed</h2>
                <div className="green-line"></div>
                <p>{isLoginMode ? "Sign in to continue to your account." : "Create an account to get started."}</p>
              </div>

              <div className="login-right">
                {/* Admin button removed */}
                {/* <div className="divider">
                  <hr />
                  <span>or</span>
                  <hr />
                </div> */}

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



