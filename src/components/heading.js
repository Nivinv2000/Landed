import { useState, useEffect } from "react";
import "./heading.css";
import Modal from 'react-modal';
import { useNavigate, useLocation, Link } from "react-router-dom";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signOut
} from "firebase/auth";
import { sendPasswordResetEmail,GoogleAuthProvider, signInWithPopup  } from "firebase/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { db, storage } from '../firebase'; // your Firebase config
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';



export default function Heading() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showForgotSuccess, setShowForgotSuccess] = useState(false); // optional message
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);


  const navigate = useNavigate();
  const location = useLocation();
const [showMentorModal, setShowMentorModal] = useState(false);

   const [form, setForm] = useState({
    fullName: '',
    jobTitle: '',
    company: '',
    universityDegree: '',
    linkedin: '',
    mentorReason: '',
    sessionPrice: '',
    fieldsHelpWith: [],
    bio:'',
    profileImage: null,
    languages: '',      // NEW
    location: '',       // NEW
    education: '',      // NEW (separate from universityDegree)
    experience: '',     // NEW
  });
  const [loading, setLoading] = useState(false);


  const handleGoogleSignIn = async () => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log("✅ Google sign-in success:", user);

    // Optional: If it's sign-up mode, store user's name or extra info
    if (!isLoginMode) {
      // You can also store additional user data in Firestore here if needed
    }

    setIsLoggedIn(true);
    setFormData({ name: "", email: "", password: "" });
    setShowLoginModal(false);
    navigate("/profile"); // or wherever you want
  } catch (error) {
    console.error("❌ Google Sign-In Error:", error);
    alert("Google Sign-In failed: " + error.message);
  }
};


  const handleCheckbox = (e) => {
    const { value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      fieldsHelpWith: checked
        ? [...prev.fieldsHelpWith, value]
        : prev.fieldsHelpWith.filter((v) => v !== value),
    }));
  };

const handleSubmit = async () => {
  // Validation: check for empty required fields
  if (
    !form.fullName ||
    !form.jobTitle ||
    !form.company ||
    !form.universityDegree ||
    !form.linkedin ||
    form.fieldsHelpWith.length === 0 ||
    !form.mentorReason ||
    !form.sessionPrice ||
    !form.bio||
    !form.profileImage 
  ) {
    alert("⚠️ Please fill all the required fields before submitting.");
    return;
  }

  setLoading(true); // Start loading

  try {
    let imageURL = '';

    // Upload profile image
    if (form.profileImage) {
      const imageRef = ref(storage, `mentor_profiles/${Date.now()}_${form.profileImage.name}`);
      await uploadBytes(imageRef, form.profileImage);
      imageURL = await getDownloadURL(imageRef);
    }

    // Save to Firestore
    await addDoc(collection(db, 'mentor_profile'), {
      fullName: form.fullName,
      jobTitle: form.jobTitle,
      email: auth.currentUser?.email || "", // 
      company: form.company,
      universityDegree: form.universityDegree,
      linkedin: form.linkedin,
      fieldsHelpWith: form.fieldsHelpWith,
      mentorReason: form.mentorReason,
      sessionPrice: form.sessionPrice,
      profileImageURL: imageURL,
      bio:form.bio,
      languages: form.languages,    // NEW
      location: form.location,      // NEW
      education: form.education,    // NEW
      experience: form.experience,  // NEW
      createdAt: new Date(),
      Status: "pending",
    });

alert('✅ Mentor profile submitted successfully! Your details have been sent to the admin for verification. You will be notified once your profile is approved.');
    setShowMentorModal(false);
  } catch (error) {
    console.error("🔥 Error saving mentor profile:", error);
    alert(`❌ Submission failed: ${error.message}`);
  } finally {
    setLoading(false); // Stop loading
  }
};




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


