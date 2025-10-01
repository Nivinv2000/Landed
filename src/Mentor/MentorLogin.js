// import React, { useState } from "react";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../firebase";
// import SidebarLayout from "./SidebarLayout";

// export default function MentorLogin() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loggedIn, setLoggedIn] = useState(false);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const snapshot = await getDocs(collection(db, "mentor_profile"));
//       let found = false;

//       snapshot.forEach((doc) => {
//         const data = doc.data();
//         if (
//           data.username === username.trim() &&
//           data.password === password.trim()
//         ) {
//           found = true;
//           if (data.Status === "accepted") {
//             localStorage.setItem("mentorId", doc.id);
//             localStorage.setItem("mentorName", data.fullName);
//             setLoggedIn(true);
//           } else {
//             setError("Your profile is not approved yet.");
//           }
//         }
//       });

//       if (!found) {
//         setError("Invalid username or password");
//       }
//     } catch (err) {
//       setError("Login failed: " + err.message);
//     }
//   };

//   if (loggedIn) {
//     return <SidebarLayout />;
//   }

//   return (
//     <div style={styles.container}>
//       {/* Left side brand section */}
//       <div style={styles.leftPanel}>
//         <h1 style={styles.brand}>LetLanded Mentor Portal</h1>
//         <p style={styles.tagline}>
//           Empowering mentors to guide, inspire, and shape careers 🌟
//         </p>
//       </div>

//       {/* Right side login form */}
//       <div style={styles.rightPanel}>
//         <form onSubmit={handleLogin} style={styles.form}>
//           <img src="/logo512.png" alt="Logo" style={styles.logo} />
//           <h2 style={styles.heading}>Welcome Back</h2>
//           <p style={styles.subheading}>Sign in to continue mentoring</p>

//           {error && <p style={styles.error}>{error}</p>}

//           <input
//             type="text"
//             placeholder="Enter your username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             style={styles.input}
//             required
//           />
//           <input
//             type="password"
//             placeholder="Enter your password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             style={styles.input}
//             required
//           />

//           <div style={styles.optionsRow}>
//             <label style={styles.rememberMe}>
//               <input type="checkbox" /> Remember me
//             </label>
//             <a href="#" style={styles.forgotLink}>
//               Forgot password?
//             </a>
//           </div>

//           <button type="submit" style={styles.button}>
//             Sign In
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     height: "100vh",
//     display: "flex",
//     fontFamily: "'Segoe UI', sans-serif",
//   },
//   leftPanel: {
//     flex: 1,
//     background: "linear-gradient(135deg, #6c63ff, #42a5f5)",
//     color: "#fff",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: "40px",
//     textAlign: "center",
//   },
//   brand: {
//     fontSize: "32px",
//     fontWeight: "700",
//     marginBottom: "15px",
//   },
//   tagline: {
//     fontSize: "18px",
//     opacity: 0.9,
//     maxWidth: "380px",
//   },
//   rightPanel: {
//     flex: 1,
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     background: "#f9fafc",
//   },
//   form: {
//     background: "rgba(255, 255, 255, 0.8)",
//     backdropFilter: "blur(12px)",
//     padding: "40px 35px",
//     borderRadius: "16px",
//     boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
//     width: "360px",
//     textAlign: "center",
//   },
//   logo: {
//     width: "90px",
//     marginBottom: "10px",
//   },
//   heading: {
//     marginBottom: "5px",
//     fontSize: "24px",
//     color: "#333",
//     fontWeight: "600",
//   },
//   subheading: {
//     marginBottom: "25px",
//     fontSize: "14px",
//     color: "#666",
//   },
//   input: {
//     width: "100%",
//     padding: "12px 15px",
//     margin: "12px 0",
//     borderRadius: "10px",
//     border: "1px solid #ddd",
//     fontSize: "15px",
//     transition: "0.3s",
//     outline: "none",
//   },
//   optionsRow: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: "10px",
//     fontSize: "14px",
//   },
//   rememberMe: {
//     display: "flex",
//     alignItems: "center",
//     gap: "6px",
//     color: "#444",
//   },
//   forgotLink: {
//     color: "#6c63ff",
//     textDecoration: "none",
//     fontWeight: "500",
//   },
//   button: {
//     width: "100%",
//     padding: "12px",
//     marginTop: "20px",
//     backgroundColor: "#6c63ff",
//     color: "#fff",
//     border: "none",
//     borderRadius: "10px",
//     fontSize: "16px",
//     fontWeight: "bold",
//     cursor: "pointer",
//     transition: "all 0.3s ease",
//   },
//   error: {
//     color: "#e74c3c",
//     fontSize: "14px",
//     marginBottom: "10px",
//   },
// };


