import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { doc, getDoc ,collection ,getDocs } from "firebase/firestore";
import "./ProfilePage.css";
import Heading from "../components/heading";
import Footer from "../components/footer";
import { signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";


export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [bookings, setBookings] = useState([]);
  const [mentorDetails, setMentorDetails] = useState({
    imageUrl: "",
  });

  // Auth check
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    console.log("Authenticated user:", currentUser);
  });

  return () => unsubscribe();
}, []);

  // Fetch profile image URL
  useEffect(() => {
    const fetchMentorDetails = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, "mentors", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setMentorDetails({ imageUrl: data.imageUrl || "" });
        }
      } catch (error) {
        console.error("Error fetching mentor data:", error);
      }
    };
    fetchMentorDetails();
  }, [user]);


useEffect(() => {
  const fetchBookings = async () => {
    if (!user || !user.email) {
      console.warn("No authenticated user or user email found");
      return;
    }

    try {
      // Fetch all bookings from Firestore
      const bookingsSnapshot = await getDocs(collection(db, "bookings"));
      const allBookings = bookingsSnapshot.docs.map(doc => doc.data());

      console.log("✅ All bookings from Firestore:", allBookings);

      // Filter bookings by mentor email
      const filtered = allBookings.filter(b => {
        console.log("🔍 Checking mentor email:", b.email);
        return b.email === user.email;
      });

      console.log("🎯 Filtered bookings for current mentor:", filtered);
      setBookings(filtered);
    } catch (err) {
      console.error("❌ Error fetching bookings:", err);
    }
  };

  fetchBookings();
}, [user]);



  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        localStorage.clear();
        sessionStorage.clear();
        if (window.indexedDB) {
          indexedDB.databases().then((databases) => {
            databases.forEach((db) => {
              indexedDB.deleteDatabase(db.name);
            });
          });
        }
        navigate("/");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  if (!user) {
    return (
      <div className="profile-wrapper">
        <center><h2>Loading profile...</h2></center>
      </div>
    );
  }

  return (
    <div>
      <Heading />
      <div className="profile-wrapper">
        <center><h1>Profile</h1></center>

        <div className="tab-buttons">
          <button
            className={activeTab === "details" ? "active" : ""}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
          <button
            className={activeTab === "booking" ? "active" : ""}
            onClick={() => setActiveTab("booking")}
          >
            Booking
          </button>

          <button
          className={activeTab === "Mentor" ? "active" : ""}
          onClick={() => {
            setActiveTab("Mentor");
            navigate("/mentor-login");
          }}
        >
          Mentor Login
        </button>
        </div>

        {activeTab === "details" && (
          <>
            <div className="profile-info">
              <p><strong>Name:</strong> {user.displayName || "N/A"}</p>
              <p><strong>Email:</strong> {user.email}</p>
              {mentorDetails.imageUrl && (
                <img
                  src={mentorDetails.imageUrl}
                  alt="Profile"
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              )}
            </div>
          </>
        )}

   {activeTab === "booking" && (
  <div className="booking-section">
    <h3>Booking Requests</h3>
    {bookings.length === 0 ? (
      <p>No bookings found.</p>
    ) : (
      <div className="horizontal-booking-container">
        {bookings.map((b, idx) => (
          <div key={idx} className="horizontal-card">
            <div className="card-left">
              <h4>{b.name}</h4>
              <p>{b.email}</p>
              <p>{b.phone}</p>
            </div>
            <div className="card-middle">
              <p><strong>Topic:</strong> {b.topic}</p>
              <p><strong>Date:</strong> {b.date}</p>
              <p><strong>Time:</strong> {b.time}</p>
            </div>
            <div className="card-right">
              <p><strong>Session:</strong> {b.mentor?.sessionTitle || "-"}</p>
              <p className="price-badge"> £{b.mentor?.price || 0}</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}


        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
