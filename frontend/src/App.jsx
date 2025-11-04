import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateEvent from "./pages/CreateEvent";

// Pages
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import EventsList from "./pages/EventsList";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import StudentDashboard from "./pages/StudentDashboard";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import OrganizerApproval from "./pages/OraganizerApproval";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

// logout function
function Logout() {
  localStorage.clear();
  toast.info("You have signed out!");
  return <Navigate to="/login" />;
}

function Navbar() {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("access_token");
  const isLoggedIn = !!accessToken;

  // Getting the role
  let role = null;
  if (accessToken) {
    try {
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      role = payload.role;
    } catch (err) {
      console.error("Failed to decode token:", err);
    }
  }

  // Signing out logic
  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    // navigation bar based on user role and login status
    <nav className="navbar">
      <Link to="/">Home</Link> {" "}

      {!isLoggedIn && (
        <>
          <Link to="/login">Login</Link> {"  "}
          <Link to="/signup">Signup</Link> {"  "}
        </>
      )}

      {isLoggedIn && role === "student" && (
        <>
          <Link to="/student">Student Dashboard</Link> {"  "}
          <Link to="/events">Events</Link> {"  "}
          <button onClick={handleLogout} className="button-style">Sign Out</button>
        </>
      )}

      {isLoggedIn && role === "organizer" && (
        <>
          <Link to="/organizer">Organizer Dashboard</Link> {"  "}
          <button onClick={handleLogout} className="button-style">Sign Out</button>
        </>
      )}

      {isLoggedIn && role === "admin" && (
        <>
          <Link to="/admin">Admin Dashboard</Link> {"  "}
          <Link to="/approval">Organizer Approval</Link> {"  "}
          <button onClick={handleLogout} className="button-style">Sign Out</button>
        </>
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
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/create-event" element={<CreateEvent />} />

        <Route path="/admin" element={
          <ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/approval" element={
          <ProtectedRoute roles={["admin"]}><OrganizerApproval/></ProtectedRoute>
        } />

        <Route path="/student" element={
          <ProtectedRoute roles={["student"]}><StudentDashboard /></ProtectedRoute>
        } />

        <Route path="/events" element={
          <ProtectedRoute roles={["student"]}><EventsList /></ProtectedRoute>
        } />

        <Route path="/organizer" element={
          <ProtectedRoute roles={["organizer"]}><OrganizerDashboard /></ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
