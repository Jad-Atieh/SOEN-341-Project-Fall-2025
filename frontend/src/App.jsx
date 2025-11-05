<<<<<<< Updated upstream
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import NotFound from "./pages/NotFound";
import CreateEvent from "./pages/CreateEvent";
import EventsList from "./pages/EventsList";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/organizer" element={<OrganizerDashboard />} />
        <Route path="/events" element={<EventsList />} />
        <Route path="/create-event" element={<CreateEvent />} />
=======
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import EventsList from "./pages/EventsList";
import CreateEvent from "./pages/CreateEvent";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import OrganizerDashboard from "./pages/OrganizerDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: "10px" }}>
        <Link to="/" style={{ marginRight: 16 }}>Home</Link>
        <Link to="/create" style={{ marginRight: 16 }}>Events</Link>
        <Link to="/create-event" style={{ marginRight: 16 }}>Create Event</Link>
        <Link to="/student" style={{ marginRight: 16 }}>Student</Link>
        <Link to="/organizer" style={{ marginRight: 16 }}>Organizer</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/organizer" element={<OrganizerDashboard />} />
        <Route path="/create" element={<EventsList />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/events" element={<Navigate to="/create" replace />} />
>>>>>>> Stashed changes
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}