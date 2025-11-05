import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";

import Home from "./pages/Home";
import EventsList from "./pages/EventsList";
import CreateEvent from "./pages/CreateEvent";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import OrganizerAnalytics from "./pages/OrganizerAnalytics";
import OrganizerCheckin from "./pages/OrganizerCheckin";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<EventsList />} />
        <Route
          path="/create-event"
          element={
            <ProtectedRoute roles={["organizer"]}>
              <CreateEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer"
          element={
            <ProtectedRoute roles={["organizer"]}>
              <OrganizerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/analytics"
          element={
            <ProtectedRoute roles={["organizer"]}>
              <OrganizerAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/checkin"
          element={
            <ProtectedRoute roles={["organizer"]}>
              <OrganizerCheckin />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}