import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
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

// Logout function
function Logout() {
  localStorage.clear(); // Clear tokens
  return <Navigate to="/login" />; // Redirect to login
}

function App() {
  return (
    <BrowserRouter>

    <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
          />
      
      <nav>
        <Link to="/"> Return Home</Link>
      </nav>
      <Routes>
        {/* Home page defaults to EventsList for logged-in users */}
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<ProtectedRoute> <EventsList /> </ProtectedRoute>} />

        {/* Authentication routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />

        {/* Admin dashboard (protected) */}
        <Route path="/admin" element={<ProtectedRoute> <AdminDashboard /> </ProtectedRoute>} />

        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
