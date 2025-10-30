import React from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import EventsList from "./pages/EventsList.jsx";
import CreateEvent from "./pages/CreateEvent.jsx";
import EventDetails from "./pages/EventDetails.jsx";

function Nav() {
  return (
    <nav
      style={{
        padding: "12px 16px",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        gap: "16px",
      }}
    >
      <Link to="/" style={{ textDecoration: "none", fontWeight: 600 }}>
        Home
      </Link>
      <Link to="/events" style={{ textDecoration: "none" }}>
        Browse Events
      </Link>
      <Link to="/create" style={{ textDecoration: "none" }}>
        Create Event
      </Link>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<EventsList />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/create" element={<CreateEvent />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}