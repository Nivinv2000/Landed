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
import SuccessPage from "./page/success";
import CancelPage from "./page/cancel";
import ProblemPage from "./page/problem";
import CommunityPage from "./page/CommunityPage";
import MentorLogin from "./Mentor/MentorLogin";
import SidebarLayout from "./Mentor/SidebarLayout";
import Dashboard from "./Mentor/innerscreen/Dashboard";
import AddSchedulePage from "./Mentor/innerscreen/AddSchedulePage";
import ProfileDetails from "./Mentor/innerscreen/ProfileDetails";
import CheckBookings from "./Mentor/innerscreen/CheckBookings";

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
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<CancelPage />} />
        <Route path="/problem" element={<ProblemPage />} />
        <Route path="/CommunityPage" element={<CommunityPage />} />
        <Route path="/mentor-login" element={<MentorLogin />} />
        <Route path="/dashboard" element={<SidebarLayout />}>
        <Route path="home" element={<Dashboard/>} />
        <Route path="add-schedule" element={<AddSchedulePage />} />
          <Route path="bookings" element={<CheckBookings />} />
           <Route path="profile" element={<ProfileDetails />} /> 
        </Route>




      
      </Routes>
    </Router>
  );
}

export default App;
