import React from "react";
import EventForm from "../components/EventForm";
import { Link } from "react-router-dom";
import "../styles/Forms.css";
import "../styles/PageStyle.css";

function CreateEvent() {
  return (
    <div className="organizer-dashboard">
      {/* --------- HEADER --------- */}
      <div className="student-header">
        <h1>Create a New Event</h1>
        <p>Fill in the details below to add your event to the campus calendar</p>
      </div>

      {/* --------- NAVIGATION BUTTONS --------- */}
      <div className="page-navigation">
            <Link to="/organizer" className="nav-button inactive">
                Events
              </Link>
              <Link to="/create-event" className="nav-button active">
                Create Event
              </Link>
              <Link to="/organizer/analytics" className="nav-button inactive">
                Analytics
              </Link>
              <Link to="/organizer/checkin" className="nav-button inactive">
                QR Check-in
              </Link>
        </div>

      {/* --------- EVENT FORM --------- */}
      <EventForm />
    </div>
  );
}

export default CreateEvent;
