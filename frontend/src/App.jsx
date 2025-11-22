import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";




import Home from "./pages/Home";
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
import OrganizerApproval from "./pages/OrganizerApproval";
import StudentDashboard from "./pages/StudentDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import StudentTickets from "./pages/StudentTickets";
import EventFeedback from './pages/EventFeedback';
import MyFeedback from "./pages/MyFeedback";

// logout function
function Logout() {
 localStorage.clear();
 toast.info("You have signed out!");
 return <Navigate to="/login" />;
}


// Navigation bar component
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
     {!isLoggedIn && (
       <>
         <Link to="/"> Home</Link> {" "}
         <Link to="/login">Login</Link> {"  "}
         <Link to="/signup">Signup</Link> {"  "}
         <Link to="/events">Events</Link> {"  "}
       </>
     )}


     {isLoggedIn && role === "student" && (
       <>
         <Link to="/student">Student Dashboard</Link> {"  "}
          <Link to="/student/tickets">My Tickets</Link> {"  "}
         <button onClick={handleLogout} className="button-style">Sign Out</button>
       </>
     )}


     {isLoggedIn && role === "organizer" && (
       <>
         <Link to="/organizer">Organizer Dashboard</Link> {"  "}
         <Link to="/organizer/analytics">Analytics</Link> {"  "}
         <Link to="/organizer/checkin">Check-in</Link> {"  "}
         <Link to="/create-event">Create Event</Link> {"  "}
         <button onClick={handleLogout} className="button-style">Sign Out</button>
       </>
     )}


     {isLoggedIn && role === "admin" && (
       <>
         <Link to="/admin">Admin Dashboard</Link> {"  "}
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
       <Route path="/" element={ <PublicRoute> <Home /></PublicRoute>} />
       <Route path="/login" element={ <PublicRoute> <Login /> </PublicRoute>} />
       <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
       <Route path="/logout" element={<Logout />} />


       {/* Public Routes */}
       <Route path="/events" element={<EventsList />} />


       {/* Admin Routes */}
       <Route path="/admin" element={
         <ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>
       } />
       <Route path="/approval" element={
         <ProtectedRoute roles={["admin"]}><OrganizerApproval /></ProtectedRoute>
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

        {/* Student Routes */}
        <Route path="/student" element={
          <ProtectedRoute roles={["student"]}><StudentDashboard /></ProtectedRoute>
        } />
        <Route path="/student/tickets" element={
          <ProtectedRoute roles={["student"]}><StudentTickets /></ProtectedRoute>
        } />

        {/* Event feedback */}
        <Route path="/feedback/:eventId" element={
          <ProtectedRoute roles={["student"]}><EventFeedback /></ProtectedRoute>
        } />
        <Route path="/my-feedback" element={
          <ProtectedRoute roles={["student"]}><MyFeedback /></ProtectedRoute>
        } />


       {/* Catch-all route */}
       <Route path="*" element={<NotFound />} />
     </Routes>
   </BrowserRouter>
 );
}


export default App;