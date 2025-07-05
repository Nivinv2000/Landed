import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./page/LandingPage";
import MentorScreen from "./page/MentorScreen"; // Your new mentor page
import CohortsPage from "./page/CohortsPage";
import ContactUs from "./page/ContactPage";
import BeOurMentor from "./page/BeOurMentor";
import AdminLogin from "./Admin_Login";
import AdminDashboard from "./Admin/Admin_Dashboard";
import MentorDetailPage from "./Admin/MentorDetailPage";
import CohortDetailPage from "./Admin/CohortDetailPage";
import MentorProfile from "./Innerscreen/MentorProfile";
import CohortDetailsPage from "./Innerscreen/CohortDetailsPage";
import ProfilePage from "./page/ProfilePage";
import Faq from "./page/Faq";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/mentors" element={<MentorScreen />} />
        <Route path="/cohorts" element={<CohortsPage />} />
        <Route path="/contat" element={<ContactUs />} />
        <Route path="/BeOurMentor" element={<BeOurMentor />} />
        <Route path="/AdminLogin" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/mentor/:id" element={<MentorDetailPage />} />
        <Route path="/cohort/:id" element={<CohortDetailPage />} />
        <Route path="/mentor_profile" element={<MentorProfile />} />
        <Route path="/CohortDetailsPage" element={<CohortDetailsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/Faq" element={<Faq />} />





      
      </Routes>
    </Router>
  );
}

export default App;