import React, { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import SidebarLayout from "./SidebarLayout";
import { useNavigate } from "react-router-dom";


export default function MentorLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
   const navigate = useNavigate();

  const goHome = () => {
    navigate("/"); // navigate to home
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const snapshot = await getDocs(collection(db, "mentor_profile"));
      let found = false;

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (
          data.username === username.trim() &&
          data.password === password.trim()
        ) {
          found = true;
          if (data.Status === "accepted") {
            localStorage.setItem("mentorId", doc.id);
            localStorage.setItem("mentorName", data.fullName);
            setLoggedIn(true);
          } else {
            setError("Your profile is not approved yet.");
          }
        }
      });

      if (!found) {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("Login failed: " + err.message);
    }
  };

  if (loggedIn) {
    return <SidebarLayout />;
  }

  return (
    <div style={styles.page}>
      {/* Left panel (branding/illustration) */}
      <div style={styles.leftPanel}>
        <h1 style={styles.brandTitle}>GetLanded Mentor Portal</h1>
        <p style={styles.brandSubtitle}>
          Empower students, shape careers, and grow together 
        </p>
        <img
        src="/logo192.png"
        alt="Mentorship"
        style={styles.illustration}
        onClick={goHome}
      />
      <h1 style={{ cursor: "pointer", fontSize: "24px", fontWeight: "bold",color:"#fff", marginTop:"20px" }}
        onClick={goHome}
      >        GO Back
      </h1>

      </div>

      {/* Right panel (login form) */}
      <div style={styles.rightPanel}>
        <form onSubmit={handleLogin} style={styles.form}>
          <img src="/logo512.png" alt="Logo" style={styles.logo} />
          <h2 style={styles.heading}>Mentor Login</h2>
          {error && <p style={styles.error}>{error}</p>}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            Sign In
          </button>
          <p style={styles.footerText}>
            Need help? <a href="/contact" style={styles.link}>Contact Support</a>
          </p>
        </form>
      </div>
    </div>
  );
}

const styles = {
     illustration: {
      width: "60px",
      cursor: "pointer",
    },
    brandTitle: {
      cursor: "pointer",
      fontSize: "24px",
      fontWeight: "bold",
    },
  page: {
    display: "flex",
    height: "100vh",
    fontFamily: "'Segoe UI', sans-serif",
  },
  leftPanel: {
    flex: 1,
    background: "linear-gradient(135deg, #6c63ff, #42a5f5)",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "50px",
    textAlign: "center",
  },
  brandTitle: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "15px",
  },
  brandSubtitle: {
    fontSize: "16px",
    maxWidth: "400px",
    lineHeight: "1.6",
    marginBottom: "40px",
  },
  illustration: {
    width: "80%",
    maxWidth: "400px",
    borderRadius: "50px",
  },
  rightPanel: {
    flex: 1,
    backgroundColor: "#f9f9fc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    background: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(12px)",
    padding: "40px 35px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    width: "360px",
    textAlign: "center",
    animation: "fadeIn 0.6s ease-in-out",
  },
  logo: {
    width: "80px",
    marginBottom: "12px",
  },
  heading: {
    marginBottom: "20px",
    fontSize: "22px",
    color: "#333",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "15px",
    outline: "none",
    transition: "0.3s",
  },
  button: {
    width: "100%",
    padding: "12px",
    marginTop: "20px",
    backgroundColor: "#6c63ff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
  },
  error: {
    color: "#e74c3c",
    fontSize: "14px",
    marginBottom: "10px",
  },
  footerText: {
    marginTop: "18px",
    fontSize: "13px",
    color: "#555",
  },
  link: {
    color: "#6c63ff",
    fontWeight: "600",
    textDecoration: "none",
  },
};
