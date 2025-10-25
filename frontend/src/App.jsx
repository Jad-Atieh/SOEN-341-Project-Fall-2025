import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import EventsList from "./pages/EventsList.jsx";
import CreateEvent from "./pages/CreateEvent.jsx";
import EventDetails from "./pages/EventDetails.jsx";

function Nav() {
  return (
    <nav style={{ padding: "8px 16px", background: "#0b5bd3" }}>
      <Link to="/" style={{ color: "#fff", marginRight: 16 }}>Home</Link>
      <Link to="/events" style={{ color: "#fff", marginRight: 16 }}>Browse Events</Link>
      <Link to="/create" style={{ color: "#fff" }}>Create Event</Link>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Navigate to="/events" replace />} />
        <Route path="/events" element={<EventsList />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/create" element={<CreateEvent />} />
        <Route path="*" element={<div style={{ padding: 24 }}>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}