const handleForgotPassword = () => {
  if (!formData.email) {
    alert("Please enter your email address.");
    return;
  }

  sendPasswordResetEmail(auth, formData.email)
    .then(() => {
      setShowForgotSuccess(true);
      alert("Password reset link sent to your email.");
    })
    .catch((error) => {
      console.error("Error sending password reset email:", error);
      alert("Error: " + error.message);
    });
};

  const handleAuth = async () => {
    const { email, password, name } = formData;
    if (email === "admin@gmail.com" && password === "12345") 
          navigate("/admin-dashboard");
    
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
        <div className="text-blue" onClick={handleClick} style={{ cursor: 'pointer' }}>Get Landed</div>
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
          <>
            <Link
              to="/CommunityPage"
              className={location.pathname === "/CommunityPage" ? "active" : ""}
            >
              Community
            </Link>

            <button
          className="btn nav-btn"
          style={{ color: "white" }}
          onClick={() => setShowMentorModal(true)}
        >
          Be Our Mentor
        </button>


        {showMentorModal && (
          <div className="login-modal-overlay">
            <div className="login-modal">
              <button className="close-btn" onClick={() => setShowMentorModal(false)}>×</button>
              <div className="form-container">
                <h2>Become a Mentor</h2>
                <input type="file" onChange={(e) => setForm({ ...form, profileImage: e.target.files[0] })} />
                <input placeholder="Full Name" onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                <input placeholder="Job Title" onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} />
                <input placeholder="Company" onChange={(e) => setForm({ ...form, company: e.target.value })} />
                <input placeholder="Your University & Degree" onChange={(e) => setForm({ ...form, universityDegree: e.target.value })} />
                <input placeholder="Linkedin Profile Link" onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />

        <div className="checkboxes">
          <h3 className="checkbox-title">Fields You Can Help With</h3>

          <label className="checkbox-item">
            <input type="checkbox" value="University/course selection" onChange={handleCheckbox} />
            University/course selection
          </label>
          <label className="checkbox-item">
            <input type="checkbox" value="Job/internship applications" onChange={handleCheckbox} />
            Job/internship applications
          </label>
          <label className="checkbox-item">
            <input type="checkbox" value="CV/LinkedIn review" onChange={handleCheckbox} />
            CV/LinkedIn review
          </label>
          <label className="checkbox-item">
            <input type="checkbox" value="Visa or immigration process" onChange={handleCheckbox} />
            Visa or immigration process
          </label>
          <label className="checkbox-item">
            <input type="checkbox" value="Interview prep" onChange={handleCheckbox} />
            Interview prep
          </label>
          <label className="checkbox-item">
            <input type="checkbox" value="Industry insights" onChange={handleCheckbox} />
            Industry insights
          </label>

        </div>
        <input
          placeholder="Languages (e.g. English, Hindi)"
          onChange={(e) => setForm({ ...form, languages: e.target.value })}
        />

        <input
          placeholder="Location (City, Country)"
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />

        <input
          placeholder="Education (e.g. MBA, PhD, Certifications)"
          onChange={(e) => setForm({ ...form, education: e.target.value })}
        />

       <input
        type="number"
        placeholder="Years of Experience (e.g. 5)"
        min="0"
        step="1"
        value={form.experience}
        onChange={(e) => setForm({ ...form, experience: e.target.value.replace(/\D/, '') })}
      />



        <textarea placeholder="Bio" onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        <textarea placeholder="Why do you mentor?" onChange={(e) => setForm({ ...form, mentorReason: e.target.value })} />
        <input
          type="number"
          placeholder="Your Session Price (GBP)"
          min="0"
          step="1"
          value={form.sessionPrice}
          onChange={(e) =>
            setForm({ ...form, sessionPrice: e.target.value.replace(/\D/, '') })
          }
        />

        <button className="btn nav-btn" style={{ color: "white" }} onClick={handleSubmit}>
              {loading ? (
                <>
                  <span className="spinner" /> Submitting...
                </>
              ) : (
                "Submit"
              )}
        </button>
      </div>
    </div>
  </div>
)}

          </>
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
          <h2 style={{ color: "white" }}>{isLoginMode ? "Welcome Back to" : "Join"} <br />Landed</h2>
          <div className="green-line"></div>
          <p>{isLoginMode ? "Sign in to continue to your account." : "Create an account to get started."}</p>
        </div>

        <div className="login-right">
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

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="login-input"
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {isLoginMode && (
            <>
              <label className="checkbox-label">
                <input type="checkbox" />
                Keep me signed in until I sign out
              </label>

              <p
                className="forgot-password-link"
                onClick={handleForgotPassword}
                style={{ cursor: "pointer", color: "#007bff", marginTop: "8px", fontSize: "14px" }}
              >
                Forgot Password?
              </p>
            </>
          )}

          <button className="sign-in-btn" onClick={handleAuth}>
            {isLoginMode ? "Sign In" : "Sign Up"}
          </button>

          {/* Google Sign-In Button */}
          <div
            className="google-sign-in-btn"
            onClick={handleGoogleSignIn}
            style={{
              marginTop: "12px",
              padding: "10px",
              backgroundColor: "#fff",
              color: "#000",
              border: "1px solid #ccc",
              borderRadius: "4px",
              textAlign: "center",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px"
            }}
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              style={{ width: 20, height: 20 }}
            />
            Continue with Google
          </div>

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




