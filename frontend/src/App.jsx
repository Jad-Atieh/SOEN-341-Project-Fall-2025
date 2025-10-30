import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import EventsList from "./pages/EventsList";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";

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
  const isLoggedIn = !!localStorage.getItem("access_token");

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <nav className="nav-bar">
      <Link to="/">Home</Link>

      {isLoggedIn ? (
        <>
          <Link to="/events">Events</Link>
          <button onClick={handleLogout} className="logout-btn">Sign Out</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
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
        <Route path="/events" element={<ProtectedRoute><EventsList /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;