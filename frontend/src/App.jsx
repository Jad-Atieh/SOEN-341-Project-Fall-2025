import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import EventsList from "./pages/EventsList";
import EditEvent from "./pages/EditEvent";
import CreateEvent from "./pages/CreateEvent";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import OrganizerAnalytics from "./pages/OrganizerAnalytics";
import OrganizerCheckin from "./pages/OrganizerCheckin";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import StudentTickets from "./pages/StudentTickets";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

// Logout function
function Logout() {
  localStorage.clear();
  toast.info("You have signed out!");
  return <Navigate to="/login" />;
}

// Navbar with dropdown user menu
function Navbar() {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access_token");
  const isLoggedIn = !!accessToken;
  const [dropdownOpen, setDropdownOpen] = useState(false);

  let role = null;
  let name = null;
  let email = null;

  if (accessToken) {
    try {
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      role = payload.role;
      name = payload.name;
      email = payload.email;
    } catch (err) {
      console.error("Failed to decode token:", err);
    }
  }

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <nav className="navbar">

      {isLoggedIn && (
        <div className="navbar-user-dropdown">
          <button
            className="user-icon"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            👤
          </button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <p><strong>{name}</strong></p>
              <p>{email}</p>
              <p>Role: {role}</p>

              

              <button onClick={handleLogout} className="button-style">Sign Out</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />

      <Routes>
        <Route path="/" element={<PublicRoute><EventsList /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/logout" element={<Logout />} />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>
        } />

        {/* Student Routes */}
        <Route path="/student" element={
          <ProtectedRoute roles={["student"]}><StudentDashboard /></ProtectedRoute>
        } />
        <Route path="/student/tickets" element={
          <ProtectedRoute roles={["student"]}><StudentTickets /></ProtectedRoute>
        } />

        {/* Organizer Routes */}
        <Route path="/organizer" element={
          <ProtectedRoute roles={["organizer"]}><OrganizerDashboard /></ProtectedRoute>
        } />
        <Route path="/organizer/analytics" element={
          <ProtectedRoute roles={["organizer"]}><OrganizerAnalytics /></ProtectedRoute>
        } />
        <Route path="/organizer/checkin" element={
          <ProtectedRoute roles={["organizer"]}><OrganizerCheckin /></ProtectedRoute>
        } />

        {/* Shared Routes */}
        <Route path="/create-event" element={
          <ProtectedRoute roles={["organizer", "admin"]}><CreateEvent /></ProtectedRoute>
        } />
        <Route path="/edit-event/:id" element={
          <ProtectedRoute roles={["organizer", "admin"]}><EditEvent /></ProtectedRoute>
        } />

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
